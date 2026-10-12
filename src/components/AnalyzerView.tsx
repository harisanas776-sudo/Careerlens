/**
 * CareerLens AI — Comprehensive Analyzer View
 * Live resume intelligence, evidence citations, ATS audit, claim checker, and roadmap.
 */

import React, { useState, useEffect } from 'react';
import {
  FileText, Upload, Sparkles, CheckCircle2, AlertTriangle, ArrowRight,
  Sliders, Download, BookOpen, Layers, CheckSquare, Search, ChevronRight,
  ShieldAlert, RefreshCw, FileCheck, HelpCircle, Briefcase, Award
} from 'lucide-react';
import { AnalysisResult, ScoreWeights, DEFAULT_WEIGHTS, analyzeResumeAndJob } from '../engine/evidenceScorer';
import { parseResumeStructure } from '../engine/resumeParser';
import { SAMPLE_PROFILES } from '../data/sampleData';
import { exportAuditReportPDF } from '../utils/pdfExport';
import { SkillRoadmap } from './SkillRoadmap';
import { ScoreLogicTooltip } from './ScoreLogicTooltip';
import { ExportReportModal } from './ExportReportModal';

interface AnalyzerViewProps {
  onAnalyze: (resumeText: string, jdText: string, role: string, weights: ScoreWeights) => Promise<AnalysisResult>;
  initialAnalysis?: AnalysisResult | null;
}

