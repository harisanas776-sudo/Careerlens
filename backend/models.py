"""
CareerLens AI — Pydantic Data Models & Schemas
"""
from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field

class ScoreWeights(BaseModel):
    skill: float = 0.35
    experience: float = 0.25
    projects: float = 0.20
    semantic: float = 0.20

class AnalysisRequest(BaseModel):
    resume_text: str = Field(..., description="Plain extracted text from candidate resume")
    job_description: str = Field(..., description="Target job description posting")
    target_role: Optional[str] = "Target Role"
    weights: Optional[ScoreWeights] = Field(default_factory=ScoreWeights)

class MatchedEvidence(BaseModel):
    skill_id: str
    skill_name: str
    category: str
    evidence_strength: str  # Strong, Moderate, Weak
    supporting_quote: str
    found_in_section: str
    has_metric: bool
    notes: str

class SkillGapItem(BaseModel):
    skill_id: str
    skill_name: str
    category: str
    priority: str  # High, Medium, Low
    reason: str
    mentioned_in_jd_count: int
    recommended_week_in_roadmap: int

class ClaimAuditItem(BaseModel):
    original_text: str
    section: str
    verdict: str
    reason: str
    suggested_rewrite: str
    metrics_present: List[str]

class ScoreBreakdown(BaseModel):
    overall: int
    skill_overlap: int
    experience_evidence: int
    project_relevance: int
    semantic_similarity: int

class AnalysisResponse(BaseModel):
    id: str
    target_role: str
    scores: ScoreBreakdown
    formula_explanation: str
    evidence_table: List[MatchedEvidence]
    skill_gaps: List[SkillGapItem]
    claim_audits: List[ClaimAuditItem]
    counterfactual_coach: List[Dict[str, str]]
    ats_score: int
    ats_verdict: str

class JobComparisonRequest(BaseModel):
    resume_text: str
    jobs: List[Dict[str, str]]
    weights: Optional[ScoreWeights] = Field(default_factory=ScoreWeights)

class BenchmarkEvalResponse(BaseModel):
    threshold: float
    total_samples: int
    keyword_baseline: Dict[str, Any]
    semantic_model: Dict[str, Any]
    f1_delta: float
