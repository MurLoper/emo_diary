const { errorResponse } = require('../utils/response');
const { ERROR_CODES } = require('../config/constants');

/**
 * 全局错误处理中间件
 */
const errorHandler = (err, req, res, next) => {
  // 记录错误日志
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    user: req.userId || 'anonymous'
  });

  // Mongoose 验证错误
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));
    return errorResponse(res, '数据验证失败', 400, errors);
  }

  // Mongoose 转换错误
  if (err.name === 'CastError') {
    return errorResponse(res, '无效的ID格式', 400);
  }

  // MongoDB 唯一索引冲突
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return errorResponse(res, `${field} 已存在`, 409);
  }

  // JWT错误
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, '无效的令牌', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, '令牌已过期', 401);
  }

  // 业务逻辑错误
  if (err.statusCode) {
    return errorResponse(res, err.message, err.statusCode);
  }

  // 默认服务器错误
  return errorResponse(
    res,
    process.env.NODE_ENV === 'production' ? '服务器内部错误' : err.message,
    500
  );
};

/**
 * 404 处理
 */
const notFound = (req, res) => {
  return errorResponse(res, '请求的资源不存在', 404);
};

module.exports = { errorHandler, notFound };
