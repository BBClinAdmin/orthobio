# Orthobiologics Consulting: Boulder Biologics Partners site

This repo is the whole of the Boulder Biologics Partners site at boulderbiologics.net: 13 hand-maintained HTML pages at the root, no build step, no framework. It is the only source for the site.

## Project standard

Rob's working rules apply here: `robertpickels@ My Drive/Claude/System/working-rules.md`. Open them at the start of every session and give their version in your first reply. If they cannot be read, request access to that folder; if that is refused, stop and tell Rob how to attach it before doing any work (working rule I6).

The project's facts, settled decisions and to-do list live in `admin@ My Drive/Claude_on_BBAdmin/Orthobiologics Consulting/_Project/CONTEXT.md`. Read it before any job. The project instructions sit beside it in the same folder. Neither this file nor those instructions restate the rules; they point at them.

The piece that owns this site is `Website/handoff.md` in that project folder (working rule J4).

## The two things that bite

- **A push is not a release.** Netlify builds from `main`, but auto-publishing is locked, so the deploy waits until Rob clicks Publish deploy in the site `gilded-dango-963fc0`. After pushing, say so and stop; do not poll the live site.
- **Do not load boulderbiologics.net to check your work.** It is also Rob's internal Active Directory domain, so from his network it resolves to 10.x addresses and times out. Use `https://gilded-dango-963fc0.netlify.app`.
