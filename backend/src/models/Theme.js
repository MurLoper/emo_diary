const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * 主题模型 - 核心特色功能
 */
const ThemeSchema = new Schema({
  // 基本信息
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: { type: String, required: true },
  nameEn: String,
  description: String,

  // 分类
  category: {
    type: String,
    enum: ['free', 'premium', 'festival', 'special', 'limited'],
    default: 'free'
  },
  tags: [String], // 标签: 少女, 复古, 简约, 中国风, etc.

  // 预览
  preview: {
    thumbnail: { type: String, required: true },
    screenshots: [String],
    demoVideo: String
  },

  // 获取方式
  unlockMethod: {
    type: {
      type: String,
      enum: ['default', 'points', 'signin', 'purchase', 'activity'],
      required: true
    },
    pointsCost: Number,        // 积分价格
    moneyCost: Number,         // 人民币价格
    signinDays: Number,        // 需要签到天数
    activityId: String         // 活动ID
  },

  // CSS 配置
  cssConfig: {
    // 颜色系统
    colors: {
      primary: { type: String, required: true },
      secondary: { type: String, required: true },
      accent: String,
      background: { type: String, required: true },
      surface: String,
      text: {
        primary: String,
        secondary: String,
        disabled: String,
        hint: String
      },
      border: String,
      divider: String,
      shadow: String,
      error: String,
      success: String,
      warning: String,
      info: String
    },

    // 组件样式
    components: {
      // 卡片
      card: {
        borderRadius: String,
        padding: String,
        margin: String,
        shadow: String,
        background: String,
        borderWidth: String,
        borderColor: String
      },

      // 按钮
      button: {
        borderRadius: String,
        padding: String,
        fontSize: String,
        fontWeight: String,
        height: String,
        shadow: String,
        primary: {
          background: String,
          color: String,
          hoverBackground: String
        },
        secondary: {
          background: String,
          color: String,
          hoverBackground: String
        },
        outline: {
          borderColor: String,
          color: String,
          hoverBackground: String
        }
      },

      // 输入框
      input: {
        borderRadius: String,
        borderWidth: String,
        borderColor: String,
        padding: String,
        fontSize: String,
        height: String,
        focusBorderColor: String,
        backgroundColor: String
      },

      // 列表
      list: {
        itemHeight: String,
        itemPadding: String,
        dividerColor: String,
        dividerWidth: String,
        hoverBackground: String
      },

      // 导航栏
      navbar: {
        height: String,
        background: String,
        color: String,
        shadow: String,
        borderBottom: String
      },

      // 底部导航
      tabbar: {
        height: String,
        background: String,
        color: String,
        activeColor: String,
        shadow: String,
        borderTop: String
      },

      // 标签
      tag: {
        borderRadius: String,
        padding: String,
        fontSize: String,
        fontWeight: String
      },

      // 对话框
      dialog: {
        borderRadius: String,
        padding: String,
        shadow: String,
        background: String
      }
    },

    // 特效
    effects: {
      blur: String,              // backdrop-filter: blur(10px)
      gradient: String,          // 渐变色定义
      shadow: {
        small: String,
        medium: String,
        large: String
      },
      animation: {
        duration: String,        // 动画时长
        timing: String           // 动画曲线
      },
      // 新增：页面设计中的特效配置
      buttonStyle: String,       // 按钮风格: fluffy, glossy, neon, soft等
      cardShadow: String,        // 卡片阴影
      cardRadius: String,        // 卡片圆角
      textShadow: String,        // 文字阴影
      buttonGlow: String,        // 按钮发光效果
      buttonGradient: String     // 按钮渐变
    },

    // 字体
    typography: {
      fontFamily: String,
      fontSize: {
        xs: String,
        sm: String,
        base: String,
        lg: String,
        xl: String,
        '2xl': String,
        '3xl': String
      },
      fontWeight: {
        normal: String,
        medium: String,
        semibold: String,
        bold: String
      },
      lineHeight: {
        tight: String,
        normal: String,
        relaxed: String
      }
    },

    // 间距
    spacing: {
      xs: String,
      sm: String,
      md: String,
      lg: String,
      xl: String,
      '2xl': String
    },

    // 圆角
    borderRadius: {
      none: String,
      sm: String,
      md: String,
      lg: String,
      xl: String,
      full: String
    }
  },

  // 资源文件
  resources: {
    // 不同平台的CSS文件
    platforms: {
      wechat: {
        cssUrl: String,        // CDN URL
        cssPath: String,       // 服务器存储路径
        version: String,
        size: Number,
        hash: String           // 文件哈希,用于缓存验证
      },
      android: {
        styleUrl: String,
        stylePath: String,
        version: String,
        size: Number,
        hash: String
      },
      ios: {
        styleUrl: String,
        stylePath: String,
        version: String,
        size: Number,
        hash: String
      },
      harmony: {
        styleUrl: String,
        stylePath: String,
        version: String,
        size: Number,
        hash: String
      },
      web: {
        cssUrl: String,
        cssPath: String,
        version: String,
        size: Number,
        hash: String
      }
    },

    // 背景图片
    backgroundImages: [{
      url: String,
      cdnUrl: String,
      width: Number,
      height: Number,
      size: Number
    }],

    // 装饰元素
    decorationImages: [{
      url: String,
      cdnUrl: String,
      type: String,          // corner, border, icon, etc.
      size: Number
    }]
  },

  // 版本控制
  version: { type: String, default: '1.0.0' },
  changelog: [{
    version: String,
    changes: [String],
    date: Date
  }],

  // 统计
  stats: {
    downloadCount: { type: Number, default: 0 },
    activeUsers: { type: Number, default: 0 },
    rating: { type: Number, default: 5.0 },
    ratingCount: { type: Number, default: 0 }
  },

  // 状态
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },
  isDefault: { type: Boolean, default: false },
  featured: { type: Boolean, default: false }, // 是否精选

  // 时间
  availableFrom: Date,       // 开始时间(限时主题)
  availableTo: Date         // 结束时间
}, {
  timestamps: true
});

// 索引
ThemeSchema.index({ id: 1 }, { unique: true });
ThemeSchema.index({ category: 1, status: 1 });
ThemeSchema.index({ featured: -1, 'stats.activeUsers': -1 });

module.exports = mongoose.model('Theme', ThemeSchema);
