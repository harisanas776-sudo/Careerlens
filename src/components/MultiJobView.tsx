/**
 * CareerLens AI — Multi-Job Comparison View
 * Compares 1 candidate resume across multiple target jobs simultaneously with
 * radar chart multidimensional visualization and fit ranking.
 */

import React, { useState } from 'react';
import {
  Layers, Plus, Trash2, Trophy, ArrowRight, CheckCircle2, AlertCircle,
  BarChart2, RefreshCw
} from 'lucide-react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend
} from 'recharts';
import { JobInput, compareMultipleJobs, MultiJobComparisonResult } from '../engine/multiJobComparator';
import { parseResumeStructure } from '../engine/resumeParser';
import { SAMPLE_PROFILES } from '../data/sampleData';

const PRELOADED_JOBS: JobInput[] = [
  {
    id: 'job-1',
    title: 'Junior Machine Learning Engineer',
    company: 'Stratosphere AI',
    description: `Position: Junior Machine Learning Engineer
Requires deep understanding of Python, PyTorch, Scikit-Learn, and Docker.
Hands-on experience with FastAPI microservices and computer vision or NLP pipelines.
Familiarity with MLflow or Weights & Biases for experiment tracking.`
  },
  {
    id: 'job-2',
    title: 'Full-Stack Software Engineer (React/Python)',
    company: 'Nexus Cloud Systems',
    description: `Position: Full-Stack Software Engineer
Requires React, TypeScript, Python (FastAPI/Django), and PostgreSQL.
Experience with Docker, Kubernetes, and CI/CD pipelines.
Strong API architecture and relational database optimization skills.`
  },
  {
    id: 'job-3',
    title: 'Data Analyst & BI Specialist',
    company: 'Omnichannel Retail Corp',
    description: `Position: Data Analyst & BI Specialist
Requires advanced SQL queries, Tableau or Power BI dashboard design.
Python Pandas for exploratory data analysis and hypothesis testing.
Experience translating data into business executive insights.`
  }
];

