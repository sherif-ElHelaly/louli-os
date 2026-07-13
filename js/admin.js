// ═══ Louli OS — ADMIN (DEV_MODE only) ═══
// This entire panel is HIS authoring space and is stripped from the final build
// (set DEV_MODE = false in js/config.js — see README for baking content in).
"use strict";

const ADMIN_POOLS = [
  ["dailyNotes", "💌 Daily notes", "One note per line. She sees one per day (rotates through the pool). Write at least ~45 so the first stretch never repeats."],
  ["comfortNotes", "🫂 Comfort notes", "Shown when she logs a rough mood. One per line."],
  ["fortunes", "🥠 Fortunes", "One per line, tiny and warm. She gets one per day from the jar."],
  ["gratitudePrompts", "🌼 Gratitude prompts", "One per line, used in the journal."],
];
const ADMIN_COLS = [
  { key: "letters", title: "💌 Sealed letters", fields: [["title", "title", "text"], ["unlockDate", "unlock date", "date"], ["body", "the letter", "ta"]] },
  { key: "openWhen", title: "📮 Open when…", fields: [["label", "open when… (e.g. 'you miss me')", "text"], ["body", "the letter", "ta"]] },
  { key: "milestones", title: "🗺️ Milestones", fields: [["day", "day (since entry)", "number"], ["title", "title", "text"], ["reward", "reward text", "ta"]] },
  { key: "coupons", title: "🎟️ Coupons", fields: [["label", "coupon", "text"], ["note", "fine print", "text"]] },
  { key: "memories", title: "✨ Constellation stars", fields: [["name", "memory name", "text"], ["story", "the story", "ta"], ["x", "x % (5–95)", "number"], ["y", "y % (5–95)", "number"], ["size", "size (1–3)", "number"]] },
  { key: "weeklyQuestions", title: "🔐 Weekly questions", fields: [["week", "week #", "number"], ["q", "question", "text"]] },
  { key: "pharma", title: "💊 Pharma entries", fields: [["ing", "active ingredient", "text"], ["cls", "class", "text"], ["brands", "brand names (comma separated)", "csv"], ["conditions", "conditions (comma separated)", "csv"], ["form", "dosage form", "text"], ["note", "notes", "ta"]] },
];

R.admin = () => {
  if (!DEV_MODE) return R.home();
  const tabs = [["timeline", "🕐 Timeline"], ["pools", "✍️ Note pools"], ["items", "📦 Collections"], ["media", "📷🎙 Media"], ["secrets", "🤫 Secrets"], ["data", "💾 Data"]];
  let body = "";
  if (U.adminTab === "timeline") body = admTimeline();
  else if (U.adminTab === "pools") body = admPools();
  else if (U.adminTab === "items") body = admItems();
  else if (U.adminTab === "media") body = admMedia();
  else if (U.adminTab === "secrets") body = admSecrets();
  else body = admData();
  return '<div class="wrap"><div class="head">' +
    '<div class="h1">🛠 Admin — Sheifo\'s desk</div>' +
    '<div class="chip" style="height:30px;">DEV BUILD · this panel does not exist in her version</div>' +
    '<div class="grow"></div>' +
    tabs.map(t => '<button class="tab' + (U.adminTab === t[0] ? " on" : "") + '" onclick="A.admTab(\'' + t[0] + '\')">' + t[1] + "</button>").join("") +
    "</div>" + body + "</div>";
};
A.admTab = (t) => { U.adminTab = t; render(); };

