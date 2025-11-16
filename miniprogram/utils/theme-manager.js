/**
 * 主题管理器 - 核心特色功能
 */

const api = require('./api');
const { getThemeById } = require('./theme-config');

class ThemeManager {
  constructor() {
    this.currentTheme = null;
    this.storageKey = 'theme_cache';
  }

  /**
   * 初始化主题系统
   */
  async init() {
    try {
      // 1. 从本地存储获取当前主题ID
      const savedThemeId = wx.getStorageSync('currentThemeId') || 'pink-girl';

      // 2. 从本地配置加载主题
      const localTheme = getThemeById(savedThemeId);

      // 3. 先应用本地主题（快速显示）
      this.applyLocalTheme(localTheme);

      // 4. 可选：从服务器同步主题配置（后台更新）
      try {
        const serverTheme = await api.get('/themes/current');
        if (serverTheme && serverTheme.data) {
          // 如果服务器有新配置，合并应用
          this.applyTheme(serverTheme.data);
        }
      } catch (apiError) {
        // 服务器请求失败不影响使用本地主题
        console.log('使用本地主题配置');
      }
    } catch (error) {
      console.error('主题初始化失败:', error);

      // 降级：应用默认主题
      this.applyDefaultTheme();
    }
  }

  /**
   * 应用本地主题配置
   */
  applyLocalTheme(themeConfig) {
    if (!themeConfig || !themeConfig.colors) {
      console.error('主题配置无效');
      return;
    }

    // 生成CSS变量（适配本地配置格式）
    const cssVars = {};
    const colors = themeConfig.colors;

    cssVars['--theme-primary'] = colors.primary;
    cssVars['--theme-secondary'] = colors.secondary;
    cssVars['--theme-accent'] = colors.accent;
    cssVars['--theme-background'] = colors.background;
    cssVars['--theme-surface'] = colors.surface;
    cssVars['--theme-text-primary'] = colors.textPrimary;
    cssVars['--theme-text-secondary'] = colors.textSecondary;
    cssVars['--theme-border'] = colors.border;

    // 注入到全局
    const app = getApp();
    if (app && app.globalData) {
      app.globalData.currentTheme = themeConfig;
      app.globalData.cssVars = cssVars;
      console.log('主题已应用:', themeConfig.name, cssVars);
    }

    this.currentTheme = themeConfig;

    // 通知所有页面更新
    this.notifyPagesUpdate(themeConfig);
  }

  /**
   * 加载主题
   */
  async loadTheme(theme) {
    try {
      wx.showLoading({ title: '正在切换主题...' });

      // 应用主题
      this.applyTheme(theme);

      // 保存到缓存
      wx.setStorageSync(this.storageKey, {
        theme,
        cachedAt: Date.now()
      });

      wx.hideLoading();
      wx.showToast({ title: '主题已切换', icon: 'success' });
    } catch (error) {
      console.error('加载主题失败:', error);
      wx.hideLoading();
      wx.showToast({ title: '主题加载失败', icon: 'none' });
    }
  }

  /**
   * 应用主题
   */
  applyTheme(theme) {
    this.currentTheme = theme;

    // 1. 生成 CSS 变量
    const cssVars = this.generateCSSVariables(theme.cssConfig || {});

    // 2. 注入到全局
    const app = getApp();
    if (app && app.globalData) {
      app.globalData.currentTheme = theme;
      app.globalData.cssVars = cssVars;
    }

    // 3. 通知所有页面更新
    this.notifyPagesUpdate(theme);
  }

