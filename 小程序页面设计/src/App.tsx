import React, { useState, createContext, useContext } from 'react';
import { Home, BookOpen, Palette, User, Plus, Image } from 'lucide-react';
import HomePage from './components/HomePage';
import DiaryList from './components/DiaryList';
import CreateDiary from './components/CreateDiary';
import ThemeStore from './components/ThemeStore';
import AlbumList from './components/AlbumList';
import UserCenter from './components/UserCenter';
import CheckIn from './components/CheckIn';
import Recharge from './components/Recharge';

// 主题配置
const themes = {
  // 免费主题
  'pink-girl': {
    id: 'pink-girl',
    name: '粉色少女',
    type: 'free',
    colors: {
      primary: '#FFB6C1',
      secondary: '#FFC0CB',
      accent: '#FF69B4',
      background: 'linear-gradient(135deg, #FFF5F7 0%, #FFE5EC 100%)',
      surface: '#FFFFFF',
      textPrimary: '#2D1B2E',
      textSecondary: '#9D6B84',
      border: '#FFD4E5',
    },
    effects: {
      buttonStyle: 'fluffy', // 毛茸茸效果
      cardShadow: '0 8px 16px rgba(255, 182, 193, 0.3)',
      cardRadius: '24px',
      textShadow: 'none',
    }
  },
  'green-fresh': {
    id: 'green-fresh',
    name: '绿意盎然',
    type: 'free',
    colors: {
      primary: '#4CAF50',
      secondary: '#8BC34A',
      accent: '#81C784',
      background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
      surface: '#FFFFFF',
      textPrimary: '#1B5E20',
      textSecondary: '#558B2F',
      border: '#A5D6A7',
    },
    effects: {
      buttonStyle: 'glossy', // 光泽效果
      cardShadow: '0 4px 12px rgba(76, 175, 80, 0.2)',
      cardRadius: '16px',
      textShadow: 'none',
      buttonGradient: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
    }
  },
  'dark-mode': {
    id: 'dark-mode',
    name: '暗夜星辰',
    type: 'free',
    colors: {
      primary: '#BB86FC',
      secondary: '#03DAC6',
      accent: '#CF6679',
      background: 'linear-gradient(135deg, #121212 0%, #1E1E1E 100%)',
      surface: '#2C2C2C',
      textPrimary: '#FFFFFF',
      textSecondary: '#B3B3B3',
      border: '#444444',
    },
    effects: {
      buttonStyle: 'neon', // 霓虹效果
      cardShadow: '0 8px 32px rgba(187, 134, 252, 0.3)',
      cardRadius: '20px',
      textShadow: '0 0 10px rgba(187, 134, 252, 0.5)',
      buttonGlow: '0 0 20px rgba(187, 134, 252, 0.6)',
    }
  },
  'lavender-dream': {
    id: 'lavender-dream',
    name: '薰衣草梦境',
    type: 'free',
    colors: {
      primary: '#9B7EBD',
      secondary: '#D4A5E0',
      accent: '#B695C0',
      background: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)',
      surface: '#FFFFFF',
      textPrimary: '#4A148C',
      textSecondary: '#7B1FA2',
      border: '#CE93D8',
    },
    effects: {
      buttonStyle: 'soft', // 柔和效果
      cardShadow: '0 8px 24px rgba(155, 126, 189, 0.25)',
      cardRadius: '20px',
      textShadow: 'none',
    }
  },
  'coral-beach': {
    id: 'coral-beach',
    name: '珊瑚海滩',
    type: 'free',
    colors: {
      primary: '#FF7F7F',
      secondary: '#FFB3B3',
      accent: '#FF6B6B',
      background: 'linear-gradient(135deg, #FFF4E6 0%, #FFE0CC 100%)',
      surface: '#FFFFFF',
      textPrimary: '#8B4513',
      textSecondary: '#CD853F',
      border: '#FFB366',
    },
    effects: {
      buttonStyle: 'warm',
      cardShadow: '0 6px 20px rgba(255, 127, 127, 0.25)',
      cardRadius: '18px',
      textShadow: 'none',
    }
  },
  'mint-fresh': {
    id: 'mint-fresh',
    name: '薄荷清新',
    type: 'free',
    colors: {
      primary: '#5DD39E',
      secondary: '#BCE5D6',
      accent: '#3FB67E',
      background: 'linear-gradient(135deg, #E0F7F4 0%, #C2F3E0 100%)',
      surface: '#FFFFFF',
      textPrimary: '#004D40',
      textSecondary: '#00796B',
      border: '#80CBC4',
    },
    effects: {
      buttonStyle: 'glossy',
      cardShadow: '0 4px 16px rgba(93, 211, 158, 0.2)',
      cardRadius: '16px',
      textShadow: 'none',
      buttonGradient: 'linear-gradient(135deg, #5DD39E 0%, #3FB67E 100%)',
    }
  },
  'sky-blue': {
    id: 'sky-blue',
    name: '天空之蓝',
    type: 'free',
    colors: {
      primary: '#4FC3F7',
      secondary: '#81D4FA',
      accent: '#29B6F6',
      background: 'linear-gradient(135deg, #E1F5FE 0%, #B3E5FC 100%)',
      surface: '#FFFFFF',
      textPrimary: '#01579B',
      textSecondary: '#0277BD',
      border: '#4FC3F7',
    },
    effects: {
      buttonStyle: 'airy',
      cardShadow: '0 6px 20px rgba(79, 195, 247, 0.25)',
      cardRadius: '20px',
      textShadow: 'none',
    }
  },
  'peach-blossom': {
    id: 'peach-blossom',
    name: '桃花粉嫩',
    type: 'free',
    colors: {
      primary: '#FFAB91',
      secondary: '#FFCCBC',
      accent: '#FF8A65',
      background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
      surface: '#FFFFFF',
      textPrimary: '#E64A19',
      textSecondary: '#FF5722',
      border: '#FFAB91',
    },
    effects: {
      buttonStyle: 'soft',
      cardShadow: '0 8px 20px rgba(255, 171, 145, 0.3)',
      cardRadius: '22px',
      textShadow: 'none',
    }
  },
  // 签到解锁主题
  'cherry-blossom': {
    id: 'cherry-blossom',
    name: '樱花季节',
    type: 'signin',
    signinDays: 7,
    colors: {
      primary: '#FFB7C5',
      secondary: '#FFC9D9',
      accent: '#FF9EB1',
      background: 'linear-gradient(135deg, #FFF0F5 0%, #FFE4EC 100%)',
      surface: '#FFFFFF',
      textPrimary: '#8B2E4A',
      textSecondary: '#C54A6A',
      border: '#FFD4E0',
    },
    effects: {
      buttonStyle: 'fluffy',
      cardShadow: '0 8px 24px rgba(255, 183, 197, 0.3)',
      cardRadius: '24px',
      textShadow: 'none',
    }
  },
  'autumn-maple': {
    id: 'autumn-maple',
    name: '秋日枫叶',
    type: 'signin',
    signinDays: 15,
    colors: {
      primary: '#E67E22',
      secondary: '#F39C12',
      accent: '#D35400',
      background: 'linear-gradient(135deg, #FFF5E8 0%, #FFE5CC 100%)',
      surface: '#FFFFFF',
      textPrimary: '#8B4513',
      textSecondary: '#A0522D',
      border: '#F4A460',
    },
    effects: {
      buttonStyle: 'warm',
      cardShadow: '0 8px 24px rgba(230, 126, 34, 0.3)',
      cardRadius: '20px',
      textShadow: 'none',
    }
  },
  'winter-snow': {
    id: 'winter-snow',
    name: '冬日雪境',
    type: 'signin',
    signinDays: 30,
    colors: {
      primary: '#B0C4DE',
      secondary: '#ADD8E6',
      accent: '#87CEEB',
      background: 'linear-gradient(135deg, #F0F8FF 0%, #E6F2FF 100%)',
      surface: '#FFFFFF',
      textPrimary: '#2F4F4F',
      textSecondary: '#4682B4',
      border: '#B0E0E6',
    },
    effects: {
      buttonStyle: 'frost',
      cardShadow: '0 8px 32px rgba(176, 196, 222, 0.4)',
      cardRadius: '20px',
      textShadow: 'none',
    }
  },
  // 积分解锁主题
  'starry-sky': {
    id: 'starry-sky',
    name: '璀璨星空',
    type: 'points',
    pointsCost: 300,
    colors: {
      primary: '#4A90E2',
      secondary: '#7B68EE',
      accent: '#00BFFF',
      background: 'linear-gradient(135deg, #1A237E 0%, #283593 100%)',
      surface: 'rgba(255, 255, 255, 0.95)',
      textPrimary: '#1A237E',
      textSecondary: '#5C6BC0',
      border: '#9FA8DA',
    },
    effects: {
      buttonStyle: 'starry',
      cardShadow: '0 8px 32px rgba(74, 144, 226, 0.4)',
      cardRadius: '20px',
      textShadow: '0 0 8px rgba(74, 144, 226, 0.3)',
    }
  },
  'golden-sunset': {
    id: 'golden-sunset',
    name: '金色余晖',
    type: 'points',
    pointsCost: 300,
    colors: {
      primary: '#FFB74D',
      secondary: '#FFA726',
      accent: '#FF9800',
      background: 'linear-gradient(135deg, #FFF8E1 0%, #FFE0B2 100%)',
      surface: '#FFFFFF',
      textPrimary: '#E65100',
      textSecondary: '#F57C00',
      border: '#FFCC80',
    },
    effects: {
      buttonStyle: 'golden',
      cardShadow: '0 8px 24px rgba(255, 183, 77, 0.35)',
      cardRadius: '18px',
      textShadow: 'none',
      buttonGradient: 'linear-gradient(135deg, #FFD54F 0%, #FFB74D 100%)',
    }
  },
  'klein-blue': {
    id: 'klein-blue',
    name: '克莱因蓝',
    type: 'points',
    pointsCost: 300,
    colors: {
      primary: '#002FA7',
      secondary: '#0047AB',
      accent: '#4169E1',
      background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
      surface: '#FFFFFF',
      textPrimary: '#01579B',
      textSecondary: '#0277BD',
      border: '#81D4FA',
    },
    effects: {
      buttonStyle: 'deep',
      cardShadow: '0 8px 32px rgba(0, 47, 167, 0.3)',
      cardRadius: '16px',
      textShadow: 'none',
    }
  },
  'rose-gold': {
    id: 'rose-gold',
    name: '玫瑰金',
    type: 'points',
    pointsCost: 500,
    colors: {
      primary: '#E8A0A0',
      secondary: '#F5C6C6',
      accent: '#D87093',
      background: 'linear-gradient(135deg, #FFF0F5 0%, #FFE4E8 100%)',
      surface: '#FFFFFF',
      textPrimary: '#8B4A5E',
      textSecondary: '#B76E79',
      border: '#F2B8C6',
    },
    effects: {
      buttonStyle: 'metallic',
      cardShadow: '0 8px 24px rgba(232, 160, 160, 0.35)',
      cardRadius: '20px',
      textShadow: 'none',
      buttonGradient: 'linear-gradient(135deg, #F5C6C6 0%, #E8A0A0 100%)',
    }
  },
  // 付费主题（使用心晴币）
  'aurora': {
    id: 'aurora',
    name: '极光幻境',
    type: 'premium',
    price: 99,
    colors: {
      primary: '#00D9FF',
      secondary: '#7B2FFF',
      accent: '#FF1744',
      background: 'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)',
      surface: 'rgba(255, 255, 255, 0.9)',
      textPrimary: '#1A1A2E',
      textSecondary: '#16213E',
      border: '#0F3460',
    },
    effects: {
      buttonStyle: 'aurora',
      cardShadow: '0 8px 32px rgba(0, 217, 255, 0.4)',
      cardRadius: '24px',
      textShadow: '0 0 10px rgba(0, 217, 255, 0.5)',
      buttonGradient: 'linear-gradient(135deg, #00D9FF 0%, #7B2FFF 100%)',
    }
  },
  'galaxy': {
    id: 'galaxy',
    name: '银河星系',
    type: 'premium',
    price: 129,
    colors: {
      primary: '#9D50BB',
      secondary: '#6E48AA',
      accent: '#FF6B9D',
      background: 'linear-gradient(135deg, #2E1437 0%, #4A235A 50%, #6C3483 100%)',
      surface: 'rgba(255, 255, 255, 0.92)',
      textPrimary: '#1A0B2E',
      textSecondary: '#3D2463',
      border: '#7D3C98',
    },
    effects: {
      buttonStyle: 'cosmic',
      cardShadow: '0 8px 32px rgba(157, 80, 187, 0.5)',
      cardRadius: '24px',
      textShadow: '0 0 8px rgba(157, 80, 187, 0.4)',
      buttonGradient: 'linear-gradient(135deg, #9D50BB 0%, #6E48AA 100%)',
    }
  },
};

