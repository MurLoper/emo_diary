# CDN 资源部署说明

## 需要上传到 CDN 的文件

以下目录中的文件需要单独上传到 CDN 服务器，**不包含在 Git 版本控制中**：

### 1. 图标资源文件
```
scripts/server-icons/colors/     # 所有主题颜色的图标文件
miniprogram/assets/icons/colors/ # 小程序中使用的图标文件（如果存在）
```

### 2. 临时下载文件
```
scripts/downloads/               # 下载的原始图标文件（可选上传）
```

## CDN 部署步骤

### 方式一：使用云存储服务

#### 使用腾讯云 COS
1. 登录腾讯云控制台
2. 创建存储桶，例如：`emo-diary-icons`
3. 上传 `scripts/server-icons/colors/` 目录到存储桶根目录
4. 配置 CDN 加速
5. 获取 CDN 域名，例如：`https://cdn.example.com/`

#### 配置小程序使用 CDN
修改 `miniprogram/utils/iconConfig.js`:
```javascript
const ICON_CONFIG = {
  mode: 'cdn',  // 切换到 CDN 模式
  cdnBaseUrl: 'https://cdn.example.com/icons',  // 替换为实际 CDN 地址
  localBasePath: '/assets/icons',
};
```

### 方式二：使用 GitHub Pages（免费方案）

1. 在 GitHub 仓库中创建 `gh-pages` 分支
2. 将 `scripts/server-icons/colors/` 目录推送到该分支
3. 启用 GitHub Pages
4. 使用 URL: `https://yourusername.github.io/emo_diary/icons/colors/`

### 方式三：使用七牛云 / 阿里云 OSS

参考对应云服务商的文档进行配置。

## 图标目录结构

上传后的 CDN 目录结构应该是：
```
https://your-cdn.com/icons/colors/
├── ffb6c1/              # 粉色少女主题 primary 色图标
│   ├── book-open.png
│   ├── image.png
│   ├── palette.png
│   └── ...
├── ffc0cb/              # 粉色少女主题 secondary 色图标
│   └── ...
├── 4caf50/              # 绿意盎然主题 primary 色图标
│   └── ...
└── .../                 # 其他颜色的图标
```

## 本地开发

在本地开发时，可以继续使用 `mode: 'local'`，从本地 `miniprogram/assets/icons/` 目录加载图标。

## 生成图标文件

如果需要重新生成图标文件，运行：
```bash
cd scripts
node generateIconsForServer.js
```

生成的文件将保存在 `scripts/server-icons/colors/` 目录中。

## 注意事项

1. **.gitignore 已配置**：图标文件目录已添加到 .gitignore，不会被提交到 Git
2. **文件大小**：所有图标总大小约 XX MB（根据实际情况填写）
3. **更新频率**：主题颜色变更时需要重新生成并上传图标
4. **缓存策略**：建议设置 CDN 缓存时间为 30 天以上

## 相关文件

- `miniprogram/utils/iconConfig.js` - 图标配置文件
- `scripts/generateIconsForServer.js` - 图标生成脚本
- `.gitignore` - Git 忽略配置
