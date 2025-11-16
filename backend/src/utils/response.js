/**
 * 统一响应格式
 */

/**
 * 成功响应
 */
const successResponse = (res, data = null, message = 'Success', code = 200) => {
  return res.status(code).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

/**
 * 错误响应
 */
const errorResponse = (res, message = 'Error', code = 500, errors = null) => {
  return res.status(code).json({
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString()
  });
};

/**
 * 分页响应
 */
const paginatedResponse = (res, data, total, page, limit, message = 'Success') => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    },
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse
};
