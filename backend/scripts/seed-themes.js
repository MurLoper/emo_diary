require('dotenv').config();
const mongoose = require('mongoose');
const Theme = require('../src/models/Theme');
const crypto = require('crypto');

/**
 * 主题初始化脚本
 * 初始化12个预设主题
 */

const themes = [
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
      screenshots: [
        'https://cdn.example.com/themes/pink-girl/screenshot1.jpg',
        'https://cdn.example.com/themes/pink-girl/screenshot2.jpg'
      ]
    },
    unlockMethod: {
      type: 'default'
    },
    cssConfig: {
      colors: {
        primary: '#FFB6C1',
        secondary: '#FFC0CB',
        accent: '#FF69B4',
        background: '#FFF5F7',
        surface: '#FFFFFF',
        text: {
          primary: '#2D1B2E',
          secondary: '#9D6B84',
          disabled: '#D4A5B8',
          hint: '#C8A4B4'
        },
        border: 'rgba(255, 183, 197, 0.3)',
        divider: 'rgba(255, 183, 197, 0.2)',
        shadow: 'rgba(255, 105, 180, 0.15)',
        error: '#F44336',
        success: '#4CAF50',
        warning: '#FF9800',
        info: '#2196F3'
      },
      components: {
        card: {
          borderRadius: '1rem',
          padding: '1rem',
          margin: '0.5rem',
          shadow: '0 2px 8px rgba(255, 105, 180, 0.1)',
          background: '#FFFFFF',
          borderWidth: '1px',
          borderColor: 'rgba(255, 183, 197, 0.2)'
        },
        button: {
          borderRadius: '1.5rem',
          padding: '0.5rem 1rem',
          fontSize: '0.875rem',
          fontWeight: '500',
          height: '2.5rem',
          shadow: '0 2px 4px rgba(255, 105, 180, 0.2)',
          primary: {
            background: '#FFB6C1',
            color: '#FFFFFF',
            hoverBackground: '#FF9BAA'
          },
          secondary: {
            background: '#FFC0CB',
            color: '#2D1B2E',
            hoverBackground: '#FFD5DB'
          },
          outline: {
            borderColor: '#FFB6C1',
            color: '#FFB6C1',
            hoverBackground: 'rgba(255, 182, 193, 0.1)'
          }
        },
        input: {
          borderRadius: '0.5rem',
          borderWidth: '1px',
          borderColor: 'rgba(255, 183, 197, 0.3)',
          padding: '0.75rem',
          fontSize: '0.875rem',
          height: '2.5rem',
          focusBorderColor: '#FFB6C1',
          backgroundColor: '#FFFFFF'
        },
        list: {
          itemHeight: '3rem',
          itemPadding: '0.75rem 1rem',
          dividerColor: 'rgba(255, 183, 197, 0.2)',
          dividerWidth: '1px',
          hoverBackground: 'rgba(255, 182, 193, 0.05)'
        },
        navbar: {
          height: '3rem',
          background: '#FFFFFF',
          color: '#2D1B2E',
          shadow: '0 2px 4px rgba(255, 105, 180, 0.1)',
          borderBottom: '1px solid rgba(255, 183, 197, 0.2)'
        },
        tabbar: {
          height: '3.5rem',
          background: '#FFFFFF',
          color: '#9D6B84',
          activeColor: '#FFB6C1',
          shadow: '0 -2px 4px rgba(255, 105, 180, 0.1)',
          borderTop: '1px solid rgba(255, 183, 197, 0.2)'
        },
        tag: {
          borderRadius: '1rem',
          padding: '0.25rem 0.75rem',
          fontSize: '0.75rem',
          fontWeight: '500'
        },
        dialog: {
          borderRadius: '1rem',
          padding: '1.5rem',
          shadow: '0 8px 16px rgba(255, 105, 180, 0.2)',
          background: '#FFFFFF'
        }
      },
      effects: {
        blur: 'blur(10px)',
        gradient: 'linear-gradient(135deg, #FFB6C1 0%, #FFC0CB 50%, #FFF5F7 100%)',
        shadow: {
          small: '0 1px 3px rgba(255, 105, 180, 0.1)',
          medium: '0 4px 6px rgba(255, 105, 180, 0.15)',
          large: '0 10px 15px rgba(255, 105, 180, 0.2)'
        },
        animation: {
          duration: '0.3s',
          timing: 'ease-in-out'
        }
      },
      typography: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem'
        },
        fontWeight: {
          normal: '400',
          medium: '500',
          semibold: '600',
          bold: '700'
        },
        lineHeight: {
          tight: '1.25',
          normal: '1.5',
          relaxed: '1.75'
        }
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem'
      },
      borderRadius: {
        none: '0',
        sm: '0.25rem',
        md: '0.5rem',
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px'
      }
    },
    resources: {
      platforms: {
        wechat: {
          cssUrl: 'https://cdn.example.com/themes/wechat/pink-girl.wxss',
          cssPath: '/themes/wechat/pink-girl.wxss',
          version: '1.0.0',
          size: 8192,
          hash: generateHash('pink-girl')
        }
      },
      backgroundImages: [],
      decorationImages: []
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
        background: '#E8F5E9',
        surface: '#FFFFFF',
        text: {
          primary: '#1B5E20',
          secondary: '#558B2F',
          disabled: '#A5D6A7',
          hint: '#7CB342'
        },
        border: 'rgba(76, 175, 80, 0.3)',
        divider: 'rgba(76, 175, 80, 0.2)',
        shadow: 'rgba(76, 175, 80, 0.15)'
      },
      // ... 其他配置与粉色主题类似结构
      components: {
        card: {
          borderRadius: '0.75rem',
          padding: '1rem',
          shadow: '0 2px 8px rgba(76, 175, 80, 0.1)',
          background: '#FFFFFF'
        },
        button: {
          borderRadius: '0.5rem',
          padding: '0.5rem 1rem',
          primary: {
            background: '#4CAF50',
            color: '#FFFFFF'
          }
        }
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
    nameEn: 'Dark Night',
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
        background: '#121212',
        surface: '#1E1E1E',
        text: {
          primary: '#FFFFFF',
          secondary: '#B3B3B3',
          disabled: '#666666',
          hint: '#999999'
        },
        border: 'rgba(255, 255, 255, 0.12)',
        divider: 'rgba(255, 255, 255, 0.08)',
        shadow: 'rgba(0, 0, 0, 0.3)'
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

  // 4. 克莱因蓝
  {
    id: 'klein-blue',
    name: '克莱因蓝',
    description: '经典的克莱因蓝主题，纯粹而深邃',
    category: 'free',
    tags: ['蓝色', '经典', '深邃'],
    unlockMethod: { type: 'default' },
    cssConfig: {
      colors: {
        primary: '#002FA7',
        secondary: '#0047AB',
        accent: '#4169E1',
        background: '#E3F2FD',
        surface: '#FFFFFF'
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

  // 5. 金色余晖（积分解锁）
  {
    id: 'golden-sunset',
    name: '金色余晖',
    description: '温暖的金色主题，如夕阳般温柔',
    category: 'premium',
    tags: ['金色', '温暖', '夕阳'],
    unlockMethod: {
      type: 'points',
      pointsCost: 500
    },
    cssConfig: {
      colors: {
        primary: '#FFB74D',
        secondary: '#FFA726',
        accent: '#FF9800',
        background: '#FFF8E1',
        surface: '#FFFFFF'
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

  // 6-8: 中国传统色系
  {
    id: 'goose-yellow',
    name: '鹅黄秋香',
    category: 'free',
    unlockMethod: { type: 'default' },
    cssConfig: {
      colors: {
        primary: '#FFF143',
        secondary: '#F0C239',
        background: '#FFFBEA'
      }
    },
    resources: {
      platforms: {
        wechat: {
          cssUrl: 'https://cdn.example.com/themes/wechat/goose-yellow.wxss',
          version: '1.0.0',
          hash: generateHash('goose-yellow')
        }
      }
    },
    version: '1.0.0'
  },
  {
    id: 'moon-white',
    name: '月白清辉',
    category: 'free',
    unlockMethod: { type: 'default' },
    cssConfig: {
      colors: {
        primary: '#D6ECF0',
        secondary: '#BACCD9',
        background: '#F5F9FA'
      }
    },
    resources: {
      platforms: {
        wechat: {
          cssUrl: 'https://cdn.example.com/themes/wechat/moon-white.wxss',
          version: '1.0.0',
          hash: generateHash('moon-white')
        }
      }
    },
    version: '1.0.0'
  },
  {
    id: 'silver-red',
    name: '银红霞光',
    category: 'free',
    unlockMethod: { type: 'default' },
    cssConfig: {
      colors: {
        primary: '#F05654',
        secondary: '#F07C82',
        background: '#FFF5F5'
      }
    },
    resources: {
      platforms: {
        wechat: {
          cssUrl: 'https://cdn.example.com/themes/wechat/silver-red.wxss',
          version: '1.0.0',
          hash: generateHash('silver-red')
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
 * 初始化主题数据
 */
async function seedThemes() {
  try {
    // 连接数据库
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ 数据库连接成功');

    console.log('开始初始化主题数据...\n');

    for (const themeData of themes) {
      // 保存到数据库 (upsert)
      const result = await Theme.findOneAndUpdate(
        { id: themeData.id },
        themeData,
        { upsert: true, new: true }
      );

      console.log(`✓ 主题 "${result.name}" (${result.id}) 初始化成功`);
    }

    console.log(`\n所有${themes.length}个主题初始化完成！`);
    console.log('========================================');

    process.exit(0);
  } catch (error) {
    console.error('✗ 初始化失败:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// 执行初始化
seedThemes();
