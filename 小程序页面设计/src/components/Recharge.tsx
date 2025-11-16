import React, { useState } from 'react';
import { useTheme } from '../App';
import { ArrowLeft, Coins, CreditCard, Check, Zap, Gift, Crown } from 'lucide-react';

export default function Recharge() {
  const { theme, userCoins, setUserCoins, setCurrentPage } = useTheme();
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);

  const packages = [
    { id: 1, coins: 60, price: 6, bonus: 0, label: '入门包', icon: <Coins size={24} /> },
    { id: 2, coins: 180, price: 18, bonus: 20, label: '超值包', icon: <Zap size={24} />, hot: true },
    { id: 3, coins: 320, price: 30, bonus: 50, label: '优惠包', icon: <Gift size={24} /> },
    { id: 4, coins: 680, price: 60, bonus: 120, label: '豪华包', icon: <Crown size={24} /> },
    { id: 5, coins: 1280, price: 108, bonus: 320, label: '至尊包', icon: <Crown size={24} /> },
    { id: 6, coins: 3280, price: 258, bonus: 1000, label: 'VIP包', icon: <Crown size={24} />, vip: true },
  ];

  const handlePurchase = () => {
    if (selectedPackage === null) return;
    
    const pkg = packages.find((p) => p.id === selectedPackage);
    if (!pkg) return;

    // 模拟支付成功
    const totalCoins = pkg.coins + pkg.bonus;
    setUserCoins(userCoins + totalCoins);
    
    // 显示成功提示
    alert(`充值成功！获得 ${totalCoins} 心晴币`);
    setSelectedPackage(null);
  };

  return (
    <div className="flex flex-col h-full">
      {/* 头部 - 固定 */}
      <div 
        className="px-6 pt-12 pb-6 flex-shrink-0"
        style={{ backgroundColor: theme.colors.surface }}
      >
        <div className="flex items-center gap-3 mb-2">
          <button 
            onClick={() => setCurrentPage('user')}
            className="p-2 -ml-2 rounded-lg hover:bg-black/5"
          >
            <ArrowLeft size={24} style={{ color: theme.colors.textPrimary }} />
          </button>
          <h1 className="text-2xl">充值中心</h1>
        </div>
        <p style={{ color: theme.colors.textSecondary }}>购买心晴币，解锁更多精美主题</p>
      </div>

      {/* 内容区域 - 可滚动 */}
      <div className="flex-1 overflow-y-auto pb-6">
        {/* 当前余额 */}
        <div className="px-6 py-4">
        <div 
          className="p-6 rounded-2xl relative overflow-hidden"
          style={{ 
            background: `linear-gradient(135deg, ${theme.colors.surface} 0%, ${theme.colors.primary}12 100%)`,
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
          }}
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <span style={{ color: theme.colors.textSecondary }}>当前余额</span>
              <div className="flex items-center gap-2">
                <Coins size={20} style={{ color: theme.colors.primary }} />
                <span className="text-sm" style={{ color: theme.colors.primary }}>心晴币</span>
              </div>
            </div>
            <div className="text-4xl" style={{ color: theme.colors.textPrimary }}>
              {userCoins}
            </div>
          </div>
        </div>
      </div>

      {/* 充值套餐 */}
      <div className="px-6 py-4">
        <h3 className="mb-4">选择充值套餐</h3>
        <div className="grid grid-cols-2 gap-3">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg.id)}
              className="relative p-4 rounded-2xl cursor-pointer transition-all"
              style={{
                background: `linear-gradient(135deg, ${theme.colors.surface} 0%, ${selectedPackage === pkg.id ? theme.colors.primary : theme.colors.secondary}${selectedPackage === pkg.id ? '15' : '08'} 100%)`,
                border: `2px solid ${selectedPackage === pkg.id ? theme.colors.primary : theme.colors.border}`,
                transform: selectedPackage === pkg.id ? 'scale(1.02)' : 'scale(1)',
                boxShadow: selectedPackage === pkg.id ? '0 6px 20px rgba(0,0,0,0.12)' : '0 3px 10px rgba(0,0,0,0.06)',
              }}
            >
              {/* 热门标签 */}
              {pkg.hot && (
                <div 
                  className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-xs"
                  style={{ 
                    backgroundColor: theme.colors.accent,
                    color: '#FFFFFF'
                  }}
                >
                  最热
                </div>
              )}
              
              {/* VIP标签 */}
              {pkg.vip && (
                <div 
                  className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-xs"
                  style={{ 
                    backgroundColor: theme.colors.secondary,
                    color: '#FFFFFF'
                  }}
                >
                  VIP
                </div>
              )}

              {/* 选中标记 */}
              {selectedPackage === pkg.id && (
                <div 
                  className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  <Check size={14} className="text-white" />
                </div>
              )}

              {/* 图标 */}
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                style={{ 
                  backgroundColor: `${theme.colors.primary}15`,
                  color: theme.colors.primary
                }}
              >
                {pkg.icon}
              </div>

              {/* 标签 */}
              <div className="text-sm mb-2" style={{ color: theme.colors.textSecondary }}>
                {pkg.label}
              </div>

              {/* 心晴币数量 */}
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-2xl">{pkg.coins}</span>
                {pkg.bonus > 0 && (
                  <span className="text-sm" style={{ color: theme.colors.accent }}>
                    +{pkg.bonus}
                  </span>
                )}
                <span className="text-sm" style={{ color: theme.colors.textSecondary }}>币</span>
              </div>

              {/* 价格 */}
              <div style={{ color: theme.colors.primary }}>
                ¥{pkg.price}
              </div>

              {/* 赠送提示 */}
              {pkg.bonus > 0 && (
                <div className="mt-2 text-xs px-2 py-1 rounded text-center" style={{ backgroundColor: `${theme.colors.accent}15`, color: theme.colors.accent }}>
                  赠送{pkg.bonus}币
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 说明 */}
      <div className="px-6 py-4">
        <div 
          className="p-4 rounded-xl"
          style={{ backgroundColor: `${theme.colors.primary}10` }}
        >
          <h4 className="mb-2" style={{ color: theme.colors.primary }}>温馨提示</h4>
          <ul className="text-sm space-y-1" style={{ color: theme.colors.textSecondary }}>
            <li>• 心晴币可用于购买精美主题</li>
            <li>• 心晴币永久有效，不会过期</li>
            <li>• 充值成功后即时到账</li>
            <li>• 主题一经购买永久使用</li>
          </ul>
        </div>
      </div>

      {/* 支付方式 */}
      <div className="px-6 py-4">
        <h3 className="mb-4">支付方式</h3>
        <div className="space-y-3">
          <div 
            className="p-4 rounded-xl flex items-center justify-between"
            style={{ backgroundColor: theme.colors.surface }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: '#09BB07' }}
              >
                <span className="text-white text-xs">微信</span>
              </div>
              <span>微信支付</span>
            </div>
            <div 
              className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
              style={{ borderColor: theme.colors.primary, backgroundColor: theme.colors.primary }}
            >
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
          </div>
        </div>
      </div>

      {/* 底部购买按钮区域 */}
      <div className="px-6 py-4 pb-6">
        <button
          onClick={handlePurchase}
          disabled={selectedPackage === null}
          className="w-full py-4 rounded-xl transition-all disabled:opacity-50 text-center flex items-center justify-center gap-2"
          style={{
            backgroundColor: theme.colors.primary,
            color: '#FFFFFF',
          }}
        >
          <CreditCard size={20} />
          <span>
            {selectedPackage
              ? `立即支付 ¥${packages.find((p) => p.id === selectedPackage)?.price}`
              : '请选择充值套餐'}
          </span>
        </button>
      </div>
      </div>
    </div>
  );
}
