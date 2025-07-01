# -*- coding: utf-8 -*-
"""
ModelBench: A Production-Ready Multi-LLM Python API Script

This script implements a fully containerizable, production-ready FastAPI backend
that allows for side-by-side output comparisons from multiple LLMs.

Refactored for improved clarity, robustness, and enterprise-grade practices.
"""

# ==============================================================================
# 🐳 DOCKERFILE
# ==============================================================================
# # Dockerfile for deploying the ModelBench API
#
# # Use a specific, lightweight Python version for security and reproducibility
# FROM python:3.11.9-slim-bookworm as builder
#
# # Set environment variables to prevent bytecode generation and buffer issues
# ENV PYTHONDONTWRITEBYTECODE 1
# ENV PYTHONUNBUFFERED 1
#
# WORKDIR /app
#
# # Install poetry for deterministic dependency management
# RUN pip install poetry==1.8.2
#
# # Copy only dependency files to leverage Docker layer caching
# COPY poetry.lock pyproject.toml /app/
#
# # Install dependencies, excluding development ones
# RUN poetry install --no-root --no-dev
#
# # --- Final Stage ---
# FROM python:3.11.9-slim-bookworm as final
#
# ENV PYTHONDONTWRITEBYTECODE 1
# ENV PYTHONUNBUFFERED 1
#
# WORKDIR /app
#
# # Copy the virtual environment from the builder stage
# COPY --from=builder /app/.venv /.venv
#
# # Add the virtual environment to the system's PATH
# ENV PATH="/app/.venv/bin:$PATH"
#
# # Copy the application code
# COPY modelbench.py .
#
# # Expose the port the app runs on
# EXPOSE 8000
#
# # Run the application using Gunicorn for a production-ready WSGI server
# CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "-w", "4", "modelbench:app", "--bind", "0.0.0.0:8000"]
#

# ==============================================================================
# 📝 PYPROJECT.TOML
# ==============================================================================
# # pyproject.toml (replaces requirements.txt for modern Python projects)
#
# [tool.poetry]
# name = "modelbench"
# version = "1.1.0"
# description = "Multi-LLM Comparison API"
# authors = ["Your Name <you@example.com>"]
#
# [tool.poetry.dependencies]
# python = "^3.11"
# fastapi = "^0.111.0"
# uvicorn = {extras = ["standard"], version = "^0.30.1"}
# gunicorn = "^22.0.0"
# httpx = "^0.27.0"
# python-dotenv = "^1.0.1"
# pydantic = {extras = ["email"], version = "^2.7.4"}
# pydantic-settings = "^2.3.4"
# loguru = "^0.7.2"
# slowapi = "^0.1.9"
#

# ==============================================================================
# 🔑 .ENV.EXAMPLE
# ==============================================================================
# # .env.example - Copy this to .env and fill in your API keys
#
# # Application Settings
# LOG_LEVEL="INFO"
#
# # LLM API Keys
# OPENAI_API_KEY="sk-..."
# ANTHROPIC_API_KEY="sk-ant-..."
# MISTRAL_API_KEY="..."
# GEMINI_API_KEY="..."
#

# ==============================================================================
# 🐍 SCRIPT START
# ==============================================================================

import asyncio
import os
import sys
import time
from typing import List, Optional, Dict, Any, Literal

import httpx
from fastapi import FastAPI, Request, HTTPException, status
from loguru import logger
from pydantic import BaseModel, Field, ValidationError
from pydantic_settings import BaseSettings
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from starlette.middleware.base import BaseHTTPMiddleware

# ==============================================================================
# ⚙️ CONFIGURATION & SETUP
# ==============================================================================

# --- Application Settings using Pydantic-Settings ---
class Settings(BaseSettings):
    """Loads settings from environment variables and .env files."""
    log_level: str = "INFO"
    openai_api_key: Optional[str] = Field(None, alias="OPENAI_API_KEY")
    anthropic_api_key: Optional[str] = Field(None, alias="ANTHROPIC_API_KEY")
    mistral_api_key: Optional[str] = Field(None, alias="MISTRAL_API_KEY")
    gemini_api_key: Optional[str] = Field(None, alias="GEMINI_API_KEY")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

try:
    settings = Settings()
except ValidationError as e:
    logger.critical(f"Configuration error: Missing required environment variables. {e}")
    sys.exit(1)

# --- Logging Setup ---
logger.remove()
logger.add(
    sys.stderr,
    level=settings.log_level.upper(),
    format="{time:YYYY-MM-DD HH:mm:ss.SSS} | {level: <8} | {name}:{function}:{line} - {message}",
    colorize=True,
)
logger.add(
    "modelbench.log",
    level="INFO",
    format="{time} | {level} | {message}",
    rotation="10 MB",
    retention="7 days",
    enqueue=True, # Makes logging non-blocking
    serialize=True, # Structured JSON logs for production
)

# --- API Constants ---
# Prices are illustrative (USD per 1M tokens) and should be updated periodically.
MODEL_CONFIG = {
    "openai": {
        "api_url": "https://api.openai.com/v1/chat/completions",
        "model_name": "gpt-4o",
        "cost": {"input": 5.00, "output": 15.00},
        "api_key": settings.openai_api_key,
    },
    "anthropic": {
        "api_url": "https://api.anthropic.com/v1/messages",
        "model_name": "claude-3-5-sonnet-20240620",
        "cost": {"input": 3.00, "output": 15.00},
        "api_key": settings.anthropic_api_key,
    },
    "mistral": {
        "api_url": "https://api.mistral.ai/v1/chat/completions",
        "model_name": "mistral-large-latest",
        "cost": {"input": 3.00, "output": 9.00},
        "api_key": settings.mistral_api_key,
    },
    "gemini": {
        "api_url": f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key={settings.gemini_api_key}",
        "model_name": "gemini-1.5-pro-latest",
        "cost": {"input": 3.50, "output": 10.50},
        "api_key": settings.gemini_api_key,
    },
}

