/**
 * CareerLens AI — Structural Resume Parser & ATS Layout Auditor
 * Deterministic text segmentation, entity identification, and parsing compliance checks.
 */

export interface ParsedContactInfo {
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  location?: string;
}

export interface ParsedBullet {
  text: string;
  section: 'EXPERIENCE' | 'PROJECTS' | 'OTHER';
  hasQuantifiableMetric: boolean;
  metricsDetected: string[];
  startswithActionVerb: boolean;
  firstWord: string;
  length: number;
}

export interface ATSAuditResult {
  score: number; // 0 to 100
  verdict: 'Excellent' | 'Good' | 'Needs Attention' | 'High Risk';
  contactCompleteness: {
    hasEmail: boolean;
    hasPhone: boolean;
    hasLinkedIn: boolean;
    hasGitHubOrPortfolio: boolean;
    score: number;
  };
  sectionCompliance: {
    standardHeadersFound: string[];
    missingStandardHeaders: string[];
    nonStandardHeadersFound: string[];
    score: number;
  };
  formattingRisks: {
    twoColumnOrTableRisk: boolean;
    specialCharDensityRisk: boolean;
    bulletPunctuationConsistent: boolean;
    unusualFontGlyphs: boolean;
    notes: string[];
  };
  metricsAndImpact: {
    totalBullets: number;
    quantifiedBullets: number;
    quantifiedRatio: number; // e.g. 0.65
    actionVerbRatio: number;
    score: number;
  };
  lengthAndVolume: {
    wordCount: number;
    estimatedPages: number;
    status: 'Optimal' | 'Too Short' | 'Too Long';
    recommendedWordRange: string;
  };
  detailedChecklist: Array<{
    category: string;
    item: string;
    passed: boolean;
    impact: 'High' | 'Medium' | 'Low';
    advice: string;
  }>;
}

export interface ParsedResume {
  rawText: string;
  contact: ParsedContactInfo;
  sections: {
    summary?: string;
    skills?: string;
    experience?: string;
    projects?: string;
    education?: string;
    certifications?: string;
  };
  bullets: ParsedBullet[];
  atsAudit: ATSAuditResult;
}

const STRONG_ACTION_VERBS = new Set([
  'built', 'engineered', 'architected', 'developed', 'designed', 'deployed',
  'implemented', 'optimized', 'reduced', 'increased', 'scaled', 'automated',
  'spearheaded', 'orchestrated', 'authored', 'trained', 'evaluated', 'integrated',
  'migrated', 'launched', 'formulated', 'streamlined', 'delivered', 'managed',
  'led', 'created', 'established', 'cut', 'accelerated', 'improved', 'achieved'
]);

const STANDARD_SECTION_HEADERS = [
  'experience', 'work experience', 'employment', 'professional experience',
  'education', 'academic background',
  'skills', 'technical skills', 'core competencies',
  'projects', 'academic projects', 'personal projects',
  'certifications', 'achievements', 'awards', 'publications',
  'summary', 'professional summary', 'objective'
];

/**
 * Extracts structured contact details using high-precision regex
 */
export function extractContactInfo(text: string): ParsedContactInfo {
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\+91[-.\s]?\d{10}/);
  const linkedinMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  const githubMatch = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/i);
  const portfolioMatch = text.match(/(?:https?:\/\/)?(?:www\.)?(?!linkedin|github)[a-zA-Z0-9-]+\.(?:dev|me|io|tech|ai|com)\/?[a-zA-Z0-9_-]*/i);
  
  return {
    email: emailMatch ? emailMatch[0] : undefined,
    phone: phoneMatch ? phoneMatch[0] : undefined,
    linkedin: linkedinMatch ? linkedinMatch[0] : undefined,
    github: githubMatch ? githubMatch[0] : undefined,
    portfolio: portfolioMatch ? portfolioMatch[0] : undefined,
  };
}

/**
 * Parses resume into key semantic sections and individual bullet points
 */
