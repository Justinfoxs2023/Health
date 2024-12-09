import { Schema, model } from 'mongoose';
import { IAppointment } from '../types/models';

const appointmentSchema = new Schema<IAppointment>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  nutritionistId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['线上咨询', '线下咨询'],
    required: true
  },
  status: {
    type: String,
    enum: ['待确认', '已确认', '已完成', '已取消'],
    default: '待确认'
  },
  date: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  description: String,
  attachments: [String],
  price: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['未支付', '已支付', '已退款'],
    default: '未支付'
  },
  consultationRecord: {
    mainComplaints: String,
    diagnosis: String,
    suggestions: [String],
    prescriptions: [{
      type: String,
      content: String,
      duration: String
    }],
    followUpPlan: String
  },
  rating: {
    score: Number,
    comment: String,
    createdAt: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 更新时自动更新updateAt字段
appointmentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// 创建索引
appointmentSchema.index({ userId: 1, status: 1 });
appointmentSchema.index({ nutritionistId: 1, date: 1 });
appointmentSchema.index({ status: 1, paymentStatus: 1 });

export const Appointment = model<IAppointment>('Appointment', appointmentSchema); 