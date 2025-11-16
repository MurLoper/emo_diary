const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * 认证控制器
 */

/**
 * 微信登录
 */
exports.wechatLogin = async (req, res, next) => {
  try {
    const { code, userInfo } = req.body;

    if (!code) {
      return errorResponse(res, '缺少code参数', 400);
    }

    // 调用微信接口获取openid
    const wxResponse = await axios.get('https://api.weixin.qq.com/sns/jscode2session', {
      params: {
        appid: process.env.WECHAT_APPID,
        secret: process.env.WECHAT_SECRET,
        js_code: code,
        grant_type: 'authorization_code'
      }
    });

    const { openid, unionid, session_key, errcode, errmsg } = wxResponse.data;

    if (errcode) {
      return errorResponse(res, `微信登录失败: ${errmsg}`, 400);
    }

    // 查找或创建用户
    let user = await User.findOne({ openid });

    if (!user) {
      // 创建新用户
      user = await User.create({
        openid,
        unionid,
        nickname: userInfo?.nickname || '日记用户',
        avatar: userInfo?.avatar || '',
        gender: userInfo?.gender || 0,
        ownedThemes: [
          {
            themeId: 'pink-girl', // 默认主题
            unlockMethod: 'default',
            unlockedAt: new Date()
          }
        ]
      });
    } else {
      // 更新用户信息
      if (userInfo) {
        user.nickname = userInfo.nickname || user.nickname;
        user.avatar = userInfo.avatar || user.avatar;
        user.gender = userInfo.gender !== undefined ? userInfo.gender : user.gender;
      }
      user.lastLoginAt = new Date();
      await user.save();
    }

    // 生成JWT token
    const token = jwt.sign(
      { userId: user._id, openid: user.openid },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return successResponse(res, {
      token,
      user: {
        id: user._id,
        nickname: user.nickname,
        avatar: user.avatar,
        points: user.points,
        memberLevel: user.memberLevel,
        currentThemeId: user.currentThemeId
      }
    }, '登录成功');
  } catch (error) {
    next(error);
  }
};

/**
 * 刷新token
 */
exports.refreshToken = async (req, res, next) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return errorResponse(res, '用户不存在', 404);
    }

    // 生成新token
    const token = jwt.sign(
      { userId: user._id, openid: user.openid },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return successResponse(res, { token }, 'Token刷新成功');
  } catch (error) {
    next(error);
  }
};

/**
 * 演示登录（仅开发环境）
 */
exports.demoLogin = async (req, res, next) => {
  try {
    const { nickname = '演示用户' } = req.body;
    const demoOpenid = 'demo_user_001';

    // 查找或创建演示用户
    let user = await User.findOne({ openid: demoOpenid });

    if (!user) {
      // 创建演示用户
      user = await User.create({
        openid: demoOpenid,
        nickname,
        avatar: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
        gender: 0,
        points: 100,
        coins: 50,
        checkIn: {
          continuousDays: 3,
          totalDays: 10,
          lastCheckInDate: new Date()
        },
        ownedThemes: [
          {
            themeId: 'pink-girl',
            unlockMethod: 'default',
            unlockedAt: new Date()
          },
          {
            themeId: 'blue-ocean',
            unlockMethod: 'signin',
            unlockedAt: new Date()
          }
        ],
        currentThemeId: 'pink-girl'
      });
    } else {
      user.lastLoginAt = new Date();
      await user.save();
    }

    // 生成JWT token
    const token = jwt.sign(
      { userId: user._id, openid: user.openid },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return successResponse(res, {
      token,
      user: {
        id: user._id,
        nickname: user.nickname,
        avatar: user.avatar,
        points: user.points,
        coins: user.coins,
        memberLevel: user.memberLevel,
        currentThemeId: user.currentThemeId
      }
    }, '演示登录成功');
  } catch (error) {
    next(error);
  }
};
