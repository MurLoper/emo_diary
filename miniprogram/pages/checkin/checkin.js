// pages/checkin/checkin.js
const app = getApp();
const api = require('../../utils/api');
const iconConfig = require('../../utils/iconConfig');

Page({
  data: {
    cssVars: {},
    continuousDays: 0,
    hasCheckedInToday: false,
    showReward: false,
    rewardPoints: 10,
    currentYear: 0,
    currentMonth: 0,
    today: 0,
    weekdays: ['日', '一', '二', '三', '四', '五', '六'],
    calendarDays: [],
    checkedDays: [],
    bonusMilestones: [
      { days: 7, points: 20, label: '连续7天', coins: 0 },
      { days: 30, points: 100, label: '连续30天', coins: 18 },
      { days: 88, points: 0, label: '连续88天', coins: 88 },
      { days: 100, points: 500, label: '连续100天', coins: 0 }
    ],
    // 图标配置
    icons: {
      gift: iconConfig.getIconPath('gift', 'accent'),
      trendingUp: iconConfig.getIconPath('trending-up', 'primary'),
      sparkles: iconConfig.getIconPath('sparkles', 'accent'),
    }
  },

  onLoad(options) {
    // 应用主题
    this.applyTheme();

    // 初始化日历
    this.initCalendar();

    // 加载签到信息
    this.loadCheckInInfo();
  },

  onShow() {
    // 应用主题
    this.applyTheme();
  },

  /**
   * 主题切换回调
   */
  onThemeChange(theme) {
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
   * 初始化日历
   */
  initCalendar() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const today = date.getDate();

    // 获取当月第一天是星期几
    const firstDay = new Date(year, month - 1, 1).getDay();

    // 获取当月天数
    const daysInMonth = new Date(year, month, 0).getDate();

    // 生成日历数组
    const calendarDays = [];

    // 填充空白
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(null);
    }

    // 填充日期
    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push(i);
    }

    this.setData({
      currentYear: year,
      currentMonth: month,
      today,
      calendarDays
    });
  },

  /**
   * 加载签到信息
   */
  async loadCheckInInfo() {
    try {
      const res = await api.get('/checkin/info');

      if (res.success) {
        const checkInData = res.data;

        this.setData({
          continuousDays: checkInData.continuousDays || 0,
          hasCheckedInToday: checkInData.hasCheckedInToday || false,
          checkedDays: checkInData.checkedDaysThisMonth || []
        });

        // 更新全局数据
        if (app.globalData.userInfo) {
          app.globalData.userInfo.checkIn = {
            ...app.globalData.userInfo.checkIn,
            continuousDays: checkInData.continuousDays || 0
          };
        }
      }
    } catch (error) {
      console.error('加载签到信息失败:', error);
    }
  },

  /**
   * 签到
   */
  async onCheckIn() {
    if (this.data.hasCheckedInToday) {
      return;
    }

    wx.showLoading({ title: '签到中...' });

    try {
      const res = await api.post('/checkin');

      if (res.success) {
        const checkInData = res.data;
        const rewardPoints = checkInData.points || 10;
        const newContinuousDays = checkInData.continuousDays || this.data.continuousDays + 1;

        // 更新签到状态
        this.setData({
          hasCheckedInToday: true,
          continuousDays: newContinuousDays,
          checkedDays: [...this.data.checkedDays, this.data.today],
          rewardPoints,
          showReward: true
        });

        // 更新全局用户信息
        if (app.globalData.userInfo) {
          app.globalData.userInfo.points = (app.globalData.userInfo.points || 0) + rewardPoints;
          app.globalData.userInfo.checkIn = {
            ...app.globalData.userInfo.checkIn,
            continuousDays: newContinuousDays
          };

          // 如果有心晴币奖励
          if (checkInData.coins) {
            app.globalData.userInfo.coins = (app.globalData.userInfo.coins || 0) + checkInData.coins;
          }
        }

        wx.hideLoading();

        // 2秒后隐藏奖励提示
        setTimeout(() => {
          this.setData({
            showReward: false
          });
        }, 2000);
      } else {
        throw new Error(res.message || '签到失败');
      }
    } catch (error) {
      console.error('签到失败:', error);
      wx.hideLoading();
      wx.showToast({
        title: error.message || '签到失败',
        icon: 'none'
      });
    }
  },

  /**
   * 返回
   */
  onBack() {
    wx.navigateBack();
  }
});