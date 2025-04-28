const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const passport = require("passport");

// Use your existing directory structure
const resumeDir = "./public/resume";
const profileDir = "./public/profile";

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Route path determines the destination
    if (req.path === "/resume") {
      cb(null, resumeDir);
    } else if (req.path === "/profile") {
      cb(null, profileDir);
    }
  },
  filename: function (req, file, cb) {
    // Create unique filename with timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + extension);
  },
});

// File filter for validating file types
const fileFilter = (req, file, cb) => {
  if (req.path === "/resume") {
    // Accept only specific document types for resumes
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype === "application/msword" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF or Word documents allowed for resumes!"), false);
    }
  } else if (req.path === "/profile") {
    // Accept only image files for profile pictures
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files allowed for profile pictures!"), false);
    }
  } else {
    cb(new Error("Invalid upload path!"), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Resume upload route - matches apiList.uploadResume
router.post(
  "/resume",
  passport.authenticate("jwt", { session: false }),
  upload.single("resume"),
  (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No resume file uploaded" });
      }

      // Get user from passport authentication
      const user = req.user;
      
      // Update user's resume path in the database if needed
      // Example: user.resume = `/resume/${req.file.filename}`;
      // await user.save();

      res.status(200).json({
        success: true,
        message: "Resume uploaded successfully",
        file: {
          filename: req.file.filename,
          path: `/resume/${req.file.filename}`,
        },
      });
    } catch (error) {
      console.error("Resume upload error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// Profile picture upload route - matches apiList.uploadProfileImage
router.post(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  upload.single("profile"),
  (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No profile image uploaded" });
      }

      // Get user from passport authentication
      const user = req.user;
      
      // Update user's profile image path in the database if needed
      // Example: user.profilePic = `/profile/${req.file.filename}`;
      // await user.save();

      res.status(200).json({
        success: true,
        message: "Profile image uploaded successfully",
        file: {
          filename: req.file.filename,
          path: `/profile/${req.file.filename}`,
        },
      });
    } catch (error) {
      console.error("Profile image upload error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// Test route to verify API connectivity
router.get("/test", (req, res) => {
  res.json({ message: "Upload API is working!" });
});

// Error handling middleware
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({
          success: false,
          message: "File too large. Maximum size is 5MB.",
        });
    }
    return res.status(400).json({ success: false, message: err.message });
  } else if (err) {
    // An unknown error occurred
    return res.status(500).json({ success: false, message: err.message });
  }
  next();
});

module.exports = router;