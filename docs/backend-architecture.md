# 心晴日记 - 后端架构与数据库设计文档

## 项目概述

**项目名称**：心晴日记后端服务  
**技术栈**：Node.js + Express + MongoDB + Redis  
**部署**：Docker + Nginx  
**版本**：1.0.0

---

## 一、系统架构

### 1.1 架构设计

```
┌─────────────────────────────────────────────────────────────┐
│                        客户端层                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │微信小程序│  │  Android │  │   iOS    │  │   Web    │   │
│  └─────┬────┘  └─────┬────┘  └─────┬────┘  └─────┬────┘   │
└────────┼─────────────┼─────────────┼─────────────┼─────────┘
         │             │             │             │
         └─────────────┴─────────────┴─────────────┘
                            │
         ┌──────────────────▼──────────────────┐
         │           Nginx (负载均衡)          │
         └──────────────────┬──────────────────┘
                            │
         ┌──────────────────▼──────────────────┐
         │          API Gateway (可选)          │
         └──────────────────┬──────────────────┘
                            │
    ┌───────────────────────┼───────────────────────┐
    │                       │                       │
┌───▼───┐              ┌───▼───┐              ┌───▼───┐
│Node.js│              │Node.js│              │Node.js│
│Server │              │Server │              │Server │
│  #1   │              │  #2   │              │  #3   │
└───┬───┘              └───┬───┘              └───┬───┘
    │                      │                      │
    └──────────────────────┼──────────────────────┘
                           │
        ┌──────────────────┴──────────────────┐
        │                                     │
    ┌───▼────┐                          ┌────▼────┐
    │ Redis  │                          │ MongoDB │
    │ (缓存) │                          │ (主库)  │
    └────────┘                          └─────┬───┘
                                              │
                                        ┌─────▼───┐
                                        │ MongoDB │
                                        │ (从库)  │
                                        └─────────┘

外部服务:
├── 腾讯云 COS (对象存储)
├── CDN (静态资源)
├── OpenAI API (AI 服务)
└── 打印服务 API
```

### 1.2 目录结构

```
emotions-diary-backend/
├── src/
│   ├── config/                  # 配置文件
│   │   ├── database.js         # 数据库配置
│   │   ├── redis.js            # Redis配置
│   │   ├── storage.js          # 存储配置
│   │   └── constants.js        # 常量定义
│   ├── models/                  # 数据模型
│   │   ├── User.js
│   │   ├── Diary.js
│   │   ├── Album.js
│   │   ├── Theme.js
│   │   ├── CheckIn.js
│   │   └── Points.js
│   ├── controllers/             # 控制器
│   │   ├── authController.js
│   │   ├── diaryController.js
│   │   ├── albumController.js
│   │   ├── themeController.js
│   │   ├── userController.js
│   │   └── aiController.js
│   ├── routes/                  # 路由
│   │   ├── auth.js
│   │   ├── diary.js
│   │   ├── album.js
│   │   ├── theme.js
│   │   ├── user.js
│   │   └── ai.js
│   ├── middlewares/             # 中间件
│   │   ├── auth.js             # 鉴权中间件
│   │   ├── upload.js           # 文件上传
│   │   ├── rateLimit.js        # 限流
│   │   ├── errorHandler.js     # 错误处理
│   │   └── logger.js           # 日志
│   ├── services/                # 业务逻辑
│   │   ├── themeService.js
│   │   ├── storageService.js
│   │   ├── aiService.js
│   │   ├── cacheService.js
│   │   └── pointsService.js
│   ├── utils/                   # 工具类
│   │   ├── response.js
│   │   ├── validator.js
│   │   ├── imageProcessor.js
│   │   └── pdfGenerator.js
│   └── app.js                   # 应用入口
├── tests/                       # 测试
├── scripts/                     # 脚本
│   ├── seed-themes.js          # 初始化主题数据
│   └── migrate.js              # 数据迁移
├── theme-resources/             # 主题资源文件
│   ├── wechat/                 # 微信小程序CSS
│   ├── android/                # Android样式
│   ├── ios/                    # iOS样式
│   ├── harmony/                # 鸿蒙样式
│   └── web/                    # Web CSS
├── .env                         # 环境变量
├── .env.example
├── package.json
├── docker-compose.yml
└── README.md
```

