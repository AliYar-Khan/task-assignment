import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  tenantId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  event: string;
  timestamp: Date;
}

const AuditLogSchema: Schema = new Schema({
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('AuditLog', AuditLogSchema);
