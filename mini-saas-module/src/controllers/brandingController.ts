import Tenant from '../models/tenant';
import { Request, Response } from 'express';


export const createOrUpdateBranding = async (req: Request, res: Response) => {
  try {
    const { logoUrl, name, color } = req.body;
    const tenantId = (req as any).tenantId;
    const user = (req as any).user;
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Only tenant owners (admin) can create branding.' });
    }

    // Check if branding already exists for the tenant
    let tenant = await Tenant.findOne({ subdomain: tenantId });
    if (tenant) {
      // Update existing branding
      tenant.logoUrl = logoUrl;
      tenant.name = name;
      tenant.color = color;
      await tenant.save();
      return res.status(200).json({ success: true, tenant });
    } else {
      // Create new branding
      const created = await Tenant.create({
        subdomain: tenantId,
        logoUrl,
        name,
        color
      });
      return res.status(201).json({ success: true, tenant: created });
    }
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
