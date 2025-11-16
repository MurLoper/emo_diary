const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * 标签模型
 */
const TagSchema = new Schema({
  name: { type: String, required: true, unique: true },
  category: {
    type: String,
    enum: ['mood', 'activity', 'social', 'special', 'weather', 'custom'],
    required: true
  },
  color: { type: String, default: '#999999' },
  icon: String,

  // 使用统计
  usageCount: { type: Number, default: 0 },

  // 是否为系统预设
  isSystem: { type: Boolean, default: true },

  // 创建者(自定义标签)
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },

  createdAt: { type: Date, default: Date.now }
});

TagSchema.index({ category: 1, name: 1 });
TagSchema.index({ usageCount: -1 });

module.exports = mongoose.model('Tag', TagSchema);
