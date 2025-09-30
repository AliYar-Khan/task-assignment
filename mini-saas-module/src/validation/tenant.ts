import { z } from 'zod';

export const tenantSchema = z.object({
  name: z.string(),
  subdomain: z.string(),
  logoUrl: z.string().url().optional(),
  color: z.string().optional()
});
