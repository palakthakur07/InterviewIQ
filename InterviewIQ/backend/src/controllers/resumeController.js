import path from 'path';
import fs from 'fs/promises';
import Resume from '../models/Resume.js';
import parseResumeFile from '../services/resumeParserService.js';
import ApiError from '../utils/ApiError.js';

// POST /api/resumes/upload  (protected, multipart/form-data, field name "resume")
export async function uploadResume(req, res, next) {
  const file = req.file;

  try {
    if (!file) {
      throw new ApiError(400, 'No file was uploaded. Attach a PDF or DOCX under "resume".');
    }

    const fileType = path.extname(file.originalname).toLowerCase() === '.pdf' ? 'pdf' : 'docx';

    const extracted = await parseResumeFile(file.path, fileType);

    const resume = await Resume.create({
      user: req.user._id,
      originalName: file.originalname,
      storedFileName: file.filename,
      fileType,
      fileSizeBytes: file.size,
      skills: extracted.skills,
      technologies: extracted.technologies,
      softSkills: extracted.softSkills,
      projects: extracted.projects,
      education: extracted.education,
    });

    res.status(201).json({
      success: true,
      resume: resume.toPublicJSON(),
    });
  } catch (err) {
    // Clean up the uploaded file if parsing/saving failed so orphans don't pile up.
    if (file?.path) {
      fs.unlink(file.path).catch(() => {});
    }
    next(err);
  }
}

// GET /api/resumes  (protected) — most recent first
export async function listResumes(req, res, next) {
  try {
    const resumes = await Resume.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      resumes: resumes.map((r) => r.toPublicJSON()),
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/resumes/:id  (protected)
export async function getResume(req, res, next) {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
    if (!resume) {
      throw new ApiError(404, 'Resume not found');
    }
    res.status(200).json({
      success: true,
      resume: resume.toPublicJSON(),
    });
  } catch (err) {
    next(err);
  }
}
