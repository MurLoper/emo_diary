/**
 * 批量整理下载的图标文件
 * 将 colorName__iconName.png 格式的文件移动到对应的颜色文件夹
 *
 * 使用方法：
 * 1. 从 icon-downloader.html 下载所有图标
 * 2. 将下载的文件放到 scripts/downloads 文件夹
 * 3. 运行: node scripts/organizeIcons.js
 */

const fs = require('fs');
const path = require('path');

const DOWNLOADS_DIR = path.join(__dirname, 'downloads');
const ICONS_DIR = path.join(__dirname, '..', 'miniprogram', 'assets', 'icons');

console.log('='.repeat(70));
console.log('图标文件整理工具');
console.log('='.repeat(70));
console.log('');

// 检查下载文件夹是否存在
if (!fs.existsSync(DOWNLOADS_DIR)) {
  fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
  console.log('❌ downloads 文件夹不存在，已创建');
  console.log('');
  console.log('请将从 icon-downloader.html 下载的图标文件');
  console.log(`放到: ${DOWNLOADS_DIR}`);
  console.log('');
  console.log('文件名格式应为: primary__book-open.png, secondary__image.png 等');
  console.log('');
  process.exit(0);
}

// 获取所有下载的文件
const files = fs.readdirSync(DOWNLOADS_DIR).filter(f => f.endsWith('.png'));

if (files.length === 0) {
  console.log('❌ downloads 文件夹中没有 PNG 文件');
  console.log('');
  console.log('请先使用 icon-downloader.html 下载图标，然后：');
  console.log(`1. 将所有下载的 .png 文件移动到: ${DOWNLOADS_DIR}`);
  console.log('2. 重新运行此脚本');
  console.log('');
  process.exit(0);
}

console.log(`📁 找到 ${files.length} 个图标文件`);
console.log('');

let moved = 0;
let skipped = 0;
const errors = [];

files.forEach(filename => {
  // 解析文件名: colorName__iconName.png
  const match = filename.match(/^(primary|secondary|accent|white)__(.+)\.png$/);

  if (!match) {
    skipped++;
    errors.push(`⚠️  跳过: ${filename} (格式不正确)`);
    return;
  }

  const [, colorName, iconName] = match;
  const sourcePath = path.join(DOWNLOADS_DIR, filename);
  const targetDir = path.join(ICONS_DIR, colorName);
  const targetPath = path.join(targetDir, `${iconName}.png`);

  // 确保目标文件夹存在
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  try {
    // 移动文件
    fs.renameSync(sourcePath, targetPath);
    moved++;
    console.log(`✅ ${colorName}/${iconName}.png`);
  } catch (error) {
    skipped++;
    errors.push(`❌ 失败: ${filename} - ${error.message}`);
  }
});

console.log('');
console.log('='.repeat(70));
console.log(`✅ 成功移动: ${moved} 个文件`);
if (skipped > 0) {
  console.log(`⚠️  跳过/失败: ${skipped} 个文件`);
}
console.log('='.repeat(70));

if (errors.length > 0) {
  console.log('');
  console.log('错误详情:');
  errors.forEach(err => console.log(err));
}

console.log('');
console.log('📊 当前图标统计:');
console.log('');

['primary', 'secondary', 'accent', 'white'].forEach(color => {
  const dir = path.join(ICONS_DIR, color);
  if (fs.existsSync(dir)) {
    const count = fs.readdirSync(dir).filter(f => f.endsWith('.png')).length;
    console.log(`  ${color.padEnd(12)} ${count} 个图标`);
  } else {
    console.log(`  ${color.padEnd(12)} 0 个图标`);
  }
});

console.log('');
console.log('🎉 完成！现在可以重新编译小程序查看效果');
console.log('');
