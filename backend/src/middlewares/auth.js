const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/response');
const User = require('../models/User');

/**
 * JWT 认证中间件
 */
const auth = async (req, res, next) => {
  try {
    // 从header获取token
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, '未提供认证令牌', 401);
    }

    const token = authHeader.substring(7);

    // 验证token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 查找用户
    const user = await User.findById(decoded.userId);

    if (!user) {
      return errorResponse(res, '用户不存在', 401);
    }

    if (user.status === 'banned') {
      return errorResponse(res, '账号已被封禁', 403);
    }

    if (user.status === 'deleted') {
      return errorResponse(res, '账号已被删除', 403);
    }

    // 将用户信息附加到请求对象
    req.user = user;
    req.userId = user._id;

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, '无效的令牌', 401);
    }
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, '令牌已过期', 401);
    }
    return errorResponse(res, '认证失败', 401);
  }
};

/**
 * 可选认证中间件（用于支持游客访问的接口）
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);

      if (user && user.status === 'active') {
        req.user = user;
        req.userId = user._id;
      }
    }

    next();
  } catch (error) {
    // 认证失败不影响继续执行
    next();
  }
};

module.exports = { auth, optionalAuth };
