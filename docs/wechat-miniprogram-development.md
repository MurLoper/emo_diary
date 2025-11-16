# 心晴日记 - 微信小程序开发文档

## 项目概述

**项目名称**：心晴日记 (Emotions Diary)  
**项目类型**：微信小程序  
**技术栈**：微信小程序原生框架 / 或 uni-app  
**后端**：Node.js + Express  
**数据库**：MongoDB  
**版本**：1.0.0

---

## 一、功能需求

### 1.1 核心功能模块

#### 1.1.1 日记功能
- **创建日记**
  - 支持上传多张图片（最多9张）
  - 图片拖拽排序功能
  - 富文本编辑器编写日记内容
  - AI 文字润色功能（调用 AI API）
  - AI 图文排版优化建议
  - 添加多个标签分类
  - 设置日期时间
  - 保存草稿功能

- **日记标签系统**
  ```javascript
  // 预设标签分类
  const tagCategories = {
    mood: ['开心', '快乐', '幸福', '满足', 'emo', '低落', '焦虑', '平静', '激动', '感动'],
    activity: ['日常', '美食', '旅行', '运动', '学习', '工作', '阅读', '看剧', '购物'],
    social: ['好友', '家人', '恋人', '独处', '聚会', '约会'],
    special: ['纪念日', '节日', '生日', '第一次', '告别', '重逢'],
    weather: ['晴天', '雨天', '阴天', '雪天', '多云'],
    custom: [] // 用户自定义标签
  };
  ```

- **日记列表**
  - 时间轴展示
  - 卡片式列表
  - 按标签筛选
  - 按时间筛选
  - 搜索功能
  - 下拉刷新、上拉加载

- **日记详情**
  - 查看完整内容
  - 图片预览（支持滑动）
  - 编辑功能
  - 删除功能
  - 分享功能

#### 1.1.2 图文集功能
- **创建图文集**
  - 选择多条日记（按标签智能推荐）
  - 自定义图文集名称和封面
  - 选择图文集风格模板
  - AI 智能排版优化
  - 预览效果

- **图文集模板**
  ```javascript
  const albumTemplates = {
    classic: {
      name: '经典简约',
      layout: 'grid',
      imageRatio: '1:1',
      textPosition: 'bottom'
    },
    magazine: {
      name: '杂志风格',
      layout: 'masonry',
      imageRatio: 'auto',
      textPosition: 'overlay'
    },
    timeline: {
      name: '时间线',
      layout: 'vertical',
      imageRatio: '16:9',
      textPosition: 'right'
    },
    minimal: {
      name: '极简主义',
      layout: 'single',
      imageRatio: '3:4',
      textPosition: 'separate'
    }
  };
  ```

- **导出功能**
  - 生成长图（Canvas 绘制）
  - 保存到相册
  - 分享到微信
  - 导出 PDF（后端生成）
  - 打印预约服务

#### 1.1.3 首页 Banner
- 展示系统精选图文集
- 轮播展示
- 点击查看详情
- 支持后台动态配置

#### 1.1.4 新手引导
- 首次启动引导动画
- 功能操作提示
- 分步引导流程：
  1. 如何创建日记
  2. 如何添加标签
  3. 如何创建图文集
  4. 如何切换主题

---

### 1.2 主题系统（核心特性）

#### 1.2.1 主题架构设计

