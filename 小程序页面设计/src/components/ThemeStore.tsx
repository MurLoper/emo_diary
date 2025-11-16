import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../App';
import { Check, Lock, Gift, Crown, Sparkles, Calendar, Coins, ArrowUp } from 'lucide-react';

export default function ThemeStore() {
  const { theme, themes, setTheme, userPoints, setUserPoints, userCoins, setUserCoins, continuousDays, unlockedThemes, setUnlockedThemes, setCurrentPage } = useTheme();
  const [selectedPreview, setSelectedPreview] = useState<any>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const themeGroups = [
    {
      title: '免费主题',
      themes: themes.filter((t: any) => t.type === 'free'),
      type: 'free'
    },
    {
      title: '签到解锁',
      themes: themes.filter((t: any) => t.type === 'signin'),
      type: 'signin'
    },
    {
      title: '积分兑换',
      themes: themes.filter((t: any) => t.type === 'points'),
      type: 'points'
    },
    {
      title: '高级主题',
      themes: themes.filter((t: any) => t.type === 'premium'),
      type: 'premium'
    },
  ];

  const handleApplyTheme = (selectedTheme: any) => {
    const isUnlocked = unlockedThemes.includes(selectedTheme.id);
    
    if (!isUnlocked) {
      // 未解锁
      if (selectedTheme.type === 'points' && userPoints >= selectedTheme.pointsCost) {
        // 使用积分解锁
        setUserPoints(userPoints - selectedTheme.pointsCost);
        setUnlockedThemes([...unlockedThemes, selectedTheme.id]);
        setTheme(selectedTheme);
        setSelectedPreview(null);
      } else if (selectedTheme.type === 'signin' && continuousDays >= selectedTheme.signinDays) {
        // 签到天数达标，解锁
        setUnlockedThemes([...unlockedThemes, selectedTheme.id]);
        setTheme(selectedTheme);
        setSelectedPreview(null);
      } else if (selectedTheme.type === 'premium' && userCoins >= selectedTheme.price) {
        // 使用心晴币购买
        setUserCoins(userCoins - selectedTheme.price);
        setUnlockedThemes([...unlockedThemes, selectedTheme.id]);
        setTheme(selectedTheme);
        setSelectedPreview(null);
      } else {
        // 无法解锁，保持预览界面
        return;
      }
    } else {
      // 已解锁，直接应用
      setTheme(selectedTheme);
      setSelectedPreview(null);
    }
  };

  const handleThemeCardClick = (themeItem: any) => {
    // 所有主题都可以预览
    setSelectedPreview(themeItem);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        setShowBackToTop(scrollContainerRef.current.scrollTop > 300);
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div ref={scrollContainerRef} className="h-full pb-6 overflow-y-auto">
      {/* 头部 */}
      <div 
        className="px-6 pt-12 pb-6 sticky top-0 z-20 backdrop-blur-lg"
        style={{ backgroundColor: `${theme.colors.surface}F0` }}
      >
        <h1 className="text-2xl mb-2">主题商店</h1>
        <div className="flex items-center gap-4 text-sm flex-wrap">
          <div className="flex items-center gap-1" style={{ color: theme.colors.textSecondary }}>
            <Sparkles size={16} style={{ color: theme.colors.accent }} />
            <span>积分: {userPoints}</span>
          </div>
          <div className="flex items-center gap-1" style={{ color: theme.colors.textSecondary }}>
            <Coins size={16} style={{ color: theme.colors.secondary }} />
            <span>心晴币: {userCoins}</span>
          </div>
          <div className="flex items-center gap-1" style={{ color: theme.colors.textSecondary }}>
            <Calendar size={16} style={{ color: theme.colors.primary }} />
            <span>连签: {continuousDays}天</span>
          </div>
        </div>
      </div>

      {/* 当前主题预览 */}
      <div className="px-6 py-6">
        <h3 className="mb-4">当前主题</h3>
        <div 
          className="p-6 rounded-2xl relative overflow-hidden"
          style={{ background: theme.colors.background }}
        >
          <div className="relative">
            <h2 className="text-xl mb-2" style={{ color: theme.colors.textPrimary }}>
              {theme.name}
            </h2>
            <div className="flex gap-2 mb-4">
              <div 
                className="w-8 h-8 rounded-full"
                style={{ backgroundColor: theme.colors.primary }}
              />
              <div 
                className="w-8 h-8 rounded-full"
                style={{ backgroundColor: theme.colors.secondary }}
              />
              <div 
                className="w-8 h-8 rounded-full"
                style={{ backgroundColor: theme.colors.accent }}
              />
            </div>
            <div 
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{ 
                backgroundColor: theme.colors.surface,
                color: theme.colors.primary 
              }}
            >
              <Check size={16} />
              <span className="text-sm">使用中</span>
            </div>
          </div>
        </div>
      </div>

      {/* 主题列表 */}
      {themeGroups.map((group, groupIndex) => (
        <div key={groupIndex} className="px-6 py-4">
          <div className="flex items-center gap-2 mb-4">
            <h3>{group.title}</h3>
            {group.type === 'points' && (
              <div className="flex items-center gap-1 text-sm px-2 py-1 rounded" style={{ backgroundColor: `${theme.colors.accent}20`, color: theme.colors.accent }}>
                <Sparkles size={14} />
                <span>积分</span>
              </div>
            )}
            {group.type === 'signin' && (
              <div className="flex items-center gap-1 text-sm px-2 py-1 rounded" style={{ backgroundColor: `${theme.colors.primary}20`, color: theme.colors.primary }}>
                <Calendar size={14} />
                <span>签到</span>
              </div>
            )}
            {group.type === 'premium' && (
              <div className="flex items-center gap-1 text-sm px-2 py-1 rounded" style={{ backgroundColor: `${theme.colors.secondary}20`, color: theme.colors.secondary }}>
                <Crown size={14} />
                <span>付费</span>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {group.themes.map((themeItem: any) => (
              <ThemeCard
                key={themeItem.id}
                themeItem={themeItem}
                isActive={theme.id === themeItem.id}
                isUnlocked={unlockedThemes.includes(themeItem.id)}
                userPoints={userPoints}
                continuousDays={continuousDays}
                onClick={() => handleThemeCardClick(themeItem)}
              />
            ))}
          </div>
        </div>
      ))}

      {/* 预览弹窗 */}
      {selectedPreview && (
        <ThemePreviewModal
          theme={selectedPreview}
          isUnlocked={unlockedThemes.includes(selectedPreview.id)}
          userPoints={userPoints}
          userCoins={userCoins}
          continuousDays={continuousDays}
          onClose={() => setSelectedPreview(null)}
          onApply={() => handleApplyTheme(selectedPreview)}
          onNavigateToCheckin={() => {
            setSelectedPreview(null);
            setCurrentPage('user');
          }}
        />
      )}

      {/* 返回顶部按钮 */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
          style={{
            backgroundColor: theme.colors.primary,
            color: '#FFFFFF',
            zIndex: 20,
          }}
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
}

function ThemeCard({ themeItem, isActive, isUnlocked, userPoints, continuousDays, onClick }: any) {
  const { theme } = useTheme();
  
  const getCanUnlock = () => {
    if (isUnlocked) return true;
    if (themeItem.type === 'free') return true;
    if (themeItem.type === 'points') return userPoints >= themeItem.pointsCost;
    if (themeItem.type === 'signin') return continuousDays >= themeItem.signinDays;
    return false;
  };

  const canUnlock = getCanUnlock();

  const getStatusBadge = () => {
    if (isActive) {
      return (
        <div 
          className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs"
          style={{ 
            backgroundColor: themeItem.colors.surface,
            color: themeItem.colors.primary 
          }}
        >
          <Check size={12} />
          <span>使用中</span>
        </div>
      );
    }
    
    if (isUnlocked) {
      return (
        <div 
          className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs"
          style={{ 
            backgroundColor: themeItem.colors.surface,
            color: themeItem.colors.primary 
          }}
        >
          <Check size={12} />
          <span>已解锁</span>
        </div>
      );
    }

    if (themeItem.type === 'points') {
      return (
        <div 
          className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs"
          style={{ 
            backgroundColor: canUnlock ? themeItem.colors.surface : 'rgba(0,0,0,0.3)',
            color: canUnlock ? themeItem.colors.accent : '#FFFFFF'
          }}
        >
          <Sparkles size={12} />
          <span>{themeItem.pointsCost}积分</span>
        </div>
      );
    }

    if (themeItem.type === 'signin') {
      return (
        <div 
          className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs"
          style={{ 
            backgroundColor: canUnlock ? themeItem.colors.surface : 'rgba(0,0,0,0.3)',
            color: canUnlock ? themeItem.colors.primary : '#FFFFFF'
          }}
        >
          <Calendar size={12} />
          <span>{themeItem.signinDays}天</span>
        </div>
      );
    }

    if (themeItem.type === 'premium') {
      return (
        <div 
          className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs"
          style={{ 
            backgroundColor: 'rgba(0,0,0,0.3)',
            color: '#FFFFFF'
          }}
        >
          <Crown size={12} />
          <span>{themeItem.price}币</span>
        </div>
      );
    }

    return (
      <div 
        className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs"
        style={{ 
          backgroundColor: themeItem.colors.surface,
          color: themeItem.colors.primary 
        }}
      >
        <Gift size={12} />
        <span>免费</span>
      </div>
    );
  };

  return (
    <div
      onClick={onClick}
      className="relative rounded-xl overflow-hidden cursor-pointer transition-transform hover:scale-105 active:scale-95"
      style={{
        background: themeItem.colors.background,
        opacity: isUnlocked || canUnlock || themeItem.type === 'signin' ? 1 : 0.6,
      }}
    >
      <div className="p-4 relative">
        {/* 颜色预览 */}
        <div className="flex gap-1.5 mb-3">
          <div 
            className="w-6 h-6 rounded-full"
            style={{ backgroundColor: themeItem.colors.primary }}
          />
          <div 
            className="w-6 h-6 rounded-full"
            style={{ backgroundColor: themeItem.colors.secondary }}
          />
          <div 
            className="w-6 h-6 rounded-full"
            style={{ backgroundColor: themeItem.colors.accent }}
          />
        </div>

        {/* 主题名称 */}
        <h4 className="mb-2" style={{ color: themeItem.colors.textPrimary }}>
          {themeItem.name}
        </h4>

        {/* 状态标识 */}
        {getStatusBadge()}

        {/* 锁定遮罩 */}
        {!isUnlocked && !canUnlock && themeItem.type !== 'signin' && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <Lock size={32} className="text-white/80" />
          </div>
        )}
      </div>
    </div>
  );
}

function ThemePreviewModal({ theme: previewTheme, isUnlocked, userPoints, userCoins, continuousDays, onClose, onApply, onNavigateToCheckin }: any) {
  const { theme, setCurrentPage } = useTheme();

  const canUnlock = () => {
    if (isUnlocked) return true;
    if (previewTheme.type === 'free') return true;
    if (previewTheme.type === 'points') return userPoints >= previewTheme.pointsCost;
    if (previewTheme.type === 'signin') return continuousDays >= previewTheme.signinDays;
    if (previewTheme.type === 'premium') return userCoins >= previewTheme.price;
    return false;
  };

  const getButtonText = () => {
    if (isUnlocked) return '应用此主题';
    if (previewTheme.type === 'points') {
      if (userPoints >= previewTheme.pointsCost) {
        return `使用 ${previewTheme.pointsCost} 积分解锁`;
      } else {
        return `积分不足 (需要${previewTheme.pointsCost}，当前${userPoints})`;
      }
    }
    if (previewTheme.type === 'signin') {
      if (continuousDays >= previewTheme.signinDays) {
        return '解锁并应用';
      } else {
        return '需要签到解锁';
      }
    }
    if (previewTheme.type === 'premium') {
      return `需要购买解锁 (${previewTheme.price}心晴币)`;
    }
    return '应用此主题';
  };

  const handleMainButtonClick = () => {
    if (canUnlock()) {
      onApply();
    } else {
      // 根据主题类型跳转到对应页面
      if (previewTheme.type === 'signin') {
        onClose();
        setCurrentPage('checkin');
      } else if (previewTheme.type === 'premium') {
        onClose();
        setCurrentPage('recharge');
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-end justify-center overflow-hidden"
      style={{ zIndex: 100 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-t-3xl overflow-y-auto animate-slide-up"
        style={{ 
          background: previewTheme.colors.background,
          maxHeight: 'calc(100vh - 120px)',
          marginBottom: '80px',
        }}
      >
        {/* 关闭滑块 */}
        <div className="flex justify-center pt-4 pb-2 sticky top-0 z-10" style={{ background: previewTheme.colors.background }}>
          <div 
            className="w-12 h-1 rounded-full"
            style={{ backgroundColor: previewTheme.colors.border }}
          />
        </div>

        <div className="px-6 pb-6">
          <h2 className="text-2xl mb-2" style={{ color: previewTheme.colors.textPrimary }}>
            {previewTheme.name}
          </h2>

          {/* 主题类型标签 */}
          <div className="mb-6">
            {previewTheme.type === 'free' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm" style={{ backgroundColor: `${previewTheme.colors.primary}20`, color: previewTheme.colors.primary }}>
                <Gift size={14} />
                免费主题
              </span>
            )}
            {previewTheme.type === 'signin' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm" style={{ backgroundColor: `${previewTheme.colors.primary}20`, color: previewTheme.colors.primary }}>
                <Calendar size={14} />
                签到{previewTheme.signinDays}天解锁
              </span>
            )}
            {previewTheme.type === 'points' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm" style={{ backgroundColor: `${previewTheme.colors.accent}20`, color: previewTheme.colors.accent }}>
                <Sparkles size={14} />
                {previewTheme.pointsCost}积分
              </span>
            )}
            {previewTheme.type === 'premium' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm" style={{ backgroundColor: `${previewTheme.colors.secondary}20`, color: previewTheme.colors.secondary }}>
                <Crown size={14} />
                高级主题 {previewTheme.price}心晴币
              </span>
            )}
          </div>

          {/* 颜色展示 */}
          <div className="mb-6">
            <h4 className="mb-3" style={{ color: previewTheme.colors.textSecondary }}>主题配色</h4>
            <div className="grid grid-cols-3 gap-3">
              <ColorItem color={previewTheme.colors.primary} label="主色" />
              <ColorItem color={previewTheme.colors.secondary} label="辅色" />
              <ColorItem color={previewTheme.colors.accent} label="强调" />
            </div>
          </div>

          {/* 预览示例 */}
          <div className="mb-6">
            <h4 className="mb-3" style={{ color: previewTheme.colors.textSecondary }}>效果预览</h4>
            <div 
              className="p-4 rounded-xl mb-3"
              style={{ backgroundColor: previewTheme.colors.surface }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-12 h-12 rounded-full"
                  style={{ backgroundColor: previewTheme.colors.primary }}
                />
                <div>
                  <div className="mb-1" style={{ color: previewTheme.colors.textPrimary }}>示例标题</div>
                  <div className="text-sm" style={{ color: previewTheme.colors.textSecondary }}>示例内容文字</div>
                </div>
              </div>
              <button
                className="w-full py-2 rounded-lg text-center"
                style={{ 
                  backgroundColor: previewTheme.colors.primary,
                  color: '#FFFFFF'
                }}
              >
                按钮示例
              </button>
            </div>
          </div>

          {/* 操作按钮 - 固定在底部 */}
          <div 
            className="sticky bottom-0 pt-4 space-y-3" 
            style={{ 
              background: previewTheme.colors.background,
              paddingBottom: 'max(env(safe-area-inset-bottom), 24px)'
            }}
          >
            {previewTheme.type === 'signin' && !isUnlocked && continuousDays < previewTheme.signinDays && (
              <button
                onClick={() => {
                  onClose();
                  setCurrentPage('checkin');
                }}
                className="w-full py-3 rounded-xl transition-transform active:scale-95 text-center"
                style={{ 
                  backgroundColor: previewTheme.colors.secondary,
                  color: '#FFFFFF'
                }}
              >
                去签到 ({continuousDays}/{previewTheme.signinDays}天)
              </button>
            )}
            <button
              onClick={handleMainButtonClick}
              className="w-full py-3 rounded-xl transition-transform active:scale-95 text-center flex items-center justify-center"
              style={{ 
                backgroundColor: previewTheme.colors.primary,
                color: '#FFFFFF'
              }}
            >
              <span>{getButtonText()}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ColorItem({ color, label }: any) {
  return (
    <div className="text-center">
      <div 
        className="w-full aspect-square rounded-lg mb-2"
        style={{ backgroundColor: color }}
      />
      <div className="text-xs opacity-70">{label}</div>
    </div>
  );
}
