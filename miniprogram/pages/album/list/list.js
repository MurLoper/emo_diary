// pages/album/list/list.js
const app = getApp();
const api = require('../../../utils/api');
const iconConfig = require('../../../utils/iconConfig');

Page({
  data: {
    cssVars: {},
    albums: [],
    templates: [
      { id: 'classic', name: '经典网格', color: '#FF6B9D', icon: '📱' },
      { id: 'magazine', name: '杂志风格', color: '#9B59B6', icon: '📖' },
      { id: 'timeline', name: '时间线', color: '#3498DB', icon: '⏰' },
      { id: 'polaroid', name: '宝丽来', color: '#E74C3C', icon: '📷' },
    ],
    icons: {
      calendar: iconConfig.getIconPath('calendar', 'white'),
      image: iconConfig.getIconPath('image', 'secondary')
    }
  },

  onLoad() {
    this.applyTheme();
    this.loadAlbums();
  },

  onShow() {
    this.applyTheme();
    this.loadAlbums();
  },

  /**
   * 应用主题
   */
  applyTheme() {
    this.setData({
      cssVars: app.globalData.cssVars || {}
    });
  },

  /**
   * 加载图文集列表
   */
  async loadAlbums() {
    try {
      const res = await api.get('/albums');

      if (res.success) {
        this.setData({
          albums: res.data.albums || []
        });
      }
    } catch (error) {
      console.error('加载图文集失败:', error);
    }
  },

  /**
   * 跳转到创建页面
   */
  navigateToCreate() {
    wx.navigateTo({
      url: '/pages/album/create/create'
    });
  },

  /**
   * 点击图文集卡片
   */
  onAlbumTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/album/preview/preview?id=${id}`
    });
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.loadAlbums().then(() => {
      wx.stopPullDownRefresh();
    });
  }
});
