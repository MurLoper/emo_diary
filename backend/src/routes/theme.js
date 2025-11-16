const express = require('express');
const router = express.Router();
const themeController = require('../controllers/themeController');
const { auth } = require('../middlewares/auth');
const { generalLimiter } = require('../middlewares/rateLimit');

/**
 * 主题路由
 */

// 应用限流
router.use(generalLimiter);

// 获取主题列表
router.get('/', auth, themeController.getThemes);

// 搜索主题
router.get('/search', auth, themeController.searchThemes);

// 获取当前主题
router.get('/current', auth, themeController.getCurrentTheme);

// 获取单个主题详情
router.get('/:themeId', auth, themeController.getThemeDetail);

// 解锁主题
router.post('/:themeId/unlock', auth, themeController.unlockTheme);

// 应用主题
router.post('/:themeId/apply', auth, themeController.applyTheme);

// 检查主题更新
router.get('/:themeId/check-update', auth, themeController.checkUpdate);

// 评分主题
router.post('/:themeId/rate', auth, themeController.rateTheme);

module.exports = router;
