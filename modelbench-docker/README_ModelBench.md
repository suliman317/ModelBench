# ModelBench API

ModelBench is a production-ready API that allows you to send a single prompt to multiple Large Language Models (LLMs) simultaneously and get a side-by-side comparison of their responses. It also provides detailed performance and text quality analysis for each output.

This tool is perfect for developers, researchers, and teams looking to evaluate and compare the performance, cost, and quality of different models for specific tasks.

## ⭐ Features

* **Multi-LLM Comparison:** Get simultaneous responses from top models like OpenAI (GPT-4), Google (Gemini), Anthropic (Claude), and Mistral.  
* **Performance Metrics:** Automatically measures and returns latency, estimated cost, and token usage for each API call.  
* **Advanced Text Analysis:** Each model’s output is automatically analyzed for:
    * **Readability:** How easy the text is to understand.  
    * **Sentiment:** Whether the tone is positive, negative, or neutral.  
    * **Toxicity:** A score indicating the presence of harmful language.  
    * **Semantic Similarity:** How similar the outputs are to a chosen reference model.  
* **Production-Ready:** Built with FastAPI and fully containerized with Docker for easy, reliable deployment.  
* **Simple REST Endpoint:** Interact with the entire service through a single, easy-to-use `/compare` API endpoint.

---

## 🐋 Prerequisites: Installing Docker

This entire application runs inside **Docker**. You do not need to install Python or any of the libraries on your computer yourself.

### What is Docker?
Docker packages the app and all its dependencies into a self-contained “container,” ensuring it runs the same way everywhere.

### Installation

1. **Download Docker Desktop** from https://www.docker.com/products/docker-desktop/  
2. **Install** following the on-screen instructions.  
3. **Run Docker Desktop** (look for the whale icon in your system tray).

---

## 🚀 Getting Started

Follow these steps to get the ModelBench API running locally.

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/modelbench.git
cd modelbench
```

> *Replace `your-username/modelbench.git` with your actual repo URL.*

### Step 2: Configure API Keys

1. Copy `.env.example` to `.env`.  
2. Open `.env` in a text editor and set your keys:
   ```dotenv
   OPENAI_API_KEY="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
   ANTHROPIC_API_KEY="sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxx"
   MISTRAL_API_KEY="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
   GEMINI_API_KEY="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
   ```

### Step 3: Build & Run with Docker

```bash
docker-compose up --build
```

> The first build may take a few minutes as dependencies download.

Wait until you see:

```
INFO  Uvicorn running on http://0.0.0.0:8000
```

---

## ⚙️ Usage: Testing the API

### Method 1: `curl`

```bash
curl -X POST "http://localhost:8000/compare" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Explain the concept of quantum computing in three simple paragraphs.",
    "models": ["openai", "gemini"],
    "reference_model": "openai"
  }'
```

### Method 2: Interactive Docs

1. Open http://localhost:8000/docs  
2. Expand **POST /compare**  
3. Click **Try it out**, edit the JSON, then **Execute**  

---

## 📁 Project File Structure

```
modelbench/
├── Dockerfile              # Builds the Docker container
├── docker-compose.yml      # Defines container service
├── requirements.txt        # Python dependencies
├── app/                    # Backend application code
│   ├── main.py             # FastAPI entrypoint
│   ├── api/                # Routes
│   ├── services/           # LLM & metric integrations
│   ├── models/             # Pydantic schemas
│   └── utils/              # Helpers (cost, metrics)
├── .env.example            # Example environment variables
└── README.md               # This file
```

---

## 🛠️ Next Steps & Extensions

- **Prometheus `/metrics` endpoint** for observability  
- **CI/CD pipeline** (e.g., GitHub Actions)  
- **Unit tests** with Pytest  
- **Authentication** and API keys per user  

Feel free to open issues or PRs to improve ModelBench!  
Licensed under the MIT License.