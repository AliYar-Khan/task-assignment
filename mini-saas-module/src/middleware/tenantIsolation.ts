import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export function enforceTenantIsolation(req: Request, res: Response, next: NextFunction) {
  // Extract JWT from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid token' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { tenantId: string };
    // Attach tenantId to request for downstream use
    (req as any).tenantId = payload.tenantId;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
