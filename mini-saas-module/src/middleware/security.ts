import { Request, Response, NextFunction } from 'express';

export const validateApiKey = (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers['x-api-key'] as string | undefined;
    const expectedApiKey = process.env.API_KEY || '';
    if (!apiKey || apiKey !== expectedApiKey) {
        return res.status(403).json({ message: 'Forbidden: Invalid API Key' });
    }
    next();
};

export const enforceTenantIsolation = (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.headers['x-tenant-id'] as string | undefined;
    if (!tenantId) {
        return res.status(400).json({ message: 'Bad Request: Tenant ID is required' });
    }
    // Attach tenant information to the request for further processing
    (req as any).tenantId = tenantId;
    next();
};