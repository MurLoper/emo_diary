# 心晴日记 - AI 开发 Prompt

## 一、微信小程序开发 AI Prompt

### Prompt 模板

```
你是一位资深的微信小程序开发工程师，精通微信小程序原生开发框架、JavaScript、WXML、WXSS 和微信小程序 API。

现在需要你为"心晴日记"（Emotions Diary）微信小程序开发以下功能：

## 项目背景
这是一个心情日记记录小程序，用户可以记录日常心情、上传图片、编写日记，并将日记合成图文集。
小程序的核心特色是**动态主题系统**，用户可以切换不同的视觉风格，所有页面和组件都会根据选定的主题实时渲染。

## 技术要求
1. 使用微信小程序原生框架
2. 遵循最新的小程序开发规范和最佳实践
3. 代码需要模块化、可维护、高性能
4. 必须支持动态主题切换功能
5. 使用 ES6+ 语法
6. 遵循组件化开发思想

## 主题系统要求（重要）
- 所有组件必须支持主题动态切换
- 使用全局主题变量（存储在 app.globalData.cssVars）
- 组件样式通过 style 属性绑定主题变量
- 页面需要实现 onThemeChange 回调函数
- 主题配置从后端 API 获取，包含颜色、圆角、阴影等所有样式变量

## 当前任务
[在这里描述具体需要开发的功能，例如：]
请帮我开发日记创建页面，包括以下功能：
1. 图片上传和预览（最多9张）
2. 图片拖拽排序功能
3. 富文本编辑器
4. 标签选择器（多选）
5. AI 文字润色按钮
6. 保存和发布功能
7. 草稿自动保存

## 输出要求
请提供：
1. 完整的页面代码（.js、.wxml、.wxss、.json）
2. 如果涉及新组件，提供组件代码
3. 如果需要调用 API，提供 API 调用代码
4. 代码注释要详细，特别是关键逻辑
5. 考虑边界情况和错误处理
6. 性能优化建议

## 示例代码风格
参考以下主题系统的使用方式：

// 在页面 JS 中
Page({
  data: {
    theme: {},
    cssVars: {}
  },
  
  onLoad() {
    this.applyTheme();
  },
  
  onThemeChange(theme) {
    this.applyTheme();
  },
  
  applyTheme() {
    const app = getApp();
    this.setData({
      theme: app.globalData.theme,
      cssVars: app.globalData.cssVars
    });
  }
});

<!-- 在 WXML 中 -->
<view class="card" style="
  background: {{cssVars['--theme-surface']}};
  border-radius: {{cssVars['--card-radius']}};
  padding: {{cssVars['--card-padding']}};
">
  <button style="
    background: {{cssVars['--theme-primary']}};
    color: {{cssVars['--theme-primary-foreground']}};
    border-radius: {{cssVars['--button-radius']}};
  ">确认</button>
</view>

现在请开始开发。
```

---

## 二、后端开发 AI Prompt

### Prompt 模板

