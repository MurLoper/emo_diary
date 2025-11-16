# 心晴日记 - 项目总览文档

## 📱 项目简介

**项目名称**：心晴日记 (Emotions Diary)  
**项目类型**：跨平台日记应用（微信小程序为主）  
**核心特色**：动态主题系统 + AI 辅助 + 图文集生成  
**目标用户**：喜欢记录生活、注重视觉体验的年轻用户

---

## 🎯 核心功能

### 1. 日记功能
- ✅ 创建/编辑/删除日记
- ✅ 上传多张图片（最多9张）
- ✅ 图片拖拽排序
- ✅ 多标签分类（心情、活动、社交等）
- ✅ AI 文字润色
- ✅ AI 图文排版建议
- ✅ 草稿自动保存
- ✅ 按标签/时间筛选
- ✅ 全文搜索

### 2. 图文集功能
- ✅ 选择多条日记合成图文集
- ✅ 智能标签推荐
- ✅ 4种预设模板（经典、杂志、时间线、极简）
- ✅ 主题风格匹配
- ✅ 生成长图
- ✅ 导出 PDF
- ✅ 打印预约服务

### 3. 动态主题系统（核心特色⭐）
- ✅ 12+ 免费主题（粉色少女、绿意盎然、暗夜星辰、璀璨星空、金色余晖、克莱因蓝、中国传统色系等）
- ✅ 实时主题切换（全局渲染）
- ✅ 主题资源 CDN 加速
- ✅ 本地缓存机制
- ✅ 版本更新检测
- ✅ 多平台适配（微信、Android、iOS、鸿蒙、Web）
- ✅ 主题商店（签到解锁、积分兑换、付费购买）

### 4. 签到与积分系统
- ✅ 每日签到奖励
- ✅ 连续签到额外奖励（7天、30天、100天）
- ✅ 签到日历展示
- ✅ 积分获取（签到、写日记、创建图文集、分享、邀请）
- ✅ 积分消费（解锁主题、AI 润色、导出 PDF）
- ✅ 积分明细记录

### 5. 其他功能
- ✅ 新手引导
- ✅ 首页 Banner（展示精选图文集）
- ✅ 个人中心
- ✅ 数据统计
- ✅ 隐私设置
- ✅ 自动备份

---

## 🏗️ 技术架构

### 前端（微信小程序）
```
技术栈：
├── 微信小程序原生框架
├── JavaScript ES6+
├── WXML + WXSS
└── 第三方库：
    ├── 图片压缩
    ├── Canvas 绘制
    └── 富文本编辑器

目录结构：
├── pages/              # 页面
│   ├── index/         # 首页
│   ├── diary/         # 日记相关
│   ├── album/         # 图文集
│   ├── theme/         # 主题商店
│   ├── user/          # 用户中心
│   └── checkin/       # 签到
├── components/         # 组件
│   ├── theme-wrapper/ # 主题包裹
│   ├── diary-card/    # 日记卡片
│   ├── image-uploader/# 图片上传
│   └── tag-selector/  # 标签选择
├── utils/             # 工具类
│   ├── theme-manager.js  # 主题管理器⭐
│   ├── api.js            # API 封装
│   └── canvas-utils.js   # Canvas 工具
└── app.js             # 应用入口
```

### 后端（Node.js）
```
技术栈：
├── Node.js 18+
├── Express 4.x
├── MongoDB 6.0 (Mongoose)
├── Redis (缓存)
├── JWT (认证)
└── 第三方服务：
    ├── 腾讯云 COS（存储）
    ├── CDN（加速）
    ├── OpenAI API（AI 服务）
    └── 打印服务 API

目录结构：
├── src/
│   ├── models/           # 数据模型
│   │   ├── User.js
│   │   ├── Diary.js
│   │   ├── Album.js
│   │   ├── Theme.js ⭐
│   │   ├── CheckIn.js
│   │   └── PointsRecord.js
│   ├── controllers/      # 控制器
│   ├── services/         # 业务逻辑
│   │   ├── themeService.js ⭐
│   │   ├── cacheService.js
│   │   └── pointsService.js
│   ├── routes/          # 路由
│   ├── middlewares/     # 中间件
│   └── utils/           # 工具类
└── theme-resources/     # 主题资源⭐
    ├── wechat/         # 微信小程序 CSS
    ├── android/        # Android 样式
    ├── ios/            # iOS 样式
    ├── harmony/        # 鸿蒙样式
    └── web/            # Web CSS
```

### 数据库（MongoDB）
```
核心集合：
├── users              # 用户
├── diaries            # 日记
├── albums             # 图文集
├── themes ⭐          # 主题配置
├── checkins           # 签到记录
├── pointsRecords      # 积分记录
└── tags               # 标签
```

