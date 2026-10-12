/**
 * CareerLens AI — Full-Stack Server
 * Express application mounting Vite middlewares in dev mode,
 * handling resume parsing (PDF, DOCX, TXT), NLP evidence matching,
 * and academic research evaluation endpoints.
 */

import express from 'express';
import multer from 'multer';
import mammoth from 'mammoth';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { parseResumeStructure } from './src/engine/resumeParser.js';
import { analyzeResumeAndJob, DEFAULT_WEIGHTS } from './src/engine/evidenceScorer.js';
import { compareMultipleJobs } from './src/engine/multiJobComparator.js';
import { evaluateModels } from './src/engine/researchEvaluator.js';
import { SAMPLE_PROFILES } from './src/data/sampleData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Memory storage for uploads to ensure privacy and zero disk footprint
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // --- API Routes ---

  // Healthcheck
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      app: 'CareerLens AI',
      version: '1.0.0-research',
      timestamp: new Date().toISOString()
    });
  });

  // Get preloaded sample demo profiles
  app.get('/api/sample-data', (req, res) => {
    res.json({ success: true, samples: SAMPLE_PROFILES });
  });

  // Upload and parse resume file (PDF, DOCX, TXT)
  app.post('/api/upload-resume', upload.single('resumeFile'), async (req, res) => {
    try {
      let extractedText = '';
      const file = req.file;

      if (file) {
        const mime = file.mimetype;
        const originalName = file.originalname.toLowerCase();

        if (originalName.endsWith('.docx') || mime.includes('wordprocessingml')) {
          const result = await mammoth.extractRawText({ buffer: file.buffer });
          extractedText = result.value;
        } else if (originalName.endsWith('.pdf') || mime === 'application/pdf') {
          try {
            const pdfParseModule: any = await import('pdf-parse');
            const pdfParser = (pdfParseModule.default || pdfParseModule) as (buf: Buffer) => Promise<{ text: string }>;
            const pdfData = await pdfParser(file.buffer);
            extractedText = pdfData.text;
          } catch (pdfErr) {
            console.warn('pdf-parse fallback processing:', pdfErr);
            // Fallback: extract ASCII string content if pdf-parse has node native issue
            const rawStr = file.buffer.toString('utf-8');
            extractedText = rawStr.replace(/[^\x20-\x7E\t\n\r]/g, ' ').replace(/\s+/g, ' ');
          }
        } else if (originalName.endsWith('.txt') || mime.includes('text/plain')) {
          extractedText = file.buffer.toString('utf-8');
        } else {
          // Attempt utf-8 decoding
          extractedText = file.buffer.toString('utf-8');
        }
      } else if (req.body.resumeText) {
        extractedText = req.body.resumeText;
      }

      if (!extractedText || extractedText.trim().length < 20) {
        return res.status(400).json({
          error: 'Could not extract sufficient text from the provided resume file. Please ensure it is a valid PDF, DOCX, or text file.'
        });
      }

      const parsedResume = parseResumeStructure(extractedText);

      return res.json({
        success: true,
        extractedText,
        contact: parsedResume.contact,
        atsAudit: parsedResume.atsAudit,
        bulletCount: parsedResume.bullets.length,
        wordCount: extractedText.split(/\s+/).filter(Boolean).length
      });
    } catch (err: any) {
      console.error('Error parsing resume:', err);
      return res.status(500).json({
        error: 'Failed to process resume file: ' + (err.message || 'Unknown parsing error')
      });
    }
  });

  // Analyze single resume against a job description
  app.post('/api/analyze', (req, res) => {
    try {
      const { resumeText, jobDescription, targetRole, weights } = req.body;

      if (!resumeText || !jobDescription) {
        return res.status(400).json({
          error: 'Both resumeText and jobDescription are required for analysis.'
        });
      }

      const parsed = parseResumeStructure(resumeText);
      const activeWeights = weights || DEFAULT_WEIGHTS;
      const result = analyzeResumeAndJob(parsed, jobDescription, targetRole, activeWeights);

      return res.json({
        success: true,
        analysis: result
      });
    } catch (err: any) {
      console.error('Error during analysis:', err);
      return res.status(500).json({
        error: 'Analysis computation failed: ' + (err.message || 'Unknown error')
      });
    }
  });

  // Multi-job comparison
  app.post('/api/compare-jobs', (req, res) => {
    try {
      const { resumeText, jobs, weights } = req.body;

      if (!resumeText || !jobs || !Array.isArray(jobs) || jobs.length === 0) {
        return res.status(400).json({
          error: 'resumeText and a non-empty array of jobs are required.'
        });
      }

      const parsed = parseResumeStructure(resumeText);
      const activeWeights = weights || DEFAULT_WEIGHTS;
      const comparison = compareMultipleJobs(parsed, jobs, activeWeights);

      return res.json({
        success: true,
        comparison
      });
    } catch (err: any) {
      console.error('Error during multi-job comparison:', err);
      return res.status(500).json({
        error: 'Job comparison failed: ' + (err.message || 'Unknown error')
      });
    }
  });

  // Benchmark evaluation for academic research module
  app.get('/api/benchmark-eval', (req, res) => {
    try {
      const threshold = parseFloat((req.query.threshold as string) || '0.50');
      const evalResult = evaluateModels(threshold);
      return res.json({
        success: true,
        evalResult
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Development: Vite middlewares
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true'
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Production: serve built static files
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CareerLens AI] Express server active on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
