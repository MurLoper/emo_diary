// pages/user/user.js
const app = getApp();
const api = require('../../utils/api');
const iconConfig = require('../../utils/iconConfig');

Page({
  data: {
    cssVars: {},
    activeTab: 'profile',
    userInfo: {
      name: '用户',
      avatar: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
      level: 'VIP',
      joinDate: '2025-01-01'
    },
    userPoints: 0,
    userCoins: 0,
    diaryCount: 0,
    themeCount: 0,
    // 图标配置
    icons: {
      settings: iconConfig.getIconPath('settings', 'primary'),
      user: iconConfig.getIconPath('user', 'primary'),
      shield: iconConfig.getIconPath('shield', 'primary'),
      bell: iconConfig.getIconPath('bell', 'primary'),
      helpCircle: iconConfig.getIconPath('help-circle', 'primary'),
      info: iconConfig.getIconPath('info', 'primary'),
      sparkles: iconConfig.getIconPath('sparkles', 'primary'),
      dollarSign: iconConfig.getIconPath('dollar-sign', 'primary'),
      bookOpen: iconConfig.getIconPath('book-open', 'primary'),
      award: iconConfig.getIconPath('award', 'primary'),
    }
  },

  onLoad(options) {
    // �(;�
    this.applyTheme();

    // �}(7�o
    this.loadUserInfo();
  },

  onShow() {
    // �(;�
    this.applyTheme();

    // 7�(7�o
    this.loadUserInfo();
  },

  /**
   * ;�b�
   */
  onThemeChange(theme) {
    this.applyTheme();
  },

  /**
   * �(;�
   */
  applyTheme() {
    this.setData({
      cssVars: app.globalData.cssVars || {}
    });
  },

  /**
   * �}(7�o
   */
  async loadUserInfo() {
    try {
      const res = await api.get('/user/profile');

      if (res.success) {
        const userInfo = res.data;

        this.setData({
          userPoints: userInfo.points || 0,
          userCoins: userInfo.coins || 0,
          diaryCount: userInfo.diaryCount || 0,
          themeCount: userInfo.unlockedThemes?.length || 0,
          userInfo: {
            name: userInfo.nickname || '�t(7',
            avatar: userInfo.avatar || this.data.userInfo.avatar,
            level: userInfo.level || 'VIP',
            joinDate: userInfo.createdAt ? userInfo.createdAt.split('T')[0] : '2025-01-01'
          }
        });

        // ��h@pn
        app.globalData.userInfo = userInfo;
      }
    } catch (error) {
      console.error('�}(7�o1%:', error);
    }
  },

  /**
   * b~u
   */
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab
    });
  },

  /**
   * �l0�h
   */
  navigateToDiaryList() {
    wx.navigateTo({
      url: '/pages/diary/list/list'
    });
  },

  /**
   * �l0;�F�
   */
  navigateToThemeStore() {
    wx.navigateTo({
      url: '/pages/theme/store/store'
    });
  },

  /**
   * �l0~0u
   */
  navigateToCheckin() {
    wx.navigateTo({
      url: '/pages/checkin/checkin'
    });
  }
});
