/**
 * CareerLens AI — Privacy Controls & Local Storage Purge Modal
 */

import React from 'react';
import { Shield, Trash2, X, CheckCircle2, Lock, EyeOff } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurgeAll: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose, onPurgeAll }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-emerald-950/60 border border-emerald-800/60 rounded-lg text-emerald-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Privacy &amp; Data Control</h3>
              <p className="text-xs text-slate-400">Research Ethics &amp; Confidential Processing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4 text-xs text-slate-300">
          <div className="flex items-start space-x-3 p-3 bg-slate-950/80 rounded-lg border border-slate-800/80">
            <Lock className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-slate-200">Ephemeral In-Memory Processing</p>
              <p className="text-slate-400 mt-0.5">
                Uploaded resumes (PDF/DOCX) are parsed entirely in transient memory or browser session. No resume documents are retained on disk or stored permanently.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-slate-950/80 rounded-lg border border-slate-800/80">
            <EyeOff className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-slate-200">Zero Telemetry &amp; External Profiling</p>
              <p className="text-slate-400 mt-0.5">
                No third-party trackers, demographic aggregators, or telemetry beacons are embedded. Your resume text is never utilized to train public machine learning foundation models.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-slate-950/80 rounded-lg border border-slate-800/80">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-slate-200">Local Sandbox Storage</p>
              <p className="text-slate-400 mt-0.5">
                Roadmap checklist progress and recent comparison drafts reside solely within your local browser storage (<code className="text-cyan-300">localStorage</code>).
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              if (confirm('Are you sure you want to purge all active resume data and local session state?')) {
                onPurgeAll();
                onClose();
              }
            }}
            className="flex items-center space-x-1.5 px-3 py-2 text-xs font-medium text-rose-300 hover:text-white bg-rose-950/50 hover:bg-rose-900 border border-rose-800/60 rounded-md transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Purge All Active Session Data</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
