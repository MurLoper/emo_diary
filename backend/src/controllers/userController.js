const User = require('../models/User');
const pointsService = require('../services/pointsService');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * 用户控制器
 */

/**
 * 获取用户信息
 */
exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).select('-__v');

    if (!user) {
      return errorResponse(res, '用户不存在', 404);
    }

    return successResponse(res, {
      id: user._id,
      nickname: user.nickname,
      avatar: user.avatar,
      gender: user.gender,
      memberLevel: user.memberLevel,
      memberExpireAt: user.memberExpireAt,
      points: user.points,
      totalPoints: user.totalPoints,
      checkIn: user.checkIn,
      currentThemeId: user.currentThemeId,
      ownedThemes: user.ownedThemes,
      stats: user.stats,
      settings: user.settings,
      createdAt: user.createdAt
    }, '获取用户信息成功');
  } catch (error) {
    next(error);
  }
};

/**
 * 更新用户信息
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { nickname, avatar, gender } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return errorResponse(res, '用户不存在', 404);
    }

    if (nickname) user.nickname = nickname;
    if (avatar) user.avatar = avatar;
    if (gender !== undefined) user.gender = gender;

    await user.save();

    return successResponse(res, {
      nickname: user.nickname,
      avatar: user.avatar,
      gender: user.gender
    }, '更新用户信息成功');
  } catch (error) {
    next(error);
  }
};

/**
 * 获取用户统计
 */
exports.getStats = async (req, res, next) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).select('stats checkIn points');

    if (!user) {
      return errorResponse(res, '用户不存在', 404);
    }

    return successResponse(res, {
      diaryCount: user.stats.diaryCount,
      albumCount: user.stats.albumCount,
      photoCount: user.stats.photoCount,
      points: user.points,
      continuousCheckInDays: user.checkIn.continuousDays,
      totalCheckInDays: user.checkIn.totalDays
    }, '获取用户统计成功');
  } catch (error) {
    next(error);
  }
};

/**
 * 更新用户设置
 */
exports.updateSettings = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { notifications, autoBackup, privacyMode } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return errorResponse(res, '用户不存在', 404);
    }

    if (notifications !== undefined) user.settings.notifications = notifications;
    if (autoBackup !== undefined) user.settings.autoBackup = autoBackup;
    if (privacyMode !== undefined) user.settings.privacyMode = privacyMode;

    await user.save();

    return successResponse(res, user.settings, '更新设置成功');
  } catch (error) {
    next(error);
  }
};

/**
 * 获取积分记录
 */
exports.getPointsRecords = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 20 } = req.query;

    const result = await pointsService.getPointsRecords(userId, page, limit);

    return successResponse(res, result, '获取积分记录成功');
  } catch (error) {
    next(error);
  }
};
