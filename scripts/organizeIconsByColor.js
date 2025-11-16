/**
 * 整理下载的图标文件 - 按颜色哈希组织
 * 文件名格式: colorhex__iconname.png
 * 目标结构: miniprogram/assets/icons/colors/ffb6c1/icon-name.png
 */

const fs = require('fs');
const path = require('path');

const DOWNLOADS_DIR = path.join(__dirname, 'downloads');
const ICONS_BASE = path.join(__dirname, '..', 'miniprogram', 'assets', 'icons');
const COLORS_DIR = path.join(ICONS_BASE, 'colors');

console.log('='.repeat(70));
console.log('图标文件整理工具 - 按颜色组织');
console.log('='.repeat(70));
console.log('');

// 确保下载文件夹存在
if (!fs.existsSync(DOWNLOADS_DIR)) {
  console.log('❌ 下载文件夹不存在:', DOWNLOADS_DIR);
  console.log('请先下载图标文件到该文件夹');
  process.exit(1);
}

// 创建 colors 目录
if (!fs.existsSync(COLORS_DIR)) {
  fs.mkdirSync(COLORS_DIR, { recursive: true });
  console.log('✅ 创建颜色目录:', COLORS_DIR);
  console.log('');
}

// 读取所有下载的文件
const files = fs.readdirSync(DOWNLOADS_DIR).filter(f => f.endsWith('.png'));

if (files.length === 0) {
  console.log('❌ 下载文件夹中没有 PNG 文件');
  console.log('请先使用 icon-downloader-all-themes.html 下载图标');
  process.exit(1);
}

console.log(`📁 找到 ${files.length} 个图标文件`);
console.log('');

let moved = 0;
let skipped = 0;
let errors = 0;

const colorStats = {};

files.forEach(filename => {
  try {
    // 文件名格式: ffb6c1__book-open.png
    const match = filename.match(/^([a-f0-9]{6})__(.+)\.png$/i);

    if (!match) {
      console.log(`⚠️  跳过（格式不匹配）: ${filename}`);
      skipped++;
      return;
    }

    const [, colorHex, iconName] = match;
    const colorLower = colorHex.toLowerCase();

    // 创建颜色文件夹
    const colorDir = path.join(COLORS_DIR, colorLower);
    if (!fs.existsSync(colorDir)) {
      fs.mkdirSync(colorDir, { recursive: true });
    }

    // 移动文件
    const sourcePath = path.join(DOWNLOADS_DIR, filename);
    const targetPath = path.join(colorDir, `${iconName}.png`);

    if (fs.existsSync(targetPath)) {
      console.log(`  ⏭️  已存在: ${colorLower}/${iconName}.png`);
      skipped++;
    } else {
      fs.renameSync(sourcePath, targetPath);
      console.log(`  ✅ ${colorLower}/${iconName}.png`);
      moved++;
    }

    // 统计
    if (!colorStats[colorLower]) {
      colorStats[colorLower] = 0;
    }
    colorStats[colorLower]++;

  } catch (error) {
    console.log(`❌ 处理失败: ${filename}`, error.message);
    errors++;
  }
});

console.log('');
console.log('='.repeat(70));
console.log(`✅ 完成！移动了 ${moved} 个文件`);
console.log(`⏭️  跳过了 ${skipped} 个已存在的文件`);
if (errors > 0) {
  console.log(`❌ ${errors} 个文件处理失败`);
}
console.log('='.repeat(70));
console.log('');

console.log('📊 按颜色分类统计:');
console.log('');

const sortedColors = Object.entries(colorStats).sort((a, b) => b[1] - a[1]);
sortedColors.forEach(([color, count]) => {
  console.log(`  #${color.toUpperCase()}: ${count} 个图标`);
});

console.log('');
console.log(`📁 图标保存位置: ${COLORS_DIR}`);
console.log('');
console.log('🎉 图标整理完成！现在可以在小程序中使用了！');
console.log('');
