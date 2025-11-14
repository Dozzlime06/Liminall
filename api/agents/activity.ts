import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../server/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const activity = await storage.getRecentAgentActivity(limit);
    return res.status(200).json(activity);
  } catch (error) {
    console.error('Error fetching activity:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
