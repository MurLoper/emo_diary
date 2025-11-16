// pages/index/index.js
const app = getApp();
const api = require('../../utils/api');
const iconConfig = require('../../utils/iconConfig');

Page({
  data: {
    cssVars: {},
    userPoints: 0,
    continuousDays: 0,
    diaryCount: 0,
    albumCount: 0,
    recentDiaries: [],
    // 图标路径配置 - 将在 onLoad 中动态加载
    icons: {},
    banners: [
      {
        id: 1,
        title: '记录美好瞬间',
        subtitle: '用心晴日记记录每一个精彩时刻',
        image: 'https://images.unsplash.com/photo-1611571741792-edb58d0ceb67?w=800'
      },
      {
        id: 2,
        title: '主题随心换',
        subtitle: '12+精美主题，打造专属风格',
        image: 'https://images.unsplash.com/photo-1654281436853-fc0f3fe2d4e2?w=800'
      },
      {
        id: 3,
        title: 'AI智能润色',
        subtitle: '让你的文字更加精彩动人',
        image: 'https://images.unsplash.com/photo-1596748401458-0df74b2baf9b?w=800'
      }
    ],
    currentBannerIndex: 0
  },

  onLoad() {
    // 加载主题图标
    this.loadIcons();

    // 应用主题
    this.applyTheme();

    // 加载数据
    this.loadData();
  },

  onShow() {
    // 加载主题图标
    this.loadIcons();

    // 应用主题
    this.applyTheme();

    // 刷新数据
    this.loadData();
  },

  /**
   * 加载主题图标
   */
  loadIcons() {
    // 获取当前主题ID（从主题对象中提取ID，或使用默认值）
    const currentThemeId = app.globalData.currentTheme?.id ||
                          wx.getStorageSync('currentThemeId') ||
                          'pink-girl';

    console.log('[index] 加载图标，当前主题ID:', currentThemeId);

    // 手动获取每个图标路径并使用驼峰命名
    this.setData({
      icons: {
        home: iconConfig.getThemeIconPath('home', currentThemeId, 'primary'),
        palette: iconConfig.getThemeIconPath('palette', currentThemeId, 'primary'),
        bookOpen: iconConfig.getThemeIconPath('book-open', currentThemeId, 'primary'),
        image: iconConfig.getThemeIconPath('image', currentThemeId, 'secondary')
      }
    });

    console.log('[index] 图标加载完成:', this.data.icons);
  },

  /**
   * 主题切换回调
   */
  onThemeChange() {
    this.loadIcons(); // 重新加载图标
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
   * 加载数据
   */
  async loadData() {
    // 检查登录状态
    if (!app.isLogin()) {
      return;
    }

    try {
      // 并行加载用户信息和日记列表
      const [userProfile, diariesResult] = await Promise.all([
        this.loadUserProfile(),
        this.loadRecentDiaries()
      ]);

      // 更新用户数据
      if (userProfile) {
        this.setData({
          userPoints: userProfile.points || 0,
          continuousDays: userProfile.checkIn?.continuousDays || 0
        });
      }

      // 更新日记数据
      if (diariesResult) {
        this.setData({
          diaryCount: diariesResult.total || 0,
          recentDiaries: diariesResult.diaries || []
        });
      }
    } catch (error) {
      console.error('加载数据失败:', error);
    }
  },

  /**
   * 加载用户信息
   */
  async loadUserProfile() {
    try {
      const res = await api.get('/user/profile');
      if (res.success) {
        // 更新全局用户信息
        app.globalData.userInfo = {
          ...app.globalData.userInfo,
          ...res.data
        };
        return res.data;
      }
    } catch (error) {
      console.error('加载用户信息失败:', error);
      return null;
    }
  },

  /**
   * 加载最近日记
   */
  async loadRecentDiaries() {
    try {
      const res = await api.get('/diaries', {
        page: 1,
        limit: 3,
        sort: '-createdAt'
      });

      if (res.success) {
        return {
          diaries: res.data.diaries || [],
          total: res.data.total || 0
        };
      }
      return null;
    } catch (error) {
      console.error('加载日记列表失败:', error);
      return null;
    }
  },

  /**
   * Banner切换
   */
  onBannerChange(e) {
    this.setData({
      currentBannerIndex: e.detail.current
    });
  },

  /**
   * 跳转到主题商店
   */
  navigateToTheme() {
    wx.navigateTo({
      url: '/pages/theme/store/store'
    });
  },

  /**
   * 跳转到创建日记
   */
  navigateToCreate() {
    if (!app.isLogin()) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }

    wx.navigateTo({
      url: '/pages/diary/create/create'
    });
  },

  /**
   * 跳转到图文集列表
   */
  navigateToAlbum() {
    if (!app.isLogin()) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }

    wx.navigateTo({
      url: '/pages/album/list/list'
    });
  },

  /**
   * 跳转到日记列表
   */
  navigateToDiaryList() {
    if (!app.isLogin()) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }

    wx.switchTab({
      url: '/pages/diary/diary'
    });
  },

  /**
   * 跳转到日记详情
   */
  navigateToDiaryDetail(e) {
    const diaryId = e.currentTarget.dataset.id;

    wx.navigateTo({
      url: `/pages/diary/detail/detail?id=${diaryId}`
    });
  },

  /**
   * 下拉刷新
   */
  async onPullDownRefresh() {
    await this.loadData();
    wx.stopPullDownRefresh();
  }
});
