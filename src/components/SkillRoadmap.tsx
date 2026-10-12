/**
 * CareerLens AI — Enhanced 30-Day Skill & Project Roadmap Component
 * Persists completion checkboxes and custom user milestones across sessions
 * using localStorage with role-scoped isolation, progress metrics, and celebration feedback.
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2, Circle, Clock, Plus, Trash2, RotateCcw,
  Sparkles, Award, CheckSquare, Calendar, ChevronDown, ChevronUp, Save
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RoadmapWeek } from '../engine/evidenceScorer';

export interface CustomMilestone {
  id: string;
  week: number;
  title: string;
  description: string;
  resourceType: 'Project' | 'Study' | 'Documentation' | 'Certification';
}

interface SkillRoadmapProps {
  roadmap: RoadmapWeek[];
  targetRole: string;
  onProgressChange?: (completedCount: number, totalCount: number) => void;
}

export const SkillRoadmap: React.FC<SkillRoadmapProps> = ({
  roadmap,
  targetRole,
  onProgressChange
}) => {
  // Safe storage slug for the target role
  const roleSlug = useMemo(() => {
    return (targetRole || 'default_role').toLowerCase().replace(/[^a-z0-9]/g, '_');
  }, [targetRole]);

  const storageKey = `careerlens_roadmap_completed_${roleSlug}`;
  const customTasksKey = `careerlens_roadmap_custom_${roleSlug}`;

  // Completed milestone state (keyed by milestone id: boolean)
  const [completed, setCompleted] = useState<Record<string, boolean>>(() => {
    try {
      // Try role-specific key first, then fallback to generic
      const saved = localStorage.getItem(storageKey) || localStorage.getItem('careerlens_roadmap_completed');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Custom user-added milestones
  const [customMilestones, setCustomMilestones] = useState<CustomMilestone[]>(() => {
    try {
      const saved = localStorage.getItem(customTasksKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Form state for adding custom milestone to a week
  const [addingWeek, setAddingWeek] = useState<number | null>(null);
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customDesc, setCustomDesc] = useState<string>('');
  const [customType, setCustomType] = useState<CustomMilestone['resourceType']>('Project');
  const [lastSavedTime, setLastSavedTime] = useState<string>('Synced');

  // Synchronize when targetRole changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setCompleted(JSON.parse(saved));
      } else {
        // Check global fallback
        const globalSaved = localStorage.getItem('careerlens_roadmap_completed');
        if (globalSaved) {
          setCompleted(JSON.parse(globalSaved));
        }
      }

      const savedCustom = localStorage.getItem(customTasksKey);
      if (savedCustom) {
        setCustomMilestones(JSON.parse(savedCustom));
      } else {
        setCustomMilestones([]);
      }
    } catch (e) {
      console.warn('Failed to load roadmap state for role:', e);
    }
  }, [storageKey, customTasksKey]);

  // Aggregate all milestones for each week (standard + custom)
  const combinedWeeks = useMemo(() => {
    return roadmap.map((week) => {
      const customForWeek = customMilestones.filter((c) => c.week === week.week);
      const allMilestones: Array<{
        id: string;
        title: string;
        description: string;
        completed: boolean;
        resourceType: 'Project' | 'Study' | 'Documentation' | 'Certification';
        isCustom?: boolean;
      }> = [
        ...week.milestones.map(m => ({ ...m, isCustom: false })),
        ...customForWeek.map((c) => ({
          id: c.id,
          title: c.title,
          description: c.description,
          completed: false,
          resourceType: c.resourceType,
          isCustom: true
        }))
      ];
      return {
        ...week,
        allMilestones
      };
    });
  }, [roadmap, customMilestones]);

  // Compute total milestones and completed count
  const { totalCount, completedCount, progressPercent, remainingHours } = useMemo(() => {
    let total = 0;
    let done = 0;
    let totalHours = 0;
    let doneHours = 0;

    combinedWeeks.forEach((week) => {
      const weekTotal = week.allMilestones.length;
      let weekDone = 0;
      week.allMilestones.forEach((m) => {
        total++;
        if (completed[m.id]) {
          done++;
          weekDone++;
        }
      });
      totalHours += week.estimatedHours;
      if (weekTotal > 0) {
        doneHours += (weekDone / weekTotal) * week.estimatedHours;
      }
    });

    const percent = total > 0 ? Math.round((done / total) * 100) : 0;
    const remaining = Math.max(0, Math.round(totalHours - doneHours));

    return {
      totalCount: total,
      completedCount: done,
      progressPercent: percent,
      remainingHours: remaining
    };
  }, [combinedWeeks, completed]);

  // Notify parent of progress changes
  useEffect(() => {
    if (onProgressChange) {
      onProgressChange(completedCount, totalCount);
    }
  }, [completedCount, totalCount, onProgressChange]);

  // Toggle single milestone
  const toggleMilestone = (id: string, weekIndex: number) => {
    const nextState = !completed[id];
    const updated = { ...completed, [id]: nextState };
    setCompleted(updated);

    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
      // Also update generic key for backwards compatibility
      localStorage.setItem('careerlens_roadmap_completed', JSON.stringify(updated));
      setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }

    // Trigger celebratory confetti if this action completed the week or entire roadmap
    if (nextState) {
      const targetWeek = combinedWeeks[weekIndex];
      const otherWeekMilestones = targetWeek.allMilestones.filter((m) => m.id !== id);
      const allOthersDone = otherWeekMilestones.every((m) => updated[m.id]);

      if (allOthersDone) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      }
    }
  };

  // Mark all tasks in a week as completed or uncompleted
  const handleToggleWeek = (weekNumber: number) => {
    const targetWeek = combinedWeeks.find((w) => w.week === weekNumber);
    if (!targetWeek) return;

    const allCurrentlyDone = targetWeek.allMilestones.every((m) => completed[m.id]);
    const updated = { ...completed };

    targetWeek.allMilestones.forEach((m) => {
      updated[m.id] = !allCurrentlyDone;
    });

    setCompleted(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
      localStorage.setItem('careerlens_roadmap_completed', JSON.stringify(updated));
      setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }

    if (!allCurrentlyDone) {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 }
      });
    }
  };

  // Reset all progress for this role
  const handleResetProgress = () => {
    if (confirm(`Reset all checklist progress for "${targetRole}"? This action cannot be undone.`)) {
      setCompleted({});
      try {
        localStorage.removeItem(storageKey);
        localStorage.setItem('careerlens_roadmap_completed', JSON.stringify({}));
        setLastSavedTime('Reset');
      } catch (e) {
        console.warn('LocalStorage removal error:', e);
      }
    }
  };

  // Add a custom task to a specific week
  const handleAddCustomMilestone = (week: number) => {
    if (!customTitle.trim()) return;

    const newTask: CustomMilestone = {
      id: `custom-w${week}-${Date.now()}`,
      week,
      title: customTitle.trim(),
      description: customDesc.trim() || 'Custom candidate milestone task.',
      resourceType: customType
    };

    const updated = [...customMilestones, newTask];
    setCustomMilestones(updated);

    try {
      localStorage.setItem(customTasksKey, JSON.stringify(updated));
      setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }

    setAddingWeek(null);
    setCustomTitle('');
    setCustomDesc('');
  };

  // Delete a custom task
  const handleDeleteCustomMilestone = (id: string) => {
    const updatedTasks = customMilestones.filter((c) => c.id !== id);
    setCustomMilestones(updatedTasks);

    const updatedCompleted = { ...completed };
    delete updatedCompleted[id];
    setCompleted(updatedCompleted);

    try {
      localStorage.setItem(customTasksKey, JSON.stringify(updatedTasks));
      localStorage.setItem(storageKey, JSON.stringify(updatedCompleted));
      localStorage.setItem('careerlens_roadmap_completed', JSON.stringify(updatedCompleted));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6 animate-fade-in">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h4 className="text-base font-semibold text-white tracking-tight">
              Personalized 30-Day Skill &amp; Project Roadmap
            </h4>
            <span className="text-xs text-indigo-400 font-mono">· Auto-saved</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Structured into 4 weekly sprints targeted to your priority skill gaps. Checkboxes persist automatically across sessions in your browser storage.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
            <Save className="w-3 h-3 text-emerald-400" />
            <span>Saved in localStorage</span>
            <span className="text-slate-600">({lastSavedTime})</span>
          </div>

          <button
            onClick={handleResetProgress}
            className="flex items-center space-x-1 text-xs text-slate-400 hover:text-rose-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800 hover:border-rose-900 transition-colors"
            title="Reset checklist progress for this role"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Progress Metric Banner */}
      <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center space-x-2">
            <CheckSquare className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold text-slate-200">
              Roadmap Completion Progress: {completedCount} of {totalCount} Milestones Done ({progressPercent}%)
            </span>
          </div>
          <div className="flex items-center space-x-3 text-xs text-slate-400">
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Est. Remaining Study: ~{remainingHours} hrs</span>
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              progressPercent === 100
                ? 'bg-emerald-500'
                : progressPercent >= 50
                ? 'bg-indigo-500'
                : 'bg-indigo-600/80'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {progressPercent === 100 && (
          <div className="mt-3 p-2 bg-emerald-950/60 border border-emerald-800/60 rounded text-xs text-emerald-300 flex items-center space-x-2">
            <Award className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Outstanding work! All 30-day curriculum milestones for {targetRole} have been completed.</span>
          </div>
        )}
      </div>

      {/* 4 Weekly Sprints Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {combinedWeeks.map((week, weekIdx) => {
          const weekDoneCount = week.allMilestones.filter((m) => completed[m.id]).length;
          const weekTotal = week.allMilestones.length;
          const isWeekComplete = weekTotal > 0 && weekDoneCount === weekTotal;

          return (
            <div
              key={week.week}
              className={`p-4 bg-slate-950 border rounded-lg flex flex-col justify-between transition-colors ${
                isWeekComplete ? 'border-emerald-800/60' : 'border-slate-800'
              }`}
            >
              <div>
                {/* Week Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 gap-2">
                  <div className="flex items-center space-x-2.5">
                    <span
                      className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center ${
                        isWeekComplete
                          ? 'bg-emerald-600 text-white'
                          : 'bg-indigo-600/30 text-indigo-400 border border-indigo-500/30'
                      }`}
                    >
                      W{week.week}
                    </span>
                    <div>
                      <h5 className="font-semibold text-white text-xs">{week.theme}</h5>
                      <span className="text-[11px] text-slate-400 block">
                        {weekDoneCount}/{weekTotal} done · ~{week.estimatedHours} hrs study
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleWeek(week.week)}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium px-2 py-0.5 rounded hover:bg-slate-900 border border-slate-800 transition-colors"
                      title={isWeekComplete ? 'Uncheck all for this week' : 'Mark all in this week as done'}
                    >
                      {isWeekComplete ? 'Uncheck' : 'Done All'}
                    </button>

                    <button
                      onClick={() => setAddingWeek(addingWeek === week.week ? null : week.week)}
                      className="text-[11px] text-slate-400 hover:text-slate-200 px-2 py-0.5 rounded hover:bg-slate-900 border border-slate-800 transition-colors flex items-center space-x-0.5"
                      title="Add a custom milestone to this week"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>

                {/* Focus skills */}
                <div className="mt-2.5 mb-3 flex flex-wrap items-baseline gap-1 text-[11px]">
                  <span className="text-slate-500">Focus Skills:</span>
                  <span className="text-indigo-300 font-medium">{week.targetSkills.join(', ')}</span>
                </div>

                {/* Milestones Checklist */}
                <div className="space-y-2 mt-2">
                  {week.allMilestones.map((milestone) => {
                    const isDone = Boolean(completed[milestone.id]);

                    return (
                      <div
                        key={milestone.id}
                        className={`p-2.5 rounded border transition-colors flex items-start space-x-2.5 group ${
                          isDone
                            ? 'bg-emerald-950/25 border-emerald-800/40 text-slate-400'
                            : 'bg-slate-900/90 border-slate-800 text-slate-200 hover:border-slate-700'
                        }`}
                      >
                        {/* Checkbox */}
                        <button
                          type="button"
                          onClick={() => toggleMilestone(milestone.id, weekIdx)}
                          className="mt-0.5 text-indigo-400 hover:text-indigo-300 shrink-0 cursor-pointer"
                          aria-label={`Toggle milestone ${milestone.title}`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-600 hover:text-indigo-400" />
                          )}
                        </button>

                        <div
                          className="flex-1 text-xs cursor-pointer select-none"
                          onClick={() => toggleMilestone(milestone.id, weekIdx)}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`font-medium ${
                                isDone ? 'line-through text-slate-500' : 'text-slate-100'
                              }`}
                            >
                              {milestone.title}
                            </span>
                            <span className="text-[10px] text-slate-500 uppercase px-1.5 py-0.2 rounded bg-slate-950">
                              {milestone.resourceType}
                            </span>
                          </div>
                          <p className={`text-[11px] mt-0.5 ${isDone ? 'text-slate-600' : 'text-slate-400'}`}>
                            {milestone.description}
                          </p>
                        </div>

                        {/* Delete button if custom task */}
                        {'isCustom' in milestone && milestone.isCustom && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCustomMilestone(milestone.id);
                            }}
                            className="text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 p-1 transition-opacity"
                            title="Delete custom task"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Add Custom Task Form (if open for this week) */}
                {addingWeek === week.week && (
                  <div className="mt-3 p-3 bg-slate-900 border border-indigo-900/60 rounded-lg space-y-2 animate-fade-in text-xs">
                    <span className="font-semibold text-slate-200 block text-[11px]">
                      Add Custom Milestone to Week {week.week}
                    </span>
                    <input
                      type="text"
                      placeholder="Milestone Title (e.g. Build FAISS index for PDF search)"
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      placeholder="Optional details or repo deliverables"
                      value={customDesc}
                      onChange={(e) => setCustomDesc(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <div className="flex items-center justify-between pt-1">
                      <select
                        value={customType}
                        onChange={(e) => setCustomType(e.target.value as any)}
                        className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[11px] text-slate-300 focus:outline-none"
                      >
                        <option value="Project">Project</option>
                        <option value="Study">Study</option>
                        <option value="Documentation">Documentation</option>
                        <option value="Certification">Certification</option>
                      </select>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => setAddingWeek(null)}
                          className="px-2 py-1 text-[11px] text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddCustomMilestone(week.week)}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[11px] font-medium"
                        >
                          Save Task
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
