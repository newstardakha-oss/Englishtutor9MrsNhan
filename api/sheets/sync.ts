import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const scriptUrl = process.env.GOOGLE_SHEETS_SCRIPT_URL;

  if (req.method === 'GET') {
    return res.status(200).json({
      configured: !!scriptUrl,
      message: scriptUrl ? 'Google Sheets script URL is configured.' : 'Google Sheets script URL is NOT configured.'
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!scriptUrl) {
    return res.status(500).json({ error: 'GOOGLE_SHEETS_SCRIPT_URL environment variable is not set.' });
  }

  try {
    const payload = req.body;
    
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      return res.status(response.status).json({
        error: 'Failed to sync with Google Sheets',
        details: responseData
      });
    }

    return res.status(200).json(responseData);
  } catch (error: any) {
    console.error('Google Sheets sync error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
