"""
CareerLens AI — Deterministic NLP & Explainable Matching Pipeline
Pure Python implementation of skill taxonomy extraction, evidence citing,
claim audit, and ATS heuristics.
"""
import re
import math
from typing import List, Dict, Tuple, Any

# Curated Technical Taxonomy
TAXONOMY: List[Dict[str, Any]] = [
    {"id": "python", "name": "Python", "category": "AI_ML", "synonyms": ["python3", "py"], "weight": 5},
    {"id": "pytorch", "name": "PyTorch", "category": "AI_ML", "synonyms": ["torch", "torchvision"], "weight": 5},
    {"id": "tensorflow", "name": "TensorFlow", "category": "AI_ML", "synonyms": ["tf", "keras"], "weight": 4},
    {"id": "scikit-learn", "name": "Scikit-Learn", "category": "AI_ML", "synonyms": ["sklearn", "scikit learn"], "weight": 4},
    {"id": "huggingface", "name": "Hugging Face Transformers", "category": "AI_ML", "synonyms": ["hugging face", "transformers", "hf", "bert"], "weight": 5},
    {"id": "opencv", "name": "OpenCV", "category": "AI_ML", "synonyms": ["cv2", "computer vision"], "weight": 4},
    {"id": "docker", "name": "Docker", "category": "DEVOPS", "synonyms": ["containerization", "containers", "dockerfile"], "weight": 5},
    {"id": "kubernetes", "name": "Kubernetes", "category": "DEVOPS", "synonyms": ["k8s", "container orchestration"], "weight": 4},
    {"id": "fastapi", "name": "FastAPI", "category": "BACKEND", "synonyms": ["fast api", "starlette"], "weight": 4},
    {"id": "react", "name": "React", "category": "FRONTEND", "synonyms": ["reactjs", "react.js"], "weight": 5},
    {"id": "typescript", "name": "TypeScript", "category": "FRONTEND", "synonyms": ["ts"], "weight": 5},
    {"id": "sql", "name": "SQL", "category": "DATA_ENG", "synonyms": ["postgresql", "postgres", "mysql", "sqlite"], "weight": 5},
    {"id": "aws", "name": "Amazon Web Services (AWS)", "category": "DEVOPS", "synonyms": ["aws", "s3", "ec2", "sagemaker"], "weight": 4},
    {"id": "git", "name": "Git Version Control", "category": "CORE_CS", "synonyms": ["git", "github", "gitlab"], "weight": 5},
    {"id": "rag", "name": "Retrieval-Augmented Generation (RAG)", "category": "AI_ML", "synonyms": ["rag", "langchain", "llamaindex", "faiss"], "weight": 5},
]

ACTION_VERBS = {
    'built', 'engineered', 'architected', 'developed', 'designed', 'deployed',
    'implemented', 'optimized', 'reduced', 'increased', 'scaled', 'automated',
    'spearheaded', 'orchestrated', 'authored', 'trained', 'evaluated', 'integrated'
}

def tokenize(text: str) -> List[str]:
    cleaned = re.sub(r'[^a-zA-Z0-9+#.\s-]', ' ', text.lower())
    return [w for w in cleaned.split() if len(w) > 1]

def extract_skills(text: str) -> List[Dict[str, Any]]:
    extracted = []
    for item in TAXONOMY:
        names = [item["name"].lower()] + [s.lower() for s in item.get("synonyms", [])]
        count = 0
        for name in names:
            pattern = rf'(?:^|[^a-zA-Z0-9+#]){re.escape(name)}(?:$|[^a-zA-Z0-9+#])'
            matches = re.findall(pattern, text, re.IGNORECASE)
            count += len(matches)
        if count > 0:
            extracted.append({
                "skill": item,
                "count": count
            })
    return extracted

def compute_cosine_similarity(text1: str, text2: str) -> float:
    t1 = tokenize(text1)
    t2 = tokenize(text2)
    if not t1 or not t2:
        return 0.0

    vocab = set(t1).union(set(t2))
    freq1 = {w: t1.count(w) for w in vocab}
    freq2 = {w: t2.count(w) for w in vocab}

    dot = sum(freq1[w] * freq2[w] for w in vocab)
    norm1 = math.sqrt(sum(freq1[w] ** 2 for w in vocab))
    norm2 = math.sqrt(sum(freq2[w] ** 2 for w in vocab))

    if norm1 == 0 or norm2 == 0:
        return 0.0
    return dot / (norm1 * norm2)

def extract_bullets(text: str) -> List[str]:
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    bullets = []
    bullet_re = re.compile(r'^[\u2022\u2023\u25E6\u2043\u2219•\-*]\s*(.+)$')
    for line in lines:
        match = bullet_re.match(line)
        if match:
            bullets.append(match.group(1).strip())
        elif len(line) > 35 and not line.endswith(':'):
            bullets.append(line)
    return bullets

