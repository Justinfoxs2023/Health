import { NextApiRequest, NextApiResponse } from 'next';

import { UserGrowthService } from '@/services/integration/user-growth.service';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<any> {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const userId = req.headers['user-id'] as string;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const growthService = new UserGrowthService();
    const metrics = await growthService.getGrowthMetrics(userId);

    res.status(200).json(metrics);
  } catch (error) {
    console.error('Error in metrics.ts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
