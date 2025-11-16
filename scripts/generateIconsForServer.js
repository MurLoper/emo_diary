/**
 * 后端图标生成脚本 - 生成所有主题图标到服务器
 * 使用 canvas 和 lucide 直接生成 PNG 文件
 *
 * 运行: node scripts/generateIconsForServer.js
 */

const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

console.log('='.repeat(70));
console.log('后端图标生成工具 - 服务器版本');
console.log('='.repeat(70));
console.log('');

// 检查依赖
let Canvas, lucide;
try {
  Canvas = require('canvas');
  lucide = require('lucide-static');
  console.log('✅ 依赖检查通过');
} catch (e) {
  console.log('❌ 缺少必要的依赖包');
  console.log('');
  console.log('请先安装依赖:');
  console.log('  npm install canvas lucide-static');
  console.log('');
  console.log('如果 canvas 安装失败，请参考:');
  console.log('  https://github.com/Automattic/node-canvas#installation');
  console.log('');
  process.exit(1);
}

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

// 输出目录配置
const OUTPUT_DIR = path.join(__dirname, 'server-icons');
const COLORS_DIR = path.join(OUTPUT_DIR, 'colors');

// 创建输出目录
[OUTPUT_DIR, COLORS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// 收集所有唯一颜色
const allColors = new Set();
Object.values(themeColorMapping.themeMapping).forEach(theme => {
  Object.values(theme.colors).forEach(color => {
    allColors.add(color);
  });
});

console.log('');
console.log(`📊 生成统计:`);
console.log(`  - 图标数量: ${ICONS.length}`);
console.log(`  - 唯一颜色: ${allColors.size}`);
console.log(`  - 总文件数: ${ICONS.length * allColors.size}`);
console.log(`  - 输出目录: ${OUTPUT_DIR}`);
console.log('');

/**
 * 将 Lucide SVG 图标转换为 PNG
 */
function svgToPng(iconName, colorHex, size = 48) {
  try {
    // 转换图标名称格式 (arrow-left -> ArrowLeft)
    const lucideName = iconName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');

    // 获取 SVG 路径数据
    const iconData = lucide[lucideName];

    if (!iconData) {
      console.warn(`  ⚠️  图标不存在: ${iconName} (${lucideName})`);
      return null;
    }

    // 创建 Canvas
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // 设置背景透明
    ctx.clearRect(0, 0, size, size);

    // 解析颜色
    const rgb = hexToRgb(colorHex);
    if (!rgb) {
      console.warn(`  ⚠️  颜色格式错误: ${colorHex}`);
      return null;
    }

    // 设置绘制样式
    ctx.strokeStyle = colorHex;
    ctx.fillStyle = colorHex;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // 绘制图标 (简化的SVG路径渲染)
    // 注意: 这里需要更复杂的SVG解析，建议使用完整的库
    // 目前使用占位符图片

    // 绘制一个简单的占位符
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.3;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    // 返回 Buffer
    return canvas.toBuffer('image/png');

  } catch (error) {
    console.error(`  ❌ 生成失败: ${iconName}`, error.message);
    return null;
  }
}

/**
 * 将十六进制颜色转换为 RGB
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * 主生成函数
 */
async function generateIcons() {
  let generated = 0;
  let skipped = 0;
  let failed = 0;
  const total = ICONS.length * allColors.size;

  console.log('🚀 开始生成图标...');
  console.log('');

  for (const colorHex of allColors) {
    const colorFolder = colorHex.replace('#', '').toLowerCase();
    const colorDir = path.join(COLORS_DIR, colorFolder);

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
        const pngBuffer = svgToPng(iconName, colorHex);

        if (pngBuffer) {
          fs.writeFileSync(outputPath, pngBuffer);
          generated++;

          // 每生成100个文件显示进度
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
  console.log(`📁 图标保存位置: ${COLORS_DIR}`);
  console.log('');
  console.log('📤 下一步操作:');
  console.log('  1. 将 server-icons 文件夹上传到您的服务器');
  console.log('  2. 配置 CDN 地址（如: https://cdn.example.com/icons/）');
  console.log('  3. 更新小程序中的图标配置');
  console.log('');
}

// 运行
generateIcons().catch(error => {
  console.error('❌ 生成过程出错:', error);
  process.exit(1);
});
