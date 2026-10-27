/*
 * Home prototype behaviour: mobile menu, compact header, current-section marker,
 * one-time gallery-preview reveal. Everything works without this file; it only
 * adds comfort.
 */
(function () {
  "use strict";

  var root = document.documentElement;

  // --- Mobile menu ---------------------------------------------------------
  var menu = document.querySelector("[data-menu]");
  var openButton = document.querySelector("[data-menu-open]");
  var closeButton = document.querySelector("[data-menu-close]");

  function setMenu(open) {
    if (!menu || !openButton) return;
    menu.hidden = !open;
    openButton.setAttribute("aria-expanded", String(open));
    root.classList.toggle("menu-open", open);
    if (open) {
      var first = menu.querySelector("a, button");
      if (first) first.focus();
    } else {
      openButton.focus();
    }
  }

  if (menu && openButton && closeButton) {
    openButton.addEventListener("click", function () { setMenu(true); });
    closeButton.addEventListener("click", function () { setMenu(false); });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) { menu.hidden = true; openButton.setAttribute("aria-expanded", "false"); root.classList.remove("menu-open"); }
    });
    menu.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { setMenu(false); return; }
      if (e.key !== "Tab") return;
      // Keep focus inside the open menu.
      var items = menu.querySelectorAll("a, button");
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
      else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
    });
    window.matchMedia("(min-width: 1024px)").addEventListener("change", function (mq) {
      if (mq.matches && !menu.hidden) setMenu(false);
    });
  }

  // --- Compact header after scrolling (desktop) -----------------------------
  var header = document.querySelector("[data-header]");
  if (header) {
    var ticking = false;
    var update = function () {
      header.classList.toggle("is-compact", window.scrollY > 40);
      ticking = false;
    };
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  // --- Current section marker in the navigation ------------------------------
  var links = Array.prototype.slice.call(document.querySelectorAll(".site-nav a[href^='#']"));
  if (links.length && "IntersectionObserver" in window) {
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var visible = {};
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting; });
      var current = null;
      Object.keys(byId).forEach(function (id) { if (!current && visible[id]) current = id; });
      links.forEach(function (a) {
        if (a === byId[current]) a.setAttribute("aria-current", "location");
        else a.removeAttribute("aria-current");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(byId).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  }

  // --- Gallery preview: one staggered fade-up, played once (DQ-10) -----------
  var teaser = document.querySelector("[data-teaser]");
  if (teaser) {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      teaser.classList.add("is-visible");
    } else {
      teaser.classList.add("will-reveal"); // hidden only once this script is running
      var once = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { teaser.classList.add("is-visible"); once.disconnect(); }
      }, { rootMargin: "0px 0px -15% 0px" });
      once.observe(teaser);
    }
  }
})();
