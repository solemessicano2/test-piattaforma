import express from "express";

const router = express.Router();

router.get("/env-check", (req, res) => {
  res.json({
    hasCredentials: !!process.env.GOOGLE_DRIVE_CREDENTIALS,
    credentialsLength: process.env.GOOGLE_DRIVE_CREDENTIALS?.length || 0,
    hasFolderId: !!process.env.GOOGLE_DRIVE_FOLDER_ID,
    folderId: process.env.GOOGLE_DRIVE_FOLDER_ID,
    nodeEnv: process.env.NODE_ENV
  });
});

export default router;
