// pages/diary/create/create.js
const app = getApp();
const api = require('../../../utils/api');
const iconConfig = require('../../../utils/iconConfig');

Page({
  data: {
    cssVars: {},
    title: '',
    content: '',
    images: [],
    selectedTags: [],
    tagCategories: {
      mood: ['开心', '快乐', '幸福', '满足', 'emo', '低落', '焦虑', '平静', '激动', '感动'],
      activity: ['日常', '美食', '旅行', '运动', '学习', '工作', '阅读', '看剧', '购物'],
      social: ['好友', '家人', '恋人', '独处', '聚会', '约会'],
      weather: ['晴天', '雨天', '阴天', '雪天', '多云']
    },
    currentDate: '',
    canSave: false,
    aiPolishing: false,
    saving: false,
    // 图标配置
    icons: {
      save: iconConfig.getIconPath('save', 'white'),
      close: iconConfig.getIconPath('x', 'white'),
      image: iconConfig.getIconPath('image', 'secondary'),
      sparkles: iconConfig.getIconPath('sparkles', 'accent'),
    }
  },

  onLoad(options) {
    // 应用主题
    this.applyTheme();

    // 设置当前日期
    this.setCurrentDate();

    // 加载草稿
    this.loadDraft();
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
   * 设置当前日期
   */
  setCurrentDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekday = weekdays[date.getDay()];

    this.setData({
      currentDate: `${year}年${month}月${day}日 ${weekday}`
    });
  },

  /**
   * 标题输入
   */
  onTitleInput(e) {
    this.setData({
      title: e.detail.value
    });
    this.checkCanSave();
    this.saveDraft();
  },

  /**
   * 内容输入
   */
  onContentInput(e) {
    this.setData({
      content: e.detail.value
    });
    this.checkCanSave();
    this.saveDraft();
  },

  /**
   * 检查是否可以保存
   */
  checkCanSave() {
    const { title, content } = this.data;
    this.setData({
      canSave: title.trim() !== '' && content.trim() !== ''
    });
  },

  /**
   * 选择图片
   */
  onChooseImage() {
    const maxImages = 9 - this.data.images.length;

    wx.chooseImage({
      count: maxImages,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePaths = res.tempFilePaths;

        // 上传图片
        this.uploadImages(tempFilePaths);
      }
    });
  },

  /**
   * 上传图片
   */
  async uploadImages(filePaths) {
    wx.showLoading({ title: '上传中...' });

    try {
      const uploadPromises = filePaths.map(filePath => {
        return api.uploadFile('/upload/image', filePath);
      });

      const results = await Promise.all(uploadPromises);

      const imageUrls = results
        .filter(res => res.success)
        .map(res => res.data.url);

      this.setData({
        images: [...this.data.images, ...imageUrls]
      });

      this.saveDraft();
      wx.hideLoading();

      if (imageUrls.length < filePaths.length) {
        wx.showToast({
          title: '部分图片上传失败',
          icon: 'none'
        });
      }
    } catch (error) {
      console.error('上传图片失败:', error);
      wx.hideLoading();
      wx.showToast({
        title: '上传失败',
        icon: 'none'
      });
    }
  },

  /**
   * 移除图片
   */
  onRemoveImage(e) {
    const index = e.currentTarget.dataset.index;
    const images = this.data.images.filter((_, i) => i !== index);

    this.setData({ images });
    this.saveDraft();
  },

  /**
   * 切换标签
   */
  onToggleTag(e) {
    const tag = e.currentTarget.dataset.tag;
    const { selectedTags } = this.data;

    const index = selectedTags.indexOf(tag);
    if (index > -1) {
      // 移除标签
      selectedTags.splice(index, 1);
    } else {
      // 添加标签
      selectedTags.push(tag);
    }

    this.setData({ selectedTags: [...selectedTags] });
    this.saveDraft();
  },

  /**
   * AI润色
   */
  async onAIPolish() {
    if (!this.data.content || this.data.aiPolishing) {
      return;
    }

    // 检查积分
    const userInfo = app.globalData.userInfo;
    if (!userInfo || userInfo.points < 10) {
      wx.showToast({
        title: '积分不足',
        icon: 'none'
      });
      return;
    }

    this.setData({ aiPolishing: true });

    try {
      // 调用AI润色API (这里模拟，实际需要后端API)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 模拟润色结果
      const polishedContent = this.data.content + '\n\n（AI优化版）' +
        '这是一个充满温馨与欢笑的时刻，每一帧都值得珍藏。';

      this.setData({
        content: polishedContent,
        aiPolishing: false
      });

      // 扣除积分（实际应该由后端处理）
      if (userInfo) {
        userInfo.points -= 10;
        app.globalData.userInfo = userInfo;
      }

      wx.showToast({
        title: 'AI润色成功',
        icon: 'success'
      });

      this.saveDraft();
    } catch (error) {
      console.error('AI润色失败:', error);
      this.setData({ aiPolishing: false });
      wx.showToast({
        title: '润色失败',
        icon: 'none'
      });
    }
  },

  /**
   * 保存草稿
   */
  saveDraft() {
    const { title, content, images, selectedTags } = this.data;

    wx.setStorageSync('diary_draft', {
      title,
      content,
      images,
      selectedTags,
      timestamp: Date.now()
    });
  },

  /**
   * 加载草稿
   */
  loadDraft() {
    try {
      const draft = wx.getStorageSync('diary_draft');
      if (draft && draft.timestamp) {
        // 检查草稿是否在24小时内
        const now = Date.now();
        const dayInMs = 24 * 60 * 60 * 1000;

        if (now - draft.timestamp < dayInMs) {
          wx.showModal({
            title: '发现草稿',
            content: '检测到未完成的日记，是否继续编辑？',
            success: (res) => {
              if (res.confirm) {
                this.setData({
                  title: draft.title || '',
                  content: draft.content || '',
                  images: draft.images || [],
                  selectedTags: draft.selectedTags || []
                });
                this.checkCanSave();
              } else {
                // 清除草稿
                wx.removeStorageSync('diary_draft');
              }
            }
          });
        } else {
          // 草稿过期，清除
          wx.removeStorageSync('diary_draft');
        }
      }
    } catch (error) {
      console.error('加载草稿失败:', error);
    }
  },

  /**
   * 保存日记
   */
  async onSave() {
    if (!this.data.canSave || this.data.saving) {
      return;
    }

    const { title, content, images, selectedTags } = this.data;

    this.setData({ saving: true });
    wx.showLoading({ title: '保存中...' });

    try {
      const res = await api.post('/diaries', {
        title,
        content,
        images,
        tags: selectedTags,
        date: new Date().toISOString()
      });

      if (res.success) {
        // 清除草稿
        wx.removeStorageSync('diary_draft');

        wx.hideLoading();
        wx.showToast({
          title: '保存成功',
          icon: 'success'
        });

        // 延迟返回
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      } else {
        throw new Error(res.message || '保存失败');
      }
    } catch (error) {
      console.error('保存日记失败:', error);
      wx.hideLoading();
      wx.showToast({
        title: error.message || '保存失败',
        icon: 'none'
      });
    } finally {
      this.setData({ saving: false });
    }
  },

  /**
   * 返回
   */
  onBack() {
    const { title, content, images } = this.data;

    // 检查是否有未保存的内容
    if (title || content || images.length > 0) {
      wx.showModal({
        title: '提示',
        content: '内容未保存，确定要离开吗？',
        success: (res) => {
          if (res.confirm) {
            wx.navigateBack();
          }
        }
      });
    } else {
      wx.navigateBack();
    }
  },

  /**
   * 页面卸载
   */
  onUnload() {
    // 保存草稿
    this.saveDraft();
  }
});
