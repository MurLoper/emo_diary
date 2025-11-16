// pages/theme/store/store.js
const app = getApp();
const api = require('../../../utils/api');
const iconConfig = require('../../../utils/iconConfig');

Page({
  data: {
    cssVars: {},
    currentTheme: {},
    userPoints: 0,
    userCoins: 0,
    continuousDays: 0,
    unlockedThemes: [],
    freeThemes: [],
    signinThemes: [],
    pointsThemes: [],
    premiumThemes: [],
    selectedPreview: null,
    previewButtonText: '',
    showBackToTop: false,
    scrollIntoView: '',
    icons: {
      crown: iconConfig.getIconPath('crown', 'primary'),
      gift: iconConfig.getIconPath('gift', 'accent'),
      lock: iconConfig.getIconPath('lock', 'primary'),
      sparkles: iconConfig.getIconPath('sparkles', 'accent')
    }
  },

  onLoad(options) {
    // 应用主题
    this.applyTheme();

    // 加载数据
    this.loadUserInfo();
    this.loadThemes();
  },

  onShow() {
    // 应用主题
    this.applyTheme();

    // 刷新用户信息和主题列表
    this.loadUserInfo();
    this.loadThemes();
  },

  /**
   * 主题切换回调
   */
  onThemeChange(theme) {
    this.applyTheme();
    this.setData({
      currentTheme: app.globalData.currentTheme || {}
    });
    this.processThemes();
  },

  /**
   * 应用主题
   */
  applyTheme() {
    this.setData({
      cssVars: app.globalData.cssVars || {},
      currentTheme: app.globalData.currentTheme || {}
    });
  },

  /**
   * 加载用户信息
   */
  async loadUserInfo() {
    try {
      const res = await api.get('/user/profile');

      if (res.success) {
        const userInfo = res.data;

        this.setData({
          userPoints: userInfo.points || 0,
          userCoins: userInfo.coins || 0,
          continuousDays: userInfo.checkIn?.continuousDays || 0,
          unlockedThemes: userInfo.unlockedThemes || []
        });

        // 更新全局数据
        app.globalData.userInfo = userInfo;

        // 重新处理主题
        this.processThemes();
      }
    } catch (error) {
      console.error('加载用户信息失败:', error);
    }
  },

  /**
   * 加载主题列表
   */
  async loadThemes() {
    try {
      const res = await api.get('/themes');

      if (res.success) {
        // 后端 paginatedResponse 返回的 data 字段就是主题数组
        app.globalData.themes = res.data || [];
        console.log('加载主题成功:', res.data);
        this.processThemes();
      }
    } catch (error) {
      console.error('加载主题失败:', error);
    }
  },

  /**
   * 处理主题数据
   */
  processThemes() {
    const themes = app.globalData.themes || [];
    const currentThemeId = app.globalData.currentTheme?.id;
    const { unlockedThemes, userPoints, continuousDays } = this.data;

    console.log('处理主题数据:', {
      总主题数: themes.length,
      当前主题ID: currentThemeId,
      已解锁主题: unlockedThemes,
      用户积分: userPoints,
      连续签到: continuousDays
    });

    // 分组并添加状态信息
    const freeThemes = themes.filter(t =>
      t.unlockMethod?.type === 'default' || t.category === 'free'
    ).map(t => ({
      ...t,
      type: 'free',
      isActive: t.id === currentThemeId,
      isUnlocked: unlockedThemes.includes(t.id) || t.unlockMethod?.type === 'default' || t.category === 'free',
      canUnlock: true
    }));

    const signinThemes = themes.filter(t =>
      t.unlockMethod?.type === 'signin'
    ).map(t => ({
      ...t,
      type: 'signin',
      signinDays: t.unlockMethod?.signinDays || 0,
      isActive: t.id === currentThemeId,
      isUnlocked: unlockedThemes.includes(t.id),
      canUnlock: continuousDays >= (t.unlockMethod?.signinDays || 0)
    }));

    const pointsThemes = themes.filter(t =>
      t.unlockMethod?.type === 'points'
    ).map(t => ({
      ...t,
      type: 'points',
      pointsCost: t.unlockMethod?.pointsCost || 0,
      isActive: t.id === currentThemeId,
      isUnlocked: unlockedThemes.includes(t.id),
      canUnlock: userPoints >= (t.unlockMethod?.pointsCost || 0)
    }));

    const premiumThemes = themes.filter(t =>
      t.unlockMethod?.type === 'purchase' || t.category === 'premium'
    ).map(t => ({
      ...t,
      type: 'premium',
      price: t.unlockMethod?.moneyCost || 0,
      isActive: t.id === currentThemeId,
      isUnlocked: unlockedThemes.includes(t.id),
      canUnlock: false
    }));

    console.log('主题分组结果:', {
      免费主题: freeThemes.length,
      签到主题: signinThemes.length,
      积分主题: pointsThemes.length,
      高级主题: premiumThemes.length
    });

    this.setData({
      freeThemes,
      signinThemes,
      pointsThemes,
      premiumThemes
    });
  },

  /**
   * 主题卡片点击
   */
  onThemeCardTap(e) {
    const themeId = e.currentTarget.dataset.themeId;
    const allThemes = [
      ...this.data.freeThemes,
      ...this.data.signinThemes,
      ...this.data.pointsThemes,
      ...this.data.premiumThemes
    ];
    const theme = allThemes.find(t => t.id === themeId);

    if (theme) {
      this.showPreview(theme);
    }
  },

  /**
   * 显示预览弹窗
   */
  showPreview(theme) {
    const buttonText = this.getPreviewButtonText(theme);

    this.setData({
      selectedPreview: theme,
      previewButtonText: buttonText
    });
  },

  /**
   * 获取预览按钮文本
   */
  getPreviewButtonText(theme) {
    const { unlockedThemes, userPoints, userCoins, continuousDays } = this.data;

    if (unlockedThemes.includes(theme.id) || theme.type === 'free') {
      return '应用此主题';
    }

    if (theme.type === 'points') {
      if (userPoints >= theme.pointsCost) {
        return `使用 ${theme.pointsCost} 积分解锁`;
      } else {
        return `积分不足 (需要${theme.pointsCost}，当前${userPoints})`;
      }
    }

    if (theme.type === 'signin') {
      if (continuousDays >= theme.signinDays) {
        return '解锁并应用';
      } else {
        return '需要签到解锁';
      }
    }

    if (theme.type === 'premium') {
      return `需要购买解锁 (${theme.price}心晴币)`;
    }

    return '应用此主题';
  },

  /**
   * 关闭预览
   */
  closePreview() {
    this.setData({
      selectedPreview: null
    });
  },

  /**
   * 停止冒泡
   */
  stopPropagation() {
    // 阻止事件冒泡
  },

  /**
   * 处理预览确认按钮 - 解锁并应用主题
   */
  async handleApplyTheme() {
    const { selectedPreview, unlockedThemes, userPoints, userCoins, continuousDays } = this.data;

    if (!selectedPreview) return;

    const isUnlocked = unlockedThemes.includes(selectedPreview.id) || selectedPreview.type === 'free';

    if (!isUnlocked) {
      // 检查是否可以解锁
      if (selectedPreview.type === 'points') {
        if (userPoints >= selectedPreview.pointsCost) {
          // 使用积分解锁
          await this.unlockTheme(selectedPreview.id, 'points');
        } else {
          wx.showToast({
            title: '积分不足',
            icon: 'none'
          });
          return;
        }
      } else if (selectedPreview.type === 'signin') {
        if (continuousDays >= selectedPreview.signinDays) {
          // 签到天数达标，解锁
          await this.unlockTheme(selectedPreview.id, 'signin');
        } else {
          wx.showToast({
            title: '签到天数不足',
            icon: 'none'
          });
          return;
        }
      } else if (selectedPreview.type === 'premium') {
        wx.showToast({
          title: '请先充值心晴币',
          icon: 'none'
        });
        return;
      }
    }

    // 应用主题
    await this.setActiveTheme(selectedPreview);
  },

  /**
   * 解锁主题
   */
  async unlockTheme(themeId, method) {
    wx.showLoading({ title: '解锁中...' });

    try {
      const res = await api.post(`/themes/${themeId}/unlock`, {
        method
      });

      if (res.success) {
        // 更新已解锁主题列表
        const unlockedThemes = [...this.data.unlockedThemes, themeId];
        this.setData({ unlockedThemes });

        // 更新用户积分/金币
        if (method === 'points') {
          this.setData({
            userPoints: this.data.userPoints - (this.data.selectedPreview.pointsCost || 0)
          });
        } else if (method === 'premium') {
          this.setData({
            userCoins: this.data.userCoins - (this.data.selectedPreview.price || 0)
          });
        }

        wx.hideLoading();
        return true;
      } else {
        throw new Error(res.message || '解锁失败');
      }
    } catch (error) {
      console.error('解锁主题失败:', error);
      wx.hideLoading();
      wx.showToast({
        title: error.message || '解锁失败',
        icon: 'none'
      });
      return false;
    }
  },

  /**
   * 设置激活主题
   */
  async setActiveTheme(theme) {
    wx.showLoading({ title: '应用中...' });

    try {
      const res = await api.post(`/themes/${theme.id}/apply`, {});

      if (res.success) {
        // 使用后端返回的完整主题数据（包含完整的 cssConfig）
        const fullTheme = res.data.theme;

        console.log('应用主题成功，完整主题数据:', fullTheme);

        // 更新全局主题
        app.setTheme(fullTheme);

        wx.hideLoading();
        wx.showToast({
          title: '主题已应用',
          icon: 'success'
        });

        // 关闭预览
        this.closePreview();

        // 刷新页面
        this.applyTheme();
        this.processThemes();
      } else {
        throw new Error(res.message || '应用失败');
      }
    } catch (error) {
      console.error('应用主题失败:', error);
      wx.hideLoading();
      wx.showToast({
        title: error.message || '应用失败',
        icon: 'none'
      });
    }
  },

  /**
   * 跳转到签到页面
   */
  navigateToCheckin() {
    this.closePreview();
    wx.switchTab({
      url: '/pages/checkin/checkin'
    });
  },

  /**
   * 滚动监听
   */
  onScroll(e) {
    const scrollTop = e.detail.scrollTop;
    this.setData({
      showBackToTop: scrollTop > 300
    });
  },

  /**
   * 返回顶部
   */
  scrollToTop() {
    this.setData({
      scrollIntoView: 'top'
    });

    // 重置scrollIntoView
    setTimeout(() => {
      this.setData({
        scrollIntoView: ''
      });
    }, 100);
  }
});