```javascript
// 主题数据结构
interface Theme {
  id: string;                    // 主题唯一ID
  name: string;                  // 主题名称
  description: string;           // 主题描述
  preview: string;               // 预览图URL
  type: 'free' | 'signin' | 'points' | 'premium'; // 获取方式
  price?: number;                // 价格（积分或人民币）
  signinDays?: number;           // 需要签到天数
  version: string;               // 版本号
  
  // CSS 配置
  cssConfig: {
    // 颜色变量
    colors: {
      primary: string;           // 主色
      secondary: string;         // 辅助色
      accent: string;            // 强调色
      background: string;        // 背景色
      surface: string;           // 表面色
      text: {
        primary: string;
        secondary: string;
        disabled: string;
      };
      border: string;
      shadow: string;
    };
    
    // 组件样式
    components: {
      card: {
        borderRadius: string;
        padding: string;
        shadow: string;
        background: string;
      };
      button: {
        borderRadius: string;
        padding: string;
        fontSize: string;
        fontWeight: string;
      };
      input: {
        borderRadius: string;
        borderWidth: string;
        padding: string;
      };
      list: {
        itemHeight: string;
        dividerColor: string;
        padding: string;
      };
      navbar: {
        background: string;
        color: string;
        height: string;
      };
      tabbar: {
        background: string;
        color: string;
        activeColor: string;
      };
    };
    
    // 特效
    effects: {
      blur: string;              // 毛玻璃效果
      gradient?: string;         // 渐变色
      animation?: string;        // 动画效果
    };
  };
  
  // 资源路径
  resources: {
    cssUrl: string;              // CSS 文件 CDN 地址
    backgroundImages?: string[]; // 背景图片
    decorationImages?: string[]; // 装饰元素
  };
  
  // 适配平台
  platforms: ['wechat', 'android', 'ios', 'harmony', 'web'];
  
  createdAt: Date;
  updatedAt: Date;
}
```

#### 1.2.2 预设主题列表

```javascript
const presetThemes = [
  // 1. 粉色少女
  {
    id: 'pink-girl',
    name: '粉色少女',
    type: 'free',
    colors: {
      primary: '#FFB6C1',
      secondary: '#FFC0CB',
      accent: '#FF69B4',
      background: 'linear-gradient(135deg, #FFF5F7 0%, #FFE5EC 100%)',
      surface: '#FFFFFF',
      text: { primary: '#2D1B2E', secondary: '#9D6B84', disabled: '#D4A5B8' }
    }
  },
  
  // 2. 绿色清新
  {
    id: 'green-fresh',
    name: '绿意盎然',
    type: 'free',
    colors: {
      primary: '#4CAF50',
      secondary: '#8BC34A',
      accent: '#81C784',
      background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
      surface: '#FFFFFF',
      text: { primary: '#1B5E20', secondary: '#558B2F', disabled: '#A5D6A7' }
    }
  },
  
  // 3. 暗黑模式
  {
    id: 'dark-mode',
    name: '暗夜星辰',
    type: 'free',
    colors: {
      primary: '#BB86FC',
      secondary: '#03DAC6',
      accent: '#CF6679',
      background: '#121212',
      surface: '#1E1E1E',
      text: { primary: '#FFFFFF', secondary: '#B3B3B3', disabled: '#666666' }
    }
  },
  
  // 4. 璀璨星空
  {
    id: 'starry-sky',
    name: '璀璨星空',
    type: 'free',
    colors: {
      primary: '#4A90E2',
      secondary: '#7B68EE',
      accent: '#00BFFF',
      background: 'url(starry-bg.jpg)',
      surface: 'rgba(255, 255, 255, 0.9)',
      text: { primary: '#1A237E', secondary: '#5C6BC0', disabled: '#9FA8DA' }
    }
  },
  
  // 5. 金色余晖
  {
    id: 'golden-sunset',
    name: '金色余晖',
    type: 'free',
    colors: {
      primary: '#FFB74D',
      secondary: '#FFA726',
      accent: '#FF9800',
      background: 'linear-gradient(135deg, #FFF8E1 0%, #FFE0B2 100%)',
      surface: '#FFFFFF',
      text: { primary: '#E65100', secondary: '#F57C00', disabled: '#FFCC80' }
    }
  },
  
  // 6. 克莱因蓝
  {
    id: 'klein-blue',
    name: '克莱因蓝',
    type: 'free',
    colors: {
      primary: '#002FA7',
      secondary: '#0047AB',
      accent: '#4169E1',
      background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
      surface: '#FFFFFF',
      text: { primary: '#01579B', secondary: '#0277BD', disabled: '#81D4FA' }
    }
  },
  
  // 7-12: 中国传统色系
  {
    id: 'goose-yellow',
    name: '鹅黄秋香',
    type: 'free',
    colors: {
      primary: '#FFF143',
      secondary: '#F0C239',
      accent: '#E6B422',
      background: 'linear-gradient(135deg, #FFFBEA 0%, #FFF8DC 100%)'
    }
  },
  {
    id: 'moon-white',
    name: '月白清辉',
    type: 'free',
    colors: {
      primary: '#D6ECF0',
      secondary: '#BACCD9',
      accent: '#A4BED4',
      background: 'linear-gradient(135deg, #F5F9FA 0%, #E8F4F8 100%)'
    }
  },
  {
    id: 'silver-red',
    name: '银红霞光',
    type: 'free',
    colors: {
      primary: '#F05654',
      secondary: '#F07C82',
      accent: '#F03752',
      background: 'linear-gradient(135deg, #FFF5F5 0%, #FFE5E5 100%)'
    }
  },
  {
    id: 'emerald-wave',
    name: '翠涛碧浪',
    type: 'free',
    colors: {
      primary: '#3DE1AD',
      secondary: '#1BD1A5',
      accent: '#00C9A7',
      background: 'linear-gradient(135deg, #E0F9F4 0%, #C2F5E9 100%)'
    }
  },
  {
    id: 'purple-mist',
    name: '紫霞仙境',
    type: 'free',
    colors: {
      primary: '#8B7FA4',
      secondary: '#A593C4',
      accent: '#9B89C3',
      background: 'linear-gradient(135deg, #F3F0F8 0%, #E8E3F0 100%)'
    }
  },
  {
    id: 'ink-bamboo',
    name: '墨竹清风',
    type: 'free',
    colors: {
      primary: '#1C1F1A',
      secondary: '#50575A',
      accent: '#758A8A',
      background: 'linear-gradient(135deg, #F5F6F5 0%, #E8EBE8 100%)'
    }
  }
];
```

