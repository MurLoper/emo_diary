/**
 * 图标配置 - 管理图标路径
 * 支持基于主题的动态图标颜色切换
 * 支持本地文件和 CDN 两种模式
 */

const themeConfig = require('./theme-config');

// 图标配置
const ICON_CONFIG = {
  // 模式: 'local' | 'cdn'
  mode: 'local', // 默认使用本地文件

  // CDN 基础 URL（使用 CDN 模式时需要配置）
  cdnBaseUrl: 'https://your-cdn.com/icons', // 需要替换为实际的 CDN 地址

  // 本地图标基础路径
  localBasePath: '/assets/icons',
};

/**
 * 获取图标基础路径（动态根据模式返回）
 */
function getBasePath() {
  return ICON_CONFIG.mode === 'cdn'
    ? ICON_CONFIG.cdnBaseUrl
    : ICON_CONFIG.localBasePath;
}

/**
 * 获取颜色图标路径（动态根据模式返回）
 */
function getColorsPath() {
  return ICON_CONFIG.mode === 'cdn'
    ? `${ICON_CONFIG.cdnBaseUrl}/colors`
    : `${ICON_CONFIG.localBasePath}/colors`;
}

// 图标尺寸配置（单位rpx）
const SIZES = {
  small: { width: 28, height: 28 },   // 24x24px
  medium: { width: 40, height: 40 },  // 32x32px
  large: { width: 96, height: 96 },   // 64x64px
};

/**
 * 将颜色十六进制转换为文件夹名称
 * @param {string} colorHex - 颜色十六进制值 (如 #FFB6C1)
 * @returns {string} 文件夹名称 (如 ffb6c1)
 */
function colorToFolder(colorHex) {
  return colorHex.replace('#', '').toLowerCase();
}

/**
 * 获取图标路径（兼容旧版本）
 * @param {string} iconName - 图标名称
 * @param {string} color - 颜色类型: 'primary' | 'secondary' | 'accent' | 'white'
 * @returns {string} 图标完整路径
 */
function getIconPath(iconName, color = 'primary') {
  // 向后兼容：如果旧的文件夹结构存在，使用旧路径
  return `${getBasePath()}/${color}/${iconName}.png`;
}

/**
 * 根据主题ID和变体获取图标路径
 * @param {string} iconName - 图标名称 (如 'book-open')
 * @param {string} themeId - 主题ID (如 'pink-girl', 'green-fresh')
 * @param {string} variant - 颜色变体: 'primary' | 'secondary' | 'accent' | 'white'
 * @returns {string} 图标完整路径
 */
function getThemeIconPath(iconName, themeId, variant = 'primary') {
  const theme = themeConfig.getThemeById(themeId);

  if (!theme || !theme.colors || !theme.colors[variant]) {
    console.warn(`[iconConfig] 主题 ${themeId} 或变体 ${variant} 不存在，使用默认路径`);
    return getIconPath(iconName, variant);
  }

  const colorHex = theme.colors[variant];
  const colorFolder = colorToFolder(colorHex);

  return `${getColorsPath()}/${colorFolder}/${iconName}.png`;
}

/**
 * 根据颜色十六进制值直接获取图标路径
 * @param {string} iconName - 图标名称
 * @param {string} colorHex - 颜色十六进制值 (如 #FFB6C1)
 * @returns {string} 图标完整路径
 */
function getColorIconPath(iconName, colorHex) {
  const colorFolder = colorToFolder(colorHex);
  return `${getColorsPath()}/${colorFolder}/${iconName}.png`;
}

/**
 * 获取主题相关的图标路径（兼容旧版本）
 * @param {string} iconName - 图标名称
 * @param {string} themeColor - 主题色类型
 * @returns {string} 图标完整路径
 */
function getThemedIconPath(iconName, themeColor) {
  return `${getBasePath()}/${themeColor}/${iconName}.png`;
}

/**
 * 批量获取一组图标的路径
 * @param {Array<string>} iconNames - 图标名称数组
 * @param {string} themeId - 主题ID
 * @param {string} variant - 颜色变体
 * @returns {Object} 图标路径映射对象
 */
function getBatchIconPaths(iconNames, themeId, variant = 'primary') {
  const paths = {};
  iconNames.forEach(iconName => {
    paths[iconName] = getThemeIconPath(iconName, themeId, variant);
  });
  return paths;
}

/**
 * 设置图标模式
 * @param {'local' | 'cdn'} mode - 图标加载模式
 */
function setIconMode(mode) {
  if (mode !== 'local' && mode !== 'cdn') {
    console.warn('[iconConfig] 无效的模式:', mode);
    return;
  }
  ICON_CONFIG.mode = mode;
  console.log(`[iconConfig] 图标模式已切换为: ${mode}`);
}

/**
 * 设置 CDN 基础 URL
 * @param {string} url - CDN 基础 URL
 */
function setCdnBaseUrl(url) {
  ICON_CONFIG.cdnBaseUrl = url;
  console.log('[iconConfig] CDN URL 已更新:', url);
}

/**
 * 获取当前配置
 */
function getConfig() {
  return { ...ICON_CONFIG };
}

module.exports = {
  // 新版 API - 推荐使用
  getThemeIconPath,      // 基于主题ID获取
  getColorIconPath,      // 基于颜色值获取
  getBatchIconPaths,     // 批量获取
  colorToFolder,         // 工具函数

  // 旧版 API - 向后兼容
  getIconPath,
  getThemedIconPath,

  // 配置管理
  setIconMode,           // 设置图标模式
  setCdnBaseUrl,         // 设置 CDN URL
  getConfig,             // 获取当前配置
  getBasePath,           // 获取基础路径
  getColorsPath,         // 获取颜色路径

  // 配置
  sizes: SIZES,
  get basePath() { return getBasePath(); },      // 动态获取
  get colorsPath() { return getColorsPath(); }   // 动态获取
};
