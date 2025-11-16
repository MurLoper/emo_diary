const api = require('../../utils/api');
const iconConfig = require('../../utils/iconConfig');

Page({
  data: {
    cssVars: {},
    userCoins: 0,
    selectedPackage: null,
    selectedPackagePrice: 0,
    packages: [
      {
        id: 1,
        coins: 60,
        price: 6,
        bonus: 0,
        label: '入门包',
        iconText: 'coins',
        hot: false,
        vip: false
      },
      {
        id: 2,
        coins: 180,
        price: 18,
        bonus: 20,
        label: '超值包',
        iconText: 'zap',
        hot: true,
        vip: false
      },
      {
        id: 3,
        coins: 320,
        price: 30,
        bonus: 50,
        label: '优惠包',
        iconText: 'gift',
        hot: false,
        vip: false
      },
      {
        id: 4,
        coins: 680,
        price: 60,
        bonus: 120,
        label: '豪华包',
        iconText: 'crown',
        hot: false,
        vip: false
      },
      {
        id: 5,
        coins: 1280,
        price: 108,
        bonus: 320,
        label: '至尊包',
        iconText: 'crown',
        hot: false,
        vip: false
      },
      {
        id: 6,
        coins: 3280,
        price: 258,
        bonus: 1000,
        label: 'VIP包',
        iconText: 'crown',
        hot: false,
        vip: true
      },
    ],
    icons: {
      creditCard: iconConfig.getIconPath('creditCard', 'primary'),
      dollarSign: iconConfig.getIconPath('dollarSign', 'accent'),
      zap: iconConfig.getIconPath('zap', 'accent'),
      crown: iconConfig.getIconPath('crown', 'accent')
    }
  },

  onLoad(options) {
    this.applyTheme();
    this.loadUserCoins();
  },

  onShow() {
    this.applyTheme();
  },

  /**
   * 应用主题
   */
  applyTheme() {
    const app = getApp();
    if (app && app.globalData && app.globalData.cssVars) {
      this.setData({
        cssVars: app.globalData.cssVars
      });
    }
  },

  /**
   * 加载用户心晴币余额
   */
  async loadUserCoins() {
    try {
      const res = await api.get('/user/profile');
      if (res.success) {
        this.setData({
          userCoins: res.data.user.coins || 0
        });
      }
    } catch (error) {
      console.error('加载用户余额失败:', error);
      wx.showToast({
        title: '加载余额失败',
        icon: 'none'
      });
    }
  },

  /**
   * 选择充值套餐
   */
  onPackageSelect(e) {
    const packageId = e.currentTarget.dataset.id;
    const selectedPkg = this.data.packages.find(pkg => pkg.id === packageId);

    this.setData({
      selectedPackage: packageId,
      selectedPackagePrice: selectedPkg ? selectedPkg.price : 0
    });

    // 触觉反馈
    wx.vibrateShort({
      type: 'light'
    });
  },

  /**
   * 发起购买
   */
  async onPurchase() {
    if (!this.data.selectedPackage) {
      wx.showToast({
        title: '请选择充值套餐',
        icon: 'none'
      });
      return;
    }

    const selectedPkg = this.data.packages.find(pkg => pkg.id === this.data.selectedPackage);
    if (!selectedPkg) {
      return;
    }

    wx.showLoading({
      title: '正在创建订单...',
      mask: true
    });

    try {
      // 创建充值订单
      const orderRes = await api.post('/recharge/create-order', {
        packageId: selectedPkg.id,
        coins: selectedPkg.coins,
        bonus: selectedPkg.bonus,
        price: selectedPkg.price
      });

      wx.hideLoading();

      if (orderRes.success) {
        const { orderId, prepayParams } = orderRes.data;

        // 调用微信支付
        wx.requestPayment({
          ...prepayParams,
          success: async (payRes) => {
            // 支付成功，验证订单
            await this.verifyPayment(orderId, selectedPkg);
          },
          fail: (err) => {
            console.error('支付失败:', err);
            if (err.errMsg.includes('cancel')) {
              wx.showToast({
                title: '已取消支付',
                icon: 'none'
              });
            } else {
              wx.showToast({
                title: '支付失败，请重试',
                icon: 'none'
              });
            }
          }
        });
      } else {
        wx.showToast({
          title: orderRes.message || '创建订单失败',
          icon: 'none'
        });
      }
    } catch (error) {
      wx.hideLoading();
      console.error('创建订单失败:', error);

      // 开发环境模拟充值成功
      this.simulateRecharge(selectedPkg);
    }
  },

  /**
   * 验证支付结果
   */
  async verifyPayment(orderId, packageInfo) {
    try {
      const res = await api.post('/recharge/verify-payment', {
        orderId
      });

      if (res.success) {
        const totalCoins = packageInfo.coins + packageInfo.bonus;
        const newCoins = this.data.userCoins + totalCoins;

        this.setData({
          userCoins: newCoins,
          selectedPackage: null,
          selectedPackagePrice: 0
        });

        wx.showModal({
          title: '充值成功',
          content: `恭喜你获得 ${totalCoins} 心晴币！\n当前余额：${newCoins} 币`,
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#FF6B9D'
        });

        // 触觉反馈
        wx.vibrateShort({
          type: 'heavy'
        });
      } else {
        wx.showToast({
          title: '充值验证失败',
          icon: 'none'
        });
      }
    } catch (error) {
      console.error('验证支付失败:', error);
      wx.showToast({
        title: '验证支付失败',
        icon: 'none'
      });
    }
  },

  /**
   * 模拟充值成功（开发环境）
   */
  simulateRecharge(packageInfo) {
    const totalCoins = packageInfo.coins + packageInfo.bonus;
    const newCoins = this.data.userCoins + totalCoins;

    this.setData({
      userCoins: newCoins,
      selectedPackage: null,
      selectedPackagePrice: 0
    });

    wx.showModal({
      title: '充值成功（模拟）',
      content: `恭喜你获得 ${totalCoins} 心晴币！\n当前余额：${newCoins} 币\n\n注：这是开发环境模拟充值`,
      showCancel: false,
      confirmText: '好的',
      confirmColor: '#FF6B9D'
    });

    // 触觉反馈
    wx.vibrateShort({
      type: 'heavy'
    });
  }
});
