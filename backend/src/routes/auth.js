const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middlewares/auth');
const { strictLimiter } = require('../middlewares/rateLimit');

/**
 * 认证路由
 */

// 演示登录（仅开发环境）
router.post('/demo-login', authController.demoLogin);

// 微信登录
router.post('/wechat/login', strictLimiter, authController.wechatLogin);

// 刷新token
router.post('/refresh', auth, authController.refreshToken);

module.exports = router;
