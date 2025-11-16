// pages/diary/list/list.js
const app = getApp();
const api = require('../../../utils/api');
const iconConfig = require('../../../utils/iconConfig');

Page({
  data: {
    cssVars: {},
    searchText: '',
    selectedTag: '全部',
    allTags: ['全部', '开心', '快乐', 'emo', '工作', '美食', '旅行', '好友', '家人'],
    diaries: [],
    filteredDiaries: [],
    showBackToTop: false,
    scrollIntoView: '',
    loading: false,
    page: 1,
    hasMore: true,
    // 图标配置
    icons: {
      search: iconConfig.getIconPath('search', 'secondary'),
      close: iconConfig.getIconPath('x', 'secondary'),
      calendar: iconConfig.getIconPath('calendar', 'primary'),
    }
  },

  onLoad(options) {
    // 应用主题
    this.applyTheme();

    // 加载日记列表
    this.loadDiaries();
  },

  onShow() {
    // 应用主题
    this.applyTheme();

    // 刷新列表
    this.refreshDiaries();
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
   * 加载日记列表
   */
  async loadDiaries(isRefresh = false) {
    if (this.data.loading) return;

    if (isRefresh) {
      this.setData({
        page: 1,
        hasMore: true,
        diaries: []
      });
    }

    if (!this.data.hasMore) return;

    this.setData({ loading: true });

    try {
      const res = await api.get('/diaries', {
        page: this.data.page,
        limit: 20,
        sort: '-createdAt'
      });

      if (res.success) {
        const newDiaries = res.data.diaries || [];
        const diaries = isRefresh ? newDiaries : [...this.data.diaries, ...newDiaries];

        this.setData({
          diaries,
          hasMore: newDiaries.length >= 20,
          page: this.data.page + 1
        });

        // 应用筛选
        this.filterDiaries();
      }
    } catch (error) {
      console.error('加载日记失败:', error);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  /**
   * 刷新日记列表
   */
  async refreshDiaries() {
    await this.loadDiaries(true);
  },

  /**
   * 筛选日记
   */
  filterDiaries() {
    const { diaries, searchText, selectedTag } = this.data;

    let filtered = diaries.filter(diary => {
      // 搜索筛选
      const matchesSearch = !searchText ||
        diary.title.includes(searchText) ||
        diary.content.includes(searchText);

      // 标签筛选
      const matchesTag = selectedTag === '全部' ||
        (diary.tags && diary.tags.includes(selectedTag));

      return matchesSearch && matchesTag;
    });

    this.setData({ filteredDiaries: filtered });
  },

  /**
   * 搜索输入
   */
  onSearchInput(e) {
    this.setData({
      searchText: e.detail.value
    });

    // 防抖搜索
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.filterDiaries();
    }, 300);
  },

  /**
   * 清除搜索
   */
  clearSearch() {
    this.setData({
      searchText: ''
    });
    this.filterDiaries();
  },

  /**
   * 标签选择
   */
  onTagSelect(e) {
    const tag = e.currentTarget.dataset.tag;
    this.setData({
      selectedTag: tag
    });
    this.filterDiaries();
  },

  /**
   * 日记点击
   */
  onDiaryTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/diary/detail/detail?id=${id}`
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
  },

  /**
   * 下拉刷新
   */
  async onPullDownRefresh() {
    await this.refreshDiaries();
    wx.stopPullDownRefresh();
  },

  /**
   * 上拉加载更多
   */
  onReachBottom() {
    this.loadDiaries();
  }
});
