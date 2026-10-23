#!/usr/bin/env node
/* Smoke test: runs the game's scripts against a stand-in page (no real browser,
   no Google Maps) and reports errors plus the world data the game ended up with.
   Usage: node tools/smoke.js [index.html]
   It cannot judge how anything looks. It only catches scripts that crash on load. */
const fs = require("fs");
const vm = require("vm");
const file = process.argv[2] || "index.html";
const html = fs.readFileSync(file, "utf8");
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);

const cache = new Map();
function stub(name) {
  const store = {};
  const fn = function () { return stub(name + "()"); };
  return new Proxy(fn, {
    get(t, p) {
      if (p === Symbol.toPrimitive) return () => "";
      if (p === "then") return undefined;
      if (p === Symbol.iterator) return function* () {};
      if (p in store) return store[p];
      if (p === "length") return 0;
      if (p === "classList") return (store.classList = { add() {}, remove() {}, toggle() {}, contains() { return false; } });
      if (p === "style" || p === "dataset") return (store[p] = { setProperty() {}, removeProperty() {} });
      if (p === "children" || p === "childNodes") return [];
      if (p === "getBoundingClientRect") return () => ({ width: 760, height: 400, left: 0, top: 0, right: 760, bottom: 400 });
      return stub(name + "." + String(p));
    },
    set(t, p, v) { store[p] = v; return true; },
    apply() { return stub(name + "()"); },
    has() { return true; },
  });
}
const el = sel => { if (!cache.has(sel)) cache.set(sel, stub(sel)); return cache.get(sel); };

const store = new Map();
const logs = [];
const sandbox = {
  console: { log() {}, info() {}, warn: (...a) => logs.push(["warn", a.map(String).join(" ")]), error: (...a) => logs.push(["error", a.map(String).join(" ")]) },
  document: {
    querySelector: el, getElementById: el, createElement: () => stub("createElement"),
    querySelectorAll: () => [], addEventListener() {}, removeEventListener() {},
    body: stub("body"), head: stub("head"), documentElement: stub("html"), fonts: { ready: Promise.resolve() },
    createElementNS: () => stub("createElementNS"), createTextNode: () => stub("text"),
  },
  localStorage: { getItem: k => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)), removeItem: k => store.delete(k) },
  navigator: { userAgent: "node", language: "en", languages: ["en"], maxTouchPoints: 0 },
  location: { href: "http://localhost/", search: "", hash: "", hostname: "localhost" },
  performance: { now: () => Date.now() },
  setTimeout, clearTimeout, setInterval, clearInterval,
  requestAnimationFrame: f => setTimeout(f, 16), cancelAnimationFrame: clearTimeout,
  matchMedia: () => ({ matches: false, addEventListener() {}, addListener() {} }),
  getComputedStyle: () => ({ getPropertyValue: () => "" }),
  addEventListener() {}, removeEventListener() {}, dispatchEvent() {},
  innerWidth: 400, innerHeight: 800, devicePixelRatio: 1,
  Audio: function () { return stub("Audio"); }, Image: function () { return stub("Image"); },
  AudioContext: function () { return stub("AudioContext"); }, webkitAudioContext: function () { return stub("AudioContext"); },
  speechSynthesis: { speak() {}, cancel() {}, getVoices: () => [], addEventListener() {}, onvoiceschanged: null },
  SpeechSynthesisUtterance: function () {},
  fetch: () => Promise.reject(new Error("no network in smoke test")),
  URL: { createObjectURL: () => "blob:x", revokeObjectURL() {} }, Blob: function () {}, FileReader: function () {},
  URLSearchParams, TextEncoder, TextDecoder, Math, JSON, Date, Promise, Map, Set,
  structuredClone: x => JSON.parse(JSON.stringify(x)),
  Notification: undefined, ResizeObserver: function () { return { observe() {}, disconnect() {} }; },
  IntersectionObserver: function () { return { observe() {}, disconnect() {} }; },
  MutationObserver: function () { return { observe() {}, disconnect() {} }; },
};
sandbox.window = sandbox; sandbox.self = sandbox; sandbox.globalThis = sandbox; sandbox.parent = sandbox;
vm.createContext(sandbox);

let crashed = null;
scripts.forEach((code, i) => {
  if (crashed) return;
  try { vm.runInContext(code, sandbox, { filename: `script${i}.js` }); }
  catch (e) { crashed = `script ${i} (${code.length} chars): ${e && e.stack ? e.stack.split("\n").slice(0, 3).join(" | ") : e}`; }
});

setTimeout(() => {
  console.log("file:", file);
  console.log("scripts run:", scripts.length, crashed ? "\nCRASH: " + crashed : "(no crash)");
  const bad = logs.filter(l => l[1].includes("[SG]") || l[0] === "error");
  console.log("layer/console messages:", bad.length ? "\n  " + bad.map(l => l.join(": ")).join("\n  ") : "none");
  const G = sandbox.__G;
  if (!G) { console.log("window.__G missing: game closure did not finish"); process.exit(1); }
  const P = G.PLACES;
  console.log("places:", Object.entries(P).map(([k, p]) => `${k}=${p.en} @${p.door.lat},${p.door.lng} pano=${JSON.stringify(p.pano)}`).join("\n        "));
  process.exit(crashed ? 1 : 0);
}, 400);