export function parseResumeStructure(rawText: string): ParsedResume {
  const contact = extractContactInfo(rawText);
  const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  const sections: ParsedResume['sections'] = {};
  let currentSection = 'summary';
  let sectionBuffers: Record<string, string[]> = {
    summary: [],
    skills: [],
    experience: [],
    projects: [],
    education: [],
    certifications: []
  };

  const detectedHeaders: string[] = [];

  for (const line of lines) {
    const lower = line.toLowerCase();
    const isHeaderLine = line.length < 40 && (
      line.toUpperCase() === line ||
      /^[A-Z][A-Za-z\s&]{2,30}$/.test(line) ||
      line.endsWith(':')
    );

    if (isHeaderLine) {
      if (/skill|technolog/i.test(lower)) {
        currentSection = 'skills';
        detectedHeaders.push(line);
        continue;
      } else if (/experience|employment|work history/i.test(lower)) {
        currentSection = 'experience';
        detectedHeaders.push(line);
        continue;
      } else if (/project/i.test(lower)) {
        currentSection = 'projects';
        detectedHeaders.push(line);
        continue;
      } else if (/education|academ/i.test(lower)) {
        currentSection = 'education';
        detectedHeaders.push(line);
        continue;
      } else if (/certif|achieve|award/i.test(lower)) {
        currentSection = 'certifications';
        detectedHeaders.push(line);
        continue;
      } else if (/summary|objective|profile/i.test(lower)) {
        currentSection = 'summary';
        detectedHeaders.push(line);
        continue;
      }
    }

    if (sectionBuffers[currentSection]) {
      sectionBuffers[currentSection].push(line);
    }
  }

  sections.summary = sectionBuffers.summary.join('\n');
  sections.skills = sectionBuffers.skills.join('\n');
  sections.experience = sectionBuffers.experience.join('\n');
  sections.projects = sectionBuffers.projects.join('\n');
  sections.education = sectionBuffers.education.join('\n');
  sections.certifications = sectionBuffers.certifications.join('\n');

  // Bullet extraction
  const bullets: ParsedBullet[] = [];
  const bulletRegex = /^[\u2022\u2023\u25E6\u2043\u2219•\-*]\s*(.+)$/;

  lines.forEach(line => {
    let bulletText = '';
    const match = line.match(bulletRegex);
    if (match) {
      bulletText = match[1].trim();
    } else if (line.length > 30 && !line.endsWith(':') && line.split(' ').length > 5) {
      // Potentially an un-bulleted achievement line
      bulletText = line;
    }

    if (bulletText && bulletText.length > 15) {
      // Detect quantifiable metrics: numbers, %, $, ms, scale
      const metricMatches = bulletText.match(/\b(?:\d+(?:\.\d+)?%|\$\d+(?:\.\d+)?(?:k|m|b)?|\d+(?:,\d+)*\+?(?:\s*(?:users|queries|ms|fps|gb|tb|teams|hours|x|mAP|auc))?)\b/gi) || [];
      const firstWord = bulletText.split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, '') || '';
      const startsWithVerb = STRONG_ACTION_VERBS.has(firstWord);

      let bulletSec: ParsedBullet['section'] = 'OTHER';
      if (sections.experience && sections.experience.includes(bulletText)) bulletSec = 'EXPERIENCE';
      else if (sections.projects && sections.projects.includes(bulletText)) bulletSec = 'PROJECTS';

      bullets.push({
        text: bulletText,
        section: bulletSec,
        hasQuantifiableMetric: metricMatches.length > 0,
        metricsDetected: metricMatches,
        startswithActionVerb: startsWithVerb,
        firstWord,
        length: bulletText.split(' ').length
      });
    }
  });

  // Calculate ATS Readability Audit
  const atsAudit = calculateATSAudit(rawText, contact, detectedHeaders, bullets);

  return {
    rawText,
    contact,
    sections,
    bullets,
    atsAudit
  };
}

/**
 * Comprehensive ATS readability and parse audit
 */
