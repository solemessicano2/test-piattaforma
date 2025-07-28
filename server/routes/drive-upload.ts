import express from "express";
import { google } from "googleapis";
import multer from "multer";
import { Readable } from "stream";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Google Drive service
const getDriveService = () => {
  console.log('Getting Drive service...');
  console.log('Environment variables:', {
    hasCredentials: !!process.env.GOOGLE_DRIVE_CREDENTIALS,
    hasFolderId: !!process.env.GOOGLE_DRIVE_FOLDER_ID,
    folderId: process.env.GOOGLE_DRIVE_FOLDER_ID
  });

  const credentials = JSON.parse(process.env.GOOGLE_DRIVE_CREDENTIALS || "{}");

  console.log('Parsed credentials:', {
    hasPrivateKey: !!credentials.private_key,
    clientEmail: credentials.client_email
  });

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

    console.log('Uploading to Google Drive root...');

    const fileMetadata = {
      name: `PID5_${fileName || originalname}_${Date.now()}`,
    };

    // Use simple media upload (without multipart)
    const response = await drive.files.create({
      requestBody: fileMetadata,
    });

    console.log('File created, now updating content...');

    // Update the file content separately
    const updateResponse = await drive.files.update({
      fileId: response.data.id,
      media: {
        mimeType: mimetype,
        body: Readable.from(buffer),
      },
      fields: "id,name,webViewLink",
    });

    console.log('Upload successful to root');

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
  console.log('Upload JSON endpoint called');
  console.log('Request body:', { hasData: !!req.body.data, fileName: req.body.fileName });

  try {
    const { data, fileName } = req.body;

    if (!data || !fileName) {
      console.log('Missing data or fileName');
      return res.status(400).json({ error: "Data and fileName are required" });
    }

    console.log('Getting drive service...');
    const drive = getDriveService();
    const jsonContent = JSON.stringify(data, null, 2);

    console.log('Uploading JSON to Google Drive root...');

    const fileMetadata = {
      name: `PID5_${fileName}_${Date.now()}`,
    };

    const jsonBuffer = Buffer.from(jsonContent);

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: {
        mimeType: "application/json",
        body: jsonBuffer,
      },
      fields: "id,name,webViewLink",
    });

    console.log('JSON upload successful:', response.data);

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
