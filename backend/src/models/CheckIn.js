const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * 签到记录模型
 */
const CheckInSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  date: {
    type: String,              // YYYY-MM-DD格式
    required: true
  },

  continuousDays: { type: Number, default: 1 },

  rewards: {
    points: { type: Number, default: 0 },
    bonusPoints: { type: Number, default: 0 },
    items: [{
      type: String,            // 奖励类型: theme, template, etc.
      itemId: String,
      itemName: String
    }]
  },

  timestamp: { type: Date, default: Date.now }
}, {
  timestamps: false
});

// 复合索引 - 确保每个用户每天只能签到一次
CheckInSchema.index({ userId: 1, date: 1 }, { unique: true });
CheckInSchema.index({ timestamp: -1 });

module.exports = mongoose.model('CheckIn', CheckInSchema);
