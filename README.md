# 第青川 · 个人网站

AI 产品经理的中文个人主页，包含个人介绍、概念作品、产品手记与名片下载。

- 网站：https://clararui.github.io/
- 源码：https://github.com/Clararui/clararui.github.io

轻量静态网站，无需安装依赖。维护源位于 `dist/`，视觉遵循 `design/DESIGN.md` 的白色画廊风格：大字号、浅灰分区、28px 圆角、克制的蓝色控件。页面没有第三方字体或脚本依赖，图片也随源码本地托管。

首屏设备图为 AI 生成的概念产品展示，使用内置 imagegen 工具制作，文件位于 `dist/assets/hero-product.jpg`。生成提示词见 `design/image-prompt.txt`。案例内部的示意界面使用 HTML、CSS 和 SVG 绘制。

## 预览

直接用浏览器打开 `dist/index.html`，或在项目目录运行：

```sh
python3 -m http.server 4173 --directory dist --bind 127.0.0.1
```

随后访问 http://127.0.0.1:4173 。

## 更新内容

- `dist/profile.js`：姓名、职业、简介、邮箱。邮箱留空时，邮件按钮隐藏；填写有效邮箱后自动显示。
- `dist/index.html`：页面文案与作品卡片。
- `dist/app.js`：概念案例详情、名片下载与分享交互。
- `dist/styles.css`：颜色、布局与手机适配。

「知序」「轻流」是明确标注的概念案例，并非真实项目经历。关于和思考部分为网站初版拟稿，可按个人表达修改。当前未提供联系邮箱。

名片下载为 vCard 格式。本地预览不会把本地地址写入名片。线上分享使用浏览器原生分享或复制链接；网站的实际可访问范围取决于托管设置。

## GitHub Pages 部署

工作流位于 `.github/workflows/pages.yml`。将仓库的 Settings → Pages → Source 设置为 **GitHub Actions**。推送 `dist/` 或工作流的变更到 `main` 后，GitHub Actions 会检查 JavaScript 并自动发布 `dist/` 内容；也可以在 Actions 页面手动触发。

日常更新：

```sh
git add dist
git commit -m "Update personal website"
git push origin main
```

无需配置部署密钥或第三方托管服务。`.openai/hosting.json` 保留先前 Sites 版本的关联信息，不会作为 GitHub Pages 网页发布。
