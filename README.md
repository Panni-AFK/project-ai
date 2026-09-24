# 彭于晏 · 个人作品集

软件工程在读学生的个人作品集网站，收录微信小程序、全栈 Web、数据可视化与大模型应用等项目。原生 HTML / CSS / JavaScript 构建，无框架、无构建工具、无第三方依赖。

## 技术栈

- 原生 HTML5 / CSS3 / JavaScript（ES5 语法，可直接在浏览器运行）
- CSS 自定义属性驱动的深浅色主题
- Google Fonts：Noto Sans SC / Noto Serif SC

## 运行方式

纯静态站点，无需安装依赖：

```bash
# 方式一：直接双击 index.html 在浏览器打开

# 方式二：任选一种静态服务器
python -m http.server 8000
npx serve .
```

然后访问 `http://localhost:8000`（或对应端口）即可。

## 主要功能

- **单页五大板块**：个人介绍、项目作品、关于我、技能方向、联系方式
- **深浅色主题切换**：导航右侧按钮一键切换，`localStorage` 记忆选择，首次访问跟随系统偏好
- **数据驱动的项目列表**：在 `js/data.js` 追加对象即可新增项目，自动套用四种杂志式版式（wide / image-left / image-right / text）
- **响应式布局**：兼容桌面端（>1024）、平板（641–1024）与手机（≤640），移动端为抽屉式导航
- **页面交互**：导航滚动高亮（scroll-spy）、滚动渐显动画、回到顶部
- **无障碍支持**：跳转链接、aria 标签、focus 描边、`prefers-reduced-motion` 适配

## 目录结构

```
├── index.html            页面结构
├── css/
│   ├── base.css          重置、设计变量、深浅色主题
│   ├── layout.css        版心、栏目骨架、响应式断点
│   ├── components.css    导航、标签、按钮等组件
│   └── projects.css      项目作品四种版式
├── js/
│   ├── data.js           个人信息与项目数据（内容在这里维护）
│   ├── render.js         数据渲染
│   └── main.js           主题切换与页面交互
└── assets/images/        头像与项目封面
```
