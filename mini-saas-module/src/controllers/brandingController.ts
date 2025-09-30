export const createBranding = async (req: Request, res: Response) => {
  try {
    const { logoUrl, name, color } = req.body;
    const tenantId = (req as any).tenantId;
    const user = (req as any).user;
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Only tenant owners (admin) can create branding.' });
    }
    const created = await Tenant.create({
      subdomain: tenantId,
      logoUrl,
      name,
      color
    });
    res.status(201).json({ success: true, tenant: created });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};
import Tenant from '../models/tenant';
import { Request, Response } from 'express';

export const updateBranding = async (req: Request, res: Response) => {
  try {
    const { logoUrl, name, color } = req.body;
    const tenantId = (req as any).tenantId;
    const user = (req as any).user;
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Only tenant owners (admin) can update branding.' });
    }
    const updated = await Tenant.findOneAndUpdate(
      { subdomain: tenantId },
      { $set: { logoUrl, name, color } },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    res.json({ success: true, tenant: updated });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

export const getBranding = async (req: Request, res: Response) => {
  try {
    const tenantId = (req as any).tenantId;
    const tenant = await Tenant.findOne({ subdomain: tenantId });
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    res.json({ logoUrl: tenant.logoUrl, name: tenant.name, color: tenant.color });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};
