require('dotenv').config();
const mongoose = require('mongoose');
const Theme = require('../src/models/Theme');
const crypto = require('crypto');

/**
 * 更新主题配置 - 符合小程序页面设计规范
 * 包含渐变背景、深阴影、大圆角等完整效果
 */

const themes = [
  // ========== 免费主题 (8个) ==========

  // 1. 粉色少女（默认主题）
  {
    id: 'pink-girl',
    name: '粉色少女',
    nameEn: 'Pink Girl',
    description: '柔和浪漫的粉色系主题，营造少女般的温柔梦幻氛围',
    category: 'free',
    tags: ['少女', '浪漫', '粉色'],
    isDefault: true,
    featured: true,
    preview: {
      thumbnail: 'https://cdn.example.com/themes/pink-girl/thumbnail.jpg',
      screenshots: []
    },
    unlockMethod: {
      type: 'default'
    },
    cssConfig: {
      colors: {
        primary: '#FFB6C1',
        secondary: '#FFC0CB',
        accent: '#FF69B4',
        background: 'linear-gradient(135deg, #FFF5F7 0%, #FFE5EC 100%)',
        surface: '#FFFFFF',
        text: {
          primary: '#2D1B2E',
          secondary: '#9D6B84',
          disabled: '#D4A5B8',
          hint: '#C8A4B4'
        },
        border: '#FFD4E5',
        divider: 'rgba(255, 183, 197, 0.2)',
        shadow: 'rgba(255, 105, 180, 0.15)'
      },
      effects: {
        buttonStyle: 'fluffy',
        cardShadow: '0 8px 16px rgba(255, 182, 193, 0.3)',
        cardRadius: '24px',
        textShadow: 'none'
      }
    },
    resources: {
      platforms: {
        wechat: {
          cssUrl: 'https://cdn.example.com/themes/wechat/pink-girl.wxss',
          version: '1.0.0',
          hash: generateHash('pink-girl')
        }
      }
    },
    version: '1.0.0'
  },

  // 2. 绿意盎然
  {
    id: 'green-fresh',
    name: '绿意盎然',
    nameEn: 'Green Fresh',
    description: '清新自然的绿色主题，如春日森林般生机勃勃',
    category: 'free',
    tags: ['清新', '自然', '绿色'],
    featured: true,
    preview: {
      thumbnail: 'https://cdn.example.com/themes/green-fresh/thumbnail.jpg',
      screenshots: []
    },
    unlockMethod: {
      type: 'default'
    },
    cssConfig: {
      colors: {
        primary: '#4CAF50',
        secondary: '#8BC34A',
        accent: '#81C784',
        background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
        surface: '#FFFFFF',
        text: {
          primary: '#1B5E20',
          secondary: '#558B2F',
          disabled: '#A5D6A7',
          hint: '#7CB342'
        },
        border: '#A5D6A7',
        divider: 'rgba(76, 175, 80, 0.2)',
        shadow: 'rgba(76, 175, 80, 0.15)'
      },
      effects: {
        buttonStyle: 'glossy',
        cardShadow: '0 4px 12px rgba(76, 175, 80, 0.2)',
        cardRadius: '16px',
        textShadow: 'none',
        buttonGradient: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)'
      }
    },
    resources: {
      platforms: {
        wechat: {
          cssUrl: 'https://cdn.example.com/themes/wechat/green-fresh.wxss',
          version: '1.0.0',
          hash: generateHash('green-fresh')
        }
      }
    },
    version: '1.0.0'
  },

  // 3. 暗夜星辰
  {
    id: 'dark-mode',
    name: '暗夜星辰',
    nameEn: 'Dark Mode',
    description: '优雅的暗色主题，适合夜间使用，保护眼睛',
    category: 'free',
    tags: ['暗黑', '夜间', '护眼'],
    featured: false,
    preview: {
      thumbnail: 'https://cdn.example.com/themes/dark-mode/thumbnail.jpg',
      screenshots: []
    },
    unlockMethod: {
      type: 'default'
    },
    cssConfig: {
      colors: {
        primary: '#BB86FC',
        secondary: '#03DAC6',
        accent: '#CF6679',
        background: 'linear-gradient(135deg, #121212 0%, #1E1E1E 100%)',
        surface: '#2C2C2C',
        text: {
          primary: '#FFFFFF',
          secondary: '#B3B3B3',
          disabled: '#666666',
          hint: '#999999'
        },
        border: '#444444',
        divider: 'rgba(255, 255, 255, 0.08)',
        shadow: 'rgba(0, 0, 0, 0.3)'
      },
      effects: {
        buttonStyle: 'neon',
        cardShadow: '0 8px 32px rgba(187, 134, 252, 0.3)',
        cardRadius: '20px',
        textShadow: '0 0 10px rgba(187, 134, 252, 0.5)',
        buttonGlow: '0 0 20px rgba(187, 134, 252, 0.6)'
      }
    },
    resources: {
      platforms: {
        wechat: {
          cssUrl: 'https://cdn.example.com/themes/wechat/dark-mode.wxss',
          version: '1.0.0',
          hash: generateHash('dark-mode')
        }
      }
    },
    version: '1.0.0'
  },

  // 4. 薰衣草梦境
  {
    id: 'lavender-dream',
    name: '薰衣草梦境',
    nameEn: 'Lavender Dream',
    description: '柔美的薰衣草紫色主题，带来宁静优雅的气质',
    category: 'free',
    tags: ['紫色', '优雅', '梦幻'],
    featured: false,
    preview: {
      thumbnail: 'https://cdn.example.com/themes/lavender-dream/thumbnail.jpg',
      screenshots: []
    },
    unlockMethod: {
      type: 'default'
    },
    cssConfig: {
      colors: {
        primary: '#9B7EBD',
        secondary: '#D4A5E0',
        accent: '#B695C0',
        background: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)',
        surface: '#FFFFFF',
        text: {
          primary: '#4A148C',
          secondary: '#7B1FA2',
          disabled: '#CE93D8',
          hint: '#BA68C8'
        },
        border: '#CE93D8',
        divider: 'rgba(155, 126, 189, 0.2)',
        shadow: 'rgba(155, 126, 189, 0.15)'
      },
      effects: {
        buttonStyle: 'soft',
        cardShadow: '0 8px 24px rgba(155, 126, 189, 0.25)',
        cardRadius: '20px',
        textShadow: 'none'
      }
    },
    resources: {
      platforms: {
        wechat: {
          cssUrl: 'https://cdn.example.com/themes/wechat/lavender-dream.wxss',
          version: '1.0.0',
          hash: generateHash('lavender-dream')
        }
      }
    },
    version: '1.0.0'
  },

  // 5. 珊瑚海滩
  {
    id: 'coral-beach',
    name: '珊瑚海滩',
    nameEn: 'Coral Beach',
    description: '温暖的珊瑚色主题，如阳光洒在海滩般温暖惬意',
    category: 'free',
    tags: ['珊瑚', '温暖', '海滩'],
    featured: false,
    preview: {
      thumbnail: 'https://cdn.example.com/themes/coral-beach/thumbnail.jpg',
      screenshots: []
    },
    unlockMethod: {
      type: 'default'
    },
    cssConfig: {
      colors: {
        primary: '#FF7F7F',
        secondary: '#FFB3B3',
        accent: '#FF6B6B',
        background: 'linear-gradient(135deg, #FFF4E6 0%, #FFE0CC 100%)',
        surface: '#FFFFFF',
        text: {
          primary: '#8B4513',
          secondary: '#CD853F',
          disabled: '#FFCCBC',
          hint: '#FFAB91'
        },
        border: '#FFB366',
        divider: 'rgba(255, 127, 127, 0.2)',
        shadow: 'rgba(255, 127, 127, 0.15)'
      },
      effects: {
        buttonStyle: 'warm',
        cardShadow: '0 6px 20px rgba(255, 127, 127, 0.25)',
        cardRadius: '18px',
        textShadow: 'none'
      }
    },
    resources: {
      platforms: {
        wechat: {
          cssUrl: 'https://cdn.example.com/themes/wechat/coral-beach.wxss',
          version: '1.0.0',
          hash: generateHash('coral-beach')
        }
      }
    },
    version: '1.0.0'
  },

  // 6. 薄荷清新
  {
    id: 'mint-fresh',
    name: '薄荷清新',
    nameEn: 'Mint Fresh',
    description: '清爽的薄荷绿主题，带来凉爽舒适的感觉',
    category: 'free',
    tags: ['薄荷', '清爽', '舒适'],
    featured: false,
    preview: {
      thumbnail: 'https://cdn.example.com/themes/mint-fresh/thumbnail.jpg',
      screenshots: []
    },
    unlockMethod: {
      type: 'default'
    },
    cssConfig: {
      colors: {
        primary: '#5DD39E',
        secondary: '#BCE5D6',
        accent: '#3FB67E',
        background: 'linear-gradient(135deg, #E0F7F4 0%, #C2F3E0 100%)',
        surface: '#FFFFFF',
        text: {
          primary: '#004D40',
          secondary: '#00796B',
          disabled: '#80CBC4',
          hint: '#4DB6AC'
        },
        border: '#80CBC4',
        divider: 'rgba(93, 211, 158, 0.2)',
        shadow: 'rgba(93, 211, 158, 0.15)'
      },
      effects: {
        buttonStyle: 'glossy',
        cardShadow: '0 4px 16px rgba(93, 211, 158, 0.2)',
        cardRadius: '16px',
        textShadow: 'none',
        buttonGradient: 'linear-gradient(135deg, #5DD39E 0%, #3FB67E 100%)'
      }
    },
    resources: {
      platforms: {
        wechat: {
          cssUrl: 'https://cdn.example.com/themes/wechat/mint-fresh.wxss',
          version: '1.0.0',
          hash: generateHash('mint-fresh')
        }
      }
    },
    version: '1.0.0'
  },

  // 7. 天空之蓝
  {
    id: 'sky-blue',
    name: '天空之蓝',
    nameEn: 'Sky Blue',
    description: '明亮的天空蓝主题，如晴朗天空般清新明快',
    category: 'free',
    tags: ['蓝色', '清新', '明快'],
    featured: false,
    preview: {
      thumbnail: 'https://cdn.example.com/themes/sky-blue/thumbnail.jpg',
      screenshots: []
    },
    unlockMethod: {
      type: 'default'
    },
    cssConfig: {
      colors: {
        primary: '#4FC3F7',
        secondary: '#81D4FA',
        accent: '#29B6F6',
        background: 'linear-gradient(135deg, #E1F5FE 0%, #B3E5FC 100%)',
        surface: '#FFFFFF',
        text: {
          primary: '#01579B',
          secondary: '#0277BD',
          disabled: '#90CAF9',
          hint: '#64B5F6'
        },
        border: '#4FC3F7',
        divider: 'rgba(79, 195, 247, 0.2)',
        shadow: 'rgba(79, 195, 247, 0.15)'
      },
      effects: {
        buttonStyle: 'airy',
        cardShadow: '0 6px 20px rgba(79, 195, 247, 0.25)',
        cardRadius: '20px',
        textShadow: 'none'
      }
    },
    resources: {
      platforms: {
        wechat: {
          cssUrl: 'https://cdn.example.com/themes/wechat/sky-blue.wxss',
          version: '1.0.0',
          hash: generateHash('sky-blue')
        }
      }
    },
    version: '1.0.0'
  },

  // 8. 桃花粉嫩
  {
    id: 'peach-blossom',
    name: '桃花粉嫩',
    nameEn: 'Peach Blossom',
    description: '柔美的桃花粉主题，春日浪漫气息',
    category: 'free',
    tags: ['桃花', '浪漫', '春日'],
    featured: false,
    preview: {
      thumbnail: 'https://cdn.example.com/themes/peach-blossom/thumbnail.jpg',
      screenshots: []
    },
    unlockMethod: {
      type: 'default'
    },
    cssConfig: {
      colors: {
        primary: '#FFAB91',
        secondary: '#FFCCBC',
        accent: '#FF8A65',
        background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
        surface: '#FFFFFF',
        text: {
          primary: '#E64A19',
          secondary: '#FF5722',
          disabled: '#F8BBD0',
          hint: '#F48FB1'
        },
        border: '#FFAB91',
        divider: 'rgba(255, 171, 145, 0.2)',
        shadow: 'rgba(255, 171, 145, 0.15)'
      },
      effects: {
        buttonStyle: 'soft',
        cardShadow: '0 8px 20px rgba(255, 171, 145, 0.3)',
        cardRadius: '22px',
        textShadow: 'none'
      }
    },
    resources: {
      platforms: {
        wechat: {
          cssUrl: 'https://cdn.example.com/themes/wechat/peach-blossom.wxss',
          version: '1.0.0',
          hash: generateHash('peach-blossom')
        }
      }
    },
    version: '1.0.0'
  },

  // ========== 签到解锁主题 (3个) ==========

  // 9. 樱花季节（签到7天）
  {
    id: 'cherry-blossom',
    name: '樱花季节',
    nameEn: 'Cherry Blossom',
    description: '浪漫的樱花粉主题，签到7天即可解锁',
    category: 'signin',
    tags: ['樱花', '浪漫', '粉色'],
    featured: true,
    preview: {
      thumbnail: 'https://cdn.example.com/themes/cherry-blossom/thumbnail.jpg',
      screenshots: []
    },
    unlockMethod: {
      type: 'signin',
      signinDays: 7
    },
    cssConfig: {
      colors: {
        primary: '#FFB7C5',
        secondary: '#FFC9D9',
        accent: '#FF9EB1',
        background: 'linear-gradient(135deg, #FFF0F5 0%, #FFE4EC 100%)',
        surface: '#FFFFFF',
        text: {
          primary: '#8B2E4A',
          secondary: '#C54A6A',
          disabled: '#FFD4E0',
          hint: '#FFC9D6'
        },
        border: '#FFD4E0',
        divider: 'rgba(255, 183, 197, 0.2)',
        shadow: 'rgba(255, 183, 197, 0.2)'
      },
      effects: {
        buttonStyle: 'fluffy',
        cardShadow: '0 8px 24px rgba(255, 183, 197, 0.3)',
        cardRadius: '24px',
        textShadow: 'none'
      }
    },
    resources: {
      platforms: {
        wechat: {
          cssUrl: 'https://cdn.example.com/themes/wechat/cherry-blossom.wxss',
          version: '1.0.0',
          hash: generateHash('cherry-blossom')
        }
      }
    },
    version: '1.0.0'
  },

  // 10. 秋日枫叶（签到15天）
  {
    id: 'autumn-maple',
    name: '秋日枫叶',
    nameEn: 'Autumn Maple',
    description: '温暖的枫叶橙主题，签到15天即可解锁',
    category: 'signin',
    tags: ['秋天', '枫叶', '温暖'],
    featured: true,
    preview: {
      thumbnail: 'https://cdn.example.com/themes/autumn-maple/thumbnail.jpg',
      screenshots: []
    },
    unlockMethod: {
      type: 'signin',
      signinDays: 15
    },
    cssConfig: {
      colors: {
        primary: '#E67E22',
        secondary: '#F39C12',
        accent: '#D35400',
        background: 'linear-gradient(135deg, #FFF5E8 0%, #FFE5CC 100%)',
        surface: '#FFFFFF',
        text: {
          primary: '#8B4513',
          secondary: '#A0522D',
          disabled: '#FFD4A3',
          hint: '#FFBC80'
        },
        border: '#F4A460',
        divider: 'rgba(230, 126, 34, 0.2)',
        shadow: 'rgba(230, 126, 34, 0.2)'
      },
      effects: {
        buttonStyle: 'warm',
        cardShadow: '0 8px 24px rgba(230, 126, 34, 0.3)',
        cardRadius: '20px',
        textShadow: 'none'
      }
    },
    resources: {
      platforms: {
        wechat: {
          cssUrl: 'https://cdn.example.com/themes/wechat/autumn-maple.wxss',
          version: '1.0.0',
          hash: generateHash('autumn-maple')
        }
      }
    },
    version: '1.0.0'
  },

  // 11. 冬日雪境（签到30天）
  {
    id: 'winter-snow',
    name: '冬日雪境',
    nameEn: 'Winter Snow',
    description: '清冷的冰雪蓝主题，签到30天即可解锁',
    category: 'signin',
    tags: ['冬天', '雪景', '清冷'],
    featured: true,
    preview: {
      thumbnail: 'https://cdn.example.com/themes/winter-snow/thumbnail.jpg',
      screenshots: []
    },
    unlockMethod: {
      type: 'signin',
      signinDays: 30
    },
    cssConfig: {
      colors: {
        primary: '#B0C4DE',
        secondary: '#ADD8E6',
        accent: '#87CEEB',
        background: 'linear-gradient(135deg, #F0F8FF 0%, #E6F2FF 100%)',
        surface: '#FFFFFF',
        text: {
          primary: '#2F4F4F',
          secondary: '#4682B4',
          disabled: '#AED6F1',
          hint: '#85C1E9'
        },
        border: '#B0E0E6',
        divider: 'rgba(176, 196, 222, 0.2)',
        shadow: 'rgba(176, 196, 222, 0.2)'
      },
      effects: {
        buttonStyle: 'frost',
        cardShadow: '0 8px 32px rgba(176, 196, 222, 0.4)',
        cardRadius: '20px',
        textShadow: 'none'
      }
    },
    resources: {
      platforms: {
        wechat: {
          cssUrl: 'https://cdn.example.com/themes/wechat/winter-snow.wxss',
          version: '1.0.0',
          hash: generateHash('winter-snow')
        }
      }
    },
    version: '1.0.0'
  },

  // ========== 积分兑换主题 (4个) ==========

  // 12. 璀璨星空（300积分）
  {
    id: 'starry-sky',
    name: '璀璨星空',
    nameEn: 'Starry Sky',
    description: '神秘的星空主题，需要300积分解锁',
    category: 'points',
    tags: ['星空', '神秘', '夜晚'],
    featured: true,
    preview: {
      thumbnail: 'https://cdn.example.com/themes/starry-sky/thumbnail.jpg',
      screenshots: []
    },
    unlockMethod: {
      type: 'points',
      pointsCost: 300
    },
    cssConfig: {
      colors: {
        primary: '#4A90E2',
        secondary: '#7B68EE',
        accent: '#00BFFF',
        background: 'linear-gradient(135deg, #1A237E 0%, #283593 100%)',
        surface: 'rgba(255, 255, 255, 0.95)',
        text: {
          primary: '#1A237E',
          secondary: '#5C6BC0',
          disabled: '#9FA8DA',
          hint: '#7986CB'
        },
        border: '#9FA8DA',
        divider: 'rgba(74, 144, 226, 0.3)',
        shadow: 'rgba(74, 144, 226, 0.4)'
      },
      effects: {
        buttonStyle: 'starry',
        cardShadow: '0 8px 32px rgba(74, 144, 226, 0.4)',
        cardRadius: '20px',
        textShadow: '0 0 8px rgba(74, 144, 226, 0.3)'
      }
    },
    resources: {
      platforms: {
        wechat: {
          cssUrl: 'https://cdn.example.com/themes/wechat/starry-sky.wxss',
          version: '1.0.0',
          hash: generateHash('starry-sky')
        }
      }
    },
    version: '1.0.0'
  },

  // 13. 金色余晖（300积分）
  {
    id: 'golden-sunset',
    name: '金色余晖',
    nameEn: 'Golden Sunset',
    description: '温暖的金色主题，需要300积分解锁',
    category: 'points',
    tags: ['金色', '温暖', '夕阳'],
    featured: true,
    preview: {
      thumbnail: 'https://cdn.example.com/themes/golden-sunset/thumbnail.jpg',
      screenshots: []
    },
    unlockMethod: {
      type: 'points',
      pointsCost: 300
    },
    cssConfig: {
      colors: {
        primary: '#FFB74D',
        secondary: '#FFA726',
        accent: '#FF9800',
        background: 'linear-gradient(135deg, #FFF8E1 0%, #FFE0B2 100%)',
        surface: '#FFFFFF',
        text: {
          primary: '#E65100',
          secondary: '#F57C00',
          disabled: '#FFE082',
          hint: '#FFD54F'
        },
        border: '#FFCC80',
        divider: 'rgba(255, 183, 77, 0.2)',
        shadow: 'rgba(255, 152, 0, 0.15)'
      },
      effects: {
        buttonStyle: 'golden',
        cardShadow: '0 8px 24px rgba(255, 183, 77, 0.35)',
        cardRadius: '18px',
        textShadow: 'none',
        buttonGradient: 'linear-gradient(135deg, #FFD54F 0%, #FFB74D 100%)'
      }
    },
    resources: {
      platforms: {
        wechat: {
          cssUrl: 'https://cdn.example.com/themes/wechat/golden-sunset.wxss',
          version: '1.0.0',
          hash: generateHash('golden-sunset')
        }
      }
    },
    version: '1.0.0'
  },

  // 14. 克莱因蓝（300积分）
  {
    id: 'klein-blue',
    name: '克莱因蓝',
    nameEn: 'Klein Blue',
    description: '经典的克莱因蓝主题，需要300积分解锁',
    category: 'points',
    tags: ['蓝色', '经典', '深邃'],
    featured: true,
    preview: {
      thumbnail: 'https://cdn.example.com/themes/klein-blue/thumbnail.jpg',
      screenshots: []
    },
    unlockMethod: {
      type: 'points',
      pointsCost: 300
    },
    cssConfig: {
      colors: {
        primary: '#002FA7',
        secondary: '#0047AB',
        accent: '#4169E1',
        background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
        surface: '#FFFFFF',
        text: {
          primary: '#01579B',
          secondary: '#0277BD',
          disabled: '#90CAF9',
          hint: '#64B5F6'
        },
        border: '#81D4FA',
        divider: 'rgba(0, 47, 167, 0.2)',
        shadow: 'rgba(0, 47, 167, 0.15)'
      },
      effects: {
        buttonStyle: 'deep',
        cardShadow: '0 8px 32px rgba(0, 47, 167, 0.3)',
        cardRadius: '16px',
        textShadow: 'none'
      }
    },
    resources: {
      platforms: {
        wechat: {
          cssUrl: 'https://cdn.example.com/themes/wechat/klein-blue.wxss',
          version: '1.0.0',
          hash: generateHash('klein-blue')
        }
      }
    },
    version: '1.0.0'
  },

  // 15. 玫瑰金（500积分）
  {
    id: 'rose-gold',
    name: '玫瑰金',
    nameEn: 'Rose Gold',
    description: '奢华的玫瑰金主题，需要500积分解锁',
    category: 'points',
    tags: ['玫瑰金', '奢华', '优雅'],
    featured: true,
    preview: {
      thumbnail: 'https://cdn.example.com/themes/rose-gold/thumbnail.jpg',
      screenshots: []
    },
    unlockMethod: {
      type: 'points',
      pointsCost: 500
    },
    cssConfig: {
      colors: {
        primary: '#E8A0A0',
        secondary: '#F5C6C6',
        accent: '#D87093',
        background: 'linear-gradient(135deg, #FFF0F5 0%, #FFE4E8 100%)',
        surface: '#FFFFFF',
        text: {
          primary: '#8B4A5E',
          secondary: '#B76E79',
          disabled: '#E0C4B8',
          hint: '#D4A5A5'
        },
        border: '#F2B8C6',
        divider: 'rgba(232, 160, 160, 0.2)',
        shadow: 'rgba(232, 160, 160, 0.2)'
      },
      effects: {
        buttonStyle: 'metallic',
        cardShadow: '0 8px 24px rgba(232, 160, 160, 0.35)',
        cardRadius: '20px',
        textShadow: 'none',
        buttonGradient: 'linear-gradient(135deg, #F5C6C6 0%, #E8A0A0 100%)'
      }
    },
    resources: {
      platforms: {
        wechat: {
          cssUrl: 'https://cdn.example.com/themes/wechat/rose-gold.wxss',
          version: '1.0.0',
          hash: generateHash('rose-gold')
        }
      }
    },
    version: '1.0.0'
  },

  // ========== 高级主题 (3个) ==========

  // 16. 极光幻境（99心晴币）
  {
    id: 'aurora',
    name: '极光幻境',
    nameEn: 'Aurora',
    description: '绚丽的极光主题，需要99心晴币解锁',
    category: 'premium',
    tags: ['极光', '绚丽', '梦幻'],
    featured: true,
    preview: {
      thumbnail: 'https://cdn.example.com/themes/aurora/thumbnail.jpg',
      screenshots: []
    },
    unlockMethod: {
      type: 'premium',
      price: 99
    },
    cssConfig: {
      colors: {
        primary: '#00D9FF',
        secondary: '#7B2FFF',
        accent: '#FF1744',
        background: 'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)',
        surface: 'rgba(255, 255, 255, 0.9)',
        text: {
          primary: '#1A1A2E',
          secondary: '#16213E',
          disabled: '#BDC3C7',
          hint: '#95A5A6'
        },
        border: '#0F3460',
        divider: 'rgba(0, 217, 255, 0.2)',
        shadow: 'rgba(0, 217, 255, 0.4)'
      },
      effects: {
        buttonStyle: 'aurora',
        cardShadow: '0 8px 32px rgba(0, 217, 255, 0.4)',
        cardRadius: '24px',
        textShadow: '0 0 10px rgba(0, 217, 255, 0.5)',
        buttonGradient: 'linear-gradient(135deg, #00D9FF 0%, #7B2FFF 100%)'
      }
    },
    resources: {
      platforms: {
        wechat: {
          cssUrl: 'https://cdn.example.com/themes/wechat/aurora.wxss',
          version: '1.0.0',
          hash: generateHash('aurora')
        }
      }
    },
    version: '1.0.0'
  },

  // 17. 银河星系（129心晴币）
  {
    id: 'galaxy',
    name: '银河星系',
    nameEn: 'Galaxy',
    description: '璀璨的星河主题，需要129心晴币解锁',
    category: 'premium',
    tags: ['星河', '璀璨', '科幻'],
    featured: true,
    preview: {
      thumbnail: 'https://cdn.example.com/themes/galaxy/thumbnail.jpg',
      screenshots: []
    },
    unlockMethod: {
      type: 'premium',
      price: 129
    },
    cssConfig: {
      colors: {
        primary: '#9D50BB',
        secondary: '#6E48AA',
        accent: '#FF6B9D',
        background: 'linear-gradient(135deg, #2E1437 0%, #4A235A 50%, #6C3483 100%)',
        surface: 'rgba(255, 255, 255, 0.92)',
        text: {
          primary: '#1A0B2E',
          secondary: '#3D2463',
          disabled: '#9333EA',
          hint: '#C084FC'
        },
        border: '#7D3C98',
        divider: 'rgba(157, 80, 187, 0.2)',
        shadow: 'rgba(157, 80, 187, 0.5)'
      },
      effects: {
        buttonStyle: 'cosmic',
        cardShadow: '0 8px 32px rgba(157, 80, 187, 0.5)',
        cardRadius: '24px',
        textShadow: '0 0 8px rgba(157, 80, 187, 0.4)',
        buttonGradient: 'linear-gradient(135deg, #9D50BB 0%, #6E48AA 100%)'
      }
    },
    resources: {
      platforms: {
        wechat: {
          cssUrl: 'https://cdn.example.com/themes/wechat/galaxy.wxss',
          version: '1.0.0',
          hash: generateHash('galaxy')
        }
      }
    },
    version: '1.0.0'
  },

  // 18. 莫兰迪灰（原有主题保留，129心晴币）
  {
    id: 'morandi-gray',
    name: '莫兰迪灰',
    nameEn: 'Morandi Gray',
    description: '高级的莫兰迪灰主题，需要129心晴币解锁',
    category: 'premium',
    tags: ['莫兰迪', '高级', '优雅'],
    featured: true,
    preview: {
      thumbnail: 'https://cdn.example.com/themes/morandi-gray/thumbnail.jpg',
      screenshots: []
    },
    unlockMethod: {
      type: 'premium',
      price: 129
    },
    cssConfig: {
      colors: {
        primary: '#9B9B9B',
        secondary: '#B8B8B8',
        accent: '#D4D4D4',
        background: 'linear-gradient(135deg, #F5F5F5 0%, #E8E8E8 100%)',
        surface: '#FFFFFF',
        text: {
          primary: '#424242',
          secondary: '#616161',
          disabled: '#BDBDBD',
          hint: '#9E9E9E'
        },
        border: '#E0E0E0',
        divider: 'rgba(155, 155, 155, 0.2)',
        shadow: 'rgba(155, 155, 155, 0.15)'
      },
      effects: {
        buttonStyle: 'minimalist',
        cardShadow: '0 6px 24px rgba(155, 155, 155, 0.2)',
        cardRadius: '20px',
        textShadow: 'none'
      }
    },
    resources: {
      platforms: {
        wechat: {
          cssUrl: 'https://cdn.example.com/themes/wechat/morandi-gray.wxss',
          version: '1.0.0',
          hash: generateHash('morandi-gray')
        }
      }
    },
    version: '1.0.0'
  }
];

