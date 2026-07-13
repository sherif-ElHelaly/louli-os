// ═══ Louli OS — Journal & Mood, Reading, Recipes, Watchlist, Gym, Habits ═══
"use strict";

// ——— JOURNAL ———
R.journal = () => {
  const tabs = [["today", "✍️ Today"], ["entries", "🗓 Entries"], ["moods", "🌦 Mood map"]];
  let body = U.journalTab === "today" ? jToday() : U.journalTab === "entries" ? jEntries() : jMoods();
  return '<div class="wrap mid"><div class="head">' +
    '<div class="h1">journal 📖</div><div class="grow"></div>' +
    tabs.map(t => '<button class="tab' + (U.journalTab === t[0] ? " on" : "") + '" onclick="A.jTab(\'' + t[0] + '\')">' + t[1] + "</button>").join("") +
    "</div>" + body + "</div>";
};
A.jTab = (t) => { U.journalTab = t; render(); };

function jToday() {
  const ti = todayISO();
  const tl = timeline();
  const mood = ST.mood[ti];
  const gp = CT.gratitudePrompts;
  const moodCaptions = { 1: "Oh no. Come here. 🫂", 2: "Rough one. Logged.", 3: "Steady. That counts.", 4: "Good day! Noted 💛", 5: "Glowing! Love that for you ✨" };
  return '<div class="grid">' +
    '<div class="card" style="padding:24px 28px;">' +
      '<div class="kick">today\'s mood</div>' +
      '<div class="row" style="margin-top:14px;gap:10px;">' + [1,2,3,4,5].map(i =>
        '<button class="mood' + (mood === i ? " on" : "") + '" onclick="A.pickMood(' + i + ')">' + ["😞","😕","😐","🙂","🥰"][i-1] + "</button>").join("") + "</div>" +
      '<div class="sub" style="margin-top:10px;text-align:center;">' + (mood ? moodCaptions[mood] : "tap to check in") + "</div>" +
      '<div class="kick" style="margin-top:22px;">gratitude prompt</div>' +
      '<div class="hand" style="margin-top:6px;">' + esc(gp.length ? gp[tl.dayN % gp.length] : "") + "</div></div>" +
    '<div class="card" style="padding:24px 28px;">' +
      '<div class="kick">dear diary…</div>' +
      '<textarea class="ta" id="diaryTa" style="min-height:150px;margin-top:12px;background:var(--card2);" placeholder="how was today, really? (future-you will want the details)">' + esc(U.drafts.diary || "") + "</textarea>" +
      '<input class="input" id="diaryGrat" style="margin-top:10px;" placeholder="one thing you\'re grateful for (optional)">' +
      '<div class="row" style="margin-top:12px;">' +
        '<button class="btn p" onclick="A.saveEntry()">save today 💾</button>' +
        '<button class="btn" onclick="document.getElementById(\'diaryPhoto\').click()">📷 add photo</button>' +
        '<input type="file" id="diaryPhoto" accept="image/*" style="display:none;" onchange="A.diaryPhoto(this)">' +
        '<div style="font-size:14px;font-weight:700;color:var(--acc);">' + esc(U.drafts.saveMsg || (U.drafts.diaryPhotoId ? "photo attached ✓" : "")) + "</div></div></div>" +
  "</div>";
}
A.diaryPhoto = async (inp) => {
  const file = inp.files[0]; if (!file) return;
  const id = uid("img");
  await mediaPut(id, file);
  const ta = document.getElementById("diaryTa");
  if (ta) U.drafts.diary = ta.value;
  U.drafts.diaryPhotoId = id;
  render();
};
A.saveEntry = () => {
  const ta = document.getElementById("diaryTa");
  const gr = document.getElementById("diaryGrat");
  const t = (ta && ta.value || "").trim();
  if (!t) return;
  ST.journal.unshift({
    id: uid("j"), date: todayISO(), mood: ST.mood[todayISO()] || 3,
    title: "Today", text: t, gratitude: (gr && gr.value.trim()) || "—",
    photoId: U.drafts.diaryPhotoId || null,
  });
  U.drafts.diary = ""; U.drafts.diaryPhotoId = null; U.drafts.saveMsg = "";
  saveST();
  U.journalTab = "entries"; U.selEntry = ST.journal[0].id;
  render();
};

