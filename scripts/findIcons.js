/**
 * 查找下载的图标文件
 * 检查常见的下载位置
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('='.repeat(70));
console.log('图标文件查找工具');
console.log('='.repeat(70));
console.log('');

// 常见下载位置
const possiblePaths = [
  path.join(os.homedir(), 'Downloads'),
  path.join(os.homedir(), '下载'),
  path.join(process.cwd(), 'scripts', 'downloads'),
];

console.log('📁 检查以下位置的图标文件：');
console.log('');

let foundFiles = [];

possiblePaths.forEach(dirPath => {
  console.log(`检查: ${dirPath}`);

  if (!fs.existsSync(dirPath)) {
    console.log('  ❌ 目录不存在');
    console.log('');
    return;
  }

  try {
    const files = fs.readdirSync(dirPath);
    const iconFiles = files.filter(f => {
      // 查找格式为 color__iconname.png 的文件
      return f.match(/^(primary|secondary|accent|white)__[\w-]+\.png$/);
    });

    if (iconFiles.length > 0) {
      console.log(`  ✅ 找到 ${iconFiles.length} 个图标文件`);
      foundFiles.push({ path: dirPath, files: iconFiles });

      // 显示前5个文件作为示例
      iconFiles.slice(0, 5).forEach(f => console.log(`     - ${f}`));
      if (iconFiles.length > 5) {
        console.log(`     ... 还有 ${iconFiles.length - 5} 个文件`);
      }
    } else {
      console.log('  ⬜ 未找到图标文件');
    }
  } catch (error) {
    console.log(`  ❌ 无法读取: ${error.message}`);
  }

  console.log('');
});

console.log('='.repeat(70));

if (foundFiles.length === 0) {
  console.log('');
  console.log('❌ 未找到下载的图标文件');
  console.log('');
  console.log('📋 请确认：');
  console.log('');
  console.log('1. 是否已经使用 icon-downloader.html 下载图标？');
  console.log('2. 下载的文件名格式是否为: primary__book-open.png');
  console.log('3. 文件是否在以下位置之一：');
  possiblePaths.forEach(p => console.log(`   - ${p}`));
  console.log('');
  console.log('💡 如何操作：');
  console.log('');
  console.log('1. 打开浏览器的下载文件夹 (Ctrl + J)');
  console.log('2. 找到所有格式为 "颜色__图标名.png" 的文件');
  console.log('3. 全选这些文件 (Ctrl + A 或手动选择)');
  console.log('4. 复制或移动到：');
  console.log(`   ${path.join(process.cwd(), 'scripts', 'downloads')}`);
  console.log('5. 运行: node scripts/organizeIcons.js');
  console.log('');
} else {
  console.log('');
  console.log('✅ 找到图标文件！');
  console.log('');

  foundFiles.forEach(({ path: dirPath, files }) => {
    console.log(`📁 位置: ${dirPath}`);
    console.log(`   文件数: ${files.length}`);
    console.log('');
  });

  const scriptsDownloads = path.join(process.cwd(), 'scripts', 'downloads');
  const foundInScripts = foundFiles.some(f => f.path === scriptsDownloads);

  if (foundInScripts) {
    console.log('✅ 文件已在正确位置！');
    console.log('');
    console.log('下一步：运行整理脚本');
    console.log('  node scripts/organizeIcons.js');
    console.log('');
  } else {
    console.log('⚠️  文件需要移动到：');
    console.log(`   ${scriptsDownloads}`);
    console.log('');
    console.log('操作步骤：');
    console.log('1. 打开文件所在位置');
    console.log('2. 全选所有图标文件');
    console.log('3. 复制或移动到上述路径');
    console.log('4. 运行: node scripts/organizeIcons.js');
    console.log('');
  }
}
