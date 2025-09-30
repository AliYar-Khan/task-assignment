import { Request, Response } from 'express';

// Mock Ultravox API call
async function mockUltravoxApiCall(userId: string, tenantId: string) {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 100));
  return {
    callId: 'mock-call-id',
    status: 'success',
    userId,
    tenantId,
    timestamp: new Date().toISOString()
  };
}

export const makeTestCall = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const tenantId = req.body.tenantId;
    if (!userId || !tenantId) {
      return res.status(400).json({ error: 'Missing userId or tenantId' });
    }
    const result = await mockUltravoxApiCall(userId, tenantId);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