---

## 🎨 主题系统详解（核心特色）

### 主题数据结构
```javascript
{
  id: 'pink-girl',                    // 主题 ID
  name: '粉色少女',                    // 主题名称
  category: 'free',                   // 分类（免费/付费/签到/限定）
  
  cssConfig: {                        // CSS 配置⭐
    colors: {                         // 颜色系统
      primary: '#FFB7C5',
      secondary: '#FFC0CB',
      background: '#FFF5F7',
      // ... 更多颜色
    },
    components: {                     // 组件样式
      card: { borderRadius, padding, shadow, ... },
      button: { borderRadius, padding, ... },
      input: { ... },
      list: { ... },
      navbar: { ... },
      tabbar: { ... },
    },
    effects: {                        // 特效
      blur: 'blur(10px)',
      gradient: 'linear-gradient(...)',
      shadow: { ... }
    }
  },
  
  resources: {                        // 资源文件⭐
    platforms: {
      wechat: {
        cssUrl: 'https://cdn.../pink-girl.wxss',
        version: '1.0.0',
        hash: 'abc123...'             // 用于缓存验证
      },
      // ... 其他平台
    },
    backgroundImages: [...],
    decorationImages: [...]
  },
  
  unlockMethod: {                     // 解锁方式
    type: 'free',                     // free/points/signin/purchase
    pointsCost: 500,
    signinDays: 7
  }
}
```

### 主题切换流程
```
用户点击主题
    ↓
检查本地缓存
    ↓
有缓存且无更新 → 直接应用
    ↓
无缓存或有更新
    ↓
从后端获取主题配置
    ↓
下载 CSS 资源文件
    ↓
下载背景/装饰图片
    ↓
保存到本地缓存
    ↓
应用主题（注入 CSS 变量）
    ↓
通知所有页面刷新
    ↓
完成！✅
```

### 主题应用示例
```javascript
// 页面 JS
Page({
  data: {
    cssVars: {}  // 主题 CSS 变量
  },
  
  onLoad() {
    const app = getApp();
    this.setData({
      cssVars: app.globalData.cssVars
    });
  },
  
  onThemeChange() {
    // 主题切换时自动调用
    this.setData({
      cssVars: getApp().globalData.cssVars
    });
  }
});
```

```xml
<!-- 页面 WXML -->
<view class="card" style="
  background: {{cssVars['--theme-surface']}};
  border-radius: {{cssVars['--card-radius']}};
  box-shadow: {{cssVars['--card-shadow']}};
">
  <button style="
    background: {{cssVars['--theme-primary']}};
    color: {{cssVars['--theme-primary-foreground']}};
  ">确认</button>
</view>
```

---

## 📊 数据流转

### 1. 创建日记流程
```
用户输入内容
    ↓
选择/拖拽图片
    ↓
上传图片到 COS → 生成缩略图
    ↓
（可选）AI 润色文字
    ↓
添加标签
    ↓
保存到数据库
    ↓
增加积分奖励
    ↓
完成！
```

### 2. 生成图文集流程
```
选择日记（按标签筛选）
    ↓
选择模板
    ↓
选择/继承主题风格
    ↓
后端生成数据快照
    ↓
前端 Canvas 绘制预览
    ↓
用户确认
    ↓
生成长图/PDF
    ↓
保存到相册/导出
    ↓
完成！
```

### 3. 签到流程
```
用户点击签到
    ↓
检查今日是否已签到
    ↓
计算连续天数
    ↓
计算奖励（积分 + 道具）
    ↓
更新用户数据
    ↓
检查是否解锁新主题
    ↓
显示签到结果
    ↓
完成！
```

---

## 🔐 安全机制

### 认证与授权
- ✅ JWT Token 认证
- ✅ 微信登录（openid + unionid）
- ✅ Token 自动刷新
- ✅ 接口权限验证

### 数据安全
- ✅ 敏感信息加密
- ✅ HTTPS 传输
- ✅ SQL/NoSQL 注入防护
- ✅ XSS 防护

### 接口安全
- ✅ 限流（express-rate-limit）
- ✅ 参数验证（express-validator）
- ✅ 防重放攻击
- ✅ CORS 配置

### 文件安全
- ✅ 文件类型验证
- ✅ 文件大小限制
- ✅ 恶意文件检测
- ✅ CDN 防盗链

---

## ⚡ 性能优化

### 前端优化
- ✅ 代码分包（按功能模块）
- ✅ 图片懒加载
- ✅ 列表虚拟滚动
- ✅ 主题资源缓存⭐
- ✅ 组件按需加载
- ✅ 数据预取
- ✅ 防抖节流

