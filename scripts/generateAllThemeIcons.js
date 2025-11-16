/**
 * 生成所有主题颜色的图标
 * 使用 @lucide/icons 包和 sharp 生成 PNG 图标
 *
 * 安装依赖:
 * npm install @lucide/icons sharp
 */

const fs = require('fs');
const path = require('path');

console.log('='.repeat(70));
console.log('全主题图标生成工具');
console.log('='.repeat(70));
console.log('');

// 检查依赖
try {
  require.resolve('sharp');
  require.resolve('@lucide/icons');
} catch (e) {
  console.log('❌ 缺少必要的依赖包');
  console.log('');
  console.log('请先安装依赖:');
  console.log('  npm install sharp @lucide/icons');
  console.log('');
  process.exit(1);
}

const sharp = require('sharp');
const lucideIcons = require('@lucide/icons');

// 主题颜色映射
const themeColorMapping = require('./theme-color-mapping.json');

// 46个图标列表
const ICONS = [
  'arrow-left', 'arrow-right', 'arrow-up', 'award', 'bell', 'book-open',
  'calendar', 'check', 'chevron-down', 'chevron-left', 'chevron-right',
  'clock', 'cloud', 'code', 'coins', 'credit-card', 'crown', 'download',
  'eye', 'eye-off', 'filter', 'gift', 'heart', 'help-circle', 'home',
  'image', 'lock', 'mail', 'maximize-2', 'palette', 'phone', 'plus',
  'printer', 'save', 'search', 'settings', 'share-2', 'shield',
  'smartphone', 'sparkles', 'star', 'tag', 'trending-up', 'user', 'x', 'zap'
];

const ICONS_DIR = path.join(__dirname, '..', 'miniprogram', 'assets', 'icons', 'colors');

// 确保目录存在
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
}

// 收集所有唯一颜色
const allColors = new Set();
Object.values(themeColorMapping.themeMapping).forEach(theme => {
  Object.values(theme.colors).forEach(color => {
    allColors.add(color);
  });
});

console.log(`📊 统计信息:`);
console.log(`  - 图标数量: ${ICONS.length}`);
console.log(`  - 唯一颜色: ${allColors.size}`);
console.log(`  - 总文件数: ${ICONS.length * allColors.size}`);
console.log('');

// 转换图标名称格式
function convertIconName(name) {
  // lucide 包中的图标名称使用 PascalCase
  return name.split('-').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join('');
}

// 将十六进制颜色转换为RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// SVG 转 PNG
async function svgToPng(svgString, color, outputPath) {
  try {
    // 替换 SVG 中的颜色
    const coloredSvg = svgString
      .replace(/stroke="[^"]*"/g, `stroke="${color}"`)
      .replace(/fill="(?!none)[^"]*"/g, `fill="${color}"`);

    // 转换为 PNG
    await sharp(Buffer.from(coloredSvg))
      .resize(48, 48)
      .png()
      .toFile(outputPath);

    return true;
  } catch (error) {
    console.error(`  ❌ 生成失败: ${path.basename(outputPath)}`, error.message);
    return false;
  }
}

// 主函数
async function generateIcons() {
  let generated = 0;
  let skipped = 0;
  let failed = 0;
  const total = ICONS.length * allColors.size;

  console.log('🚀 开始生成图标...');
  console.log('');

  for (const colorHex of allColors) {
    const colorFolder = colorHex.replace('#', '').toLowerCase();
    const colorDir = path.join(ICONS_DIR, colorFolder);

    // 创建颜色文件夹
    if (!fs.existsSync(colorDir)) {
      fs.mkdirSync(colorDir, { recursive: true });
    }

    console.log(`📁 处理颜色: ${colorHex} (${colorFolder})`);

    for (const iconName of ICONS) {
      const outputPath = path.join(colorDir, `${iconName}.png`);

      // 跳过已存在的文件
      if (fs.existsSync(outputPath)) {
        skipped++;
        continue;
      }

      try {
        // 获取 lucide 图标的 SVG
        const lucideName = convertIconName(iconName);
        const iconData = lucideIcons[lucideName];

        if (!iconData) {
          console.log(`  ⚠️  图标不存在: ${iconName} (lucide: ${lucideName})`);
          failed++;
          continue;
        }

        // 构建 SVG 字符串
        const svgString = `
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="${colorHex}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            ${iconData.toSvg()}
          </svg>
        `;

        // 生成 PNG
        const success = await svgToPng(svgString.trim(), colorHex, outputPath);

        if (success) {
          generated++;

          // 每生成100个文件显示一次进度
          if (generated % 100 === 0) {
            const progress = ((generated + skipped) / total * 100).toFixed(1);
            console.log(`  ✅ 进度: ${generated + skipped}/${total} (${progress}%)`);
          }
        } else {
          failed++;
        }

      } catch (error) {
        console.error(`  ❌ 处理失败: ${iconName}`, error.message);
        failed++;
      }
    }
  }

  console.log('');
  console.log('='.repeat(70));
  console.log(`✅ 生成完成！`);
  console.log(`  - 新生成: ${generated} 个文件`);
  console.log(`  - 已跳过: ${skipped} 个文件`);
  if (failed > 0) {
    console.log(`  - 失败: ${failed} 个文件`);
  }
  console.log('='.repeat(70));
  console.log('');
  console.log(`📁 图标保存位置: ${ICONS_DIR}`);
  console.log('');
}

// 运行
generateIcons().catch(error => {
  console.error('❌ 生成过程出错:', error);
  process.exit(1);
});
