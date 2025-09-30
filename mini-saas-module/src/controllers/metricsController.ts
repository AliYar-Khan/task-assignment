import CallMetric from '../models/callMetric';
import { Request, Response } from 'express';

export const getMetrics = async (req: Request, res: Response) => {
  try {
    const tenantId = (req as any).tenantId;
    // Number of calls for this tenant today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const callsToday = await CallMetric.countDocuments({
      tenantId,
      createdAt: { $gte: today }
    });
    // Number of active users (users who made a call today)
    const activeUsers = await CallMetric.distinct('userId', {
      tenantId,
      createdAt: { $gte: today }
    });
    res.json({ callsToday, activeUsers: activeUsers.length });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
