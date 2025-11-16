// app.js
import themeManager from './utils/theme-manager';
import api from './utils/api';
const iconConfig = require('./utils/iconConfig');

App({
  globalData: {
    userInfo: null,
    token: null,
    theme: {},
    cssVars: {},
    currentTheme: 'pink-girl', // 当前主题ID
    themes: [],            // 主题列表
    API_BASE_URL: 'http://localhost:3000' // 修改为实际后端地址
  },

  onLaunch() {
    console.log('心晴日记小程序启动');

    // 配置图标加载模式（环境自适应）
    this.configureIconMode();

    // 检查登录态
    this.checkLogin();

    // 初始化主题系统
    themeManager.init();
  },

  /**
   * 配置图标加载模式（环境自适应）
   * 开发环境：使用本地文件
   * 生产环境：使用 CDN
   */
  configureIconMode() {
    const accountInfo = wx.getAccountInfoSync();
    const envVersion = accountInfo.miniProgram.envVersion;

    console.log('当前环境:', envVersion);

    if (envVersion === 'release') {
      // 生产环境：使用 CDN
      iconConfig.setIconMode('cdn');
      iconConfig.setCdnBaseUrl('https://your-cdn.com/icons'); // TODO: 替换为实际CDN地址
      console.log('[图标系统] 生产环境 - 使用 CDN 模式');
    } else {
      // 开发/体验版：使用本地文件
      iconConfig.setIconMode('local');
      console.log('[图标系统] 开发环境 - 使用本地文件模式');
    }
  },

  /**
   * 检查登录态
   */
  async checkLogin() {
    const token = wx.getStorageSync('token');

    if (token) {
      this.globalData.token = token;

      try {
        // 验证token有效性
        const userInfo = await api.get('/user/profile');
        this.globalData.userInfo = userInfo.data;
      } catch (error) {
        console.error('Token验证失败:', error);
        // 清除无效token
        wx.removeStorageSync('token');
        this.globalData.token = null;

        // 开发环境自动登录
        this.autoLoginInDev();
      }
    } else {
      // 开发环境自动登录
      this.autoLoginInDev();
    }
  },

  /**
   * 开发环境自动登录
   */
  async autoLoginInDev() {
    try {
      // 调用演示登录接口（不需要认证）
      const response = await api.post('/auth/demo-login', {
        nickname: '演示用户'
      }, false);

      if (response.success) {
        const { token, user } = response.data;

        // 保存token
        wx.setStorageSync('token', token);
        this.globalData.token = token;
        this.globalData.userInfo = user;

        console.log('开发环境自动登录成功:', user.nickname);
      }
    } catch (error) {
      console.error('自动登录失败:', error);
    }
  },

  /**
   * 登录
   */
  async login() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: async (res) => {
          if (res.code) {
            try {
              // 调用后端登录接口
              const response = await api.post('/auth/wechat/login', {
                code: res.code
              });

              const { token, user } = response;

              // 保存token
              wx.setStorageSync('token', token);
              this.globalData.token = token;
              this.globalData.userInfo = user;

              resolve(user);
            } catch (error) {
              console.error('登录失败:', error);
              reject(error);
            }
          } else {
            reject(new Error('获取code失败'));
          }
        },
        fail: (error) => {
          reject(error);
        }
      });
    });
  },

  /**
   * 检查是否登录
   */
  isLogin() {
    return !!this.globalData.token;
  },

  /**
   * 退出登录
   */
  logout() {
    wx.removeStorageSync('token');
    this.globalData.token = null;
    this.globalData.userInfo = null;

    // 跳转到登录页
    wx.reLaunch({
      url: '/pages/index/index'
    });
  },

  /**
   * 设置主题
   */
  setTheme(theme) {
    if (theme && theme.id) {
      // 保存当前主题ID
      wx.setStorageSync('currentThemeId', theme.id);

      // 更新全局数据
      this.globalData.currentTheme = theme.id || theme;

      // 应用主题
      themeManager.applyTheme(theme);

      // 通知所有页面主题已切换
      this.notifyThemeChange(theme.id || theme);

      console.log('主题已切换:', theme.name || theme.id);
    }
  },

  /**
   * 通知所有页面主题已改变
   */
  notifyThemeChange(themeId) {
    const pages = getCurrentPages();
    pages.forEach(page => {
      if (page.onThemeChange && typeof page.onThemeChange === 'function') {
        page.onThemeChange(themeId);
      }
    });
  },

  /**
   * 获取当前主题
   */
  getCurrentTheme() {
    return this.globalData.currentTheme || themeManager.getCurrentTheme();
  }
});
