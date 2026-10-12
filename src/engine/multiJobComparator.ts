/**
 * CareerLens AI — Multi-Job Comparison Engine
 * Evaluates a single resume across multiple job descriptions simultaneously,
 * calculating relative fitness, comparative skill overlap, and trade-off matrices.
 */

import { ParsedResume } from './resumeParser';
import { analyzeResumeAndJob, AnalysisResult, ScoreWeights, DEFAULT_WEIGHTS } from './evidenceScorer';

export interface JobInput {
  id: string;
  title: string;
  company: string;
  description: string;
}

export interface JobComparisonItem {
  job: JobInput;
  analysis: AnalysisResult;
  fitRank: number;
  keyStrengths: string[];
  criticalMissingSkills: string[];
  radarData: {
    dimension: string;
    score: number;
    benchmarkAvg: number;
  }[];
}

export interface MultiJobComparisonResult {
  candidateRole: string;
  comparisons: JobComparisonItem[];
  bestFitJob: JobInput;
  recommendationSummary: string;
}

export function compareMultipleJobs(
  parsedResume: ParsedResume,
  jobs: JobInput[],
  weights: ScoreWeights = DEFAULT_WEIGHTS
): MultiJobComparisonResult {
  const analyses = jobs.map(job => {
    const analysis = analyzeResumeAndJob(parsedResume, job.description, `${job.title} at ${job.company}`, weights);
    return { job, analysis };
  });

  // Sort by overall score descending
  analyses.sort((a, b) => b.analysis.scores.overall - a.analysis.scores.overall);

  const totalJobs = analyses.length;
  const avgOverall = Math.round(analyses.reduce((sum, a) => sum + a.analysis.scores.overall, 0) / (totalJobs || 1));
  const avgSkill = Math.round(analyses.reduce((sum, a) => sum + a.analysis.scores.skillOverlap, 0) / (totalJobs || 1));
  const avgExp = Math.round(analyses.reduce((sum, a) => sum + a.analysis.scores.experienceEvidence, 0) / (totalJobs || 1));
  const avgProj = Math.round(analyses.reduce((sum, a) => sum + a.analysis.scores.projectRelevance, 0) / (totalJobs || 1));
  const avgSem = Math.round(analyses.reduce((sum, a) => sum + a.analysis.scores.semanticSimilarity, 0) / (totalJobs || 1));

  const comparisons: JobComparisonItem[] = analyses.map(({ job, analysis }, index) => {
    const keyStrengths = analysis.evidenceTable
      .filter(e => e.evidenceStrength === 'Strong')
      .slice(0, 4)
      .map(e => e.skillName);

    const criticalMissingSkills = analysis.skillGaps
      .filter(g => g.priority === 'High')
      .slice(0, 4)
      .map(g => g.skillName);

    const radarData = [
      { dimension: 'Skill Overlap', score: analysis.scores.skillOverlap, benchmarkAvg: avgSkill },
      { dimension: 'Experience Proof', score: analysis.scores.experienceEvidence, benchmarkAvg: avgExp },
      { dimension: 'Project Alignment', score: analysis.scores.projectRelevance, benchmarkAvg: avgProj },
      { dimension: 'Semantic Match', score: analysis.scores.semanticSimilarity, benchmarkAvg: avgSem },
      { dimension: 'Overall Fit', score: analysis.scores.overall, benchmarkAvg: avgOverall }
    ];

    return {
      job,
      analysis,
      fitRank: index + 1,
      keyStrengths: keyStrengths.length > 0 ? keyStrengths : ['General CS foundations'],
      criticalMissingSkills: criticalMissingSkills.length > 0 ? criticalMissingSkills : ['None (Strong alignment)'],
      radarData
    };
  });

  const best = comparisons[0];
  const recommendationSummary = best
    ? `Based on deterministic evidence analysis, "${best.job.title}" at ${best.job.company} represents the highest empirical alignment (${best.analysis.scores.overall}%). Key demonstrated strengths include ${best.keyStrengths.join(', ')}.`
    : 'No job descriptions provided for comparison.';

  return {
    candidateRole: parsedResume.sections.summary?.slice(0, 60) || 'Candidate Profile',
    comparisons,
    bestFitJob: best?.job || jobs[0],
    recommendationSummary
  };
}
