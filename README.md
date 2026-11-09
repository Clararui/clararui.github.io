# 第青川 · 克拉拉 · 个人网站

AI 产品经理的个人作品集主页：首屏 CLARA 大字与 3D 形象、关键词滚动条、关于我、能力、作品（截图审判所、YouTube Digest · Notes、会议助理 Skill）、写作与联系方式。

- 网站：https://clararui.github.io/
- 源码：https://github.com/Clararui/clararui.github.io

纯静态单页，没有第三方运行时依赖。英文大字字体 Archivo 自托管在 `dist/assets/archivo.woff2`（SIL OFL 许可，见 `dist/assets/archivo-OFL.txt`），中文使用系统字体，国内访问不依赖境外资源。

## 预览

```sh
python3 -m http.server 4173 --directory dist --bind 127.0.0.1
```

随后访问 http://127.0.0.1:4173 。

## 更新内容

所有文字都在 `dist/index.html` 底部脚本的 `SITE` 配置里：

- `showAvatar`：首屏是否显示个人形象，`true` 显示，`false` 隐藏（只保留大字和漂浮的道具）。
- `tagline`、`intro`、`about`、`skills`、`works`：首屏、关于我、能力、作品的文案。
- `article.url`：公众号文章链接，留空时点击会复制公众号名称。
- 图片在 `dist/assets/`：`avatar.webp` 是形象，`prop-*.webp` 是漂浮道具，`sd-*`、`yt-*`、`ma-*` 是作品截图。

旧版"Superr 手账风格"页面保留在 git 历史中。

## GitHub Pages 部署

工作流位于 `.github/workflows/pages.yml`。将仓库的 Settings → Pages → Source 设置为 **GitHub Actions**。推送 `dist/` 或工作流的变更到 `main` 后，GitHub Actions 会检查站点文件并自动发布 `dist/` 内容；也可以在 Actions 页面手动触发。

日常更新：

```sh
git add dist
git commit -m "Update personal website"
git push origin main
```

无需配置部署密钥或第三方托管服务。`.openai/hosting.json` 保留先前 Sites 版本的关联信息，不会作为 GitHub Pages 网页发布。
