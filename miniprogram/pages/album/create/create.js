const api = require('../../../utils/api');
const iconConfig = require('../../../utils/iconConfig');

Page({
  data: {
    cssVars: {},
    title: '',
    description: '',
    selectedTemplate: 'classic',
    selectedDiaries: [],
    diaries: [],
    templates: [
      {
        id: 'classic',
        name: '经典网格',
        description: '简洁大方的网格布局，图文并茂',
        preview: 'https://images.unsplash.com/photo-1611571741792-edb58d0ceb67?w=400',
        features: ['网格布局', '图片优先', '均衡展示'],
        suggestedFor: '日常生活记录、旅行游记',
        color: '#FF6B9D',
      },
      {
        id: 'magazine',
        name: '杂志风格',
        description: '时尚大气的杂志排版，突出视觉',
        preview: 'https://images.unsplash.com/photo-1654281436853-fc0f3fe2d4e2?w=400',
        features: ['大图封面', '标题醒目', '艺术感强'],
        suggestedFor: '摄影作品集、美食日记',
        color: '#9B59B6',
      },
      {
        id: 'timeline',
        name: '时间线',
        description: '按时间顺序展示，讲述故事',
        preview: 'https://images.unsplash.com/photo-1596748401458-0df74b2baf9b?w=400',
        features: ['时间轴', '故事性强', '顺序清晰'],
        suggestedFor: '成长记录、项目进展',
        color: '#3498DB',
      },
      {
        id: 'minimal',
        name: '极简主义',
        description: '留白美学，突出核心内容',
        preview: 'https://images.unsplash.com/photo-1674880809857-1883c95ef06a?w=400',
        features: ['大量留白', '聚焦内容', '优雅简约'],
        suggestedFor: '心情日记、读书笔记',
        color: '#2ECC71',
      },
      {
        id: 'collage',
        name: '拼贴画册',
        description: '多图拼贴，充满活力和创意',
        preview: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400',
        features: ['多图展示', '灵活布局', '创意十足'],
        suggestedFor: '活动回顾、聚会记录',
        color: '#F39C12',
      },
      {
        id: 'polaroid',
        name: '宝丽来相册',
        description: '复古拍立得风格，怀旧温馨',
        preview: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
        features: ['复古风格', '手写标注', '温暖怀旧'],
        suggestedFor: '童年回忆、家庭相册',
        color: '#E74C3C',
      },
    ],
    icons: {
      check: iconConfig.getIconPath('check', 'primary'),
      sparkles: iconConfig.getIconPath('sparkles', 'accent'),
      calendar: iconConfig.getIconPath('calendar', 'secondary')
    }
  },

  onLoad(options) {
    this.applyTheme();
    this.loadDiaries();
  },

  onShow() {
    this.applyTheme();
  },

  /**
   * 应用主题
   */
  applyTheme() {
    const app = getApp();
    if (app && app.globalData && app.globalData.cssVars) {
      this.setData({
        cssVars: app.globalData.cssVars
      });
    }
  },

  /**
   * 加载日记列表
   */
  async loadDiaries() {
    try {
      wx.showLoading({
        title: '加载中...'
      });

      const res = await api.get('/diaries', {
        page: 1,
        limit: 100
      });

      wx.hideLoading();

      if (res.success) {
        this.setData({
          diaries: res.data.diaries || []
        });
      }
    } catch (error) {
      wx.hideLoading();
      console.error('加载日记失败:', error);
      wx.showToast({
        title: '加载日记失败',
        icon: 'none'
      });
    }
  },

  /**
   * 标题输入
   */
  onTitleInput(e) {
    this.setData({
      title: e.detail.value
    });
  },

  /**
   * 描述输入
   */
  onDescriptionInput(e) {
    this.setData({
      description: e.detail.value
    });
  },

  /**
   * 选择模板
   */
  onTemplateSelect(e) {
    const templateId = e.currentTarget.dataset.id;
    this.setData({
      selectedTemplate: templateId
    });

    // 触觉反馈
    wx.vibrateShort({
      type: 'light'
    });
  },

  /**
   * 切换日记选中状态
   */
  onDiaryToggle(e) {
    const diaryId = e.currentTarget.dataset.id;
    const { selectedDiaries } = this.data;
    const index = selectedDiaries.indexOf(diaryId);

    if (index > -1) {
      // 已选中，取消选中
      selectedDiaries.splice(index, 1);
    } else {
      // 未选中，添加选中
      selectedDiaries.push(diaryId);
    }

    this.setData({
      selectedDiaries: selectedDiaries
    });

    // 触觉反馈
    wx.vibrateShort({
      type: 'light'
    });
  },

  /**
   * 创建图文集
   */
  async onCreate() {
    const { title, description, selectedTemplate, selectedDiaries } = this.data;

    // 验证
    if (!title) {
      wx.showToast({
        title: '请输入标题',
        icon: 'none'
      });
      return;
    }

    if (selectedDiaries.length === 0) {
      wx.showToast({
        title: '请至少选择一篇日记',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '创建中...',
      mask: true
    });

    try {
      const res = await api.post('/albums', {
        title,
        description,
        template: selectedTemplate,
        diaryIds: selectedDiaries
      });

      wx.hideLoading();

      if (res.success) {
        wx.showToast({
          title: '创建成功',
          icon: 'success',
          duration: 1500
        });

        // 触觉反馈
        wx.vibrateShort({
          type: 'heavy'
        });

        // 延迟返回
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      } else {
        wx.showToast({
          title: res.message || '创建失败',
          icon: 'none'
        });
      }
    } catch (error) {
      wx.hideLoading();
      console.error('创建图文集失败:', error);
      wx.showToast({
        title: '创建失败，请重试',
        icon: 'none'
      });
    }
  }
});