function jEntries() {
  const sel = ST.journal.find(e => e.id === U.selEntry);
  const me = ["😞","😕","😐","🙂","🥰"];
  return '<div style="display:flex;gap:18px;flex-wrap:wrap;">' +
    '<div class="col grow" style="min-width:300px;">' + ST.journal.map(e =>
      '<button class="row" style="text-align:left;border:none;cursor:pointer;background:' + (U.selEntry === e.id ? "var(--accSoft)" : "var(--card)") + ';border-radius:18px;padding:14px 20px;box-shadow:var(--shadow);gap:14px;color:var(--ink);" onclick="A.selEntry(\'' + e.id + '\')">' +
        '<div style="font-size:26px;">' + me[(e.mood || 3) - 1] + "</div>" +
        '<div class="grow"><div style="font-size:16px;font-weight:700;">' + esc(e.title) + (e.photoId ? " 📷" : "") + "</div>" +
        '<div style="font-size:13px;font-weight:600;color:var(--sub);margin-top:2px;">' + fmtShort(e.date) + "</div></div></button>").join("") + "</div>" +
    (sel ?
      '<div class="card" style="flex:1.4;min-width:320px;align-self:flex-start;padding:26px 30px;">' +
        '<div class="row"><div style="font-size:34px;">' + me[(sel.mood || 3) - 1] + "</div>" +
        '<div><div style="font-size:22px;font-weight:700;">' + esc(sel.title) + '</div><div style="font-size:13px;font-weight:600;color:var(--sub);">' + fmtShort(sel.date) + "</div></div></div>" +
        (sel.photoId ? '<img data-media="' + esc(sel.photoId) + '" style="width:100%;max-height:280px;object-fit:cover;border-radius:16px;margin-top:14px;display:none;">' : "") +
        '<div style="font-size:16px;font-weight:600;line-height:1.6;margin-top:16px;white-space:pre-line;">' + esc(sel.text) + "</div>" +
        '<div style="background:var(--loveBg);border-radius:16px;padding:14px 18px;margin-top:16px;">' +
          '<div style="font-size:11px;font-weight:700;color:var(--gold);letter-spacing:1.5px;">GRATEFUL FOR</div>' +
          '<div class="hand" style="font-size:23px;margin-top:4px;">' + esc(sel.gratitude) + "</div></div></div>" : "") +
  "</div>";
}
A.selEntry = (id) => { U.selEntry = id; render(); };

function jMoods() {
  // calendar heatmap: one mini-month per month since he left (or last 3 months)
  const me = ["😞","😕","😐","🙂","🥰"];
  const mc = ["#D98A8A","#DBB083","#DFD28F","#AFD3A0","#8FC7A8"];
  const entry = fromISO(ST.setup.entryDate);
  const t = todayD();
  const startD = entry < t ? entry : t;
  const months = [];
  let c = new Date(startD.getFullYear(), startD.getMonth(), 1);
  const end = new Date(t.getFullYear(), t.getMonth(), 1);
  while (c <= end && months.length < 16) { months.push(new Date(c)); c = new Date(c.getFullYear(), c.getMonth() + 1, 1); }
  const keys = Object.keys(ST.mood);
  const avg = keys.length ? (keys.reduce((a, k) => a + ST.mood[k], 0) / keys.length) : 0;
  return '<div class="card" style="padding:26px 30px;">' +
    '<div class="kick">mood weather, month by month</div>' +
    '<div class="row wr" style="gap:26px;margin-top:16px;align-items:flex-start;">' + months.map(m => {
      const daysIn = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
      let cells = "";
      for (let i = 0; i < new Date(m.getFullYear(), m.getMonth(), 1).getDay(); i++) cells += "<div></div>";
      for (let d = 1; d <= daysIn; d++) {
        const k = iso(new Date(m.getFullYear(), m.getMonth(), d));
        const v = ST.mood[k];
        cells += '<div title="' + k + (v ? " · " + me[v-1] : "") + '" style="width:22px;height:22px;border-radius:6px;background:' + (v ? mc[v - 1] : "var(--card2)") + ";border:2px solid " + (k === todayISO() ? "var(--acc)" : "transparent") + ';"></div>';
      }
      return '<div><div style="font-size:13px;font-weight:700;color:var(--sub);margin-bottom:6px;">' + MOS[m.getMonth()] + " " + m.getFullYear() + "</div>" +
        '<div style="display:grid;grid-template-columns:repeat(7,22px);gap:4px;">' + cells + "</div></div>";
    }).join("") + "</div>" +
    '<div class="row wr" style="gap:16px;margin-top:18px;">' +
      '<div style="font-size:14px;font-weight:700;color:var(--sub);">😞 rough → 🥰 glowing</div>' +
      '<div style="font-size:14px;font-weight:700;color:var(--acc);">average ' + avg.toFixed(1) + " / 5 — you're doing better than you think</div></div></div>";
}

