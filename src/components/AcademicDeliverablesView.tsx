/**
 * CareerLens AI — Final Year B.Tech CSE (AI) Capstone Deliverables
 * Interactive System Architecture Diagram, Workflow Pipeline, SQLite Database Schema,
 * Research Paper Draft Outline, and Literature Review Search Term Guide.
 */

import React, { useState } from 'react';
import {
  BookOpen, Layers, Database, FileText, Search, Copy, Check,
  Cpu, GitBranch, ShieldCheck, Terminal, Compass, Download
} from 'lucide-react';
import { ACADEMIC_DELIVERABLES } from '../data/academicDeliverables';

export const AcademicDeliverablesView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'schema' | 'paper' | 'literature'>('architecture');
  const [copiedSQL, setCopiedSQL] = useState<boolean>(false);

  const handleCopySQL = () => {
    navigator.clipboard.writeText(ACADEMIC_DELIVERABLES.databaseSchemaSQL);
    setCopiedSQL(true);
    setTimeout(() => setCopiedSQL(false), 2000);
  };

  const { researchPaperDraft, literatureReviewTerms } = ACADEMIC_DELIVERABLES;

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                Final Year Project Portfolio
              </span>
              <span className="text-xs text-slate-400">· Capstone Project Documentation</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-1">
              B.Tech CSE (Artificial Intelligence) Academic Deliverables
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive architectural specifications, mathematical formulations, relational schemas, and research paper manuscript.
            </p>
          </div>

          {/* Sub-Tab Navigation */}
          <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-lg text-xs">
            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'architecture' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Architecture &amp; Flow
            </button>
            <button
              onClick={() => setActiveTab('schema')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'schema' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Database Schema
            </button>
            <button
              onClick={() => setActiveTab('paper')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'paper' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Research Paper Draft
            </button>
            <button
              onClick={() => setActiveTab('literature')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'literature' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Literature Search Guide
            </button>
          </div>
        </div>

        {/* Tab 1: Architecture Diagram & Workflow */}
        {activeTab === 'architecture' && (
          <div className="mt-6 space-y-6 animate-fade-in">
            {/* System Architecture Visualization */}
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <span>5-Layer Modular System Architecture</span>
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">Microservice &amp; Modular Engine</span>
              </div>

              {/* Layer-by-Layer Architecture Grid */}
              <div className="space-y-3 text-xs">
                {/* Layer 1: Ingestion */}
                <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-lg">
                  <div className="flex items-center justify-between text-indigo-400 font-semibold mb-1">
                    <span>Layer 1: Document Ingestion &amp; Layout Preprocessing</span>
                    <span className="text-[10px] text-slate-400 font-mono">PyMuPDF / mammoth / pdf-parse</span>
                  </div>
                  <p className="text-slate-300">
                    Accepts raw PDF, DOCX, and TXT files in-memory. Performs text layout normalization, OCR verification, and ATS layout risk detection (table delimiters, two-column flow, special character density).
                  </p>
                </div>

                {/* Layer 2: Knowledge & Taxonomies */}
                <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-lg">
                  <div className="flex items-center justify-between text-emerald-400 font-semibold mb-1">
                    <span>Layer 2: Domain Taxonomy &amp; Entity Resolution</span>
                    <span className="text-[10px] text-slate-400 font-mono">Curated 500+ Entity Hierarchy</span>
                  </div>
                  <p className="text-slate-300">
                    Maps token n-grams to standardized skill IDs (e.g. "py" → "Python", "torch" → "PyTorch"). Maintains prerequisite dependency graphs for multi-week roadmap generation.
                  </p>
                </div>

                {/* Layer 3: Analytical Evidence Scorer */}
                <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-lg">
                  <div className="flex items-center justify-between text-cyan-400 font-semibold mb-1">
                    <span>Layer 3: Evidence Extraction &amp; Claim Auditor</span>
                    <span className="text-[10px] text-slate-400 font-mono">Deterministic Heuristics + Metrics</span>
                  </div>
                  <p className="text-slate-300">
                    Extracts verbatim sentence spans justifying every matched skill. Classifies evidence strength (Strong, Moderate, Weak). Audits bullets for empirical metrics without falsely accusing candidates of deception.
                  </p>
                </div>

                {/* Layer 4: Mathematical Scoring & Explainability */}
                <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-lg">
                  <div className="flex items-center justify-between text-violet-400 font-semibold mb-1">
                    <span>Layer 4: Transparent Multi-Component Scoring Engine</span>
                    <span className="text-[10px] text-slate-400 font-mono">TF-IDF Vector Cosine + Jaccard</span>
                  </div>
                  <p className="text-slate-300">
                    Calculates overall fit via calibrated linear combination: S = w_skill·S_skill + w_exp·S_exp + w_proj·S_proj + w_sem·S_sem. Dynamically updates in real time with user-adjustable weights.
                  </p>
                </div>

                {/* Layer 5: Client Presentation */}
                <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-lg">
                  <div className="flex items-center justify-between text-amber-400 font-semibold mb-1">
                    <span>Layer 5: Client Presentation &amp; Report Generator</span>
                    <span className="text-[10px] text-slate-400 font-mono">React 19 / Recharts / jsPDF</span>
                  </div>
                  <p className="text-slate-300">
                    Renders executive dashboard, multi-job radar charts, interactive 30-day roadmap checklists, and compiles multi-page downloadable PDF candidate audit reports.
                  </p>
                </div>
              </div>
            </div>

            {/* Workflow Pipeline Diagram */}
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
              <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
                <GitBranch className="w-4 h-4 text-emerald-400" />
                <span>End-to-End Pipeline Workflow Flowchart</span>
              </h3>

              <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 text-xs font-mono text-slate-300 space-y-2 leading-relaxed">
                <div className="text-indigo-300 font-semibold">[Candidate Upload] (PDF / DOCX)</div>
                <div className="pl-4 text-slate-400">↓ Memory Ingestion &amp; Buffer Extraction</div>
                <div className="text-emerald-300 font-semibold">[Structural Parser &amp; ATS Auditor]</div>
                <div className="pl-4 text-slate-400">↓ Contact fields, Headers, Table check, Word count</div>
                <div className="text-cyan-300 font-semibold">[Taxonomy Entity Matcher &amp; Vectorizer]</div>
                <div className="pl-4 text-slate-400">↓ Synonym mapping + TF-IDF Vector cosine calculation</div>
                <div className="text-violet-300 font-semibold">[Evidence Span Extractor &amp; Claim Auditor]</div>
                <div className="pl-4 text-slate-400">↓ Sentence quotes, Metric detection, Google XYZ formulation</div>
                <div className="text-amber-300 font-semibold">[Roadmap &amp; Multi-Job Ranking Generator]</div>
                <div className="pl-4 text-slate-400">↓ 4-Week Milestone curriculum + Radar comparison</div>
                <div className="text-white font-semibold">[PDF Audit Report &amp; Interactive UI]</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Relational Database Schema */}
        {activeTab === 'schema' && (
          <div className="mt-6 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
                  <Database className="w-4 h-4 text-indigo-400" />
                  <span>Production Relational Schema (SQLite / PostgreSQL)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Normalized 3NF database schema with foreign key cascades and performance indexes.
                </p>
              </div>

              <button
                onClick={handleCopySQL}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 transition-colors cursor-pointer"
              >
                {copiedSQL ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSQL ? 'Copied SQL' : 'Copy DDL'}</span>
              </button>
            </div>

            <pre className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-[500px]">
              {ACADEMIC_DELIVERABLES.databaseSchemaSQL}
            </pre>
          </div>
        )}

        {/* Tab 3: Research Paper Draft Outline */}
        {activeTab === 'paper' && (
          <div className="mt-6 space-y-6 animate-fade-in text-xs text-slate-300">
            {/* Paper Header */}
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400">
                Manuscript Draft Outline
              </span>
              <h3 className="text-base font-bold text-white leading-tight">
                {researchPaperDraft.title}
              </h3>
              <p className="text-xs text-slate-400">
                Department of Computer Science &amp; Engineering (Artificial Intelligence)
              </p>

              <div className="pt-3 border-t border-slate-800">
                <span className="font-semibold text-slate-200 block mb-1">Abstract</span>
                <p className="text-slate-300 leading-relaxed italic bg-slate-900/90 p-3 rounded border border-slate-800">
                  {researchPaperDraft.abstract}
                </p>
              </div>
            </div>

            {/* Problem Statement & Research Gaps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                <span className="font-semibold text-slate-200 block">Problem Statement</span>
                <p className="text-slate-400 whitespace-pre-line leading-relaxed">
                  {researchPaperDraft.problemStatement}
                </p>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                <span className="font-semibold text-slate-200 block">Identified Research Gaps</span>
                <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
                  {researchPaperDraft.researchGaps.map((gap, idx) => (
                    <li key={idx} className="leading-relaxed">{gap}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Hypotheses */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
              <span className="font-semibold text-slate-200 block">Formal Research Hypotheses</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {researchPaperDraft.hypotheses.map((hypo) => (
                  <div key={hypo.code} className="p-3 bg-slate-900 rounded border border-slate-800">
                    <span className="font-bold text-indigo-400 block mb-1">Hypothesis {hypo.code}:</span>
                    <p className="text-slate-300 mb-2">{hypo.statement}</p>
                    <span className="text-[11px] text-slate-400 font-mono block">
                      <strong>Validation Protocol:</strong> {hypo.testMethod}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mathematical Formulation */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
              <span className="font-semibold text-slate-200 block">Mathematical Score Formulation</span>
              <div className="p-3 bg-slate-900 rounded border border-indigo-900/50 font-mono text-indigo-300 text-sm text-center">
                {researchPaperDraft.mathematicalFormulation.overallFormula}
              </div>

              <div className="space-y-2 pt-2">
                {researchPaperDraft.mathematicalFormulation.terms.map((t, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-baseline justify-between text-xs py-1 border-b border-slate-800/60">
                    <span className="font-mono text-indigo-400 font-semibold">{t.symbol} — {t.name}</span>
                    <span className="text-slate-400 font-mono text-[11px] mt-0.5 sm:mt-0">{t.definition}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Limitations & Ethics */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
              <span className="font-semibold text-rose-400 block">Ethical Guardrails &amp; Anti-Bias Principles</span>
              <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
                {researchPaperDraft.limitationsAndEthics.map((item, idx) => (
                  <li key={idx} className="leading-relaxed">{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tab 4: Literature Review Search Guide */}
        {activeTab === 'literature' && (
          <div className="mt-6 space-y-6 animate-fade-in text-xs text-slate-300">
            <div className="pb-3 border-b border-slate-800">
              <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
                <Search className="w-4 h-4 text-indigo-400" />
                <span>Curated Academic Search Queries &amp; Literature Survey Guide</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Targeted queries for finding peer-reviewed literature across IEEE, ACM, ACL Anthology, and Springer without fabricating citations.
              </p>
            </div>

            <div className="space-y-4">
              {literatureReviewTerms.map((cat, idx) => (
                <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white text-sm">{cat.category}</span>
                  </div>
                  <p className="text-slate-400">{cat.description}</p>

                  <div className="p-3 bg-slate-900 rounded border border-slate-800 space-y-1.5">
                    <span className="text-[11px] font-medium text-indigo-400 block">Recommended Scholar / arXiv Queries:</span>
                    {cat.recommendedSearchQueries.map((q, qIdx) => (
                      <div key={qIdx} className="font-mono text-slate-300 text-[11px] bg-slate-950 px-2.5 py-1 rounded border border-slate-800/80">
                        {q}
                      </div>
                    ))}
                  </div>

                  <div>
                    <span className="text-[11px] font-medium text-emerald-400 block mb-1">Foundational Landmark Papers:</span>
                    <ul className="space-y-1 text-slate-400 list-disc list-inside">
                      {cat.keyLandmarkPapers.map((paper, pIdx) => (
                        <li key={pIdx} className="italic">{paper}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
