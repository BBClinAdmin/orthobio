# Delegation gate — Orthobiologics Consulting

<!-- Read by /delegate before planning any delegated work in this repo.
     Drafted 2026-11-06 on Rob's yes; revised the same day against a reviewer's
     findings. Claims here were checked against the repo and the project's
     CONTEXT.md. Several rules under "Every brief carries" rest on the project
     instructions and the Claude Code memory files rather than on CONTEXT.md:
     the Co-Authored-By trailer, the Formspree Spam tab, and the DNS diagnosis
     commands. They are sound but single-sourced. -->

## Standards to read
- `CLAUDE.md` at this repo's root.
- `admin@ My Drive/Claude_on_BBAdmin/Orthobiologics Consulting/_Project/CONTEXT.md`: the project's facts, Settled list, to-do list and push policy.
- `admin@ My Drive/Claude_on_BBAdmin/Orthobiologics Consulting/_Project/project-instructions.md`.

## Design system
- 13 hand-maintained HTML pages at the repo root. No build step, no framework. There are no clean-URL rewrites in the repo: every page URL ends in `.html` except the home page, which `sitemap.xml` lists as the bare origin.
- Styles live in `site.css`, `app.css` and `fonts.css`, which is exactly what all 13 pages load. `colors_and_type.css` is tracked but linked by nothing and duplicates app.css's token block: do not edit it expecting a visible change (raised in the 2026-11-06 audit). Use the tokens already defined; adding one is a change to call out.
- **Open ruling — do not resolve it in a brief.** The site sets `--font-mono: "DM Mono", …` and applies it in 57 rules (42 in `site.css`, 15 in `app.css`; a 58th occurrence at `app.css:99` is the token definition) for eyebrows, stat units, labels, roles, footer headings and the cost-ledger values. Working rule F4 forbids monospace on screen without an exception in the project's Settled list, and no such row exists. Rob has been asked to rule (audit-2026-11-06-1055-orthobio.md, in the System Reviews folder on robertpickels@ Drive). Until he does: do not add new `var(--font-mono)` uses, and do not strip existing ones. There are no `code` or `pre` elements anywhere in the site, so F4's override clause has nothing to act on here.
- The booking link lives in **four** places, and changing it means changing all four: the `data-book` anchors in the 13 pages (each carries a real `href`), the `BOOKING_URL` constant at `site.js:3`, a second and separate `BOOKING_URL` constant at `assessment.js:7`, and an `<iframe src>` at `contact.html:250` that carries no `data-book`. The current URL is `https://calendar.app.google/zTkZoBrUXyc5ng3PA`; two older links are recorded in Settled as wrong.
- `sitemap.xml` is hand-maintained: a new page needs an entry.
- GA4 `G-ZSP3HF4MWT` is on all 13 pages, twice each. A new page needs it too.
- Never write "Orthobio" alone: `orthobio.com` belongs to someone else. "Orthobio Partners", `getorthobio.com` and `orthobiopartners.com` are retired brands (Settled 2026-10-27). The live brand is Boulder Biologics Partners.
- Copy must not claim staff that do not exist: "Partners" is accepted for a sole owner, but the team must read accurately (Settled 2026-10-27).
- The contact address on the site is `admin@boulderbiologics.com` (Settled 2026-07-09).

## Governing regulations
| Regulation / standard | Source text | Applies when |
|---|---|---|
| None recorded | CONTEXT.md has no regulations table | This site sells consulting to medical practices. Verified: it takes no payment (no checkout or payment-processor code), and `privacy-policy.html` states it does not collect or process PHI. Note before briefing anything that touches these: `index.html` carries a patient-reviews block quoting real Google reviews of the clinic, and `the-treatments.html` and `the-challenge.html` discuss the FDA pathway, including "361" and "same surgical procedure". No regulation is recorded as applying to that copy, and none has been ruled out either. Work that changes a claim in those places is a /delegate step-7 interrupt (stop and ask Rob), not a brief. |

## Checks

### Every change
- `git -C <repo> status --short` shows only the files the task was scoped to.
- Verify locally, with the preview in `.claude/launch.json` (port 4173). **Do not verify against `https://gilded-dango-963fc0.netlify.app` before Rob publishes**: auto-publishing is locked, so that URL serves the last published deploy, not the pushed change. After Rob publishes, it is the right place to look.

