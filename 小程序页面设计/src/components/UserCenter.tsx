import React, { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useTheme } from '../App';
import { 
  User, 
  Sparkles, 
  BookOpen, 
  Image, 
  Settings, 
  Bell, 
  Shield, 
  HelpCircle,
  ChevronRight,
  Award,
  Calendar,
  Download,
  Gift as GiftIcon,
  TrendingUp,
  Check,
  Coins,
  ArrowLeft,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Smartphone,
  X,
  ChevronDown,
  Code,
  Heart
} from 'lucide-react';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

export default function UserCenter() {
  const { theme, userPoints, diaries } = useTheme();
  const [activeTab, setActiveTab] = useState('profile'); // profile, checkin, settings

  return (
    <div className="flex flex-col h-full">
      {/* 头部导航 - 固定在顶部 */}
      <div 
        className="px-6 pt-12 pb-0 flex-shrink-0"
        style={{ backgroundColor: theme.colors.surface }}
      >
        <h1 className="text-2xl mb-4">我的</h1>
        
        {/* 标签页 */}
        <div className="flex gap-1 -mx-6 px-6 border-b" style={{ borderColor: theme.colors.border }}>
          <TabButton
            active={activeTab === 'profile'}
            onClick={() => setActiveTab('profile')}
            label="个人主页"
          />
          <TabButton
            active={activeTab === 'checkin'}
            onClick={() => setActiveTab('checkin')}
            label="签到"
          />
          <TabButton
            active={activeTab === 'settings'}
            onClick={() => setActiveTab('settings')}
            label="设置"
          />
        </div>
      </div>

      {/* 内容区域 - 可滚动 */}
      <div className="flex-1 overflow-y-auto pb-6">
        {activeTab === 'profile' && <ProfileTab setActiveTab={setActiveTab} />}
        {activeTab === 'checkin' && <CheckInTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, label }: any) {
  const { theme } = useTheme();
  
  return (
    <button
      onClick={onClick}
      className="px-4 py-3 relative transition-colors"
      style={{
        color: active ? theme.colors.primary : theme.colors.textSecondary,
      }}
    >
      {label}
      {active && (
        <div 
          className="absolute bottom-0 left-0 right-0 h-0.5"
          style={{ backgroundColor: theme.colors.primary }}
        />
      )}
    </button>
  );
}

function ProfileTab({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const { theme, userPoints, userCoins, diaries, albums, setCurrentPage } = useTheme();

  const userInfo = {
    name: '心晴用户',
    avatar: 'https://images.unsplash.com/photo-1654281436853-fc0f3fe2d4e2?w=200',
    level: 'VIP',
    joinDate: '2025-01-01',
  };

  const menuSections = [
    {
      title: '我的内容',
      items: [
        { icon: <BookOpen size={20} />, label: '我的日记', value: diaries.length, badge: null, onClick: () => setCurrentPage('diary') },
        { icon: <Image size={20} />, label: '我的图文集', value: albums.length, badge: null, onClick: () => setCurrentPage('album') },
        { icon: <Award size={20} />, label: '我的主题', value: 8, badge: null, onClick: () => setCurrentPage('theme') },
      ]
    },
    {
      title: '我的资产',
      items: [
        { icon: <Sparkles size={20} />, label: '我的积分', value: userPoints, badge: null, onClick: () => setActiveTab('checkin') },
        { icon: <Coins size={20} />, label: '我的心晴币', value: userCoins, badge: 'HOT', onClick: () => setCurrentPage('recharge') },
      ]
    }
  ];

  return (
    <>
      {/* 用户信息卡片 */}
      <div className="px-6 pt-6 mb-6">
        <div 
          className="p-6 rounded-2xl"
          style={{ 
            background: `linear-gradient(135deg, ${theme.colors.surface} 0%, ${theme.colors.primary}10 100%)`,
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
          }}
        >
          <div className="flex items-center gap-4">
            {/* 头像 */}
            <div className="relative">
              <ImageWithFallback
                src={userInfo.avatar}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover"
              />
              <div 
                className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-xs"
                style={{ 
                  backgroundColor: theme.colors.primary,
                  color: '#FFFFFF'
                }}
              >
                {userInfo.level}
              </div>
            </div>

            {/* 用户信息 */}
            <div className="flex-1">
              <h2 className="text-xl mb-1">{userInfo.name}</h2>
              <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                加入于 {userInfo.joinDate}
              </p>
            </div>

            {/* 编辑按钮 */}
            <button 
              onClick={() => setActiveTab('settings')}
              className="p-2 rounded-lg transition-transform active:scale-95"
              style={{ 
                backgroundColor: `${theme.colors.primary}20`,
                color: theme.colors.primary 
              }}
            >
              <Settings size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* 菜单列表 */}
      {menuSections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="px-6 py-4">
          <h3 className="mb-3" style={{ color: theme.colors.textSecondary }}>
            {section.title}
          </h3>
          <div 
            className="rounded-2xl overflow-hidden"
            style={{ 
              background: `linear-gradient(135deg, ${theme.colors.surface} 0%, ${theme.colors.secondary}08 100%)`,
              boxShadow: '0 3px 12px rgba(0,0,0,0.06)'
            }}
          >
            {section.items.map((item, itemIndex) => (
              <MenuItem
                key={itemIndex}
                icon={item.icon}
                label={item.label}
                value={item.value}
                badge={item.badge}
                showDivider={itemIndex < section.items.length - 1}
                onClick={item.onClick}
              />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

function CheckInTab() {
  const { theme, userPoints, setUserPoints, continuousDays, setContinuousDays, hasCheckedInToday, setHasCheckedInToday } = useTheme();
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
    const totalReward = baseReward + bonusReward;

    setUserPoints(userPoints + totalReward);
    setHasCheckedInToday(true);
    setContinuousDays(continuousDays + 1);
    setShowReward(true);

    setTimeout(() => {
      setShowReward(false);
    }, 2000);
  };

  const bonusMilestones = [
    { days: 7, points: 20, label: '连续7天' },
    { days: 30, points: 100, label: '连续30天' },
    { days: 100, points: 500, label: '连续100天' },
  ];

  return (
    <>
      {/* 签到卡片 */}
      <div className="px-6 pt-6 mb-6">
        <div 
          className="p-6 rounded-2xl relative overflow-hidden"
          style={{ 
            background: `linear-gradient(135deg, ${theme.colors.surface} 0%, ${theme.colors.primary}15 100%)`,
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
          }}
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
                    <GiftIcon size={20} />
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
      <div className="px-6 mb-6">
        <h3 className="mb-4">
          {currentYear}年{currentMonth + 1}月
        </h3>
        <div 
          className="p-4 rounded-2xl"
          style={{ 
            background: `linear-gradient(135deg, ${theme.colors.surface} 0%, ${theme.colors.accent}08 100%)`,
            boxShadow: '0 3px 12px rgba(0,0,0,0.06)'
          }}
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
      <div className="px-6 mb-6">
        <h3 className="mb-4">连续签到奖励</h3>
        <div className="space-y-3">
          {bonusMilestones.map((milestone, index) => (
            <div
              key={index}
              className="p-4 rounded-xl flex items-center justify-between"
              style={{ 
                background: `linear-gradient(135deg, ${theme.colors.surface} 0%, ${theme.colors.primary}08 100%)`,
                boxShadow: '0 3px 12px rgba(0,0,0,0.06)',
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
                  <GiftIcon size={24} />
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
      <div className="px-6 mb-6">
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
    </>
  );
}

function SettingsTab() {
  const { theme } = useTheme();
  const [currentSettingPage, setCurrentSettingPage] = useState<string | null>(null);

  const menuSections = [
    {
      title: '账号设置',
      items: [
        { icon: <User size={20} />, label: '个人信息', value: null, badge: null, onClick: () => setCurrentSettingPage('profile') },
        { icon: <Bell size={20} />, label: '通知设置', value: null, badge: null, onClick: () => setCurrentSettingPage('notification') },
        { icon: <Shield size={20} />, label: '隐私设置', value: null, badge: null, onClick: () => setCurrentSettingPage('privacy') },
      ]
    },
    {
      title: '帮助与反馈',
      items: [
        { icon: <HelpCircle size={20} />, label: '帮助中心', value: null, badge: null, onClick: () => setCurrentSettingPage('help') },
        { icon: <Settings size={20} />, label: '关于我们', value: null, badge: null, onClick: () => setCurrentSettingPage('about') },
      ]
    }
  ];

  // 如果打开了子页面，显示子页面
  if (currentSettingPage) {
    return (
      <>
        {currentSettingPage === 'profile' && <ProfileSettingPage onBack={() => setCurrentSettingPage(null)} />}
        {currentSettingPage === 'notification' && <NotificationSettingPage onBack={() => setCurrentSettingPage(null)} />}
        {currentSettingPage === 'privacy' && <PrivacySettingPage onBack={() => setCurrentSettingPage(null)} />}
        {currentSettingPage === 'help' && <HelpCenterPage onBack={() => setCurrentSettingPage(null)} />}
        {currentSettingPage === 'about' && <AboutUsPage onBack={() => setCurrentSettingPage(null)} />}
      </>
    );
  }

  return (
    <>
      {/* 菜单列表 */}
      {menuSections.map((section, sectionIndex) => (
        <div key={sectionIndex} className={`px-6 ${sectionIndex === 0 ? 'pt-6' : ''} py-4`}>
          <h3 className="mb-3" style={{ color: theme.colors.textSecondary }}>
            {section.title}
          </h3>
          <div 
            className="rounded-2xl overflow-hidden"
            style={{ 
              background: `linear-gradient(135deg, ${theme.colors.surface} 0%, ${theme.colors.secondary}08 100%)`,
              boxShadow: '0 3px 12px rgba(0,0,0,0.06)'
            }}
          >
            {section.items.map((item, itemIndex) => (
              <MenuItem
                key={itemIndex}
                icon={item.icon}
                label={item.label}
                value={item.value}
                badge={item.badge}
                showDivider={itemIndex < section.items.length - 1}
                onClick={item.onClick}
              />
            ))}
          </div>
        </div>
      ))}

      {/* 退出登录 */}
      <div className="px-6 py-4">
        <button
          className="w-full py-3 rounded-xl text-center transition-colors hover:opacity-80"
          style={{ 
            backgroundColor: theme.colors.surface,
            color: theme.colors.textSecondary 
          }}
        >
          退出登录
        </button>
      </div>

      {/* 版本信息 */}
      <div className="px-6 py-4 text-center text-sm" style={{ color: theme.colors.textSecondary }}>
        心晴日记 v1.0.0
      </div>
    </>
  );
}

function MenuItem({ icon, label, value, badge, showDivider, onClick }: any) {
  const { theme } = useTheme();

  return (
    <>
      <div 
        onClick={onClick}
        className="flex items-center gap-3 p-4 cursor-pointer transition-colors hover:bg-black/5 active:bg-black/10"
      >
        <div style={{ color: theme.colors.primary }}>
          {icon}
        </div>
        <span className="flex-1">{label}</span>
        <div className="flex items-center gap-2">
          {value !== null && (
            <span style={{ color: theme.colors.textSecondary }}>
              {value}
            </span>
          )}
          {badge && (
            <span 
              className="px-2 py-0.5 rounded text-xs"
              style={{ 
                backgroundColor: badge === 'HOT' ? `${theme.colors.accent}20` : `${theme.colors.primary}20`,
                color: badge === 'HOT' ? theme.colors.accent : theme.colors.primary
              }}
            >
              {badge}
            </span>
          )}
          <ChevronRight size={18} style={{ color: theme.colors.textSecondary }} />
        </div>
      </div>
      {showDivider && (
        <div 
          className="h-px mx-4"
          style={{ backgroundColor: theme.colors.border }}
        />
      )}
    </>
  );
}

function GiftIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 12 20 22 4 22 4 12"></polyline>
      <rect x="2" y="7" width="20" height="5"></rect>
      <line x1="12" y1="22" x2="12" y2="7"></line>
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
    </svg>
  );
}

// 个人信息设置页面
function ProfileSettingPage({ onBack }: { onBack: () => void }) {
  const { theme } = useTheme();
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);
  const [showNicknameDialog, setShowNicknameDialog] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [nickname, setNickname] = useState('心晴用户');
  const [tempNickname, setTempNickname] = useState('');
  const [isPhoneBound, setIsPhoneBound] = useState(false);

  const userInfo = {
    name: nickname,
    avatar: 'https://images.unsplash.com/photo-1654281436853-fc0f3fe2d4e2?w=200',
    phone: isPhoneBound ? '138****5678' : '未绑定',
  };

  // 模拟微信获取手机号
  const handleWeChatPhoneBind = () => {
    // 在实际微信小程序中，这里会调用 wx.login 和 button open-type="getPhoneNumber"
    setShowPhoneDialog(true);
  };

  const handlePhoneBind = () => {
    if (phoneNumber.length === 11) {
      setIsPhoneBound(true);
      setShowPhoneDialog(false);
      setPhoneNumber('');
    }
  };

  // 打开昵称编辑弹窗
  const handleNicknameEdit = () => {
    setTempNickname(nickname);
    setShowNicknameDialog(true);
  };

  // 保存昵称
  const handleNicknameSave = () => {
    if (tempNickname.trim()) {
      setNickname(tempNickname.trim());
      setShowNicknameDialog(false);
      setTempNickname('');
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      {/* 头部 */}
      <div 
        className="px-6 pt-6 pb-4 flex items-center gap-4 sticky top-0 z-10"
        style={{ 
          backgroundColor: theme.colors.surface,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}
      >
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-lg transition-transform active:scale-95"
          style={{ color: theme.colors.textPrimary }}
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl">个人信息</h2>
      </div>

      <div className="px-6 pb-6 pt-4">
        {/* 头像 */}
        <div 
          className="p-4 rounded-2xl mb-4 flex items-center justify-between cursor-pointer transition-colors hover:bg-black/5 active:bg-black/10"
          style={{ 
            backgroundColor: theme.colors.surface,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <span style={{ color: theme.colors.textPrimary }}>头像</span>
          <div className="flex items-center gap-3">
            <ImageWithFallback
              src={userInfo.avatar}
              alt="Avatar"
              className="w-12 h-12 rounded-full object-cover"
            />
            <ChevronRight size={18} style={{ color: theme.colors.textSecondary }} />
          </div>
        </div>

        {/* 昵称 */}
        <div 
          onClick={handleNicknameEdit}
          className="p-4 rounded-2xl mb-4 flex items-center justify-between cursor-pointer transition-colors hover:bg-black/5 active:bg-black/10"
          style={{ 
            backgroundColor: theme.colors.surface,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <span style={{ color: theme.colors.textPrimary }}>昵称</span>
          <div className="flex items-center gap-3">
            <span style={{ color: theme.colors.textSecondary }}>{userInfo.name}</span>
            <ChevronRight size={18} style={{ color: theme.colors.textSecondary }} />
          </div>
        </div>

        {/* 手机号 */}
        <div 
          onClick={!isPhoneBound ? handleWeChatPhoneBind : undefined}
          className="p-4 rounded-2xl mb-4 flex items-center justify-between cursor-pointer transition-colors hover:bg-black/5 active:bg-black/10"
          style={{ 
            backgroundColor: theme.colors.surface,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <div className="flex items-center gap-3">
            <Phone size={20} style={{ color: theme.colors.primary }} />
            <span style={{ color: theme.colors.textPrimary }}>手机号</span>
          </div>
          <div className="flex items-center gap-3">
            <span style={{ color: isPhoneBound ? theme.colors.textSecondary : theme.colors.primary }}>
              {userInfo.phone}
            </span>
            {!isPhoneBound && <ChevronRight size={18} style={{ color: theme.colors.textSecondary }} />}
          </div>
        </div>

        {/* 提示信息 */}
        <div 
          className="p-4 rounded-xl text-sm"
          style={{ 
            backgroundColor: `${theme.colors.primary}10`,
            color: theme.colors.textSecondary 
          }}
        >
          <p className="mb-2">• 绑定手机号后可以在其他设备登录</p>
          <p className="mb-2">• 手机号将用于账号安全验证</p>
          <p>• 您的手机号信息将被严格保密</p>
        </div>
      </div>

      {/* 手机号绑定弹窗 */}
      {showPhoneDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div 
            className="w-full max-w-sm rounded-2xl p-6 animate-in fade-in zoom-in duration-200 relative"
            style={{ 
              backgroundColor: theme.colors.surface,
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}
          >
            <button 
              onClick={() => setShowPhoneDialog(false)}
              className="absolute top-4 right-4 p-2 rounded-lg transition-transform active:scale-95"
              style={{ color: theme.colors.textSecondary }}
            >
              <X size={20} />
            </button>
            
            <div className="text-center mb-6">
              <h3 className="text-xl">绑定手机号</h3>
            </div>

            <div className="mb-6">
              <p className="text-sm mb-4" style={{ color: theme.colors.textSecondary }}>
                请输入您的手机号，用于账号登录和安全验证
              </p>
              <Input
                type="tel"
                placeholder="请输入手机号"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 11))}
                className="w-full"
                maxLength={11}
              />
            </div>

            {/* 微信授权按钮 */}
            <button
              onClick={handlePhoneBind}
              disabled={phoneNumber.length !== 11}
              className="w-full py-3 rounded-xl mb-3 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              style={{
                backgroundColor: theme.colors.primary,
                color: '#FFFFFF',
              }}
            >
              <Smartphone size={20} />
              <span>确认绑定</span>
            </button>

            <p className="text-xs text-center" style={{ color: theme.colors.textSecondary }}>
              在微信小程序中，可直接通过微信授权获取手机号
            </p>
          </div>
        </div>
      )}

      {/* 昵称编辑弹窗 */}
      {showNicknameDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div 
            className="w-full max-w-sm rounded-2xl p-6 animate-in fade-in zoom-in duration-200 relative"
            style={{ 
              backgroundColor: theme.colors.surface,
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}
          >
            <button 
              onClick={() => setShowNicknameDialog(false)}
              className="absolute top-4 right-4 p-2 rounded-lg transition-transform active:scale-95"
              style={{ color: theme.colors.textSecondary }}
            >
              <X size={20} />
            </button>
            
            <div className="text-center mb-6">
              <h3 className="text-xl">修改昵称</h3>
            </div>

            <div className="mb-6">
              <p className="text-sm mb-4" style={{ color: theme.colors.textSecondary }}>
                请输入新的昵称（2-12个字符）
              </p>
              <Input
                type="text"
                placeholder="请输入昵称"
                value={tempNickname}
                onChange={(e) => setTempNickname(e.target.value.slice(0, 12))}
                className="w-full"
                maxLength={12}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowNicknameDialog(false)}
                className="flex-1 py-3 rounded-xl transition-colors text-center"
                style={{
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.textSecondary,
                }}
              >
                取消
              </button>
              <button
                onClick={handleNicknameSave}
                disabled={!tempNickname.trim() || tempNickname.trim().length < 2}
                className="flex-1 py-3 rounded-xl transition-all disabled:opacity-50 text-center"
                style={{
                  backgroundColor: theme.colors.primary,
                  color: '#FFFFFF',
                }}
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 通知设置页面
function NotificationSettingPage({ onBack }: { onBack: () => void }) {
  const { theme } = useTheme();
  const [settings, setSettings] = useState({
    diaryReminder: true,
    checkInReminder: true,
    systemNotification: true,
    activityNotification: false,
  });

  const handleToggle = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  return (
    <div className="h-full overflow-y-auto">
      {/* 头部 */}
      <div 
        className="px-6 pt-6 pb-4 flex items-center gap-4 sticky top-0 z-10"
        style={{ 
          backgroundColor: theme.colors.surface,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}
      >
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-lg transition-transform active:scale-95"
          style={{ color: theme.colors.textPrimary }}
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl">通知设置</h2>
      </div>

      <div className="px-6 pb-6 pt-4 space-y-4">
        {/* 日记提醒 */}
        <div 
          className="p-4 rounded-2xl flex items-center justify-between"
          style={{ 
            backgroundColor: theme.colors.surface,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <div className="flex-1">
            <div className="mb-1" style={{ color: theme.colors.textPrimary }}>
              日记提醒
            </div>
            <div className="text-sm" style={{ color: theme.colors.textSecondary }}>
              每日提醒您记录心情日记
            </div>
          </div>
          <Switch
            checked={settings.diaryReminder}
            onCheckedChange={() => handleToggle('diaryReminder')}
          />
        </div>

        {/* 签到提醒 */}
        <div 
          className="p-4 rounded-2xl flex items-center justify-between"
          style={{ 
            backgroundColor: theme.colors.surface,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <div className="flex-1">
            <div className="mb-1" style={{ color: theme.colors.textPrimary }}>
              签到提醒
            </div>
            <div className="text-sm" style={{ color: theme.colors.textSecondary }}>
              提醒您每日签到领取积分
            </div>
          </div>
          <Switch
            checked={settings.checkInReminder}
            onCheckedChange={() => handleToggle('checkInReminder')}
          />
        </div>

        {/* 系统通知 */}
        <div 
          className="p-4 rounded-2xl flex items-center justify-between"
          style={{ 
            backgroundColor: theme.colors.surface,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <div className="flex-1">
            <div className="mb-1" style={{ color: theme.colors.textPrimary }}>
              系统通知
            </div>
            <div className="text-sm" style={{ color: theme.colors.textSecondary }}>
              接收重要的系统消息通知
            </div>
          </div>
          <Switch
            checked={settings.systemNotification}
            onCheckedChange={() => handleToggle('systemNotification')}
          />
        </div>

        {/* 活动通知 */}
        <div 
          className="p-4 rounded-2xl flex items-center justify-between"
          style={{ 
            backgroundColor: theme.colors.surface,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <div className="flex-1">
            <div className="mb-1" style={{ color: theme.colors.textPrimary }}>
              活动通知
            </div>
            <div className="text-sm" style={{ color: theme.colors.textSecondary }}>
              接收优惠活动和新功能通知
            </div>
          </div>
          <Switch
            checked={settings.activityNotification}
            onCheckedChange={() => handleToggle('activityNotification')}
          />
        </div>

        {/* 提示信息 */}
        <div 
          className="p-4 rounded-xl text-sm"
          style={{ 
            backgroundColor: `${theme.colors.primary}10`,
            color: theme.colors.textSecondary 
          }}
        >
          <p>关闭通知后，您将不会收到相应的消息提醒。您可以随时在此页面重新开启。</p>
        </div>
      </div>
    </div>
  );
}

// 隐私设置页面
function PrivacySettingPage({ onBack }: { onBack: () => void }) {
  const { theme } = useTheme();
  const [currentPage, setCurrentPage] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    shareData: false,
    allowAnalytics: true,
    showOnlineStatus: false,
  });

  const handleToggle = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  // 如果打开了政策页面，显示对应页面
  if (currentPage === 'privacy-policy') {
    return <PrivacyPolicyPage onBack={() => setCurrentPage(null)} />;
  }
  if (currentPage === 'user-agreement') {
    return <UserAgreementPage onBack={() => setCurrentPage(null)} />;
  }

  return (
    <div className="h-full overflow-y-auto">
      {/* 头部 */}
      <div 
        className="px-6 pt-6 pb-4 flex items-center gap-4 sticky top-0 z-10"
        style={{ 
          backgroundColor: theme.colors.surface,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}
      >
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-lg transition-transform active:scale-95"
          style={{ color: theme.colors.textPrimary }}
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl">隐私设置</h2>
      </div>

      <div className="px-6 pb-6 pt-4 space-y-4">
        {/* 数据共享 */}
        <div 
          className="p-4 rounded-2xl flex items-center justify-between"
          style={{ 
            backgroundColor: theme.colors.surface,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <div className="flex-1">
            <div className="mb-1" style={{ color: theme.colors.textPrimary }}>
              允许数据共享
            </div>
            <div className="text-sm" style={{ color: theme.colors.textSecondary }}>
              与第三方服务共享匿名使用数据
            </div>
          </div>
          <Switch
            checked={settings.shareData}
            onCheckedChange={() => handleToggle('shareData')}
          />
        </div>

        {/* 数据分析 */}
        <div 
          className="p-4 rounded-2xl flex items-center justify-between"
          style={{ 
            backgroundColor: theme.colors.surface,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <div className="flex-1">
            <div className="mb-1" style={{ color: theme.colors.textPrimary }}>
              数据分析
            </div>
            <div className="text-sm" style={{ color: theme.colors.textSecondary }}>
              帮助我们改进产品体验
            </div>
          </div>
          <Switch
            checked={settings.allowAnalytics}
            onCheckedChange={() => handleToggle('allowAnalytics')}
          />
        </div>

        {/* 在线状态 */}
        <div 
          className="p-4 rounded-2xl flex items-center justify-between"
          style={{ 
            backgroundColor: theme.colors.surface,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <div className="flex-1">
            <div className="mb-1" style={{ color: theme.colors.textPrimary }}>
              显示在线状态
            </div>
            <div className="text-sm" style={{ color: theme.colors.textSecondary }}>
              让其他用户看到您的在线状态
            </div>
          </div>
          <Switch
            checked={settings.showOnlineStatus}
            onCheckedChange={() => handleToggle('showOnlineStatus')}
          />
        </div>

        {/* 隐私政策 */}
        <div 
          onClick={() => setCurrentPage('privacy-policy')}
          className="p-4 rounded-2xl cursor-pointer transition-colors hover:bg-black/5 active:bg-black/10"
          style={{ 
            backgroundColor: theme.colors.surface,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <div className="flex items-center justify-between">
            <span style={{ color: theme.colors.textPrimary }}>隐私政策</span>
            <ChevronRight size={18} style={{ color: theme.colors.textSecondary }} />
          </div>
        </div>

        {/* 用户协议 */}
        <div 
          onClick={() => setCurrentPage('user-agreement')}
          className="p-4 rounded-2xl cursor-pointer transition-colors hover:bg-black/5 active:bg-black/10"
          style={{ 
            backgroundColor: theme.colors.surface,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <div className="flex items-center justify-between">
            <span style={{ color: theme.colors.textPrimary }}>用户协议</span>
            <ChevronRight size={18} style={{ color: theme.colors.textSecondary }} />
          </div>
        </div>

        {/* 隐私承诺 */}
        <div 
          className="p-4 rounded-xl text-sm"
          style={{ 
            backgroundColor: `${theme.colors.primary}10`,
            color: theme.colors.textSecondary 
          }}
        >
          <div className="mb-2" style={{ color: theme.colors.primary }}>
            我们的隐私承诺
          </div>
          <p className="mb-2">• 您的日记内容完全私密，仅您可见</p>
          <p className="mb-2">• 我们不会出售您的个人信息</p>
          <p className="mb-2">• 所有数据传输均采用加密技术</p>
          <p>• 符合微信小程序隐私保护规范</p>
        </div>
      </div>
    </div>
  );
}

// 帮助中心页面
function HelpCenterPage({ onBack }: { onBack: () => void }) {
  const { theme } = useTheme();

  const faqs = [
    {
      question: '如何开始写日记？',
      answer: '在首页点击"+"按钮，选择"写日记"即可开始记录您的心情。您可以添加文字、图片，并选择情绪标签。'
    },
    {
      question: '如何获取积分？',
      answer: '您可以通过每日签到获得积分。连续签到7天、30天、100天还会获得额外奖励。积分可以用于解锁主题等功能。'
    },
    {
      question: '主题如何解锁？',
      answer: '主题分为四种类型：免费主题可直接使用，签到解锁主题需要连续签到指定天数，积分解锁主题需要消耗相应积分，付费主题需要使用心晴币购买。'
    },
    {
      question: '图文集是什么？',
      answer: '图文集可以将多篇日记整理成精美的合集，支持多种模板样式，方便您回顾和分享美好时光。'
    },
    {
      question: '如何保护我的隐私？',
      answer: '您的所有日记内容都是完全私密的，只有您自己可以查看。我们采用加密技术保护您的数据安全，绝不会泄露您的个人信息。'
    },
    {
      question: '心晴币如何获取？',
      answer: '心晴币可以通过以下方式获取：1. 充值中心购买（1元=10心晴币）；2. 连续签到30天赠送18枚心晴币；3. 连续签到88天赠送88枚心晴币。心晴币可用于购买付费主题（价格不超过99心晴币），但不可提现。'
    },
    {
      question: '如何备份我的日记？',
      answer: '在个人中心可以找到数据备份功能，支持导出您的日记数据到本地保存。'
    },
    {
      question: '遇到问题如何联系客服？',
      answer: '您可以通过"关于我们"页面中的邮箱联系我们，我们会尽快为您解答。'
    },
  ];

  return (
    <div className="h-full overflow-y-auto">
      {/* 头部 */}
      <div 
        className="px-6 pt-6 pb-4 flex items-center gap-4 sticky top-0 z-10"
        style={{ 
          backgroundColor: theme.colors.surface,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}
      >
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-lg transition-transform active:scale-95"
          style={{ color: theme.colors.textPrimary }}
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl">帮助中心</h2>
      </div>

      <div className="px-6 pb-6 pt-4">
        <div 
          className="p-4 rounded-2xl mb-6"
          style={{ 
            background: `linear-gradient(135deg, ${theme.colors.primary}20 0%, ${theme.colors.accent}20 100%)`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <HelpCircle size={24} style={{ color: theme.colors.primary }} />
            <span className="text-lg" style={{ color: theme.colors.textPrimary }}>
              常见问题
            </span>
          </div>
          <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
            这里收集了用户最常遇到的问题和解答
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="rounded-2xl overflow-hidden"
              style={{ 
                backgroundColor: theme.colors.surface,
                border: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
            >
              <AccordionTrigger 
                className="px-4 py-3 hover:no-underline"
                style={{ color: theme.colors.textPrimary }}
              >
                <div className="flex items-start gap-3 text-left">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs" 
                    style={{ 
                      backgroundColor: `${theme.colors.primary}20`,
                      color: theme.colors.primary 
                    }}
                  >
                    {index + 1}
                  </span>
                  <span>{faq.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent 
                className="px-4 pb-3 text-sm"
                style={{ color: theme.colors.textSecondary }}
              >
                <div className="pl-9">
                  {faq.answer}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* 联系客服 */}
        <div 
          className="mt-6 p-4 rounded-xl text-center"
          style={{ 
            backgroundColor: `${theme.colors.primary}10`,
            color: theme.colors.textSecondary 
          }}
        >
          <p className="mb-2">没有找到您需要的答案？</p>
          <p className="text-sm">请通过"关于我们"页面联系开发者</p>
        </div>
      </div>
    </div>
  );
}

// 关于我们页面
function AboutUsPage({ onBack }: { onBack: () => void }) {
  const { theme } = useTheme();
  const [currentPage, setCurrentPage] = useState<string | null>(null);

  // 如果打开了政策页面，显示对应页面
  if (currentPage === 'privacy-policy') {
    return <PrivacyPolicyPage onBack={() => setCurrentPage(null)} />;
  }
  if (currentPage === 'user-agreement') {
    return <UserAgreementPage onBack={() => setCurrentPage(null)} />;
  }

  return (
    <div className="h-full overflow-y-auto">
      {/* 头部 */}
      <div 
        className="px-6 pt-6 pb-4 flex items-center gap-4 sticky top-0 z-10"
        style={{ 
          backgroundColor: theme.colors.surface,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}
      >
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-lg transition-transform active:scale-95"
          style={{ color: theme.colors.textPrimary }}
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl">关于我们</h2>
      </div>

      <div className="px-6 pb-6 pt-4">
        {/* Logo 和 App 名称 */}
        <div className="text-center mb-8">
          <div 
            className="w-24 h-24 rounded-3xl mx-auto mb-4 flex items-center justify-center"
            style={{ 
              background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.accent} 100%)`,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
            }}
          >
            <Heart size={48} className="text-white" />
          </div>
          <h3 className="text-2xl mb-2" style={{ color: theme.colors.textPrimary }}>
            心晴日记
          </h3>
          <p style={{ color: theme.colors.textSecondary }}>
            记录心情，感受生活
          </p>
          <p className="text-sm mt-2" style={{ color: theme.colors.textSecondary }}>
            v1.0.0
          </p>
        </div>

        {/* 应用介绍 */}
        <div 
          className="p-4 rounded-2xl mb-4"
          style={{ 
            backgroundColor: theme.colors.surface,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <h4 className="mb-3" style={{ color: theme.colors.textPrimary }}>
            应用介绍
          </h4>
          <p className="text-sm leading-relaxed" style={{ color: theme.colors.textSecondary }}>
            心晴日记是一款专注于情绪记录的日记应用。通过记录每天的心情和生活点滴，帮助您更好地了解自己，发现生活中的美好时刻。我们提供了丰富的主题、精美的图文集模板，让记录变得更加有趣和有意义。
          </p>
        </div>

        {/* 开发者信息 */}
        <div 
          className="p-4 rounded-2xl mb-4"
          style={{ 
            backgroundColor: theme.colors.surface,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <h4 className="mb-3" style={{ color: theme.colors.textPrimary }}>
            开发者信息
          </h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <User size={18} style={{ color: theme.colors.primary }} />
              <span style={{ color: theme.colors.textSecondary }}>开发者：</span>
              <span style={{ color: theme.colors.textPrimary }}>于洛</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={18} style={{ color: theme.colors.primary }} />
              <span style={{ color: theme.colors.textSecondary }}>邮箱：</span>
              <a 
                href="mailto:13451101947@163.com"
                className="transition-colors"
                style={{ color: theme.colors.primary }}
              >
                13451101947@163.com
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Code size={18} style={{ color: theme.colors.primary }} />
              <span style={{ color: theme.colors.textSecondary }}>类型：</span>
              <span style={{ color: theme.colors.textPrimary }}>个人开发者</span>
            </div>
          </div>
        </div>

        {/* 功能特色 */}
        <div 
          className="p-4 rounded-2xl mb-4"
          style={{ 
            backgroundColor: theme.colors.surface,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <h4 className="mb-3" style={{ color: theme.colors.textPrimary }}>
            功能特色
          </h4>
          <div className="space-y-2 text-sm" style={{ color: theme.colors.textSecondary }}>
            <p>• 17款精美主题，支持自由切换</p>
            <p>• 每日签到系统，积分奖励丰富</p>
            <p>• 图文集功能，多种模板可选</p>
            <p>• AI辅助写作，记录更轻松</p>
            <p>• 数据安全加密，隐私严格保护</p>
          </div>
        </div>

        {/* 法律信息 */}
        <div 
          className="p-4 rounded-2xl mb-4"
          style={{ 
            backgroundColor: theme.colors.surface,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <h4 className="mb-3" style={{ color: theme.colors.textPrimary }}>
            法律信息
          </h4>
          <div className="space-y-2 text-sm">
            <div 
              onClick={() => setCurrentPage('user-agreement')}
              className="flex items-center justify-between cursor-pointer transition-colors hover:bg-black/5 active:bg-black/10 p-2 rounded-lg -mx-2"
            >
              <span style={{ color: theme.colors.textSecondary }}>用户协议</span>
              <ChevronRight size={16} style={{ color: theme.colors.textSecondary }} />
            </div>
            <div 
              onClick={() => setCurrentPage('privacy-policy')}
              className="flex items-center justify-between cursor-pointer transition-colors hover:bg-black/5 active:bg-black/10 p-2 rounded-lg -mx-2"
            >
              <span style={{ color: theme.colors.textSecondary }}>隐私政策</span>
              <ChevronRight size={16} style={{ color: theme.colors.textSecondary }} />
            </div>
          </div>
        </div>

        {/* 版权信息 */}
        <div 
          className="p-4 rounded-xl text-center text-sm"
          style={{ 
            backgroundColor: `${theme.colors.primary}10`,
            color: theme.colors.textSecondary 
          }}
        >
          <p className="mb-2">© 2025 心晴日记</p>
          <p className="text-xs">本应用遵循微信小程序开发规范</p>
        </div>
      </div>
    </div>
  );
}

// 隐私政策页面
function PrivacyPolicyPage({ onBack }: { onBack: () => void }) {
  const { theme } = useTheme();

  return (
    <div className="h-full overflow-y-auto">
      {/* 头部 */}
      <div 
        className="px-6 pt-6 pb-4 flex items-center gap-4 sticky top-0 z-10"
        style={{ 
          backgroundColor: theme.colors.surface,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}
      >
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-lg transition-transform active:scale-95"
          style={{ color: theme.colors.textPrimary }}
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl">隐私政策</h2>
      </div>

      <div className="px-6 pb-6 pt-4">
        {/* 更新日期 */}
        <div 
          className="p-3 rounded-xl mb-4 text-sm text-center"
          style={{ 
            backgroundColor: `${theme.colors.primary}10`,
            color: theme.colors.textSecondary 
          }}
        >
          最后更新日期：2025年1月1日
        </div>

        {/* 引言 */}
        <div 
          className="p-4 rounded-2xl mb-4"
          style={{ 
            backgroundColor: theme.colors.surface,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <p className="text-sm leading-relaxed" style={{ color: theme.colors.textSecondary }}>
            心晴日记（以下简称"我们"）非常重视用户的隐私和个人信息保护。本隐私政策将详细说明我们如何收集、使用、存储和保护您的个人信息。请您仔细阅读本隐私政策。
          </p>
        </div>

        {/* 1. 信息收集 */}
        <div 
          className="p-4 rounded-2xl mb-4"
          style={{ 
            backgroundColor: theme.colors.surface,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <h4 className="mb-3 flex items-center gap-2" style={{ color: theme.colors.textPrimary }}>
            <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs" 
              style={{ 
                backgroundColor: `${theme.colors.primary}20`,
                color: theme.colors.primary 
              }}
            >
              1
            </span>
            信息收集
          </h4>
          <div className="pl-8 space-y-3 text-sm" style={{ color: theme.colors.textSecondary }}>
            <div>
              <p className="mb-2" style={{ color: theme.colors.textPrimary }}>1.1 您主动提供的信息</p>
              <p>• 注册账号时提供的昵称、头像</p>
              <p>• 绑定手机号时提供的手机号码</p>
              <p>• 日记内容、图片、情绪标签等</p>
              <p>• 反馈和咨询时提供的信息</p>
            </div>
            <div>
              <p className="mb-2" style={{ color: theme.colors.textPrimary }}>1.2 自动收集的信息</p>
              <p>• 设备信息（设备型号、操作系统版本）</p>
              <p>• 使用信息（访问时间、功能使用情况）</p>
              <p>• 日志信息（IP地址、浏览器类型）</p>
            </div>
          </div>
        </div>

        {/* 2. 信息使用 */}
        <div 
          className="p-4 rounded-2xl mb-4"
          style={{ 
            backgroundColor: theme.colors.surface,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <h4 className="mb-3 flex items-center gap-2" style={{ color: theme.colors.textPrimary }}>
            <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs" 
              style={{ 
                backgroundColor: `${theme.colors.primary}20`,
                color: theme.colors.primary 
              }}
            >
              2
            </span>
            信息使用
          </h4>
          <div className="pl-8 space-y-2 text-sm" style={{ color: theme.colors.textSecondary }}>
            <p>• 提供、维护和改进我们的服务</p>
            <p>• 个性化您的使用体验</p>
            <p>• 处理您的请求和交易</p>
            <p>• 发送服务通知和更新</p>
            <p>• 保护账号安全，防止欺诈</p>
            <p>• 分析服务使用情况，改进产品</p>
          </div>
        </div>

        {/* 3. 信息存储 */}
        <div 
          className="p-4 rounded-2xl mb-4"
          style={{ 
            backgroundColor: theme.colors.surface,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <h4 className="mb-3 flex items-center gap-2" style={{ color: theme.colors.textPrimary }}>
            <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs" 
              style={{ 
                backgroundColor: `${theme.colors.primary}20`,
                color: theme.colors.primary 
              }}
            >
              3
            </span>
            信息存储
          </h4>
          <div className="pl-8 space-y-2 text-sm" style={{ color: theme.colors.textSecondary }}>
            <p>• 您的信息存储在中国境内的安全服务器</p>
            <p>• 采用行业标准的加密技术保护数据</p>
            <p>• 日记内容仅您本人可见，我们不会查看</p>
            <p>• 定期备份数据，防止数据丢失</p>
            <p>• 保留期限：账号存续期间及之后必要期限</p>
          </div>
        </div>

        {/* 4. 信息共享 */}
        <div 
          className="p-4 rounded-2xl mb-4"
          style={{ 
            backgroundColor: theme.colors.surface,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <h4 className="mb-3 flex items-center gap-2" style={{ color: theme.colors.textPrimary }}>
            <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs" 
              style={{ 
                backgroundColor: `${theme.colors.primary}20`,
                color: theme.colors.primary 
              }}
            >
              4
            </span>
            信息共享
          </h4>
          <div className="pl-8 space-y-2 text-sm" style={{ color: theme.colors.textSecondary }}>
            <p className="mb-2" style={{ color: theme.colors.textPrimary }}>我们不会出售您的个人信息。仅在以下情况下共享：</p>
            <p>• 获得您的明确同意</p>
            <p>• 与授权合作伙伴共享（如云存储服务商）</p>
            <p>• 法律要求或政府要求</p>
            <p>• 保护用户或公众的权益、财产或安全</p>
          </div>
        </div>

        {/* 5. 您的权利 */}
        <div 
          className="p-4 rounded-2xl mb-4"
          style={{ 
            backgroundColor: theme.colors.surface,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <h4 className="mb-3 flex items-center gap-2" style={{ color: theme.colors.textPrimary }}>
            <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs" 
              style={{ 
                backgroundColor: `${theme.colors.primary}20`,
                color: theme.colors.primary 
              }}
            >
              5
            </span>
            您的权利
          </h4>
          <div className="pl-8 space-y-2 text-sm" style={{ color: theme.colors.textSecondary }}>
            <p>• 访问和更新您的个人信息</p>
            <p>• 删除您的个人信息和账号</p>
            <p>• 撤回授权同意</p>
            <p>• 导出您的数据</p>
            <p>• 选择是否接收推送通知</p>
            <p>• 注销账号（将删除所有个人数据）</p>
          </div>
        </div>

        {/* 6. 未成年人保护 */}
        <div 
          className="p-4 rounded-2xl mb-4"
          style={{ 
            backgroundColor: theme.colors.surface,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <h4 className="mb-3 flex items-center gap-2" style={{ color: theme.colors.textPrimary }}>
            <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs" 
              style={{ 
                backgroundColor: `${theme.colors.primary}20`,
                color: theme.colors.primary 
              }}
            >
              6
            </span>
            未成年人保护
          </h4>
          <div className="pl-8 space-y-2 text-sm" style={{ color: theme.colors.textSecondary }}>
            <p>我们非常重视未成年人的隐私保护。如果您是未满18周岁的未成年人，请在监护人的陪同下阅读本政策，并在监护人同意的情况下使用我们的服务。</p>
          </div>
        </div>

        {/* 7. 微信小程序特殊说明 */}
        <div 
          className="p-4 rounded-2xl mb-4"
          style={{ 
            backgroundColor: theme.colors.surface,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <h4 className="mb-3 flex items-center gap-2" style={{ color: theme.colors.textPrimary }}>
            <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs" 
              style={{ 
                backgroundColor: `${theme.colors.primary}20`,
                color: theme.colors.primary 
              }}
            >
              7
            </span>
            微信小程序特殊说明
          </h4>
          <div className="pl-8 space-y-2 text-sm" style={{ color: theme.colors.textSecondary }}>
            <p>• 本应用遵循《微信小程序平台服务条款》</p>
            <p>• 符合微信小程序隐私保护开发者指引</p>
            <p>• 使用微信提供的手机号授权功能时，需要您的明确同意</p>
            <p>• 微信可能会收集部分设备信息用于小程序运行</p>
          </div>
        </div>

        {/* 8. 联系我们 */}
        <div 
          className="p-4 rounded-2xl mb-4"
          style={{ 
            backgroundColor: theme.colors.surface,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <h4 className="mb-3 flex items-center gap-2" style={{ color: theme.colors.textPrimary }}>
            <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs" 
              style={{ 
                backgroundColor: `${theme.colors.primary}20`,
                color: theme.colors.primary 
              }}
            >
              8
            </span>
            联系我们
          </h4>
          <div className="pl-8 text-sm" style={{ color: theme.colors.textSecondary }}>
            <p className="mb-2">如果您对本隐私政策有任何疑问、意见或建议，请通过以下方式联系我们：</p>
            <p className="flex items-center gap-2">
              <Mail size={16} style={{ color: theme.colors.primary }} />
              <a 
                href="mailto:13451101947@163.com"
                className="transition-colors"
                style={{ color: theme.colors.primary }}
              >
                13451101947@163.com
              </a>
            </p>
          </div>
        </div>

        {/* 政策变更 */}
        <div 
          className="p-4 rounded-xl text-sm"
          style={{ 
            backgroundColor: `${theme.colors.accent}10`,
            color: theme.colors.textSecondary 
          }}
        >
          <p className="mb-2" style={{ color: theme.colors.accent }}>政策变更说明</p>
          <p>我们可能会适时修订本隐私政策。如有重大变更，我们会通过应用内通知或其他方式告知您。继续使用我们的服务即表示您同意更新后的隐私���策。</p>
        </div>
      </div>
    </div>
  );
}

// 用户协议页面
function UserAgreementPage({ onBack }: { onBack: () => void }) {
  const { theme } = useTheme();

  return (
    <div className="h-full overflow-y-auto">
      {/* 头部 */}
      <div 
        className="px-6 pt-6 pb-4 flex items-center gap-4 sticky top-0 z-10"
        style={{ 
          backgroundColor: theme.colors.surface,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}
      >
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-lg transition-transform active:scale-95"
          style={{ color: theme.colors.textPrimary }}
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl">用户协议</h2>
      </div>

      <div className="px-6 pb-6 pt-4">
        {/* 更新日期 */}
        <div 
          className="p-3 rounded-xl mb-4 text-sm text-center"
          style={{ 
            backgroundColor: `${theme.colors.primary}10`,
            color: theme.colors.textSecondary 
          }}
        >
          最后更新日期：2025年1月1日
        </div>

        {/* 引言 */}
        <div 
          className="p-4 rounded-2xl mb-4"
          style={{ 
            backgroundColor: theme.colors.surface,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <p className="text-sm leading-relaxed" style={{ color: theme.colors.textSecondary }}>
            欢迎使用心晴日记！本协议是您与心晴日记（以下简称"我们"）之间的法律协议。请您在使用我们的服务前仔细阅读本协议。使用我们的服务即表示您同意本协议的所有条款。
          </p>
        </div>

        {/* 1. 服务说明 */}
        <div 
          className="p-4 rounded-2xl mb-4"
          style={{ 
            backgroundColor: theme.colors.surface,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <h4 className="mb-3 flex items-center gap-2" style={{ color: theme.colors.textPrimary }}>
            <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs" 
              style={{ 
                backgroundColor: `${theme.colors.primary}20`,
                color: theme.colors.primary 
              }}
            >
              1
            </span>
            服务说明
          </h4>
          <div className="pl-8 space-y-2 text-sm" style={{ color: theme.colors.textSecondary }}>
            <p>• 心晴日记是一款情绪日记记录应用</p>
            <p>• 提供日记创作、图文集制作、主题切换等功能</p>
            <p>• 部分功能可能需要消耗积分或心晴币</p>
            <p>• 我们保留随时修改或中止服务的权利</p>
          </div>
        </div>

        {/* 2. 账号注册 */}
        <div 
          className="p-4 rounded-2xl mb-4"
          style={{ 
            backgroundColor: theme.colors.surface,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <h4 className="mb-3 flex items-center gap-2" style={{ color: theme.colors.textPrimary }}>
            <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs" 
              style={{ 
                backgroundColor: `${theme.colors.primary}20`,
                color: theme.colors.primary 
              }}
            >
              2
            </span>
            账号注册与使用
          </h4>
          <div className="pl-8 space-y-2 text-sm" style={{ color: theme.colors.textSecondary }}>
            <p>• 您需要注册账号才能使用完整功能</p>
            <p>• 您应提供真实、准确的个人信息</p>
            <p>• 您对账号的安全负有责任</p>
            <p>• 不得将账号转让给他人使用</p>
            <p>• 发现账号被盗用应立即通知我们</p>
          </div>
        </div>

        {/* 3. 用户行为规范 */}
        <div 
          className="p-4 rounded-2xl mb-4"
          style={{ 
            backgroundColor: theme.colors.surface,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <h4 className="mb-3 flex items-center gap-2" style={{ color: theme.colors.textPrimary }}>
            <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs" 
              style={{ 
                backgroundColor: `${theme.colors.primary}20`,
                color: theme.colors.primary 
              }}
            >
              3
            </span>
            用户行为规范
          </h4>
          <div className="pl-8 space-y-3 text-sm" style={{ color: theme.colors.textSecondary }}>
            <div>
              <p className="mb-2" style={{ color: theme.colors.textPrimary }}>您同意不会：</p>
              <p>• 发布违法、暴力、色情等不良内容</p>
              <p>• 侵犯他人的知识产权或隐私权</p>
              <p>• 利用漏洞或技术手段获取非法利益</p>
              <p>• 干扰或破坏服务的正常运行</p>
              <p>• 进行任何商业推广或广告行为</p>
            </div>
          </div>
        </div>

        {/* 4. 内容权利 */}
        <div 
          className="p-4 rounded-2xl mb-4"
          style={{ 
            backgroundColor: theme.colors.surface,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <h4 className="mb-3 flex items-center gap-2" style={{ color: theme.colors.textPrimary }}>
            <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs" 
              style={{ 
                backgroundColor: `${theme.colors.primary}20`,
                color: theme.colors.primary 
              }}
            >
              4
            </span>
            内容权利
          </h4>
          <div className="pl-8 space-y-2 text-sm" style={{ color: theme.colors.textSecondary }}>
            <p>• 您创作的日记内容归您所有</p>
            <p>• 您授权我们存储和备份您的内容</p>
            <p>• 我们不会未经授权使用您的内容</p>
            <p>• 应用的设计、商标等归我们所有</p>
            <p>• 未经许可不得复制或修改应用内容</p>
          </div>
        </div>

        {/* 5. 虚拟货币 */}
        <div 
          className="p-4 rounded-2xl mb-4"
          style={{ 
            backgroundColor: theme.colors.surface,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <h4 className="mb-3 flex items-center gap-2" style={{ color: theme.colors.textPrimary }}>
            <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs" 
              style={{ 
                backgroundColor: `${theme.colors.primary}20`,
                color: theme.colors.primary 
              }}
            >
              5
            </span>
            积分与虚拟货币
          </h4>
          <div className="pl-8 space-y-2 text-sm" style={{ color: theme.colors.textSecondary }}>
            <p>• 积分可通过签到等方式获得</p>
            <p>• 心晴币需要通过充值购买</p>
            <p>• 虚拟货币不可兑换成现金</p>
            <p>• 账号注销后虚拟货币将被清空</p>
            <p>• 我们保留调整虚拟货币政策的权利</p>
          </div>
        </div>

        {/* 6. 免责声明 */}
        <div 
          className="p-4 rounded-2xl mb-4"
          style={{ 
            backgroundColor: theme.colors.surface,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <h4 className="mb-3 flex items-center gap-2" style={{ color: theme.colors.textPrimary }}>
            <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs" 
              style={{ 
                backgroundColor: `${theme.colors.primary}20`,
                color: theme.colors.primary 
              }}
            >
              6
            </span>
            免责声明
          </h4>
          <div className="pl-8 space-y-2 text-sm" style={{ color: theme.colors.textSecondary }}>
            <p>• 服务按"现状"提供，不做任何明示或暗示的保证</p>
            <p>• 不保证服务不会中断或完全没有错误</p>
            <p>• 因不可抗力导致的服务中断不承担责任</p>
            <p>• 建议您定期备份重要数据</p>
            <p>• 因用户违规使用导致的损失我们不承担责任</p>
          </div>
        </div>

        {/* 7. 协议变更 */}
        <div 
          className="p-4 rounded-2xl mb-4"
          style={{ 
            backgroundColor: theme.colors.surface,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <h4 className="mb-3 flex items-center gap-2" style={{ color: theme.colors.textPrimary }}>
            <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs" 
              style={{ 
                backgroundColor: `${theme.colors.primary}20`,
                color: theme.colors.primary 
              }}
            >
              7
            </span>
            协议变更与终止
          </h4>
          <div className="pl-8 space-y-2 text-sm" style={{ color: theme.colors.textSecondary }}>
            <p>• 我们可能会适时修订本协议</p>
            <p>• 重大变更会提前通知您</p>
            <p>• 继续使用服务表示接受新协议</p>
            <p>• 您可以随时注销账号终止服务</p>
            <p>• 违反协议可能导致账号被封禁</p>
          </div>
        </div>

        {/* 8. 法律适用 */}
        <div 
          className="p-4 rounded-2xl mb-4"
          style={{ 
            backgroundColor: theme.colors.surface,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <h4 className="mb-3 flex items-center gap-2" style={{ color: theme.colors.textPrimary }}>
            <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs" 
              style={{ 
                backgroundColor: `${theme.colors.primary}20`,
                color: theme.colors.primary 
              }}
            >
              8
            </span>
            法律适用与争议解决
          </h4>
          <div className="pl-8 space-y-2 text-sm" style={{ color: theme.colors.textSecondary }}>
            <p>• 本协议适用中华人民共和国法律</p>
            <p>• 遵守《微信小程序平台服务条款》</p>
            <p>• 因本协议产生的争议应友好协商解决</p>
            <p>• 协商不成可向开发者所在地法院提起诉讼</p>
          </div>
        </div>

        {/* 9. 联系方式 */}
        <div 
          className="p-4 rounded-2xl mb-4"
          style={{ 
            backgroundColor: theme.colors.surface,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <h4 className="mb-3 flex items-center gap-2" style={{ color: theme.colors.textPrimary }}>
            <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs" 
              style={{ 
                backgroundColor: `${theme.colors.primary}20`,
                color: theme.colors.primary 
              }}
            >
              9
            </span>
            联系我们
          </h4>
          <div className="pl-8 text-sm" style={{ color: theme.colors.textSecondary }}>
            <p className="mb-3">如果您对本协议有任何疑问，请联系：</p>
            <div className="space-y-2">
              <p>开发者：于洛</p>
              <p className="flex items-center gap-2">
                <Mail size={16} style={{ color: theme.colors.primary }} />
                <a 
                  href="mailto:13451101947@163.com"
                  className="transition-colors"
                  style={{ color: theme.colors.primary }}
                >
                  13451101947@163.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* 协议确认 */}
        <div 
          className="p-4 rounded-xl text-sm"
          style={{ 
            backgroundColor: `${theme.colors.accent}10`,
            color: theme.colors.textSecondary 
          }}
        >
          <p className="mb-2" style={{ color: theme.colors.accent }}>协议确认</p>
          <p>使用心晴日记服务即表示您已阅读、理解并同意遵守本用户协议。感谢您的信任与支持！</p>
        </div>
      </div>
    </div>
  );
}
