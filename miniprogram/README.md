# 心晴日记 - 微信小程序

## 项目简介

心晴日记微信小程序，一个支持动态主题切换的心情日记应用。

核心特色：**动态主题系统** - 用户可以实时切换不同的视觉风格，所有页面和组件都会实时渲染。

## 功能特性

### 核心功能
- ✅ 日记 CRUD（创建、查看、编辑、删除）
- ✅ 图片上传和管理（最多9张）
- ✅ 多标签分类系统
- ✅ 图文集生成
- ✅ **动态主题切换**（核心特色⭐）
- ✅ 签到与积分系统
- ✅ AI 文字润色（规划中）

### 主题系统
- 12+ 免费主题
- 实时主题切换
- 主题资源缓存
- 版本更新检测
- 多种解锁方式（免费、签到、积分、付费）

## 技术栈

- 微信小程序原生框架
- JavaScript ES6+
- WXML + WXSS

## 项目结构

```
miniprogram/
├── pages/              # 页面
│   ├── index/         # 首页
│   ├── diary/         # 日记相关
│   ├── album/         # 图文集
│   ├── theme/         # 主题商店
│   ├── user/          # 用户中心
│   └── checkin/       # 签到
├── components/         # 组件
│   ├── theme-wrapper/
│   ├── diary-card/
│   └── image-uploader/
├── utils/             # 工具类
│   ├── api.js        # API封装
│   ├── theme-manager.js  # 主题管理器⭐
│   └── canvas-utils.js
├── app.js             # 小程序入口
├── app.json           # 全局配置
└── app.wxss           # 全局样式
```

## 快速开始

### 1. 环境准备

- 安装微信开发者工具
- 注册小程序账号，获取 AppID

### 2. 配置

1. 打开微信开发者工具
2. 导入项目，选择 `miniprogram` 目录
3. 填入 AppID

### 3. 修改配置

编辑 `utils/api.js`，修改后端API地址：

```javascript
const API_BASE_URL = 'https://your-backend-api.com/api';
```

### 4. 运行

在微信开发者工具中点击"编译"即可运行。

## 主题系统使用

### 页面中使用主题

```javascript
// 在页面 JS 中
Page({
  data: {
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
      cssVars: app.globalData.cssVars
    });
  }
});
```

```xml
<!-- 在 WXML 中 -->
<view class="card" style="
  background: {{cssVars['--theme-surface']}};
  border-radius: {{cssVars['--card-radius']}};
  box-shadow: {{cssVars['--card-shadow']}};
">
  <button style="
    background: {{cssVars['--theme-primary']}};
    border-radius: {{cssVars['--button-radius']}};
  ">确认</button>
</view>
```

## 开发规范

### 代码风格
- 组件命名：kebab-case
- 变量命名：camelCase
- 常量命名：UPPER_SNAKE_CASE

### Git 提交规范
```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式
refactor: 重构
```

## API 接口

详见后端文档 [backend-architecture.md](../docs/backend-architecture.md)

## 许可证

MIT

## 联系方式

- 文档：查看 docs 目录
- 问题反馈：提交 Issue