---

## 二、数据库设计

### 2.1 用户集合 (users)

```javascript
const UserSchema = new Schema({
  // 基本信息
  openid: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
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
    unlockedAt: Date
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
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastLoginAt: Date
}, {
  timestamps: true
});

// 索引
UserSchema.index({ openid: 1 });
UserSchema.index({ createdAt: -1 });

module.exports = mongoose.model('User', UserSchema);
```

### 2.2 日记集合 (diaries)

```javascript
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
  likeCount: { type: Number, default: 0 },
  
  // 时间戳
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// 索引
DiarySchema.index({ userId: 1, diaryDate: -1 });
DiarySchema.index({ userId: 1, status: 1 });
DiarySchema.index({ 'tags.name': 1 });
DiarySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Diary', DiarySchema);
```

### 2.3 图文集集合 (albums)

```javascript
const AlbumSchema = new Schema({
  // 所属用户
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true 
  },
  
  // 基本信息
  title: { type: String, required: true },
  description: String,
  cover: { type: String, required: true }, // 封面图
  
  // 关联日记
  diaryIds: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Diary' 
  }],
  
  // 日记数据快照(用于生成时固化数据)
  diarySnapshots: [{
    diaryId: Schema.Types.ObjectId,
    title: String,
    content: String,
    images: [String],
    date: Date,
    tags: [String]
  }],
  
  // 模板和样式
  template: {
    id: { type: String, required: true },
    name: String,
    layout: String,           // 布局方式
    imageRatio: String,       // 图片比例
    textPosition: String      // 文字位置
  },
  
  // 主题风格(继承自用户当前主题或自定义)
  themeId: String,
  customStyle: {
    backgroundColor: String,
    fontFamily: String,
    fontSize: String,
    primaryColor: String
  },
  
  // 标签筛选条件
  filterTags: [String],      // 创建时使用的标签筛选
  
  // 生成的文件
  outputs: {
    longImage: String,       // 长图URL
    pdf: String,             // PDF URL
    html: String,            // HTML URL (Web预览)
    printFile: String        // 打印文件URL
  },
  
  // 统计
  pageCount: { type: Number, default: 0 },
  imageCount: { type: Number, default: 0 },
  wordCount: { type: Number, default: 0 },
  
  // 状态
  status: { 
    type: String, 
    enum: ['generating', 'completed', 'failed', 'deleted'], 
    default: 'generating' 
  },
  
  // 导出与打印
  exportCount: { type: Number, default: 0 },
  lastExportAt: Date,
  printOrders: [{
    orderId: String,
    status: String,
    createdAt: Date
  }],
  
  // 时间戳
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// 索引
AlbumSchema.index({ userId: 1, createdAt: -1 });
AlbumSchema.index({ status: 1 });

module.exports = mongoose.model('Album', AlbumSchema);
```

### 2.4 主题集合 (themes)

```javascript
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
        // 不同类型按钮
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
      }
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
  availableTo: Date,         // 结束时间
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// 索引
ThemeSchema.index({ id: 1 }, { unique: true });
ThemeSchema.index({ category: 1, status: 1 });
ThemeSchema.index({ featured: -1, 'stats.activeUsers': -1 });

module.exports = mongoose.model('Theme', ThemeSchema);
```

### 2.5 签到记录集合 (checkins)

```javascript
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

// 复合索引
CheckInSchema.index({ userId: 1, date: 1 }, { unique: true });
CheckInSchema.index({ timestamp: -1 });

module.exports = mongoose.model('CheckIn', CheckInSchema);
```

### 2.6 积分记录集合 (pointsRecords)

```javascript
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
```

### 2.7 标签集合 (tags)

```javascript
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
```

---

## 三、API 接口设计

### 3.1 认证接口

#### POST /api/auth/login
微信登录

**请求参数:**
```javascript
{
  code: string,           // 微信登录code
  userInfo?: {           // 可选用户信息
    nickname: string,
    avatar: string,
    gender: number
  }
}
```

**响应:**
```javascript
{
  success: true,
  data: {
    token: string,
    user: {
      id: string,
      nickname: string,
      avatar: string,
      points: number,
      memberLevel: string
    }
  }
}
```

