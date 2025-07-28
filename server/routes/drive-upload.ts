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

    let response;

    // Try upload to root folder (simpler approach)
    try {
      console.log('Uploading to Google Drive root...');

      const fileMetadata = {
        name: `PID5_${fileName || originalname}_${Date.now()}`,
      };

      // Use simple buffer upload
      response = await drive.files.create({
        requestBody: fileMetadata,
        media: {
          mimeType: mimetype,
          body: buffer,
        },
        fields: "id,name,webViewLink",
      });

      console.log('Upload successful to root');

    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }

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

    console.log('Creating file metadata...');
    const fileMetadata = {
      name: fileName,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
    };

    const media = {
      mimeType: "application/json",
      body: Readable.from(Buffer.from(jsonContent)),
    };

    let response;

    // First try with specified folder
    try {
      const fileMetadata = {
        name: fileName,
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
      };

      console.log('File metadata:', fileMetadata);
      console.log('Uploading to Google Drive folder...');

      response = await drive.files.create({
        requestBody: fileMetadata,
        media,
        fields: "id,name,webViewLink",
      });

    } catch (error) {
      console.log('Folder upload failed, trying root folder:', error.message);

      // Fallback: upload to root
      const fileMetadataRoot = {
        name: `[AutoUpload] ${fileName}`,
      };

      response = await drive.files.create({
        requestBody: fileMetadataRoot,
        media,
        fields: "id,name,webViewLink",
      });

      console.log('Successfully uploaded to root folder');
    }

    console.log('Upload successful:', response.data);

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
