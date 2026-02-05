import { getDriveApi } from '../../lib/google-auth.js';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id: fileId } = req.query;
    const driveApi = await getDriveApi();

    await driveApi.files.delete({ fileId });

    res.json({
      success: true,
      message: 'File deleted successfully',
      fileId: fileId,
    });
  } catch (err) {
    console.error('Error deleting file:', err);
    res.status(500).json({
      error: 'Failed to delete file',
      details: err.message,
    });
  }
}