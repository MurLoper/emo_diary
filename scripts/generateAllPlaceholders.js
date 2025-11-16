/**
 * 生成所有需要的图标占位符
 * 使用 primary 文件夹的现有图标作为模板
 */

const fs = require('fs');
const path = require('path');

const ICONS_DIR = path.join(__dirname, '..', 'miniprogram', 'assets', 'icons');

// 从原设计文档提取的完整图标列表（46个）
const REQUIRED_ICONS = [
  'arrow-left', 'arrow-right', 'arrow-up', 'award', 'bell', 'book-open',
  'calendar', 'check', 'chevron-down', 'chevron-left', 'chevron-right',
  'clock', 'cloud', 'code', 'coins', 'credit-card', 'crown', 'download',
  'eye', 'eye-off', 'filter', 'gift', 'heart', 'help-circle', 'home',
  'image', 'lock', 'mail', 'maximize-2', 'palette', 'phone', 'plus',
  'printer', 'save', 'search', 'settings', 'share-2', 'shield',
  'smartphone', 'sparkles', 'star', 'tag', 'trending-up', 'user', 'x', 'zap'
];

const COLORS = ['primary', 'secondary', 'accent', 'white'];

console.log('='.repeat(70));
console.log('图标占位符生成工具 - 完整版');
console.log('='.repeat(70));
console.log('');
console.log(`📋 需要生成 ${REQUIRED_ICONS.length} 个图标 × ${COLORS.length} 种颜色 = ${REQUIRED_ICONS.length * COLORS.length} 个文件`);
console.log('');

// 获取模板图标（使用现有的任意一个图标作为占位符）
const primaryDir = path.join(ICONS_DIR, 'primary');
if (!fs.existsSync(primaryDir)) {
  console.log('❌ primary 文件夹不存在！');
  process.exit(1);
}

const templateFiles = fs.readdirSync(primaryDir).filter(f => f.endsWith('.png'));
if (templateFiles.length === 0) {
  console.log('❌ primary 文件夹中没有 PNG 文件！');
  process.exit(1);
}

const templateFile = path.join(primaryDir, templateFiles[0]);
console.log(`📄 使用模板: ${templateFiles[0]}`);
console.log('');

let created = 0;
let skipped = 0;

COLORS.forEach(color => {
  const targetDir = path.join(ICONS_DIR, color);

  // 确保目标文件夹存在
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  console.log(`📁 处理 ${color} 文件夹...`);

  REQUIRED_ICONS.forEach(iconName => {
    const targetPath = path.join(targetDir, `${iconName}.png`);

    if (fs.existsSync(targetPath)) {
      // console.log(`  ⏭️  ${iconName}.png (已存在)`);
      skipped++;
    } else {
      fs.copyFileSync(templateFile, targetPath);
      console.log(`  ✅ ${iconName}.png`);
      created++;
    }
  });

  console.log('');
});

console.log('='.repeat(70));
console.log(`✅ 完成！创建了 ${created} 个占位符文件`);
console.log(`⏭️  跳过了 ${skipped} 个已存在的文件`);
console.log('='.repeat(70));
console.log('');
console.log('📊 当前图标统计：');
COLORS.forEach(color => {
  const dir = path.join(ICONS_DIR, color);
  const count = fs.readdirSync(dir).filter(f => f.endsWith('.png')).length;
  const expected = REQUIRED_ICONS.length;
  const status = count === expected ? '✅' : '⚠️';
  console.log(`  ${status} ${color.padEnd(12)} ${count}/${expected} 个图标`);
});

console.log('');
console.log('⚠️  重要提示：');
console.log('');
console.log('1. 这些是占位符图标（颜色可能不正确）');
console.log('2. 项目现在可以正常运行和编译');
console.log('3. 建议下载正确颜色的图标进行替换');
console.log('');
console.log('📥 下载正确颜色的图标：');
console.log('');
console.log('方法 1: 使用自动下载工具');
console.log('  1. 打开 scripts/icon-downloader.html');
console.log('  2. 点击"下载所有图标"');
console.log('  3. 将下载的文件移动到 scripts/downloads/');
console.log('  4. 运行: node scripts/organizeIcons.js');
console.log('');
console.log('方法 2: 手动下载');
console.log('  访问 https://icones.js.org/collection/lucide');
console.log('  按颜色配置下载每个图标');
console.log('');
console.log('🎉 现在可以在微信开发者工具中编译测试了！');
console.log('');
