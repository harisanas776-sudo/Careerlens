"""
CareerLens AI — Python FastAPI Service
Standalone research backend API server.
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from backend.models import (
    AnalysisRequest, JobComparisonRequest, BenchmarkEvalResponse, ScoreWeights
)
from backend.nlp_pipeline import run_analysis, TAXONOMY
from backend.evaluator import run_evaluation

app = FastAPI(
    title="CareerLens AI API",
    description="Explainable Resume Intelligence & Skill Gap Analyzer Research Backend",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "CareerLens AI Python FastAPI Backend",
        "taxonomy_size": len(TAXONOMY),
        "version": "1.0.0"
    }

@app.post("/api/analyze")
def analyze_endpoint(request: AnalysisRequest):
    try:
        weights_dict = {
            "skill": request.weights.skill if request.weights else 0.35,
            "experience": request.weights.experience if request.weights else 0.25,
            "projects": request.weights.projects if request.weights else 0.20,
            "semantic": request.weights.semantic if request.weights else 0.20,
        }
        res = run_analysis(request.resume_text, request.job_description, weights_dict)
        return {"success": True, "data": res}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/benchmark-eval")
def benchmark_endpoint(threshold: float = 0.50):
    res = run_evaluation(threshold)
    return {"success": True, "eval": res}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
