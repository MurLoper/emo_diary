/**
 * 从主题配置中提取所有需要的图标颜色
 * 为每个主题的 primary, secondary, accent 颜色生成图标
 */

const themeConfig = require('../miniprogram/utils/theme-config');
const fs = require('fs');
const path = require('path');

console.log('='.repeat(70));
console.log('主题图标颜色提取工具');
console.log('='.repeat(70));
console.log('');

const allThemes = themeConfig.getAllThemes();

console.log(`📊 主题总数: ${allThemes.length}`);
console.log('');

// 提取所有唯一颜色
const colorMap = new Map();

allThemes.forEach(theme => {
  const { primary, secondary, accent } = theme.colors;

  // 添加 primary
  if (!colorMap.has(primary)) {
    colorMap.set(primary, []);
  }
  colorMap.get(primary).push(`${theme.name}-primary`);

  // 添加 secondary
  if (!colorMap.has(secondary)) {
    colorMap.set(secondary, []);
  }
  colorMap.get(secondary).push(`${theme.name}-secondary`);

  // 添加 accent
  if (!colorMap.has(accent)) {
    colorMap.set(accent, []);
  }
  colorMap.get(accent).push(`${theme.name}-accent`);
});

// 添加白色
colorMap.set('#FFFFFF', ['white']);

console.log(`🎨 唯一颜色数量: ${colorMap.size}`);
console.log('');

// 按主题分组显示
console.log('📋 按主题分组的颜色配置:');
console.log('');

allThemes.forEach(theme => {
  console.log(`${theme.name} (${theme.type}):`);
  console.log(`  Primary:   ${theme.colors.primary}`);
  console.log(`  Secondary: ${theme.colors.secondary}`);
  console.log(`  Accent:    ${theme.colors.accent}`);
  console.log('');
});

// 生成颜色到主题的映射
const themeColorMapping = {};

allThemes.forEach(theme => {
  themeColorMapping[theme.id] = {
    name: theme.name,
    type: theme.type,
    colors: {
      primary: theme.colors.primary,
      secondary: theme.colors.secondary,
      accent: theme.colors.accent,
      white: '#FFFFFF'
    }
  };
});

// 保存映射文件
const outputPath = path.join(__dirname, 'theme-color-mapping.json');
fs.writeFileSync(outputPath, JSON.stringify({
  totalThemes: allThemes.length,
  totalUniqueColors: colorMap.size,
  themeMapping: themeColorMapping,
  allUniqueColors: Array.from(colorMap.keys())
}, null, 2));

console.log(`✅ 主题颜色映射已保存到: ${outputPath}`);
console.log('');

console.log('='.repeat(70));
console.log('');
console.log('💡 建议的图标组织方式:');
console.log('');
console.log('方案 1: 按主题组织（推荐）');
console.log('  assets/icons/');
console.log('    pink-girl/');
console.log('      primary/   (包含该主题 primary 颜色的所有图标)');
console.log('      secondary/');
console.log('      accent/');
console.log('    green-fresh/');
console.log('      ...');
console.log('');
console.log('方案 2: 按颜色哈希组织（节省空间）');
console.log('  assets/icons/');
console.log('    colors/');
console.log('      ffb6c1/   (颜色十六进制)');
console.log('      4caf50/');
console.log('      ...');
console.log('');
console.log('方案 3: 动态生成（最优）');
console.log('  只下载基础 4 种颜色 + 白色');
console.log('  运行时通过 CSS filter 动态调整颜色');
console.log('  优点：文件少，灵活');
console.log('  缺点：性能略低');
console.log('');

console.log('📊 存储空间估算:');
console.log('');
console.log(`  图标数量: 46 个`);
console.log(`  方案 1: 46 × 4 × 18 = ${46 * 4 * 18} 个文件`);
console.log(`  方案 2: 46 × ${colorMap.size} = ${46 * colorMap.size} 个文件`);
console.log(`  方案 3: 46 × 5 = 230 个文件 (推荐)`);
console.log('');