### When a page changes
- A new page: it appears in `sitemap.xml` and carries the GA4 snippet.
- The booking link: `grep -rn "calendar.app.google" --include="*.html" --include="*.js" .` and confirm every hit carries the one current URL, across all four surfaces above.
- The Formspree endpoint: update both `contact.html` and `assessment.js`; they share one form.
- A meta tag: the same tag exists on all 13 pages, or the brief names the exceptions and why.

### Writing
- Anything a practice reads goes through the content-writing skill, target "BBClin Business-to-Business Correspondence". Working files and notes use Claude's standard voice.

## Privacy
- The repo holds no PHI and no form submissions: `privacy-policy.html` states the site does not collect or process protected health information. It does carry names in page copy, including the reviewers in the patient-reviews block (first name plus last initial), which are public Google reviews of the clinic.
- It does collect: contact-form and readiness-assessment submissions, which go to Formspree under the admin@boulderbiologics.com account; an email capture that gates the assessment results (`assessment.js`); and GA4 analytics on every page. None of it lands in this repo.

## Never delegate
- Pricing, ROI and outcome claims on any Partners page. Rob rules on these item by item (working rule C1).
- `privacy-policy.html`, `terms-of-service.html`, `cookie-policy.html`. The live pages are the authoritative legal text, and the entity named in them is an open question on Rob's to-do.
- The patient-reviews block and the FDA-pathway copy (see Governing regulations).
- The commented-out testimonials block in `index.html`. It carries an explicit warning against publishing fabricated or unapproved testimonials, and Rob has not supplied references.
- Anything that pushes, publishes, or touches DNS.

## Every brief carries
- A push is not a release. Netlify builds from `main`, but auto-publishing is locked, so the deploy waits until Rob clicks Publish deploy in the site `gilded-dango-963fc0`. After pushing, say so and stop; do not poll the live site.
- Do not load `boulderbiologics.net` to check your work. It is also Rob's internal Active Directory domain, so from his network it resolves to 10.x addresses and times out. (Recorded in the project instructions and the `partners-site-hosting` memory; CONTEXT.md points at a Settled row for this that does not exist — raised in the 2026-11-06 audit.) Use the local preview, or the netlify.app URL once Rob has published.
- The repo `BBClinAdmin/orthobio` is the sole source for this site. There is no Claude Design source and no export step: edit the repo files directly (Settled 2026-10-27). The sibling clone `Sites/boulder-biologics` is the clinic's different site — check which repo you are in before writing.
- Keep this repo public. Netlify's free plan allows only one Git contributor on a private repo, and flipping it private broke the build once. The pricing and ROI pages are therefore readable in source, which Rob has accepted. If it is ever made private, omit the `Co-Authored-By` trailer from commits to it.
- The contact form and the readiness assessment share one Formspree endpoint, and the free quota is 50 submissions a month across every form on the admin@ Formspree account, the clinic's included, with spam counting toward it. An empty inbox is not a broken form: check the Spam tab first.
- DNS for this domain is static on purpose. Never "restore" the dynamic NETLIFY records, and never diagnose with `curl --resolve` or `dig @<ns>`: both bypass the failure mode this zone has had.

## Environment
- Local preview: `.claude/launch.json` runs `python3 -m http.server 4173`. It serves the directory the launcher starts in, so start it at the repo root.
- `.claude/settings.local.json` is gitignored and holds this Mac's absolute path to the Drive project folder. A fresh clone or a worktree will not have it, and no README records it.
- This project sends and receives exchanges through the BB Marketing and Web project's exchanges folder on admin@ Drive, whose index is generated by a script and never hand-edited. This project keeps no index of its own (Settled 2026-10-27).

## Commits
- Commits follow the project's push policy; Rob has set no separate rule for committing.
- **The push is the gate.** CONTEXT.md's policy is that Claude pushes verified work to `main`, with no tagging, but this repo carries a tracked `.claude/review-gate` marker, so `git-guard.sh` stops a push to main and prints a table. Show Rob that table in chat and push only after his yes (working rule C3).
- The orchestrator pushes, never a subagent.
- Rob clicks Publish deploy in Netlify. Claude never publishes. Which Netlify account owns `gilded-dango-963fc0` is still unknown and is on Rob's to-do.
