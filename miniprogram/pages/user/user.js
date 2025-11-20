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
  },

  /**
   * 导航到个人信息编辑页
   */
  navigateToPersonalInfo() {
    wx.showModal({
      title: '个人信息',
      content: '个人信息编辑功能开发中...',
      showCancel: false,
      confirmText: '我知道了'
    });
  },

  /**
   * 导航到隐私设置页
   */
  navigateToPrivacy() {
    wx.showModal({
      title: '隐私设置',
      content: '隐私设置功能开发中...',
      showCancel: false,
      confirmText: '我知道了'
    });
  },

  /**
   * 导航到消息通知设置页
   */
  navigateToNotification() {
    wx.showModal({
      title: '消息通知',
      content: '消息通知设置功能开发中...',
      showCancel: false,
      confirmText: '我知道了'
    });
  },

  /**
   * 导航到帮助中心
   */
  navigateToHelp() {
    wx.showModal({
      title: '帮助中心',
      content: '如有问题，请联系客服。\n\n功能说明：\n1. 每日签到可获得积分\n2. 积分可用于解锁主题\n3. 写日记、创建图文集可获得积分奖励',
      showCancel: false,
      confirmText: '我知道了'
    });
  },

  /**
   * 导航到关于我们页
   */
  navigateToAbout() {
    wx.showModal({
      title: '关于我们',
      content: '心晴日记 v1.0.0\n\n一款温暖的日记应用，记录生活，感受美好。\n\n© 2025 心晴日记团队',
      showCancel: false,
      confirmText: '我知道了'
    });
  },

  /**
   * 退出登录
   */
  handleLogout() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      confirmText: '退出',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          // 清除本地存储
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');

          // 清除全局数据
          app.globalData.userInfo = null;
          app.globalData.token = null;

          // 显示成功提示
          wx.showToast({
            title: '已退出登录',
            icon: 'success',
            duration: 2000
          });

          // 重新加载用户信息（显示未登录状态）
          setTimeout(() => {
            this.loadUserInfo();
          }, 2000);
        }
      }
    });
  }
});
