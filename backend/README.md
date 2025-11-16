# 心晴日记后端服务

## 项目简介

心晴日记后端服务，使用 Node.js + Express + MongoDB + Redis 技术栈构建。

核心特色：**动态主题系统** - 支持多平台、多主题、版本控制和热更新。

## 技术栈

- Node.js 18+
- Express 4.x
- MongoDB 6.0
- Redis 7.x
- JWT 认证
- 腾讯云 COS (文件存储)

## 快速开始

### 1. 环境准备

确保已安装：
- Node.js >= 18.0.0
- MongoDB >= 6.0
- Redis >= 7.0

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件，填写必要的配置：
- MongoDB 连接地址
- Redis 配置
- 微信小程序 AppID 和 Secret
- JWT Secret
- 腾讯云 COS 配置

### 4. 初始化主题数据

```bash
npm run seed:themes
```

### 5. 启动服务

开发环境：
```bash
npm run dev
```

生产环境：
```bash
npm start
```

## Docker 部署

使用 Docker Compose 一键部署：

```bash
docker-compose up -d
```

## API 文档

### 认证接口

- `POST /api/auth/wechat/login` - 微信登录
- `POST /api/auth/refresh` - 刷新Token

### 主题接口

- `GET /api/themes` - 获取主题列表
- `GET /api/themes/:themeId` - 获取主题详情
- `POST /api/themes/:themeId/unlock` - 解锁主题
- `POST /api/themes/:themeId/apply` - 应用主题
- `GET /api/themes/:themeId/check-update` - 检查主题更新

### 用户接口

- `GET /api/user/profile` - 获取用户信息
- `PUT /api/user/profile` - 更新用户信息
- `GET /api/user/stats` - 获取用户统计
- `PUT /api/user/settings` - 更新用户设置

### 签到接口

- `POST /api/checkin` - 签到
- `GET /api/checkin/calendar` - 获取签到日历
- `GET /api/checkin/status` - 获取签到状态

## 项目结构

```
backend/
├── src/
│   ├── config/          # 配置文件
│   ├── models/          # 数据模型
│   ├── controllers/     # 控制器
│   ├── routes/          # 路由
│   ├── middlewares/     # 中间件
│   ├── services/        # 业务逻辑
│   ├── utils/           # 工具类
│   └── app.js           # 应用入口
├── scripts/             # 脚本
├── theme-resources/     # 主题资源文件
├── tests/               # 测试
├── .env.example         # 环境变量示例
├── package.json
└── README.md
```

## 核心特性

### 1. 动态主题系统

支持多平台（微信、Android、iOS、鸿蒙、Web）的主题切换，包括：
- 主题配置管理
- 版本控制
- 缓存机制
- 热更新
- 多种解锁方式（免费、积分、签到、付费）

### 2. 积分体系

完善的积分获取和消费机制：
- 签到奖励
- 日记创建奖励
- 连续签到额外奖励
- 积分消费（主题解锁、AI润色等）

### 3. 签到系统

- 每日签到
- 连续签到奖励
- 签到日历
- 主题解锁激励

## 开发规范

### Git 提交规范

```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式
refactor: 重构
test: 测试
chore: 构建/工具
```

### 代码规范

- 使用 ESLint
- 遵循 JavaScript Standard Style
- 详细的代码注释

## 测试

```bash
npm test
```

## 许可证

MIT

## 联系方式

- 技术文档：查看 docs 目录
- 问题反馈：提交 Issue