export const MultiJobView: React.FC = () => {
  const [candidateResumeText, setCandidateResumeText] = useState<string>(SAMPLE_PROFILES[0].resumeText);
  const [jobs, setJobs] = useState<JobInput[]>(PRELOADED_JOBS);
  const [comparisonResult, setComparisonResult] = useState<MultiJobComparisonResult | null>(() => {
    const parsed = parseResumeStructure(SAMPLE_PROFILES[0].resumeText);
    return compareMultipleJobs(parsed, PRELOADED_JOBS);
  });
  const [isComparing, setIsComparing] = useState<boolean>(false);

  const handleAddJob = () => {
    const newId = `job-${Date.now()}`;
    const newJob: JobInput = {
      id: newId,
      title: 'New Position',
      company: 'Enterprise Corp',
      description: 'Paste job requirements and qualifications here...'
    };
    const updated = [...jobs, newJob];
    setJobs(updated);
  };

  const handleRemoveJob = (id: string) => {
    if (jobs.length <= 1) {
      alert('Must maintain at least 1 job for comparison.');
      return;
    }
    const updated = jobs.filter(j => j.id !== id);
    setJobs(updated);
  };

  const handleUpdateJob = (id: string, field: keyof JobInput, val: string) => {
    const updated = jobs.map(j => j.id === id ? { ...j, [field]: val } : j);
    setJobs(updated);
  };

  const handleRunComparison = () => {
    setIsComparing(true);
    try {
      const parsed = parseResumeStructure(candidateResumeText);
      const res = compareMultipleJobs(parsed, jobs);
      setComparisonResult(res);
    } catch (e) {
      console.error('Comparison calculation error:', e);
    } finally {
      setIsComparing(false);
    }
  };

  // Prepare chart data for comparative bar visualization
  const barChartData = comparisonResult?.comparisons.map(item => ({
    name: `${item.job.title.slice(0, 18)}...`,
    'Overall Fit': item.analysis.scores.overall,
    'Skill Overlap': item.analysis.scores.skillOverlap,
    'Experience Proof': item.analysis.scores.experienceEvidence,
    'Project Align': item.analysis.scores.projectRelevance,
  })) || [];

  return (
    <div className="space-y-8 pb-16">
      {/* Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight">Multi-Job Description Alignment &amp; Trade-off Engine</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Evaluate your resume simultaneously against multiple candidate openings to discover where your empirical evidence is strongest.
            </p>
          </div>

          <button
            onClick={handleRunComparison}
            disabled={isComparing}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white text-xs font-medium rounded-lg shadow-md transition-colors cursor-pointer"
          >
            {isComparing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <BarChart2 className="w-3.5 h-3.5" />}
            <span>Recalculate Multi-Job Comparison</span>
          </button>
        </div>

        {/* Best Fit Banner */}
        {comparisonResult && comparisonResult.comparisons.length > 0 && (
          <div className="mt-4 p-4 bg-emerald-950/30 border border-emerald-800/60 rounded-lg flex items-start space-x-3">
            <Trophy className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-emerald-300">
                  Recommended Best Fit: {comparisonResult.comparisons[0].job.title} ({comparisonResult.comparisons[0].analysis.scores.overall}% Alignment)
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {comparisonResult.recommendationSummary}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Comparative Visualizations */}
      {comparisonResult && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Comparative Bar Chart */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
            <h3 className="text-xs font-semibold text-slate-200 mb-4 uppercase tracking-wider">
              Cross-Role Dimension Comparison
            </h3>
            <div className="h-64 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0B1120', borderColor: '#334155', fontSize: '11px' }}
                    itemStyle={{ color: '#E2E8F0' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="Overall Fit" fill="#6366F1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Skill Overlap" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Experience Proof" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Project Align" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Job Radar Chart */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
            <h3 className="text-xs font-semibold text-slate-200 mb-4 uppercase tracking-wider">
              {comparisonResult.comparisons[0].job.title} — Competency Radar
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={comparisonResult.comparisons[0].radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="dimension" stroke="#94A3B8" fontSize={11} />
                  <PolarRadiusAxis stroke="#64748B" domain={[0, 100]} fontSize={10} />
                  <Radar name="Candidate Score" dataKey="score" stroke="#6366F1" fill="#6366F1" fillOpacity={0.4} />
                  <Radar name="Role Avg Benchmark" dataKey="benchmarkAvg" stroke="#10B981" fill="#10B981" fillOpacity={0.2} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0B1120', borderColor: '#334155', fontSize: '11px' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side Job Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Configured Target Job Openings ({jobs.length})</h3>
          <button
            onClick={handleAddJob}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Another Job</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {comparisonResult?.comparisons.map((item, idx) => (
            <div key={item.job.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-semibold text-indigo-400">Rank #{item.fitRank}</span>
                  <button
                    onClick={() => handleRemoveJob(item.job.id)}
                    className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="mt-3 space-y-2">
                  <input
                    type="text"
                    value={item.job.title}
                    onChange={(e) => handleUpdateJob(item.job.id, 'title', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    value={item.job.company}
                    onChange={(e) => handleUpdateJob(item.job.id, 'company', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Score Pills */}
                <div className="mt-4 p-3 bg-slate-950 rounded-lg border border-slate-800/80">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-400">Overall Match:</span>
                    <span className="text-xl font-bold text-white">{item.analysis.scores.overall}%</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                    <div>Skill: <span className="text-slate-200 font-medium">{item.analysis.scores.skillOverlap}%</span></div>
                    <div>Proof: <span className="text-slate-200 font-medium">{item.analysis.scores.experienceEvidence}%</span></div>
                    <div>Project: <span className="text-slate-200 font-medium">{item.analysis.scores.projectRelevance}%</span></div>
                    <div>Semantic: <span className="text-slate-200 font-medium">{item.analysis.scores.semanticSimilarity}%</span></div>
                  </div>
                </div>

                {/* Strengths & Missing */}
                <div className="mt-4 space-y-2 text-xs">
                  <div>
                    <span className="text-[11px] font-medium text-emerald-400 block mb-1">Key Strengths Evidenced:</span>
                    <p className="text-slate-300">{item.keyStrengths.join(', ')}</p>
                  </div>
                  <div>
                    <span className="text-[11px] font-medium text-amber-400 block mb-1">Critical Skill Gaps:</span>
                    <p className="text-slate-300">{item.criticalMissingSkills.join(', ')}</p>
                  </div>
                </div>
              </div>

              {/* Editable Job Description Snippet */}
              <div className="mt-4 pt-3 border-t border-slate-800">
                <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Requirements Text</label>
                <textarea
                  value={item.job.description}
                  onChange={(e) => handleUpdateJob(item.job.id, 'description', e.target.value)}
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-[11px] font-mono text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
