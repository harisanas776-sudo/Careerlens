/**
 * CareerLens AI — Primary Header & Navigation Bar
 * Follows zero-pill discipline and domain-native research aesthetic.
 */

import React from 'react';
import { Sparkles, FileText, BarChart3, BookOpen, Layers, Shield, RefreshCw } from 'lucide-react';

export type ActiveTab = 'analyzer' | 'compare' | 'research' | 'academic';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenPrivacy: () => void;
  onLoadSample: (sampleId: string) => void;
  isAnalyzing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onOpenPrivacy,
  onLoadSample,
  isAnalyzing
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#0B1120]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Project Metadata */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <span className="font-bold text-base tracking-wider">CL</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-white text-base tracking-tight">CareerLens AI</span>
                <span className="text-xs text-slate-400 font-normal">· Final Year B.Tech CSE (AI)</span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Explainable Resume Intelligence &amp; Skill Gap Prioritization
              </p>
            </div>
          </div>

          {/* Navigation Segmented Controls */}
          <nav className="flex items-center p-1 bg-slate-900/90 border border-slate-800 rounded-lg">
            <button
              onClick={() => onTabChange('analyzer')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'analyzer'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Resume Intelligence</span>
            </button>

            <button
              onClick={() => onTabChange('compare')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'compare'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Multi-Job Compare</span>
            </button>

            <button
              onClick={() => onTabChange('research')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'research'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Evaluation Lab</span>
            </button>

            <button
              onClick={() => onTabChange('academic')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'academic'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Academic Deliverables</span>
            </button>
          </nav>

          {/* Action Tools & Privacy Control */}
          <div className="flex items-center space-x-2">
            {/* Quick Demo Selector */}
            <div className="relative hidden md:block">
              <select
                onChange={(e) => {
                  if (e.target.value) onLoadSample(e.target.value);
                }}
                defaultValue=""
                className="text-xs bg-slate-900 border border-slate-700 text-slate-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="" disabled>Load Demo Profile...</option>
                <option value="demo-ai-engineer">Demo 1: ML Engineer (Aarav)</option>
                <option value="demo-fullstack-dev">Demo 2: Full-Stack Dev (Priya)</option>
                <option value="demo-data-analyst">Demo 3: Data Analyst (Rohan)</option>
              </select>
            </div>

            <button
              onClick={onOpenPrivacy}
              title="Privacy & Data Control"
              className="flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-md hover:bg-slate-800 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Privacy</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
