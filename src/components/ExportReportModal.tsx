/**
 * CareerLens AI — Structured PDF Report Export Modal
 * Allows candidates and examiners to configure and download a comprehensive,
 * multi-page, evidence-backed evaluation audit report.
 */

import React, { useState } from 'react';
import {
  Download, FileText, CheckCircle2, X, Sliders, Shield, BookOpen, Layers, Sparkles
} from 'lucide-react';
import { AnalysisResult } from '../engine/evidenceScorer';
import { exportAuditReportPDF, PDFExportOptions } from '../utils/pdfExport';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: AnalysisResult;
  completedMilestones: Record<string, boolean>;
  onSuccess?: () => void;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  analysis,
  completedMilestones,
  onSuccess
}) => {
  const [candidateName, setCandidateName] = useState<string>(() => {
    return analysis.parsedResume.contact.email?.split('@')[0] || 'Candidate';
  });
  const [includeEvidenceTable, setIncludeEvidenceTable] = useState<boolean>(true);
  const [includeSkillGaps, setIncludeSkillGaps] = useState<boolean>(true);
  const [includeClaimAudits, setIncludeClaimAudits] = useState<boolean>(true);
  const [includeATSAudit, setIncludeATSAudit] = useState<boolean>(true);
  const [includeProjectMap, setIncludeProjectMap] = useState<boolean>(true);
  const [includeCounterfactual, setIncludeCounterfactual] = useState<boolean>(true);
  const [includeRoadmap, setIncludeRoadmap] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setIsExporting(true);
    try {
      const options: PDFExportOptions = {
        candidateName: candidateName.trim() || 'Candidate',
        completedMilestones,
        sections: {
          includeEvidenceTable,
          includeSkillGaps,
          includeClaimAudits,
          includeATSAudit,
          includeProjectMap,
          includeCounterfactual,
          includeRoadmap
        }
      };

      exportAuditReportPDF(analysis, options);
      if (onSuccess) onSuccess();
      onClose();
    } catch (e) {
      console.error('PDF export error:', e);
      alert('Failed to generate PDF report. Check browser console.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-5">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-950/70 border border-indigo-800/60 rounded-lg text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white tracking-tight">
                Export Structured Audit Report
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Generate an academic-grade, evidence-linked PDF documentation file.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Candidate & Target Role Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-slate-300 font-medium block mb-1.5">Candidate Name / Title</label>
            <input
              type="text"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              placeholder="e.g. Aarav Sharma"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
            />
          </div>

          <div>
            <label className="text-slate-300 font-medium block mb-1.5">Evaluated Target Role</label>
            <input
              type="text"
              disabled
              value={analysis.targetRole}
              className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-400 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Section Inclusions Checklist */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-200 block">
            Report Sections to Include
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <label className="flex items-center space-x-2 p-2 bg-slate-950/70 border border-slate-800 rounded-lg cursor-pointer hover:border-slate-700 transition-colors">
              <input
                type="checkbox"
                checked={includeEvidenceTable}
                onChange={(e) => setIncludeEvidenceTable(e.target.checked)}
                className="accent-indigo-500 rounded"
              />
              <span className="text-slate-300">1. Evidence Citations Table ({analysis.evidenceTable.length})</span>
            </label>

            <label className="flex items-center space-x-2 p-2 bg-slate-950/70 border border-slate-800 rounded-lg cursor-pointer hover:border-slate-700 transition-colors">
              <input
                type="checkbox"
                checked={includeSkillGaps}
                onChange={(e) => setIncludeSkillGaps(e.target.checked)}
                className="accent-indigo-500 rounded"
              />
              <span className="text-slate-300">2. Prioritized Skill Gaps ({analysis.skillGaps.length})</span>
            </label>

            <label className="flex items-center space-x-2 p-2 bg-slate-950/70 border border-slate-800 rounded-lg cursor-pointer hover:border-slate-700 transition-colors">
              <input
                type="checkbox"
                checked={includeClaimAudits}
                onChange={(e) => setIncludeClaimAudits(e.target.checked)}
                className="accent-indigo-500 rounded"
              />
              <span className="text-slate-300">3. Empirical Claim Auditor</span>
            </label>

            <label className="flex items-center space-x-2 p-2 bg-slate-950/70 border border-slate-800 rounded-lg cursor-pointer hover:border-slate-700 transition-colors">
              <input
                type="checkbox"
                checked={includeATSAudit}
                onChange={(e) => setIncludeATSAudit(e.target.checked)}
                className="accent-indigo-500 rounded"
              />
              <span className="text-slate-300">4. ATS Readability &amp; Ingestion</span>
            </label>

            <label className="flex items-center space-x-2 p-2 bg-slate-950/70 border border-slate-800 rounded-lg cursor-pointer hover:border-slate-700 transition-colors">
              <input
                type="checkbox"
                checked={includeProjectMap}
                onChange={(e) => setIncludeProjectMap(e.target.checked)}
                className="accent-indigo-500 rounded"
              />
              <span className="text-slate-300">5. Project-to-Job Alignment</span>
            </label>

            <label className="flex items-center space-x-2 p-2 bg-slate-950/70 border border-slate-800 rounded-lg cursor-pointer hover:border-slate-700 transition-colors">
              <input
                type="checkbox"
                checked={includeCounterfactual}
                onChange={(e) => setIncludeCounterfactual(e.target.checked)}
                className="accent-indigo-500 rounded"
              />
              <span className="text-slate-300">6. Counterfactual Coach (XYZ)</span>
            </label>

            <label className="flex items-center space-x-2 p-2 bg-slate-950/70 border border-slate-800 rounded-lg cursor-pointer hover:border-slate-700 transition-colors sm:col-span-2">
              <input
                type="checkbox"
                checked={includeRoadmap}
                onChange={(e) => setIncludeRoadmap(e.target.checked)}
                className="accent-indigo-500 rounded"
              />
              <span className="text-slate-300">7. 30-Day Personalized Roadmap (With persistent completion states)</span>
            </label>
          </div>
        </div>

        {/* Quality Guarantee Notice */}
        <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-[11px] text-slate-400 flex items-start space-x-2.5">
          <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-300">Evidence Integrity Standard: </span>
            Every qualification cited in the exported PDF includes exact sentence quotes and line context from the candidate resume. No fabricated scores or AI hallucinations.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={isExporting}
            className="flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white text-xs font-semibold rounded-lg shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Compiling PDF Report...' : 'Download Structured PDF Report'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