// ——— READING ———
R.reading = () => {
  const rg = ST.readingGoal;
  const covers = [["📖","var(--lavSoft)"],["🍯","var(--goldSoft)"],["🌌","var(--skySoft)"],["🫀","var(--accSoft)"]];
  return '<div class="wrap mid"><div class="head">' +
    '<div class="h1">reading 📚</div>' +
    '<div class="chip g" style="height:38px;font-size:14px;">🎯 ' + rg.done + " of " + rg.year + " books this year</div>" +
    '<div class="grow"></div>' +
    '<button class="btn a" onclick="A.formToggle(\'newBook\')">+ book</button></div>' +
    (U.forms.newBook ?
      '<div class="card" style="margin-bottom:16px;"><div class="row wr">' +
      '<input class="input" id="nb-title" placeholder="title" style="max-width:280px;">' +
      '<input class="input" id="nb-author" placeholder="author" style="max-width:220px;">' +
      '<button class="btn p" onclick="A.addBook()">add to shelf</button></div></div>' : "") +
    '<div class="grid fill">' + ST.books.map((b, i) => {
      const chip = b.status === "reading" ? ["reading · " + (b.progress || 0) + "%", "g"] : b.status === "finished" ? ["finished " + "⭐".repeat(b.rating || 0), "a"] : ["up next", ""];
      return '<div class="card" style="padding:20px 24px;">' +
        '<div style="display:flex;gap:16px;">' +
          '<div style="width:64px;height:92px;border-radius:8px;background:' + covers[i % 4][1] + ';display:flex;align-items:center;justify-content:center;font-size:26px;flex-shrink:0;box-shadow:var(--shadow);">' + covers[i % 4][0] + "</div>" +
          '<div class="grow"><div style="font-size:17px;font-weight:700;line-height:1.25;">' + esc(b.title) + "</div>" +
          '<div style="font-size:13px;font-weight:600;color:var(--sub);margin-top:3px;">' + esc(b.author) + "</div>" +
          '<div class="chip ' + chip[1] + '" style="height:26px;font-size:12px;margin-top:8px;">' + chip[0] + "</div></div></div>" +
        (b.status === "reading" ?
          '<div class="bar" style="height:8px;margin-top:14px;"><div style="width:' + (b.progress || 0) + '%;background:var(--gold);"></div></div>' +
          '<div class="row" style="margin-top:10px;"><button class="btn sm" onclick="A.bookProg(\'' + b.id + '\',10)">read +10%</button><button class="btn sm a" onclick="A.bookFinish(\'' + b.id + '\')">finished it! 🎉</button></div>' :
         b.status === "toread" ?
          '<button class="btn sm a" style="margin-top:12px;" onclick="A.bookStart(\'' + b.id + '\')">start reading</button>' :
          '<div class="row" style="margin-top:10px;">' + [1,2,3,4,5].map(s => '<button style="border:none;background:transparent;font-size:18px;cursor:pointer;opacity:' + ((b.rating || 0) >= s ? 1 : 0.3) + ';" onclick="A.bookRate(\'' + b.id + "'," + s + ')">⭐</button>').join("") + "</div>") +
        (b.quote ? '<div class="hand sm" style="margin-top:12px;border-top:1px solid var(--line);padding-top:10px;">"' + esc(b.quote) + '"</div>' : "") +
        '<div class="row" style="margin-top:10px;"><input class="input" id="bq-' + b.id + '" placeholder="save a quote…" style="height:38px;padding:6px 14px;font-size:14px;"><button class="btn sm" onclick="A.bookQuote(\'' + b.id + '\')">📌</button></div>' +
      "</div>";
    }).join("") + "</div></div>";
};
A.addBook = () => {
  const t = (document.getElementById("nb-title") || {}).value || "";
  if (!t.trim()) return;
  ST.books.unshift({ id: uid("bk"), title: t.trim(), author: ((document.getElementById("nb-author") || {}).value || "").trim(), status: "toread", progress: 0, rating: 0, quote: "" });
  U.forms.newBook = false; saveST(); render();
};
A.bookStart = (id) => { const b = ST.books.find(x => x.id === id); b.status = "reading"; b.progress = 0; saveST(); render(); };
A.bookProg = (id, n) => { const b = ST.books.find(x => x.id === id); b.progress = Math.min(100, (b.progress || 0) + n); saveST(); render(); };
A.bookFinish = (id) => { const b = ST.books.find(x => x.id === id); b.status = "finished"; b.progress = 100; ST.readingGoal.done++; saveST(); render(); };
A.bookRate = (id, s) => { ST.books.find(x => x.id === id).rating = s; saveST(); render(); };
A.bookQuote = (id) => {
  const v = (document.getElementById("bq-" + id) || {}).value || "";
  if (!v.trim()) return;
  ST.books.find(x => x.id === id).quote = v.trim(); saveST(); render();
};

