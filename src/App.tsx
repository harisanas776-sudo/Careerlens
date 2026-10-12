/**
 * CareerLens AI — Explainable Resume Intelligence & Skill Gap Analyzer
 * B.Tech CSE (AI) Final-Year Capstone Project Application
 */

import React, { useState } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { AnalyzerView } from './components/AnalyzerView';
import { MultiJobView } from './components/MultiJobView';
import { ResearchLabView } from './components/ResearchLabView';
import { AcademicDeliverablesView } from './components/AcademicDeliverablesView';
import { PrivacyModal } from './components/PrivacyModal';
import { AnalysisResult, ScoreWeights, analyzeResumeAndJob } from './engine/evidenceScorer';
import { parseResumeStructure } from './engine/resumeParser';
import { SAMPLE_PROFILES } from './data/sampleData';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('analyzer');
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(() => {
    const demo = SAMPLE_PROFILES[0];
    const parsed = parseResumeStructure(demo.resumeText);
    return analyzeResumeAndJob(parsed, demo.jobDescription, demo.targetRole);
  });
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleAnalyze = async (
    resumeText: string,
    jdText: string,
    role: string,
    weights: ScoreWeights
  ): Promise<AnalysisResult> => {
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          jobDescription: jdText,
          targetRole: role,
          weights
        })
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        setCurrentAnalysis(data.analysis);
        showNotification('Analysis computed successfully with verified citations.');
        return data.analysis;
      }
    } catch (e) {
      console.warn('Backend API request fell back to client-side deterministic engine:', e);
    }

    // Client-side fallback
    const parsed = parseResumeStructure(resumeText);
    const result = analyzeResumeAndJob(parsed, jdText, role, weights);
    setCurrentAnalysis(result);
    showNotification('Analysis computed successfully via explainable engine.');
    return result;
  };

  const handleLoadSample = (sampleId: string) => {
    const sample = SAMPLE_PROFILES.find(s => s.id === sampleId) || SAMPLE_PROFILES[0];
    const parsed = parseResumeStructure(sample.resumeText);
    const result = analyzeResumeAndJob(parsed, sample.jobDescription, sample.targetRole);
    setCurrentAnalysis(result);
    setActiveTab('analyzer');
    showNotification(`Loaded demo profile: ${sample.candidateName} (${sample.targetRole})`);
  };

  const handlePurgeAll = () => {
    localStorage.removeItem('careerlens_roadmap_completed');
    setCurrentAnalysis(null);
    showNotification('All local session caches and active resume data successfully purged.');
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-950/95 border border-indigo-700/80 text-indigo-200 px-4 py-2.5 rounded-lg shadow-2xl text-xs flex items-center space-x-2 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{notification}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onLoadSample={handleLoadSample}
        isAnalyzing={false}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'analyzer' && (
          <AnalyzerView
            onAnalyze={handleAnalyze}
            initialAnalysis={currentAnalysis}
          />
        )}

        {activeTab === 'compare' && (
          <MultiJobView />
        )}

        {activeTab === 'research' && (
          <ResearchLabView />
        )}

        {activeTab === 'academic' && (
          <AcademicDeliverablesView />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#0B1120] py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-400">CareerLens AI</span>
            <span>·</span>
            <span>Final Year B.Tech CSE (AI) Capstone Project</span>
          </div>

          <div className="flex items-center space-x-4 text-slate-400">
            <span>Deterministic Scoring</span>
            <span>·</span>
            <span>Evidence-Linked NLP</span>
            <span>·</span>
            <button onClick={() => setIsPrivacyOpen(true)} className="hover:text-white underline">
              Confidentiality Notice
            </button>
          </div>
        </div>
      </footer>

      {/* Privacy Control Modal */}
      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        onPurgeAll={handlePurgeAll}
      />
    </div>
  );
}
