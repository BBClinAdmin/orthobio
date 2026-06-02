/* Orthobio Partners — static site behavior (no framework). */
(function () {
  // Render Lucide line icons.
  function drawIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons({ attrs: { "stroke-width": 1.75 } });
    }
  }
  if (document.readyState !== "loading") drawIcons();
  else document.addEventListener("DOMContentLoaded", drawIcons);

  // Booking modal.
  var overlay = document.getElementById("booking");
  var modal = overlay ? overlay.querySelector(".modal") : null;
  var form = overlay ? overlay.querySelector("form") : null;
  var headTitle = overlay ? overlay.querySelector(".mhead h3") : null;

  function openBooking() {
    if (!overlay) return;
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function resetBooking() {
    if (!modal) return;
    modal.classList.remove("is-done");
    if (headTitle) headTitle.textContent = "Book a discovery call";
    if (form) form.reset();
  }
  function closeBooking() {
    if (!overlay) return;
    overlay.classList.remove("open");
    document.body.style.overflow = "";
    resetBooking();
  }

  document.querySelectorAll("[data-book]").forEach(function (el) {
    el.addEventListener("click", function (e) { e.preventDefault(); openBooking(); });
  });
  document.querySelectorAll("[data-close]").forEach(function (el) {
    el.addEventListener("click", function (e) { e.preventDefault(); closeBooking(); });
  });
  if (overlay) {
    overlay.addEventListener("click", function (e) { if (e.target === overlay) closeBooking(); });
    var xBtn = overlay.querySelector(".x");
    if (xBtn) xBtn.addEventListener("click", closeBooking);
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && overlay && overlay.classList.contains("open")) closeBooking();
  });
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (modal) modal.classList.add("is-done");
      if (headTitle) headTitle.textContent = "Request received";
    });
  }
})();