// ——— RECIPES + shopping list ———
R.recipes = () => {
  const tabs = [["recipes", "🍰 Recipes"], ["shopping", "🛒 Shopping list"]];
  return '<div class="wrap mid"><div class="head">' +
    '<div class="h1">recipe box 🍰</div><div class="grow"></div>' +
    tabs.map(t => '<button class="tab' + (U.recTab === t[0] ? " on" : "") + '" onclick="A.recTab(\'' + t[0] + '\')">' + t[1] + "</button>").join("") +
    "</div>" + (U.recTab === "recipes" ? recipesBody() : shoppingBody()) + "</div>";
};
A.recTab = (t) => { U.recTab = t; render(); };
function recipesBody() {
  const tagStyle = { "cooked-together": ["cooked together 🫶", "a"], "to-try": ["to try", "l"], "solo": ["solo win", "g"] };
  return '<div class="row" style="margin-bottom:16px;">' +
    '<input class="input pill grow" id="nr-name" placeholder="add a recipe to try…">' +
    '<button class="btn p" style="height:52px;" onclick="A.addRecipe()">add 🍳</button></div>' +
    '<div class="grid fill">' + ST.recipes.map(r => {
      const ts = tagStyle[r.tag] || tagStyle["solo"];
      return '<div class="card" style="padding:0 0 18px;overflow:hidden;">' +
        (r.photoId
          ? '<img data-media="' + esc(r.photoId) + '" style="width:100%;height:110px;object-fit:cover;display:none;">'
          : '<div style="height:110px;background:repeating-linear-gradient(45deg,var(--goldSoft),var(--goldSoft) 10px,var(--accSoft) 10px,var(--accSoft) 20px);display:flex;align-items:center;justify-content:center;"><div style="font-family:monospace;font-size:12px;color:var(--sub);background:var(--card);padding:4px 10px;border-radius:8px;">dish photo goes here</div></div>') +
        '<div style="padding:16px 22px 0;">' +
          '<div class="row wr"><div style="font-size:17px;font-weight:700;flex:1;">' + esc(r.name) + '</div><div style="font-size:15px;">' + "⭐".repeat(r.rating || 0) + "</div></div>" +
          '<div class="row wr" style="gap:6px;margin-top:8px;">' +
            '<div class="chip ' + ts[1] + '" style="height:24px;font-size:11px;">' + ts[0] + "</div>" +
            '<div class="chip" style="height:24px;font-size:11px;">' + (r.status === "made" ? "made it ✅" : "not yet baked") + "</div></div>" +
          '<div style="font-size:14px;font-weight:600;color:var(--sub);line-height:1.45;margin-top:10px;">' + esc(r.note || "") + "</div>" +
          '<div class="row wr" style="margin-top:12px;">' +
            (r.status !== "made" ? '<button class="btn sm a" onclick="A.madeRecipe(\'' + r.id + '\')">made it! 🎉</button>' :
              [1,2,3,4,5].map(s => '<button style="border:none;background:transparent;font-size:16px;cursor:pointer;opacity:' + ((r.rating || 0) >= s ? 1 : 0.3) + ';" onclick="A.rateRecipe(\'' + r.id + "'," + s + ')">⭐</button>').join("")) +
            '<button class="btn sm" onclick="A.recipePhotoPick(\'' + r.id + '\')">📷</button>' +
            '<button class="btn sm" onclick="A.editRecipe(\'' + r.id + '\')">✏️ edit</button>' +
            '<button class="btn sm" onclick="A.deleteRecipe(\'' + r.id + '\')">🗑</button>' +
            '<input type="file" accept="image/*" id="rp-' + r.id + '" style="display:none;" onchange="A.recipePhoto(this,\'' + r.id + '\')">' +
          "</div></div></div>";
    }).join("") + "</div>";
}
A.addRecipe = () => {
  const v = (document.getElementById("nr-name") || {}).value || "";
  if (!v.trim()) return;
  ST.recipes.unshift({ id: uid("rc"), name: v.trim(), tag: "to-try", status: "totry", rating: 0, note: "" });
  saveST(); render();
};
A.editRecipe = (id) => {
  const r = ST.recipes.find(x => x.id === id);
  const name = prompt("Recipe name:", r.name);
  if (name === null) return;
  if (name.trim()) r.name = name.trim();
  const note = prompt("Notes (tips, tweaks, how it went…):", r.note || "");
  if (note !== null) r.note = note.trim();
  saveST(); render();
};
A.deleteRecipe = (id) => {
  const r = ST.recipes.find(x => x.id === id);
  if (!confirm("Delete “" + (r ? r.name : "this recipe") + "”?")) return;
  ST.recipes = ST.recipes.filter(x => x.id !== id);
  saveST(); render();
};
A.madeRecipe = (id) => { const r = ST.recipes.find(x => x.id === id); r.status = "made"; if (r.tag === "to-try") r.tag = "solo"; saveST(); render(); };
A.rateRecipe = (id, s) => { ST.recipes.find(x => x.id === id).rating = s; saveST(); render(); };
A.recipePhotoPick = (id) => document.getElementById("rp-" + id).click();
A.recipePhoto = async (inp, id) => {
  const f = inp.files[0]; if (!f) return;
  const mid = uid("img");
  await mediaPut(mid, f);
  ST.recipes.find(x => x.id === id).photoId = mid;
  saveST(); render();
};
function shoppingBody() {
  return '<div class="row" style="margin-bottom:16px;">' +
    '<input class="input pill grow" id="shop-in" placeholder="flour, vanilla, 3 eggs…">' +
    '<button class="btn p" style="height:52px;" onclick="A.addShop()">add 🛒</button></div>' +
    '<div class="col">' + ST.shopping.map(s =>
      '<div class="row card" style="padding:12px 20px;gap:14px;cursor:pointer;" onclick="A.toggleShop(\'' + s.id + '\')">' +
        '<div style="width:26px;height:26px;border:2px solid var(--acc);border-radius:9px;background:' + (s.done ? "var(--acc)" : "transparent") + ';color:#fff;display:flex;align-items:center;justify-content:center;font-size:14px;">' + (s.done ? "✓" : "") + "</div>" +
        '<div class="grow" style="font-weight:700;' + (s.done ? "text-decoration:line-through;opacity:.55;" : "") + '">' + esc(s.text) + "</div></div>").join("") +
    (ST.shopping.some(s => s.done) ? '<button class="btn sm" style="margin-top:12px;" onclick="A.clearShop()">clear checked ✨</button>' : "") +
    (ST.shopping.length === 0 ? '<div class="sub" style="text-align:center;margin-top:14px;">list\'s empty — what are we baking next?</div>' : "") +
    "</div>";
}
A.addShop = () => {
  const v = (document.getElementById("shop-in") || {}).value || "";
  if (!v.trim()) return;
  ST.shopping.push({ id: uid("sp"), text: v.trim(), done: false });
  saveST(); render();
};
A.toggleShop = (id) => { const s = ST.shopping.find(x => x.id === id); s.done = !s.done; saveST(); render(); };
A.clearShop = () => { ST.shopping = ST.shopping.filter(s => !s.done); saveST(); render(); };

