/**
 * 简化版图标生成工具 - 通过网络下载 Lucide SVG 并转换
 * 依赖: axios, sharp
 *
 * 安装: npm install axios sharp
 * 运行: node scripts/downloadAndGenerateIcons.js
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios').default;
const sharp = require('sharp');

console.log('='.repeat(70));
console.log('图标下载与生成工具 - 服务器版本');
console.log('='.repeat(70));
console.log('');

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

// 输出目录
const OUTPUT_DIR = path.join(__dirname, 'server-icons', 'colors');

// 创建输出目录
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 收集所有唯一颜色
const allColors = new Set();
Object.values(themeColorMapping.themeMapping).forEach(theme => {
  Object.values(theme.colors).forEach(color => {
    allColors.add(color);
  });
});

console.log(`📊 生成统计:`);
console.log(`  - 图标数量: ${ICONS.length}`);
console.log(`  - 唯一颜色: ${allColors.size}`);
console.log(`  - 总文件数: ${ICONS.length * allColors.size}`);
console.log(`  - 输出目录: ${OUTPUT_DIR}`);
console.log('');

/**
 * 从 CDN 下载 SVG 图标
 */
async function downloadSvg(iconName) {
  try {
    const url = `https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/${iconName}.svg`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`  ❌ 下载失败: ${iconName}`, error.message);
    return null;
  }
}

/**
 * 替换 SVG 颜色
 */
function recolorSvg(svgContent, colorHex) {
  return svgContent
    .replace(/stroke="[^"]*"/g, `stroke="${colorHex}"`)
    .replace(/fill="(?!none)[^"]*"/g, `fill="${colorHex}"`);
}

/**
 * 将 SVG 转换为 PNG
 */
async function svgToPng(svgContent, outputPath, size = 48) {
  try {
    await sharp(Buffer.from(svgContent))
      .resize(size, size)
      .png()
      .toFile(outputPath);
    return true;
  } catch (error) {
    console.error(`  ❌ 转换失败: ${path.basename(outputPath)}`, error.message);
    return false;
  }
}

/**
 * 生成单个颜色的所有图标
 */
async function generateColorBatch(colorHex, svgCache) {
  const colorFolder = colorHex.replace('#', '').toLowerCase();
  const colorDir = path.join(OUTPUT_DIR, colorFolder);

  // 创建颜色文件夹
  if (!fs.existsSync(colorDir)) {
    fs.mkdirSync(colorDir, { recursive: true });
  }

  console.log(`📁 处理颜色: ${colorHex} (${colorFolder})`);

  let count = 0;

  for (const iconName of ICONS) {
    const outputPath = path.join(colorDir, `${iconName}.png`);

    // 跳过已存在的文件
    if (fs.existsSync(outputPath)) {
      continue;
    }

    // 从缓存获取或下载 SVG
    if (!svgCache[iconName]) {
      svgCache[iconName] = await downloadSvg(iconName);
      // 添加延迟避免请求过快
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const svgContent = svgCache[iconName];
    if (!svgContent) {
      continue;
    }

    // 重新着色
    const coloredSvg = recolorSvg(svgContent, colorHex);

    // 转换为 PNG
    const success = await svgToPng(coloredSvg, outputPath);
    if (success) {
      count++;
    }
  }

  return count;
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 开始生成图标...');
  console.log('');

  const svgCache = {}; // 缓存SVG内容
  let totalGenerated = 0;

  const colors = Array.from(allColors);

  for (let i = 0; i < colors.length; i++) {
    const colorHex = colors[i];
    const count = await generateColorBatch(colorHex, svgCache);
    totalGenerated += count;

    const progress = ((i + 1) / colors.length * 100).toFixed(1);
    console.log(`  ✅ 进度: ${i + 1}/${colors.length} 颜色完成 (${progress}%)`);
  }

  console.log('');
  console.log('='.repeat(70));
  console.log(`✅ 生成完成！`);
  console.log(`  - 总共生成: ${totalGenerated} 个文件`);
  console.log('='.repeat(70));
  console.log('');
  console.log(`📁 图标保存位置: ${OUTPUT_DIR}`);
  console.log('');
  console.log('📤 下一步操作:');
  console.log('  1. 将 server-icons 文件夹上传到您的服务器/CDN');
  console.log('  2. 在小程序配置中设置 CDN 地址');
  console.log('  3. 更新 iconConfig.js 使用 CDN URL');
  console.log('');
}

// 运行
main().catch(error => {
  console.error('❌ 生成过程出错:', error);
  process.exit(1);
});