### 后端优化
- ✅ Redis 缓存热点数据
- ✅ 数据库索引优化
- ✅ 聚合管道查询
- ✅ CDN 加速静态资源
- ✅ 图片压缩处理
- ✅ 接口响应压缩（gzip）
- ✅ 数据库读写分离

### 性能指标
- 🎯 首屏加载 < 2s
- 🎯 主题切换 < 500ms
- 🎯 接口响应 < 200ms
- 🎯 列表滚动 60fps
- 🎯 图片加载优化（WebP、渐进式）

---

## 📦 部署方案

### 开发环境
```
本地开发：
├── 微信开发者工具（小程序）
├── VSCode（后端）
├── MongoDB Compass（数据库）
└── Redis Desktop Manager（缓存）
```

### 生产环境
```
服务器：
├── 阿里云 / 腾讯云
├── Docker 容器化部署
├── Nginx 反向代理 + 负载均衡
├── MongoDB 集群（主从复制）
├── Redis 集群
└── CDN 加速

监控：
├── PM2（进程管理）
├── 日志系统（Winston）
├── 性能监控
└── 错误追踪
```

---

## 📈 产品规划

### v1.0.0（MVP）
- ✅ 日记 CRUD
- ✅ 图片上传
- ✅ 12 个免费主题
- ✅ 基础签到
- ✅ 图文集生成

### v1.1.0
- ⏳ AI 文字润色
- ⏳ AI 排版建议
- ⏳ 图文集导出 PDF
- ⏳ 付费主题商店
- ⏳ 邀请好友

### v1.2.0
- ⏳ 社交分享
- ⏳ 评论点赞
- ⏳ 打印服务
- ⏳ 节日限定主题
- ⏳ 多端同步

### v2.0.0
- ⏳ Android / iOS App
- ⏳ 鸿蒙适配
- ⏳ Web 版本
- ⏳ 数据导出
- ⏳ 高级会员

---

## 💡 技术亮点

### 1. 动态主题系统⭐⭐⭐
- 业界领先的主题切换方案
- 支持多平台、多版本、热更新
- 完善的缓存和版本控制机制
- 用户体验流畅

### 2. AI 辅助功能⭐⭐
- 文字润色提升内容质量
- 智能排版优化视觉效果
- 情感分析和关键词提取

### 3. 图文集生成⭐⭐
- Canvas 绘制长图
- 多种模板选择
- PDF 导出
- 打印服务对接

### 4. 积分激励体系⭐
- 完善的积分获取和消费机制
- 签到连击奖励
- 主题解锁激励

### 5. 性能优化⭐
- 首屏加载优化
- 图片懒加载
- 虚拟列表
- 缓存策略

---

## 🚀 快速开始

### 环境准备
```bash
# 1. 安装 Node.js 18+
node -v

# 2. 安装 MongoDB 6.0
mongod --version

# 3. 安装 Redis
redis-server --version

# 4. 克隆项目
git clone https://github.com/your-repo/emotions-diary.git
```

### 后端启动
```bash
cd emotions-diary-backend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件

# 初始化主题数据
npm run seed:themes

# 启动服务
npm run dev
```

### 小程序启动
```bash
# 1. 使用微信开发者工具打开项目

# 2. 配置 AppID

# 3. 编译运行
```

---

## 📚 文档索引

- [微信小程序开发文档](./wechat-miniprogram-development.md)
- [后端架构设计文档](./backend-architecture.md)
- [AI 开发 Prompt 文档](./ai-development-prompt.md)
- [API 接口文档](./api-documentation.md)（待创建）
- [数据库设计文档](./database-design.md)（待创建）
- [主题开发指南](./theme-development-guide.md)（待创建）

---

## 👥 团队分工建议

### 前端（2人）
- 负责微信小程序开发
- 负责主题系统前端实现
- 负责 Canvas 图文集生成
- 负责性能优化

### 后端（2人）
- 负责 API 接口开发
- 负责主题管理系统
- 负责数据库设计
- 负责 AI 服务对接

### UI/UX（1人）
- 负责界面设计
- 负责主题配色方案
- 负责图文集模板设计
- 负责交互设计

### 测试（1人）
- 负责功能测试
- 负责性能测试
- 负责兼容性测试
- 负责安全测试

---

## 📞 联系方式

- 项目地址：https://github.com/your-repo/emotions-diary
- 技术文档：https://docs.emotions-diary.com
- 问题反馈：https://github.com/your-repo/emotions-diary/issues

---

**最后更新**：2025-01-15  
**文档版本**：v1.0.0
