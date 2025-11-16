# 图标资源说明

## 目录结构
```
assets/icons/
├── primary/    # 主色调图标（用于主要操作、选中状态）
├── secondary/  # 次色调图标（用于辅助操作）
├── accent/     # 强调色图标（用于特殊提示、AI功能）
└── white/      # 白色图标（用于深色背景）
```

## 需要的图标列表

### 基础图标（20x20 或 24x24）

| 图标名称 | Lucide名称 | 用途 | 需要的颜色版本 |
|---------|-----------|------|--------------|
| palette.png | palette | 主题入口 | primary |
| book-open.png | book-open | 日记/写日记 | primary, white |
| image.png | image | 图片/图文集 | primary, secondary, white |
| save.png | save | 保存 | white |
| x.png | x | 关闭/删除 | white, secondary |
| search.png | search | 搜索 | secondary |
| calendar.png | calendar | 日历/签到 | primary, white |
| settings.png | settings | 设置 | primary |
| user.png | user | 用户 | primary |
| shield.png | shield | 隐私/安全 | primary |
| bell.png | bell | 通知 | primary |
| help-circle.png | help-circle | 帮助 | primary |
| info.png | info | 信息 | primary |
| sparkles.png | sparkles | AI/特效 | accent, white |
| gift.png | gift | 礼物/奖励 | primary, white |
| dollar-sign.png | dollar-sign | 金币/货币 | primary, secondary |
| zap.png | zap | 闪电/快速 | primary |
| crown.png | crown | VIP/高级 | primary, secondary, white |
| credit-card.png | credit-card | 支付 | white |
| trending-up.png | trending-up | 趋势上升 | primary |
| check.png | check | 勾选/确认 | white, primary |
| lock.png | lock | 锁定 | white |
| medal.png | award | 徽章/奖励 | primary, secondary |

## 下载方式

### 方式1: 使用 Lucide 官网（推荐）
1. 访问 https://lucide.dev/icons/
2. 搜索对应的图标名称
3. 点击图标后选择 "Download PNG"
4. 设置参数：
   - Size: 24x24 或 48x48（根据用途）
   - Color: 根据需要的主题色
     - Primary: #FF6B9D（粉色）
     - Secondary: #8B7BFF（紫色）
     - Accent: #FFB84D（橙色）
     - White: #FFFFFF
   - Stroke Width: 2

### 方式2: 使用在线工具批量生成
可以使用 Figma 或 Iconify 等工具批量导出

### 方式3: 使用代码生成（需要Node.js）
```bash
npm install lucide-static
# 然后使用脚本批量生成不同颜色的PNG
```

## 命名规范
- 格式: `[图标名称].png`
- 示例: `book-open.png`, `sparkles.png`

## 尺寸规范
- 小图标（按钮、标签）: 24x24
- 中图标（卡片）: 48x48
- 大图标（空状态）: 64x64

## 使用示例
```xml
<!-- 使用主色调图标 -->
<image src="/assets/icons/primary/book-open.png" mode="aspectFit" style="width: 20px; height: 20px;" />

<!-- 使用白色图标 -->
<image src="/assets/icons/white/save.png" mode="aspectFit" style="width: 20px; height: 20px;" />
```
