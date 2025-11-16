const mongoose = require('mongoose');

const rechargeOrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  packageId: {
    type: Number,
    required: true
  },
  coins: {
    type: Number,
    required: true
  },
  bonus: {
    type: Number,
    default: 0
  },
  totalCoins: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'cancelled'],
    default: 'pending',
    index: true
  },
  paidAt: {
    type: Date
  },
  transactionId: {
    type: String
  }
}, {
  timestamps: true
});

// 创建复合索引
rechargeOrderSchema.index({ userId: 1, createdAt: -1 });
rechargeOrderSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('RechargeOrder', rechargeOrderSchema);
