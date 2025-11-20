// pages/album/preview/preview.js
const app = getApp();
const api = require('../../../utils/api');

// 模板配置
const TEMPLATE_CONFIG = {
  classic: { name: '经典网格', color: '#FF6B9D' },
  magazine: { name: '杂志风格', color: '#9B59B6' },
  timeline: { name: '时间线', color: '#3498DB' },
  minimal: { name: '极简主义', color: '#2ECC71' },
  collage: { name: '拼贴画册', color: '#F39C12' },
  polaroid: { name: '宝丽来', color: '#E74C3C' }
};

Page({
  data: {
    cssVars: {},
    loading: true,
    album: {
      _id: '',
      title: '',
      description: '',
      template: 'classic',
      diaries: [],
      createdAt: ''
    },
    templateName: '经典网格',
    templateColor: '#FF6B9D'
  },

  onLoad(options) {
    const { id } = options;

    if (!id) {
      wx.showToast({
        title: '图文集ID不存在',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
      return;
    }

    // 应用主题
    this.applyTheme();

    // 加载图文集数据
    this.loadAlbum(id);
  },

  onShow() {
    // 应用主题
    this.applyTheme();
  },

  /**
   * 主题切换回调
   */
  onThemeChange() {
    this.applyTheme();
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
   * 加载图文集数据
   */
  async loadAlbum(albumId) {
    this.setData({ loading: true });

    try {
      const res = await api.get(`/albums/${albumId}`);

      if (res.success) {
        const album = res.data.album || res.data;

        // 格式化日期
        const formatDate = (dateStr) => {
          if (!dateStr) return '';
          const date = new Date(dateStr);
          return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        };

        // 处理图文集数据
        const formattedAlbum = {
          ...album,
          createdAt: formatDate(album.createdAt),
          diaries: (album.diaries || []).map(diary => ({
            ...diary,
            createdAt: formatDate(diary.createdAt),
            content: diary.content ? diary.content.substring(0, 100) : ''
          }))
        };

        // 获取模板配置
        const templateConfig = TEMPLATE_CONFIG[album.template] || TEMPLATE_CONFIG.classic;

        this.setData({
          album: formattedAlbum,
          templateName: templateConfig.name,
          templateColor: templateConfig.color,
          loading: false
        });
      } else {
        throw new Error(res.message || '加载失败');
      }
    } catch (error) {
      console.error('加载图文集失败:', error);

      wx.hideLoading();
      wx.showToast({
        title: error.message || '加载失败',
        icon: 'none'
      });

      this.setData({ loading: false });

      // 失败后返回
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },

  /**
   * 点击日记
   */
  onDiaryTap(e) {
    const { id } = e.currentTarget.dataset;

    wx.navigateTo({
      url: `/pages/diary/detail/detail?id=${id}`
    });
  },

  /**
   * 分享
   */
  onShare() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });

    wx.showToast({
      title: '点击右上角分享',
      icon: 'none'
    });
  },

  /**
   * 分享给朋友
   */
  onShareAppMessage() {
    return {
      title: `我的图文集：${this.data.album.title}`,
      path: `/pages/album/preview/preview?id=${this.data.album._id}`,
      imageUrl: this.data.album.diaries[0]?.images?.[0] || ''
    };
  },

  /**
   * 分享到朋友圈
   */
  onShareTimeline() {
    return {
      title: `我的图文集：${this.data.album.title}`,
      query: `id=${this.data.album._id}`,
      imageUrl: this.data.album.diaries[0]?.images?.[0] || ''
    };
  },

  /**
   * 编辑图文集
   */
  onEdit() {
    wx.navigateTo({
      url: `/pages/album/create/create?id=${this.data.album._id}&mode=edit`
    });
  },

  /**
   * 导出图片
   */
  async onExport() {
    wx.showLoading({
      title: '生成中...',
      mask: true
    });

    try {
      // 创建canvas上下文
      const query = wx.createSelectorQuery();
      query.select('.diaries-container').boundingClientRect();

      const res = await new Promise((resolve) => {
        query.exec(resolve);
      });

      if (!res || !res[0]) {
        throw new Error('获取内容区域失败');
      }

      // 模拟导出功能（实际需要canvas绘制）
      await new Promise(resolve => setTimeout(resolve, 1000));

      wx.hideLoading();

      wx.showModal({
        title: '导出功能',
        content: '图文集导出功能即将上线，敬请期待！',
        showCancel: false,
        confirmText: '知道了',
        confirmColor: this.data.cssVars['--theme-primary'] || '#FF6B9D'
      });
    } catch (error) {
      console.error('导出失败:', error);

      wx.hideLoading();
      wx.showToast({
        title: error.message || '导出失败',
        icon: 'none'
      });
    }
  }
});