```
你是一位资深的 Node.js 后端开发工程师，精通 Express 框架、MongoDB 数据库、RESTful API 设计和微服务架构。

现在需要你为"心晴日记"后端服务开发以下功能：

## 项目背景
这是一个日记记录应用的后端服务，使用 Node.js + Express + MongoDB + Redis 技术栈。
项目的核心特色是**动态主题系统**，需要管理多个主题配置，支持不同平台（微信小程序、Android、iOS、鸿蒙、Web），并实现主题的版本控制和缓存机制。

## 技术栈
- Node.js 18+
- Express 4.x
- MongoDB 6.0 (Mongoose)
- Redis (缓存)
- JWT (认证)
- 腾讯云 COS (文件存储)

## 架构要求
1. MVC 架构模式
2. RESTful API 设计
3. 错误统一处理
4. 日志记录（Winston）
5. 参数验证（express-validator）
6. 异步错误处理
7. 接口限流（express-rate-limit）
8. CORS 配置

## 数据模型
已有的数据模型包括：
- User: 用户信息
- Diary: 日记
- Album: 图文集
- Theme: 主题配置
- CheckIn: 签到记录
- PointsRecord: 积分记录

详细字段参见 backend-architecture.md 文档。

## 当前任务
[在这里描述具体需要开发的功能，例如：]
请帮我开发主题管理相关的 API 接口：
1. GET /api/themes - 获取主题列表
2. GET /api/themes/:themeId - 获取主题详情
3. POST /api/themes/:themeId/unlock - 解锁主题
4. POST /api/themes/:themeId/apply - 应用主题
5. GET /api/themes/:themeId/check-update - 检查主题更新

## 功能要求
1. 支持 Redis 缓存，合理设置 TTL
2. 实现版本控制，通过哈希值判断是否更新
3. 支持不同平台的资源文件管理
4. 积分解锁、签到解锁等多种解锁方式
5. 统计主题使用数据
6. 权限验证（需要登录）
7. 参数校验
8. 错误处理

## 输出要求
请提供：
1. 路由定义代码（routes/theme.js）
2. 控制器代码（controllers/themeController.js）
3. 服务层代码（services/themeService.js，如需要）
4. 中间件代码（如需要）
5. 详细的代码注释
6. API 接口文档（请求参数、响应格式、错误码）
7. 单元测试用例（可选）

## 示例代码风格

// routes/theme.js
const express = require('express');
const router = express.Router();
const themeController = require('../controllers/themeController');
const auth = require('../middlewares/auth');

router.get('/', auth, themeController.getThemes);
router.get('/:themeId', auth, themeController.getThemeDetail);

module.exports = router;

// controllers/themeController.js
const themeService = require('../services/themeService');
const { successResponse, errorResponse } = require('../utils/response');

exports.getThemes = async (req, res, next) => {
  try {
    const { platform = 'wechat', page = 1, limit = 20 } = req.query;
    const userId = req.user.id;
    
    const themes = await themeService.getAvailableThemes(userId, platform);
    
    return successResponse(res, themes);
  } catch (error) {
    next(error);
  }
};

## 错误处理规范
- 使用统一的错误响应格式
- 4xx 客户端错误
- 5xx 服务器错误
- 记录错误日志

## 性能要求
- 接口响应时间 < 200ms
- 使用 Redis 缓存热点数据
- 数据库查询优化（索引、聚合）
- 避免 N+1 查询问题

现在请开始开发。
```

---

## 三、主题 CSS 生成 AI Prompt

### Prompt 模板

```
你是一位资深的 UI/UX 设计师和前端工程师，精通色彩理论、CSS 样式设计和微信小程序样式开发。

现在需要你为"心晴日记"小程序生成一个新的主题样式配置。

## 任务要求
根据给定的主题概念，生成完整的主题配置对象（JSON 格式），包括：
1. 颜色系统（主色、辅助色、背景色、文字色等）
2. 组件样式（卡片、按钮、输入框、列表等）
3. 特效配置（阴影、渐变、动画等）
4. 字体和间距配置

## 主题概念
[在这里描述主题概念，例如：]
主题名称：樱花粉梦
主题风格：柔和、浪漫、少女感
主题色调：粉色系
设计理念：以春天的樱花为灵感，营造温柔梦幻的氛围

## 设计原则
1. 颜色搭配要和谐，对比度要符合可访问性标准
2. 圆角大小要统一，体现设计风格（例如：大圆角=现代感，小圆角=传统感）
3. 阴影要层次分明（sm、md、lg）
4. 按钮、卡片等组件样式要协调统一
5. 考虑暗色背景和浅色背景的文字可读性

## 参考色彩
主色：#FFB7C5（樱花粉）
辅助色：#FFC0CB（粉红）
强调色：#FF69B4（亮粉）
背景：#FFF5F7（淡粉白）

## 输出格式
请按照以下 JSON 结构输出完整配置：

{
  "id": "sakura-pink-dream",
  "name": "樱花粉梦",
  "description": "柔和浪漫的樱花主题，营造温馨梦幻的氛围",
  "category": "free",
  "cssConfig": {
    "colors": {
      "primary": "#FFB7C5",
      "secondary": "#FFC0CB",
      "accent": "#FF69B4",
      "background": "#FFF5F7",
      "surface": "#FFFFFF",
      "text": {
        "primary": "#2D1B2E",
        "secondary": "#9D6B84",
        "disabled": "#D4A5B8"
      },
      "border": "rgba(255, 183, 197, 0.3)",
      "shadow": "rgba(255, 105, 180, 0.15)"
    },
    "components": {
      "card": {
        "borderRadius": "1rem",
        "padding": "1rem",
        "shadow": "0 2px 8px rgba(255, 105, 180, 0.1)",
        "background": "#FFFFFF"
      },
      "button": {
        "borderRadius": "1.5rem",
        "padding": "0.5rem 1rem",
        "fontSize": "0.875rem",
        "fontWeight": "500",
        "primary": {
          "background": "#FFB7C5",
          "color": "#FFFFFF"
        },
        "secondary": {
          "background": "#FFC0CB",
          "color": "#2D1B2E"
        }
      },
      // ... 其他组件配置
    },
    "effects": {
      "blur": "blur(10px)",
      "gradient": "linear-gradient(135deg, #FFB7C5 0%, #FFC0CB 50%, #FFF5F7 100%)",
      "shadow": {
        "small": "0 1px 3px rgba(255, 105, 180, 0.1)",
        "medium": "0 4px 6px rgba(255, 105, 180, 0.15)",
        "large": "0 10px 15px rgba(255, 105, 180, 0.2)"
      }
    }
  }
}

## 额外要求
1. 提供配色方案的设计说明
2. 说明这个主题适合的使用场景
3. 建议搭配的字体（如果有特殊字体）
4. 如果有特殊效果（如渐变、图案背景），请说明

现在请生成主题配置。
```

