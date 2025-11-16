const Theme = require('../models/Theme');
const User = require('../models/User');
const cacheService = require('./cacheService');
const pointsService = require('./pointsService');
const crypto = require('crypto');

/**
 * 主题服务 - 核心特色功能
 */
class ThemeService {
  /**
   * 将主题颜色配置扁平化，供前端直接使用
   */
  flattenColors(cssConfig) {
    if (!cssConfig || !cssConfig.colors) {
      return {};
    }

    const colors = cssConfig.colors;
    const flatColors = {
      primary: colors.primary,
      secondary: colors.secondary,
      accent: colors.accent,
      background: colors.background,
      surface: colors.surface,
      border: colors.border,
      divider: colors.divider,
      shadow: colors.shadow,
      error: colors.error,
      success: colors.success,
      warning: colors.warning,
      info: colors.info
    };

    // 扁平化 text 对象
    if (colors.text) {
      flatColors.textPrimary = colors.text.primary;
      flatColors.textSecondary = colors.text.secondary;
      flatColors.textDisabled = colors.text.disabled;
      flatColors.textHint = colors.text.hint;
    }

    return flatColors;
  }

  /**
   * 获取用户可用主题列表
   */
  async getAvailableThemes(userId, platform = 'wechat', page = 1, limit = 20) {
    const cacheKey = `themes:${platform}:${userId}:${page}`;

    // 尝试从缓存获取
    let result = await cacheService.get(cacheKey);
    if (result) {
      return result;
    }

    // 从数据库查询
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('用户不存在');
    }

    const skip = (page - 1) * limit;

