const express = require('express');
const router = express.Router();
const diaryController = require('../controllers/diaryController');
const { auth } = require('../middlewares/auth');

/**
 * 日记路由
 */

// 获取日记列表
router.get('/', auth, diaryController.getDiaries);

// 获取日记统计
router.get('/stats', auth, diaryController.getDiaryStats);

// 获取单条日记
router.get('/:id', auth, diaryController.getDiary);

// 创建日记
router.post('/', auth, diaryController.createDiary);

// AI润色
router.post('/polish', auth, diaryController.polishDiary);

// 更新日记
router.put('/:id', auth, diaryController.updateDiary);

// 删除日记
router.delete('/:id', auth, diaryController.deleteDiary);

module.exports = router;
