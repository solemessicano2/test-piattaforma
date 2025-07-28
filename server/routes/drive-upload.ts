import express from "express";
import { google } from "googleapis";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Google Drive service
const getDriveService = () => {
  const credentials = JSON.parse(process.env.GOOGLE_DRIVE_CREDENTIALS || "{}");

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/drive.file"],
  });

  return google.drive({ version: "v3", auth });
};

// Upload file to Google Drive
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const drive = getDriveService();
    const { originalname, buffer, mimetype } = req.file;
    const { fileName, folderId } = req.body;

    const fileMetadata = {
      name: fileName || originalname,
      parents: folderId ? [folderId] : [process.env.GOOGLE_DRIVE_FOLDER_ID],
    };

    const media = {
      mimeType: mimetype,
      body: require("stream").Readable.from(buffer),
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: "id,name,webViewLink",
    });

    res.json({
      success: true,
      fileId: response.data.id,
      fileName: response.data.name,
      webViewLink: response.data.webViewLink,
    });
  } catch (error) {
    console.error("Error uploading to Google Drive:", error);
    res.status(500).json({
      error: "Failed to upload to Google Drive",
      details: error.message,
    });
  }
});

// Upload JSON data as file
router.post("/upload-json", async (req, res) => {
  try {
    const { data, fileName } = req.body;

    if (!data || !fileName) {
      return res.status(400).json({ error: "Data and fileName are required" });
    }

    const drive = getDriveService();
    const jsonContent = JSON.stringify(data, null, 2);

    const fileMetadata = {
      name: fileName,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
    };

    const media = {
      mimeType: "application/json",
      body: require("stream").Readable.from(Buffer.from(jsonContent)),
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: "id,name,webViewLink",
    });

    res.json({
      success: true,
      fileId: response.data.id,
      fileName: response.data.name,
      webViewLink: response.data.webViewLink,
    });
  } catch (error) {
    console.error("Error uploading JSON to Google Drive:", error);
    res.status(500).json({
      error: "Failed to upload to Google Drive",
      details: error.message,
    });
  }
});

export default router;
