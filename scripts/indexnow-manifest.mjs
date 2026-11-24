// Writes indexnow-manifest.json: one sha256 fingerprint per URL in sitemap.xml.
// Run from the repo root (the Netlify build does). Built-ins only.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";

const ORIGIN = "https://boulderbiologics.net";
if (!existsSync("sitemap.xml")) {
  // Never block a deploy over IndexNow: with no manifest the function does nothing.
  console.log("WARNING: sitemap.xml not found; indexnow-manifest.json not written");
  process.exit(0);
}
const sitemap = readFileSync("sitemap.xml", "utf8");
const urls = [...sitemap.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);

const pages = {};
for (const url of urls) {
  let slug = url.startsWith(ORIGIN) ? url.slice(ORIGIN.length) : null;
  if (slug === null) {
    console.log(`WARNING: ${url} is not on ${ORIGIN}; skipped`);
    continue;
  }
  // This site: pages end in .html, home is the bare origin, a trailing slash is a folder index.
  slug = slug.replace(/^\/+/, "");
  const file = slug === "" ? "index.html" : slug.endsWith(".html") ? slug : slug.endsWith("/") ? `${slug}index.html` : `${slug}.html`;
  if (!existsSync(file)) {
    console.log(`WARNING: no file ${file} for ${url}; skipped`);
    continue;
  }
  pages[url] = createHash("sha256").update(readFileSync(file)).digest("hex");
}

writeFileSync(
  "indexnow-manifest.json",
  JSON.stringify({ generated: new Date().toISOString(), pages }, null, 2) + "\n"
);
console.log(`indexnow-manifest.json: ${Object.keys(pages).length} of ${urls.length} sitemap URLs`);
