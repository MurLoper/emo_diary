const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * 日记模型
 */
const DiarySchema = new Schema({
  // 所属用户
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  // 基本信息
  title: { type: String, default: '' },
  content: { type: String, required: true },
  originalContent: String, // AI润色前的原文

  // 图片
  images: [{
    url: { type: String, required: true },
    thumbnail: String,      // 缩略图
    width: Number,
    height: Number,
    size: Number,          // 文件大小(bytes)
    order: Number,         // 排序
    cdnUrl: String,        // CDN地址
    localPath: String      // 本地存储路径
  }],

  // 标签
  tags: [{
    category: {
      type: String,
      enum: ['mood', 'activity', 'social', 'special', 'weather', 'custom']
    },
    name: String,
    color: String
  }],

  // 时间
  diaryDate: { type: Date, required: true }, // 日记日期

  // 位置信息(可选)
  location: {
    name: String,
    latitude: Number,
    longitude: Number,
    city: String,
    province: String
  },

  // 天气信息(可选)
  weather: {
    condition: String,     // 天气状况
    temperature: Number,   // 温度
    icon: String
  },

  // AI相关
  aiProcessed: {
    polished: { type: Boolean, default: false },
    sentiment: String,     // 情感分析结果
    keywords: [String]     // 关键词提取
  },

  // 状态
  status: {
    type: String,
    enum: ['draft', 'published', 'deleted'],
    default: 'published'
  },
  isDraft: { type: Boolean, default: false },

  // 隐私
  privacy: {
    type: String,
    enum: ['private', 'friends', 'public'],
    default: 'private'
  },

  // 关联图文集
  albumIds: [{ type: Schema.Types.ObjectId, ref: 'Album' }],

  // 统计
  viewCount: { type: Number, default: 0 },
  likeCount: { type: Number, default: 0 }
}, {
  timestamps: true
});

// 索引
DiarySchema.index({ userId: 1, diaryDate: -1 });
DiarySchema.index({ userId: 1, status: 1 });
DiarySchema.index({ 'tags.name': 1 });
DiarySchema.index({ createdAt: -1 });

// 虚拟字段：是否为草稿
DiarySchema.virtual('isPublished').get(function() {
  return this.status === 'published';
});

module.exports = mongoose.model('Diary', DiarySchema);
