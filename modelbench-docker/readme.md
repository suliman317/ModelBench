# 🧠 ModelBench – Compare the Minds
# ModelBench API

ModelBench is a production-ready API that allows you to send a single prompt to multiple Large Language Models (LLMs) simultaneously and get a side-by-side comparison of their responses. It also provides detailed performance and text quality analysis for each output.

This tool is perfect for developers, researchers, and teams looking to evaluate and compare the performance, cost, and quality of different models for specific tasks.

## ⭐ Features

* **Multi-LLM Comparison:** Get simultaneous responses from top models like OpenAI (GPT-4), Google (Gemini), Anthropic (Claude), and Mistral.
* **Performance Metrics:** Automatically measures and returns latency, estimated cost, and token usage for each API call.
* **Advanced Text Analysis:** Each model's output is automatically analyzed for:
    * **Readability:** How easy the text is to understand.
    * **Sentiment:** Whether the tone is positive, negative, or neutral.
    * **Toxicity:** A score indicating the presence of harmful language.
    * **Semantic Similarity:** How similar the outputs are to a chosen reference model.
* **Production-Ready:** Built with FastAPI and fully containerized with Docker for easy, reliable deployment.
* **Simple REST Endpoint:** Interact with the entire service through a single, easy-to-use `/compare` API endpoint.

---

## 🐋 Prerequisites: Installing Docker

This entire application runs inside **Docker**. You do not need to install Python or any of the libraries on your computer yourself.

#### What is Docker?
Think of Docker as a mini, self-contained computer for our application. It packages the app and all its dependencies (like a specific version of Python, all the required libraries, etc.) into a single "box" called a **container**. This guarantees that the application runs the same way everywhere, regardless of your local machine's setup.

#### Installation
1.  **Download Docker Desktop:** Go to the official Docker website and download the installer for your operating system.
    * 🔗 **[https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)**
2.  **Install the Application:** Follow the installation instructions for your operating system (Mac or Windows).
3.  **Run Docker Desktop:** After installation, **you must start the Docker Desktop application**. You'll know it's running when you see the whale icon in your Mac's menu bar or Windows' taskbar. It must be running for the following steps to work.

---

## 🚀 Getting Started

Follow these steps to get the ModelBench API running on your local machine.

#### Step 1: Get the Project Files
You can either download the project as a ZIP file or use `git` if you have it installed.

```bash
git clone [https://github.com/your-username/modelbench.git](https://github.com/your-username/modelbench.git)
cd modelbench
```
*(Note: Replace `your-username/modelbench.git` with the actual repository URL.)*

#### Step 2: Configure Your API Keys
The application needs your secret API keys to communicate with the different LLM providers.

1.  In the project folder, find the file named `.env.example`.
2.  Make a copy of this file and rename the copy to `.env`.
3.  Open the new `.env` file with a text editor.
4.  Replace the placeholder values (`sk-...`) with your **actual API keys**.

#### Step 3: Build and Run the Application
This step uses `docker-compose`, a tool that comes with Docker Desktop. It reads the `docker-compose.yml` file to automatically build the Docker container and run the application.

1.  Open your terminal and make sure you are in the project directory.
2.  Run the following command:
    ```bash
    docker-compose up --build
    ```
3.  **Be Patient!** The **first time** you run this, it will take several minutes. Docker is downloading the base Python image and all the large AI/ML libraries.
4.  Wait until you see log messages from the application, ending with something like:
    ```
    [INFO] Uvicorn running on [http://0.0.0.0:8000](http://0.0.0.0:8000)
    ```
**Congratulations!** The ModelBench API is now running.

---

## ⚙️ Usage: Interacting with the API

Once the container is running, you can test it. Here are two common methods.

### Method 1: Direct API Call with `curl`

`curl` is a command-line tool for making web requests. It's a great way to quickly test any API.

**Instructions:**
1.  Make sure your Docker container is running.
2.  Open a **new** terminal window.
3.  Copy and paste the following command:

```bash
curl -X POST "http://localhost:8000/compare" \
-H "Content-Type: application/json" \
-d '{
  "prompt": "Explain the concept of quantum computing in three simple paragraphs.",
  "models": ["openai", "gemini"],
  "reference_model": "openai"
}'
```
This command sends a `POST` request to the `/compare` endpoint with your prompt and model choices. The raw JSON response will be printed directly to your terminal.

### Method 2: Using the Python Test Script

For a more reusable and user-friendly test, you can use this Python script.

**Instructions:**

1.  **Save the Script:** Create a new file on your computer named `test_modelbench.py` and save the following code into it.

    ```python
    import requests
    import json

    # The URL of your running ModelBench API
    API_URL = "http://localhost:8000/compare"

    # The data payload for the request
    payload = {
        "prompt": "What are the three most important features of the Python programming language? Explain each one briefly.",
        "models": ["openai", "gemini"],
        "reference_model": "openai"
    }

    def run_test():
        """
        Sends a test request to the ModelBench API and prints the results.
        """
        print(f"▶️  Sending request to {API_URL} for models: {payload['models']}")
        try:
            response = requests.post(API_URL, json=payload, timeout=120)
            response.raise_for_status()
            print("\n✅ Request successful! Here are the results:\n")
            results = response.json().get("results", [])
            for result in results:
                print("─" * 40)
                print(f"🤖 Model:      {result.get('model')}")
                print(f"⏱️ Latency:    {result.get('latency_ms')} ms")
                print(f"💰 Est. Cost:  ${result.get('estimated_cost'):.6f}" if result.get('estimated_cost') is not None else "💰 Est. Cost:  N/A")
                print("\n📝 Output:")
                print(result.get('output'))
                print("─" * 40 + "\n")
        except requests.exceptions.RequestException as e:
            print(f"\n❌ An error occurred: {e}")
            print("Please ensure the ModelBench Docker container is running.")

    if __name__ == "__main__":
        run_test()
    ```

2.  **Install the `requests` Library:** This script requires the `requests` library. If you don't have it installed on your local machine, open a terminal and run:
    ```bash
    pip install requests
    ```

3.  **Run the Test:** Make sure your Docker container is running, then execute the script from your terminal:
    ```bash
    python test_modelbench.py
    ```

The script will print a nicely formatted response from each model, making it easy to read and compare.
