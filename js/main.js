/* ==========================================================================
   main.js — 页面交互
   包含：浅色/深色主题切换、移动端导航、导航滚动状态与当前位置高亮、
   滚动渐显、回到顶部、页脚年份
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- 浅色 / 深色主题 -------------------------------------------- */

  var THEME_KEY = "portfolio-theme";
  var THEME_META_COLOR = { light: "#faf9f6", dark: "#191816" };

  var root = document.documentElement;
  var themeToggle = document.getElementById("theme-toggle");
  var themeMeta = document.querySelector('meta[name="theme-color"]');

  /* 把主题写到 <html data-theme> 上，CSS 变量完成全部换色 */
  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (themeMeta) {
      themeMeta.setAttribute("content", THEME_META_COLOR[theme]);
    }
    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        theme === "dark" ? "切换到浅色主题" : "切换到深色主题"
      );
    }
  }

  /* 优先取用户上次的选择，其次跟随系统偏好，默认浅色 */
  function initTheme() {
    var stored = null;
    try {
      stored = localStorage.getItem(THEME_KEY);
    } catch (e) {
      /* 隐私模式等场景下 localStorage 不可用，忽略即可 */
    }

    var theme = "light";
    if (stored === "dark" || stored === "light") {
      theme = stored;
    } else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      theme = "dark";
    }
    applyTheme(theme);
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next =
        root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch (e) {
        /* 同上，写入失败不影响本次切换 */
      }
    });
  }

  initTheme();

  var nav = document.getElementById("nav");
  var toggle = document.getElementById("nav-toggle");
  var navLinks = document.getElementById("nav-links");
  var toTop = document.getElementById("to-top");

  var MOBILE_QUERY = "(max-width: 860px)";

  /* ---------- 移动端导航 -------------------------------------------------- */

  function setNavOpen(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
  }

  if (nav && toggle) {
    toggle.addEventListener("click", function () {
      setNavOpen(!nav.classList.contains("is-open"));
    });

    /* 点击导航项后收起抽屉 */
    if (navLinks) {
      navLinks.addEventListener("click", function (e) {
        if (e.target.closest("a")) setNavOpen(false);
      });
    }

    /* Esc 收起 */
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setNavOpen(false);
    });

    /* 视口变大时复位，避免抽屉状态残留 */
    var mq = window.matchMedia(MOBILE_QUERY);
    var onChange = function () {
      if (!mq.matches) setNavOpen(false);
    };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  /* ---------- 导航滚动状态 + 当前位置高亮 --------------------------------- */

  var sections = ["intro", "works", "about", "skills", "contact"]
    .map(function (id) {
      return document.getElementById(id);
    })
    .filter(Boolean);

  var links = navLinks
    ? Array.prototype.slice.call(navLinks.querySelectorAll("a"))
    : [];

  function navHeight() {
    return nav ? nav.offsetHeight : 64;
  }

  function syncNavState() {
    var y = window.scrollY || window.pageYOffset;

    if (nav) nav.classList.toggle("is-scrolled", y > 12);
    if (toTop) toTop.classList.toggle("is-visible", y > 640);

    if (!sections.length) return;

    var line = y + navHeight() + 24;
    var current = sections[0].id;

    for (var i = 0; i < sections.length; i++) {
      if (sections[i].offsetTop <= line) current = sections[i].id;
    }

    /* 滚动到底部时强制高亮最后一项 */
    if (window.innerHeight + y >= document.body.scrollHeight - 4) {
      current = sections[sections.length - 1].id;
    }

    links.forEach(function (a) {
      var target = (a.getAttribute("href") || "").replace("#", "");
      a.classList.toggle("is-active", target === current);
    });
  }

  /* 用 rAF 节流，避免滚动时重复计算 */
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      syncNavState();
      ticking = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  /* ---------- 滚动渐显 ---------------------------------------------------- */

  /* 这些都是「渲染完成后一定存在」的元素，逐个加上 .reveal 再观察。
     只有在浏览器支持 IntersectionObserver 时才加类，避免内容被永久隐藏。 */
  var REVEAL_SELECTOR = [
    ".hero-eyebrow",
    ".hero-name",
    ".hero-role",
    ".hero-desc",
    ".hero-skills",
    ".hero-facts",
    ".sec-head",
    ".work",
    ".about-quote",
    ".about-text p",
    ".about-facts",
    ".timeline li",
    ".skill-group",
    ".contact-grid > *"
  ].join(",");

  function setupReveal() {
    var items = Array.prototype.slice.call(
      document.querySelectorAll(REVEAL_SELECTOR)
    );
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) return;

    items.forEach(function (el) {
      el.classList.add("reveal");
    });

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          /* 同组内做一点错落，避免整块同时出现 */
          var el = entry.target;
          var siblings = el.parentElement
            ? Array.prototype.slice.call(el.parentElement.children)
            : [];
          var order = siblings.indexOf(el);
          el.style.transitionDelay = (order > 0 ? Math.min(order, 5) * 70 : 0) + "ms";
          el.classList.add("is-in");
          io.unobserve(el);
          window.setTimeout(function () {
            el.style.transitionDelay = "";
          }, 1100);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" }
    );

    items.forEach(function (el) {
      io.observe(el);
    });
  }

  /* ---------- 回到顶部 ---------------------------------------------------- */

  if (toTop) {
    toTop.addEventListener("click", function () {
      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
  }

  /* ---------- 页脚年份 ---------------------------------------------------- */

  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- 启动 -------------------------------------------------------- */

  setupReveal();
  syncNavState();
})();
