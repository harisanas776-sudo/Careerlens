/**
 * CareerLens AI — Professional Structured PDF Report Generator
 * Generates an executive, multi-page, evidence-backed technical audit report using jsPDF.
 */

import { jsPDF } from 'jspdf';
import { AnalysisResult } from '../engine/evidenceScorer';

export interface PDFExportOptions {
  candidateName?: string;
  completedMilestones?: Record<string, boolean>;
  sections?: {
    includeEvidenceTable?: boolean;
    includeSkillGaps?: boolean;
    includeClaimAudits?: boolean;
    includeATSAudit?: boolean;
    includeProjectMap?: boolean;
    includeCounterfactual?: boolean;
    includeRoadmap?: boolean;
  };
}

export function exportAuditReportPDF(
  analysis: AnalysisResult,
  optionsOrName?: string | PDFExportOptions,
  legacyCompletedMilestones?: Record<string, boolean>
) {
  let candidateName = 'Candidate';
  let completedMilestones: Record<string, boolean> = {};
  let sections = {
    includeEvidenceTable: true,
    includeSkillGaps: true,
    includeClaimAudits: true,
    includeATSAudit: true,
    includeProjectMap: true,
    includeCounterfactual: true,
    includeRoadmap: true
  };

  if (typeof optionsOrName === 'string') {
    candidateName = optionsOrName || analysis.parsedResume.contact.email?.split('@')[0] || 'Candidate';
    completedMilestones = legacyCompletedMilestones || {};
  } else if (optionsOrName && typeof optionsOrName === 'object') {
    candidateName = optionsOrName.candidateName || analysis.parsedResume.contact.email?.split('@')[0] || 'Candidate';
    completedMilestones = optionsOrName.completedMilestones || {};
    if (optionsOrName.sections) {
      sections = { ...sections, ...optionsOrName.sections };
    }
  }

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 14;
  const contentWidth = pageWidth - (marginX * 2);

  const role = analysis.targetRole || 'Target Role';
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const timeStr = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Color Palette
  const darkNavy = [11, 17, 32] as const;
  const darkCard = [15, 23, 42] as const;
  const slateText = [71, 85, 105] as const;
  const lightSlate = [148, 163, 184] as const;
  const indigo = [99, 102, 241] as const;
  const emerald = [16, 185, 129] as const;
  const rose = [225, 29, 72] as const;
  const amber = [217, 119, 6] as const;

  let y = 14;

  // Helper function to check page overflow and add new page if needed
  const ensureSpace = (requiredHeight: number) => {
    if (y + requiredHeight > pageHeight - 18) {
      doc.addPage();
      // Render subtle header on continued pages
      doc.setFillColor(248, 250, 252);
      doc.rect(0, 0, pageWidth, 12, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(lightSlate[0], lightSlate[1], lightSlate[2]);
      doc.text(`CareerLens AI Audit Report  |  Candidate: ${candidateName}  |  Role: ${role}`, marginX, 8);
      y = 18;
    }
  };

  // --- PAGE 1: COVER HEADER BANNER ---
  doc.setFillColor(darkCard[0], darkCard[1], darkCard[2]);
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Brand Badge
  doc.setFillColor(indigo[0], indigo[1], indigo[2]);
  doc.roundedRect(marginX, 8, 8, 8, 1.5, 1.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('CL', marginX + 1.8, 13.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('CareerLens AI — Candidate Intelligence Report', marginX + 12, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225);
  doc.text('Explainable Resume Intelligence, Empirical Evidence Verification & Skill Gap Audit', marginX + 12, 20);

  // Metadata ribbon inside header
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`Candidate: ${candidateName}   |   Target Role: ${role}   |   Date: ${dateStr} ${timeStr}`, marginX, 33);
  doc.text(`Evaluation ID: ${analysis.id}   |   ATS Score: ${analysis.atsAudit.score}/100 (${analysis.atsAudit.verdict})`, marginX, 38);

  y = 50;

  // --- SECTION 1: EXECUTIVE MATCH SCORES & CALCULATION ---
  ensureSpace(45);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('1. Executive Match Score & Mathematical Formulation', marginX, y);
  y += 6;

  // Overall Score Highlight Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(marginX, y, contentWidth, 22, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  const scoreColor = analysis.scores.overall >= 75 ? emerald : analysis.scores.overall >= 50 ? indigo : amber;
  doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.text(`${analysis.scores.overall}%`, marginX + 6, y + 14);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('Overall Evidence-Linked Fit Index', marginX + 32, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.text(
    analysis.scores.overall >= 75
      ? 'Strong Empirical Alignment: Technical qualifications backed by verifiable metrics and project proof.'
      : analysis.scores.overall >= 50
      ? 'Moderate Alignment: Key foundational skills present, but critical tooling gaps require evidence grounding.'
      : 'Early Alignment: Significant core competencies required for target position are missing or unevidenced.',
    marginX + 32,
    y + 14
  );

  y += 28;

  // 4 Components Table
  ensureSpace(28);
  const colW = contentWidth / 4;
  const components = [
    { name: '1. Skill Overlap', score: `${analysis.scores.skillOverlap}%`, weight: `${(analysis.weightsUsed.skill * 100).toFixed(0)}% weight`, sub: `${analysis.evidenceTable.length} skills matched` },
    { name: '2. Experience Proof', score: `${analysis.scores.experienceEvidence}%`, weight: `${(analysis.weightsUsed.experience * 100).toFixed(0)}% weight`, sub: 'Quantified metrics' },
    { name: '3. Project Alignment', score: `${analysis.scores.projectRelevance}%`, weight: `${(analysis.weightsUsed.projects * 100).toFixed(0)}% weight`, sub: `${analysis.projectJobMap.length} projects mapped` },
    { name: '4. Semantic Cosine', score: `${analysis.scores.semanticSimilarity}%`, weight: `${(analysis.weightsUsed.semantic * 100).toFixed(0)}% weight`, sub: 'TF-IDF vector angle' }
  ];

  components.forEach((c, idx) => {
    const boxX = marginX + (idx * colW);
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(boxX, y, colW - 2, 16, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
    doc.text(c.name, boxX + 3, y + 5);

    doc.setFontSize(12);
    doc.setTextColor(indigo[0], indigo[1], indigo[2]);
    doc.text(c.score, boxX + 3, y + 11);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(lightSlate[0], lightSlate[1], lightSlate[2]);
    doc.text(`${c.weight} · ${c.sub}`, boxX + 3, y + 14.5);
  });

  y += 20;

  // Formula Note
  ensureSpace(12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.text(`Active Mathematical Formula: ${analysis.scoringExplanation.formula}`, marginX, y);
  y += 8;

  // --- SECTION 2: VERIFIED EVIDENCE CITATIONS TABLE ---
  if (sections.includeEvidenceTable) {
    ensureSpace(35);
    doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`2. Verified Evidence Citations (${analysis.evidenceTable.length} Matched Skills)`, marginX, y);
    y += 6;

    const evidenceItems = analysis.evidenceTable.slice(0, 8); // Top evidenced skills
    evidenceItems.forEach((ev, idx) => {
      ensureSpace(18);
      const isStrong = ev.evidenceStrength === 'Strong';
      const strengthColor = isStrong ? emerald : ev.evidenceStrength === 'Moderate' ? indigo : slateText;

      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(marginX, y, contentWidth, 14, 1.5, 1.5, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
      doc.text(`${idx + 1}. ${ev.skillName} (${ev.category})`, marginX + 3, y + 4.5);

      doc.setFontSize(7.5);
      doc.setTextColor(strengthColor[0], strengthColor[1], strengthColor[2]);
      doc.text(`[${ev.evidenceStrength.toUpperCase()} EVIDENCE] ${ev.hasMetric ? '· Metric Quantified' : '· Descriptive'}`, marginX + 60, y + 4.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(slateText[0], slateText[1], slateText[2]);
      const quoteLines = doc.splitTextToSize(`"${ev.supportingQuote}" (${ev.foundInSection})`, contentWidth - 8);
      doc.text(quoteLines, marginX + 3, y + 9);

      y += 16;
    });
    y += 4;
  }

  // --- SECTION 3: PRIORITIZED SKILL GAPS ---
  if (sections.includeSkillGaps) {
    ensureSpace(30);
    doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`3. Prioritized Skill Gaps & Recommended Sequence (${analysis.skillGaps.length} Gaps)`, marginX, y);
    y += 6;

    analysis.skillGaps.slice(0, 6).forEach((gap, idx) => {
      ensureSpace(16);
      const gapColor = gap.priority === 'High' ? rose : gap.priority === 'Medium' ? amber : slateText;

      doc.setFillColor(gap.priority === 'High' ? 254 : 248, gap.priority === 'High' ? 242 : 250, gap.priority === 'High' ? 242 : 252);
      doc.setDrawColor(gap.priority === 'High' ? 254 : 226, gap.priority === 'High' ? 205 : 232, gap.priority === 'High' ? 211 : 240);
      doc.roundedRect(marginX, y, contentWidth, 13, 1.5, 1.5, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(gapColor[0], gapColor[1], gapColor[2]);
      doc.text(`[${gap.priority.toUpperCase()} PRIORITY] ${gap.skillName}`, marginX + 3, y + 4.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(slateText[0], slateText[1], slateText[2]);
      doc.text(`Target Roadmap Sprint: Week ${gap.recommendedWeekInRoadmap}  |  Mentioned ${gap.mentionedInJDCount}x in Job Description`, marginX + 70, y + 4.5);

      const reasonLines = doc.splitTextToSize(`Reason: ${gap.reason}`, contentWidth - 8);
      doc.text(reasonLines, marginX + 3, y + 9);

      y += 15;
    });
    y += 4;
  }

  // --- SECTION 4: EMPIRICAL CLAIM EVIDENCE AUDITOR ---
  if (sections.includeClaimAudits && analysis.claimAudits.length > 0) {
    ensureSpace(35);
    doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('4. Empirical Claim Evidence Auditor & Google XYZ Formulations', marginX, y);
    y += 6;

    analysis.claimAudits.slice(0, 4).forEach((claim, idx) => {
      ensureSpace(22);
      const isEvidenced = claim.verdict === 'Well Evidenced';
      const statusColor = isEvidenced ? emerald : amber;

      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(marginX, y, contentWidth, 18, 1.5, 1.5, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
      doc.text(`Statement #${idx + 1}: [${claim.verdict.toUpperCase()}]`, marginX + 3, y + 4.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
      const statement = doc.splitTextToSize(`"${claim.originalText}"`, contentWidth - 8);
      doc.text(statement, marginX + 3, y + 8.5);

      if (!isEvidenced) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(7);
        doc.setTextColor(indigo[0], indigo[1], indigo[2]);
        const rec = doc.splitTextToSize(`Recommended XYZ rewrite: "${claim.suggestedRewrite}"`, contentWidth - 8);
        doc.text(rec, marginX + 3, y + 14);
      }

      y += 20;
    });
    y += 4;
  }

  // --- SECTION 5: ATS READABILITY & INGESTION AUDIT ---
  if (sections.includeATSAudit) {
    ensureSpace(35);
    doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`5. ATS Readability & Structural Compliance Audit (${analysis.atsAudit.score}/100)`, marginX, y);
    y += 6;

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(marginX, y, contentWidth, 24, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
    doc.text('Key Ingestion Checkpoints:', marginX + 3, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(slateText[0], slateText[1], slateText[2]);
    doc.text(`• Contact Ingestion: Email (${analysis.atsAudit.contactCompleteness.hasEmail ? '✓' : '✗'}), Phone (${analysis.atsAudit.contactCompleteness.hasPhone ? '✓' : '✗'}), LinkedIn (${analysis.atsAudit.contactCompleteness.hasLinkedIn ? '✓' : '✗'}), GitHub/Portfolio (${analysis.atsAudit.contactCompleteness.hasGitHubOrPortfolio ? '✓' : '✗'})`, marginX + 3, y + 10);
    doc.text(`• Document Volume: ${analysis.atsAudit.lengthAndVolume.wordCount} words (Status: ${analysis.atsAudit.lengthAndVolume.status}, ~${analysis.atsAudit.lengthAndVolume.estimatedPages} pages)`, marginX + 3, y + 14);
    doc.text(`• Formatting Risk: ${analysis.atsAudit.formattingRisks.twoColumnOrTableRisk ? 'Multi-column/table delimiter detected (parsing risk)' : 'Clean linear single-column flow verified'}`, marginX + 3, y + 18);
    doc.text(`• Empirical Bullet Density: ${Math.round(analysis.atsAudit.metricsAndImpact.quantifiedRatio * 100)}% of bullets include measurable metrics`, marginX + 3, y + 22);

    y += 28;
  }

  // --- SECTION 6: PROJECT-TO-JOB ALIGNMENT ---
  if (sections.includeProjectMap && analysis.projectJobMap.length > 0) {
    ensureSpace(30);
    doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('6. Project-to-Job Requirement Alignment Mapping', marginX, y);
    y += 6;

    analysis.projectJobMap.slice(0, 3).forEach((proj, idx) => {
      ensureSpace(16);
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(marginX, y, contentWidth, 13, 1.5, 1.5, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
      doc.text(`${proj.projectName} — ${proj.alignmentScore}% Role Alignment`, marginX + 3, y + 4.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(slateText[0], slateText[1], slateText[2]);
      doc.text(`Fulfilled Requirements: ${proj.matchedJDRequirements.slice(0, 4).join(', ') || 'General foundations'}`, marginX + 3, y + 8.5);
      doc.text(`Missing Project Proof: ${proj.unsupportedJDRequirements.slice(0, 3).join(', ') || 'None'}`, marginX + 3, y + 11.5);

      y += 15;
    });
    y += 4;
  }

  // --- SECTION 7: 30-DAY PERSONALIZED ROADMAP ---
  if (sections.includeRoadmap) {
    ensureSpace(35);
    doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('7. Personalized 30-Day Skill & Project Roadmap', marginX, y);
    y += 6;

    analysis.roadmap.forEach((week) => {
      ensureSpace(28);
      doc.setFillColor(241, 245, 249);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(marginX, y, contentWidth, 7, 1, 1, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(indigo[0], indigo[1], indigo[2]);
      doc.text(`Week ${week.week}: ${week.theme} (~${week.estimatedHours} hrs study)`, marginX + 3, y + 4.5);
      y += 9;

      week.milestones.forEach((m) => {
        ensureSpace(10);
        const isDone = Boolean(completedMilestones[m.id]);
        const statusTag = isDone ? '[DONE]' : '[PENDING]';

        doc.setFont('helvetica', isDone ? 'bold' : 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(isDone ? emerald[0] : darkNavy[0], isDone ? emerald[1] : darkNavy[1], isDone ? emerald[2] : darkNavy[2]);

        const milestoneLine = doc.splitTextToSize(
          `• ${statusTag} [${m.resourceType}] ${m.title}: ${m.description}`,
          contentWidth - 6
        );
        doc.text(milestoneLine, marginX + 4, y);
        y += milestoneLine.length * 3.5 + 1.5;
      });
      y += 3;
    });
    y += 4;
  }

  // --- FOOTER AND LEGAL / RESEARCH DISCLAIMER ---
  ensureSpace(20);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(lightSlate[0], lightSlate[1], lightSlate[2]);
  doc.text(
    'Academic Research Notice: CareerLens AI produces explainable, deterministic document alignment evaluations. Scores reflect evidence completeness and lexical/semantic overlap; they do not guarantee recruitment shortlisting or predict workplace performance.',
    marginX,
    pageHeight - 12,
    { maxWidth: contentWidth }
  );

  // Add Page Numbers on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(lightSlate[0], lightSlate[1], lightSlate[2]);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - marginX - 16, pageHeight - 6);
  }

  // Trigger Save / Download
  const cleanName = candidateName.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `CareerLens_AuditReport_${cleanName}_${Date.now()}.pdf`;
  doc.save(filename);
}
