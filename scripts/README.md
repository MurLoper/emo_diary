# 📦 图标下载工具使用指南

## 🚀 快速开始（3 步完成）

### 第 1 步：打开下载工具

在浏览器中打开：
```
scripts/icon-downloader.html
```

### 第 2 步：下载所有图标

1. 页面会显示 24 个图标
2. 默认全选，点击 **"📥 下载所有图标 (4种颜色)"**
3. 浏览器会自动下载 96 个 PNG 文件（24 个图标 × 4 种颜色）

文件名格式示例：
```
primary__book-open.png
primary__palette.png
secondary__image.png
secondary__search.png
accent__sparkles.png
white__save.png
...
```

### 第 3 步：整理文件

1. **将所有下载的 PNG 文件** 移动到：
   ```
   scripts/downloads/
   ```

2. **运行整理脚本**：
   ```bash
   node scripts/organizeIcons.js
   ```

3. 脚本会自动将文件移动到正确的位置：
   ```
   miniprogram/assets/icons/
   ├── primary/
   │   ├── book-open.png
   │   ├── palette.png
   │   └── ...
   ├── secondary/
   │   ├── image.png
   │   └── ...
   ├── accent/
   │   └── sparkles.png
   └── white/
       └── save.png
   ```

4. **重新编译小程序** - 完成！

---

## 📋 可用的脚本

### 1. `icon-downloader.html` - 图标下载工具
- 在浏览器中可视化选择和下载图标
- 自动生成 4 种主题颜色的 PNG
- 尺寸：48x48px

### 2. `downloadIcons.js` - 图标状态检查器
```bash
node scripts/downloadIcons.js
```
- 显示所有需要的图标清单
- 检查哪些图标已下载
- 提供下载指引

### 3. `organizeIcons.js` - 文件整理工具
```bash
node scripts/organizeIcons.js
```
- 自动将下载的文件移动到对应文件夹
- 重命名文件（去掉颜色前缀）
- 显示整理结果

---

## 🎨 主题颜色配置

| 颜色名 | 十六进制 | 用途 |
|--------|----------|------|
| Primary | `#FF6B9D` | 主要元素、主色调图标 |
| Secondary | `#8B7BFF` | 次要元素、辅助图标 |
| Accent | `#FFB84D` | 强调元素、特殊功能 |
| White | `#FFFFFF` | 深色背景上的图标 |

---

## 📊 图标清单

### 首页 (4个)
- home, palette, book-open, image

### 日记相关 (5个)
- save, x, search, calendar, sparkles

### 用户中心 (7个)
- settings, user, shield, bell, help-circle, info, sparkles

### 积分/充值 (6个)
- gift, dollar-sign, zap, crown, credit-card, trending-up

### 图文集 (3个)
- check, sparkles, calendar, image

**总计：24 个图标 × 4 种颜色 = 96 个 PNG 文件**

---

## ❓ 常见问题

### Q: 下载的文件太多，浏览器没反应？
A: 可以分批下载：
1. 在 icon-downloader.html 中取消部分图标的选择
2. 分多次下载
3. 每次下载后运行整理脚本

### Q: 某些图标显示不正常？
A: 检查：
1. 文件是否在正确的文件夹
2. 文件名是否正确（如 `book-open.png` 不是 `bookopen.png`）
3. 图标尺寸是否合适（建议 48x48）

### Q: 如何只下载某个颜色的图标？
A: 在 icon-downloader.html 的代码中修改 `COLORS` 对象，只保留需要的颜色。

---

## 🎯 手动下载备选方案

如果自动化工具不可用，可以使用以下网站手动下载：

1. **Icones.js.org** ⭐ 推荐
   - https://icones.js.org/collection/lucide
   - 可视化搜索和下载
   - 支持自定义颜色和尺寸

2. **Lucide 官网**
   - https://lucide.dev/icons/
   - 官方图标库
   - 支持 PNG 导出

3. **Figma 插件**（批量下载）
   - https://www.figma.com/community/plugin/939567362549682242
   - 适合设计师
   - 可批量导出

---

## ✅ 验证安装

运行以下命令检查图标状态：
```bash
node scripts/downloadIcons.js
```

应该看到：
```
📁 保存位置：
├── primary      ✅ 24 个图标
├── secondary    ✅ 24 个图标
├── accent       ✅ 24 个图标
├── white        ✅ 24 个图标
```

完成后，在微信开发者工具中重新编译，所有图标应该正常显示！