---

### 3.2 主题接口

#### GET /api/themes
获取主题列表

**请求参数:**
```javascript
{
  category?: string,      // 分类筛选
  platform: string,       // wechat, android, ios, harmony, web
  page: number,
  limit: number
}
```

**响应:**
```javascript
{
  success: true,
  data: {
    themes: [{
      id: string,
      name: string,
      description: string,
      preview: {
        thumbnail: string,
        screenshots: string[]
      },
      unlockMethod: {
        type: string,
        pointsCost?: number,
        signinDays?: number
      },
      isOwned: boolean,
      isActive: boolean
    }],
    total: number,
    page: number,
    limit: number
  }
}
```

#### GET /api/themes/:themeId
获取单个主题详情

**响应:**
```javascript
{
  success: true,
  data: {
    id: string,
    name: string,
    description: string,
    cssConfig: { ... },
    resources: {
      platforms: {
        wechat: {
          cssUrl: string,
          version: string,
          hash: string
        }
      },
      backgroundImages: [...],
      decorationImages: [...]
    },
    version: string
  }
}
```

#### POST /api/themes/:themeId/unlock
解锁主题

**请求参数:**
```javascript
{
  method: string  // 'points' or 'purchase'
}
```

#### POST /api/themes/:themeId/apply
应用主题

**响应:**
```javascript
{
  success: true,
  data: {
    theme: { ... },
    cached: boolean
  }
}
```

#### GET /api/themes/:themeId/check-update
检查主题更新

**响应:**
```javascript
{
  success: true,
  data: {
    hasUpdate: boolean,
    currentVersion: string,
    latestVersion: string,
    changelog: [...]
  }
}
```

---

### 3.3 日记接口

#### GET /api/diaries
获取日记列表

**请求参数:**
```javascript
{
  page: number,
  limit: number,
  tags?: string[],        // 标签筛选
  startDate?: string,     // 开始日期
  endDate?: string,       // 结束日期
  keyword?: string        // 搜索关键词
}
```

#### POST /api/diaries
创建日记

**请求参数:**
```javascript
{
  title?: string,
  content: string,
  images: [{
    url: string,
    width: number,
    height: number,
    order: number
  }],
  tags: [{
    category: string,
    name: string
  }],
  diaryDate: string,
  location?: { ... },
  isDraft: boolean
}
```

#### PUT /api/diaries/:id
更新日记

#### DELETE /api/diaries/:id
删除日记

#### POST /api/diaries/:id/polish
AI润色

**请求参数:**
```javascript
{
  style: string  // 'elegant', 'casual', 'poetic'
}
```

**响应:**
```javascript
{
  success: true,
  data: {
    original: string,
    polished: string,
    pointsCost: number
  }
}
```

---

### 3.4 图文集接口

#### POST /api/albums
创建图文集

**请求参数:**
```javascript
{
  title: string,
  description?: string,
  diaryIds: string[],
  templateId: string,
  filterTags?: string[],
  themeId?: string
}
```

#### GET /api/albums/:id
获取图文集详情

#### POST /api/albums/:id/export
导出图文集

**请求参数:**
```javascript
{
  format: string  // 'image', 'pdf', 'html'
}
```

**响应:**
```javascript
{
  success: true,
  data: {
    url: string,
    format: string,
    size: number,
    expiresAt: string
  }
}
```

---

### 3.5 用户接口

#### GET /api/user/profile
获取用户信息

#### PUT /api/user/profile
更新用户信息

#### GET /api/user/stats
获取用户统计

**响应:**
```javascript
{
  success: true,
  data: {
    diaryCount: number,
    albumCount: number,
    photoCount: number,
    points: number,
    continuousCheckInDays: number
  }
}
```

---

### 3.6 签到接口

#### POST /api/checkin
签到

**响应:**
```javascript
{
  success: true,
  data: {
    continuousDays: number,
    rewards: {
      points: number,
      bonusPoints: number,
      items: [...]
    },
    nextReward: {
      days: number,
      points: number,
      items: [...]
    }
  }
}
```

#### GET /api/checkin/calendar
获取签到日历

**请求参数:**
```javascript
{
  year: number,
  month: number
}
```

---

### 3.7 上传接口

