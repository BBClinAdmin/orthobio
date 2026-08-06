/* Boulder Biologics Partners — shared multi-page behavior (no framework). */
(function () {
  var BOOKING_URL = "https://calendar.app.google/zTkZoBrUXyc5ng3PA";

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

  // ---- Animate payback bars (height) when scrolled into view ----
  function wirePaybackBars() {
    var bars = document.querySelectorAll(".pbar[data-h]");
    if (!bars.length) return;
    function px(b) {
      var col = b.parentNode;
      var pct = parseFloat(b.getAttribute("data-h")) || 0;
      return Math.round((col.clientHeight * pct) / 100) + "px";
    }
    function grow(b) { b.style.height = px(b); }
    // keep bar pixel heights correct on resize (track height changes at breakpoints)
    window.addEventListener("resize", function () {
      bars.forEach(function (b) { if (b.dataset.grown) b.style.height = px(b); });
    });
    if (!("IntersectionObserver" in window)) {
      bars.forEach(function (b) { grow(b); b.dataset.grown = "1"; });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          grow(en.target);
          en.target.dataset.grown = "1";
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.35 });
    bars.forEach(function (b) { io.observe(b); });
  }

  // ---- Contact form: AJAX submit to Formspree, then reveal the success state ----
  function wireContactForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;
    var card = form.closest(".cform");
    var btn = form.querySelector("button[type=submit]");
    var btnHTML = btn ? btn.innerHTML : "";

    // Lazily-created inline error line, dropped into the form's tools row.
    var err = document.createElement("p");
    err.className = "fprivacy";
    err.style.color = "var(--accent-strong)";
    err.style.display = "none";
    err.setAttribute("role", "alert");
    var tools = form.querySelector(".ftools");
    if (tools) tools.appendChild(err);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      err.style.display = "none";
      // The form carries `novalidate`, so trigger constraint checks ourselves.
      if (typeof form.reportValidity === "function" && !form.reportValidity()) return;
      if (btn) { btn.disabled = true; btn.innerHTML = "Sending…"; }

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      }).then(function (res) {
        if (res.ok) {
          if (card) card.classList.add("is-done");
          drawIcons(); // render the check icon in the revealed success panel
          if (card && card.scrollIntoView) card.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
        return res.json().then(function (data) {
          var msg = data && data.errors && data.errors.length
            ? data.errors.map(function (x) { return x.message; }).join(", ")
            : "Something went wrong sending your message.";
          throw new Error(msg);
        });
      }).catch(function (e2) {
        err.textContent = (e2 && e2.message ? e2.message : "Something went wrong.") +
          " Please try again, or email admin@boulderbiologics.com.";
        err.style.display = "";
        if (btn) { btn.disabled = false; btn.innerHTML = btnHTML; }
      });
    });
  }

  function init() {
    wireBooking();
    wireMobileNav();
    wireRevenueBars();
    wirePaybackBars();
    wireContactForm();
  }
  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
