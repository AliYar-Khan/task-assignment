import User, { IUser } from '../models/user';
import { Request, Response } from 'express';
import { signupSchema, loginSchema } from '../validation/user';
import { ZodError } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AuditLog from '../models/auditLog';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export const signup = async (req: Request, res: Response) => {
  try {
    const validated = signupSchema.parse(req.body);
    const existing = await User.findOne({ email: validated.email, tenantId: validated.tenantId });
    if (existing) {
      return res.status(409).json({ error: 'User already exists' });
    }
    const passwordHash = await bcrypt.hash(validated.password, 10);
    const user = new User({
      tenantId: validated.tenantId,
      email: validated.email,
      passwordHash,
      role: validated.role || 'user',
    });
    await user.save();
    // Audit log for signup
    await AuditLog.create({
      tenantId: user.tenantId,
      userId: user._id,
      event: 'signup',
      timestamp: new Date()
    });
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ error: 'Validation error', details: err.issues });
    }
    res.status(400).json({ error: (err as Error).message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const validated = loginSchema.parse(req.body);
    const user:IUser | null = await User.findOne({ email: validated.email, tenantId: validated.tenantId });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const valid = await bcrypt.compare(validated.password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id, tenantId: user.tenantId, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    // Audit log for login
    await AuditLog.create({
      tenantId: user.tenantId,
      userId: user._id,
      event: 'login',
      timestamp: new Date()
    });
    res.json({ token });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ error: 'Validation error', details: err.issues });
    }
    res.status(400).json({ error: (err as Error).message });
  }
};
