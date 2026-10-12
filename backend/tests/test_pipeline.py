"""
CareerLens AI — Unit Test Suite
Uses Python standard unittest library for reproducible validation.
"""
import unittest
from backend.nlp_pipeline import extract_skills, compute_cosine_similarity, run_analysis
from backend.evaluator import run_evaluation, calculate_metrics

class TestCareerLensPipeline(unittest.TestCase):

    def setUp(self):
        self.sample_resume = """
        AARAV SHARMA
        aarav@example.com | +91 9876543210 | Bangalore
        SKILLS: Python, PyTorch, Scikit-Learn, Docker, FastAPI, Git
        EXPERIENCE:
        Machine Learning Intern | NeuroTech Labs
        • Built an end-to-end defect detection pipeline using YOLOv8 and PyTorch, achieving 94.2% mAP@50 across 12,000 industrial imagery samples.
        • Optimized model inference latency from 85ms to 32ms per frame using ONNX Runtime.
        PROJECTS:
        MedVision Chest X-Ray Diagnosis System | PyTorch, Hugging Face
        • Built vector similarity search with FAISS to retrieve visually similar historical patient cases in under 45ms.
        """

        self.sample_jd = """
        Position: Machine Learning Engineer
        We require strong Python, PyTorch, Docker, FastAPI, and Git.
        Experience with AWS and Kubernetes is a plus.
        """

    def test_skill_extraction(self):
        extracted = extract_skills(self.sample_resume)
        skill_ids = [item["skill"]["id"] for item in extracted]
        self.assertIn("python", skill_ids)
        self.assertIn("pytorch", skill_ids)
        self.assertIn("docker", skill_ids)
        self.assertIn("fastapi", skill_ids)

    def test_cosine_similarity(self):
        sim = compute_cosine_similarity("machine learning engineer python", "machine learning engineer python")
        self.assertAlmostEqual(sim, 1.0, places=2)

        sim_zero = compute_cosine_similarity("machine learning", "gardening flowers cooking")
        self.assertEqual(sim_zero, 0.0)

    def test_run_analysis_pipeline(self):
        res = run_analysis(self.sample_resume, self.sample_jd)
        self.assertIn("overall_score", res)
        self.assertGreater(res["overall_score"], 40)
        self.assertGreater(len(res["evidence_table"]), 0)

        # Check evidence citations
        pytorch_ev = next((e for e in res["evidence_table"] if e["skill_id"] == "pytorch"), None)
        self.assertIsNotNone(pytorch_ev)
        self.assertEqual(pytorch_ev["evidence_strength"], "Strong")
        self.assertTrue(pytorch_ev["has_metric"])

    def test_evaluator_metrics(self):
        eval_result = run_evaluation(0.50)
        self.assertEqual(eval_result["total_samples"], 20)
        self.assertIn("f1_score", eval_result["keyword_baseline"])
        self.assertIn("f1_score", eval_result["semantic_model"])
        # Semantic model should outperform keyword baseline on F1
        self.assertGreaterEqual(eval_result["semantic_model"]["f1_score"], eval_result["keyword_baseline"]["f1_score"])

if __name__ == "__main__":
    unittest.main()
