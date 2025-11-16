const themeService = require('../services/themeService');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');

/**
 * 主题控制器
 */

/**
 * 获取主题列表
 */
exports.getThemes = async (req, res, next) => {
  try {
    const { platform = 'wechat', page = 1, limit = 20 } = req.query;
    const userId = req.userId;

    const result = await themeService.getAvailableThemes(userId, platform, page, limit);

    return paginatedResponse(
      res,
      result.themes,
      result.total,
      result.page,
      result.limit,
      '获取主题列表成功'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * 获取单个主题详情
 */
exports.getThemeDetail = async (req, res, next) => {
  try {
    const { themeId } = req.params;
    const { platform = 'wechat' } = req.query;

    const theme = await themeService.getThemeDetail(themeId, platform);

    return successResponse(res, theme, '获取主题详情成功');
  } catch (error) {
    next(error);
  }
};

/**
 * 解锁主题
 */
exports.unlockTheme = async (req, res, next) => {
  try {
    const { themeId } = req.params;
    const { method } = req.body; // 'points' or 'signin' or 'purchase'
    const userId = req.userId;

    const result = await themeService.unlockTheme(userId, themeId, method);

    return successResponse(res, result, '主题解锁成功');
  } catch (error) {
    next(error);
  }
};

/**
 * 应用主题
 */
exports.applyTheme = async (req, res, next) => {
  try {
    const { themeId } = req.params;
    const userId = req.userId;

    const result = await themeService.applyTheme(userId, themeId);

    return successResponse(res, result, '主题应用成功');
  } catch (error) {
    next(error);
  }
};

/**
 * 检查主题更新
 */
exports.checkUpdate = async (req, res, next) => {
  try {
    const { themeId } = req.params;
    const { hash, platform = 'wechat' } = req.query;

    const result = await themeService.checkThemeUpdate(themeId, hash, platform);

    return successResponse(res, result, '检查更新成功');
  } catch (error) {
    next(error);
  }
};

/**
 * 获取用户当前主题
 */
exports.getCurrentTheme = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { platform = 'wechat' } = req.query;

    const theme = await themeService.getCurrentTheme(userId, platform);

    return successResponse(res, theme, '获取当前主题成功');
  } catch (error) {
    next(error);
  }
};

/**
 * 评分主题
 */
exports.rateTheme = async (req, res, next) => {
  try {
    const { themeId } = req.params;
    const { rating } = req.body;
    const userId = req.userId;

    const result = await themeService.rateTheme(userId, themeId, rating);

    return successResponse(res, result, '评分成功');
  } catch (error) {
    next(error);
  }
};

/**
 * 搜索主题
 */
exports.searchThemes = async (req, res, next) => {
  try {
    const { keyword, platform = 'wechat' } = req.query;

    if (!keyword) {
      return errorResponse(res, '请提供搜索关键词', 400);
    }

    const themes = await themeService.searchThemes(keyword, platform);

    return successResponse(res, themes, '搜索成功');
  } catch (error) {
    next(error);
  }
};