#### POST /api/upload/image
上传图片

**请求参数:**
```
multipart/form-data
file: File
```

**响应:**
```javascript
{
  success: true,
  data: {
    url: string,
    cdnUrl: string,
    thumbnail: string,
    width: number,
    height: number,
    size: number
  }
}
```

---

## 四、核心服务实现

### 4.1 主题服务 (themeService.js)

```javascript
const Theme = require('../models/Theme');
const User = require('../models/User');
const cacheService = require('./cacheService');
const crypto = require('crypto');

class ThemeService {
  /**
   * 获取用户可用主题列表
   */
  async getAvailableThemes(userId, platform = 'wechat') {
    const cacheKey = `themes:${platform}:${userId}`;
    
    // 尝试从缓存获取
    let themes = await cacheService.get(cacheKey);
    if (themes) {
      return themes;
    }
    
    // 从数据库查询
    const user = await User.findById(userId);
    const allThemes = await Theme.find({ 
      status: 'active',
      [`resources.platforms.${platform}`]: { $exists: true }
    }).select('-cssConfig -resources.platforms');
    
    themes = allThemes.map(theme => {
      const isOwned = this.checkThemeOwnership(user, theme.id);
      return {
        id: theme.id,
        name: theme.name,
        description: theme.description,
        category: theme.category,
        preview: theme.preview,
        unlockMethod: theme.unlockMethod,
        isOwned,
        isActive: user.currentThemeId === theme.id
      };
    });
    
    // 缓存30分钟
    await cacheService.set(cacheKey, themes, 1800);
    
    return themes;
  }
  
  /**
   * 获取主题完整配置
   */
  async getThemeDetail(themeId, platform = 'wechat') {
    const cacheKey = `theme:detail:${themeId}:${platform}`;
    
    let theme = await cacheService.get(cacheKey);
    if (theme) {
      return theme;
    }
    
    theme = await Theme.findOne({ id: themeId, status: 'active' });
    if (!theme) {
      throw new Error('主题不存在');
    }
    
    // 构建响应数据
    const result = {
      id: theme.id,
      name: theme.name,
      description: theme.description,
      cssConfig: theme.cssConfig,
      resources: {
        cssUrl: theme.resources.platforms[platform]?.cssUrl,
        version: theme.resources.platforms[platform]?.version,
        hash: theme.resources.platforms[platform]?.hash,
        backgroundImages: theme.resources.backgroundImages,
        decorationImages: theme.resources.decorationImages
      },
      version: theme.version
    };
    
    // 缓存1小时
    await cacheService.set(cacheKey, result, 3600);
    
    return result;
  }
  
  /**
   * 解锁主题
   */
  async unlockTheme(userId, themeId, method) {
    const user = await User.findById(userId);
    const theme = await Theme.findOne({ id: themeId });
    
    if (!theme) {
      throw new Error('主题不存在');
    }
    
    // 检查是否已拥有
    if (this.checkThemeOwnership(user, themeId)) {
      throw new Error('已拥有该主题');
    }
    
    // 验证解锁方式
    if (method === 'points') {
      if (theme.unlockMethod.type !== 'points') {
        throw new Error('该主题不支持积分解锁');
      }
      
      const cost = theme.unlockMethod.pointsCost;
      if (user.points < cost) {
        throw new Error('积分不足');
      }
      
      // 扣除积分
      await this.deductPoints(userId, cost, 'purchase_theme', themeId);
    } else if (method === 'signin') {
      if (theme.unlockMethod.type !== 'signin') {
        throw new Error('该主题不支持签到解锁');
      }
      
      const requiredDays = theme.unlockMethod.signinDays;
      if (user.checkIn.continuousDays < requiredDays) {
        throw new Error(`需要连续签到${requiredDays}天`);
      }
    }
    
    // 添加到用户的主题列表
    user.ownedThemes.push({
      themeId: themeId,
      unlockMethod: method,
      unlockedAt: new Date()
    });
    
    await user.save();
    
    // 更新主题统计
    await Theme.updateOne(
      { id: themeId },
      { $inc: { 'stats.downloadCount': 1, 'stats.activeUsers': 1 } }
    );
    
    // 清除缓存
    await cacheService.del(`themes:*:${userId}`);
    
    return true;
  }
  
  /**
   * 应用主题
   */
  async applyTheme(userId, themeId) {
    const user = await User.findById(userId);
    
    // 检查是否拥有
    if (!this.checkThemeOwnership(user, themeId)) {
      throw new Error('未拥有该主题');
    }
    
    // 更新旧主题统计
    if (user.currentThemeId) {
      await Theme.updateOne(
        { id: user.currentThemeId },
        { $inc: { 'stats.activeUsers': -1 } }
      );
    }
    
    // 更新用户当前主题
    user.currentThemeId = themeId;
    await user.save();
    
    // 更新新主题统计
    await Theme.updateOne(
      { id: themeId },
      { $inc: { 'stats.activeUsers': 1 } }
    );
    
    // 清除缓存
    await cacheService.del(`themes:*:${userId}`);
    
    return true;
  }
  
  /**
   * 检查主题更新
   */
  async checkThemeUpdate(themeId, currentHash) {
    const theme = await Theme.findOne({ id: themeId });
    if (!theme) {
      return { hasUpdate: false };
    }
    
    const latestHash = theme.resources.platforms.wechat?.hash;
    
    return {
      hasUpdate: latestHash !== currentHash,
      currentVersion: currentHash,
      latestVersion: latestHash,
      version: theme.version,
      changelog: theme.changelog
    };
  }
  
  /**
   * 检查主题所有权
   */
  checkThemeOwnership(user, themeId) {
    // 检查是否为免费主题
    const theme = Theme.findOne({ id: themeId });
    if (theme?.category === 'free' || theme?.isDefault) {
      return true;
    }
    
    // 检查用户拥有列表
    return user.ownedThemes.some(t => t.themeId === themeId);
  }
  
  /**
   * 生成主题CSS文件的哈希值
   */
  generateThemeHash(cssContent) {
    return crypto.createHash('md5').update(cssContent).digest('hex');
  }
}

module.exports = new ThemeService();
```