    const [allThemes, total] = await Promise.all([
      Theme.find({
        status: 'active',
        [`resources.platforms.${platform}`]: { $exists: true }
      })
        .select('id name description category preview unlockMethod stats featured tags cssConfig')
        .sort({ featured: -1, 'stats.activeUsers': -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Theme.countDocuments({
        status: 'active',
        [`resources.platforms.${platform}`]: { $exists: true }
      })
    ]);

    const themes = allThemes.map(theme => {
      const isOwned = this.checkThemeOwnership(user, theme.id) || theme.category === 'free';
      return {
        id: theme.id,
        name: theme.name,
        description: theme.description,
        category: theme.category,
        preview: theme.preview,
        unlockMethod: theme.unlockMethod,
        stats: theme.stats,
        featured: theme.featured,
        tags: theme.tags,
        colors: this.flattenColors(theme.cssConfig),
        isOwned,
        isActive: user.currentThemeId === theme.id
      };
    });

    result = {
      themes,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };

    // 缓存30分钟
    await cacheService.set(cacheKey, result, 1800);

    return result;
  }

  /**
   * 获取主题完整配置
   */
  async getThemeDetail(themeId, platform = 'wechat') {
    const cacheKey = `theme:detail:${themeId}:${platform}`;

    let theme = await cacheService.get(cacheKey);
    if (theme) {
      return theme;
    }

    const themeDoc = await Theme.findOne({ id: themeId, status: 'active' });
    if (!themeDoc) {
      throw new Error('主题不存在');
    }

    // 构建响应数据
    const platformResource = themeDoc.resources?.platforms?.[platform];

    const result = {
      id: themeDoc.id,
      name: themeDoc.name,
      description: themeDoc.description,
      category: themeDoc.category,
      cssConfig: themeDoc.cssConfig,
      colors: this.flattenColors(themeDoc.cssConfig), // 添加扁平化颜色供前端使用
      resources: {
        cssUrl: platformResource?.cssUrl,
        version: platformResource?.version,
        hash: platformResource?.hash,
        backgroundImages: themeDoc.resources?.backgroundImages || [],
        decorationImages: themeDoc.resources?.decorationImages || []
      },
      version: themeDoc.version
    };

    // 缓存1小时
    await cacheService.set(cacheKey, result, 3600);

    return result;
  }

  /**
   * 解锁主题
   */
  async unlockTheme(userId, themeId, method) {
    const user = await User.findById(userId);
    const theme = await Theme.findOne({ id: themeId });

    if (!theme) {
      throw new Error('主题不存在');
    }

    // 检查是否已拥有
    if (this.checkThemeOwnership(user, themeId) || theme.category === 'free') {
      throw new Error('已拥有该主题');
    }

    // 验证解锁方式
    if (method === 'points') {
      if (theme.unlockMethod.type !== 'points') {
        throw new Error('该主题不支持积分解锁');
      }

      const cost = theme.unlockMethod.pointsCost;
      if (user.points < cost) {
        throw new Error('积分不足');
      }

      // 扣除积分
      await pointsService.deductPoints(
        userId,
        cost,
        'purchase_theme',
        `解锁主题: ${theme.name}`,
        theme._id
      );
    } else if (method === 'signin') {
      if (theme.unlockMethod.type !== 'signin') {
        throw new Error('该主题不支持签到解锁');
      }

      const requiredDays = theme.unlockMethod.signinDays;
      if (user.checkIn.continuousDays < requiredDays) {
        throw new Error(`需要连续签到${requiredDays}天`);
      }
    } else if (method === 'purchase') {
      if (theme.unlockMethod.type !== 'purchase') {
        throw new Error('该主题不支持购买');
      }
      // 这里应该对接支付系统
      // 暂时跳过支付验证
    }

    // 添加到用户的主题列表
    user.addTheme(themeId, method);
    await user.save();

    // 更新主题统计
    await Theme.updateOne(
      { id: themeId },
      { $inc: { 'stats.downloadCount': 1, 'stats.activeUsers': 1 } }
    );

    // 清除缓存
    await cacheService.del(`themes:*:${userId}:*`);

    return {
      success: true,
      theme: {
        id: theme.id,
        name: theme.name
      }
    };
  }

  /**
   * 应用主题
   */
  async applyTheme(userId, themeId) {
    const user = await User.findById(userId);

    // 检查主题是否存在
    const theme = await Theme.findOne({ id: themeId, status: 'active' });
    if (!theme) {
      throw new Error('主题不存在');
    }

    // 检查是否拥有
    if (!this.checkThemeOwnership(user, themeId) && theme.category !== 'free') {
      throw new Error('未拥有该主题');
    }

    // 更新旧主题统计
    if (user.currentThemeId && user.currentThemeId !== themeId) {
      await Theme.updateOne(
        { id: user.currentThemeId },
        { $inc: { 'stats.activeUsers': -1 } }
      );
    }

    // 更新用户当前主题
    user.currentThemeId = themeId;
    await user.save();

    // 更新新主题统计
    await Theme.updateOne(
      { id: themeId },
      { $inc: { 'stats.activeUsers': 1 } }
    );

    // 清除缓存
    await cacheService.del(`themes:*:${userId}:*`);

    return {
      success: true,
      theme: await this.getThemeDetail(themeId)
    };
  }

  /**
   * 检查主题更新
   */
  async checkThemeUpdate(themeId, currentHash, platform = 'wechat') {
    const theme = await Theme.findOne({ id: themeId });
    if (!theme) {
      return { hasUpdate: false };
    }

    const latestHash = theme.resources?.platforms?.[platform]?.hash;
    const latestVersion = theme.resources?.platforms?.[platform]?.version;

    return {
      hasUpdate: latestHash !== currentHash,
      currentHash,
      latestHash,
      version: latestVersion,
      changelog: theme.changelog
    };
  }

  /**
   * 检查主题所有权
   */
  checkThemeOwnership(user, themeId) {
    return user.hasTheme(themeId);
  }

  /**
   * 生成主题CSS文件的哈希值
   */
  generateThemeHash(cssContent) {
    return crypto.createHash('md5').update(cssContent).digest('hex');
  }

  /**
   * 获取用户当前主题
   */
  async getCurrentTheme(userId, platform = 'wechat') {
    const user = await User.findById(userId).select('currentThemeId');
    if (!user || !user.currentThemeId) {
      // 返回默认主题
      return await this.getThemeDetail('pink-girl', platform);
    }

    return await this.getThemeDetail(user.currentThemeId, platform);
  }

  /**
   * 评分主题
   */
  async rateTheme(userId, themeId, rating) {
    if (rating < 1 || rating > 5) {
      throw new Error('评分必须在1-5之间');
    }

    const theme = await Theme.findOne({ id: themeId });
    if (!theme) {
      throw new Error('主题不存在');
    }

    // 计算新的平均分
    const totalRating = theme.stats.rating * theme.stats.ratingCount;
    const newRatingCount = theme.stats.ratingCount + 1;
    const newAvgRating = (totalRating + rating) / newRatingCount;

    theme.stats.rating = Math.round(newAvgRating * 10) / 10; // 保留一位小数
    theme.stats.ratingCount = newRatingCount;
    await theme.save();

    // 清除缓存
    await cacheService.del(`theme:detail:${themeId}:*`);

    return {
      rating: theme.stats.rating,
      ratingCount: theme.stats.ratingCount
    };
  }

  /**
   * 搜索主题
   */
  async searchThemes(keyword, platform = 'wechat') {
    const themes = await Theme.find({
      status: 'active',
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { tags: { $in: [new RegExp(keyword, 'i')] } }
      ]
    })
      .select('id name description category preview unlockMethod stats tags')
      .limit(20)
      .lean();

    return themes;
  }
}

module.exports = new ThemeService();
