/* Orthobio Partners — shared multi-page behavior (no framework). */
(function () {
  var BOOKING_URL = "https://calendar.app.google/BLScJ9n2y4whGwgHA";

  // ---- Lucide icons ----
  function drawIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons({ attrs: { "stroke-width": 1.75 } });
    }
  }
  if (document.readyState !== "loading") drawIcons();
  else document.addEventListener("DOMContentLoaded", drawIcons);

  // ---- Booking: every CTA opens the Google Calendar scheduling page ----
  function wireBooking() {
    document.querySelectorAll("[data-book]").forEach(function (el) {
      if (el.tagName === "A") {
        // Let the browser handle anchors natively — most reliable way to get a
        // real new tab. (Overriding with window.open gets blocked inside
        // sandboxed/preview frames, which makes Google Calendar load in-frame
        // and fail with ERR_BLOCKED_BY_RESPONSE.)
        el.setAttribute("href", BOOKING_URL);
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener");
        return;
      }
      // Non-anchor elements (e.g. <button>): fall back to window.open.
      el.style.cursor = "pointer";
      el.addEventListener("click", function () {
        window.open(BOOKING_URL, "_blank", "noopener");
      });
    });
  }

  // ---- Mobile nav ----
  function wireMobileNav() {
    var toggle = document.querySelector(".nav-toggle");
    var menu = document.getElementById("m-nav");
    if (!toggle || !menu) return;
    function close() {
      menu.classList.remove("open");
      document.body.classList.remove("menu-open");
      toggle.setAttribute("aria-expanded", "false");
    }
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      document.body.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", close);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  // ---- Animate revenue bars when scrolled into view ----
  function wireRevenueBars() {
    var bars = document.querySelectorAll(".rev-bar[data-pct]");
    if (!bars.length) return;
    if (!("IntersectionObserver" in window)) {
      bars.forEach(function (b) { b.style.width = b.getAttribute("data-pct") + "%"; });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.style.width = en.target.getAttribute("data-pct") + "%";
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.35 });
    bars.forEach(function (b) { io.observe(b); });
  }

  function init() {
    wireBooking();
    wireMobileNav();
    wireRevenueBars();
  }
  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