#### 1.2.3 主题切换实现方案

**方案一：动态 CSS 注入（推荐）**

```javascript
// theme-manager.js - 主题管理器

class ThemeManager {
  constructor() {
    this.currentTheme = null;
    this.cache = new Map(); // 本地缓存
    this.storageKey = 'theme_cache';
  }
  
  /**
   * 初始化主题系统
   */
  async init() {
    // 1. 从本地存储获取用户选择的主题ID
    const savedThemeId = wx.getStorageSync('selected_theme_id') || 'pink-girl';
    
    // 2. 加载主题
    await this.loadTheme(savedThemeId);
  }
  
  /**
   * 加载主题
   * @param {string} themeId - 主题ID
   */
  async loadTheme(themeId) {
    try {
      wx.showLoading({ title: '正在切换主题...' });
      
      // 1. 检查缓存
      const cachedTheme = this.getFromCache(themeId);
      if (cachedTheme && !cachedTheme.needUpdate) {
        this.applyTheme(cachedTheme);
        wx.hideLoading();
        return;
      }
      
      // 2. 从服务器获取主题配置
      const theme = await this.fetchTheme(themeId);
      
      // 3. 下载并缓存 CSS 资源
      if (theme.resources.cssUrl) {
        const cssContent = await this.downloadCSS(theme.resources.cssUrl);
        theme.cssContent = cssContent;
      }
      
      // 4. 下载并缓存背景图片
      if (theme.resources.backgroundImages) {
        theme.cachedBackgrounds = await this.downloadImages(
          theme.resources.backgroundImages
        );
      }
      
      // 5. 保存到缓存
      this.saveToCache(themeId, theme);
      
      // 6. 应用主题
      this.applyTheme(theme);
      
      // 7. 保存用户选择
      wx.setStorageSync('selected_theme_id', themeId);
      
      wx.hideLoading();
      wx.showToast({ title: '主题已切换', icon: 'success' });
      
    } catch (error) {
      console.error('加载主题失败:', error);
      wx.hideLoading();
      wx.showToast({ title: '主题加载失败', icon: 'none' });
    }
  }
  
  /**
   * 从服务器获取主题配置
   */
  async fetchTheme(themeId) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${API_BASE_URL}/api/themes/${themeId}`,
        method: 'GET',
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(res.data.data);
          } else {
            reject(new Error('主题不存在'));
          }
        },
        fail: reject
      });
    });
  }
  
  /**
   * 下载 CSS 文件
   */
  async downloadCSS(cssUrl) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: cssUrl,
        method: 'GET',
        success: (res) => {
          resolve(res.data);
        },
        fail: reject
      });
    });
  }
  
  /**
   * 下载图片到本地
   */
  async downloadImages(imageUrls) {
    const downloads = imageUrls.map(url => {
      return new Promise((resolve) => {
        wx.downloadFile({
          url: url,
          success: (res) => {
            if (res.statusCode === 200) {
              // 保存到本地
              const savedPath = wx.saveFileSync(res.tempFilePath);
              resolve(savedPath);
            } else {
              resolve(url); // 降级使用网络图片
            }
          },
          fail: () => resolve(url)
        });
      });
    });
    
    return Promise.all(downloads);
  }
  
  /**
   * 应用主题
   */
  applyTheme(theme) {
    this.currentTheme = theme;
    
    // 1. 生成 CSS 变量
    const cssVars = this.generateCSSVariables(theme.cssConfig);
    
    // 2. 注入到页面（使用小程序的 setData 或全局样式）
    const app = getApp();
    app.globalData.theme = theme;
    app.globalData.cssVars = cssVars;
    
    // 3. 通知所有页面更新
    this.notifyPagesUpdate();
    
    // 4. 如果有自定义 CSS，创建样式标签（webview 中）
    if (theme.cssContent) {
      this.injectCustomCSS(theme.cssContent);
    }
  }
  
  /**
   * 生成 CSS 变量
   */
  generateCSSVariables(cssConfig) {
    const vars = {};
    
    // 颜色变量
    vars['--theme-primary'] = cssConfig.colors.primary;
    vars['--theme-secondary'] = cssConfig.colors.secondary;
    vars['--theme-accent'] = cssConfig.colors.accent;
    vars['--theme-background'] = cssConfig.colors.background;
    vars['--theme-surface'] = cssConfig.colors.surface;
    vars['--theme-text-primary'] = cssConfig.colors.text.primary;
    vars['--theme-text-secondary'] = cssConfig.colors.text.secondary;
    vars['--theme-border'] = cssConfig.colors.border;
    
    // 组件变量
    vars['--card-radius'] = cssConfig.components.card.borderRadius;
    vars['--card-padding'] = cssConfig.components.card.padding;
    vars['--card-shadow'] = cssConfig.components.card.shadow;
    vars['--button-radius'] = cssConfig.components.button.borderRadius;
    
    // ... 更多变量
    
    return vars;
  }
  
  /**
   * 通知所有页面更新
   */
  notifyPagesUpdate() {
    const pages = getCurrentPages();
    pages.forEach(page => {
      if (page.onThemeChange && typeof page.onThemeChange === 'function') {
        page.onThemeChange(this.currentTheme);
      }
    });
  }
  
  /**
   * 从缓存获取主题
   */
  getFromCache(themeId) {
    try {
      const cache = wx.getStorageSync(this.storageKey) || {};
      return cache[themeId];
    } catch (error) {
      return null;
    }
  }
  
  /**
   * 保存到缓存
   */
  saveToCache(themeId, theme) {
    try {
      const cache = wx.getStorageSync(this.storageKey) || {};
      cache[themeId] = {
        ...theme,
        cachedAt: Date.now()
      };
      wx.setStorageSync(this.storageKey, cache);
    } catch (error) {
      console.error('缓存保存失败:', error);
    }
  }
  
  /**
   * 检查主题更新
   */
  async checkUpdate(themeId) {
    try {
      const response = await this.fetchTheme(themeId);
      const cached = this.getFromCache(themeId);
      
      if (!cached) return true;
      
      return response.version !== cached.version;
    } catch (error) {
      return false;
    }
  }
  
  /**
   * 清理缓存
   */
  clearCache() {
    wx.removeStorageSync(this.storageKey);
    this.cache.clear();
  }
}

