/* ==========================================================================
   data.js — 站点内容数据（全站唯一需要日常维护的文件）
   ---------------------------------------------------------------------------
   新增一个项目：往 PROJECTS 数组里追加一个对象即可，页面会自动渲染，
   不需要改动 index.html 或任何 CSS。

   layout 可选值（决定该项目用哪种杂志式版式）：
     "wide"        —— 全幅大图通栏 + 下方双栏文字，用于代表作 / 封面位
     "image-left"  —— 图 7 : 文 4，左图右文
     "image-right" —— 文 4 : 图 7，右图左文（上一条的镜像）
     "text"        —— 文 8 : 图 3，文字主导 + 窄幅竖图，作为节奏缓冲
   不填或填错时自动回退为 "image-left"。
   ========================================================================== */

/* 个人信息 ---------------------------------------------------------------- */
const PROFILE = {
  name: "彭于晏",
  role: "软件工程 · 在读",
  eyebrow: "Portfolio · 2026",
  intro:
    "我是一名软件工程专业学生，目前主要关注 AI 辅助开发与大语言模型技术。平时主要使用 Python、Java 和 TypeScript 进行项目开发，也在持续学习前后端开发、数据可视化和 AI 应用构建。",
  vertical: "Selected Works",
  skills: ["Python", "Java", "TypeScript", "HTML / CSS"],

  /* 首屏人像照 —— 换成自己的照片只需改这一个 src。
     把照片文件放进 assets/images/profile/，文件名写在这里即可，
     例如 src: "assets/images/profile/me.jpg"。建议竖构图（约 4:5），
     宽边不小于 800px；alt 请一并改成对应的说明文字。

     构图提示：照片在 4:5 的框里按 object-fit: cover 裁切，
     裁切位置由 css/layout.css 里 .hero-portrait-img 的 object-position 控制
     （当前 50% 8%，适合人物头部靠上的半身照）。换照片后如果裁到了脸，
     调那个值即可：0% 保留顶部，100% 保留底部。 */
  photo: {
    src: "assets/images/profile/portrait.png",
    alt: "彭于晏的个人照片",
    caption: "彭于晏",
    meta: "软件工程 · 中国 · 广州"
  },

  facts: [
    { key: "专业", value: "软件工程" },
    { key: "方向", value: "AI 辅助开发 · 大语言模型" },
    { key: "城市", value: "中国 · 广州" },
    { key: "状态", value: "广州软件学院 在读" }
  ]
};

/* 关于我 ------------------------------------------------------------------ */
const ABOUT = {
  quote: "把课堂上学到的东西，做成真正有人用的东西。",
  paragraphs: [
    "我是软件工程专业的在读学生，写代码的时间大多花在把想法落成可运行的产品上。相比堆叠功能，我更在意一件事有没有被真正解决：用户能不能在三步之内完成操作，数据能不能被一眼看懂，模型的回答能不能给出出处。",
    "我的项目跨度比较杂——微信小程序、全栈 Web 平台、数据可视化大屏，以及基于大语言模型的问答应用。这个过程让我逐渐习惯了从需求梳理、界面设计到接口开发的完整链路，也习惯了在陌生的技术栈里自己找答案。",
    "目前我在 AI 辅助开发和大语言模型应用方向上持续投入，正在学习 RAG 与向量检索这类让模型真正接入私有知识的技术。我希望自己做出来的是能被用起来的东西，而不只是一份作业。"
  ],
  timeline: [
    { time: "2026.07", title: "课语通", note: "大语言模型课程问答助手" },
    { time: "2026.03", title: "城市脉搏", note: "城市数据可视化大屏" },
    { time: "2025.09", title: "拾光集市", note: "校园二手交易平台 · 注册用户 300+" },
    { time: "2025.04", title: "轻记账", note: "极简记账微信小程序" }
  ]
};

/* 技能方向 ---------------------------------------------------------------- */
const SKILL_GROUPS = [
  {
    title: "编程语言",
    items: ["Python", "Java", "TypeScript", "HTML / CSS"]
  },
  {
    title: "前端与可视化",
    items: ["Vue", "微信小程序", "ECharts", "Canvas", "SVG", "响应式布局"]
  },
  {
    title: "后端与数据",
    items: ["Spring Boot", "FastAPI", "MySQL", "微信云开发"]
  },
  {
    title: "AI 与模型应用",
    items: ["RAG 检索增强", "向量检索", "大语言模型 API", "Streamlit"]
  }
];

