// api/snaplogic.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

// Environment variables set in Vercel dashboard
const PIPELINE_URL = process.env.SNAPLOGIC_PIPELINE_URL;
const BEARER_TOKEN = process.env.SNAPLOGIC_BEARER_TOKEN;

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { employeeId, question } = req.body as { employeeId: string; question: string };
    if (!employeeId || !question) {
      return res.status(400).json({ error: 'Missing employeeId or question' });
    }

    const query = new URLSearchParams({ employeeId, question }).toString();
    const url = `${PIPELINE_URL}?${query}`;

    const snapResp = await axios.post(
      url,
      {}, // SnapLogic expects params in query string
      {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
          'Content-Type': 'application/json',
        },
        timeout: 60_000,
      }
    );

    // Forward the raw SnapLogic response back to the client
    res.status(200).json(snapResp.data);
  } catch (error: any) {
    console.error('SnapLogic proxy error:', error);
    const status = error.response?.status ?? 500;
    const details = error.response?.data ?? error.message;
    res.status(status).json({ error: 'SnapLogic request failed', details });
  }
};