---

## 四、数据库设计优化 AI Prompt

### Prompt 模板

```
你是一位资深的数据库架构师，精通 MongoDB 数据建模、索引优化、查询优化和分片策略。

现在需要你为"心晴日记"项目优化数据库设计。

## 当前数据模型
项目使用 MongoDB，主要集合包括：
1. users - 用户信息
2. diaries - 日记
3. albums - 图文集
4. themes - 主题配置
5. checkins - 签到记录
6. pointsRecords - 积分记录

详细字段定义参见 backend-architecture.md。

## 优化目标
[描述具体的优化目标，例如：]
1. 优化日记列表查询性能（按用户ID + 时间倒序）
2. 优化主题列表查询性能（按平台 + 状态）
3. 设计合理的索引策略
4. 优化热点数据的查询
5. 考虑数据增长后的分片策略

## 使用场景
1. 用户平均每天创建 2-3 条日记
2. 日记列表分页加载，每页 20 条
3. 主题切换频率较高
4. 图片上传每天约 100w 次
5. 预计 100w+ 用户量

## 任务要求
请提供：
1. 索引设计方案（包括单字段索引、复合索引、文本索引）
2. 查询优化建议（使用聚合管道、投影等）
3. 数据分片建议（如果需要）
4. 缓存策略建议
5. 数据归档策略（历史数据处理）
6. 读写分离方案

## 输出格式
请按照以下格式输出：

### 1. 索引设计
\`\`\`javascript
// diaries 集合
db.diaries.createIndex({ userId: 1, diaryDate: -1 });
db.diaries.createIndex({ userId: 1, status: 1 });
db.diaries.createIndex({ 'tags.name': 1 });
// ... 说明索引的用途

### 2. 查询优化
\`\`\`javascript
// 优化前
const diaries = await Diary.find({ userId: userId }).sort({ diaryDate: -1 });

// 优化后
const diaries = await Diary.find(
  { userId: userId, status: 'published' },
  { title: 1, content: 1, images: 1, diaryDate: 1 } // 只返回需要的字段
).sort({ diaryDate: -1 }).limit(20);
\`\`\`

### 3. 分片建议
- 分片键选择：userId（确保同一用户的数据在同一分片）
- 分片策略：Range-based sharding
- ...

### 4. 性能测试结果
- 优化前：xxx ms
- 优化后：xxx ms
- 提升：xx%

现在请开始优化。
```

---

## 五、图片处理与优化 AI Prompt

### Prompt 模板

```
你是一位资深的图片处理和性能优化工程师，精通图片压缩、格式转换、CDN 加速和小程序图片优化。

## 任务背景
"心晴日记"小程序需要处理大量用户上传的图片：
- 日记图片（平均每条日记 3-5 张）
- 图文集生成需要处理多张图片
- 不同尺寸的缩略图
- 需要考虑小程序的包大小限制

## 当前问题
1. 图片上传后体积较大，影响加载速度
2. 缩略图生成逻辑不完善
3. 图文集生成时图片处理耗时长
4. CDN 缓存策略需要优化

## 优化目标
[描述具体目标，例如：]
1. 设计图片上传和压缩的完整流程
2. 实现多尺寸缩略图生成
3. 优化图文集长图生成性能
4. 设计图片 CDN 缓存策略
5. 小程序端图片懒加载方案

## 技术要求
- 使用 Sharp 库处理图片（Node.js 后端）
- 使用腾讯云 COS 存储
- 支持 WebP 格式
- 支持渐进式 JPEG
- 实现图片水印功能

## 输出要求
请提供：
1. 图片上传处理流程代码
2. 缩略图生成代码
3. 图文集长图生成代码
4. CDN 配置建议
5. 小程序端图片加载优化代码
6. 性能对比数据

## 示例需求
用户上传一张 3000x4000、5MB 的图片：
- 原图：保存原始图片（可选压缩）
- 大图：1200x1600（用于详情页查看）
- 中图：800x1067（用于列表展示）
- 缩略图：300x400（用于快速预览）
- WebP 格式（如果浏览器支持）

现在请提供完整的图片处理方案。
```