ModelLiteral = Literal["openai", "anthropic", "mistral", "gemini"]

# --- FastAPI App Initialization ---
limiter = Limiter(key_func=get_remote_address)
app = FastAPI(
    title="ModelBench API",
    description="An enterprise-grade API to compare outputs from multiple LLMs.",
    version="1.1.0",
)
app.state.limiter = limiter
app.add_exception_handler(HTTPException, _rate_limit_exceeded_handler)

# --- Middleware ---
class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        response = await call_next(request)
        process_time = (time.time() - start_time) * 1000
        logger.info(
            "Request processed",
            extra={
                "method": request.method,
                "path": request.url.path,
                "status_code": response.status_code,
                "process_time_ms": round(process_time, 2),
            },
        )
        return response

app.add_middleware(LoggingMiddleware)

# ==============================================================================
# 📦 PYDANTIC MODELS (Data Schemas)
# ==============================================================================

class CompareRequest(BaseModel):
    prompt: str = Field(
        ...,
        min_length=10,
        max_length=5000,
        description="The text prompt to send to the models.",
    )
    models: List[ModelLiteral] = Field(
        ...,
        min_items=1,
        description="A list of models to query.",
    )

    class Config:
        json_schema_extra = {
            "example": {
                "prompt": "Explain the concept of zero-knowledge proofs in simple terms.",
                "models": ["openai", "anthropic"],
            }
        }

class ModelResult(BaseModel):
    model: str
    output: Optional[str] = None
    latency_ms: Optional[int] = None
    tokens_used: Optional[int] = None
    estimated_cost: Optional[float] = None
    error: Optional[str] = None

class CompareResponse(BaseModel):
    results: List[ModelResult]

# ==============================================================================
# 🧠 LLM QUERY FUNCTIONS
# ==============================================================================

def _calculate_cost(model_key: str, input_tokens: int, output_tokens: int) -> float:
    """Calculates the estimated cost of an LLM API call."""
    cost_data = MODEL_CONFIG[model_key]["cost"]
    input_cost = (input_tokens / 1_000_000) * cost_data["input"]
    output_cost = (output_tokens / 1_000_000) * cost_data["output"]
    return round(input_cost + output_cost, 6)

async def _make_request(client: httpx.AsyncClient, model_key: str, **kwargs) -> Dict[str, Any]:
    """A helper function to make asynchronous HTTP requests with timing and error handling."""
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
    """Generic function to query any supported LLM."""
    config = MODEL_CONFIG[model_key]
    if not config.get("api_key"):
        return ModelResult(model=model_key, error=f"{model_key.upper()}_API_KEY not set.")

    headers = {"Content-Type": "application/json"}
    payload = {"messages": [{"role": "user", "content": prompt}], "max_tokens": 1024}

    # Adapt headers and payload for each provider
    if model_key == "openai" or model_key == "mistral":
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
    
    # Adapt response parsing for each provider
    try:
        if model_key in ["openai", "mistral"]:
            usage = data.get("usage", {})
            input_tokens = usage.get("prompt_tokens", 0)
            output_tokens = usage.get("completion_tokens", 0)
            output_text = data["choices"][0]["message"]["content"]
        elif model_key == "anthropic":
            usage = data.get("usage", {})
            input_tokens = usage.get("input_tokens", 0)
            output_tokens = usage.get("output_tokens", 0)
            output_text = data["content"][0]["text"]
        elif model_key == "gemini":
            output_text = data["candidates"][0]["content"]["parts"][0]["text"]
            # Gemini v1 API does not return token count in the response.
            # For accurate costing, a separate `countTokens` call would be needed.
            input_tokens, output_tokens = 0, 0 
        else: # Should not be reached
            return ModelResult(model=model_key, error="Unsupported model key for parsing.")

        total_tokens = input_tokens + output_tokens
        cost = _calculate_cost(model_key, input_tokens, output_tokens) if total_tokens > 0 else None

        return ModelResult(
            model=model_key,
            output=output_text,
            latency_ms=latency,
            tokens_used=total_tokens if total_tokens > 0 else None,
            estimated_cost=cost,
        )
    except (KeyError, IndexError, TypeError) as e:
        error_message = f"Failed to parse API response: {str(e)}"
        logger.error(f"Error parsing {model_key} response: {data} | Exception: {e}")
        return ModelResult(model=model_key, error=error_message)

# ==============================================================================
# 🚀 API ENDPOINT
# ==============================================================================

@app.post("/compare", response_model=CompareResponse, status_code=status.HTTP_200_OK)
@limiter.limit("5/minute")
async def compare_models(request: Request, payload: CompareRequest):
    """
    Accepts a prompt and a list of models, then returns a side-by-side
    comparison of their outputs, including latency and cost metrics.
    """
    logger.info(f"Received comparison request for models: {payload.models}")

    async with httpx.AsyncClient() as client:
        tasks = [query_llm(client, model_name, payload.prompt) for model_name in payload.models]
        results = await asyncio.gather(*tasks)

    return CompareResponse(results=results)

@app.get("/", include_in_schema=False)
async def root():
    return {"message": "ModelBench API is running. See /docs for documentation."}

# ==============================================================================
# ධ MAIN EXECUTION
# ==============================================================================

if __name__ == "__main__":
    logger.info("Starting ModelBench API server with Uvicorn...")
    uvicorn.run(
        "__main__:app",
        host="0.0.0.0",
        port=8000,
        reload=True, # Enable auto-reload for development
        log_level=settings.log_level.lower()
    )