// ——— timeline & time travel ———
function admTimeline() {
  const s = ST.setup;
  return '<div class="grid">' +
    '<div class="card"><div class="kick">Time travel (dev only)</div>' +
      '<div class="sub" style="margin-top:8px;">Pretend today is another date — test letters, milestones, the anniversary takeover. Cleared = real time.</div>' +
      '<div class="row" style="margin-top:12px;">' +
        '<input type="date" class="input" style="max-width:220px;" value="' + esc(DEV.simDate || "") + '" onchange="A.setSimDate(this.value)">' +
        '<button class="btn sm" onclick="A.setSimDate(\'\')">back to real time</button></div>' +
      '<div class="chip ' + (DEV.simDate ? "g" : "") + '" style="margin-top:12px;">' + (DEV.simDate ? "⏰ simulating " + fmtShort(DEV.simDate) : "real time") + "</div></div>" +
    '<div class="card"><div class="kick">Her dates (set in her first-run setup)</div>' +
      '<div class="col" style="margin-top:12px;">' +
        '<div class="row"><div class="sub" style="width:130px;">army entry</div><input type="date" class="input" style="max-width:200px;" value="' + esc(s.entryDate || "") + '" onchange="A.admEntry(this.value)"></div>' +
        '<div class="row"><div class="sub" style="width:130px;">home for good</div><input type="date" class="input" style="max-width:200px;" value="' + esc(s.finalReturn || "") + '" onchange="A.setFinal(this.value)"></div>' +
        '<div class="sub">visits are managed in her ⚙️ settings — first one auto-set to entry + ' + FIRST_STRETCH_DAYS + ' days.</div>' +
        '<button class="btn sm" onclick="A.resetSetup()">⚠ re-run her first-time setup</button>' +
      "</div></div></div>";
}
A.setSimDate = (v) => { DEV.simDate = v || null; saveDEV(); render(); };
A.admEntry = (v) => {
  if (!v) return;
  ST.setup.entryDate = v;
  ST.setup.reunions = [iso(addDays(fromISO(v), FIRST_STRETCH_DAYS))];
  saveST(); render();
};
A.resetSetup = () => {
  if (!confirm("Re-run first-time setup? Her data stays; only the dates reset.")) return;
  ST.setup = { done: false, entryDate: null, finalReturn: null, reunions: [] };
  saveST(); render();
};

// ——— string pools ———
function admPools() {
  return '<div class="grid">' + ADMIN_POOLS.map(p =>
    '<div class="card"><div class="kick">' + p[1] + " · " + CT[p[0]].length + " written</div>" +
    '<div class="sub" style="margin-top:6px;">' + p[2] + "</div>" +
    '<textarea class="ta" style="min-height:220px;margin-top:10px;font-size:14px;" onchange="A.admPool(\'' + p[0] + '\',this.value)">' + esc(CT[p[0]].join("\n")) + "</textarea></div>").join("") + "</div>";
}
A.admPool = (key, v) => {
  CT[key] = v.split("\n").map(s => s.trim()).filter(Boolean);
  saveCT(); render();
};

// ——— object collections ———
function admItems() {
  const col = ADMIN_COLS.find(c => c.key === (U.forms.admCol || "letters")) || ADMIN_COLS[0];
  return '<div class="row wr" style="margin-bottom:14px;">' + ADMIN_COLS.map(c =>
    '<button class="tab' + (col.key === c.key ? " on" : "") + '" style="height:36px;font-size:13px;" onclick="A.admCol(\'' + c.key + '\')">' + c.title + "</button>").join("") + "</div>" +
    '<button class="btn a" style="margin-bottom:14px;" onclick="A.admAdd(\'' + col.key + '\')">+ add new</button>' +
    '<div class="grid g340">' + CT[col.key].map((item, i) =>
      '<div class="card"><div class="col">' + col.fields.map(f => {
        const val = f[2] === "csv" ? (item[f[0]] || []).join(", ") : (item[f[0]] == null ? "" : item[f[0]]);
        if (f[2] === "ta") return '<div><div class="kick" style="font-size:10px;">' + f[1] + '</div><textarea class="ta" style="min-height:90px;font-size:14px;margin-top:4px;" onchange="A.admSet(\'' + col.key + "'," + i + ",'" + f[0] + "','" + f[2] + '\',this.value)">' + esc(val) + "</textarea></div>";
        return '<div><div class="kick" style="font-size:10px;">' + f[1] + '</div><input type="' + (f[2] === "date" ? "date" : f[2] === "number" ? "number" : "text") + '" class="input" style="margin-top:4px;font-size:14px;padding:8px 12px;" value="' + esc(val) + '" onchange="A.admSet(\'' + col.key + "'," + i + ",'" + f[0] + "','" + f[2] + '\',this.value)"></div>';
      }).join("") +
      '<button class="btn sm" style="align-self:flex-start;color:#B04040;" onclick="A.admDel(\'' + col.key + "'," + i + ')">delete</button>' +
      "</div></div>").join("") + "</div>";
}
A.admCol = (k) => { U.forms.admCol = k; render(); };
A.admAdd = (key) => {
  const col = ADMIN_COLS.find(c => c.key === key);
  const item = { id: uid(key.slice(0, 2)) };
  col.fields.forEach(f => { item[f[0]] = f[2] === "csv" ? [] : f[2] === "number" ? 0 : ""; });
  if (key === "memories") { item.x = 10 + Math.round(Math.random() * 80); item.y = 10 + Math.round(Math.random() * 70); item.size = 2; }
  if (key === "letters") item.unlockDate = todayISO();
  CT[key].unshift(item);
  saveCT(); render();
};
A.admSet = (key, i, field, type, v) => {
  const item = CT[key][i];
  item[field] = type === "csv" ? v.split(",").map(s => s.trim()).filter(Boolean) : type === "number" ? Number(v) || 0 : v;
  saveCT();
};
A.admDel = (key, i) => {
  if (!confirm("Delete this?")) return;
  CT[key].splice(i, 1); saveCT(); render();
};

