# 🧠 ModelBench – Compare the Minds

ModelBench lets you input a prompt and see how different LLMs respond side-by-side. Great for researchers, devs, and AI enthusiasts.

## ✨ Features

- Prompt any supported model and compare output
- Track latency, cost, and token stats
- Use preset tasks (summarization, code gen, etc.)
- Export side-by-side results

## 📦 Supported Models

| Model | Source | Status |
|-------|--------|--------|
| GPT-4 | OpenAI | ✅ |
| Claude | Anthropic | ✅ |
| Mistral | HuggingFace | ✅ |
| LLaMA | Ollama | ⏳ planned |
| Gemini | Google AI |  ✅ |

## 🚀 Quick Start

```bash
git clone https://github.com/suliman317/modelbench
cd modelbench
docker-compose up --build

