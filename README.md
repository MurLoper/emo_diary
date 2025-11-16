# 心晴日记 - 微信小程序完整项目

> 一款关于记录心晴的日记应用

## 📱 项目简介

**心晴日记 (Emotions Diary)** 是一个基于微信小程序的心情日记应用，支持多端适配。

**核心特色**：
- 🎨 **18个完整主题**：动态主题系统，实时切换，全局渲染
- 📔 **完整日记功能**：创建、编辑、图文混排、标签分类
- 🖼️ **图文集生成**：6种精美模板，一键生成图文合集
- 🎁 **积分体系**：签到打卡、主题解锁、充值系统

## 🎯 核心功能

- ✅ 日记创建、编辑、删除
- ✅ 图片上传和管理（最多9张）
- ✅ 多标签分类系统
- ✅ 图文集生成（6种模板）
- ✅ **动态主题切换系统**（18个主题）
- ✅ 签到与积分体系
- ✅ 主题商店（8免费 + 3签到 + 4积分 + 3付费）
- ✅ 充值系统（6种套餐）
- ⏳ AI 文字润色
- ⏳ 图文集导出

## 🏗️ 技术架构

### 前端（微信小程序）
- 微信小程序原生框架
- JavaScript ES6+
- 动态主题系统（本地优先）
- 图标系统（支持本地/CDN）

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
│   └── package.json
├── miniprogram/            # 微信小程序
│   ├── pages/              # 9个核心页面
│   ├── utils/              # 工具类
│   │   ├── theme-config.js      # 18个主题配置
│   │   ├── theme-manager.js     # 主题管理器
│   │   ├── iconConfig.js        # 图标配置
│   │   └── api.js              # API封装
│   ├── assets/icons/       # 图标资源
│   ├── app.js
│   └── app.json
├── scripts/                # 工具脚本
│   ├── generateIconsForServer.js  # 图标生成
│   └── ...
├── 小程序页面设计/          # 原始设计稿
└── docs/                   # 文档
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
2. 填入 AppID（或使用测试号）
3. 修改 `utils/api.js` 中的后端地址
4. 编译运行

### Docker 部署

```bash
cd backend
docker-compose up -d
```

## 🎨 主题系统（核心特色）

### 18个完整主题

#### 免费主题（8个）
1. 粉色少女 - `pink-girl`
2. 绿意盎然 - `green-fresh`
3. 暗夜星辰 - `dark-mode`
4. 薰衣草梦境 - `lavender-dream`
5. 珊瑚海滩 - `coral-beach`
6. 薄荷清新 - `mint-fresh`
7. 天空之蓝 - `sky-blue`
8. 桃花粉嫩 - `peach-blossom`

#### 签到解锁（3个）
- 樱花季节（7天）
- 秋日枫叶（15天）
- 冬日雪境（30天）

#### 积分解锁（4个）
- 璀璨星空（300积分）
- 金色余晖（300积分）
- 克莱因蓝（300积分）
- 玫瑰金（500积分）

#### 付费主题（3个）
- 极光幻境（99心晴币）
- 银河星系（129心晴币）

### 主题特性
- ✅ 本地优先加载（无需联网）
- ✅ 实时切换，所有页面自动响应
- ✅ CSS变量动态生成
- ✅ 持久化存储
- ✅ 可选服务器同步

## 📱 页面列表

1. **首页** - 快捷入口、最近日记
2. **日记列表** - 筛选、排序、搜索
3. **创建日记** - 文字、图片、标签、AI润色
4. **图文集列表** - 6种模板预览
5. **创建图文集** - 选择日记、选择模板
6. **主题商店** - 18个主题浏览、解锁、切换
7. **签到** - 日历签到、连续签到奖励
8. **充值** - 6种套餐、微信支付
9. **我的** - 个人信息、积分、设置

## 📊 数据模型

- **User** - 用户信息、积分、金币
- **Diary** - 日记内容、图片、标签
- **Album** - 图文集
- **Theme** - 主题配置
- **CheckIn** - 签到记录
- **PointsRecord** - 积分记录
- **RechargeOrder** - 充值订单
- **Tag** - 标签

## 🔌 API 接口

详见 [backend-architecture.md](docs/backend-architecture.md)

### 主要接口
- `/api/auth/*` - 微信登录认证
- `/api/themes/*` - 主题管理
- `/api/themes/:id/apply` - 应用主题
- `/api/themes/:id/unlock` - 解锁主题
- `/api/user/*` - 用户信息
- `/api/checkin/*` - 签到
- `/api/diaries/*` - 日记CRUD
- `/api/albums/*` - 图文集
- `/api/recharge/*` - 充值

## 📖 文档

- [功能完成清单](功能完成清单.md) - 详细功能列表
- [主题系统完成报告](主题系统完成报告.md) - 主题系统说明
- [CDN部署指南](CDN_DEPLOYMENT.md) - 图标CDN部署
- [项目总览](docs/project-overview.md)
- [后端架构](docs/backend-architecture.md)
- [小程序开发文档](docs/wechat-miniprogram-development.md)

## 🎯 开发进度

### 已完成 ✅
- [x] 后端完整架构
- [x] 18个主题配置和系统
- [x] 9个核心页面
- [x] 用户认证（微信登录）
- [x] 签到与积分系统
- [x] 主题商店（解锁/切换）
- [x] 充值系统
- [x] 图文集模板
- [x] 动态主题渲染
- [x] 图标系统

### 计划中 📝
- [ ] AI 文字润色
- [ ] 图文集导出 PDF
- [ ] 打印服务对接
- [ ] 更多图标生成

## 💡 技术亮点

1. **动态主题系统**
   - 18个完整主题配置
   - 本地优先，无需联网
   - CSS变量动态生成
   - 所有页面自动响应主题切换

2. **完善的积分体系**
   - 签到奖励（连续7/30/88/100天额外奖励）
   - 主题解锁（签到/积分/付费）
   - 充值系统（6种套餐）

3. **模块化架构**
   - 清晰的目录结构
   - 工具类封装（theme-manager, iconConfig, api）
   - 组件复用

4. **性能优化**
   - 本地主题缓存
   - 图标CDN支持
   - Redis缓存
   - 懒加载

5. **安全性**
   - JWT 认证
   - 限流保护
   - 参数验证

## 📝 .gitignore 说明

项目已配置 `.gitignore`，以下文件/目录不会提交到 Git：

- `node_modules/` - 依赖包
- `.env` - 环境变量（敏感信息）
- `project.private.config.json` - 微信小程序私有配置
- `scripts/downloads/` - 临时下载的图标
- `scripts/server-icons/` - 生成的图标（需上传CDN）
- `*.log`, `*.zip` 等临时文件

**CDN 资源部署**：`scripts/server-icons/colors/` 目录中的图标文件需要单独上传到 CDN 服务器，详见 [CDN_DEPLOYMENT.md](CDN_DEPLOYMENT.md)

## 📝 许可证

MIT

## 👥 贡献指南

欢迎提交 Issue 和 Pull Request！

## 📧 联系方式

- GitHub Issues: [https://github.com/MurLoper/emo_diary/issues](https://github.com/MurLoper/emo_diary/issues)
- 技术文档: 查看 docs 目录