### 4.2 缓存服务 (cacheService.js)

```javascript
const redis = require('../config/redis');

class CacheService {
  /**
   * 获取缓存
   */
  async get(key) {
    try {
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }
  
  /**
   * 设置缓存
   */
  async set(key, value, ttl = 3600) {
    try {
      await redis.setex(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Redis set error:', error);
      return false;
    }
  }
  
  /**
   * 删除缓存
   */
  async del(pattern) {
    try {
      if (pattern.includes('*')) {
        // 模糊匹配删除
        const keys = await redis.keys(pattern);
        if (keys.length > 0) {
          await redis.del(...keys);
        }
      } else {
        await redis.del(pattern);
      }
      return true;
    } catch (error) {
      console.error('Redis del error:', error);
      return false;
    }
  }
  
  /**
   * 批量获取
   */
  async mget(keys) {
    try {
      const values = await redis.mget(...keys);
      return values.map(v => v ? JSON.parse(v) : null);
    } catch (error) {
      console.error('Redis mget error:', error);
      return [];
    }
  }
}

module.exports = new CacheService();
```

### 4.3 积分服务 (pointsService.js)

```javascript
const User = require('../models/User');
const PointsRecord = require('../models/PointsRecord');

class PointsService {
  /**
   * 增加积分
   */
  async addPoints(userId, amount, source, description, relatedId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('用户不存在');
    }
    
    user.points += amount;
    user.totalPoints += amount;
    await user.save();
    
    // 记录
    await PointsRecord.create({
      userId,
      type: 'earn',
      source,
      amount,
      balance: user.points,
      description,
      relatedId
    });
    
    return user.points;
  }
  
  /**
   * 扣除积分
   */
  async deductPoints(userId, amount, source, description, relatedId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('用户不存在');
    }
    
    if (user.points < amount) {
      throw new Error('积分不足');
    }
    
    user.points -= amount;
    await user.save();
    
    // 记录
    await PointsRecord.create({
      userId,
      type: 'spend',
      source,
      amount,
      balance: user.points,
      description,
      relatedId
    });
    
    return user.points;
  }
  
  /**
   * 获取积分记录
   */
  async getPointsRecords(userId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    
    const [records, total] = await Promise.all([
      PointsRecord.find({ userId })
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit),
      PointsRecord.countDocuments({ userId })
    ]);
    
    return {
      records,
      total,
      page,
      limit
    };
  }
}

module.exports = new PointsService();
```

