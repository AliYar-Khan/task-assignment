import mongoose, { Schema, Document } from 'mongoose';

export interface ICallMetric extends Document {
  tenantId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  callType: string;
  status: string;
  createdAt: Date;
}

const CallMetricSchema: Schema = new Schema({
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  callType: { type: String, required: true },
  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('CallMetric', CallMetricSchema);
