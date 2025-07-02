# -*- coding: utf-8 -*-
"""
ModelBench: A Production-Ready Multi-LLM Python API Script

Version 2.0: Includes advanced text analysis (sentiment, toxicity, readability, similarity)
and health check endpoints. Refactored for production-grade performance and stability.
"""

# ==============================================================================
# 🐳 DOCKERFILE (No changes needed from previous version)
# ==============================================================================

# ==============================================================================
# 📝 PYPROJECT.TOML (Updated with new dependencies)
# ==============================================================================
# # pyproject.toml
#
# [tool.poetry]
# name = "modelbench"
# version = "2.0.0"
# description = "Multi-LLM Comparison and Analysis API"
# authors = ["Your Name <you@example.com>"]
#
# [tool.poetry.dependencies]
# python = "^3.11"
# fastapi = "^0.111.0"
# uvicorn = {extras = ["standard"], version = "^0.30.1"}
# gunicorn = "^22.0.0"
# httpx = "^0.27.0"
# pydantic-settings = "^2.3.4"
# loguru = "^0.7.2"
# slowapi = "^0.1.9"
#
# # Added for text analysis
# textstat = "^0.7.3"
# sentence-transformers = "^3.0.1"
# scikit-learn = "^1.5.0"
# detoxify = "^0.5.1"
#
# # Transformers and its dependencies (torch is often required)
# transformers = {version = "^4.42.3", extras = ["torch"]}
# torch = "^2.3.1"
#

# ==============================================================================
# 🔑 .ENV.EXAMPLE (No changes needed)
# ==============================================================================

# ==============================================================================
# 🐍 SCRIPT START
# ==============================================================================

import asyncio
import sys
import time
from contextlib import asynccontextmanager
from typing import List, Optional, Dict, Any, Literal

import httpx
import textstat
from detoxify import Detoxify
from fastapi import FastAPI, Request, HTTPException, status
from loguru import logger
from pydantic import BaseModel, Field, ValidationError
from pydantic_settings import BaseSettings
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from starlette.middleware.base import BaseHTTPMiddleware
from transformers import pipeline

# ==============================================================================
# ⚙️ CONFIGURATION & SETUP
# ==============================================================================

class Settings(BaseSettings):
    log_level: str = "INFO"
    openai_api_key: Optional[str] = Field(None, alias="OPENAI_API_KEY")
    anthropic_api_key: Optional[str] = Field(None, alias="ANTHROPIC_API_KEY")
    mistral_api_key: Optional[str] = Field(None, alias="MISTRAL_API_KEY")
    gemini_api_key: Optional[str] = Field(None, alias="GEMINI_API_KEY")
    class Config:
        env_file = ".env"
        extra = "ignore"

try:
    settings = Settings()
except ValidationError as e:
    logger.critical(f"Configuration error: Missing required environment variables. {e}")
    sys.exit(1)

# Centralized model state
analysis_models = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load analysis models on startup without blocking
    logger.info("Loading analysis models...")
    loop = asyncio.get_event_loop()
    def _load_models():
        analysis_models["sentiment"] = pipeline("sentiment-analysis")
        analysis_models["toxicity"] = Detoxify('original')
        analysis_models["embedding"] = SentenceTransformer('all-MiniLM-L6-v2')
    await loop.run_in_executor(None, _load_models)
    logger.info("Analysis models loaded successfully.")
    yield
    # Clean up resources on shutdown (optional)
    analysis_models.clear()
    logger.info("Cleaned up analysis models.")

logger.remove()
logger.add(sys.stderr, level=settings.log_level.upper(), colorize=True)
logger.add("modelbench.log", level="INFO", rotation="10 MB", serialize=True)

