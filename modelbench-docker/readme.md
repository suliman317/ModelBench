# 🧠 ModelBench – Compare the Simulated Mind
# ModelBench ベンチ

[![Python Version](https://img.shields.io/badge/Python-3.13-blue.svg)](https://www.python.org/)
[![Framework](https://img.shields.io/badge/Framework-FastAPI-green.svg)](https://fastapi.tiangolo.com/)
[![Containerization](https://img.shields.io/badge/Container-Docker-blue.svg)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

ModelBench is a high-performance API designed to benchmark and analyze responses from multiple Large Language Models (LLMs) concurrently. It provides a simple, unified endpoint to evaluate model outputs for quality, performance, and cost, making it an essential tool for developers and researchers building with AI.

## ✨ Key Features

* **Concurrent API Calls**: Process requests to multiple LLMs simultaneously using an asynchronous architecture, ensuring fast, side-by-side comparisons.
* **Comprehensive Metrics**: Go beyond just the text output. Get critical performance data including **latency**, **token usage**, and **estimated costs** for every response.
* **In-depth Text Analysis**: Automatically score responses for crucial quality indicators:
    * **Readability**: Flesch reading ease score.
    * **Sentiment**: Positive, negative, or neutral tone analysis.
    * **Toxicity**: Harmful language detection score.
    * **Semantic Similarity**: Compare how close in meaning each response is to a chosen baseline.
* **Enterprise-Grade & Reproducible**: Fully containerized with Docker, featuring rate limiting, structured logging, and a robust design ready for production environments.
* **Supported Models**: Out-of-the-box support for **OpenAI (GPT-4o)**, **Google (Gemini 1.5 Pro)**, **Anthropic (Claude 3.5 Sonnet)**, and **Mistral (Large 2)**.

---

## 🧠 Application Logic: How It Works

ModelBench follows an efficient, parallel workflow to deliver comprehensive results quickly.

`Request -> [Async Fan-Out] -> [Query Models] -> [Gather Responses] -> [Async Analysis] -> [Combine Results] -> Final JSON Response`

1.  **API Request Received**: The process starts with a `POST` request to the `/compare` endpoint containing your `prompt` and a list of `models`.
2.  **Asynchronous Fan-Out**: The application calls all requested model APIs at the same time using `asyncio.gather`. This concurrent approach dramatically reduces the total wait time compared to sequential requests.
3.  **Individual Model Queries**: For each model, the script captures its text **output**, measures **latency**, and calculates the **estimated cost** and **tokens used**. Any errors from a single model are caught gracefully without crashing the entire request.
4.  **Advanced Text Analysis**: Once text outputs are received, the application performs another set of parallel analyses on each response. These CPU-bound tasks are run in a non-blocking thread pool (`asyncio.to_thread`) to calculate readability, sentiment, toxicity, and similarity scores.
5.  **Final Response**: All the collected data—model output, performance stats, and analysis metrics—is aggregated into a single, clean JSON array and returned to the user.

---

## 🛠️ Technology Stack

* **Backend**: **FastAPI** for a high-performance, asynchronous API framework.
* **Web Server**: **Gunicorn** and **Uvicorn** for a production-ready WSGI/ASGI server setup.
* **Containerization**: **Docker** & **Docker Compose** for building and running the application in a reproducible environment.
* **Data Validation**: **Pydantic** for robust request and response data modeling.
* **Text Analysis**:
    * `transformers` for sentiment analysis.
    * `sentence-transformers` for semantic similarity.
    * `detoxify` for toxicity scoring.
    * `textstat` for readability metrics.

---

## 🐋 Prerequisites: Installing Docker

This entire application runs inside **Docker**. You do not need to install Python or any libraries on your computer yourself.

* **What is Docker?** Think of Docker as a mini, self-contained computer that packages the application and all its dependencies into a single "box" called a **container**. This guarantees that the application runs the same way everywhere.
* **Installation**:
    1.  Download and install Docker Desktop from the official website: 🔗 **[https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)**
    2.  After installation, **start the Docker Desktop application**. You must see its whale icon in your menu bar or taskbar for the following steps to work.

---

## 🚀 Installation & Setup

#### Step 1: Clone the Repository
Open your terminal and clone the official repository using `git`.

```bash
git clone [https://github.com/suliman317/ModelBench.git](https://github.com/suliman317/ModelBench.git)
cd ModelBench
```

#### Step 2: Configure API Keys
The application needs your secret API keys to communicate with the different LLM providers.

1.  Make a copy of the `.env.example` file and rename the copy to **`.env`**.
2.  Open the new `.env` file with a text editor.
3.  Replace the placeholder values with your **actual API keys**.

#### Step 3: Build and Run with Docker
This step uses `docker-compose` to automatically build the container and run the application.

1.  From the project's root directory in your terminal, run:
    ```bash
    docker-compose up --build
    ```
2.  **Be Patient!** The first time you run this, it will take several minutes for Docker to download the base Python image and install all the large AI libraries.
3.  Wait for the log message confirming the server is running: `[INFO] Uvicorn running on http://0.0.0.0:8000`.

---

## ⚙️ API Usage

Once the container is running, you can send requests to its endpoints.

### Endpoints

#### `POST /compare`
This is the main endpoint for comparing models.

**Request Body:**

| Field             | Type          | Description                                                                    |
| ----------------- | ------------- | ------------------------------------------------------------------------------ |
| `prompt`          | `string`      | **Required.** The text prompt to send to the models.                           |
| `models`          | `list[string]`| **Required.** A list of models to query. e.g., `["openai", "gemini"]`.         |
| `reference_model` | `string`      | **Optional.** The model to use as a baseline for similarity scoring. Must be in the `models` list. |

**Response Body:**
The API returns a JSON object with a `results` key, which is a list of objects, each containing:

| Field                     | Type          | Description                                       |
| ------------------------- | ------------- | ------------------------------------------------- |
| `model`                   | `string`      | The name of the model.                            |
| `output`                  | `string`      | The text response from the model.                 |
| `latency_ms`              | `integer`     | The API call latency in milliseconds.             |
| `tokens_used`             | `integer`     | The total tokens used (if available).             |
| `estimated_cost`          | `float`       | The estimated cost of the API call in USD.        |
| `analysis`                | `object`      | An object containing the text analysis scores.    |
| `similarity_to_reference` | `float`       | The cosine similarity score to the reference model. |

### Example Request (`curl`)

Open a **new** terminal window and use the following command to test the API.

```bash
curl -X POST "http://localhost:8000/compare" \
-H "Content-Type: application/json" \
-d '{
  "prompt": "Explain the concept of quantum computing in three simple paragraphs.",
  "models": ["openai", "gemini"],
  "reference_model": "openai"
}'
```

#### `GET /health`
A simple health check endpoint to verify that the API is running.

```bash
curl http://localhost:8000/health
```