---

## 六、性能优化 AI Prompt

### Prompt 模板

```
你是一位资深的前端性能优化工程师，精通微信小程序性能优化、首屏加载优化和用户体验优化。

## 项目情况
"心晴日记"小程序目前存在以下性能问题：
1. 首屏加载时间较长（3-4秒）
2. 主题切换时有明显卡顿
3. 长列表滚动不流畅
4. 图片加载影响页面性能
5. 包体积接近限制

## 优化目标
[描述具体目标，例如：]
1. 首屏加载时间降至 2 秒以内
2. 主题切换时间降至 500ms 以内
3. 列表滚动保持 60fps
4. 减小包体积 30%
5. 优化内存占用

## 优化方向
1. 代码分包
2. 图片懒加载
3. 虚拟列表
4. 预加载和预渲染
5. 主题资源缓存
6. 组件懒加载
7. 数据预取

## 输出要求
请提供：
1. 具体的优化方案和代码
2. 优化前后的性能对比数据
3. 监控和分析方法
4. 最佳实践建议

现在请提供性能优化方案。
```

---

## 七、安全性加固 AI Prompt

### Prompt 模板

```
你是一位资深的网络安全工程师，精通 Web 安全、API 安全和数据安全。

## 项目背景
"心晴日记"需要加强安全防护，包括：
1. 用户数据安全
2. API 接口安全
3. 文件上传安全
4. 防止恶意攻击

## 安全风险
1. 未授权访问
2. SQL/NoSQL 注入
3. XSS 攻击
4. CSRF 攻击
5. 文件上传漏洞
6. 敏感信息泄露
7. 暴力破解

## 加固要求
[描述具体要求，例如：]
1. 实现完整的认证授权机制
2. 输入验证和过滤
3. 文件上传安全检查
4. API 限流和防刷
5. 敏感数据加密
6. 日志审计

## 输出要求
请提供：
1. 安全加固方案
2. 相关代码实现
3. 安全检查清单
4. 应急响应预案

现在请提供安全加固方案。
```

---

## 八、完整功能开发 Prompt 示例

### 示例：开发图文集生成功能

```
你是一位全栈开发工程师，精通微信小程序开发和 Node.js 后端开发。

现在需要你为"心晴日记"开发完整的图文集生成功能。

## 功能需求
用户可以选择多条日记，合并生成一个精美的图文集，支持：
1. 按标签智能推荐日记
2. 选择图文集模板
3. 自定义图文集名称和封面
4. 实时预览效果
5. 生成长图并保存到相册
6. 导出 PDF（可选）
7. 预约打印服务（可选）

## 技术方案
- 前端：使用 Canvas API 绘制长图
- 后端：使用 Puppeteer 生成 PDF
- 模板：预设 4 种布局模板
- 样式：继承用户当前主题风格

## 开发任务
请分别提供前端和后端的完整代码：

### 前端（微信小程序）
1. 图文集创建页面（选择日记、选择模板）
2. 图文集预览页面（Canvas 绘制预览）
3. 图文集生成组件（Canvas 生成长图）
4. 相关 API 调用封装

### 后端（Node.js）
1. 创建图文集 API
2. 获取图文集详情 API
3. 导出 PDF API
4. 图文集列表 API

## 模板设计
提供 4 种布局模板的 Canvas 绘制逻辑：
1. 经典简约（网格布局）
2. 杂志风格（瀑布流）
3. 时间线（垂直时间轴）
4. 极简主义（单列大图）

## 性能要求
1. 长图生成时间 < 5秒
2. 支持分页渲染（避免一次性绘制过多内容）
3. 内存占用控制

## 用户体验
1. 生成过程显示进度
2. 失败时有友好提示
3. 支持重新生成
4. 保存后自动分享

请提供完整的实现代码，包括前端页面、组件、后端接口和数据模型。
```

---

## 使用说明

1. **选择合适的 Prompt**：根据开发任务选择对应的 Prompt 模板
2. **填充具体需求**：在 [在这里描述...] 部分填入具体的开发需求
3. **提供上下文**：如果有相关的代码或文档，一并提供给 AI
4. **迭代优化**：根据 AI 的输出，继续追问和优化
5. **代码审查**：AI 生成的代码需要人工审查和测试

## 注意事项

- AI 生成的代码仅供参考，需要根据实际情况调整
- 涉及安全性的代码要特别谨慎
- 数据库操作要考虑性能和安全
- 前端代码要测试兼容性
- API 接口要做好错误处理和参数验证
