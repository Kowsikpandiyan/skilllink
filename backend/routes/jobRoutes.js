import express from "express";
import multer from "multer";
import fs from "fs";
import Job from "../models/Job.js";
import extractSkills from "../utils/extractSkills.js";
import parsePDF from "../utils/pdfParser.js";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Get all jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: error.message });
  }
});

// Analyze resume and match jobs
router.post("/match", async (req, res) => {
  try {
    const { resumeText } = req.body;
    
    if (!resumeText) {
      return res.status(400).json({ error: "Resume text is required" });
    }
    
    console.log("Analyzing resume text, length:", resumeText.length);
    
    // Extract skills
    const userSkills = extractSkills(resumeText);
    console.log("Skills found:", userSkills);
    
    // Get all jobs
    const jobs = await Job.find();
    console.log("Total jobs in database:", jobs.length);
    
    // Calculate matches
    const matches = jobs.map(job => {
      const matchedSkills = job.skills.filter(skill => 
        userSkills.some(userSkill => 
          userSkill.toLowerCase() === skill.toLowerCase()
        )
      );
      
      const score = job.skills.length > 0 
        ? Math.round((matchedSkills.length / job.skills.length) * 100)
        : 0;
      
      const missingSkills = job.skills.filter(skill =>
        !matchedSkills.some(matched => 
          matched.toLowerCase() === skill.toLowerCase()
        )
      );
      
      return {
        jobId: job._id,
        jobTitle: job.title,
        jobDescription: job.description,
        requiredSkills: job.skills,
        matchedSkills,
        missingSkills,
        score,
        totalRequired: job.skills.length,
        totalMatched: matchedSkills.length
      };
    });
    
    // Sort by score (highest first)
    matches.sort((a, b) => b.score - a.score);
    
    res.json({
      userSkills,
      totalSkillsFound: userSkills.length,
      matches: matches.slice(0, 10) // Return top 10 matches
    });
    
  } catch (error) {
    console.error("Error in match route:", error);
    res.status(500).json({ error: error.message });
  }
});

// Upload PDF
router.post("/upload-pdf", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    
    console.log("PDF file received:", req.file.originalname);
    
    try {
      // Try to parse PDF
      const text = await parsePDF(req.file.path);
      
      // Delete the file after reading
      fs.unlinkSync(req.file.path);
      
      console.log("PDF parsed successfully, text length:", text.length);
      res.json({ text });
      
    } catch (pdfError) {
      console.error("PDF parsing failed:", pdfError);
      
      // Clean up file
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      
      // Return a helpful message instead of error
      res.json({ 
        text: "We couldn't parse this PDF file. Please use the 'Paste Text' option instead for best results.\n\nSimply copy your resume text and paste it in the text input area." 
      });
    }
    
  } catch (error) {
    console.error("Upload error:", error);
    
    // Clean up file if exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      error: "Failed to process file",
      message: "Please try using the text input option instead"
    });
  }
});

// Get all available skills (for autocomplete or reference)
router.get("/skills", (req, res) => {
  res.json(skillDatabase);
});

export default router;