// 导出单例
export default new ThemeManager();
```

#### 1.2.4 页面使用主题

```javascript
// pages/diary/diary.js

import themeManager from '../../utils/theme-manager';

Page({
  data: {
    theme: {},
    cssVars: {}
  },
  
  onLoad() {
    this.applyTheme();
  },
  
  onShow() {
    this.applyTheme();
  },
  
  // 主题切换回调
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
```

```xml
<!-- pages/diary/diary.wxml -->
<view class="container" style="background: {{cssVars['--theme-background']}}">
  <view class="diary-card" 
        style="
          background: {{cssVars['--theme-surface']}};
          border-radius: {{cssVars['--card-radius']}};
          padding: {{cssVars['--card-padding']}};
          box-shadow: {{cssVars['--card-shadow']}};
        ">
    <text style="color: {{cssVars['--theme-text-primary']}}">日记标题</text>
  </view>
  
  <button class="theme-button"
          style="
            background: {{cssVars['--theme-primary']}};
            border-radius: {{cssVars['--button-radius']}};
          ">
    保存日记
  </button>
</view>
```

---

### 1.3 签到与积分系统

#### 1.3.1 签到功能

```javascript
// 签到数据结构
interface CheckIn {
  userId: string;
  date: string;              // YYYY-MM-DD
  continuous: number;        // 连续签到天数
  total: number;            // 累计签到天数
  reward: {
    points: number;         // 获得积分
    items?: string[];       // 获得道具（如主题）
  };
  timestamp: Date;
}

// 签到规则
const checkInRules = {
  dailyPoints: 10,          // 每日基础积分
  continuousBonus: {
    7: 20,                  // 连续7天额外奖励
    30: 100,                // 连续30天额外奖励
    100: 500                // 连续100天额外奖励
  },
  themeUnlock: {
    'spring-festival': 7,   // 春节主题需连续签到7天
    'mid-autumn': 15,       // 中秋主题需连续签到15天
    'anniversary': 100      // 周年主题需连续签到100天
  }
};
```

#### 1.3.2 积分系统

```javascript
// 积分获取方式
const pointsRules = {
  checkIn: 10,              // 每日签到
  createDiary: 5,           // 创建日记
  createAlbum: 20,          // 创建图文集
  shareDiary: 10,           // 分享日记
  inviteFriend: 100,        // 邀请好友
  completeTutorial: 50      // 完成新手教程
};

// 积分消费
const pointsCost = {
  premiumTheme: 500,        // 高级主题
  albumTemplate: 200,       // 图文集模板
  exportPDF: 50,            // 导出PDF
  aiPolish: 10              // AI润色（每次）
};
```

---

### 1.4 AI 功能集成

#### 1.4.1 文字润色

```javascript
// 调用 AI 润色接口
async function polishText(originalText, style = 'elegant') {
  const response = await wx.request({
    url: `${API_BASE_URL}/api/ai/polish`,
    method: 'POST',
    data: {
      text: originalText,
      style: style,  // elegant, casual, poetic, etc.
      maxLength: 500
    }
  });
  
  return response.data.polishedText;
}
```

#### 1.4.2 图文排版优化

```javascript
// AI 分析图片并推荐排版
async function optimizeLayout(images, text) {
  const response = await wx.request({
    url: `${API_BASE_URL}/api/ai/layout`,
    method: 'POST',
    data: {
      imageCount: images.length,
      textLength: text.length,
      aspectRatios: images.map(img => img.width / img.height)
    }
  });
  
  return response.data.layoutSuggestion;
}
```

---

## 二、技术实现细节

### 2.1 项目结构

```
emotions-diary-miniprogram/
├── pages/                      # 页面
│   ├── index/                 # 首页
│   │   ├── index.js
│   │   ├── index.json
│   │   ├── index.wxml
│   │   └── index.wxss
│   ├── diary/                 # 日记相关
│   │   ├── list/             # 日记列表
│   │   ├── detail/           # 日记详情
│   │   ├── create/           # 创建日记
│   │   └── edit/             # 编辑日记
│   ├── album/                 # 图文集
│   │   ├── list/
│   │   ├── create/
│   │   └── preview/
│   ├── theme/                 # 主题商店
│   │   ├── store/
│   │   └── preview/
│   ├── user/                  # 用户中心
│   │   ├── profile/
│   │   ├── settings/
│   │   └── points/
│   └── checkin/               # 签到
├── components/                 # 组件
│   ├── theme-wrapper/         # 主题包裹组件
│   ├── diary-card/            # 日记卡片
│   ├── image-uploader/        # 图片上传器
│   ├── tag-selector/          # 标签选择器
│   ├── ai-polish-panel/       # AI润色面板
│   └── tutorial-guide/        # 引导组件
├── utils/                      # 工具类
│   ├── theme-manager.js       # 主题管理器
│   ├── api.js                 # API 封装
│   ├── auth.js                # 鉴权
│   ├── cache.js               # 缓存管理
│   └── canvas-utils.js        # Canvas 工具
├── styles/                     # 全局样式
│   ├── theme.wxss             # 主题样式
│   └── common.wxss            # 通用样式
├── static/                     # 静态资源
│   ├── images/
│   └── icons/
├── app.js                      # 小程序入口
├── app.json                    # 小程序配置
└── app.wxss                    # 全局样式
```

### 2.2 关键组件实现

#### 2.2.1 图片拖拽排序组件

```javascript
// components/image-uploader/image-uploader.js

Component({
  properties: {
    maxCount: {
      type: Number,
      value: 9
    },
    images: {
      type: Array,
      value: []
    }
  },
  
  data: {
    imageList: [],
    dragIndex: -1,
    dragOverIndex: -1
  },
  
  methods: {
    // 选择图片
    chooseImage() {
      const remaining = this.properties.maxCount - this.data.imageList.length;
      
      wx.chooseImage({
        count: remaining,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          const newImages = res.tempFilePaths.map((path, index) => ({
            id: Date.now() + index,
            path: path,
            uploaded: false
          }));
          
          this.setData({
            imageList: [...this.data.imageList, ...newImages]
          });
          
          // 上传图片
          this.uploadImages(newImages);
        }
      });
    },
    
    // 上传图片
    async uploadImages(images) {
      for (let img of images) {
        try {
          const url = await this.uploadSingleImage(img.path);
          
          // 更新图片状态
          const imageList = this.data.imageList.map(item => {
            if (item.id === img.id) {
              return { ...item, url, uploaded: true };
            }
            return item;
          });
          
          this.setData({ imageList });
        } catch (error) {
          wx.showToast({ title: '上传失败', icon: 'none' });
        }
      }
      
      this.triggerEvent('change', { images: this.data.imageList });
    },
    
    // 单个图片上传
    uploadSingleImage(filePath) {
      return new Promise((resolve, reject) => {
        wx.uploadFile({
          url: `${API_BASE_URL}/api/upload/image`,
          filePath: filePath,
          name: 'file',
          header: {
            'Authorization': `Bearer ${wx.getStorageSync('token')}`
          },
          success: (res) => {
            const data = JSON.parse(res.data);
            resolve(data.url);
          },
          fail: reject
        });
      });
    },
    
    // 长按开始拖拽
    onLongPress(e) {
      const index = e.currentTarget.dataset.index;
      this.setData({ dragIndex: index });
      
      wx.vibrateShort();
    },
    
    // 拖拽移动
    onTouchMove(e) {
      if (this.data.dragIndex === -1) return;
      
      // 计算当前触摸位置对应的图片索引
      const touch = e.touches[0];
      const query = wx.createSelectorQuery().in(this);
      
      query.selectAll('.image-item').boundingClientRect((rects) => {
        for (let i = 0; i < rects.length; i++) {
          const rect = rects[i];
          if (
            touch.clientX >= rect.left &&
            touch.clientX <= rect.right &&
            touch.clientY >= rect.top &&
            touch.clientY <= rect.bottom
          ) {
            this.setData({ dragOverIndex: i });
            break;
          }
        }
      }).exec();
    },
    
    // 拖拽结束
    onTouchEnd() {
      if (this.data.dragIndex === -1) return;
      
      const { dragIndex, dragOverIndex, imageList } = this.data;
      
      if (dragOverIndex !== -1 && dragIndex !== dragOverIndex) {
        // 交换位置
        const newList = [...imageList];
        const [removed] = newList.splice(dragIndex, 1);
        newList.splice(dragOverIndex, 0, removed);
        
        this.setData({ imageList: newList });
        this.triggerEvent('change', { images: newList });
      }
      
      this.setData({
        dragIndex: -1,
        dragOverIndex: -1
      });
    },
    
    // 删除图片
    deleteImage(e) {
      const index = e.currentTarget.dataset.index;
      const imageList = this.data.imageList.filter((_, i) => i !== index);
      
      this.setData({ imageList });
      this.triggerEvent('change', { images: imageList });
    },
    
    // 预览图片
    previewImage(e) {
      const index = e.currentTarget.dataset.index;
      const urls = this.data.imageList.map(img => img.url || img.path);
      
      wx.previewImage({
        current: urls[index],
        urls: urls
      });
    }
  }
});
```

#### 2.2.2 主题包裹组件

```javascript
// components/theme-wrapper/theme-wrapper.js

Component({
  data: {
    cssVars: {}
  },
  
  lifetimes: {
    attached() {
      this.updateTheme();
    }
  },
  
  pageLifetimes: {
    show() {
      this.updateTheme();
    }
  },
  
  methods: {
    updateTheme() {
      const app = getApp();
      this.setData({
        cssVars: app.globalData.cssVars || {}
      });
    }
  }
});
```

```xml
<!-- components/theme-wrapper/theme-wrapper.wxml -->
<view class="theme-wrapper" 
      style="
        background: {{cssVars['--theme-background']}};
        color: {{cssVars['--theme-text-primary']}};
      ">
  <slot></slot>
</view>
```

### 2.3 性能优化

#### 2.3.1 图片懒加载

```javascript
// 使用 IntersectionObserver 实现图片懒加载
Page({
  onReady() {
    this.createIntersectionObserver()
      .relativeToViewport({ bottom: 100 })
      .observe('.lazy-image', (res) => {
        if (res.intersectionRatio > 0) {
          // 加载图片
          const dataset = res.dataset;
          this.loadImage(dataset.index);
        }
      });
  }
});
```

#### 2.3.2 列表虚拟滚动

```javascript
// 使用 recycle-view 实现长列表优化
// 详见微信官方文档
```

#### 2.3.3 主题资源预加载

```javascript
// 在用户浏览主题商店时预加载
themeManager.preloadTheme(themeId);
```

---

## 三、开发规范

### 3.1 代码规范
- 使用 ESLint + Prettier
- 组件命名：kebab-case
- 变量命名：camelCase
- 常量命名：UPPER_SNAKE_CASE

### 3.2 注释规范
```javascript
/**
 * 函数说明
 * @param {string} param1 - 参数说明
 * @returns {Promise<Object>} 返回值说明
 */
```

### 3.3 Git 提交规范
```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式
refactor: 重构
test: 测试
chore: 构建/工具
```

---

## 四、测试计划

### 4.1 功能测试
- [ ] 日记 CRUD
- [ ] 图片上传与排序
- [ ] 主题切换
- [ ] 图文集生成
- [ ] 签到积分

### 4.2 性能测试
- [ ] 首屏加载时间 < 2s
- [ ] 主题切换时间 < 1s
- [ ] 列表滚动流畅度 60fps

### 4.3 兼容性测试
- [ ] iOS 微信
- [ ] Android 微信
- [ ] 不同屏幕尺寸

---

## 五、发布计划

### 5.1 版本规划
- v1.0.0: 核心功能 + 12个免费主题
- v1.1.0: 图文集导出 + AI 功能
- v1.2.0: 社交分享 + 付费主题

### 5.2 上线checklist
- [ ] 代码审查
- [ ] 测试通过
- [ ] 隐私政策
- [ ] 用户协议
- [ ] 微信审核

---

## 附录

### A. API 接口文档
参见后端开发文档

### B. 设计规范
参见 UI 设计文档

### C. 第三方服务
- 云存储：腾讯云 COS
- AI 服务：OpenAI API / 文心一言
- 打印服务：第三方打印 API