export const AnalyzerView: React.FC<AnalyzerViewProps> = ({ onAnalyze, initialAnalysis }) => {
  // Input states
  const [resumeText, setResumeText] = useState<string>(SAMPLE_PROFILES[0].resumeText);
  const [jobDescription, setJobDescription] = useState<string>(SAMPLE_PROFILES[0].jobDescription);
  const [targetRole, setTargetRole] = useState<string>(SAMPLE_PROFILES[0].targetRole);
  const [inputMode, setInputMode] = useState<'upload' | 'paste'>('paste');
  const [fileName, setFileName] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Analysis state
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(initialAnalysis || null);
  const [activeSubTab, setActiveSubTab] = useState<
    'evidence' | 'gaps' | 'claims' | 'ats' | 'projects' | 'roadmap' | 'counterfactual'
  >('evidence');

  // Configurable weights state
  const [weights, setWeights] = useState<ScoreWeights>(DEFAULT_WEIGHTS);
  const [showWeightSliders, setShowWeightSliders] = useState<boolean>(false);

  // Evidence filtering
  const [evidenceFilter, setEvidenceFilter] = useState<'all' | 'Strong' | 'Moderate' | 'Weak'>('all');
  const [gapFilter, setGapFilter] = useState<'all' | 'High' | 'Medium' | 'Low'>('all');

  // Roadmap completion state saved locally
  const [completedMilestones, setCompletedMilestones] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('careerlens_roadmap_completed');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [roadmapProgress, setRoadmapProgress] = useState<{ done: number; total: number }>({ done: 0, total: 12 });
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // Run initial analysis on first mount if none provided
  useEffect(() => {
    if (!analysis) {
      handleTriggerAnalysis();
    }
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('resumeFile', file);

      const res = await fetch('/api/upload-resume', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (data.success && data.extractedText) {
        setResumeText(data.extractedText);
        setInputMode('paste');
      } else {
        alert(data.error || 'Failed to extract text from resume file.');
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      // Fallback: read as text if TXT
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          setResumeText(text);
          setInputMode('paste');
        }
      };
      reader.readAsText(file);
    } finally {
      setIsUploading(false);
    }
  };

  const handleTriggerAnalysis = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      alert('Please provide both resume text and a target job description.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await onAnalyze(resumeText, jobDescription, targetRole, weights);
      setAnalysis(result);
    } catch (err: any) {
      console.error('Analysis error:', err);
      // Fallback client-side analysis
      const parsed = parseResumeStructure(resumeText);
      const res = analyzeResumeAndJob(parsed, jobDescription, targetRole, weights);
      setAnalysis(res);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLiveWeightChange = (key: keyof ScoreWeights, val: number) => {
    const newWeights = { ...weights, [key]: val };
    setWeights(newWeights);
    if (analysis) {
      // Re-score immediately
      const parsed = parseResumeStructure(resumeText);
      const updated = analyzeResumeAndJob(parsed, jobDescription, targetRole, newWeights);
      setAnalysis(updated);
    }
  };

  const handleLoadPreset = (profile: typeof SAMPLE_PROFILES[0]) => {
    setResumeText(profile.resumeText);
    setJobDescription(profile.jobDescription);
    setTargetRole(profile.targetRole);
    setFileName('');
    // Auto-analyze
    const parsed = parseResumeStructure(profile.resumeText);
    const updated = analyzeResumeAndJob(parsed, profile.jobDescription, profile.targetRole, weights);
    setAnalysis(updated);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Input Section Card */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight">Input Candidate Resume &amp; Target Role</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Upload a document or edit text directly. Real-time deterministic analysis extracts verified evidence spans.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden lg:inline">Quick Demo:</span>
            <button
              onClick={() => handleLoadPreset(SAMPLE_PROFILES[0])}
              className="px-2.5 py-1 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition-colors"
            >
              ML Engineer
            </button>
            <button
              onClick={() => handleLoadPreset(SAMPLE_PROFILES[1])}
              className="px-2.5 py-1 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition-colors"
            >
              Full-Stack Dev
            </button>
            <button
              onClick={() => handleLoadPreset(SAMPLE_PROFILES[2])}
              className="px-2.5 py-1 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition-colors"
            >
              Data Analyst
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Resume Input Column */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-300 flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>Resume Document (PDF, DOCX, or Text)</span>
              </label>

              <div className="flex items-center space-x-1 p-0.5 bg-slate-950 rounded-md border border-slate-800">
                <button
                  onClick={() => setInputMode('paste')}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
                    inputMode === 'paste' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Editor
                </button>
                <button
                  onClick={() => setInputMode('upload')}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
                    inputMode === 'upload' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Upload File
                </button>
              </div>
            </div>

            {inputMode === 'upload' ? (
              <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center bg-slate-950/50 hover:bg-slate-950/80 transition-colors">
                <Upload className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                <p className="text-xs font-medium text-slate-200">
                  {fileName ? `Uploaded: ${fileName}` : 'Drop PDF or DOCX resume here, or click to browse'}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Supports .pdf, .docx, and .txt files up to 10MB. Processed in-memory.
                </p>
                <label className="mt-3 inline-block cursor-pointer">
                  <span className="px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-md shadow">
                    Select File
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                {isUploading && <p className="text-xs text-indigo-400 mt-2">Extracting document text...</p>}
              </div>
            ) : (
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste plain text resume content..."
                rows={12}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 font-mono leading-relaxed focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
              />
            )}
          </div>

          {/* Job Description Input Column */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-300 flex items-center space-x-1.5">
                <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                <span>Target Job Description &amp; Role</span>
              </label>

              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="Role Title (e.g. ML Engineer)"
                className="w-48 bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste target job requirements and qualifications..."
              rows={12}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 font-mono leading-relaxed focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
            />
          </div>
        </div>

        {/* Action Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => setShowWeightSliders(!showWeightSliders)}
            className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{showWeightSliders ? 'Hide Scoring Formula Weights' : 'Configure Scoring Formula Weights'}</span>
          </button>

          <button
            onClick={handleTriggerAnalysis}
            disabled={isAnalyzing}
            className="flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-medium text-xs rounded-lg shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Computing Evidence Matrix...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Run Explainable Analysis</span>
              </>
            )}
          </button>
        </div>

        {/* Dynamic Weight Tuning Sliders */}
        {showWeightSliders && (
          <div className="mt-4 p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200">
                Transparent Multi-Component Scoring Formula Weights
              </span>
              <button
                onClick={() => {
                  setWeights(DEFAULT_WEIGHTS);
                  if (analysis) {
                    const parsed = parseResumeStructure(resumeText);
                    setAnalysis(analyzeResumeAndJob(parsed, jobDescription, targetRole, DEFAULT_WEIGHTS));
                  }
                }}
                className="text-[11px] text-indigo-400 hover:underline"
              >
                Reset to Defaults
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Skill Overlap Weight</span>
                  <span className="font-semibold text-slate-200">{(weights.skill * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={weights.skill}
                  onChange={(e) => handleLiveWeightChange('skill', parseFloat(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Experience Proof Weight</span>
                  <span className="font-semibold text-slate-200">{(weights.experience * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={weights.experience}
                  onChange={(e) => handleLiveWeightChange('experience', parseFloat(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Project Relevance Weight</span>
                  <span className="font-semibold text-slate-200">{(weights.projects * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={weights.projects}
                  onChange={(e) => handleLiveWeightChange('projects', parseFloat(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Semantic Similarity Weight</span>
                  <span className="font-semibold text-slate-200">{(weights.semantic * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={weights.semantic}
                  onChange={(e) => handleLiveWeightChange('semantic', parseFloat(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-400 italic">
              Formula: S = (w_skill × S_skill) + (w_exp × S_exp) + (w_proj × S_proj) + (w_sem × S_sem). Scores recalculate instantly upon slider change.
            </p>
          </div>
        )}
      </section>

      {/* Analysis Output Dashboard */}
      {analysis && (
        <div className="space-y-6 animate-fade-in">
          {/* Executive Header Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-slate-800 gap-6">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-bold text-white tracking-tight">Executive Match &amp; Evidence Audit</h3>
                  <span className="text-xs text-slate-400">· {analysis.targetRole}</span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                  <span>{analysis.parsedResume.wordCount} Words</span>
                  <span>·</span>
                  <span>{analysis.parsedResume.bulletsCount} Extracted Bullets</span>
                  <span>·</span>
                  <span>ATS Score: {analysis.atsAudit.score}/100 ({analysis.atsAudit.verdict})</span>
                  <span>·</span>
                  <span className="text-emerald-400 font-medium">Roadmap: {roadmapProgress.done}/{roadmapProgress.total} Done</span>
                  <span>·</span>
                  <span className="text-indigo-400 font-mono text-[11px]">Formula verified</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsExportModalOpen(true)}
                  className="flex items-center space-x-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Structured PDF Report</span>
                </button>
              </div>
            </div>

            {/* Scorecard Component Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
              {/* Overall Match Gauge Card */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg flex flex-col justify-between group hover:border-slate-700 transition-colors">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Overall Fit Index</span>
                    <ScoreLogicTooltip section="overall" analysis={analysis} weights={weights} />
                  </div>
                  <div className="flex items-baseline space-x-1 mt-2">
                    <span className="text-3xl font-extrabold text-white">{analysis.scores.overall}%</span>
                    <span className="text-xs text-slate-400">/ 100</span>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        analysis.scores.overall >= 75 ? 'bg-emerald-500' :
                        analysis.scores.overall >= 50 ? 'bg-indigo-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${analysis.scores.overall}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1.5 block">
                    {analysis.scores.overall >= 75 ? 'Strong Empirical Alignment' :
                     analysis.scores.overall >= 50 ? 'Moderate Fit (Skill Gaps)' : 'Early Readiness'}
                  </span>
                </div>
              </div>

              {/* 1. Skill Overlap */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg flex flex-col justify-between group hover:border-slate-700 transition-colors">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">1. Skill Overlap</span>
                    <ScoreLogicTooltip section="skill" analysis={analysis} weights={weights} />
                  </div>
                  <div className="flex items-baseline space-x-1 mt-2">
                    <span className="text-2xl font-bold text-white">{analysis.scores.skillOverlap}%</span>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${analysis.scores.skillOverlap}%` }} />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1.5 block">
                    {analysis.evidenceTable.length} matched / {analysis.evidenceTable.length + analysis.skillGaps.length} JD skills
                  </span>
                </div>
              </div>

              {/* 2. Experience Evidence */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg flex flex-col justify-between group hover:border-slate-700 transition-colors">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">2. Experience Proof</span>
                    <ScoreLogicTooltip section="experience" analysis={analysis} weights={weights} />
                  </div>
                  <div className="flex items-baseline space-x-1 mt-2">
                    <span className="text-2xl font-bold text-white">{analysis.scores.experienceEvidence}%</span>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${analysis.scores.experienceEvidence}%` }} />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1.5 block">
                    {analysis.evidenceTable.filter(e => e.evidenceStrength === 'Strong').length} skills backed by metrics
                  </span>
                </div>
              </div>

              {/* 3. Project Relevance */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg flex flex-col justify-between group hover:border-slate-700 transition-colors">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">3. Project Alignment</span>
                    <ScoreLogicTooltip section="projects" analysis={analysis} weights={weights} />
                  </div>
                  <div className="flex items-baseline space-x-1 mt-2">
                    <span className="text-2xl font-bold text-white">{analysis.scores.projectRelevance}%</span>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${analysis.scores.projectRelevance}%` }} />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1.5 block">
                    {analysis.projectJobMap.length} portfolio projects mapped
                  </span>
                </div>
              </div>

              {/* 4. Semantic Similarity */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg flex flex-col justify-between group hover:border-slate-700 transition-colors">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">4. Semantic Match</span>
                    <ScoreLogicTooltip section="semantic" analysis={analysis} weights={weights} />
                  </div>
                  <div className="flex items-baseline space-x-1 mt-2">
                    <span className="text-2xl font-bold text-white">{analysis.scores.semanticSimilarity}%</span>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-violet-500 rounded-full" style={{ width: `${analysis.scores.semanticSimilarity}%` }} />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1.5 block">
                    TF-IDF cosine document vector index
                  </span>
                </div>
              </div>
            </div>

            {/* Published Formula Rationale Notice */}
            <div className="mt-4 p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg text-xs text-slate-300">
              <span className="font-semibold text-slate-200">Active Formula: </span>
              <span className="font-mono text-indigo-300">{analysis.scoringExplanation.formula}</span>
            </div>
          </div>

          {/* Deep-Dive Sub-Tabs Navigation */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-1 border-b border-slate-800">
            <button
              onClick={() => setActiveSubTab('evidence')}
              className={`px-3 py-2 text-xs font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                activeSubTab === 'evidence'
                  ? 'bg-slate-900 text-indigo-400 border-t-2 border-indigo-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              1. Evidence Citations ({analysis.evidenceTable.length})
            </button>

            <button
              onClick={() => setActiveSubTab('gaps')}
              className={`px-3 py-2 text-xs font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                activeSubTab === 'gaps'
                  ? 'bg-slate-900 text-indigo-400 border-t-2 border-indigo-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              2. Skill Gap Prioritizer ({analysis.skillGaps.length})
            </button>

            <button
              onClick={() => setActiveSubTab('claims')}
              className={`px-3 py-2 text-xs font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                activeSubTab === 'claims'
                  ? 'bg-slate-900 text-indigo-400 border-t-2 border-indigo-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              3. Claim Evidence Checker ({analysis.claimAudits.length})
            </button>

            <button
              onClick={() => setActiveSubTab('ats')}
              className={`px-3 py-2 text-xs font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                activeSubTab === 'ats'
                  ? 'bg-slate-900 text-indigo-400 border-t-2 border-indigo-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              4. ATS Readability Audit ({analysis.atsAudit.score}%)
            </button>

            <button
              onClick={() => setActiveSubTab('projects')}
              className={`px-3 py-2 text-xs font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                activeSubTab === 'projects'
                  ? 'bg-slate-900 text-indigo-400 border-t-2 border-indigo-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              5. Project-to-Job Mapper ({analysis.projectJobMap.length})
            </button>

            <button
              onClick={() => setActiveSubTab('counterfactual')}
              className={`px-3 py-2 text-xs font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                activeSubTab === 'counterfactual'
                  ? 'bg-slate-900 text-indigo-400 border-t-2 border-indigo-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              6. Counterfactual Coach ({analysis.counterfactualCoach.length})
            </button>

            <button
              onClick={() => setActiveSubTab('roadmap')}
              className={`px-3 py-2 text-xs font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                activeSubTab === 'roadmap'
                  ? 'bg-slate-900 text-indigo-400 border-t-2 border-indigo-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              7. 30-Day Skill Roadmap (4 Weeks)
            </button>
          </div>

          {/* Sub-Tab 1: Evidence Citations Table */}
          {activeSubTab === 'evidence' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <h4 className="text-sm font-semibold text-white">Exact Resume Text Supporting Matched Skills</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    No black-box assertions. Every detected skill is grounded in verbatim quotes from your resume.
                  </p>
                </div>

                {/* Evidence Strength Filters */}
                <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                  <button
                    onClick={() => setEvidenceFilter('all')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      evidenceFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    All ({analysis.evidenceTable.length})
                  </button>
                  <button
                    onClick={() => setEvidenceFilter('Strong')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      evidenceFilter === 'Strong' ? 'bg-emerald-950 text-emerald-300 font-medium' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Strong (Metrics)
                  </button>
                  <button
                    onClick={() => setEvidenceFilter('Moderate')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      evidenceFilter === 'Moderate' ? 'bg-indigo-950 text-indigo-300 font-medium' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Moderate (Projects)
                  </button>
                  <button
                    onClick={() => setEvidenceFilter('Weak')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      evidenceFilter === 'Weak' ? 'bg-slate-800 text-slate-300 font-medium' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Weak (Keyword only)
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-medium">
                      <th className="py-2.5 px-3">Skill &amp; Domain</th>
                      <th className="py-2.5 px-3">Evidence Strength</th>
                      <th className="py-2.5 px-3">Exact Supporting Quote (Verbatim)</th>
                      <th className="py-2.5 px-3">Section Context</th>
                      <th className="py-2.5 px-3">Metric Verified</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {analysis.evidenceTable
                      .filter(e => evidenceFilter === 'all' || e.evidenceStrength === evidenceFilter)
                      .map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3 px-3">
                            <span className="font-semibold text-white block">{item.skillName}</span>
                            <span className="text-[11px] text-slate-400">{item.category}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                              item.evidenceStrength === 'Strong'
                                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                                : item.evidenceStrength === 'Moderate'
                                ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-800/60'
                                : 'bg-slate-800 text-slate-300 border border-slate-700'
                            }`}>
                              {item.evidenceStrength}
                            </span>
                          </td>
                          <td className="py-3 px-3 max-w-md">
                            <blockquote className="italic text-slate-300 bg-slate-950/70 p-2 rounded border border-slate-800/80 text-[11px] leading-relaxed">
                              "{item.supportingQuote}"
                            </blockquote>
                          </td>
                          <td className="py-3 px-3 text-slate-400 text-[11px]">
                            {item.foundInSection}
                          </td>
                          <td className="py-3 px-3">
                            {item.hasMetric ? (
                              <span className="text-emerald-400 flex items-center space-x-1 font-medium">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Quantified</span>
                              </span>
                            ) : (
                              <span className="text-slate-400">Descriptive</span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sub-Tab 2: Skill Gap Prioritizer */}
          {activeSubTab === 'gaps' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <h4 className="text-sm font-semibold text-white">Hierarchical Skill Gap Prioritization</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Classified based on job description emphasis, foundational prerequisites, and industry dependencies.
                  </p>
                </div>

                <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                  <button
                    onClick={() => setGapFilter('all')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      gapFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    All ({analysis.skillGaps.length})
                  </button>
                  <button
                    onClick={() => setGapFilter('High')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      gapFilter === 'High' ? 'bg-rose-950 text-rose-300 font-medium' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    High Priority ({analysis.skillGaps.filter(g => g.priority === 'High').length})
                  </button>
                  <button
                    onClick={() => setGapFilter('Medium')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      gapFilter === 'Medium' ? 'bg-amber-950 text-amber-300 font-medium' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Medium
                  </button>
                  <button
                    onClick={() => setGapFilter('Low')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      gapFilter === 'Low' ? 'bg-slate-800 text-slate-300 font-medium' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Low
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analysis.skillGaps
                  .filter(g => gapFilter === 'all' || g.priority === gapFilter)
                  .map((gap, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border bg-slate-950 flex flex-col justify-between ${
                        gap.priority === 'High'
                          ? 'border-rose-900/60'
                          : gap.priority === 'Medium'
                          ? 'border-amber-900/50'
                          : 'border-slate-800'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white text-sm">{gap.skillName}</span>
                          <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                            gap.priority === 'High'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : gap.priority === 'Medium'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-slate-800 text-slate-300'
                          }`}>
                            {gap.priority} Priority
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                          {gap.reason}
                        </p>

                        {gap.prerequisitesNeeded.length > 0 && (
                          <div className="mt-3 text-[11px] text-slate-400">
                            <span className="font-medium text-slate-300">Prerequisites required: </span>
                            {gap.prerequisitesNeeded.join(', ')}
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                        <span>Mentioned {gap.mentionedInJDCount}x in JD</span>
                        <span className="text-indigo-400 font-medium">Roadmap Week {gap.recommendedWeekInRoadmap}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Sub-Tab 3: Claim Evidence Checker */}
          {activeSubTab === 'claims' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
              <div className="pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-semibold text-white">Empirical Claim Evidence Auditor</h4>
                  <span className="text-xs text-slate-400 font-normal">· Research Ethics Principle</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Flags assertions lacking measurable outcomes or technical tooling. Crucial note: statements are <strong>never marked false</strong> merely because evidence is omitted; they are identified as unverified claims that benefit from metric grounding.
                </p>
              </div>

              <div className="space-y-3">
                {analysis.claimAudits.map((claim, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border bg-slate-950 ${
                      claim.verdict === 'Well Evidenced'
                        ? 'border-emerald-900/60'
                        : 'border-amber-900/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-400">{claim.section}</span>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                        claim.verdict === 'Well Evidenced'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {claim.verdict}
                      </span>
                    </div>

                    <p className="text-xs font-mono text-slate-200 bg-slate-900/90 p-2.5 rounded border border-slate-800">
                      "{claim.originalText}"
                    </p>

                    <div className="mt-3 text-xs space-y-1">
                      <p className="text-slate-300">
                        <strong className="text-slate-200">Audit Finding: </strong>
                        {claim.reason}
                      </p>

                      {claim.verdict !== 'Well Evidenced' && (
                        <div className="mt-2 pt-2 border-t border-slate-800">
                          <span className="text-[11px] font-medium text-indigo-400">Recommended Google XYZ Formulation:</span>
                          <p className="text-xs italic text-indigo-200 mt-0.5">
                            "{claim.suggestedRewrite}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub-Tab 4: ATS Readability Audit */}
          {activeSubTab === 'ats' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-white">ATS Readability &amp; Ingestion Audit</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Evaluates header recognizability, contact completeness, table/multi-column parsing risks, and document volume.
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <span className="text-2xl font-bold text-white">{analysis.atsAudit.score}/100</span>
                    <span className="text-xs text-slate-400 block">Verdict: {analysis.atsAudit.verdict}</span>
                  </div>
                </div>
              </div>

              {/* Contact and Section Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg">
                  <h5 className="font-semibold text-slate-200 mb-2">Contact Parsing Ingestion</h5>
                  <ul className="space-y-1.5 text-slate-300">
                    <li className="flex items-center justify-between">
                      <span>Email Address</span>
                      <span className={analysis.atsAudit.contactCompleteness.hasEmail ? 'text-emerald-400' : 'text-rose-400'}>
                        {analysis.atsAudit.contactCompleteness.hasEmail ? 'Detected' : 'Missing'}
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Phone Number</span>
                      <span className={analysis.atsAudit.contactCompleteness.hasPhone ? 'text-emerald-400' : 'text-rose-400'}>
                        {analysis.atsAudit.contactCompleteness.hasPhone ? 'Detected' : 'Missing'}
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>LinkedIn Profile</span>
                      <span className={analysis.atsAudit.contactCompleteness.hasLinkedIn ? 'text-emerald-400' : 'text-rose-400'}>
                        {analysis.atsAudit.contactCompleteness.hasLinkedIn ? 'Detected' : 'Missing'}
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>GitHub / Portfolio</span>
                      <span className={analysis.atsAudit.contactCompleteness.hasGitHubOrPortfolio ? 'text-emerald-400' : 'text-amber-400'}>
                        {analysis.atsAudit.contactCompleteness.hasGitHubOrPortfolio ? 'Detected' : 'Recommended'}
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg">
                  <h5 className="font-semibold text-slate-200 mb-2">Layout &amp; Table Risk</h5>
                  <ul className="space-y-1.5 text-slate-300">
                    <li className="flex items-center justify-between">
                      <span>Multi-Column / Tables</span>
                      <span className={!analysis.atsAudit.formattingRisks.twoColumnOrTableRisk ? 'text-emerald-400' : 'text-rose-400'}>
                        {!analysis.atsAudit.formattingRisks.twoColumnOrTableRisk ? 'Safe Linear Flow' : 'Risk of Scramble'}
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Special Glyph Density</span>
                      <span className={!analysis.atsAudit.formattingRisks.specialCharDensityRisk ? 'text-emerald-400' : 'text-amber-400'}>
                        {!analysis.atsAudit.formattingRisks.specialCharDensityRisk ? 'Clean OCR' : 'High Icon Density'}
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Section Heading Standard</span>
                      <span className="text-emerald-400">
                        {analysis.atsAudit.sectionCompliance.standardHeadersFound.length} Standard Found
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg">
                  <h5 className="font-semibold text-slate-200 mb-2">Document Length &amp; Density</h5>
                  <ul className="space-y-1.5 text-slate-300">
                    <li className="flex items-center justify-between">
                      <span>Word Count</span>
                      <span className="font-medium text-white">{analysis.atsAudit.lengthAndVolume.wordCount} words</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Length Status</span>
                      <span className="text-emerald-400">{analysis.atsAudit.lengthAndVolume.status}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Estimated Pages</span>
                      <span>{analysis.atsAudit.lengthAndVolume.estimatedPages} page(s)</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Detailed Checklist */}
              <div className="space-y-2">
                <h5 className="text-xs font-semibold text-slate-300">Compliance Audit Checklist</h5>
                <div className="divide-y divide-slate-800/80 border border-slate-800 rounded-lg bg-slate-950 overflow-hidden">
                  {analysis.atsAudit.detailedChecklist.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-start space-x-3 text-xs">
                      {item.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-slate-200">{item.item}</span>
                          <span className="text-[11px] text-slate-400">{item.category}</span>
                        </div>
                        <p className="text-slate-400 mt-0.5">{item.advice}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 5: Project-to-Job Mapper */}
          {activeSubTab === 'projects' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
              <div className="pb-3 border-b border-slate-800">
                <h4 className="text-sm font-semibold text-white">Project-to-Job Requirement Mapper</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Maps candidate capstone and research projects to required job criteria, identifying which requirements lack project proof.
                </p>
              </div>

              <div className="space-y-4">
                {analysis.projectJobMap.map((proj, idx) => (
                  <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800/80 gap-2">
                      <span className="font-semibold text-white text-sm">{proj.projectName}</span>
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="text-slate-400">Alignment Score:</span>
                        <span className="font-bold text-indigo-400">{proj.alignmentScore}%</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 mt-2.5 italic">
                      "{proj.projectSnippet}"
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 pt-3 border-t border-slate-800/60 text-xs">
                      <div>
                        <span className="text-[11px] font-medium text-emerald-400 block mb-1">
                          Fulfilled Job Requirements:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {proj.matchedJDRequirements.length > 0 ? (
                            proj.matchedJDRequirements.map((r, rIdx) => (
                              <span key={rIdx} className="text-[11px] text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                                {r}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-500 text-[11px]">No direct overlap found</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <span className="text-[11px] font-medium text-amber-400 block mb-1">
                          Still Needs Stronger Project Evidence:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {proj.unsupportedJDRequirements.map((u, uIdx) => (
                            <span key={uIdx} className="text-[11px] text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                              {u}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub-Tab 6: Counterfactual Coach */}
          {activeSubTab === 'counterfactual' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
              <div className="pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-semibold text-white">Counterfactual Resume Coach</h4>
                  <span className="text-xs text-slate-400 font-normal">· Before vs. After Grounding</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Illustrates what precise structural modifications in your resume wording would elevate evidence strength. <em>Ethical notice: These suggestions guide formatting and metric articulation; they do not guarantee interview shortlisting.</em>
                </p>
              </div>

              <div className="space-y-4">
                {analysis.counterfactualCoach.map((coach, idx) => (
                  <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
                    <span className="text-xs font-semibold text-indigo-400 block">{coach.category}</span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-3 bg-slate-900/80 rounded border border-rose-950">
                        <span className="text-[11px] font-medium text-rose-400 uppercase tracking-wider block mb-1">
                          Current Resume Phrasing:
                        </span>
                        <p className="text-slate-300 font-mono text-[11px]">{coach.currentResumeExcerpt}</p>
                      </div>

                      <div className="p-3 bg-slate-900/80 rounded border border-emerald-950">
                        <span className="text-[11px] font-medium text-emerald-400 uppercase tracking-wider block mb-1">
                          Counterfactual XYZ Recommendation:
                        </span>
                        <p className="text-slate-200 font-mono text-[11px]">{coach.recommendedRewrite}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2">
                      <p><strong className="text-slate-300">Why this helps: </strong>{coach.whyThisHelps}</p>
                      <span className="text-emerald-400 shrink-0 font-medium">{coach.expectedEvidenceGain}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub-Tab 7: 30-Day Personalized Roadmap */}
          {activeSubTab === 'roadmap' && (
            <SkillRoadmap
              roadmap={analysis.roadmap}
              targetRole={analysis.targetRole}
              onProgressChange={(done, total) => setRoadmapProgress({ done, total })}
            />
          )}

          {/* Structured PDF Report Export Modal */}
          {analysis && (
            <ExportReportModal
              isOpen={isExportModalOpen}
              onClose={() => setIsExportModalOpen(false)}
              analysis={analysis}
              completedMilestones={completedMilestones}
            />
          )}
        </div>
      )}
    </div>
  );
};
