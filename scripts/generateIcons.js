/**
 * 图标生成工具
 * 使用此脚本批量下载Lucide图标并转换为不同颜色的PNG
 *
 * 使用方法:
 * 1. 安装依赖: npm install lucide-static canvas
 * 2. 运行脚本: node scripts/generateIcons.js
 */

const fs = require('fs');
const path = require('path');

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
  'award'
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

console.log('='.repeat(60));
console.log('图标生成工具');
console.log('='.repeat(60));
console.log('');
console.log('此脚本需要手动下载图标。请按照以下步骤操作：');
console.log('');
console.log('📋 需要下载的图标列表:');
console.log('');

ICONS.forEach((icon, index) => {
  console.log(`${index + 1}. ${icon}`);
});

console.log('');
console.log('🎨 需要的颜色版本:');
console.log('');
Object.entries(COLORS).forEach(([name, hex]) => {
  console.log(`  • ${name}: ${hex}`);
});

console.log('');
console.log('📥 下载步骤:');
console.log('');
console.log('方式1: 使用 Lucide 官网 (推荐)');
console.log('-------------------------------');
console.log('1. 访问 https://lucide.dev/icons/');
console.log('2. 搜索图标名称（如 "book-open"）');
console.log('3. 点击图标后选择 "Download PNG"');
console.log('4. 设置参数:');
console.log('   - Size: 24x24');
console.log('   - Color: 对应的颜色值');
console.log('   - Stroke Width: 2');
console.log('5. 下载并保存到对应目录:');
console.log(`   ${OUTPUT_DIR}/[颜色]/[图标名].png`);
console.log('');
console.log('方式2: 使用在线 SVG to PNG 转换工具');
console.log('-----------------------------------');
console.log('1. 从 Lucide 官网复制 SVG 代码');
console.log('2. 使用在线工具转换 (如 https://svgtopng.com)');
console.log('3. 修改 SVG 的 stroke 颜色为对应的主题色');
console.log('4. 转换并下载 PNG (24x24)');
console.log('');
console.log('方式3: 使用 Figma 批量导出');
console.log('---------------------------');
console.log('1. 在 Figma 中导入 Lucide Icons 插件');
console.log('2. 批量插入所需图标');
console.log('3. 修改颜色');
console.log('4. 批量导出为 PNG');
console.log('');
console.log('📁 目录结构:');
console.log('');
console.log(OUTPUT_DIR);
Object.keys(COLORS).forEach(color => {
  console.log(`├── ${color}/`);
  console.log(`│   ├── book-open.png`);
  console.log(`│   ├── palette.png`);
  console.log(`│   └── ...`);
});
console.log('');
console.log('✅ 验证目录是否已创建:');
console.log('');

// 检查并创建目录
Object.keys(COLORS).forEach(color => {
  const dir = path.join(OUTPUT_DIR, color);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✓ 已创建目录: ${color}/`);
  } else {
    // 检查该目录下已有的图标
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));
    if (files.length > 0) {
      console.log(`✓ ${color}/ (已有 ${files.length} 个图标)`);
    } else {
      console.log(`○ ${color}/ (空)`);
    }
  }
});

console.log('');
console.log('='.repeat(60));
console.log('');
console.log('💡 提示:');
console.log('  - 可以先下载几个关键图标测试效果');
console.log('  - 建议图标尺寸: 24x24px 或 48x48px');
console.log('  - 确保文件名与配置一致（如 book-open.png）');
console.log('');
console.log('🚀 下载完成后，重新编译小程序即可看到效果！');
console.log('');
