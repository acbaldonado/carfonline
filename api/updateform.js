import { 
  getSheetHeaders, 
  findRowByIdInSheet, 
  updateSheetRow 
} from '../lib/sheets-helpers.js';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { rowId, data } = req.body;
    if (!rowId || !data) {
      return res.status(400).json({ error: "Missing rowId or data" });
    }

    const sheetName = "CUSTOMER DATA";
    const headers = await getSheetHeaders(sheetName);

    if (!headers.length) {
      return res.status(500).json({ error: "No headers found" });
    }

    const rowNumber = await findRowByIdInSheet(sheetName, rowId, headers);

    if (rowNumber === -1) {
      return res.status(404).json({ error: "Row ID not found" });
    }

    // Map data to row
    const rowValues = headers.map(col => {
      if (col === "#") return rowId;
      const value = data[col];
      return Array.isArray(value) ? value.join(", ") : value ?? "";
    });

    await updateSheetRow(sheetName, rowNumber, rowValues);

    res.json({ success: true, updatedRow: rowNumber });
  } catch (err) {
    console.error("Error updating CUSTOMER DATA:", err);
    res.status(500).json({ error: "Failed to update form" });
  }
}