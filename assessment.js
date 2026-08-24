/* Boulder Biologics Partners — Practice Readiness Assessment (page-scoped).
   Behavior mirrors the handoff spec + reference prototype; markup is rendered
   with the site's own components. Submits to the shared Formspree form; the
   distinct _subject keeps assessment leads triageable in the inbox. */
(function () {
  var FORMSPREE_ENDPOINT = "https://formspree.io/f/xljryrkq";
  var BOOKING_URL = "https://calendar.app.google/zTkZoBrUXyc5ng3PA";

  // --- Questions -------------------------------------------------------------
  var profiling = [
    { key: "specialty", text: "What best describes your practice?", options: [
      "Orthopedics", "Sports medicine", "Physiatry / PM&R", "Pain management", "Regenerative / longevity", "Primary care", "Other"] },
    { key: "role", text: "Your role", options: [
      "Physician owner / partner", "Physician (non-owner)", "Practice manager / administrator", "Other"] },
    { key: "physician_count", text: "How many physicians are in the practice?", options: ["1", "2 to 4", "5 to 9", "10 or more"] },
    { key: "current_offerings", text: "Do you currently offer any autologous biologics?", options: [
      "None", "PRP only", "PRP plus one or more others", "A full range already"] }
  ];

  var scored = [
    { key: "q1", text: "How often do your patients ask about regenerative options like PRP or “stem cell” treatments?", options: [
      { t: "Frequently, and we currently refer them out or turn them away", p: 3 },
      { t: "Occasionally", p: 2 }, { t: "Rarely", p: 1 }, { t: "Never, or not sure", p: 0 }] },
    { key: "q2", text: "How would you describe local competition for cash-pay biologics near you?", options: [
      { t: "Little to none, it is an open field", p: 3 },
      { t: "Some competitors, but inconsistent quality", p: 2 },
      { t: "A few well-established providers", p: 1 }, { t: "Saturated market", p: 0 }] },
    { key: "q3", text: "What is your experience with image-guided injections (ultrasound or fluoroscopy)?", options: [
      { t: "We perform them routinely", p: 3 }, { t: "Some experience", p: 2 },
      { t: "Minimal experience", p: 1 }, { t: "None", p: 0 }] },
    { key: "q4", text: "How ready is your physician team to learn newer techniques like bone marrow aspiration?", options: [
      { t: "We already perform BMAC or similar", p: 3 }, { t: "Confident and ready to learn", p: 2 },
      { t: "Interested but unsure", p: 1 }, { t: "Not a fit right now", p: 0 }] },
    { key: "q5", text: "Do you have a procedure room that could be adapted for sterile point-of-care processing?", options: [
      { t: "Yes, a dedicated procedure or clean space is available", p: 3 },
      { t: "Possibly, with some modification", p: 2 }, { t: "Space is tight", p: 1 }, { t: "No suitable space", p: 0 }] },
    { key: "q6", text: "Do you have dedicated laboratory space where biologic samples could be processed, separate from the procedure room?", options: [
      { t: "Yes, a dedicated lab area is available", p: 3 },
      { t: "A shared or partial space that could be adapted", p: 2 },
      { t: "No dedicated space, but room to create one", p: 1 }, { t: "No, and no clear place for it", p: 0 }] },
    { key: "q7", text: "What processing equipment do you currently have?", options: [
      { t: "A biologics-capable centrifuge and related equipment", p: 3 },
      { t: "A general-purpose centrifuge only", p: 2 },
      { t: "None yet, but budget is available", p: 1 }, { t: "None, and no budget identified", p: 0 }] },
    { key: "q8", text: "What laboratory equipment do you have for handling biologic samples (for example a biosafety cabinet or laminar flow hood)?", options: [
      { t: "A biosafety cabinet or laminar flow hood plus supporting lab instrumentation", p: 3 },
      { t: "A biosafety cabinet or laminar flow hood only", p: 2 },
      { t: "Basic lab tools, but no cabinet or hood", p: 1 }, { t: "None", p: 0 }] },
    { key: "q9", text: "What clinical documentation do you have in place today?", options: [
      { t: "A robust SOP and quality system", p: 3 }, { t: "Some documented procedures and consents", p: 2 },
      { t: "Minimal documentation", p: 1 }, { t: "None", p: 0 }] },
    { key: "q10", text: "How is your practice set up to collect payment for cash-pay services?", options: [
      { t: "We already run cash-pay service lines at the point of care", p: 3 },
      { t: "Some cash-pay alongside insurance", p: 2 }, { t: "Mostly insurance-based", p: 1 }, { t: "Insurance only", p: 0 }] },
    { key: "q11", text: "How soon are you looking to add this service line?", options: [
      { t: "Within the next 3 months", p: 3 }, { t: "In 3 to 6 months", p: 2 },
      { t: "In 6 to 12 months", p: 1 }, { t: "Just exploring for now", p: 0 }] },
    { key: "q12", text: "Where does physician or owner buy-in stand?", options: [
      { t: "Full buy-in, the decision is made", p: 3 }, { t: "Leaning yes", p: 2 },
      { t: "Still exploring", p: 1 }, { t: "Only I am interested so far", p: 0 }] }
  ];

  var results = {
    launch_ready: { label: "Launch-ready", body: "You already have most of the foundation in place. The remaining gaps are usually technique refinement and the specifics of equipment, protocols, and your procedure space. A practice in your position can often go from decision to first live cases quickly with a focused implementation. The next step is a short conversation about what your specific build would involve." },
    building: { label: "Building", body: "You have real momentum and a clear set of gaps to close. This is the most common and most workable place to start from. With the right equipment, protocol library, space setup, and technique training, an autologous biologics line is well within reach. A discovery call is the fastest way to see exactly what your path looks like." },
    foundation: { label: "Foundation", body: "You are earlier in the journey, which is completely fine. The value of a conversation now is understanding what a full build actually involves, the equipment, the space, the protocols, and the training, so you can plan it properly rather than piece it together. We will be honest about what your practice realistically needs before you commit to anything." }
  };

  // Each category = 2 scored questions, 0–6 points. Sums to the same 36 total.
  // `link` points at the on-site page/section that speaks to closing that gap.
  var ROADMAP = "how-to-add-autologous-biologics.html";
  var categories = [
    { key: "market", label: "Market Opportunity", qs: ["q1", "q2"], link: "the-challenge.html" },
    { key: "technique", label: "Clinical Technique", qs: ["q3", "q4"], link: ROADMAP + "#training" },
    { key: "facilities", label: "Facilities & Space", qs: ["q5", "q6"], link: ROADMAP + "#facility" },
    { key: "equipment", label: "Equipment", qs: ["q7", "q8"], link: ROADMAP + "#equipment" },
    { key: "operations", label: "Operations & Quality", qs: ["q9", "q10"], link: ROADMAP + "#sops" },
    { key: "commitment", label: "Commitment & Timing", qs: ["q11", "q12"], link: ROADMAP + "#timeline" }
  ];

  // --- State -----------------------------------------------------------------
  var app = document.getElementById("assessment-app");
  if (!app) return;

  var allQuestions = profiling.map(function (q) { return assign(q, { scored: false }); })
    .concat(scored.map(function (q) { return assign(q, { scored: true }); }));
  var TOTAL = allQuestions.length;
  var state = { step: -1, answers: {} }; // -1 = intro; === TOTAL = email gate

  function assign(a, b) { var o = {}, k; for (k in a) o[k] = a[k]; for (k in b) o[k] = b[k]; return o; }
  function icons() { if (window.lucide && window.lucide.createIcons) window.lucide.createIcons({ attrs: { "stroke-width": 1.75 } }); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function tierFor(score) { return score >= 26 ? "launch_ready" : score >= 15 ? "building" : "foundation"; }
  function catStatus(s) { return s >= 5 ? { key: "strong", label: "We'll refine" } : s >= 3 ? { key: "building", label: "We'll strengthen" } : { key: "early", label: "We'll build" }; }

  function scoreCategories() {
    return categories.map(function (c) {
      var s = c.qs.reduce(function (sum, qk) { return sum + ((state.answers[qk] && state.answers[qk].points) || 0); }, 0);
      var st = catStatus(s);
      return { key: c.key, label: c.label, link: c.link, score: s, status: st.key, statusLabel: st.label };
    });
  }

  // Weakest areas first: flag Early (0–2) categories; if none, the lowest Building (3–4).
  function focusFrom(cats) {
    var asc = cats.slice().sort(function (a, b) { return a.score - b.score; });
    var early = asc.filter(function (c) { return c.score <= 2; });
    if (early.length) return { lead: "Your biggest gaps right now", items: early.slice(0, 3) };
    var building = asc.filter(function (c) { return c.score <= 4; });
    if (building.length) return { lead: "Worth strengthening next", items: building.slice(0, 2) };
    return { lead: "You're strong across the board", items: [] };
  }

  function joinList(arr) {
    if (arr.length <= 1) return arr[0] || "";
    if (arr.length === 2) return arr[0] + " and " + arr[1];
    return arr.slice(0, -1).join(", ") + ", and " + arr[arr.length - 1];
  }

  // --- Render ----------------------------------------------------------------
  function render() {
    if (state.step === -1) return renderIntro();
    if (state.step < TOTAL) return renderQuestion(state.step);
    return renderEmailGate();
  }

  function renderIntro() {
    app.innerHTML =
      '<div class="as-intro">' +
        '<span class="eyebrow">About 3 minutes · 16 quick questions</span>' +
        '<h2>Is your practice ready to add autologous biologics?</h2>' +
        '<p>An honest readiness check across patient demand, technique, space, equipment, and operations. ' +
        'At the end you will see where your practice stands — and the specific gaps worth closing first.</p>' +
        '<div class="as-row as-row-start"><button class="btn btn-accent" id="as-start">Start the assessment <span class="ar">→</span></button></div>' +
      '</div>';
    document.getElementById("as-start").onclick = function () { state.step = 0; render(); };
    icons();
  }

  function renderQuestion(i) {
    var q = allQuestions[i];
    var pct = Math.round((i / TOTAL) * 100);
    var opts = q.options.map(function (o, idx) {
      var label = q.scored ? o.t : o;
      var chosen = state.answers[q.key] && state.answers[q.key].label === label;
      return '<label class="as-opt' + (chosen ? " sel" : "") + '">' +
        '<input type="radio" name="' + q.key + '" value="' + idx + '"' + (chosen ? " checked" : "") + ">" +
        '<span class="as-opt-t">' + esc(label) + "</span></label>";
    }).join("");
    app.innerHTML =
      '<div class="as-prog"><span style="width:' + pct + '%"></span></div>' +
      '<div class="eyebrow">Question ' + (i + 1) + " of " + TOTAL + "</div>" +
      '<div class="as-q">' + esc(q.text) + "</div>" +
      '<div class="as-opts" id="as-opts">' + opts + "</div>" +
      '<div class="as-row">' +
        '<button class="btn btn-outline" id="as-back">Back</button>' +
        '<button class="btn btn-accent" id="as-next" disabled>Next <span class="ar">→</span></button>' +
      "</div>";
    var nextBtn = document.getElementById("as-next");
    if (state.answers[q.key]) nextBtn.disabled = false;
    Array.prototype.forEach.call(app.querySelectorAll("#as-opts input"), function (inp) {
      inp.onchange = function () {
        var idx = +inp.value;
        var label = q.scored ? q.options[idx].t : q.options[idx];
        var points = q.scored ? q.options[idx].p : null;
        state.answers[q.key] = { label: label, points: points };
        Array.prototype.forEach.call(app.querySelectorAll(".as-opt"), function (l) { l.classList.remove("sel"); });
        inp.closest(".as-opt").classList.add("sel");
        nextBtn.disabled = false;
      };
    });
    document.getElementById("as-back").onclick = function () { state.step--; render(); };
    nextBtn.onclick = function () { state.step++; render(); };
    icons();
  }

  function renderEmailGate() {
    app.innerHTML =
      '<div class="as-prog"><span style="width:100%"></span></div>' +
      '<div class="eyebrow">Last step</div>' +
      '<div class="as-q">Where should we send your results?</div>' +
      '<p class="as-sub">Enter your details to see your readiness result. We will use your email only to send your ' +
        'results and follow up. No spam. See our <a href="privacy-policy.html">Privacy Policy</a>.</p>' +
      '<div class="as-fields">' +
        field("as-name", "Your name", "text", true, "name") +
        field("as-email", "Work email", "email", true, "email") +
        field("as-practice", "Practice name", "text", true, "organization") +
        field("as-phone", "Phone", "tel", false, "tel") +
      "</div>" +
      '<p class="as-err" id="as-err" role="alert" hidden></p>' +
      '<div class="as-row">' +
        '<button class="btn btn-outline" id="as-back">Back</button>' +
        '<button class="btn btn-accent" id="as-submit">See my results <span class="ar">→</span></button>' +
      "</div>";
    document.getElementById("as-back").onclick = function () { state.step--; render(); };
    document.getElementById("as-submit").onclick = submit;
    icons();
  }

  function field(id, label, type, required, ac) {
    return '<div class="as-field">' +
      '<label for="' + id + '">' + label + (required ? ' <span class="req">*</span>' : ' <span class="opt">optional</span>') + "</label>" +
      '<input id="' + id + '" type="' + type + '" autocomplete="' + ac + '"' + (required ? " required" : "") + "></div>";
  }

  function submit() {
    var name = val("as-name"), practice = val("as-practice"), email = val("as-email"), phone = val("as-phone");
    var err = document.getElementById("as-err");
    if (!name || !practice) { return showErr(err, "Please enter your name and practice name."); }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { return showErr(err, "Please enter a valid email so we can send your results."); }
    err.hidden = true;

    var total = 0;
    scored.forEach(function (q) { total += (state.answers[q.key] && state.answers[q.key].points) || 0; });
    var tier = tierFor(total);
    var cats = scoreCategories();
    var focus = focusFrom(cats);

    var ans = function (k) { return (state.answers[k] && state.answers[k].label) || "(no answer)"; };
    // Keys become the field labels in the Formspree email, so use readable text.
    var payload = {
      "Name": name,
      "Work email": email,
      _replyto: email,
      "Practice name": practice,
      "Phone": phone || "(not provided)",
      "Readiness tier": results[tier].label + " — " + total + "/36",
      "Category scores": cats.map(function (c) { return c.label + " " + c.score + "/6 (" + c.statusLabel + ")"; }).join("  ·  "),
      _subject: "New readiness assessment: " + (practice || "(no practice)") + " — " + results[tier].label
    };
    profiling.forEach(function (q, i) { payload["P" + (i + 1) + ". " + q.text] = ans(q.key); });
    scored.forEach(function (q, i) { payload["Q" + (i + 1) + ". " + q.text] = ans(q.key); });

    var btn = document.getElementById("as-submit");
    btn.disabled = true; btn.textContent = "Sending…";

    fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload)
    }).then(function (res) {
      if (res.ok) { showResults(tier, cats, focus); return; }
      return res.json().then(function (data) {
        var m = data && data.errors && data.errors.length
          ? data.errors.map(function (x) { return x.message; }).join(", ")
          : "Something went wrong sending your results.";
        throw new Error(m);
      });
    }).catch(function (e) {
      btn.disabled = false; btn.innerHTML = 'See my results <span class="ar">→</span>';
      showErr(err, (e && e.message ? e.message : "Something went wrong.") +
        " Please try again, or email admin@boulderbiologics.com.");
      icons();
    });
  }

  function showResults(tier, cats, focus) {
    var r = results[tier];
    var meters = cats.map(function (c) {
      return '<div class="as-cat">' +
          '<div class="as-cat-top">' +
            '<span class="as-cat-name">' + esc(c.label) + "</span>" +
            '<span class="as-cat-badge is-' + c.status + '">' + esc(c.statusLabel) + "</span>" +
          "</div>" +
          '<div class="as-meter"><span class="is-' + c.status + '" style="width:' + Math.round(c.score / 6 * 100) + '%"></span></div>' +
        "</div>";
    }).join("");
    var focusHtml;
    if (focus.items.length) {
      var linked = focus.items.map(function (c) { return '<a href="' + c.link + '">' + esc(c.label) + "</a>"; });
      focusHtml = '<div class="as-focus"><i data-lucide="target"></i><div><strong>' + esc(focus.lead) + "</strong>" +
        "Learn how we help close " + joinList(linked) + ".</div></div>";
    } else {
      focusHtml = '<div class="as-focus"><i data-lucide="circle-check"></i><div><strong>' + esc(focus.lead) + "</strong>" +
        'The foundation is largely in place — <a href="how-it-works.html">see how the engagement works</a>.</div></div>';
    }
    app.innerHTML =
      '<div class="as-result">' +
        '<div class="as-badge"><i data-lucide="check"></i>Your readiness: ' + esc(r.label) + "</div>" +
        "<h2>Here is where your practice stands.</h2>" +
        "<p>" + esc(r.body) + "</p>" +
        '<div class="as-cats">' + meters + "</div>" +
        focusHtml +
        '<a class="btn btn-accent" href="' + BOOKING_URL + '" target="_blank" rel="noopener" data-book>' +
          'Book a discovery call <span class="ar">→</span></a>' +
        '<p class="as-followup"><i data-lucide="message-circle"></i>We will also follow up personally to answer any questions.</p>' +
      "</div>";
    if (card()) card().classList.add("is-done");
    icons();
    if (card() && card().scrollIntoView) card().scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function card() { return app.closest(".as-card"); }
  function val(id) { var el = document.getElementById(id); return el ? el.value.trim() : ""; }
  function showErr(el, msg) { el.textContent = msg; el.hidden = false; }

  render();
})();