// ——— WATCHLIST ———
R.watchlist = () => {
  const tabs = [["watching", "👀 Watching"], ["watched", "✅ Watched"], ["hesback", "🔒 When Sheifo's back"]];
  const rows = ST.shows.filter(s => s.status === U.watchTab);
  return '<div class="wrap narrow"><div class="head">' +
    '<div class="h1">watchlist 🎬</div><div class="grow"></div>' +
    tabs.map(t => '<button class="tab' + (U.watchTab === t[0] ? " on" : "") + '" onclick="A.watchTab(\'' + t[0] + '\')">' + t[1] + "</button>").join("") + "</div>" +
    '<div class="row" style="margin-bottom:16px;">' +
      '<input class="input pill grow" id="nw-title" placeholder="add a show or movie…">' +
      '<select class="input" id="nw-type" style="max-width:120px;height:52px;border-radius:26px;"><option value="show">show</option><option value="movie">movie</option></select>' +
      '<button class="btn p" style="height:52px;" onclick="A.addShow()">add</button></div>' +
    '<div class="col" style="gap:12px;">' + rows.map(w =>
      '<div class="row" style="background:' + (U.watchTab === "hesback" ? "var(--loveBg)" : "var(--card)") + ';border-radius:20px;padding:16px 22px;box-shadow:var(--shadow);gap:16px;">' +
        '<div style="font-size:30px;">' + (w.type === "movie" ? "🎞️" : "📺") + "</div>" +
        '<div class="grow"><div style="font-size:17px;font-weight:700;">' + esc(w.title) + "</div>" +
        '<div class="sub" style="margin-top:3px;">' + esc(w.note || "") + "</div></div>" +
        (U.watchTab === "watched"
          ? '<div class="row" style="gap:2px;">' + [1,2,3,4,5].map(s => '<button style="border:none;background:transparent;font-size:16px;cursor:pointer;opacity:' + ((w.rating || 0) >= s ? 1 : 0.3) + ';" onclick="A.rateShow(\'' + w.id + "'," + s + ')">⭐</button>').join("") + "</div>"
          : U.watchTab === "hesback" ? '<div style="font-size:15px;">🔒</div>'
          : '<button class="btn sm a" onclick="A.finishShow(\'' + w.id + '\')">finished ✓</button>') +
        (U.watchTab !== "hesback" ? '<button class="btn sm" title="save for when he\'s back" onclick="A.sealShow(\'' + w.id + '\')">🔒</button>' : "") +
      "</div>").join("") + "</div>" +
    (U.watchTab === "hesback" ? '<div class="hand" style="text-align:center;margin-top:22px;font-size:23px;">these are sealed by pinky promise until Sheifo walks through the door 🤙</div>' : "") +
    "</div>";
};
A.watchTab = (t) => { U.watchTab = t; render(); };
A.addShow = () => {
  const t = (document.getElementById("nw-title") || {}).value || "";
  if (!t.trim()) return;
  ST.shows.unshift({ id: uid("sh"), title: t.trim(), type: (document.getElementById("nw-type") || {}).value || "show", status: U.watchTab === "hesback" ? "hesback" : "watching", note: "", rating: 0 });
  saveST(); render();
};
A.finishShow = (id) => { ST.shows.find(x => x.id === id).status = "watched"; saveST(); render(); };
A.sealShow = (id) => { ST.shows.find(x => x.id === id).status = "hesback"; saveST(); render(); };
A.rateShow = (id, s) => { ST.shows.find(x => x.id === id).rating = s; saveST(); render(); };

