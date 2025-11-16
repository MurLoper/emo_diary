const express = require('express');
const router = express.Router();
const rechargeController = require('../controllers/rechargeController');
const { auth } = require('../middlewares/auth');

/**
 * @route   POST /api/recharge/create-order
 * @desc    创建充值订单
 * @access  Private
 */
router.post('/create-order', auth, rechargeController.createOrder);

/**
 * @route   POST /api/recharge/verify-payment
 * @desc    验证支付结果
 * @access  Private
 */
router.post('/verify-payment', auth, rechargeController.verifyPayment);

/**
 * @route   GET /api/recharge/history
 * @desc    获取充值记录
 * @access  Private
 */
router.get('/history', auth, rechargeController.getRechargeHistory);

module.exports = router;
