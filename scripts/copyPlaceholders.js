/**
 * 临时占位脚本 - 复制 primary 图标到其他颜色文件夹
 * 后续需要用正确颜色的图标替换
 */

const fs = require('fs');
const path = require('path');

const ICONS_DIR = path.join(__dirname, '..', 'miniprogram', 'assets', 'icons');
const COLORS = ['secondary', 'accent', 'white'];

console.log('='.repeat(70));
console.log('图标占位符生成工具');
console.log('='.repeat(70));
console.log('');
console.log('⚠️  注意：这是临时方案，将 primary 颜色的图标复制到其他颜色文件夹');
console.log('后续需要下载正确颜色的图标进行替换！');
console.log('');

const primaryDir = path.join(ICONS_DIR, 'primary');

if (!fs.existsSync(primaryDir)) {
  console.log('❌ primary 文件夹不存在！');
  process.exit(1);
}

const primaryIcons = fs.readdirSync(primaryDir).filter(f => f.endsWith('.png'));

if (primaryIcons.length === 0) {
  console.log('❌ primary 文件夹中没有图标！');
  process.exit(1);
}

console.log(`📁 找到 ${primaryIcons.length} 个 primary 图标：`);
primaryIcons.forEach(icon => console.log(`  - ${icon}`));
console.log('');

let copied = 0;

COLORS.forEach(color => {
  const targetDir = path.join(ICONS_DIR, color);

  // 确保目标文件夹存在
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  console.log(`📋 复制到 ${color}...`);

  primaryIcons.forEach(iconFile => {
    const sourcePath = path.join(primaryDir, iconFile);
    const targetPath = path.join(targetDir, iconFile);

    // 如果目标文件已存在，跳过
    if (fs.existsSync(targetPath)) {
      console.log(`  ⏭️  跳过 ${iconFile} (已存在)`);
      return;
    }

    fs.copyFileSync(sourcePath, targetPath);
    console.log(`  ✅ ${iconFile}`);
    copied++;
  });

  console.log('');
});

console.log('='.repeat(70));
console.log(`✅ 完成！复制了 ${copied} 个图标文件`);
console.log('='.repeat(70));
console.log('');
console.log('📊 当前图标统计：');
['primary', 'secondary', 'accent', 'white'].forEach(color => {
  const dir = path.join(ICONS_DIR, color);
  const count = fs.readdirSync(dir).filter(f => f.endsWith('.png')).length;
  console.log(`  ${color.padEnd(12)} ${count} 个图标`);
});
console.log('');
console.log('⚠️  下一步：');
console.log('1. 打开 scripts/icon-downloader.html');
console.log('2. 下载所有图标的正确颜色版本');
console.log('3. 运行 node scripts/organizeIcons.js 整理文件');
console.log('4. 正确颜色的图标会自动替换这些占位符');
console.log('');