// ——— GYM (simple · lower-body focused) ———
// A short, girl-friendly lower-body playbook. Factual, beginner-safe cues.
const LOWER_MOVES = [
  ["🍑", "Glute bridges", "Lie down, drive through heels, squeeze at the top. The best glute starter."],
  ["🏋️‍♀️", "Hip thrusts", "Back on a couch/bench, bar or weight on hips — the #1 glute builder."],
  ["🦵", "Goblet squats", "Hold one weight at your chest, sit back like a chair. Knees track over toes."],
  ["🚶‍♀️", "Walking lunges", "Long step, back knee toward the floor, push through the front heel. Great for shape + balance."],
  ["🍑", "Romanian deadlifts", "Soft knees, push hips back, feel the hamstrings stretch. Keep the back flat."],
  ["↔️", "Side-lying abductions", "Lift the top leg out; targets the side-glute for that rounded look."],
  ["🪜", "Step-ups", "Step onto a sturdy box/stair, drive through the top leg. Bodyweight is plenty to start."],
];
const LOWER_TIPS = [
  "Train legs & glutes 2–3× a week, with a rest day between — muscle grows on the rest day, not the gym day.",
  "Progress slowly: add a rep or a little weight when a set feels easy. That’s all “progressive overload” means.",
  "Squeeze the muscle you’re working (mind-muscle connection) — it beats heavier weight with sloppy form.",
  "Protein + water + sleep do half the work. You can’t out-train being under-fed or exhausted, my love.",
  "Sore ≠ progress and no-soreness ≠ wasted. Consistency over months is what changes your shape.",
];
R.gym = () => {
  const t = todayD();
  const weekStart = addDays(t, -t.getDay());
  const trainedDays = new Set(ST.workouts.map(w => w.date).filter(d => d >= iso(weekStart) && d <= todayISO()));
  const thisWeek = trainedDays.size;
  const wEmoji = (ty) => ty.includes("Lower") || ty.includes("Glute") || ty.includes("Leg") ? "🍑" : ty.includes("Cardio") || ty.includes("Walk") ? "🚶‍♀️" : ty.includes("Yoga") || ty.includes("Stretch") ? "🧘‍♀️" : "💪";
  const tip = LOWER_TIPS[t.getDate() % LOWER_TIPS.length];
  return '<div class="wrap mid"><div class="head">' +
    '<div class="h1">gym 🍑</div>' +
    '<div class="row" style="gap:7px;">' + [0,1,2,3,4,5,6].map(i => {
      const d = iso(addDays(weekStart, i));
      const on = trainedDays.has(d);
      return '<div style="width:30px;height:30px;border-radius:50%;background:' + (on ? "var(--acc)" : "var(--card2)") + ";color:" + (on ? "#fff" : "var(--sub)") + ';display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;">' + "SMTWTFS"[i] + "</div>";
    }).join("") +
    '<div style="font-size:14px;font-weight:700;color:var(--acc);margin-left:6px;">' + thisWeek + " this week" + (thisWeek >= 2 ? " 🔥" : "") + "</div></div></div>" +
    '<div class="card love" style="margin-bottom:16px;"><div class="kick" style="color:var(--gold);">today’s tip</div>' +
      '<div class="hand" style="font-size:24px;margin-top:6px;">' + esc(tip) + "</div></div>" +
    '<div class="card" style="margin-bottom:16px;"><div class="kick">log today</div><div class="row wr" style="margin-top:10px;">' +
      '<select class="input" id="wo-type" style="max-width:240px;"><option>Lower body — glutes</option><option>Lower body — legs</option><option>Full body</option><option>Cardio / walk</option><option>Stretch / mobility</option><option>Rest-day movement</option></select>' +
      '<input class="input grow" id="wo-note" placeholder="what did you do? how did it feel?">' +
      '<button class="btn p" onclick="A.addWorkout()">log it 💥</button></div></div>' +
    '<div class="kick" style="margin:22px 6px 12px;font-size:14px;">🍑 her lower-body playbook</div>' +
    '<div class="grid g280">' + LOWER_MOVES.map(m =>
      '<div class="card" style="padding:18px 22px;">' +
        '<div class="row"><div style="font-size:26px;">' + m[0] + '</div>' +
        '<div class="h2">' + m[1] + "</div></div>" +
        '<div class="sub" style="margin-top:8px;line-height:1.5;">' + m[2] + "</div></div>").join("") + "</div>" +
    (ST.workouts.length ? '<div class="kick" style="margin:22px 6px 12px;font-size:14px;">recent</div><div class="col">' + ST.workouts.slice(0, 20).map(w =>
      '<div class="row card" style="padding:14px 22px;gap:16px;">' +
        '<div style="font-size:26px;">' + wEmoji(w.type) + "</div>" +
        '<div class="grow"><div style="font-size:16px;font-weight:700;">' + esc(w.type) + "</div>" +
        '<div class="sub" style="margin-top:2px;">' + esc(w.note || "") + "</div></div>" +
        '<div style="font-size:13px;font-weight:700;color:var(--sub);">' + fmtShort(w.date) + "</div></div>").join("") +
    "</div>" : "") + "</div>";
};
A.addWorkout = () => {
  const ty = (document.getElementById("wo-type") || {}).value || "Workout";
  const no = (document.getElementById("wo-note") || {}).value || "";
  ST.workouts.unshift({ id: uid("wo"), date: todayISO(), type: ty, note: no.trim() });
  saveST(); render();
};

