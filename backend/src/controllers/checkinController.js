const User = require('../models/User');
const CheckIn = require('../models/CheckIn');
const pointsService = require('../services/pointsService');
const cacheService = require('../services/cacheService');
const themeService = require('../services/themeService');
const { successResponse, errorResponse } = require('../utils/response');
const { CHECKIN_BONUS, CHECKIN_THEME_UNLOCK } = require('../config/constants');

/**
 * 签到控制器
 */

/**
 * 签到
 */
exports.checkIn = async (req, res, next) => {
  try {
    const userId = req.userId;
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // 检查今天是否已签到
    const existingCheckIn = await CheckIn.findOne({ userId, date: today });
    if (existingCheckIn) {
      return errorResponse(res, '今日已签到', 400);
    }

    const user = await User.findById(userId);

    // 计算连续签到天数
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let continuousDays = 1;

    if (user.checkIn.lastCheckInDate) {
      const lastCheckInDate = new Date(user.checkIn.lastCheckInDate).toISOString().split('T')[0];

      if (lastCheckInDate === yesterdayStr) {
        // 连续签到
        continuousDays = user.checkIn.continuousDays + 1;
      }
      // 如果不是昨天，则重新开始计数（continuousDays = 1）
    }

    // 计算奖励
    const pointsReward = await pointsService.checkinReward(userId, continuousDays);

    // 检查是否解锁新主题
    const unlockedThemes = [];
    for (const [themeId, requiredDays] of Object.entries(CHECKIN_THEME_UNLOCK)) {
      if (continuousDays === requiredDays && !user.hasTheme(themeId)) {
        user.addTheme(themeId, 'signin');
        unlockedThemes.push({
          type: 'theme',
          itemId: themeId,
          itemName: themeId
        });
      }
    }

    // 创建签到记录
    await CheckIn.create({
      userId,
      date: today,
      continuousDays,
      rewards: {
        points: pointsReward.basePoints,
        bonusPoints: pointsReward.bonusPoints,
        items: unlockedThemes
      }
    });

    // 更新用户签到信息
    user.checkIn.lastCheckInDate = new Date();
    user.checkIn.continuousDays = continuousDays;
    user.checkIn.totalDays += 1;
    await user.save();

    // 计算下一个奖励
    let nextReward = null;
    const milestones = [7, 30, 100];
    for (const milestone of milestones) {
      if (continuousDays < milestone) {
        nextReward = {
          days: milestone - continuousDays,
          points: CHECKIN_BONUS[milestone] || 0,
          items: []
        };
        break;
      }
    }

    return successResponse(res, {
      continuousDays,
      totalDays: user.checkIn.totalDays,
      rewards: {
        points: pointsReward.basePoints,
        bonusPoints: pointsReward.bonusPoints,
        totalPoints: pointsReward.totalPoints,
        items: unlockedThemes
      },
      nextReward
    }, '签到成功');
  } catch (error) {
    next(error);
  }
};

/**
 * 获取签到日历
 */
exports.getCheckInCalendar = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { year, month } = req.query;

    if (!year || !month) {
      return errorResponse(res, '缺少year或month参数', 400);
    }

    // 获取指定月份的签到记录
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0).toISOString().split('T')[0]; // 月末

    const checkIns = await CheckIn.find({
      userId,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ date: 1 });

    const calendar = checkIns.map(checkIn => ({
      date: checkIn.date,
      continuousDays: checkIn.continuousDays,
      rewards: checkIn.rewards
    }));

    return successResponse(res, {
      year: parseInt(year),
      month: parseInt(month),
      checkIns: calendar,
      totalDays: calendar.length
    }, '获取签到日历成功');
  } catch (error) {
    next(error);
  }
};

/**
 * 获取签到状态
 */
exports.getCheckInStatus = async (req, res, next) => {
  try {
    const userId = req.userId;
    const today = new Date().toISOString().split('T')[0];

    const user = await User.findById(userId).select('checkIn');
    const todayCheckIn = await CheckIn.findOne({ userId, date: today });

    return successResponse(res, {
      hasCheckedInToday: !!todayCheckIn,
      continuousDays: user.checkIn.continuousDays,
      totalDays: user.checkIn.totalDays,
      lastCheckInDate: user.checkIn.lastCheckInDate
    }, '获取签到状态成功');
  } catch (error) {
    next(error);
  }
};