function calculateATSAudit(
  rawText: string,
  contact: ParsedContactInfo,
  detectedHeaders: string[],
  bullets: ParsedBullet[]
): ATSAuditResult {
  const checklist: ATSAuditResult['detailedChecklist'] = [];
  const words = rawText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // 1. Contact Info Audit
  const hasEmail = Boolean(contact.email);
  const hasPhone = Boolean(contact.phone);
  const hasLinkedIn = Boolean(contact.linkedin);
  const hasGitHubOrPortfolio = Boolean(contact.github || contact.portfolio);

  let contactScore = 0;
  if (hasEmail) contactScore += 35;
  if (hasPhone) contactScore += 25;
  if (hasLinkedIn) contactScore += 20;
  if (hasGitHubOrPortfolio) contactScore += 20;

  checklist.push({
    category: 'Contact Information',
    item: 'Professional Email Detected',
    passed: hasEmail,
    impact: 'High',
    advice: hasEmail ? 'Direct email address parsed cleanly.' : 'Missing or unparseable email address; ATS parsers will fail candidate ingestion.'
  });

  checklist.push({
    category: 'Contact Information',
    item: 'Phone Number Included',
    passed: hasPhone,
    impact: 'High',
    advice: hasPhone ? 'Contact phone parsed successfully.' : 'No standard international/national phone number detected.'
  });

  checklist.push({
    category: 'Contact Information',
    item: 'LinkedIn Profile Link',
    passed: hasLinkedIn,
    impact: 'Medium',
    advice: hasLinkedIn ? 'LinkedIn profile URL identified.' : 'Add your full LinkedIn URL (e.g. linkedin.com/in/username) for recruiter verification.'
  });

  checklist.push({
    category: 'Contact Information',
    item: 'Technical Portfolio / GitHub',
    passed: hasGitHubOrPortfolio,
    impact: 'Medium',
    advice: hasGitHubOrPortfolio ? 'Portfolio or GitHub repository profile linked.' : 'Highly recommended for technical engineering roles to evidence source code.'
  });

  // 2. Section Heading Audit
  const lowerHeaders = detectedHeaders.map(h => h.toLowerCase());
  const standardFound = detectedHeaders.filter(h =>
    STANDARD_SECTION_HEADERS.some(sh => h.toLowerCase().includes(sh))
  );
  const missingCore = ['skills', 'experience', 'education'].filter(core =>
    !lowerHeaders.some(h => h.includes(core))
  );

  let sectionScore = Math.max(0, 100 - missingCore.length * 25);

  checklist.push({
    category: 'Section Structure',
    item: 'Standard ATS-Recognized Headings',
    passed: missingCore.length === 0,
    impact: 'High',
    advice: missingCore.length === 0
      ? 'All core sections (Experience, Skills, Education) use standard recognized terminology.'
      : `Missing standard headings for: ${missingCore.join(', ')}. Avoid creative headings like "My Journey" or "What I Do".`
  });

  // 3. Formatting & Parsing Risks
  const pipeCount = (rawText.match(/\|/g) || []).length;
  const tableRisk = pipeCount > 25 || /\t{2,}/.test(rawText);
  const specialCharCount = (rawText.match(/[^\w\s.,!?:;@/()\-+#]/g) || []).length;
  const specialCharDensityRisk = specialCharCount / (rawText.length || 1) > 0.05;

  const formattingNotes: string[] = [];
  if (tableRisk) formattingNotes.push('High density of pipe dividers or multi-tabs; risk of multi-column parsing scramble in legacy ATS.');
  if (specialCharDensityRisk) formattingNotes.push('High volume of non-ASCII symbols/icons; may corrupt OCR text extractors.');

  checklist.push({
    category: 'Layout & Parsing',
    item: 'Single-Column / Flow Compatibility',
    passed: !tableRisk,
    impact: 'High',
    advice: !tableRisk ? 'Clean linear text flow with minimal parsing collision.' : 'Reduce nested tables or heavy pipe-delimited grids to prevent text order corruption.'
  });

  // 4. Measurable Impact & Action Verbs
  const totalBullets = bullets.length || 1;
  const quantifiedBullets = bullets.filter(b => b.hasQuantifiableMetric).length;
  const quantifiedRatio = +(quantifiedBullets / totalBullets).toFixed(2);
  const actionVerbCount = bullets.filter(b => b.startswithActionVerb).length;
  const actionVerbRatio = +(actionVerbCount / totalBullets).toFixed(2);

  let impactScore = Math.round((quantifiedRatio * 60) + (actionVerbRatio * 40));
  impactScore = Math.min(100, Math.max(10, impactScore));

  checklist.push({
    category: 'Evidence Quality',
    item: 'Quantified Metrics & Measurable Outcomes',
    passed: quantifiedRatio >= 0.40,
    impact: 'High',
    advice: quantifiedRatio >= 0.40
      ? `${Math.round(quantifiedRatio * 100)}% of bullets include measurable metrics (%, scale, latency, users). Excellent empirical proof.`
      : `Only ${Math.round(quantifiedRatio * 100)}% of bullet points contain quantifiable evidence. Aim for >40% to satisfy rigorous recruiters.`
  });

  checklist.push({
    category: 'Evidence Quality',
    item: 'Active Voice & Strong Action Verbs',
    passed: actionVerbRatio >= 0.50,
    impact: 'Medium',
    advice: actionVerbRatio >= 0.50
      ? `${Math.round(actionVerbRatio * 100)}% of bullets lead with assertive impact verbs.`
      : 'Begin achievement statements with decisive past-tense verbs (Engineered, Architected, Optimized) rather than passive duties ("Helped with", "Responsible for").'
  });

  // 5. Volume & Length Check
  let volumeStatus: ATSAuditResult['lengthAndVolume']['status'] = 'Optimal';
  if (wordCount < 300) volumeStatus = 'Too Short';
  else if (wordCount > 1200) volumeStatus = 'Too Long';

  checklist.push({
    category: 'Document Volume',
    item: 'Resume Length & Density',
    passed: volumeStatus === 'Optimal',
    impact: 'Medium',
    advice: volumeStatus === 'Optimal'
      ? `Total word count (${wordCount} words) is in the sweet spot (400–900 words) for concise readability.`
      : volumeStatus === 'Too Short'
      ? `Word count (${wordCount} words) is sparse; elaborate on technical architecture and project deliverables.`
      : `Word count (${wordCount} words) is long; consider trimming older coursework to maintain 1–2 focused pages.`
  });

  // Overall ATS Score Calculation
  const totalScore = Math.round(
    (contactScore * 0.25) +
    (sectionScore * 0.25) +
    (impactScore * 0.30) +
    ((tableRisk ? 50 : 100) * 0.10) +
    ((volumeStatus === 'Optimal' ? 100 : 70) * 0.10)
  );

  let verdict: ATSAuditResult['verdict'] = 'Excellent';
  if (totalScore < 50) verdict = 'High Risk';
  else if (totalScore < 70) verdict = 'Needs Attention';
  else if (totalScore < 85) verdict = 'Good';

  return {
    score: totalScore,
    verdict,
    contactCompleteness: {
      hasEmail,
      hasPhone,
      hasLinkedIn,
      hasGitHubOrPortfolio,
      score: contactScore
    },
    sectionCompliance: {
      standardHeadersFound: standardFound,
      missingStandardHeaders: missingCore,
      nonStandardHeadersFound: detectedHeaders.filter(h => !standardFound.includes(h)),
      score: sectionScore
    },
    formattingRisks: {
      twoColumnOrTableRisk: tableRisk,
      specialCharDensityRisk,
      bulletPunctuationConsistent: true,
      unusualFontGlyphs: false,
      notes: formattingNotes
    },
    metricsAndImpact: {
      totalBullets,
      quantifiedBullets,
      quantifiedRatio,
      actionVerbRatio,
      score: impactScore
    },
    lengthAndVolume: {
      wordCount,
      estimatedPages: +(wordCount / 450).toFixed(1),
      status: volumeStatus,
      recommendedWordRange: '450 - 900 words (1 to 2 pages)'
    },
    detailedChecklist: checklist
  };
}