// ——— HABITS ———
R.habits = () => {
  return '<div class="wrap narrow"><div class="head"><div class="h1">little habits 🌿</div></div>' +
    '<div class="hand" style="padding:0 6px 16px;font-size:22px;">gentle ones. missing a day is allowed — the streak forgives you.</div>' +
    '<div class="grid g280">' + ST.habits.map(h => {
      const hit = h.today >= h.goal;
      return '<div class="card" style="padding:20px 24px;">' +
        '<div class="row"><div style="font-size:30px;">' + h.emoji + "</div>" +
        '<div class="grow"><div style="font-size:18px;font-weight:700;">' + esc(h.name) + "</div>" +
        '<div style="font-size:13px;font-weight:700;color:var(--acc);">🔥 ' + h.streak + " day streak</div></div>" +
        '<button class="btn round" style="width:48px;height:48px;background:' + (hit ? "var(--lav)" : "var(--acc)") + ';color:#fff;font-size:22px;" onclick="A.bumpHabit(\'' + h.id + '\')">' + (hit ? "✓" : "+") + "</button></div>" +
        '<div class="row" style="gap:6px;margin-top:16px;">' + Array.from({ length: h.goal }, (_, i) =>
          '<div style="flex:1;height:10px;border-radius:5px;background:' + (i < h.today ? "var(--acc)" : "var(--card2)") + ';"></div>').join("") + "</div>" +
        '<div style="font-size:13px;font-weight:700;color:var(--sub);margin-top:8px;">' +
          (h.goal > 1 ? h.today + " of " + h.goal + " " + esc(h.unit || "") + " today" : (hit ? "done today — lovely 💛" : "not yet today, no pressure")) + "</div></div>";
    }).join("") + "</div></div>";
};
A.bumpHabit = (id) => {
  const h = ST.habits.find(x => x.id === id);
  if (h.today >= h.goal) return;
  h.today++;
  if (h.today >= h.goal) h.streak++;
  saveST(); render();
};
