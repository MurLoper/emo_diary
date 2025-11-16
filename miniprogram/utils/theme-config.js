// 主题配置文件 - 18个完整主题
const THEME_CONFIGS = {
  // 免费主题
  'pink-girl': {
    id: 'pink-girl',
    name: '粉色少女',
    type: 'free',
    colors: {
      primary: '#FFB6C1',
      secondary: '#FFC0CB',
      accent: '#FF69B4',
      background: '#FFF5F7',
      surface: '#FFFFFF',
      textPrimary: '#2D1B2E',
      textSecondary: '#9D6B84',
      border: '#FFD4E5'
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
      background: '#E8F5E9',
      surface: '#FFFFFF',
      textPrimary: '#1B5E20',
      textSecondary: '#558B2F',
      border: '#A5D6A7'
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
      background: '#121212',
      surface: '#2C2C2C',
      textPrimary: '#FFFFFF',
      textSecondary: '#B3B3B3',
      border: '#444444'
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
      background: '#F3E5F5',
      surface: '#FFFFFF',
      textPrimary: '#4A148C',
      textSecondary: '#7B1FA2',
      border: '#CE93D8'
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
      background: '#FFF4E6',
      surface: '#FFFFFF',
      textPrimary: '#8B4513',
      textSecondary: '#CD853F',
      border: '#FFB366'
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
      background: '#E0F7F4',
      surface: '#FFFFFF',
      textPrimary: '#004D40',
      textSecondary: '#00796B',
      border: '#80CBC4'
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
      background: '#E1F5FE',
      surface: '#FFFFFF',
      textPrimary: '#01579B',
      textSecondary: '#0277BD',
      border: '#4FC3F7'
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
      background: '#FFF3E0',
      surface: '#FFFFFF',
      textPrimary: '#E64A19',
      textSecondary: '#FF5722',
      border: '#FFAB91'
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
      background: '#FFF0F5',
      surface: '#FFFFFF',
      textPrimary: '#8B2E4A',
      textSecondary: '#C54A6A',
      border: '#FFD4E0'
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
      background: '#FFF5E8',
      surface: '#FFFFFF',
      textPrimary: '#8B4513',
      textSecondary: '#A0522D',
      border: '#F4A460'
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
      background: '#F0F8FF',
      surface: '#FFFFFF',
      textPrimary: '#2F4F4F',
      textSecondary: '#4682B4',
      border: '#B0E0E6'
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
      background: '#1A237E',
      surface: 'rgba(255,255,255,0.95)',
      textPrimary: '#1A237E',
      textSecondary: '#5C6BC0',
      border: '#9FA8DA'
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
      background: '#FFF8E1',
      surface: '#FFFFFF',
      textPrimary: '#E65100',
      textSecondary: '#F57C00',
      border: '#FFCC80'
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
      background: '#E3F2FD',
      surface: '#FFFFFF',
      textPrimary: '#01579B',
      textSecondary: '#0277BD',
      border: '#81D4FA'
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
      background: '#FFF0F5',
      surface: '#FFFFFF',
      textPrimary: '#8B4A5E',
      textSecondary: '#B76E79',
      border: '#F2B8C6'
    }
  },
  // 付费主题
  'aurora': {
    id: 'aurora',
    name: '极光幻境',
    type: 'premium',
    price: 99,
    colors: {
      primary: '#00D9FF',
      secondary: '#7B2FFF',
      accent: '#FF1744',
      background: '#0F2027',
      surface: 'rgba(255,255,255,0.9)',
      textPrimary: '#1A1A2E',
      textSecondary: '#16213E',
      border: '#0F3460'
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
      background: '#2E1437',
      surface: 'rgba(255,255,255,0.92)',
      textPrimary: '#1A0B2E',
      textSecondary: '#3D2463',
      border: '#7D3C98'
    }
  }
};

// 默认解锁的主题
const DEFAULT_UNLOCKED_THEMES = [
  'pink-girl',
  'green-fresh',
  'dark-mode',
  'lavender-dream',
  'coral-beach',
  'mint-fresh',
  'sky-blue',
  'peach-blossom'
];

// 获取所有主题
function getAllThemes() {
  return Object.values(THEME_CONFIGS);
}

// 根据ID获取主题
function getThemeById(themeId) {
  return THEME_CONFIGS[themeId] || THEME_CONFIGS['pink-girl'];
}

// 根据类型获取主题
function getThemesByType(type) {
  return Object.values(THEME_CONFIGS).filter(t => t.type === type);
}

module.exports = {
  THEME_CONFIGS,
  DEFAULT_UNLOCKED_THEMES,
  getAllThemes,
  getThemeById,
  getThemesByType
};
