import mongoose, { Schema, Document } from 'mongoose';

export interface ITenant extends Document {
  name: string;
  subdomain: string;
  logoUrl?: string;
  color?: string;
  createdAt: Date;
}

const TenantSchema: Schema = new Schema({
  name: { type: String, required: true },
  subdomain: { type: String, required: true, unique: true },
  logoUrl: { type: String },
  color: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Tenant', TenantSchema);