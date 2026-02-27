// API endpoint to fetch a single customer record by gencode from Google Sheets
export default async function handler(req, res) {
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
    const { gencode } = req.query;
    
    if (!gencode) {
      return res.status(400).json({ error: 'Gencode is required' });
    }

    // Hardcoded sheet ID and range (same as used in CustomerList)
    const sheetId = '1TJ1b_cBoW3pCC_zhSDvOot9jViXnuCbbLTfMQspSMPw';
    const sheetRange = 'CUSTOMER DATA';
    const sheetApiKey = 'AIzaSyDT5RXp6X-oYRAMG1Y9QErmVGv8N_GU3As';

    // Fetch data from Google Sheets
    const googleSheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetRange}?key=${sheetApiKey}`;
    const response = await fetch(googleSheetsUrl);
    
    if (!response.ok) {
      console.error('Google Sheets API error:', response.status);
      return res.status(response.status).json({ error: 'Failed to fetch from Google Sheets' });
    }

    const result = await response.json();
    
    if (!result.values || result.values.length === 0) {
      return res.status(404).json({ error: 'No data found' });
    }

    const [headerRow, ...rows] = result.values;
    
    // Find the gencode column index
    const gencodeColumnIndex = headerRow.findIndex((header) => 
      (header || '').toString().trim().toLowerCase() === 'gencode'
    );

    if (gencodeColumnIndex === -1) {
      console.error('Gencode column not found in sheet. Headers:', headerRow);
      return res.status(500).json({ error: 'Gencode column not found in sheet' });
    }

    // Find the row matching the gencode
    const matchingRow = rows.find((row) => {
      const rowGencode = row[gencodeColumnIndex];
      return rowGencode && rowGencode.toString().trim() === gencode.toString().trim();
    });

    if (!matchingRow) {
      return res.status(404).json({ error: `Customer with gencode ${gencode} not found` });
    }

    // Convert row to object using headers
    const customerData = {};
    headerRow.forEach((header, index) => {
      customerData[header] = matchingRow[index] ?? null;
    });

    res.status(200).json(customerData);
  } catch (err) {
    console.error('Error in customer-by-gencode endpoint:', err);
    res.status(500).json({ error: 'Failed to fetch customer', details: err.message });
  }
}
