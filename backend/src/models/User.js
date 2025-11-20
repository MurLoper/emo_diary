const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * 用户模型
 */
const UserSchema = new Schema({
  // 基本信息
  openid: {
    type: String,
    required: true,
    unique: true
  },
  unionid: String,
  nickname: { type: String, default: '日记用户' },
  avatar: String,
  gender: { type: Number, enum: [0, 1, 2], default: 0 }, // 0未知 1男 2女

  // 会员信息
  memberLevel: {
    type: String,
    enum: ['free', 'vip', 'svip'],
    default: 'free'
  },
  memberExpireAt: Date,

  // 积分系统
  points: { type: Number, default: 0 },
  totalPoints: { type: Number, default: 0 }, // 累计获得积分

  // 签到信息
  checkIn: {
    lastCheckInDate: Date,
    continuousDays: { type: Number, default: 0 },
    totalDays: { type: Number, default: 0 }
  },

  // 主题相关
  currentThemeId: {
    type: String,
    default: 'pink-girl'
  },
  ownedThemes: [{
    themeId: String,
    unlockMethod: {
      type: String,
      enum: ['default', 'purchase', 'signin', 'activity']
    },
    unlockedAt: { type: Date, default: Date.now }
  }],

  // 统计数据
  stats: {
    diaryCount: { type: Number, default: 0 },
    albumCount: { type: Number, default: 0 },
    photoCount: { type: Number, default: 0 }
  },

  // 设置
  settings: {
    notifications: { type: Boolean, default: true },
    autoBackup: { type: Boolean, default: false },
    privacyMode: { type: Boolean, default: false }
  },

  // 状态
  status: {
    type: String,
    enum: ['active', 'banned', 'deleted'],
    default: 'active'
  },

  // 时间戳
  lastLoginAt: Date
}, {
  timestamps: true
});

// 索引
UserSchema.index({ openid: 1 });
UserSchema.index({ createdAt: -1 });

// 实例方法：检查是否拥有主题
UserSchema.methods.hasTheme = function(themeId) {
  return this.ownedThemes.some(t => t.themeId === themeId);
};

// 实例方法：添加主题
UserSchema.methods.addTheme = function(themeId, unlockMethod) {
  if (!this.hasTheme(themeId)) {
    this.ownedThemes.push({
      themeId,
      unlockMethod,
      unlockedAt: new Date()
    });
  }
};

module.exports = mongoose.model('User', UserSchema);
