// Scheduled function: every 15 minutes, compare the LIVE page list with the
// last one stored in Netlify Blobs and tell IndexNow only what changed.
// Scheduled functions run only on the published production deploy.
import { getStore } from "@netlify/blobs";

export const KEY = "d78de1b9f81f0483f670395f51171530";
export const HOST = "boulderbiologics.net";
export const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
export const MANIFEST_URL = `https://${HOST}/indexnow-manifest.json`;
export const INDEXNOW_URL = "https://api.indexnow.org/indexnow";
export const MIN_PAGES = 10;
export const MAX_URLS = 10000; // IndexNow limit per POST; the site has 13 pages, so no batching

export function diffManifests(prev, next) {
  const added = [];
  const changed = [];
  const removed = [];
  for (const [url, hash] of Object.entries(next)) {
    if (!(url in prev)) added.push(url);
    else if (prev[url] !== hash) changed.push(url);
  }
  for (const url of Object.keys(prev)) {
    if (!(url in next)) removed.push(url);
  }
  return { added, changed, removed };
}

export async function run({ fetchImpl, store, log = console.log }) {
  let live;
  try {
    const res = await fetchImpl(`${MANIFEST_URL}?t=${Date.now()}`);
    if (res.status !== 200) {
      log(`indexnow: live manifest returned HTTP ${res.status}; nothing done`);
      return;
    }
    live = await res.json();
  } catch (err) {
    log(`indexnow: could not read live manifest (${err.message}); nothing done`);
    return;
  }
  const pages = live && live.pages;
  if (!pages || typeof pages !== "object" || Object.keys(pages).length < MIN_PAGES) {
    log(`indexnow: live manifest has fewer than ${MIN_PAGES} pages or is malformed; nothing done`);
    return;
  }

  let prev = null;
  try {
    prev = await store.get("last-manifest", { type: "json" });
  } catch (err) {
    log(`indexnow: stored manifest unreadable (${err.message}); recording a new baseline`);
  }
  if (!prev || !prev.pages) {
    await store.setJSON("last-manifest", live);
    log(`indexnow: baseline recorded (${Object.keys(pages).length} pages); nothing submitted`);
    return;
  }

  const { added, changed, removed } = diffManifests(prev.pages, pages);
  const counts = `added ${added.length}, changed ${changed.length}, removed ${removed.length}`;
  if (!added.length && !changed.length && !removed.length) {
    log("indexnow: no changes");
    return;
  }

  const urlList = [...new Set([...added, ...changed, ...removed])].slice(0, MAX_URLS);
  let res;
  try {
    res = await fetchImpl(INDEXNOW_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList }),
      signal: AbortSignal.timeout(20000),
    });
  } catch (err) {
    log(`indexnow: submit FAILED (${counts}); ${err.message}; not stored, will retry`);
    return;
  }
  if (res.status === 200 || res.status === 202) {
    await store.setJSON("last-manifest", live);
    log(`indexnow: submitted ${urlList.length} URLs (${counts}); IndexNow status ${res.status}; stored`);
  } else {
    const text = await res.text().catch(() => "");
    log(`indexnow: submit FAILED (${counts}); IndexNow status ${res.status}: ${text}; not stored, will retry`);
  }
}

export default async () => {
  await run({ fetchImpl: fetch, store: getStore("indexnow") });
};

export const config = { schedule: "*/15 * * * *" };
