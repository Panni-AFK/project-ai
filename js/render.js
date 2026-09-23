/* ==========================================================================
   render.js — 把 data.js 里的数据渲染成页面结构
   只负责「数据 → DOM」，不处理交互（交互在 main.js）
   ========================================================================== */

(function () {
  "use strict";

  /* 支持的版式；未匹配到时用 DEFAULT_LAYOUT 兜底 */
  var LAYOUTS = ["wide", "image-left", "image-right", "text"];
  var DEFAULT_LAYOUT = "image-left";

  /* ---------- 小工具 ------------------------------------------------------ */

  function $(id) {
    return document.getElementById(id);
  }

  function esc(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[c];
    });
  }

  /* 序号补零：1 → "01"，12 → "12" */
  function padNo(n) {
    return (n < 10 ? "0" : "") + n;
  }

  function resolveLayout(project) {
    return LAYOUTS.indexOf(project.layout) > -1 ? project.layout : DEFAULT_LAYOUT;
  }

  /* 只生成 <li>，外层 <ul class="tag-list"> 由调用方给出 */
  function tagItems(list) {
    if (!list || !list.length) return "";
    return list
      .map(function (t) {
        return '<li class="tag">' + esc(t) + "</li>";
      })
      .join("");
  }

  function factsHtml(facts) {
    return facts
      .map(function (f) {
        return "<div><dt>" + esc(f.key) + "</dt><dd>" + esc(f.value) + "</dd></div>";
      })
      .join("");
  }

  /* 类别标签（Tag）——放在项目名上方。
     默认取 category 一个标签；若数据里另给了 tags 数组则全部渲染。
     两个字段都没有时返回空串，不会留下空的标签容器。 */
  function categoryTagsHtml(project) {
    var list = project.tags && project.tags.length
      ? project.tags
      : (project.category ? [project.category] : []);
    if (!list.length) return "";
    return (
      '<ul class="work-tags">' +
        list
          .map(function (t) {
            return '<li class="work-tag">' + esc(t) + "</li>";
          })
          .join("") +
      "</ul>"
    );
  }

  /* ---------- 首屏 -------------------------------------------------------- */

  function renderHero() {
    var desc = $("hero-desc");
    if (desc) desc.textContent = PROFILE.intro;

    var skills = $("hero-skills");
    if (skills) skills.innerHTML = tagItems(PROFILE.skills);

    var facts = $("hero-facts");
    if (facts) facts.innerHTML = factsHtml(PROFILE.facts);

    var vertical = $("hero-vertical");
    if (vertical && PROFILE.vertical) vertical.textContent = PROFILE.vertical;

    renderPortrait();
  }

  /* 首屏人像：src / alt / 图注全部来自 PROFILE.photo，换照片不用动 HTML */
  function renderPortrait() {
    var photo = PROFILE.photo;
    if (!photo || !photo.src) return;

    var img = $("hero-portrait-img");
    if (img) {
      img.src = photo.src;
      img.alt = photo.alt || PROFILE.name + "的个人照片";
    }

    var cap = $("hero-portrait-cap");
    if (cap) {
      cap.innerHTML =
        "<b>" + esc(photo.caption || PROFILE.name) + "</b>" +
        "<span>" + esc(photo.meta || PROFILE.role) + "</span>";
    }
  }

  /* ---------- 项目作品 ---------------------------------------------------- */

  function projectHtml(project, i) {
    var layout = resolveLayout(project);
    var no = padNo(i + 1);

    var metric = project.metric
      ? '<div class="work-metric"><b>' +
        esc(project.metric.value) +
        "</b><span>" +
        esc(project.metric.label) +
        "</span></div>"
      : "";

    return (
      '<article class="work work--' + layout + '" id="work-' + esc(project.id || no) + '">' +
        '<figure class="work-figure">' +
          '<img src="' + esc(project.image) + '" alt="' +
            esc(project.imageAlt || project.title) +
            '" loading="lazy" decoding="async" />' +
        "</figure>" +
        '<div class="work-body">' +
          '<div class="work-head">' +
            '<p class="work-meta">' +
              '<span class="work-index">' + no + "</span>" +
              '<span class="sep" aria-hidden="true"></span>' +
              '<time datetime="' + esc(project.datetime || "") + '">' +
                esc(project.date) +
              "</time>" +
            "</p>" +
            categoryTagsHtml(project) +
            '<h3 class="work-title">' + esc(project.title) + "</h3>" +
            '<p class="work-sub">' + esc(project.subtitle) + "</p>" +
          "</div>" +
          '<div class="work-text">' +
            '<p class="work-desc">' + esc(project.desc) + "</p>" +
            '<div class="work-stack"><ul class="tag-list">' +
              tagItems(project.stack) +
            "</ul></div>" +
            metric +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }

  function renderProjects() {
    var list = $("works-list");
    if (!list || typeof PROJECTS === "undefined") return;
    list.innerHTML = PROJECTS.map(projectHtml).join("");
  }

  /* ---------- 关于我 ------------------------------------------------------ */

  function renderAbout() {
    var text = $("about-text");
    if (text) {
      text.innerHTML =
        '<blockquote class="about-quote">' + esc(ABOUT.quote) + "</blockquote>" +
        ABOUT.paragraphs
          .map(function (p) {
            return "<p>" + esc(p) + "</p>";
          })
          .join("");
    }

    var facts = $("about-facts");
    if (facts) facts.innerHTML = factsHtml(PROFILE.facts);

    var timeline = $("about-timeline");
    if (timeline) {
      timeline.innerHTML = ABOUT.timeline
        .map(function (t) {
          return (
            "<li>" +
              '<span class="tl-time">' + esc(t.time) + "</span>" +
              '<span class="tl-body"><strong>' + esc(t.title) + "</strong> · " +
              "<span>" + esc(t.note) + "</span></span>" +
            "</li>"
          );
        })
        .join("");
    }
  }

  /* ---------- 技能方向 ---------------------------------------------------- */

  function renderSkills() {
    var box = $("skill-groups");
    if (!box) return;
    box.innerHTML = SKILL_GROUPS.map(function (g) {
      return (
        '<section class="skill-group">' +
          "<h3>" + esc(g.title) + "</h3>" +
          "<ul>" +
            g.items
              .map(function (item) {
                return "<li>" + esc(item) + "</li>";
              })
              .join("") +
          "</ul>" +
        "</section>"
      );
    }).join("");
  }

  /* ---------- 联系方式 ---------------------------------------------------- */

  function contactValueHtml(c) {
    if (!c.href) return "<span>" + esc(c.value) + "</span>";
    var external = c.href.indexOf("http") === 0;
    return (
      '<a href="' + esc(c.href) + '"' +
      (external ? ' target="_blank" rel="noopener"' : "") +
      ">" + esc(c.value) + "</a>"
    );
  }

  function renderContacts() {
    var box = $("contact-list");
    if (!box) return;
    box.innerHTML = CONTACTS.map(function (c) {
      return (
        "<li>" +
          '<span class="cl-key">' + esc(c.key) + "</span>" +
          "<span>" + contactValueHtml(c) + "</span>" +
        "</li>"
      );
    }).join("");
  }

  /* ---------- 执行 -------------------------------------------------------- */

  renderHero();
  renderProjects();
  renderAbout();
  renderSkills();
  renderContacts();
})();
