# 🧠 ModelBench - AI Model Comparison Interface

[![TypeScript](https://img.shields.io/badge/TypeScript-65.9%25-blue)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-32.3%25-green)](https://www.python.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.0-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Latest-teal)](https://fastapi.tiangolo.com/)
[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> A modern, responsive web interface for comparing AI language models with advanced text analysis. Compare GPT-4, Claude, Mistral, and Gemini side-by-side with real-time performance metrics.

![ModelBench Interface Preview](https://via.placeholder.com/1200x600/1e293b/60a5fa?text=ModelBench+Interface)

## 🌟 Overview

ModelBench is a high-performance, production-ready platform designed to benchmark and analyze responses from multiple Large Language Models (LLMs) concurrently. This repository contains the **frontend interface** that works seamlessly with the ModelBench FastAPI backend to provide a unified endpoint for evaluating model outputs across quality, performance, and cost metrics.

## 🏗️ Repository Structure

This repository is part of the complete ModelBench ecosystem:

```
ModelBench/
├── modelbench-backend/     # FastAPI backend (Python)
├── modelbench-ui/          # Next.js frontend (This interface)
├── modelbench-docker/      # Docker configurations
└── README.md              # Main project documentation
```

## ✨ Key Features

### 🚀 **Multi-Model Comparison**
- **Concurrent API Calls**: Process requests to multiple LLMs simultaneously using asynchronous architecture
- **Real-time Analysis**: Live performance metrics including latency, token usage, and cost estimation
- **Model Support**: GPT-4, Claude 3.5, Mistral Large, and Gemini 1.5 Pro

### 📊 **Advanced Text Analysis**
- **Sentiment Analysis**: Positive, negative, and neutral classification with confidence scores
- **Toxicity Detection**: AI-powered safety scoring using Detoxify models
- **Readability Assessment**: Flesch reading ease scores with educational level mapping
- **Similarity Comparison**: Cosine similarity analysis against reference models

### 🎨 **Modern Interface**
- **Glassmorphism Design**: Beautiful dark-mode interface with backdrop blur effects
- **Responsive Layout**: Seamless experience across desktop, tablet, and mobile devices
- **Real-time Status**: Live API connection monitoring with visual indicators
- **Industry Templates**: Pre-built prompts for Finance, Healthcare, Manufacturing, and more

### 🔧 **Production Ready**
- **Rate Limiting**: Built-in request throttling and error handling
- **Health Monitoring**: Automatic API status checks and connection recovery
- **Environment Configuration**: Flexible deployment options for development and production
- **Docker Support**: Containerized deployment with docker-compose integration

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **ModelBench API Backend** (from this repository's backend folder)
- Modern web browser with JavaScript enabled

### 1. Clone the Repository

```bash
git clone https://github.com/suliman317/ModelBench.git
cd ModelBench/modelbench-ui
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env.local` file:

```env
# API Backend Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# For production deployment:
# NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

### 4. Start Development Server

```bash
npm run dev
```

🎉 **Frontend available at**: `http://localhost:3000`

## 🐳 Docker Deployment

### Option 1: Full Stack with Docker Compose

From the repository root:

```bash
# Start both backend and frontend
docker-compose up -d

# Backend: http://localhost:8000
# Frontend: http://localhost:3000
```

### Option 2: Frontend Only

```bash
cd modelbench-ui

# Build the container
docker build -t modelbench-frontend .

# Run with backend connection
docker run -d --name modelbench-ui \
  -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:8000 \
  modelbench-frontend
```

## 🔌 API Integration

The frontend communicates with the ModelBench FastAPI backend through these endpoints:

### Health Check
```bash
curl -X GET "http://localhost:8000/health"
```

### Model Comparison
```bash
curl -X POST "http://localhost:8000/compare" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Explain quantum computing in three simple paragraphs.",
    "models": ["openai", "anthropic", "gemini"],
    "reference_model": "openai"
  }'
```

### Expected Response Format
```json
{
  "results": [
    {
      "model": "openai",
      "output": "Quantum computing is a revolutionary approach to computation...",
      "latency_ms": 1247,
      "tokens_used": 156,
      "estimated_cost": 0.0234,
      "analysis": {
        "readability_score": 65.2,
        "sentiment": "neutral",
        "toxicity_score": 0.0123
      }
    },
    {
      "model": "gemini",
      "output": "Quantum computing represents a paradigm shift...",
      "latency_ms": 892,
      "tokens_used": 142,
      "estimated_cost": 0.0189,
      "analysis": {
        "readability_score": 58.7,
        "sentiment": "positive",
        "toxicity_score": 0.0098
      },
      "similarity_to_reference": 0.8234
    }
  ]
}
```

## 🛠️ Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_API_URL` | ModelBench API backend URL | `http://localhost:8000` | ✅ |

### Backend Requirements

Ensure the ModelBench backend is configured with:

- **API Keys**: OpenAI, Anthropic, Mistral, and Gemini API keys
- **CORS Settings**: Allow requests from frontend domain
- **Rate Limiting**: Configured for your usage requirements

## 🚀 Production Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deployment Platforms

**Vercel (Recommended for Frontend):**
```bash
npm install -g vercel
vercel --prod
```

**Self-hosted with PM2:**
```bash
npm run build
pm2 start npm --name "modelbench-ui" -- start
```

**Docker Production:**
```bash
docker build -t modelbench-frontend:prod .
docker run -d -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://your-api-domain.com \
  modelbench-frontend:prod
```

## 🔍 Troubleshooting

### Common Issues

**❌ "Cannot connect to ModelBench API"**
- Verify backend is running: `curl http://localhost:8000/health`
- Check `NEXT_PUBLIC_API_URL` environment variable
- Ensure CORS is configured in the backend

**❌ "Rate limit exceeded"**
- Wait 60 seconds before retrying
- Check backend rate limiting configuration
- Verify API key quotas

**❌ Model API errors**
- Ensure all API keys are set in the backend environment
- Check API key permissions and billing status
- Review backend logs for specific error messages

### Debug Mode

Enable detailed logging:
```env
NODE_ENV=development
NEXT_PUBLIC_DEBUG=true
```

## 📊 Interface Features

### 🎯 **Smart Model Selection**
- Multi-select model comparison
- Reference model for similarity analysis
- Real-time validation and error handling

### 📈 **Performance Metrics**
- **Latency**: Response time in milliseconds
- **Token Usage**: Input and output token counts
- **Cost Estimation**: Per-request pricing based on current API rates

### 🧠 **Text Analysis Dashboard**
- **Sentiment Indicators**: Visual emoji-based sentiment display
- **Safety Scoring**: Color-coded toxicity levels
- **Readability Levels**: Educational grade level assessment
- **Similarity Heatmap**: Visual comparison against reference outputs

### 🏭 **Industry Use Cases**
Pre-configured prompts for:
- **Finance**: Earnings analysis, risk assessment
- **Healthcare**: Clinical documentation, patient communication
- **Manufacturing**: Technical documentation, safety protocols
- **Media**: Content creation, SEO optimization
- **Customer Support**: Response templates, escalation handling

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md).

### Development Setup

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and test thoroughly
4. **Commit with clear messages**: `git commit -m 'Add amazing feature'`
5. **Push to your fork**: `git push origin feature/amazing-feature`
6. **Open a Pull Request** with detailed description

### Code Standards

- **TypeScript**: Strict type checking enabled
- **ESLint**: Airbnb configuration with custom rules
- **Prettier**: Automatic code formatting
- **Testing**: Jest and React Testing Library

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Framework**: [Next.js](https://nextjs.org/) for the React framework
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS
- **Icons**: [Lucide React](https://lucide.dev/) for beautiful icons
- **Animations**: [Framer Motion](https://www.framer.com/motion/) for smooth animations
- **Backend**: [FastAPI](https://fastapi.tiangolo.com/) for the high-performance API

## 🔗 Related Projects

- **[ModelBench Backend](../modelbench-backend/)**: FastAPI backend with LLM integrations
- **[ModelBench Docker](../modelbench-docker/)**: Docker configurations and deployment scripts

---

<div align="center">

**Made with ❤️ by [suliman](https://github.com/suliman317)**

[⭐ Star this repo](https://github.com/suliman317/ModelBench) • [🐛 Report Bug](https://github.com/suliman317/ModelBench/issues) • [💡 Request Feature](https://github.com/suliman317/ModelBench/issues)

</div>
```
