# PRESAGE: Multi-Agent AI Health Prediction System

A sophisticated medical AI system that uses multiple specialized agents to analyze patient health data and generate personalized 90-day prevention plans.

## 🚀 Quick Start

### Option 1: Automated Startup (Recommended)

**Windows (Batch):**
```bash
start-presage.bat
```

**Windows (PowerShell):**
```powershell
.\start-presage.ps1
```

### Option 2: Manual Startup

**Terminal 1 - Start API Backend:**
```bash
uvicorn api.main:app --reload --host 127.0.0.1 --port 8000
```

**Terminal 2 - Start React Frontend:**
```bash
cd client
npm install
npm run dev
```

The system will be available at:
- **React UI**: http://localhost:3000
- **API Backend**: http://127.0.0.1:8000
- **API Docs**: http://127.0.0.1:8000/docs

## 📁 Project Structure

```
presage/
├── core/                           # Core modules
│   ├── llm.py                     # Groq LLM integration
│   ├── patient.py                 # Patient data models
│   └── vector_store.py            # ChromaDB vector store
│
├── agents/                         # Specialized agents
│   ├── data_agent.py              # Data validation & flagging
│   ├── risk_agent.py              # ML-based risk assessment
│   ├── literature_agent.py        # PubMed literature search
│   ├── intervention_agent.py      # 90-day plan generation
│   └── orchestrator.py            # Pipeline coordinator
│
├── api/                            # FastAPI backend
│   └── main.py                    # REST API endpoints
│
├── client/                         # React (Next.js) frontend
│   └── ...                        # Next.js project structure
│
├── data/                           # Data storage
│   └── risk_models/               # Pre-trained ML models
│
├── .env                            # Environment variables (API keys)
├── requirements.txt                # Python dependencies
└── README.md                       # This file
```

## 🔧 Configuration

### Environment Variables

Create or update `.env` file in the root directory:

```
GROQ_API_KEY=your_api_key_here
```

Get your API key from: https://console.groq.com

## 🚨 Troubleshooting

### Timeout Error: "Read timed out (read timeout=45/120)"

**Cause:** API server isn't running or is processing too slowly

**Solution:**
1. Make sure API server is running: `uvicorn api.main:app --reload`
2. Check API health: `curl http://127.0.0.1:8000/health`
3. Check terminal logs for errors
4. Increase timeout in the API client if needed

### Connection Error: "Cannot connect to API server"

**Solution:**
- Ensure FastAPI is running on port 8000
- Check if port 8000 is already in use: `netstat -ano | findstr :8000`
- Try a different port: `uvicorn api.main:app --port 8001`

### Import Errors

**Solution:**
```bash
pip install -r requirements.txt
```

### Groq API Key Error

**Solution:**
1. Verify `.env` file exists in root directory
2. Check that `GROQ_API_KEY=...` is correct
3. Generate a new key at https://console.groq.com

## 📊 Pipeline Overview

The PRESAGE system operates through a coordinated multi-agent pipeline:

1. **Data Agent** → Validates patient metrics and flags abnormalities
2. **Risk Agent** → Predicts disease risk percentages using ML models
3. **Literature Agent** → Searches PubMed for evidence-based interventions
4. **Intervention Agent** → Synthesizes findings into a 90-day plan
5. **Orchestrator** → Coordinates parallel execution and aggregates results

## 🔐 Security

- API keys are stored in `.env` (never commit to Git)
- `.gitignore` prevents accidental exposure
- No sensitive data is logged
- CORS enabled for frontend-backend communication

## 📦 Dependencies

- **groq**: LLM API client
- **fastapi**: Backend framework
- **Next.js/React**: Frontend framework
- **Tailwind CSS**: UI styling
- **scikit-learn**: ML models
- **chromadb**: Vector database
- **pydantic**: Data validation
- **requests**: HTTP client

## 🧪 Testing

Run the orchestrator test:
```bash
python test_orchestrator.py
```

## 📝 API Documentation

Interactive API docs available at:
```
http://127.0.0.1:8000/docs
```

## 🤝 Contributing

To add new agents or features:
1. Add agent to `agents/` folder
2. Implement `run_presage_pipeline()` updates
3. Update API schema if needed
4. Test with `test_orchestrator.py`

## 📄 License

Proprietary Medical AI System

## 🔗 Resources

- [Groq Console](https://console.groq.com)
- [FastAPI Docs](https://fastapi.tiangolo.com)
- [Next.js Docs](https://nextjs.org/docs)
- [ChromaDB Docs](https://docs.trychroma.com)