---

## 五、部署与运维

### 5.1 环境配置 (.env)

```bash
# 服务器配置
NODE_ENV=production
PORT=3000

# MongoDB
MONGODB_URI=mongodb://username:password@localhost:27017/emotions-diary
MONGODB_REPLICA_SET=rs0

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# 微信小程序
WECHAT_APPID=your_appid
WECHAT_SECRET=your_secret

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# 腾讯云 COS
COS_SECRET_ID=your_secret_id
COS_SECRET_KEY=your_secret_key
COS_BUCKET=your_bucket
COS_REGION=ap-guangzhou

# CDN
CDN_DOMAIN=https://cdn.yourdomain.com

# AI 服务
OPENAI_API_KEY=your_openai_key
OPENAI_BASE_URL=https://api.openai.com

# 其他
LOG_LEVEL=info
MAX_UPLOAD_SIZE=10485760  # 10MB
```

### 5.2 Docker 部署

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - mongodb
      - redis
    volumes:
      - ./theme-resources:/app/theme-resources
    restart: always

  mongodb:
    image: mongo:6.0
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password
    volumes:
      - mongodb_data:/data/db
    restart: always

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server --requirepass your_password
    volumes:
      - redis_data:/data
    restart: always

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: always

volumes:
  mongodb_data:
  redis_data:
```

### 5.3 初始化主题数据脚本

```javascript
// scripts/seed-themes.js
const mongoose = require('mongoose');
const Theme = require('../src/models/Theme');
const fs = require('fs');
const path = require('path');

const themes = [
  {
    id: 'pink-girl',
    name: '粉色少女',
    category: 'free',
    isDefault: true,
    // ... 完整配置
  },
  // ... 其他主题
];

async function seedThemes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('开始初始化主题数据...');
    
    for (const themeData of themes) {
      // 生成CSS文件
      const cssContent = generateCSS(themeData.cssConfig);
      const cssPath = path.join(__dirname, '../theme-resources/wechat', `${themeData.id}.wxss`);
      
      // 保存CSS文件
      fs.writeFileSync(cssPath, cssContent);
      
      // 生成哈希
      const hash = crypto.createHash('md5').update(cssContent).digest('hex');
      
      // 更新主题数据
      themeData.resources = {
        platforms: {
          wechat: {
            cssUrl: `${process.env.CDN_DOMAIN}/themes/wechat/${themeData.id}.wxss`,
            cssPath: cssPath,
            version: themeData.version,
            hash: hash
          }
        }
      };
      
      // 保存到数据库
      await Theme.findOneAndUpdate(
        { id: themeData.id },
        themeData,
        { upsert: true, new: true }
      );
      
      console.log(`✓ 主题 ${themeData.name} 初始化完成`);
    }
    
    console.log('所有主题初始化完成!');
    process.exit(0);
  } catch (error) {
    console.error('初始化失败:', error);
    process.exit(1);
  }
}

function generateCSS(cssConfig) {
  // 根据 cssConfig 生成 CSS 内容
  // ...
}

seedThemes();
```

---

## 六、性能优化

### 6.1 数据库优化
- 合理使用索引
- 使用 MongoDB 聚合管道
- 读写分离(主从复制)
- 数据分片(Sharding)

### 6.2 缓存策略
- Redis 缓存热点数据
- CDN 缓存静态资源
- 客户端缓存主题配置

### 6.3 API 优化
- 使用压缩(gzip)
- 分页加载
- 字段筛选
- 批量操作

---

## 七、监控与日志

### 7.1 日志系统
- 使用 Winston 记录日志
- 日志分级(error, warn, info, debug)
- 日志轮转

### 7.2 性能监控
- PM2 进程管理
- 接口响应时间监控
- 数据库慢查询监控

---

## 附录

### A. 主题CSS生成规则
详见主题服务实现

### B. 数据备份策略
- 每日自动备份 MongoDB
- 保留最近30天备份
- 异地容灾备份

### C. 安全规范
- HTTPS 传输
- JWT token 认证
- 敏感数据加密
- SQL 注入防护
- XSS 防护
