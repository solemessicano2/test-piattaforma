import { GoogleAuth } from 'googleapis/build/src/auth/googleauth';
import { drive_v3 } from 'googleapis/build/src/apis/drive/v3';

export interface DriveUploadOptions {
  fileName: string;
  content: string | Buffer;
  mimeType: string;
  folderId?: string;
}

export class GoogleDriveService {
  private auth: GoogleAuth;
  private drive: drive_v3.Drive;

  constructor() {
    // Parse credentials from environment variable
    const credentials = JSON.parse(process.env.GOOGLE_DRIVE_CREDENTIALS || '{}');
    
    this.auth = new GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/drive.file']
    });
    
    this.drive = new drive_v3.Drive({
      auth: this.auth
    });
  }

  async uploadFile(options: DriveUploadOptions): Promise<string> {
    const { fileName, content, mimeType, folderId } = options;

    const fileMetadata = {
      name: fileName,
      parents: folderId ? [folderId] : undefined
    };

    const media = {
      mimeType,
      body: typeof content === 'string' ? Buffer.from(content) : content
    };

    try {
      const response = await this.drive.files.create({
        requestBody: fileMetadata,
        media,
        fields: 'id'
      });

      return response.data.id!;
    } catch (error) {
      console.error('Error uploading to Google Drive:', error);
      throw error;
    }
  }

  async uploadPDF(fileName: string, pdfContent: string): Promise<string> {
    return this.uploadFile({
      fileName,
      content: pdfContent,
      mimeType: 'application/pdf',
      folderId: process.env.GOOGLE_DRIVE_FOLDER_ID
    });
  }

  async uploadExcel(fileName: string, excelBuffer: Buffer): Promise<string> {
    return this.uploadFile({
      fileName,
      content: excelBuffer,
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      folderId: process.env.GOOGLE_DRIVE_FOLDER_ID
    });
  }
}
