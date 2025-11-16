const User = require('../models/User');
const PointsRecord = require('../models/PointsRecord');
const { POINTS_RULES } = require('../config/constants');

/**
 * 积分服务
 */
class PointsService {
  /**
   * 增加积分
   */
  async addPoints(userId, amount, source, description = '', relatedId = null) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('用户不存在');
    }

    user.points += amount;
    user.totalPoints += amount;
    await user.save();

    // 创建积分记录
    await PointsRecord.create({
      userId,
      type: 'earn',
      source,
      amount,
      balance: user.points,
      description,
      relatedId
    });

    return {
      points: user.points,
      added: amount
    };
  }

  /**
   * 扣除积分
   */
  async deductPoints(userId, amount, source, description = '', relatedId = null) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('用户不存在');
    }

    if (user.points < amount) {
      throw new Error('积分不足');
    }

    user.points -= amount;
    await user.save();

    // 创建积分记录
    await PointsRecord.create({
      userId,
      type: 'spend',
      source,
      amount,
      balance: user.points,
      description,
      relatedId
    });

    return {
      points: user.points,
      spent: amount
    };
  }

  /**
   * 获取积分记录
   */
  async getPointsRecords(userId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      PointsRecord.find({ userId })
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      PointsRecord.countDocuments({ userId })
    ]);

    return {
      records,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  /**
   * 签到奖励积分
   */
  async checkinReward(userId, continuousDays) {
    const basePoints = POINTS_RULES.CHECKIN;

    // 计算连续签到奖励
    let bonusPoints = 0;
    if (continuousDays % 100 === 0) {
      bonusPoints = 500;
    } else if (continuousDays % 30 === 0) {
      bonusPoints = 100;
    } else if (continuousDays % 7 === 0) {
      bonusPoints = 20;
    }

    const totalPoints = basePoints + bonusPoints;

    await this.addPoints(
      userId,
      totalPoints,
      'checkin',
      `签到奖励 (连续${continuousDays}天)`
    );

    return {
      basePoints,
      bonusPoints,
      totalPoints
    };
  }

  /**
   * 日记创建奖励
   */
  async diaryReward(userId, diaryId) {
    const points = POINTS_RULES.CREATE_DIARY;
    await this.addPoints(
      userId,
      points,
      'create_diary',
      '创建日记奖励',
      diaryId
    );
    return points;
  }

  /**
   * 图文集创建奖励
   */
  async albumReward(userId, albumId) {
    const points = POINTS_RULES.CREATE_ALBUM;
    await this.addPoints(
      userId,
      points,
      'create_album',
      '创建图文集奖励',
      albumId
    );
    return points;
  }

  /**
   * 获取用户积分余额
   */
  async getBalance(userId) {
    const user = await User.findById(userId).select('points totalPoints');
    if (!user) {
      throw new Error('用户不存在');
    }

    return {
      points: user.points,
      totalPoints: user.totalPoints
    };
  }

  /**
   * 积分统计
   */
  async getStats(userId) {
    const [user, earnRecords, spendRecords] = await Promise.all([
      User.findById(userId).select('points totalPoints'),
      PointsRecord.aggregate([
        { $match: { userId: userId, type: 'earn' } },
        {
          $group: {
            _id: '$source',
            count: { $sum: 1 },
            total: { $sum: '$amount' }
          }
        }
      ]),
      PointsRecord.aggregate([
        { $match: { userId: userId, type: 'spend' } },
        {
          $group: {
            _id: '$source',
            count: { $sum: 1 },
            total: { $sum: '$amount' }
          }
        }
      ])
    ]);

    return {
      balance: user.points,
      totalEarned: user.totalPoints,
      totalSpent: user.totalPoints - user.points,
      earnSources: earnRecords,
      spendSources: spendRecords
    };
  }
}

module.exports = new PointsService();
