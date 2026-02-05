import { getDriveApi } from '../../lib/google-auth.js';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id: fileId } = req.query;
    const driveApi = await getDriveApi();

    const { data: file } = await driveApi.files.get({ 
      fileId, 
      fields: 'name,mimeType' 
    });

    const stream = await driveApi.files.get({ 
      fileId, 
      alt: 'media' 
    }, { 
      responseType: 'stream' 
    });

    res.setHeader('Content-Type', file.mimeType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `inline; filename="${file.name}"`);

    stream.data.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch file' });
  }
}