/* 联系方式 ---------------------------------------------------------------- */
const CONTACTS = [
  { key: "邮箱", value: "xiaohe@example.com", href: "mailto:xiaohe@example.com" },
  { key: "微信", value: "xiaohezi", href: "" },
  { key: "GitHub", value: "github.com/xiaohe-dev", href: "https://github.com/xiaohe-dev" },
  { key: "个人主页", value: "xiaohe.dev", href: "https://xiaohe.dev" },
  { key: "所在地", value: "中国 · 广州", href: "" }
];

/* 项目经历 ----------------------------------------------------------------
   按时间倒序排列，最新的放最前面。

   category 会渲染成紧贴项目名上方的类别标签（Tag）。请让所有项目处在
   同一抽象层级——它回答的是"这是什么类型的作品"，不要写成具体技术
   （如「Spring Boot」）或平台名（如「微信小程序」，应归为「移动应用」），
   否则几个标签放在一起会显得不整齐。

   需要给一个项目挂多个标签时，额外加一个 tags 数组即可（可选）：
     category: "Web 应用",
     tags: ["Web 应用", "校园平台"],
   ------------------------------------------------------------------------ */
const PROJECTS = [
  {
    id: "keyutong",
    title: "课语通",
    subtitle: "基于大语言模型的课程问答助手",
    desc:
      "用户上传课程资料后，系统会建立知识索引，并依据课程内容回答问题，同时给出引用出处和知识点小测，帮助学生快速复习、整理课程重点。",
    stack: ["Python", "FastAPI", "RAG", "向量检索", "大语言模型 API", "Streamlit"],
    date: "2026.07",
    datetime: "2026-07",
    category: "AI 应用",
    layout: "wide",
    image: "assets/images/projects/keyutong.svg",
    imageAlt: "课语通：课程文档经向量检索后进入大语言模型，生成带引用出处的回答"
  },
  {
    id: "chengshi",
    title: "城市脉搏",
    subtitle: "城市实时交通与天气数据可视化大屏",
    desc:
      "用于集中展示交通、天气和城市运行信息的数据大屏。通过多数据源轮询聚合数据，结合 SVG 图表、Canvas 粒子地图与响应式布局，实现大屏上的可视化展示。",
    stack: ["TypeScript", "HTML/CSS", "Canvas", "SVG", "ECharts"],
    date: "2026.03",
    datetime: "2026-03",
    category: "数据可视化",
    layout: "image-left",
    image: "assets/images/projects/chengshi.svg",
    imageAlt: "城市脉搏：城市天际线、数据网格与实时波形叠加的大屏画面"
  },
  {
    id: "shiguang",
    title: "拾光集市",
    subtitle: "面向校园场景的二手交易平台",
    desc:
      "提供商品发布、关键词检索、站内私信和信用评分等功能。从需求梳理、界面设计到主要接口开发均由我独立完成，上线测试后累计注册用户超过 300 人。",
    stack: ["Java", "Spring Boot", "MySQL", "TypeScript", "Vue"],
    date: "2025.09",
    datetime: "2025-09",
    category: "Web 应用",
    layout: "image-right",
    metric: { value: "300+", label: "累计注册用户" },
    image: "assets/images/projects/shiguang.svg",
    imageAlt: "拾光集市：错落排列的商品卡片与关键词检索结果示意"
  },
  {
    id: "qingjizhang",
    title: "轻记账",
    subtitle: "面向日常生活场景的极简记账小程序",
    desc:
      "重点解决快速记录和查看个人收支的问题。支持语音快捷记账、月度收支统计与预算提醒，并使用微信云开发完成数据存储和后端能力。",
    stack: ["TypeScript", "微信小程序", "微信云开发", "ECharts"],
    date: "2025.04",
    datetime: "2025-04",
    category: "移动应用",
    layout: "text",
    image: "assets/images/projects/qingjizhang.svg",
    imageAlt: "轻记账：手机竖屏中的月度收支柱状图与预算进度"
  }
];
