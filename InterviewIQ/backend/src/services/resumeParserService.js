import { execFile } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import ApiError from '../utils/ApiError.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// backend/src/services -> up to InterviewIQ root -> ai-service/resume_parser.py
const PARSER_SCRIPT = path.resolve(__dirname, '../../../ai-service/resume_parser.py');
const PYTHON_BIN = process.env.PYTHON_BIN || 'python3';

const EXEC_OPTIONS = {
  timeout: 15_000, // parsing should be fast; guard against a hung process
  maxBuffer: 5 * 1024 * 1024,
};

/**
 * Runs ai-service/resume_parser.py against an uploaded file and returns
 * the extracted { skills, technologies, softSkills, projects, education }.
 * Throws an ApiError if the script fails or returns malformed output.
 */
export default function parseResumeFile(filePath, fileType) {
  return new Promise((resolve, reject) => {
    execFile(
      PYTHON_BIN,
      [PARSER_SCRIPT, filePath, fileType],
      EXEC_OPTIONS,
      (err, stdout, stderr) => {
        if (err) {
          console.error('[resume-parser] execution failed:', stderr || err.message);
          reject(new ApiError(502, 'Resume parsing service failed. Please try again.'));
          return;
        }

        let parsed;
        try {
          parsed = JSON.parse(stdout.trim());
        } catch {
          console.error('[resume-parser] non-JSON output:', stdout);
          reject(new ApiError(502, 'Resume parsing service returned an unexpected response.'));
          return;
        }

        if (!parsed.success) {
          reject(new ApiError(422, parsed.error || 'Could not parse this resume.'));
          return;
        }

        resolve(parsed.data);
      },
    );
  });
}
