const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth } = require('../middlewares/auth');

/**
 * 用户路由
 */

// 获取用户信息
router.get('/profile', auth, userController.getProfile);

// 更新用户信息
router.put('/profile', auth, userController.updateProfile);

// 获取用户统计
router.get('/stats', auth, userController.getStats);

// 更新用户设置
router.put('/settings', auth, userController.updateSettings);

// 获取积分记录
router.get('/points/records', auth, userController.getPointsRecords);

module.exports = router;
