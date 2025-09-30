import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  tenantId: mongoose.Types.ObjectId;
  email: string;
  passwordHash: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', UserSchema);
