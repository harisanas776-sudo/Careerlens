# CareerLens AI — Python FastAPI Research Backend

## Final Year B.Tech CSE (AI) Capstone Project

This directory contains the Python FastAPI backend implementation for **CareerLens AI — Explainable Resume Intelligence & Skill Gap Analyzer**.

### Architecture & Capabilities
1. **Deterministic NLP Pipeline (`backend/nlp_pipeline.py`)**:
   - Skill taxonomy extraction with synonym resolution (500+ tech terms).
   - Exact quote evidence extraction linking resume statements to required job criteria.
   - Empirical Claim Audit detecting vague claims vs metric-grounded achievements.
   - ATS structural heuristics (contact fields, section compliance, table/formatting risks).
   - Multi-component score calculation ($w_{\text{skill}} S_{\text{skill}} + w_{\text{exp}} S_{\text{exp}} + w_{\text{proj}} S_{\text{proj}} + w_{\text{sem}} S_{\text{sem}}$).

2. **Empirical Evaluation Module (`backend/evaluator.py`)**:
   - Ground truth labeled benchmark test suite (20 candidate-job pairs).
   - Side-by-side comparison between Lexical Keyword Baseline and Hybrid Semantic matching.
   - Precision, Recall, F1-Score, and Confusion Matrix calculation.

3. **FastAPI Endpoints (`backend/main.py`)**:
   - `POST /api/analyze`: Comprehensive resume vs job analysis.
   - `GET /api/benchmark-eval`: Evaluation metrics across adjustable classification thresholds.
   - `GET /api/health`: Health status and taxonomy metadata.

### How to Run Locally

```bash
# 1. Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r backend/requirements.txt

# 3. Launch FastAPI server
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

### Running Backend Unit Tests
```bash
python3 -m unittest discover -s backend/tests -p "test_*.py"
```
