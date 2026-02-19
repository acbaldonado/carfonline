import { google } from 'googleapis';
import { getAuthClient } from '../lib/google-auth';
import JSZip from 'jszip';

const MAIN_FOLDER_ID = '15GyW7ZZt-XFfdze96pJmsoNSgdU7PLmT';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { gencode } = req.query;
    const auth = await getAuthClient();
    const driveApi = google.drive({ version: 'v3', auth });

    // Find gencode folder
    const folderRes = await driveApi.files.list({
      q: `'${MAIN_FOLDER_ID}' in parents and name='${gencode}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id,name)',
    });

    if (!folderRes.data.files?.length) {
      return res.status(404).json({ error: 'Gencode folder not found' });
    }

    const gencodeFolderId = folderRes.data.files[0].id;

    // List subfolders
    const subfoldersRes = await driveApi.files.list({
      q: `'${gencodeFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id,name)',
    });

    const zip = new JSZip();

    for (const folder of subfoldersRes.data.files || []) {
      // List files in each subfolder
      const filesRes = await driveApi.files.list({
        q: `'${folder.id}' in parents and trashed=false`,
        fields: 'files(id,name,mimeType)',
      });

      for (const file of filesRes.data.files || []) {
        // Download each file as buffer
        const fileRes = await driveApi.files.get(
          { fileId: file.id, alt: 'media' },
          { responseType: 'arraybuffer' }
        );

        zip.folder(folder.name).file(file.name, fileRes.data);
      }
    }

    // Generate zip buffer
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${gencode}-documents.zip"`);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(zipBuffer);

  } catch (err) {
    console.error('Error creating zip:', err);
    res.status(500).json({ error: 'Failed to create zip', details: err.message });
  }
}