// 创建主题上下文
const ThemeContext = createContext<any>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentTheme, setCurrentTheme] = useState(themes['pink-girl']);
  const [userPoints, setUserPoints] = useState(150);
  const [userCoins, setUserCoins] = useState(100); // 心晴币
  const [continuousDays, setContinuousDays] = useState(7);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [unlockedThemes, setUnlockedThemes] = useState<string[]>(['pink-girl', 'green-fresh', 'dark-mode', 'lavender-dream', 'coral-beach', 'mint-fresh', 'sky-blue', 'peach-blossom']);
  const [diaries, setDiaries] = useState<any[]>([
    {
      id: 1,
      title: '春日午后的温暖时光',
      content: '阳光透过树叶的缝隙洒落下来，斑驳的光影在地面上跳跃。我和好友漫步在公园的小径上，春风拂面，带来花香的气息。我们聊着彼此的梦想和近况，笑声在空气中回荡。这样简单而美好的时刻，让我感受到生活的温柔与美好。',
      date: '2025-01-15',
      time: '15:30',
      weather: '晴天',
      mood: '开心',
      tags: ['开心', '好友', '晴天'],
      images: ['https://images.unsplash.com/photo-1654281436853-fc0f3fe2d4e2?w=800'],
    },
    {
      id: 2,
      title: '项目完成的成就感',
      content: '经过一个月的努力，项目终于顺利交付了。虽然加班到深夜让我疲惫不堪，但看到客户满意的笑容，所有的辛苦都值得了。团队的每一位成员都全力以赴，这种并肩作战的感觉真好。今晚要好好休息，犒劳一下自己。',
      date: '2025-01-14',
      time: '22:45',
      weather: '多云',
      mood: '满足',
      tags: ['工作', '满足'],
      images: [],
    },
    {
      id: 3,
      title: '咖啡馆的悠闲下午',
      content: '找了一家安静的咖啡馆，点了一杯拿铁，窝在角落的沙发里看书。窗外细雨绵绵，雨滴打在玻璃上发出轻柔的声音。这样的雨天最适合静下心来，让思绪随着书页流淌。偶尔抬头看看窗外，感受这份难得的宁静。',
      date: '2025-01-13',
      time: '14:20',
      weather: '雨天',
      mood: '平静',
      tags: ['独处', '阅读', '雨天', '平静'],
      images: ['https://images.unsplash.com/photo-1611571741792-edb58d0ceb67?w=800'],
    },
    {
      id: 4,
      title: '周末的美食探店',
      content: '今天和闺蜜一起去探索了一家新开的日料店。从装修到菜品都精致得让人惊叹，每一道菜都像艺术品。我们边吃边拍照，聊着最近的趣事。美食配美景，再加上好友的陪伴，这就是生活最美好的样子。',
      date: '2025-01-12',
      time: '18:00',
      weather: '晴天',
      mood: '开心',
      tags: ['美食', '好友', '开心'],
      images: ['https://images.unsplash.com/photo-1596748401458-0df74b2baf9b?w=800', 'https://images.unsplash.com/photo-1654281436853-fc0f3fe2d4e2?w=800'],
    },
    {
      id: 5,
      title: '清晨的慢跑时光',
      content: '早起去公园慢跑，清晨的空气格外清新。阳光刚刚升起，给整个世界镀上一层金色。跑步的时候听着喜欢的音乐，感觉整个人都充满了活力。运动后的多巴胺让人心情愉悦，新的一天从元气满满开始！',
      date: '2025-01-11',
      time: '06:30',
      weather: '晴天',
      mood: '快乐',
      tags: ['运动', '晴天', '快乐'],
      images: [],
    },
    {
      id: 6,
      title: '家人团聚的温馨夜晚',
      content: '好久没回家了，今天特意请假回去陪父母。妈妈做了一桌子我爱吃的菜，爸爸则絮絮叨叨地关心我的工作和生活。晚饭后一家人坐在客厅聊天，这种简单的陪伴让我深深感受到家的温暖。家，永远是最温暖的港湾。',
      date: '2025-01-10',
      time: '19:30',
      weather: '多云',
      mood: '幸福',
      tags: ['家人', '感动', '幸福'],
      images: [],
    },
    {
      id: 7,
      title: '深夜的思绪万千',
      content: '夜深人静的时候，总是容易陷入沉思。回顾这一年的经历，有欢笑也有泪水，有收获也有遗憾。但正是这些经历，让我成长为更好的自己。人生就像一场旅行，重要的不是目的地，而是沿途的风景和心情。',
      date: '2025-01-09',
      tags: ['独处', '平静', '阴天'],
      images: [],
    },
    {
      id: 8,
      title: '书店里的意外收获',
      content: '逛书店时无意中发现了一本很棒的书，作者的文字充满哲思和温度。在书店的角落坐了一下午，沉浸在文字的世界里。这种精神上的富足，是任何物质都无法比拟的。决定把这本书带回家，慢慢品读。',
      date: '2025-01-08',
      tags: ['阅读', '独处', '满足'],
      images: ['https://images.unsplash.com/photo-1611571741792-edb58d0ceb67?w=800'],
    },
    {
      id: 9,
      title: '音乐会的震撼体验',
      content: '参加了一场古典音乐会，现场演奏的震撼力直击心灵。当音乐响起的那一刻，全场寂静，所有人都沉浸在美妙的旋律中。艺术的力量就是这样神奇，能让人忘却烦恼，只专注于当下的美好。这是一次难忘的文化体验。',
      date: '2025-01-07',
      tags: ['激动', '感动', '日常'],
      images: [],
    },
    {
      id: 10,
      title: '周末的大扫除',
      content: '花了一整天时间整理房间，丢掉了很多不需要的东西。看着整洁有序的空间，心情也跟着明朗起来。有时候，生活需要做减法，断舍离不仅是整理物品，更是整理心情。一个干净的环境，真的能带来好心情。',
      date: '2025-01-06',
      tags: ['日常', '满足'],
      images: [],
    },
    {
      id: 11,
      title: '雨后的彩虹惊喜',
      content: '下午的一场大雨过后，天空出现了绚丽的彩虹。我赶紧拿起手机记录下这美丽的瞬间。大自然总是能给我们意外的惊喜，提醒我们即使经历风雨，也会有彩虹相伴。这个画面会成为我美好的回忆。',
      date: '2025-01-05',
      tags: ['晴天', '开心', '快乐'],
      images: ['https://images.unsplash.com/photo-1674880809857-1883c95ef06a?w=800'],
    },
    {
      id: 12,
      title: '新年的美好计划',
      content: '坐下来认真思考了新一年的目标和计划。想要学习一门新技能，保持运动习惯，多读几本好书，也要多陪伴家人朋友。虽然生活不会因为新年就突然改变，但有目标和期待，就有前进的动力。新的一年，继续加油！',
      date: '2025-01-04',
      tags: ['学习', '独处', '平静'],
      images: [],
    },
    {
      id: 13,
      title: '老友重逢的喜悦',
      content: '多年不见的老朋友突然来到这座城市，我们约在熟悉的餐厅见面。时光仿佛回到了从前，我们聊着过去的趣事，也分享着各自的现在。真正的友谊不会因为时间和距离而褪色，重逢的那一刻，一切都还是那么熟悉和温暖。',
      date: '2025-01-03',
      tags: ['好友', '聚会', '开心', '感动'],
      images: [],
    },
    {
      id: 14,
      title: '摄影展的艺术熏陶',
      content: '去看了一个摄影展，每一张照片都讲述着不同的故事。摄影师用镜头捕捉生活中的美好瞬间，让我重新审视日常中被忽略的细节。艺术就是这样，能让我们用不同的角度看世界，发现生活中更多的可能性。',
      date: '2025-01-02',
      tags: ['日常', '感动', '满足'],
      images: ['https://images.unsplash.com/photo-1596748401458-0df74b2baf9b?w=800'],
    },
    {
      id: 15,
      title: '新年第一天的美好开始',
      content: '新年的第一天，以一个美好的早晨开始。阳光明媚，心情舒畅。给自己做了一顿丰盛的早餐，慢慢享用。新的一年，要好好爱自己，认真对待每一天。愿所有的美好都如约而至，所有的努力都能开花结果。',
      date: '2025-01-01',
      tags: ['开心', '幸福', '晴天', '美食'],
      images: ['https://images.unsplash.com/photo-1654281436853-fc0f3fe2d4e2?w=800', 'https://images.unsplash.com/photo-1611571741792-edb58d0ceb67?w=800'],
    },
  ]);

  const [albums, setAlbums] = useState<any[]>([]);

  const themeContextValue = {
    theme: currentTheme,
    setTheme: setCurrentTheme,
    themes: Object.values(themes),
    userPoints,
    setUserPoints,
    userCoins,
    setUserCoins,
    diaries,
    setDiaries,
    albums,
    setAlbums,
    continuousDays,
    setContinuousDays,
    hasCheckedInToday,
    setHasCheckedInToday,
    unlockedThemes,
    setUnlockedThemes,
    setCurrentPage,
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'diary':
        return <DiaryList />;
      case 'create':
        return <CreateDiary onBack={() => setCurrentPage('diary')} />;
      case 'album':
        return <AlbumList />;
      case 'theme':
        return <ThemeStore />;
      case 'checkin':
        return <CheckIn />;
      case 'recharge':
        return <Recharge />;
      case 'user':
        return <UserCenter />;
      default:
        return <HomePage />;
    }
  };

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <div 
        className="h-screen relative overflow-hidden flex flex-col"
        style={{ 
          background: currentTheme.colors.background,
          color: currentTheme.colors.textPrimary
        }}
      >
        {/* 主内容区 */}
        <div className="flex-1 overflow-hidden">
          {renderPage()}
        </div>

        {/* 底部导航栏 */}
        <nav 
          className="flex-shrink-0 border-t backdrop-blur-lg z-50"
          style={{
            backgroundColor: `${currentTheme.colors.surface}E6`,
            borderColor: currentTheme.colors.border
          }}
        >
          <div className="flex items-center justify-around h-16 max-w-md mx-auto">
            <NavItem
              icon={<Home size={24} />}
              label="首页"
              active={currentPage === 'home'}
              onClick={() => setCurrentPage('home')}
            />
            <NavItem
              icon={<BookOpen size={24} />}
              label="日记"
              active={currentPage === 'diary'}
              onClick={() => setCurrentPage('diary')}
            />
            <NavItem
              icon={<Image size={24} />}
              label="图文集"
              active={currentPage === 'album'}
              onClick={() => setCurrentPage('album')}
            />
            <NavItem
              icon={<Palette size={24} />}
              label="主题"
              active={currentPage === 'theme'}
              onClick={() => setCurrentPage('theme')}
            />
            <NavItem
              icon={<User size={24} />}
              label="我的"
              active={currentPage === 'user'}
              onClick={() => setCurrentPage('user')}
            />
          </div>
        </nav>

        {/* 悬浮创建按钮 */}
        {currentPage === 'diary' && (
          <button
            onClick={() => setCurrentPage('create')}
            className="fixed bottom-24 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-40 transition-transform hover:scale-110 active:scale-95"
            style={{
              backgroundColor: currentTheme.colors.primary,
              color: '#FFFFFF'
            }}
          >
            <Plus size={28} />
          </button>
        )}
      </div>
    </ThemeContext.Provider>
  );
}

function NavItem({ icon, label, active, onClick }: any) {
  const { theme } = useTheme();
  
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-1 min-w-[60px] transition-colors"
      style={{
        color: active ? theme.colors.primary : theme.colors.textSecondary
      }}
    >
      {icon}
      <span className="text-xs">{label}</span>
    </button>
  );
}