  /**
   * 生成 CSS 变量
   */
  generateCSSVariables(cssConfig) {
    const vars = {};

    if (cssConfig.colors) {
      // 颜色变量
      vars['--theme-primary'] = cssConfig.colors.primary || '#FFB6C1';
      vars['--theme-secondary'] = cssConfig.colors.secondary || '#FFC0CB';
      vars['--theme-accent'] = cssConfig.colors.accent || '#FF69B4';

      // 背景：可能是渐变或纯色
      vars['--theme-background'] = cssConfig.colors.background || '#FFF5F7';
      vars['--theme-surface'] = cssConfig.colors.surface || '#FFFFFF';

      if (cssConfig.colors.text) {
        vars['--theme-text-primary'] = cssConfig.colors.text.primary || '#333333';
        vars['--theme-text-secondary'] = cssConfig.colors.text.secondary || '#999999';
        vars['--theme-text-disabled'] = cssConfig.colors.text.disabled || '#CCCCCC';
        vars['--theme-text-hint'] = cssConfig.colors.text.hint || '#CCCCCC';
      }

      vars['--theme-border'] = cssConfig.colors.border || 'rgba(0, 0, 0, 0.1)';
      vars['--theme-divider'] = cssConfig.colors.divider || 'rgba(0, 0, 0, 0.08)';
      vars['--theme-shadow'] = cssConfig.colors.shadow || 'rgba(0, 0, 0, 0.1)';
    }

    if (cssConfig.components) {
      // 组件变量
      if (cssConfig.components.card) {
        vars['--card-radius'] = cssConfig.components.card.borderRadius || '12px';
        vars['--card-padding'] = cssConfig.components.card.padding || '16px';
        vars['--card-shadow'] = cssConfig.components.card.shadow || '0 2px 8px rgba(0, 0, 0, 0.05)';
        vars['--card-background'] = cssConfig.components.card.background || '#FFFFFF';
      }

      if (cssConfig.components.button) {
        vars['--button-radius'] = cssConfig.components.button.borderRadius || '24px';
        vars['--button-padding'] = cssConfig.components.button.padding || '12px 24px';
        vars['--button-shadow'] = cssConfig.components.button.shadow || '0 2px 4px rgba(0, 0, 0, 0.1)';
      }
    }

    // 特效配置
    if (cssConfig.effects) {
      vars['--effect-card-shadow'] = cssConfig.effects.cardShadow || '0 8px 16px rgba(0, 0, 0, 0.1)';
      vars['--effect-card-radius'] = cssConfig.effects.cardRadius || '24px';
      vars['--effect-text-shadow'] = cssConfig.effects.textShadow || 'none';
      vars['--effect-button-glow'] = cssConfig.effects.buttonGlow || 'none';
      vars['--effect-button-gradient'] = cssConfig.effects.buttonGradient || '';
    }

    console.log('生成的 CSS 变量:', vars);

    return vars;
  }

  /**
   * 通知所有页面更新主题
   */
  notifyPagesUpdate(theme) {
    const pages = getCurrentPages();

    pages.forEach(page => {
      if (page.onThemeChange && typeof page.onThemeChange === 'function') {
        page.onThemeChange(theme);
      }
    });
  }

  /**
   * 检查是否需要更新
   */
  needUpdate(cached, latest) {
    if (!cached || !latest) return true;

    // 比较版本号或哈希值
    return cached.version !== latest.version ||
           (cached.resources && latest.resources &&
            cached.resources.hash !== latest.resources.hash);
  }

  /**
   * 应用默认主题
   */
  applyDefaultTheme() {
    const defaultTheme = {
      id: 'pink-girl',
      name: '粉色少女',
      cssConfig: {
        colors: {
          primary: '#FFB6C1',
          secondary: '#FFC0CB',
          accent: '#FF69B4',
          background: '#FFF5F7',
          surface: '#FFFFFF',
          text: {
            primary: '#333333',
            secondary: '#999999',
            disabled: '#CCCCCC'
          },
          border: 'rgba(255, 182, 193, 0.3)',
          shadow: 'rgba(255, 105, 180, 0.15)'
        },
        components: {
          card: {
            borderRadius: '12px',
            padding: '16px',
            shadow: '0 2px 8px rgba(255, 105, 180, 0.1)'
          },
          button: {
            borderRadius: '24px',
            padding: '12px 24px'
          }
        }
      }
    };

    this.applyTheme(defaultTheme);
  }

  /**
   * 切换主题（本地版本）
   */
  switchTheme(themeId) {
    try {
      const themeConfig = getThemeById(themeId);

      if (!themeConfig) {
        console.error('主题不存在:', themeId);
        return false;
      }

      // 应用主题
      this.applyLocalTheme(themeConfig);

      // 保存到本地存储
      wx.setStorageSync('currentThemeId', themeId);

      // 可选：同步到服务器
      api.post(`/themes/apply`, { themeId }).catch(err => {
        console.log('主题同步服务器失败（不影响使用）:', err);
      });

      wx.showToast({
        title: `已切换到${themeConfig.name}`,
        icon: 'success'
      });

      return true;
    } catch (error) {
      console.error('切换主题失败:', error);
      wx.showToast({
        title: '切换失败',
        icon: 'none'
      });
      return false;
    }
  }

  /**
   * 获取当前主题
   */
  getCurrentTheme() {
    return this.currentTheme;
  }

  /**
   * 清除缓存
   */
  clearCache() {
    wx.removeStorageSync(this.storageKey);
  }
}

// 导出单例
const themeManager = new ThemeManager();
module.exports = themeManager;
