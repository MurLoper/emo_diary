const express = require('express');
const router = express.Router();
const checkinController = require('../controllers/checkinController');
const { auth } = require('../middlewares/auth');

/**
 * 签到路由
 */

// 签到
router.post('/', auth, checkinController.checkIn);

// 获取签到日历
router.get('/calendar', auth, checkinController.getCheckInCalendar);

// 获取签到状态
router.get('/status', auth, checkinController.getCheckInStatus);

module.exports = router;
