/**
 * 从原设计文档中提取的完整图标列表
 * 基于 lucide-react 的使用情况
 */

// 原设计中使用的所有图标（PascalCase 转 kebab-case）
const DESIGN_ICONS = {
  // 基础导航
  'Home': 'home',
  'ArrowLeft': 'arrow-left',
  'ArrowUp': 'arrow-up',
  'ArrowRight': 'arrow-right',
  'ChevronLeft': 'chevron-left',
  'ChevronRight': 'chevron-right',
  'ChevronDown': 'chevron-down',
  'Plus': 'plus',
  'X': 'x',

  // 功能图标
  'BookOpen': 'book-open',
  'Palette': 'palette',
  'User': 'user',
  'Image': 'image',
  'Calendar': 'calendar',
  'Search': 'search',
  'Filter': 'filter',
  'Settings': 'settings',
  'Save': 'save',
  'Check': 'check',

  // 社交与分享
  'Heart': 'heart',
  'Share2': 'share-2',
  'Download': 'download',
  'Printer': 'printer',
  'Eye': 'eye',
  'EyeOff': 'eye-off',

  // 通知与提示
  'Bell': 'bell',
  'Shield': 'shield',
  'HelpCircle': 'help-circle',
  'Sparkles': 'sparkles',
  'Star': 'star',

  // 奖励与积分
  'Gift': 'gift',
  'Award': 'award',
  'TrendingUp': 'trending-up',
  'Coins': 'coins',
  'Crown': 'crown',
  'Zap': 'zap',

  // 支付与充值
  'CreditCard': 'credit-card',

  // 标签与分类
  'Tag': 'tag',
  'Clock': 'clock',
  'Cloud': 'cloud',

  // 安全与隐私
  'Lock': 'lock',
  'Phone': 'phone',
  'Mail': 'mail',
  'Smartphone': 'smartphone',
  'Code': 'code',

  // 其他
  'Maximize2': 'maximize-2',
};

// 转换为唯一的 kebab-case 列表
const ICON_LIST = [...new Set(Object.values(DESIGN_ICONS))].sort();

console.log('='.repeat(70));
console.log('原设计文档图标清单');
console.log('='.repeat(70));
console.log('');
console.log(`📊 总计: ${ICON_LIST.length} 个图标`);
console.log('');

// 按类别输出
console.log('📋 完整图标列表:');
console.log('');
ICON_LIST.forEach((icon, index) => {
  console.log(`${(index + 1).toString().padStart(2)}. ${icon}`);
});

console.log('');
console.log('='.repeat(70));
console.log('');
console.log('🎨 需要下载的颜色版本:');
console.log('');
console.log('  Primary:   #FF6B9D (粉色)');
console.log('  Secondary: #8B7BFF (紫色)');
console.log('  Accent:    #FFB84D (橙色)');
console.log('  White:     #FFFFFF (白色)');
console.log('');
console.log(`📦 总文件数: ${ICON_LIST.length} × 4 = ${ICON_LIST.length * 4} 个 PNG 文件`);
console.log('');
console.log('='.repeat(70));
console.log('');
console.log('📥 下载方式:');
console.log('');
console.log('方法 1: 使用 icon-downloader.html');
console.log('  打开 scripts/icon-downloader-v2.html (即将创建)');
console.log('  一键下载所有图标的所有颜色版本');
console.log('');
console.log('方法 2: 手动下载');
console.log('  访问 https://icones.js.org/collection/lucide');
console.log('  搜索每个图标名称并下载 4 种颜色');
console.log('');

// 输出为 JSON 格式，供下载工具使用
const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, 'icon-list.json');
fs.writeFileSync(outputPath, JSON.stringify({
  icons: ICON_LIST,
  colors: {
    primary: '#FF6B9D',
    secondary: '#8B7BFF',
    accent: '#FFB84D',
    white: '#FFFFFF'
  },
  total: ICON_LIST.length * 4
}, null, 2));

console.log(`✅ 图标列表已保存到: ${outputPath}`);
console.log('');
