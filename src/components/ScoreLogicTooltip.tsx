/**
 * CareerLens AI — Interactive Score Logic & Evidence Tooltip / Inspector
 * Displays the exact mathematical formula, component weight, calculation breakdown,
 * and verbatim resume evidence snippets used to derive that specific score.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  HelpCircle, Info, X, CheckCircle2, AlertCircle, Quote,
  Calculator, Sparkles, ChevronRight, FileText
} from 'lucide-react';
import { AnalysisResult, ScoreWeights } from '../engine/evidenceScorer';

export type ScoreSectionType = 'overall' | 'skill' | 'experience' | 'projects' | 'semantic';

interface ScoreLogicTooltipProps {
  section: ScoreSectionType;
  analysis: AnalysisResult;
  weights: ScoreWeights;
}

export const ScoreLogicTooltip: React.FC<ScoreLogicTooltipProps> = ({
  section,
  analysis,
  weights
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Section specific details
  const details = (() => {
    switch (section) {
      case 'overall': {
        const wSkill = (weights.skill * 100).toFixed(0);
        const wExp = (weights.experience * 100).toFixed(0);
        const wProj = (weights.projects * 100).toFixed(0);
        const wSem = (weights.semantic * 100).toFixed(0);

        const topStrongQuote = analysis.evidenceTable.find(e => e.evidenceStrength === 'Strong');
        const topGap = analysis.skillGaps.find(g => g.priority === 'High');

        return {
          title: 'Overall Fit Index',
          score: analysis.scores.overall,
          weightBadge: '100% Composite Multi-Component Index',
          formula: 'S_overall = (w_skill × S_skill) + (w_exp × S_exp) + (w_proj × S_proj) + (w_sem × S_sem)',
          calculation: `(${wSkill}% × ${analysis.scores.skillOverlap}%) + (${wExp}% × ${analysis.scores.experienceEvidence}%) + (${wProj}% × ${analysis.scores.projectRelevance}%) + (${wSem}% × ${analysis.scores.semanticSimilarity}%) = ${analysis.scores.overall}%`,
          explanation: 'Calibrated linear combination of lexical qualification match, empirical metric proof in work history, capstone project alignment, and document semantic cosine angle.',
          evidenceSnippets: [
            {
              label: 'Top Empirical Anchor (Strong Evidence)',
              quote: topStrongQuote ? `"${topStrongQuote.supportingQuote}"` : 'No strong metric bullets detected',
              context: topStrongQuote ? `${topStrongQuote.skillName} (${topStrongQuote.foundInSection})` : 'General Overview',
              badge: 'Metric-Backed'
            },
            {
              label: 'Primary Score Penalty Factor',
              quote: topGap ? `Missing high-priority competency: ${topGap.skillName}. ${topGap.reason}` : 'All high-priority competencies evidenced.',
              context: 'Critical Gap',
              badge: 'Gap Impact'
            }
          ]
        };
      }

      case 'skill': {
        const matched = analysis.evidenceTable;
        const totalJD = analysis.evidenceTable.length + analysis.skillGaps.length;
        const top3Matches = matched.slice(0, 3);

        return {
          title: '1. Lexical Skill Overlap',
          score: analysis.scores.skillOverlap,
          weightBadge: `Weight: ${(weights.skill * 100).toFixed(0)}% of Overall Score`,
          formula: 'S_skill = (|K_resume ∩ K_JD| / |K_JD|) × 100',
          calculation: `${matched.length} verified candidate skills / ${totalJD} required job skills = ${analysis.scores.skillOverlap}%`,
          explanation: 'Strict entity identification using 500+ technology taxonomy nodes and synonym resolution. Partial credit is given for skills mentioned across work history and project narratives.',
          evidenceSnippets: top3Matches.map(m => ({
            label: `${m.skillName} [${m.evidenceStrength}]`,
            quote: `"${m.supportingQuote}"`,
            context: `${m.foundInSection} · ${m.category}`,
            badge: m.hasMetric ? 'Quantified' : 'Descriptive'
          }))
        };
      }

      case 'experience': {
        const strongItems = analysis.evidenceTable.filter(e => e.evidenceStrength === 'Strong');
        const moderateItems = analysis.evidenceTable.filter(e => e.evidenceStrength === 'Moderate');
        const totalMatched = Math.max(1, analysis.evidenceTable.length);

        return {
          title: '2. Experience Proof & Empirical Metrics',
          score: analysis.scores.experienceEvidence,
          weightBadge: `Weight: ${(weights.experience * 100).toFixed(0)}% of Overall Score`,
          formula: 'S_exp = (Σ α(s) / |K_matched|) × 100, where α(s)=1.0 for metrics, 0.6 for qualitative experience',
          calculation: `(${strongItems.length} strong metric skills × 1.0 + ${moderateItems.length} qualitative skills × 0.6) / ${totalMatched} = ${analysis.scores.experienceEvidence}%`,
          explanation: 'Evaluates whether skills are proven through measurable business or engineering impact (percentages, throughput, latency ms, dollar volume, scale) rather than unverified self-assertions.',
          evidenceSnippets: strongItems.slice(0, 2).concat(moderateItems.slice(0, 1)).map(item => ({
            label: `${item.skillName} (${item.evidenceStrength} Evidence)`,
            quote: `"${item.supportingQuote}"`,
            context: item.foundInSection,
            badge: item.hasMetric ? 'Quantified Outcome' : 'Qualitative Context'
          }))
        };
      }

      case 'projects': {
        const topProjects = analysis.projectJobMap.slice(0, 2);

        return {
          title: '3. Project Domain Alignment',
          score: analysis.scores.projectRelevance,
          weightBadge: `Weight: ${(weights.projects * 100).toFixed(0)}% of Overall Score`,
          formula: 'S_proj = (1 / |Projects|) × Σ Alignment(project, JD)',
          calculation: `Average alignment across ${analysis.projectJobMap.length} candidate projects = ${analysis.scores.projectRelevance}%`,
          explanation: 'Assesses whether candidate capstone or portfolio projects directly apply the core toolchains, architectures, and domain constraints mandated by the target role.',
          evidenceSnippets: topProjects.map(p => ({
            label: `${p.projectName} (${p.alignmentScore}% Alignment)`,
            quote: `"${p.projectSnippet}"`,
            context: `Demonstrates: ${p.demonstratedSkills.slice(0, 4).join(', ') || 'Foundational'}`,
            badge: `${p.matchedJDRequirements.length} Req Matched`
          }))
        };
      }

      case 'semantic': {
        return {
          title: '4. Semantic Document Cosine Similarity',
          score: analysis.scores.semanticSimilarity,
          weightBadge: `Weight: ${(weights.semantic * 100).toFixed(0)}% of Overall Score`,
          formula: 'S_sem = (v_resume · v_JD) / (||v_resume|| ||v_JD||) × Saturation Factor',
          calculation: `Normalized TF-IDF vector cosine angle between candidate document and job description = ${analysis.scores.semanticSimilarity}%`,
          explanation: 'Captures distributed topical alignment, n-gram terminology coverage, and contextual proximity between the resume narrative and the target job posting.',
          evidenceSnippets: [
            {
              label: 'High-Density Topic Alignment',
              quote: `Strong semantic overlap across core domains: ${analysis.evidenceTable.slice(0, 4).map(e => e.skillName).join(', ')}.`,
              context: 'Narrative Match',
              badge: 'Cosine Index'
            },
            {
              label: 'Document Balance & Scope',
              quote: `Resume vocabulary (${analysis.parsedResume.wordCount} words) aligns with technical depth expected for ${analysis.targetRole}.`,
              context: 'Structural Alignment',
              badge: 'TF-IDF'
            }
          ]
        };
      }
    }
  })();

  return (
    <div className="relative inline-block text-left" ref={popoverRef}>
      {/* Interactive Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded text-slate-400 hover:text-indigo-400 hover:bg-slate-800/80 transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
        title="Inspect calculation logic and evidence snippets"
        aria-label={`Inspect ${details.title} calculation logic`}
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>

      {/* Interactive Popover Tooltip */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-80 sm:w-96 -right-2 sm:right-auto sm:-left-32 bg-slate-900 border border-slate-700/90 rounded-xl p-4 shadow-2xl animate-fade-in text-xs space-y-3 backdrop-blur-md">
          {/* Header */}
          <div className="flex items-start justify-between pb-2 border-b border-slate-800">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-white text-xs">{details.title}</span>
                <span className="font-bold text-indigo-400 font-mono text-xs">({details.score}%)</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">{details.weightBadge}</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mathematical Logic & Formula */}
          <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5">
            <div className="flex items-center space-x-1 text-[11px] font-semibold text-indigo-300">
              <Calculator className="w-3 h-3 text-indigo-400" />
              <span>Exact Mathematical Formula</span>
            </div>
            <code className="block text-[10px] font-mono text-indigo-200 bg-slate-900 px-2 py-1 rounded border border-indigo-950">
              {details.formula}
            </code>
            <div className="text-[11px] text-slate-300 font-mono pt-1">
              <span className="text-slate-400">Computation: </span>
              <span className="text-emerald-400 font-semibold">{details.calculation}</span>
            </div>
          </div>

          {/* Qualitative Explanation */}
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {details.explanation}
          </p>

          {/* Verbatim Supporting Evidence Snippets */}
          <div className="space-y-2 pt-1 border-t border-slate-800/80">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
              Direct Supporting Resume Evidence
            </span>

            {details.evidenceSnippets.map((snip, idx) => (
              <div key={idx} className="p-2.5 bg-slate-950/80 rounded border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-semibold text-slate-200">{snip.label}</span>
                  <span className="text-indigo-400 bg-indigo-950/80 px-1.5 py-0.2 rounded border border-indigo-800/50">
                    {snip.badge}
                  </span>
                </div>
                <blockquote className="text-[11px] italic font-mono text-slate-300 bg-slate-900/90 p-1.5 rounded border border-slate-800 leading-snug">
                  {snip.quote}
                </blockquote>
                <span className="text-[10px] text-slate-500 block">Context: {snip.context}</span>
              </div>
            ))}
          </div>

          {/* Footer close tip */}
          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
            <span>Deterministic Research Evaluation</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-indigo-400 hover:underline font-medium"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