// ——— media: photos & voice ———
function admMedia() {
  return '<div class="grid">' +
    '<div class="card"><div class="kick">📷 Vault photos</div>' +
      '<button class="btn a sm" style="margin-top:10px;" onclick="document.getElementById(\'admPhotoIn\').click()">+ upload photo</button>' +
      '<input type="file" id="admPhotoIn" accept="image/*" style="display:none;" onchange="A.admAddPhoto(this)">' +
      '<div class="col" style="margin-top:14px;">' + CT.photos.map((p, i) =>
        '<div class="row" style="gap:10px;">' +
          (p.mediaId ? '<img data-media="' + esc(p.mediaId) + '" style="width:64px;height:48px;object-fit:cover;border-radius:8px;display:none;">' : '<div style="width:64px;height:48px;border-radius:8px;background:var(--card2);display:flex;align-items:center;justify-content:center;font-size:11px;color:var(--sub);">none</div>') +
          '<input class="input grow" style="font-size:14px;padding:8px 12px;" placeholder="caption" value="' + esc(p.caption) + '" onchange="A.admPhotoCap(' + i + ',this.value)">' +
          '<button class="btn sm" onclick="A.admDelPhoto(' + i + ')">✕</button></div>').join("") + "</div></div>" +
    '<div class="card"><div class="kick">🎙 Voice notes</div>' +
      '<div class="row wr" style="margin-top:10px;">' +
        '<button class="btn a sm" id="recBtn" onclick="A.admRecord()">' + (U.forms.recording ? "⏹ stop recording" : "⏺ record new") + "</button>" +
        '<button class="btn sm" onclick="document.getElementById(\'admVoiceIn\').click()">or upload audio file</button>' +
        '<input type="file" id="admVoiceIn" accept="audio/*" style="display:none;" onchange="A.admAddVoiceFile(this)"></div>' +
      '<div class="col" style="margin-top:14px;">' + CT.voice.map((v, i) =>
        '<div class="row" style="gap:10px;">' +
          '<div class="chip ' + (v.mediaId ? "a" : "") + '" style="height:26px;font-size:11px;flex-shrink:0;">' + (v.mediaId ? "🔊 has audio" : "no audio") + "</div>" +
          '<input class="input grow" style="font-size:14px;padding:8px 12px;" placeholder="label (e.g. good morning)" value="' + esc(v.label) + '" onchange="A.admVoiceLabel(' + i + ',this.value)">' +
          (v.mediaId ? '<button class="btn sm" onclick="A.toggleVoice(\'' + v.id + '\')">▶</button>' : "") +
          '<button class="btn sm" onclick="A.admDelVoice(' + i + ')">✕</button></div>').join("") + "</div>" +
      '<div class="sub" style="margin-top:12px;">recording uses the mic (allow it when asked). On iPad, files record as .m4a and play back natively.</div></div>' +
  "</div>";
}
A.admAddPhoto = async (inp) => {
  const f = inp.files[0]; if (!f) return;
  const id = uid("img");
  await mediaPut(id, f);
  CT.photos.unshift({ id: uid("ph"), caption: "", mediaId: id });
  saveCT(); render();
};
A.admPhotoCap = (i, v) => { CT.photos[i].caption = v; saveCT(); };
A.admDelPhoto = async (i) => {
  if (!confirm("Delete this photo?")) return;
  if (CT.photos[i].mediaId) await mediaDel(CT.photos[i].mediaId);
  CT.photos.splice(i, 1); saveCT(); render();
};
A.admVoiceLabel = (i, v) => { CT.voice[i].label = v; saveCT(); };
A.admDelVoice = async (i) => {
  if (!confirm("Delete this voice note?")) return;
  if (CT.voice[i].mediaId) await mediaDel(CT.voice[i].mediaId);
  CT.voice.splice(i, 1); saveCT(); render();
};
A.admAddVoiceFile = async (inp) => {
  const f = inp.files[0]; if (!f) return;
  const id = uid("aud");
  await mediaPut(id, f);
  CT.voice.unshift({ id: uid("v"), label: "", length: "", mediaId: id });
  saveCT(); render();
};
let _rec = null, _recChunks = [];
A.admRecord = async () => {
  if (_rec) { _rec.stop(); return; }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    _recChunks = [];
    _rec = new MediaRecorder(stream);
    _rec.ondataavailable = (e) => _recChunks.push(e.data);
    _rec.onstop = async () => {
      stream.getTracks().forEach(t => t.stop());
      const blob = new Blob(_recChunks, { type: _rec.mimeType || "audio/webm" });
      _rec = null; U.forms.recording = false;
      const id = uid("aud");
      await mediaPut(id, blob);
      CT.voice.unshift({ id: uid("v"), label: "", length: "", mediaId: id });
      saveCT(); render();
    };
    _rec.start();
    U.forms.recording = true; render();
  } catch (e) { alert("Mic not available: " + e.message); }
};