def run_analysis(resume_text: str, jd_text: str, weights: Dict[str, float] = None) -> Dict[str, Any]:
    if weights is None:
        weights = {"skill": 0.35, "experience": 0.25, "projects": 0.20, "semantic": 0.20}

    resume_skills = extract_skills(resume_text)
    jd_skills = extract_skills(jd_text)
    resume_skill_ids = {s["skill"]["id"]: s for s in resume_skills}

    sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+', resume_text) if len(s.strip()) > 15]
    bullets = extract_bullets(resume_text)

    # 1. Evidence Table
    evidence_table = []
    matched_ids = set()

    for item in jd_skills:
        skill = item["skill"]
        if skill["id"] in resume_skill_ids:
            matched_ids.add(skill["id"])
            quote = ""
            has_metric = False

            # Search bullets: prioritize bullets with quantifiable metrics
            candidates = []
            for b in bullets:
                if skill["name"].lower() in b.lower() or any(s.lower() in b.lower() for s in skill["synonyms"]):
                    has_m = bool(re.search(r'(?:\d+(?:\.\d+)?%|\$\d+(?:\.\d+)?|\b\d+(?:,\d+)*\+?\s*(?:users|ms|fps|teams|hours|x|queries|gb|tb|mAP|auc)\b)', b, re.IGNORECASE))
                    candidates.append((b, has_m))

            if candidates:
                best = next((c for c in candidates if c[1]), candidates[0])
                quote = best[0]
                has_metric = best[1]

            if not quote:
                for s in sentences:
                    if skill["name"].lower() in s.lower() or any(syn.lower() in s.lower() for syn in skill["synonyms"]):
                        quote = s
                        break

            if not quote:
                quote = f"Referenced in technical competencies ({skill['name']})"

            strength = "Strong" if has_metric else ("Moderate" if len(quote) > 40 else "Weak")

            evidence_table.append({
                "skill_id": skill["id"],
                "skill_name": skill["name"],
                "category": skill["category"],
                "evidence_strength": strength,
                "supporting_quote": quote,
                "found_in_section": "Experience / Projects",
                "has_metric": has_metric,
                "notes": f"Verified via deterministic lexical citation ({strength} evidence)."
            })

    # 2. Skill Gaps
    skill_gaps = []
    for item in jd_skills:
        skill = item["skill"]
        if skill["id"] not in resume_skill_ids:
            prio = "High" if skill["weight"] >= 5 else ("Medium" if skill["weight"] >= 4 else "Low")
            skill_gaps.append({
                "skill_id": skill["id"],
                "skill_name": skill["name"],
                "category": skill["category"],
                "priority": prio,
                "reason": f"Required in target job description with priority weight {skill['weight']}/5.",
                "mentioned_in_jd_count": item["count"],
                "recommended_week_in_roadmap": 1 if prio == "High" else 2
            })

    # 3. Claim Evidence Checks
    claim_audits = []
    for b in bullets[:10]:
        has_metric = bool(re.search(r'(?:\d+(?:\.\d+)?%|\$\d+(?:\.\d+)?|\b\d+(?:,\d+)*\+?\s*(?:users|ms|fps|teams|hours|x|queries|gb|tb|mAP|auc)\b)', b, re.IGNORECASE))
        if has_metric:
            claim_audits.append({
                "original_text": b,
                "section": "Work History",
                "verdict": "Well Evidenced",
                "reason": "Empirically grounded with quantifiable numbers/percentages.",
                "suggested_rewrite": b,
                "metrics_present": ["Quantifiable empirical evidence detected"]
            })
        else:
            claim_audits.append({
                "original_text": b,
                "section": "Work History",
                "verdict": "Evidence Gap (Unverified)",
                "reason": "Asserts engineering action without measurable impact metrics.",
                "suggested_rewrite": f"Accomplished objective via {b.split()[0]} [Tool], resulting in measurable [% or latency] improvement.",
                "metrics_present": []
            })

    # 4. Scores Calculation
    total_jd = max(1, len(jd_skills))
    skill_score = min(100, int((len(matched_ids) / total_jd) * 100))
    strong_count = sum(1 for e in evidence_table if e["evidence_strength"] == "Strong")
    exp_score = min(100, int(((strong_count * 1.0 + len(evidence_table) * 0.5) / max(1, len(evidence_table))) * 100))
    proj_score = min(100, int(skill_score * 0.9))
    cos_sim = compute_cosine_similarity(resume_text, jd_text)
    sem_score = min(100, int(cos_sim * 135))

    w_skill = weights.get("skill", 0.35)
    w_exp = weights.get("experience", 0.25)
    w_proj = weights.get("projects", 0.20)
    w_sem = weights.get("semantic", 0.20)

    overall = int((skill_score * w_skill) + (exp_score * w_exp) + (proj_score * w_proj) + (sem_score * w_sem))

    return {
        "overall_score": overall,
        "skill_overlap": skill_score,
        "experience_evidence": exp_score,
        "project_relevance": proj_score,
        "semantic_similarity": sem_score,
        "evidence_table": evidence_table,
        "skill_gaps": skill_gaps,
        "claim_audits": claim_audits
    }
