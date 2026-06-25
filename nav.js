/* Shared top-right hamburger nav + service-worker registration.
   Included on every page; resolves links relative to its own location (repo root)
   so they work from the root pages and from /bracket/ alike. */
(function () {
  "use strict";
  var src = (document.currentScript && document.currentScript.src) || "";
  var base = src ? new URL(".", src).href : new URL("./", location.href).href;
  function u(p) { return new URL(p, base).href; }

  var items = [
    { label: "Scenario planner",   href: u("index.html") },
    { label: "Bracket & scores",   href: u("bracket/") },
    { label: "Printable schedule", href: u("all-game-times.html") },
    { label: "Majors PDF",         href: u("Memorial_Majors_Game_Times.pdf") },
    { label: "Minors PDF",         href: u("Memorial_Minors_Game_Times.pdf") }
  ];
  function norm(p) { return p.replace(/index\.html$/, "").replace(/\/+$/, "/"); }
  var here = norm(location.pathname);
  function isCur(href) { try { return norm(new URL(href).pathname) === here; } catch (e) { return false; } }

  var style = document.createElement("style");
  style.textContent =
    ".mt-navbtn{position:fixed;top:12px;right:12px;z-index:1001;width:42px;height:42px;border-radius:11px;" +
    "border:1.5px solid #dcd9ce;background:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;" +
    "box-shadow:0 2px 10px -5px rgba(0,0,0,.4);-webkit-tap-highlight-color:transparent;padding:0;}" +
    ".mt-navbtn .bar,.mt-navbtn .bar::before,.mt-navbtn .bar::after{display:block;width:18px;height:2px;border-radius:2px;background:#16221c;}" +
    ".mt-navbtn .bar{position:relative;}" +
    ".mt-navbtn .bar::before,.mt-navbtn .bar::after{content:'';position:absolute;left:0;}" +
    ".mt-navbtn .bar::before{top:-6px;}.mt-navbtn .bar::after{top:6px;}" +
    ".mt-menu{position:fixed;top:60px;right:12px;z-index:1001;background:#fff;border:1px solid #dcd9ce;border-radius:12px;" +
    "box-shadow:0 14px 36px -12px rgba(0,0,0,.4);padding:6px;min-width:216px;display:none;" +
    "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;}" +
    ".mt-menu.open{display:block;}" +
    ".mt-menu a{display:block;padding:11px 12px;border-radius:8px;text-decoration:none;color:#16221c;font-size:14.5px;font-weight:700;}" +
    ".mt-menu a:active{background:#f1efe7;}" +
    ".mt-menu a.cur{color:#1b5e3f;background:#e9f3ee;}" +
    ".mt-scrim{position:fixed;inset:0;z-index:1000;display:none;background:transparent;}" +
    ".mt-scrim.open{display:block;}";
  document.head.appendChild(style);

  var btn = document.createElement("button");
  btn.className = "mt-navbtn";
  btn.setAttribute("aria-label", "Menu");
  btn.innerHTML = "<span class='bar'></span>";

  var scrim = document.createElement("div");
  scrim.className = "mt-scrim";

  var menu = document.createElement("nav");
  menu.className = "mt-menu";
  items.forEach(function (it) {
    var a = document.createElement("a");
    a.href = it.href;
    a.textContent = it.label;
    if (isCur(it.href)) a.className = "cur";
    menu.appendChild(a);
  });

  function toggle(open) {
    var o = open === undefined ? !menu.classList.contains("open") : open;
    menu.classList.toggle("open", o);
    scrim.classList.toggle("open", o);
    btn.setAttribute("aria-expanded", o ? "true" : "false");
  }
  btn.addEventListener("click", function (e) { e.stopPropagation(); toggle(); });
  scrim.addEventListener("click", function () { toggle(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") toggle(false); });

  function mount() {
    document.body.appendChild(scrim);
    document.body.appendChild(btn);
    document.body.appendChild(menu);
  }
  if (document.body) mount();
  else document.addEventListener("DOMContentLoaded", mount);

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register(u("sw.js")).catch(function () {});
  }
})();
