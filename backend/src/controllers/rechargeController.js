const User = require('../models/User');
const RechargeOrder = require('../models/RechargeOrder');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * 创建充值订单
 */
exports.createOrder = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { packageId, coins, bonus, price } = req.body;

    // 验证必需字段
    if (!packageId || !coins || price === undefined) {
      return errorResponse(res, '充值信息不完整', 400);
    }

    // 创建订单
    const order = await RechargeOrder.create({
      userId,
      packageId,
      coins,
      bonus: bonus || 0,
      totalCoins: coins + (bonus || 0),
      price,
      status: 'pending'
    });

    // 在实际生产环境中，这里应该调用微信支付API生成prepay_id
    // 这里仅为开发环境模拟返回
    const prepayParams = {
      timeStamp: Math.floor(Date.now() / 1000).toString(),
      nonceStr: Math.random().toString(36).substring(2, 15),
      package: `prepay_id=${order._id}`,
      signType: 'RSA',
      paySign: 'mock_pay_sign_' + order._id
    };

    return successResponse(res, {
      orderId: order._id,
      prepayParams
    }, '创建订单成功', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * 验证支付结果
 */
exports.verifyPayment = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { orderId } = req.body;

    if (!orderId) {
      return errorResponse(res, '订单ID不能为空', 400);
    }

    // 查找订单
    const order = await RechargeOrder.findOne({ _id: orderId, userId });

    if (!order) {
      return errorResponse(res, '订单不存在', 404);
    }

    if (order.status === 'paid') {
      return errorResponse(res, '订单已支付，请勿重复操作', 400);
    }

    // 在实际生产环境中，这里应该调用微信支付API验证支付结果
    // 这里仅为开发环境，直接标记为已支付

    // 更新订单状态
    order.status = 'paid';
    order.paidAt = new Date();
    await order.save();

    // 更新用户心晴币余额
    const user = await User.findById(userId);
    if (!user) {
      return errorResponse(res, '用户不存在', 404);
    }

    user.coins = (user.coins || 0) + order.totalCoins;
    await user.save();

    return successResponse(res, {
      coins: user.coins,
      addedCoins: order.totalCoins
    }, '充值成功');
  } catch (error) {
    next(error);
  }
};

/**
 * 获取充值记录
 */
exports.getRechargeHistory = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;

    const orders = await RechargeOrder.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await RechargeOrder.countDocuments({ userId });

    return successResponse(res, {
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};
