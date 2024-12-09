const mongoose = require('mongoose');

const healthRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['vital_signs', 'exercise', 'diet', 'sleep']
  },
  data: {
    value: Number,
    unit: String,
    timestamp: Date
  },
  metadata: {
    device: String,
    location: String,
    notes: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 创建复合索引
healthRecordSchema.index({ userId: 1, type: 1, "data.timestamp": -1 });

module.exports = mongoose.model('HealthRecord', healthRecordSchema); 