/**
 * 生成主题哈希值
 */
function generateHash(themeId) {
  return crypto.createHash('md5').update(themeId + Date.now()).digest('hex');
}

/**
 * 更新主题数据
 */
async function updateThemes() {
  try {
    // 连接数据库
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ 数据库连接成功\n');

    console.log('开始更新主题配置...\n');

    for (const themeData of themes) {
      // 更新或创建主题 (upsert)
      const result = await Theme.findOneAndUpdate(
        { id: themeData.id },
        themeData,
        { upsert: true, new: true }
      );

      console.log(`✓ 主题 "${result.name}" (${result.id}) 更新成功`);
    }

    console.log(`\n所有${themes.length}个主题更新完成！`);
    console.log('========================================');
    console.log('\n主题分类统计：');
    console.log('- 免费主题: 8个');
    console.log('- 签到解锁: 3个 (7天, 15天, 30天)');
    console.log('- 积分兑换: 4个 (300/500积分)');
    console.log('- 高级主题: 3个 (99/129心晴币)\n');
    console.log('主要更新内容：');
    console.log('- ✅ 新增10个主题（薰衣草梦、珊瑚海滩等）');
    console.log('- ✅ 修复暗黑主题文字颜色（textPrimary: #FFFFFF）');
    console.log('- ✅ 完整的渐变背景和阴影效果');
    console.log('- ✅ 统一的设计规范和圆角配置\n');

    process.exit(0);
  } catch (error) {
    console.error('✗ 更新失败:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// 执行更新
updateThemes();
