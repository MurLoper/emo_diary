import React, { useState } from 'react';
import { useTheme } from '../App';
import { Calendar as CalendarIcon, Gift, TrendingUp, Sparkles, Check, ArrowLeft } from 'lucide-react';

export default function CheckIn() {
  const { theme, userPoints, setUserPoints, continuousDays, setContinuousDays, hasCheckedInToday, setHasCheckedInToday, setCurrentPage } = useTheme();
  const [showReward, setShowReward] = useState(false);

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const today = currentDate.getDate();

  // 生成日历数据
  const getDaysInMonth = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const days = [];

    // 填充空白
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // 填充日期
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const days = getDaysInMonth();
  const checkedDays = [1, 2, 3, 4, 5, 6, 7, 10, 12, 15]; // 模拟已签到日期

  const handleCheckIn = () => {
    if (hasCheckedInToday) return;

    const baseReward = 10;
    const bonusReward = continuousDays === 6 ? 20 : continuousDays === 29 ? 100 : continuousDays === 99 ? 500 : 0;
    
    // 心晴币奖励（连续签到30天和88天）
    let coinsReward = 0;
    if (continuousDays === 29) { // 明天将是第30天
      coinsReward = 18;
    } else if (continuousDays === 87) { // 明天将是第88天
      coinsReward = 88;
    }
    
    const totalReward = baseReward + bonusReward;

    setUserPoints(userPoints + totalReward);
    if (coinsReward > 0 && typeof setUserCoins === 'function') {
      setUserCoins((prev: number) => prev + coinsReward);
    }
    setHasCheckedInToday(true);
    setContinuousDays(continuousDays + 1);
    setShowReward(true);

    setTimeout(() => {
      setShowReward(false);
    }, 2000);
  };

  const bonusMilestones = [
    { days: 7, points: 20, label: '连续7天', coins: 0 },
    { days: 30, points: 100, label: '连续30天', coins: 18 },
    { days: 88, points: 0, label: '连续88天', coins: 88 },
    { days: 100, points: 500, label: '连续100天', coins: 0 },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* 头部 - 固定 */}
      <div 
        className="px-6 pt-12 pb-6 flex-shrink-0"
        style={{ backgroundColor: theme.colors.surface }}
      >
        <div className="flex items-center gap-3 mb-2">
          <button 
            onClick={() => setCurrentPage('home')}
            className="p-2 -ml-2 rounded-lg hover:bg-black/5"
          >
            <ArrowLeft size={24} style={{ color: theme.colors.textPrimary }} />
          </button>
          <h1 className="text-2xl">每日签到</h1>
        </div>
        <p style={{ color: theme.colors.textSecondary }}>坚持签到，解锁更多主题</p>
      </div>

      {/* 内容区域 - 可滚动 */}
      <div className="flex-1 overflow-y-auto">
        {/* 签到卡片 */}
        <div className="px-6 py-6">
        <div 
          className="p-6 rounded-2xl relative overflow-hidden"
          style={{ background: theme.colors.background }}
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={24} style={{ color: theme.colors.primary }} />
                  <span className="text-3xl">{continuousDays}</span>
                </div>
                <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                  连续签到天数
                </p>
              </div>
              <button
                onClick={handleCheckIn}
                disabled={hasCheckedInToday}
                className="px-6 py-3 rounded-xl flex items-center gap-2 transition-all disabled:opacity-50"
                style={{
                  backgroundColor: hasCheckedInToday ? theme.colors.border : theme.colors.primary,
                  color: '#FFFFFF',
                }}
              >
                {hasCheckedInToday ? (
                  <>
                    <Check size={20} />
                    <span>已签到</span>
                  </>
                ) : (
                  <>
                    <Gift size={20} />
                    <span>立即签到</span>
                  </>
                )}
              </button>
            </div>

            {/* 今日奖励 */}
            <div 
              className="p-4 rounded-xl"
              style={{ backgroundColor: theme.colors.surface }}
            >
              <div className="flex items-center justify-between">
                <span style={{ color: theme.colors.textSecondary }}>今日签到奖励</span>
                <div className="flex items-center gap-1">
                  <Sparkles size={16} style={{ color: theme.colors.accent }} />
                  <span style={{ color: theme.colors.accent }}>+10 积分</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 奖励提示 */}
      {showReward && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 animate-bounce">
          <div 
            className="px-6 py-4 rounded-xl shadow-lg flex items-center gap-2"
            style={{ 
              backgroundColor: theme.colors.primary,
              color: '#FFFFFF'
            }}
          >
            <Sparkles size={24} />
            <span className="text-lg">+10 积分</span>
          </div>
        </div>
      )}

      {/* 签到日历 */}
      <div className="px-6 py-4">
        <h3 className="mb-4">
          {currentYear}年{currentMonth + 1}月
        </h3>
        <div 
          className="p-4 rounded-2xl"
          style={{ backgroundColor: theme.colors.surface }}
        >
          {/* 星期标题 */}
          <div className="grid grid-cols-7 gap-2 mb-3">
            {['日', '一', '二', '三', '四', '五', '六'].map((day, index) => (
              <div 
                key={index} 
                className="text-center text-sm py-2"
                style={{ color: theme.colors.textSecondary }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* 日期 */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => (
              <div key={index} className="aspect-square">
                {day && (
                  <div
                    className="w-full h-full rounded-lg flex flex-col items-center justify-center text-sm relative"
                    style={{
                      backgroundColor: day === today 
                        ? theme.colors.primary 
                        : checkedDays.includes(day)
                        ? `${theme.colors.primary}20`
                        : 'transparent',
                      color: day === today 
                        ? '#FFFFFF' 
                        : checkedDays.includes(day)
                        ? theme.colors.primary
                        : theme.colors.textPrimary,
                    }}
                  >
                    <span>{day}</span>
                    {checkedDays.includes(day) && day !== today && (
                      <div 
                        className="absolute bottom-1 w-1 h-1 rounded-full"
                        style={{ backgroundColor: theme.colors.primary }}
                      />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 连续签到奖励 */}
      <div className="px-6 py-4">
        <h3 className="mb-4">连续签到奖励</h3>
        <div className="space-y-3">
          {bonusMilestones.map((milestone, index) => (
            <div
              key={index}
              className="p-4 rounded-xl flex items-center justify-between"
              style={{ 
                backgroundColor: theme.colors.surface,
                opacity: continuousDays >= milestone.days ? 1 : 0.6,
              }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ 
                    backgroundColor: `${theme.colors.primary}20`,
                    color: theme.colors.primary 
                  }}
                >
                  <Gift size={24} />
                </div>
                <div>
                  <div className="mb-1">{milestone.label}</div>
                  <div className="text-sm" style={{ color: theme.colors.textSecondary }}>
                    额外奖励 {milestone.points} 积分
                  </div>
                </div>
              </div>
              {continuousDays >= milestone.days && (
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  <Check size={16} className="text-white" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 签到规则 */}
      <div className="px-6 py-4 pb-6">
        <h3 className="mb-4">签到规则</h3>
        <div 
          className="p-4 rounded-xl space-y-2 text-sm"
          style={{ 
            backgroundColor: theme.colors.surface,
            color: theme.colors.textSecondary 
          }}
        >
          <p>• 每日签到可获得10积分</p>
          <p>• 连续签到7天额外奖励20积分</p>
          <p>• 连续签到30天额外奖励100积分</p>
          <p>• 连续签到100天额外奖励500积分</p>
          <p>• 签到中断后从第1天重新开始</p>
        </div>
      </div>
      </div>
    </div>
  );
}
