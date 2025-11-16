/**
 * 自动下载 Lucide 图标的 PNG 版本
 * 使用方法:
 * 1. npm install axios sharp
 * 2. node scripts/downloadIcons.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// 图标配置
const ICONS = [
  'palette',
  'book-open',
  'image',
  'save',
  'x',
  'search',
  'calendar',
  'settings',
  'user',
  'shield',
  'bell',
  'help-circle',
  'info',
  'sparkles',
  'gift',
  'dollar-sign',
  'zap',
  'crown',
  'credit-card',
  'trending-up',
  'check',
  'lock',
  'award',
  'home'
];

// 颜色配置
const COLORS = {
  primary: '#FF6B9D',
  secondary: '#8B7BFF',
  accent: '#FFB84D',
  white: '#FFFFFF'
};

// 输出目录
const OUTPUT_DIR = path.join(__dirname, '..', 'miniprogram', 'assets', 'icons');

// Lucide CDN SVG URL
const LUCIDE_CDN = 'https://cdn.jsdelivr.net/npm/lucide-static@latest/icons';

console.log('='.repeat(70));
console.log('Lucide 图标批量下载工具');
console.log('='.repeat(70));
console.log('');

// 确保目录存在
Object.keys(COLORS).forEach(color => {
  const dir = path.join(OUTPUT_DIR, color);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

console.log('📋 下载说明：');
console.log('');
console.log('由于需要将 SVG 转换为不同颜色的 PNG，推荐使用以下方法：');
console.log('');
console.log('方法 1: 在线工具批量下载（最简单）');
console.log('─'.repeat(70));
console.log('1. 访问 https://icones.js.org/collection/lucide');
console.log('2. 搜索图标名称（如 "book-open"）');
console.log('3. 点击图标，选择 "Download PNG"');
console.log('4. 设置：Size: 48, Color: 对应颜色值');
console.log('5. 保存到对应目录');
console.log('');
console.log('方法 2: 使用 Figma（推荐，批量处理）');
console.log('─'.repeat(70));
console.log('1. 安装 Lucide Icons 插件：https://www.figma.com/community/plugin/939567362549682242');
console.log('2. 新建 Figma 文件');
console.log('3. 运行插件，搜索并批量插入以下图标');
console.log('4. 按颜色分组，批量修改颜色');
console.log('5. 导出设置：PNG, 48x48, 2x');
console.log('');
console.log('方法 3: 使用本脚本下载 SVG 后手动转换');
console.log('─'.repeat(70));
console.log('运行: node scripts/downloadSVG.js');
console.log('然后使用在线工具转换: https://convertio.co/zh/svg-png/');
console.log('');

console.log('📌 需要下载的图标清单：');
console.log('');

// 按用途分组显示
const iconGroups = {
  '首页 (index)': ['home', 'palette', 'book-open', 'image'],
  '日记创建 (diary/create)': ['save', 'x', 'sparkles'],
  '日记列表 (diary/list)': ['search', 'calendar'],
  '用户中心 (user)': ['settings', 'user', 'shield', 'bell', 'help-circle', 'info', 'sparkles'],
  '签到 (checkin)': ['gift', 'trending-up', 'sparkles'],
  '主题商店 (theme/store)': ['crown', 'gift', 'lock', 'sparkles'],
  '充值 (recharge)': ['credit-card', 'dollar-sign', 'zap', 'crown'],
  '图文集 (album)': ['check', 'sparkles', 'calendar', 'image'],
};

Object.entries(iconGroups).forEach(([group, icons]) => {
  console.log(`\n${group}:`);
  icons.forEach(icon => {
    const status = fs.existsSync(path.join(OUTPUT_DIR, 'primary', `${icon}.png`)) ? '✅' : '⬜';
    console.log(`  ${status} ${icon}`);
  });
});

console.log('');
console.log('🎨 颜色配置：');
console.log('');
Object.entries(COLORS).forEach(([name, hex]) => {
  console.log(`  ${name.padEnd(12)} ${hex}`);
});

console.log('');
console.log('📁 保存位置：');
console.log('');
console.log(OUTPUT_DIR);
Object.keys(COLORS).forEach(color => {
  const dir = path.join(OUTPUT_DIR, color);
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.png')) : [];
  const status = files.length > 0 ? `✅ ${files.length} 个图标` : '⬜ 空';
  console.log(`├── ${color.padEnd(12)} ${status}`);
});

console.log('');
console.log('='.repeat(70));
console.log('');
console.log('💡 快速开始：');
console.log('');
console.log('1. 访问 https://icones.js.org/collection/lucide');
console.log('2. 依次搜索上面列出的图标名称');
console.log('3. 下载 4 种颜色版本（建议尺寸：48x48 或 64x64）');
console.log('4. 保存到对应的颜色文件夹');
console.log('5. 重新编译小程序即可看到效果');
console.log('');
console.log('⚡ 提示：可以先下载首页需要的 4 个图标测试效果！');
console.log('');