// ——— secrets & anniversary ———
function admSecrets() {
  return '<div class="grid">' +
    '<div class="card"><div class="kick">🤍 Heart secret (tap the ❤️ counter 5×)</div>' +
      '<textarea class="ta" style="margin-top:10px;" onchange="A.admSecret(\'heartSecret\',this.value)">' + esc(CT.heartSecret) + "</textarea></div>" +
    '<div class="card"><div class="kick">🌙 Moon secret (tap the moon 3× in the constellation)</div>' +
      '<textarea class="ta" style="margin-top:10px;" onchange="A.admSecret(\'moonSecret\',this.value)">' + esc(CT.moonSecret) + "</textarea></div>" +
    '<div class="card"><div class="kick">💞 Monthly anniversary message (every 18th) — {months} becomes the count</div>' +
      '<textarea class="ta" style="margin-top:10px;" onchange="A.admSecret(\'annBody\',this.value)">' + esc(CT.annBody) + "</textarea></div>" +
    '<div class="card"><div class="kick">🩺 Her rotation label</div>' +
      '<input class="input" style="margin-top:10px;" value="' + esc(CT.rotation) + '" onchange="A.admSecret(\'rotation\',this.value)"></div>' +
  "</div>";
}
A.admSecret = (k, v) => { CT[k] = v; saveCT(); };

// ——— data ———
function admData() {
  return '<div class="grid">' +
    '<div class="card"><div class="kick">Ship the final build</div>' +
      '<div class="sub" style="margin-top:8px;">1. Finish writing everything.<br>2. Tap "export content" — it downloads <b>louli-content-….json</b>.<br>3. Follow the README: paste it into <b>js/content-baked.js</b> and set <b>DEV_MODE = false</b>.<br>4. Her build now has your words baked in, and no admin panel.</div>' +
      '<button class="btn p" style="margin-top:14px;" onclick="exportContent()">export content 📦</button></div>' +
    '<div class="card"><div class="kick">Backups</div>' +
      '<div class="row wr" style="margin-top:12px;">' +
        '<button class="btn a" onclick="A.doExport()">full backup (data + media)</button>' +
        '<button class="btn" onclick="document.getElementById(\'admImport\').click()">restore backup</button>' +
        '<input type="file" id="admImport" accept=".json" style="display:none;" onchange="A.doImport(this)"></div>' +
      '<div class="sub" style="margin-top:10px;" id="backupMsg"></div></div>' +
    '<div class="card"><div class="kick" style="color:#B04040;">Danger zone</div>' +
      '<div class="row wr" style="margin-top:12px;">' +
        '<button class="btn sm" onclick="A.admResetContent()">reset content to samples</button>' +
        '<button class="btn sm" style="color:#B04040;" onclick="A.admResetAll()">wipe EVERYTHING</button></div></div>' +
  "</div>";
}
A.admResetContent = () => {
  if (!confirm("Replace all authored content with the sample content?")) return;
  localStorage.removeItem(LS_CONTENT); CT = seedContent(); saveCT(); render();
};
A.admResetAll = () => {
  if (!confirm("Wipe ALL data — her entries, your content, everything?")) return;
  if (!confirm("Really? There is no undo.")) return;
  localStorage.removeItem(LS_STATE); localStorage.removeItem(LS_CONTENT); localStorage.removeItem(LS_DEV);
  location.reload();
};