MODEL_CONFIG = { # (Content is the same as before, omitted for brevity)
    "openai": {"api_url": "https://api.openai.com/v1/chat/completions", "model_name": "gpt-4o", "cost": {"input": 5.00, "output": 15.00}, "api_key": settings.openai_api_key},
    "anthropic": {"api_url": "https://api.anthropic.com/v1/messages", "model_name": "claude-3-5-sonnet-20240620", "cost": {"input": 3.00, "output": 15.00}, "api_key": settings.anthropic_api_key},
    "mistral": {"api_url": "https://api.mistral.ai/v1/chat/completions", "model_name": "mistral-large-latest", "cost": {"input": 3.00, "output": 9.00}, "api_key": settings.mistral_api_key},
    "gemini": {"api_url": f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key={settings.gemini_api_key}", "model_name": "gemini-1.5-pro-latest", "cost": {"input": 3.50, "output": 10.50}, "api_key": settings.gemini_api_key},
}
ModelLiteral = Literal["openai", "anthropic", "mistral", "gemini"]

limiter = Limiter(key_func=get_remote_address)
app = FastAPI(
    title="ModelBench API",
    description="An enterprise API to compare and analyze outputs from multiple LLMs.",
    version="2.0.0",
    lifespan=lifespan,
)
app.state.limiter = limiter
app.add_exception_handler(HTTPException, _rate_limit_exceeded_handler)

# --- Middleware (Identical to previous version, omitted for brevity)
class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        response = await call_next(request)
        process_time = (time.time() - start_time) * 1000
        logger.info("Request processed", extra={"method": request.method, "path": request.url.path, "status_code": response.status_code, "process_time_ms": round(process_time, 2)})
        return response
app.add_middleware(LoggingMiddleware)


# ==============================================================================
# 📦 PYDANTIC MODELS (Updated for new features)
# ==============================================================================

class AnalysisMetrics(BaseModel):
    readability_score: float = Field(..., description="Flesch reading ease score. Higher is easier.")
    sentiment: Literal["positive", "negative", "neutral"]
    toxicity_score: float = Field(..., description="Toxicity score from 0.0 to 1.0.")

class CompareRequest(BaseModel):
    prompt: str = Field(..., min_length=10, max_length=5000, description="The text prompt to send to the models.")
    models: List[ModelLiteral] = Field(..., min_items=1, description="A list of models to query.")
    reference_model: Optional[ModelLiteral] = Field(None, description="The model output to use as a baseline for similarity comparison.")

class ModelResult(BaseModel):
    model: str
    output: Optional[str] = None
    latency_ms: Optional[int] = None
    tokens_used: Optional[int] = None
    estimated_cost: Optional[float] = None
    error: Optional[str] = None
    analysis: Optional[AnalysisMetrics] = None
    similarity_to_reference: Optional[float] = None

class CompareResponse(BaseModel):
    results: List[ModelResult]

# ==============================================================================
# 🔬 TEXT ANALYSIS FUNCTIONS (Refactored to be non-blocking)
# ==============================================================================

async def run_analysis(text: str) -> AnalysisMetrics:
    """Runs all text analyses for a given output in a non-blocking way."""
    def _blocking_analysis():
        # Run CPU-bound tasks here
        readability = textstat.flesch_reading_ease(text)
        sentiment_result = analysis_models["sentiment"](text[:512])[0] # Truncate for performance
        toxicity_result = analysis_models["toxicity"].predict(text[:512])
        return {
            "readability_score": round(readability, 2),
            "sentiment": "neutral" if sentiment_result['label'] == 'NEUTRAL' else sentiment_result['label'].lower(),
            "toxicity_score": round(toxicity_result["toxicity"], 4)
        }
    # Run the blocking functions in a separate thread pool
    metrics = await asyncio.to_thread(_blocking_analysis)
    return AnalysisMetrics(**metrics)

async def calculate_similarity(reference: str, candidate: str) -> float:
    """Calculates cosine similarity in a non-blocking way."""
    def _blocking_similarity():
        embeddings = analysis_models["embedding"].encode([reference, candidate])
        return float(cosine_similarity([embeddings[0]], [embeddings[1]])[0][0])
    
    similarity_score = await asyncio.to_thread(_blocking_similarity)
    return round(similarity_score, 4)

# ==============================================================================
# 🧠 LLM QUERY FUNCTIONS (Identical to previous version, omitted for brevity)
# ==============================================================================

def _calculate_cost(model_key: str, input_tokens: int, output_tokens: int) -> float:
    cost_data = MODEL_CONFIG[model_key]["cost"]
    input_cost = (input_tokens / 1_000_000) * cost_data["input"]
    output_cost = (output_tokens / 1_000_000) * cost_data["output"]
    return round(input_cost + output_cost, 6)
async def _make_request(client: httpx.AsyncClient, model_key: str, **kwargs) -> Dict[str, Any]:
    # ... (function content is identical to the previous refactored version)
    start_time = time.perf_counter()
    config = MODEL_CONFIG[model_key]
    try:
        response = await client.post(config["api_url"], **kwargs, timeout=90.0)
        response.raise_for_status()
        latency = int((time.perf_counter() - start_time) * 1000)
        return {"data": response.json(), "latency": latency, "error": None}
    except httpx.HTTPStatusError as e:
        error_message = f"API Error: {e.response.status_code} - {e.response.text}"
        logger.warning(f"{model_key.capitalize()} request failed: {error_message}")
        return {"data": None, "latency": None, "error": error_message}
    except httpx.RequestError as e:
        error_message = f"Request Error: {type(e).__name__}"
        logger.error(f"{model_key.capitalize()} request failed: {error_message}")
        return {"data": None, "latency": None, "error": error_message}
    except Exception as e:
        error_message = f"An unexpected error occurred: {str(e)}"
        logger.exception(f"Unexpected error in {model_key.capitalize()} request")
        return {"data": None, "latency": None, "error": error_message}
async def query_llm(client: httpx.AsyncClient, model_key: ModelLiteral, prompt: str) -> ModelResult:
    # ... (function content is identical to the previous refactored version)
    config = MODEL_CONFIG[model_key]
    if not config.get("api_key"):
        return ModelResult(model=model_key, error=f"{model_key.upper()}_API_KEY not set.")

    headers = {"Content-Type": "application/json"}
    payload = {"messages": [{"role": "user", "content": prompt}], "max_tokens": 1024}

    if model_key in ["openai", "mistral"]:
        headers["Authorization"] = f"Bearer {config['api_key']}"
        payload["model"] = config["model_name"]
    elif model_key == "anthropic":
        headers["x-api-key"] = config["api_key"]
        headers["anthropic-version"] = "2023-06-01"
        payload["model"] = config["model_name"]
    elif model_key == "gemini":
        payload = {"contents": [{"parts": [{"text": prompt}]}]}

    result = await _make_request(client, model_key, headers=headers, json=payload)
    if result["error"]:
        return ModelResult(model=model_key, error=result["error"])

    data, latency = result["data"], result["latency"]
    
    try:
        if model_key in ["openai", "mistral"]:
            usage, output_text = data.get("usage", {}), data["choices"][0]["message"]["content"]
            input_tokens, output_tokens = usage.get("prompt_tokens", 0), usage.get("completion_tokens", 0)
        elif model_key == "anthropic":
            usage, output_text = data.get("usage", {}), data["content"][0]["text"]
            input_tokens, output_tokens = usage.get("input_tokens", 0), usage.get("output_tokens", 0)
        elif model_key == "gemini":
            output_text, input_tokens, output_tokens = data["candidates"][0]["content"]["parts"][0]["text"], 0, 0
        else:
            return ModelResult(model=model_key, error="Unsupported model key for parsing.")

        total_tokens = input_tokens + output_tokens
        cost = _calculate_cost(model_key, input_tokens, output_tokens) if total_tokens > 0 else None
        return ModelResult(model=model_key, output=output_text, latency_ms=latency, tokens_used=total_tokens if total_tokens > 0 else None, estimated_cost=cost)
    except (KeyError, IndexError, TypeError) as e:
        error_message = f"Failed to parse API response: {str(e)}"
        logger.error(f"Error parsing {model_key} response: {data} | Exception: {e}")
        return ModelResult(model=model_key, error=error_message)

# ==============================================================================
# 🚀 API ENDPOINTS (Updated)
# ==============================================================================

@app.post("/compare", response_model=CompareResponse, status_code=status.HTTP_200_OK)
@limiter.limit("5/minute")
async def compare_models(request: Request, payload: CompareRequest):
    """
    Accepts a prompt, runs it through selected LLMs, and returns a side-by-side
    comparison with advanced text analysis metrics.
    """
    logger.info(f"Received comparison request for models: {payload.models}")
    
    # Step 1: Get all LLM outputs concurrently
    async with httpx.AsyncClient() as client:
        llm_tasks = [query_llm(client, model, payload.prompt) for model in payload.models]
        llm_results = await asyncio.gather(*llm_tasks)
    
    # Step 2: Concurrently run analysis on all successful outputs
    analysis_tasks = {}
    for result in llm_results:
        if result.output:
            analysis_tasks[result.model] = run_analysis(result.output)
            
    analysis_results = await asyncio.gather(*analysis_tasks.values())
    analysis_map = dict(zip(analysis_tasks.keys(), analysis_results))

    # Step 3: Find reference output for similarity calculation
    reference_output = None
    if payload.reference_model and payload.reference_model in payload.models:
        for result in llm_results:
            if result.model == payload.reference_model and result.output:
                reference_output = result.output
                break

    # Step 4: Concurrently run similarity calculations if a reference exists
    similarity_tasks = {}
    if reference_output:
        for result in llm_results:
            if result.output and result.model != payload.reference_model:
                similarity_tasks[result.model] = calculate_similarity(reference_output, result.output)
        
        similarity_results = await asyncio.gather(*similarity_tasks.values())
        similarity_map = dict(zip(similarity_tasks.keys(), similarity_results))

    # Step 5: Combine all results
    for result in llm_results:
        if result.model in analysis_map:
            result.analysis = analysis_map[result.model]
        if reference_output and result.model in similarity_map:
            result.similarity_to_reference = similarity_map[result.model]

    return CompareResponse(results=llm_results)

@app.get("/health", status_code=status.HTTP_200_OK)
async def health_check():
    """Provides a simple health check for the API."""
    return {"status": "ok", "message": "ModelBench API is running."}

@app.get("/", include_in_schema=False)
async def root():
    return {"message": "ModelBench API is running. See /docs for documentation."}

# ==============================================================================
# ධ MAIN EXECUTION
# ==============================================================================

if __name__ == "__main__":
    logger.info("Starting ModelBench API server with Uvicorn...")
    uvicorn.run(
        "__main__:app", host="0.0.0.0", port=8000, reload=True,
        log_level=settings.log_level.lower()
    )