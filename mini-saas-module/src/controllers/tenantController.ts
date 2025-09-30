import Tenant from '../models/tenant';
import { Request, Response } from 'express';
import { tenantSchema } from '../validation/tenant';
import { ZodError } from 'zod';

export const createTenant = async (req: Request, res: Response) => {
  try {
    const validated = tenantSchema.parse(req.body);
    // Only allow creation for the tenantId in JWT
    const tenantId = (req as any).tenantId;
    if (validated.subdomain !== tenantId) {
      return res.status(403).json({ error: 'Forbidden: Cannot create tenant for another tenantId' });
    }
    const tenant = new Tenant(validated);
    await tenant.save();
    res.status(201).json(tenant);
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ error: 'Validation error', details: err.issues });
    }
    res.status(400).json({ error: (err as Error).message });
  }
};

export const getTenantBySubdomain = async (req: Request, res: Response) => {
  try {
    const subdomain = req.params.subdomain;
    const tenantId = (req as any).tenantId;
    if (subdomain !== tenantId) {
      return res.status(403).json({ error: 'Forbidden: Cannot access another tenant' });
    }
    const tenant = await Tenant.findOne({ subdomain });
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    res.json(tenant);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

export const listTenants = async (req: Request, res: Response) => {
  try {
    const tenantId = (req as any).tenantId;
    const tenants = await Tenant.find({ subdomain: tenantId });
    res.json(tenants);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};
