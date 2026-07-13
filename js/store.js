// ═══ Louli OS — state, content, persistence, media ═══
"use strict";

const LS_STATE = "louliOS_state_v1";
const LS_CONTENT = "louliOS_content_v1";
const LS_DEV = "louliOS_dev_v1";

let ST = null;   // her data — persisted, hers
let CT = null;   // his authored content — persisted, edited in Admin (dev) or baked (final)
let DEV = { simDate: null }; // dev-only time travel

// transient UI state (never persisted)
const U = {
  booted: false, app: null, overlay: null,
  heartTaps: 0, moonTaps: 0,
  pin: "", pinOk: false, pinMsg: "",
  docTab: "cases", journalTab: "today", watchTab: "watching", recTab: "recipes",
  selCase: null, selStar: null, selEntry: null, selExam: null,
  calCursor: null, calMode: "month",
  search: "", caseSearch: "",
  drafts: {}, forms: {},
  adminTab: "timeline", voicePlay: null, lastFortune: null, crackAnim: false,
  lastNight: null,
};

// ——— date utils ———
function todayD() {
  if (DEV_MODE && DEV.simDate) { const d = new Date(DEV.simDate + "T12:00:00"); if (!isNaN(d)) return d; }
  return new Date();
}
function iso(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
function todayISO() { return iso(todayD()); }
function fromISO(s) { return new Date(s + "T00:00:00"); }
function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
function daysBetween(a, b) { // whole days from a to b (Date objects)
  return Math.round((fromISO(iso(b)) - fromISO(iso(a))) / 86400000);
}
const MO = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MOS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const WK = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const WKS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
function fmtShort(s) {
  if (!s) return "";
  const d = fromISO(s);
  return MOS[d.getMonth()] + " " + d.getDate() + (d.getFullYear() !== todayD().getFullYear() ? " '" + String(d.getFullYear()).slice(2) : "");
}
function esc(s) { return String(s == null ? "" : s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"); }
function uid(p) { return (p || "x") + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

// ——— seeding ———
function seedContent() {
  const D = window.LOULI_DATA || {};
  const B = window.LOULI_CONTENT_BAKED;
  if (B) return JSON.parse(JSON.stringify(B));
  return {
    dailyNotes: (D.dailyNotes || []).slice(),
    comfortNotes: (D.comfortNotes || []).slice(),
    fortunes: (D.fortunes || []).slice(),
    gratitudePrompts: (D.gratitudePrompts || []).slice(),
    letters: (D.letters || []).map(l => ({ id: l.id || uid("l"), title: l.title, unlockDate: l.unlockDate, body: l.body || "" })),
    openWhen: (D.openWhen || []).map(o => ({ id: o.id || uid("o"), label: o.label, body: o.body || "" })),
    // 45-day stretch milestones (days since army entry)
    milestones: [
      { day: 3,  title: "Three days down",  reward: "Already? You're tougher than both of us thought. Crack a cookie on me." },
      { day: 7,  title: "One whole week",   reward: "A week without me and the world kept spinning. Suspicious. Coffee coupon unlocked — page one of the book." },
      { day: 15, title: "One-third there",  reward: "15 down, 30 to go. Go listen to the 'good morning' voice note and pretend I'm insufferable in person." },
      { day: 23, title: "HALFWAY 🎉",       reward: "Halfway to seeing my face. A halfway letter just woke up in sealed letters." },
      { day: 30, title: "One month",        reward: "A month. You're incredible. Check the coupon book — something special is now redeemable." },
      { day: 40, title: "Final stretch",    reward: "Five days left. Start deciding where we're eating first, because I'm not deciding." },
      { day: 45, title: "I'M BACK (for a bit)", reward: "See you at the door. Don't cry. (Cry a little.)" },
    ],
    coupons: (D.coupons || []).map(c => ({ id: c.id || uid("c"), label: c.label, note: c.note || "" })),
    memories: (D.memories || []).map(m => ({ id: m.id || uid("m"), name: m.name, story: m.story, x: m.x, y: m.y, size: m.size || 2 })),
    weeklyQuestions: (D.weeklyQuestions || []).map(q => ({ week: q.week, q: q.q })),
    photos: ((D.vault || {}).photos || []).map(p => ({ id: uid("ph"), caption: p.caption, mediaId: null })),
    voice: ((D.vault || {}).voice || []).map(v => ({ id: v.id || uid("v"), label: v.label, length: v.length || "", mediaId: null })),
    pharma: (D.pharma || []).map(p => ({ ...p })),
    heartSecret: D.heartSecret || "You found me. I hid this here on my last night home. I love you past the edge of the map. — Sheifo",
    moonSecret: D.moonSecret || "Three taps on the moon. I knew you'd find it. Every night I'm away, I'm looking at this same moon. — Sheifo",
    annBody: "Happy monthly anniversary, my love. Wherever I am today, at some point I stopped, looked at the time, and grinned like an idiot. {months} months down, forever to go. Tonight: your favorite dinner, my treat — put it on the coupon tab. 💌",
    rotation: D.rotation || "OB/GYN rotation",
  };
}

function seedState() {
  const D = window.LOULI_DATA || {};
  return {
    v: 1,
    setup: { done: false, entryDate: null, finalReturn: null, reunions: [] },
    modeOverride: null,
    mood: Object.assign({}, D.moodHistory || {}),
    journal: (D.journal || []).map(j => ({ id: uid("j"), ...j, photoId: null })),
    opened: { letters: {}, openWhen: {} },
    coupons: {},                       // id -> {redeemed, date}
    cookies: {},                       // stretchKey -> {cracked, lastCrack}
    answers: {},                       // week -> {text, date}
    seenMilestones: {},
    eggs: {},
    annDismissed: null,
    bucket: (D.bucketList || []).map(b => ({ ...b, id: b.id || uid("b") })),
    outbox: [],                        // her letters to Sheifo
    shopping: [],
    habitsStamp: todayISO(),
    habits: (D.habits || []).map(h => ({ ...h })),
    cases: (D.cases || []).map(c => ({ ...c, id: c.id || uid("cs") })),
    procedures: (D.procedures || []).map(p => ({ ...p })),
    shifts: Object.assign({}, D.shifts || {}),
    exams: (D.exams || []).map(e => ({ ...e, id: e.id || uid("ex"), topics: e.topics.map(t => ({ ...t })) })),
    books: (D.books || []).map(b => ({ ...b, id: uid("bk") })),
    readingGoal: Object.assign({ year: 24, done: 0 }, D.readingGoal || {}),
    recipes: (D.recipes || []).map(r => ({ ...r, id: uid("rc") })),
    shows: (D.shows || []).map(s => ({ ...s, id: uid("sh") })),
    workouts: (D.workouts || []).map(w => ({ ...w, id: uid("wo") })),
    prs: (D.personalRecords || []).map(p => ({ ...p })),
    userPhotos: [],                    // photos she adds herself in the vault (hers, persisted)
  };
}

// ——— persistence ———
function saveST() { try { localStorage.setItem(LS_STATE, JSON.stringify(ST)); } catch (e) { console.error("save failed", e); } }
function saveCT() { try { localStorage.setItem(LS_CONTENT, JSON.stringify(CT)); } catch (e) { console.error("save failed", e); } }
function saveDEV() { try { localStorage.setItem(LS_DEV, JSON.stringify(DEV)); } catch (e) {} }
function loadAll() {
  try { ST = JSON.parse(localStorage.getItem(LS_STATE)); } catch (e) { ST = null; }
  try { CT = JSON.parse(localStorage.getItem(LS_CONTENT)); } catch (e) { CT = null; }
  try { DEV = JSON.parse(localStorage.getItem(LS_DEV)) || DEV; } catch (e) {}
  if (!ST) { ST = seedState(); saveST(); }
  if (!CT || (!DEV_MODE && window.LOULI_CONTENT_BAKED)) { CT = seedContent(); saveCT(); }
  // daily habit rollover
  const t = todayISO();
  if (ST.habitsStamp !== t) {
    ST.habits.forEach(h => { h.today = 0; });
    ST.habitsStamp = t;
    saveST();
  }
}

// ——— timeline (entry date → 45-day stretch → periodic visits) ———
function timeline() {
  const t = todayD(), ti = todayISO();
  const entry = ST.setup.entryDate;
  if (!entry) return null;
  const reun = [...(ST.setup.reunions || [])].sort();
  const pre = ti < entry;
  const dayN = pre ? 0 : daysBetween(fromISO(entry), t);
  let next = reun.find(r => r >= ti) || null;
  let usedFinal = false;
  if (!next && ST.setup.finalReturn && ST.setup.finalReturn >= ti) { next = ST.setup.finalReturn; usedFinal = true; }
  const passed = reun.filter(r => r < ti);
  const stretchStart = pre ? entry : (passed.length ? passed[passed.length - 1] : entry);
  const stretchLen = next ? Math.max(1, daysBetween(fromISO(stretchStart), fromISO(next))) : FIRST_STRETCH_DAYS;
  const dayInStretch = pre ? 0 : Math.max(0, Math.min(stretchLen, daysBetween(fromISO(stretchStart), t)));
  const daysLeft = next ? Math.max(0, daysBetween(t, fromISO(next))) : null;
  const pct = Math.min(100, Math.round((dayInStretch / stretchLen) * 100));
  return { pre, dayN, next, usedFinal, stretchStart, stretchLen, dayInStretch, daysLeft, pct, ti, stretchKey: stretchStart };
}

function isNight() {
  if (ST.modeOverride) return ST.modeOverride === "night";
  const h = new Date().getHours();
  return h >= NIGHT_FROM || h < NIGHT_TO;
}

// ——— media store (IndexedDB — photos & voice blobs) ———
let _db = null;
function mdb() {
  return new Promise((res, rej) => {
    if (_db) return res(_db);
    const r = indexedDB.open("louliMedia", 1);
    r.onupgradeneeded = () => r.result.createObjectStore("media", { keyPath: "id" });
    r.onsuccess = () => { _db = r.result; res(_db); };
    r.onerror = () => rej(r.error);
  });
}
async function mediaPut(id, blob) {
  const d = await mdb();
  return new Promise((res, rej) => {
    const t = d.transaction("media", "readwrite");
    t.objectStore("media").put({ id, blob, type: blob.type });
    t.oncomplete = res; t.onerror = () => rej(t.error);
  });
}
async function mediaGet(id) {
  const d = await mdb();
  return new Promise((res, rej) => {
    const r = d.transaction("media").objectStore("media").get(id);
    r.onsuccess = () => res(r.result || null); r.onerror = () => rej(r.error);
  });
}
async function mediaDel(id) {
  const d = await mdb();
  return new Promise((res, rej) => {
    const t = d.transaction("media", "readwrite");
    t.objectStore("media").delete(id);
    t.oncomplete = res; t.onerror = () => rej(t.error);
  });
}
async function mediaAll() {
  const d = await mdb();
  return new Promise((res, rej) => {
    const r = d.transaction("media").objectStore("media").getAll();
    r.onsuccess = () => res(r.result || []); r.onerror = () => rej(r.error);
  });
}
const _urls = {};
async function mediaURL(id) {
  if (!id) return null;
  if (_urls[id]) return _urls[id];
  const rec = await mediaGet(id);
  if (!rec) return null;
  _urls[id] = URL.createObjectURL(rec.blob);
  return _urls[id];
}
// after a render, hydrate <img data-media> and <audio data-media>
function hydrateMedia() {
  document.querySelectorAll("[data-media]").forEach(async (n) => {
    const url = await mediaURL(n.getAttribute("data-media"));
    if (url) { n.src = url; n.style.display = ""; }
  });
}

// ——— backup: export / import everything (state + content + media) ———
function blobToB64(blob) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result); r.onerror = rej;
    r.readAsDataURL(blob);
  });
}
async function exportBackup() {
  const media = [];
  for (const rec of await mediaAll()) media.push({ id: rec.id, b64: await blobToB64(rec.blob) });
  const payload = { app: "LouliOS", v: 1, exported: new Date().toISOString(), state: ST, content: CT, media };
  downloadJSON(payload, "louli-backup-" + todayISO() + ".json");
}
function exportContent() {
  downloadJSON(CT, "louli-content-" + todayISO() + ".json");
}
function downloadJSON(obj, name) {
  const b = new Blob([JSON.stringify(obj, null, 1)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(b); a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
async function importBackup(file) {
  const txt = await file.text();
  const p = JSON.parse(txt);
  if (p.app !== "LouliOS") throw new Error("Not a Louli OS backup file");
  ST = p.state; CT = p.content || CT;
  saveST(); saveCT();
  for (const m of (p.media || [])) {
    const blob = await (await fetch(m.b64)).blob();
    await mediaPut(m.id, blob);
  }
}
