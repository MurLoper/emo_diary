const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * 积分记录模型
 */
const PointsRecordSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  type: {
    type: String,
    enum: ['earn', 'spend'],
    required: true
  },

  source: {
    type: String,
    enum: [
      'checkin',           // 签到
      'create_diary',      // 创建日记
      'create_album',      // 创建图文集
      'share',             // 分享
      'invite',            // 邀请
      'tutorial',          // 完成教程
      'activity',          // 活动奖励
      'admin',             // 管理员发放
      'purchase_theme',    // 购买主题
      'purchase_template', // 购买模板
      'export_pdf',        // 导出PDF
      'ai_polish'          // AI润色
    ],
    required: true
  },

  amount: { type: Number, required: true },
  balance: { type: Number, required: true }, // 操作后余额

  description: String,
  relatedId: Schema.Types.ObjectId,          // 关联ID(日记ID、主题ID等)

  timestamp: { type: Date, default: Date.now }
}, {
  timestamps: false
});

// 索引
PointsRecordSchema.index({ userId: 1, timestamp: -1 });
PointsRecordSchema.index({ source: 1 });

module.exports = mongoose.model('PointsRecord', PointsRecordSchema);
