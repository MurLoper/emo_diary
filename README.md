# 心晴日记 - 完整项目

## 📱 项目简介

**心晴日记 (Emotions Diary)** 是一个跨平台的心情日记应用，支持微信小程序、Android、iOS、鸿蒙和Web多个平台。

**核心特色**：动态主题系统 - 用户可以实时切换不同的视觉风格，全局渲染，提供优质的视觉体验。

## 🎯 核心功能

- ✅ 日记创建、编辑、删除
- ✅ 图片上传和管理（最多9张）
- ✅ 图片拖拽排序
- ✅ 多标签分类系统
- ✅ 图文集生成与导出
- ✅ **动态主题切换系统**（核心特色⭐）
- ✅ 签到与积分体系
- ✅ 主题商店（免费/签到/积分/付费）
- ⏳ AI 文字润色
- ⏳ AI 图文排版优化

## 🏗️ 技术架构

### 前端（微信小程序）
- 微信小程序原生框架
- JavaScript ES6+
- 动态主题系统（核心）

### 后端
- Node.js 18+
- Express 4.x
- MongoDB 6.0
- Redis 7.x
- JWT 认证

### 数据库
- MongoDB（主数据库）
- Redis（缓存）

## 📁 项目结构

```
emo_diary/
├── backend/                 # 后端服务
│   ├── src/
│   │   ├── config/         # 配置
│   │   ├── models/         # 数据模型
│   │   ├── controllers/    # 控制器
│   │   ├── routes/         # 路由
│   │   ├── middlewares/    # 中间件
│   │   ├── services/       # 业务逻辑
│   │   └── utils/          # 工具类
│   ├── scripts/            # 脚本
│   ├── theme-resources/    # 主题资源
│   └── package.json
├── miniprogram/            # 微信小程序
│   ├── pages/              # 页面
│   ├── components/         # 组件
│   ├── utils/              # 工具类
│   ├── app.js
│   └── app.json
└── docs/                   # 文档
    ├── project-overview.md
    ├── backend-architecture.md
    ├── wechat-miniprogram-development.md
    └── ai-development-prompt.md
```

## 🚀 快速开始

### 后端启动

```bash
cd backend

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

1. 使用微信开发者工具打开 `miniprogram` 目录
2. 填入 AppID
3. 修改 `utils/api.js` 中的后端地址
4. 编译运行

### Docker 部署

```bash
cd backend
docker-compose up -d
```

## 🎨 主题系统（核心特色）

### 特性
- 12+ 预设主题
- 实时切换，全局生效
- 主题资源 CDN 加速
- 本地缓存机制
- 版本更新检测
- 多平台适配

### 主题列表
1. 粉色少女（默认）
2. 绿意盎然
3. 暗夜星辰
4. 克莱因蓝
5. 金色余晖
6. 鹅黄秋香
7. 月白清辉
8. 银红霞光
9. 更多主题...

## 📊 数据模型

- **User** - 用户信息
- **Diary** - 日记
- **Album** - 图文集
- **Theme** - 主题配置⭐
- **CheckIn** - 签到记录
- **PointsRecord** - 积分记录
- **Tag** - 标签

## 🔌 API 接口

详见 [backend-architecture.md](docs/backend-architecture.md)

主要接口：
- `/api/auth/*` - 认证
- `/api/themes/*` - 主题管理⭐
- `/api/user/*` - 用户
- `/api/checkin/*` - 签到
- `/api/diaries/*` - 日记（待开发）
- `/api/albums/*` - 图文集（待开发）

## 📖 文档

- [项目总览](docs/project-overview.md)
- [后端架构](docs/backend-architecture.md)
- [小程序开发文档](docs/wechat-miniprogram-development.md)
- [AI 开发 Prompt](docs/ai-development-prompt.md)

## 🎯 开发进度

### 已完成 ✅
- [x] 后端项目初始化
- [x] 数据模型设计
- [x] 主题系统（核心）
- [x] 用户认证
- [x] 签到与积分系统
- [x] 小程序项目初始化
- [x] 主题管理器
- [x] API 封装

### 进行中 ⏳
- [ ] 日记 CRUD 接口
- [ ] 图文集生成
- [ ] 图片上传组件
- [ ] 更多页面开发

### 计划中 📝
- [ ] AI 文字润色
- [ ] 图文集导出 PDF
- [ ] 打印服务对接
- [ ] Android/iOS App

## 💡 技术亮点

1. **动态主题系统** - 业界领先的主题切换方案，支持多平台、版本控制、热更新
2. **完善的积分体系** - 签到、日记、图文集等多种积分获取方式
3. **模块化架构** - 清晰的目录结构，易于维护和扩展
4. **性能优化** - Redis 缓存、CDN 加速、懒加载等
5. **安全性** - JWT 认证、限流、参数验证等

## 📝 许可证

MIT

## 👥 贡献指南

欢迎提交 Issue 和 Pull Request！

## 📧 联系方式

- GitHub Issues: 提交问题和建议
- 技术文档: 查看 docs 目录
