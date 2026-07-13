// ═══ Louli OS — core: router, status bar, boot, setup, home, overlays, settings ═══
"use strict";

const R = {};                 // screen renderers, filled by sheifo.js / doctor.js / life.js / admin.js
const A = {};                 // global actions (inline onclick handlers)
window.A = A;

// ——— render loop ———
function render() {
  applyTheme();
  renderStatusbar();
  const scr = document.getElementById("screen");
  if (!ST.setup.done) { scr.innerHTML = R.setup(); renderOverlay(); return; }
  if (!U.booted) { scr.innerHTML = ""; renderBoot(); return; }
  checkAutoMoments();
  const fn = R[U.app || "home"] || R.home;
  scr.innerHTML = fn();
  renderOverlay();
  hydrateMedia();
  if (U.refocus) {
    const el = document.getElementById(U.refocus);
    U.refocus = null;
    if (el) { el.focus(); const v = el.value; el.value = ""; el.value = v; }
  }
}

function applyTheme() {
  const n = isNight();
  document.documentElement.classList.toggle("night", n);
  if (U.lastNight !== null && U.lastNight !== n) modeMoment(n);
  U.lastNight = n;
}

// small delight when the sky changes
function modeMoment(toNight) {
  const el = document.createElement("div");
  el.style.cssText = "position:fixed;inset:0;z-index:200;pointer-events:none;display:flex;align-items:center;justify-content:center;";
  el.innerHTML = '<div style="font-size:110px;animation:moonRise 1.6s ease forwards;">' + (toNight ? "🌙" : "☀️") + "</div>";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1700);
}

// ——— status bar ———
function renderStatusbar() {
  const sb = document.getElementById("statusbar");
  const now = new Date();
  const h = now.getHours(), m = String(now.getMinutes()).padStart(2, "0");
  const clock = ((h % 12) || 12) + ":" + m + (h < 12 ? " am" : " pm");
  const tl = ST.setup.done ? timeline() : null;
  const t = todayD();
  const dateStr = WKS[t.getDay()] + ", " + MOS[t.getMonth()] + " " + t.getDate() + (tl && !tl.pre ? " · day " + tl.dayN : "");
  const modeIcon = ST.modeOverride === "day" ? "☀️" : ST.modeOverride === "night" ? "🌙" : (isNight() ? "🌙" : "☀️");
  const heart = tl && tl.daysLeft !== null
    ? '<div onclick="A.tapHeart()" class="chip" style="height:36px;background:var(--card);box-shadow:var(--shadow);font-size:14px;color:var(--ink);cursor:default;"><span class="pulse" style="display:inline-block;">❤️</span> ' + tl.daysLeft + "d</div>"
    : "";
  sb.innerHTML =
    '<div class="row">' +
      (U.app !== null && ST.setup.done && U.booted ? '<button class="backbtn" onclick="A.go(null)">‹ Home</button>' : "") +
      '<div style="font-weight:700;font-size:17px;" id="sb-clock">' + clock + "</div>" +
      '<div class="sub">' + dateStr + "</div>" +
    "</div>" +
    '<div class="row" style="gap:10px;">' +
      '<div style="font-size:12px;font-weight:700;color:var(--sub);letter-spacing:.5px;">' + (ST.modeOverride ? "manual" : "auto") + "</div>" +
      '<button class="btn round ghost" style="width:38px;height:38px;font-size:17px;" title="day / night / auto" onclick="A.cycleMode()">' + modeIcon + "</button>" +
      (ST.setup.done ? '<button class="btn round ghost" style="width:38px;height:38px;font-size:16px;" onclick="A.go(\'settings\')">⚙️</button>' : "") +
      (DEV_MODE && ST.setup.done ? '<button class="btn round ghost" style="width:38px;height:38px;font-size:16px;" onclick="A.go(\'admin\')">🛠</button>' : "") +
      heart +
    "</div>";
}
A.cycleMode = () => {
  const n = isNight();
  ST.modeOverride = ST.modeOverride === null ? (n ? "day" : "night") : ST.modeOverride === "night" ? "day" : null;
  saveST(); render();
};
A.tapHeart = () => {
  U.heartTaps++;
  if (U.heartTaps >= 5) { U.heartTaps = 0; U.overlay = { type: "egg", body: CT.heartSecret }; render(); }
};
A.go = (app) => {
  U.app = app; U.selCase = null; U.selStar = null; U.selEntry = null; U.forms = {};
  document.getElementById("screen").scrollTop = 0;
  render();
};

// ——— stars (night layer) ———
function buildStars() {
  const holder = document.getElementById("stars");
  let html = "";
  for (let i = 0; i < 26; i++) {
    const x = (i * 41 + 7) % 100, y = (i * 23 + 5) % 38;
    const s = i % 3 === 0 ? 3 : 2;
    html += '<div class="star" style="left:' + x + "%;top:" + y + "%;width:" + s + "px;height:" + s + "px;animation:twinkle " + (2.2 + (i % 5) * 0.5) + "s " + ((i % 7) * 0.3) + 's infinite;"></div>';
  }
  holder.innerHTML = html;
}

// ——— first-run setup (one-time: his army entry date) ———
R.setup = () => {
  const f = U.forms;
  return '<div class="ovl" style="position:fixed;inset:0;background:var(--bg);backdrop-filter:none;-webkit-backdrop-filter:none;">' +
    '<div style="width:min(560px,92vw);text-align:center;animation:riseIn .6s ease;">' +
      '<div style="font-size:64px;" class="pulse">💌</div>' +
      '<div style="font-size:38px;font-weight:700;margin-top:18px;">Hi, Louli.</div>' +
      '<div class="hand big" style="margin-top:10px;">Sheifo built this for you. One thing before we start —</div>' +
      '<div class="card" style="margin-top:26px;text-align:left;">' +
        '<div class="kick">When does he enter the army?</div>' +
        '<input type="date" class="input" style="margin-top:10px;" value="' + esc(f.entry || "") + '" onchange="A.setupField(\'entry\',this.value)">' +
        '<div class="kick" style="margin-top:18px;">When is he home for good? <span style="text-transform:none;letter-spacing:0;">(optional — skip if you don\'t know yet)</span></div>' +
        '<input type="date" class="input" style="margin-top:10px;" value="' + esc(f.final || "") + '" onchange="A.setupField(\'final\',this.value)">' +
        '<div class="sub" style="margin-top:16px;">His first vacation lands <b>' + FIRST_STRETCH_DAYS + ' days</b> after entry — the app counts you down to that, then to every visit after it.</div>' +
        '<div style="color:var(--acc);font-weight:700;font-size:14px;margin-top:10px;">' + esc(f.msg || "") + "</div>" +
        '<button class="btn p" style="width:100%;margin-top:16px;height:52px;font-size:16px;" onclick="A.finishSetup()">start my Louli OS ✨</button>' +
      "</div>" +
      '<div class="sub" style="margin-top:14px;">you only do this once — everything after this is yours.</div>' +
    "</div></div>";
};
A.setupField = (k, v) => { U.forms[k] = v; };
A.finishSetup = () => {
  const f = U.forms;
  if (!f.entry) { f.msg = "I need the entry date — it's what every countdown hangs on 💛"; render(); return; }
  ST.setup.entryDate = f.entry;
  ST.setup.finalReturn = f.final || null;
  ST.setup.reunions = [iso(addDays(fromISO(f.entry), FIRST_STRETCH_DAYS))];
  ST.setup.done = true;
  U.forms = {};
  saveST(); render();
};

// ——— boot ———
function renderBoot() {
  const n = isNight();
  const h = new Date().getHours();
  const g = h < 5 ? "Still up," : h < 12 ? "Good morning," : h < 18 ? "Good afternoon," : "Good evening,";
  document.getElementById("overlay").innerHTML =
    '<div onclick="A.dismissBoot()" style="position:fixed;inset:0;z-index:100;background:var(--bg);display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;animation:fadeIn .8s ease;">' +
      '<div style="font-size:64px;" class="pulse">' + (n ? "🌙" : "☀️") + "</div>" +
      '<div style="font-size:44px;font-weight:700;margin-top:26px;letter-spacing:-.5px;animation:riseIn .9s ease;">' + g + " Louli</div>" +
      '<div class="hand big" style="margin-top:14px;animation:riseIn 1.2s ease;">' + (n ? "the stars kept your place" : "Sheifo left you a whole world in here") + "</div>" +
      '<div class="kick" style="margin-top:60px;animation:twinkle 2.5s infinite;">tap anywhere to begin</div>' +
    "</div>";
}
A.dismissBoot = () => { U.booted = true; render(); };

// ——— auto moments: milestone ceremony + monthly anniversary ———
function checkAutoMoments() {
  if (U.overlay) return;
  const tl = timeline();
  if (!tl || tl.pre) return;
  // milestone unlock ceremony (once each)
  const ms = CT.milestones.filter(m => m.day <= tl.dayN && !ST.seenMilestones[m.day]);
  if (ms.length) {
    const m = ms[ms.length - 1];
    ms.forEach(x => { ST.seenMilestones[x.day] = true; });
    saveST();
    U.overlay = { type: "milestone", m };
    return;
  }
  // monthly anniversary takeover — every 18th, once per day
  const t = todayD();
  if (t.getDate() === 18 && ST.annDismissed !== tl.ti) {
    U.overlay = { type: "ann" };
  }
}

// ——— overlays ———
function renderOverlay() {
  const o = document.getElementById("overlay");
  const ov = U.overlay;
  if (!ov) { o.innerHTML = ""; return; }
  if (ov.type === "letter") {
    o.innerHTML =
      '<div class="ovl" onclick="A.closeOv()">' +
        '<div style="position:relative;width:min(620px,88vw);perspective:900px;" onclick="event.stopPropagation()">' +
          '<div style="position:relative;margin:0 auto;width:200px;height:130px;background:linear-gradient(180deg,#FBEFE2,#F5DECE);border-radius:10px;box-shadow:0 18px 40px rgba(60,20,50,.35);z-index:2;">' +
            '<div style="position:absolute;left:0;right:0;top:0;height:66px;background:linear-gradient(180deg,#F6E3CE,#EFD2BA);border-radius:10px 10px 0 0;transform-origin:top;animation:flapOpen 1s .3s ease forwards;clip-path:polygon(0 0,100% 0,50% 100%);"></div>' +
            '<div style="position:absolute;left:50%;top:44px;transform:translateX(-50%);width:34px;height:34px;border-radius:50%;background:#8E3A56;display:flex;align-items:center;justify-content:center;font-size:16px;color:#fff;box-shadow:0 3px 8px rgba(120,30,60,.35);">♥</div>' +
          "</div>" +
          '<div style="position:relative;margin:-40px auto 0;width:100%;background:#FFFDF7;border-radius:22px;padding:38px 42px 34px;box-shadow:0 24px 60px rgba(60,20,50,.4);animation:letterOut 1.1s .9s ease both;max-height:64vh;overflow-y:auto;">' +
            '<div class="kick" style="color:#B98E5A;">' + esc(ov.chip || "") + "</div>" +
            '<div style="font-family:Caveat,cursive;font-size:32px;color:#7C2D43;margin-top:8px;">' + esc(ov.title || "") + "</div>" +
            '<div style="font-family:Caveat,cursive;font-size:24px;line-height:1.45;color:#63414F;margin-top:14px;white-space:pre-line;">' + esc(ov.body || "") + "</div>" +
            '<button class="btn" style="margin-top:24px;background:#F3DCE3;color:#7C2D43;" onclick="A.closeOv()">keep it forever 💛</button>' +
          "</div>" +
        "</div></div>";
  } else if (ov.type === "comfort") {
    o.innerHTML =
      '<div class="ovl" onclick="A.closeOv()">' +
        '<div class="sheet" style="background:var(--loveBg);border:1px solid var(--goldSoft);" onclick="event.stopPropagation()">' +
          '<div style="font-size:36px;">🫂</div>' +
          '<div class="kick" style="margin-top:10px;">Sheifo left something for days like this</div>' +
          '<div class="hand" style="font-size:25px;margin-top:14px;">' + esc(ov.body || "") + "</div>" +
          '<div class="row" style="margin-top:24px;">' +
            '<button class="btn" style="background:var(--acc);color:#fff;" onclick="A.closeOv()">thank you 🤍</button>' +
            '<button class="btn" onclick="A.closeOv()">not right now</button>' +
          "</div></div></div>";
  } else if (ov.type === "egg") {
    o.innerHTML =
      '<div class="ovl" style="background:rgba(14,17,48,.6);" onclick="A.closeOv()">' +
        '<div style="width:min(540px,88vw);background:#1D2150;border:1px solid #3A3F80;border-radius:26px;padding:34px 38px;animation:glowPulse 3s infinite;" onclick="event.stopPropagation()">' +
          '<div style="font-size:36px;">🤫</div>' +
          '<div class="kick" style="color:#9DA0CE;margin-top:10px;">you found a hidden note</div>' +
          '<div style="font-family:Caveat,cursive;font-size:25px;line-height:1.4;color:#FFDF9E;margin-top:14px;">' + esc(ov.body || "") + "</div>" +
          '<button class="btn" style="margin-top:24px;background:#FFDF9E;color:#3A2E10;" onclick="A.closeOv()">our secret ✨</button>' +
        "</div></div>";
  } else if (ov.type === "milestone") {
    o.innerHTML =
      '<div class="ovl" style="background:linear-gradient(160deg,rgba(250,236,220,.96),rgba(244,210,222,.96) 55%,rgba(224,214,240,.96));">' +
        confettiHTML() +
        '<div style="position:relative;width:min(600px,88vw);text-align:center;background:rgba(255,253,250,.94);border-radius:30px;padding:44px 46px 38px;box-shadow:0 30px 80px rgba(124,45,67,.3);animation:riseIn .8s ease;">' +
          '<div style="font-size:56px;" class="pulse">🎁</div>' +
          '<div class="kick" style="color:#B9893E;margin-top:12px;">day ' + ov.m.day + " · milestone unlocked</div>" +
          '<div style="font-size:36px;font-weight:700;color:#42313B;margin-top:8px;">' + esc(ov.m.title) + "</div>" +
          '<div style="font-family:Caveat,cursive;font-size:26px;line-height:1.4;color:#7C2D43;margin-top:16px;">' + esc(ov.m.reward) + "</div>" +
          '<button class="btn p" style="margin-top:26px;height:50px;font-size:16px;" onclick="A.closeOv()">on to the next one 💛</button>' +
        "</div></div>";
  } else if (ov.type === "ann") {
    const t = todayD();
    const months = (t.getFullYear() - 2025) * 12 + t.getMonth() - 11 - (t.getDate() < 18 ? 1 : 0);
    o.innerHTML =
      '<div class="ovl" style="background:linear-gradient(160deg,rgba(250,224,200,.96),rgba(244,196,214,.96) 55%,rgba(220,206,240,.96));">' +
        confettiHTML() +
        '<div style="position:relative;width:min(600px,88vw);text-align:center;background:rgba(255,253,250,.94);border-radius:30px;padding:44px 46px 38px;box-shadow:0 30px 80px rgba(124,45,67,.35);animation:riseIn .8s ease;">' +
          '<div style="font-size:56px;animation:pulseHeart 1.8s infinite;">💞</div>' +
          '<div class="kick" style="color:#B9893E;margin-top:12px;">the 18th · monthly anniversary takeover</div>' +
          '<div style="font-size:38px;font-weight:700;color:#42313B;margin-top:8px;">' + months + " months of us</div>" +
          '<div style="font-family:Caveat,cursive;font-size:26px;line-height:1.4;color:#7C2D43;margin-top:16px;">' + esc((CT.annBody || "").replace("{months}", months)) + "</div>" +
          '<button class="btn p" style="margin-top:26px;height:50px;font-size:16px;" onclick="A.closeAnn()">happy us 💛 back to my day</button>' +
        "</div></div>";
  } else if (ov.type === "fullPhoto") {
    o.innerHTML =
      '<div class="ovl" onclick="A.closeOv()"><img data-media="' + esc(ov.mediaId) + '" style="max-width:92vw;max-height:84vh;border-radius:18px;box-shadow:0 24px 60px rgba(0,0,0,.5);display:none;"></div>';
    hydrateMedia();
  }
}
function confettiHTML() {
  const colors = ["#9C4059", "#8B7BC7", "#D9B36C", "#7FB7E8", "#E39B7C", "#8FC7A8"];
  let h = '<div style="position:absolute;inset:0;pointer-events:none;overflow:hidden;">';
  for (let i = 0; i < 44; i++) {
    h += '<div style="position:absolute;left:' + ((i * 37) % 100) + "%;top:-6vh;width:" + (i % 3 === 0 ? 14 : 9) + "px;height:" + (i % 4 === 0 ? 9 : 16) + "px;border-radius:" + (i % 2 ? "50%" : "3px") + ";background:" + colors[i % colors.length] + ";animation:confettiFall " + (3.4 + (i % 7) * 0.55) + "s linear " + ((i % 9) * 0.42) + 's infinite;"></div>';
  }
  return h + "</div>";
}
A.closeOv = () => { U.overlay = null; render(); };
A.closeAnn = () => { ST.annDismissed = todayISO(); saveST(); U.overlay = null; render(); };

// ——— HOME ———
R.home = () => {
  const tl = timeline();
  const t = todayD();
  const h = new Date().getHours();
  const g = h < 5 ? "Still up," : h < 12 ? "Good morning," : h < 18 ? "Good afternoon," : "Good evening,";
  const n = isNight();
  const notes = CT.dailyNotes || [];
  const dailyNote = notes.length ? notes[tl.dayN % notes.length] : "";
  const shiftMap = { day: ["Day shift", "☀️", "var(--goldSoft)"], evening: ["Evening shift", "🌇", "var(--accSoft)"], night: ["Night shift", "🌙", "var(--lavSoft)"], oncall: ["On call", "📟", "var(--skySoft)"], post: ["Post-night rest", "😴", "var(--skySoft)"], off: ["Day off", "🌿", "var(--goldSoft)"] };
  const sh = shiftMap[(ST.shifts[tl.ti] || { type: "off" }).type] || shiftMap.off;
  let nextShift = "";
  for (let i = 1; i <= 7; i++) {
    const nd = addDays(t, i), s2 = ST.shifts[iso(nd)];
    if (s2 && s2.type !== "off" && s2.type !== "post") { nextShift = "Next: " + shiftMap[s2.type][0].toLowerCase() + " · " + WKS[nd.getDay()] + " " + nd.getDate(); break; }
  }
  const todayMood = ST.mood[tl.ti];
  const moodCaptions = { 1: "Oh no. Come here. 🫂", 2: "Rough one. Logged.", 3: "Steady. That counts.", 4: "Good day! Noted 💛", 5: "Glowing! Love that for you ✨" };
  const streaks = ST.habits.filter(x => x.streak > 0);
  // next letter teaser
  const nextLetter = CT.letters.filter(l => l.unlockDate > tl.ti).sort((a, b) => a.unlockDate < b.unlockDate ? -1 : 1)[0];
  // cookies
  const ck = ST.cookies[tl.stretchKey] || { cracked: 0 };
  const cookiesLeft = Math.max(0, tl.stretchLen - ck.cracked);

  const countdownInner = tl.pre
    ? '<div class="kick">Before he goes</div>' +
      '<div style="display:flex;align-items:baseline;gap:10px;margin-top:6px;"><div class="heroNum" style="font-size:52px;font-weight:700;color:var(--acc);line-height:1;">' + Math.abs(daysBetween(t, fromISO(ST.setup.entryDate))) + '</div><div class="sub" style="font-size:17px;">days still together — spend them well 💛</div></div>'
    : tl.daysLeft !== null
    ? '<div class="kick">Until you see Sheifo</div>' +
      '<div style="display:flex;align-items:baseline;gap:10px;margin-top:6px;">' +
        '<div class="heroNum" style="font-size:52px;font-weight:700;color:var(--acc);line-height:1;">' + tl.daysLeft + "</div>" +
        '<div class="sub" style="font-size:17px;">days · ' + tl.pct + "% there" + (tl.usedFinal ? " · home for good" : "") + "</div></div>" +
      '<div class="bar" style="margin-top:18px;height:12px;border-radius:6px;"><div style="width:' + Math.max(2, tl.pct) + '%;"></div></div>' +
      '<div style="position:relative;height:0;"><div style="position:absolute;left:' + Math.max(2, tl.pct) + '%;top:-24px;transform:translateX(-50%);font-size:18px;" class="float">💌</div></div>' +
      '<div class="row" style="justify-content:space-between;font-size:12px;font-weight:700;color:var(--sub);margin-top:12px;"><span>' + fmtShort(tl.stretchStart) + "</span><span>day " + tl.dayInStretch + " of " + tl.stretchLen + "</span><span>" + fmtShort(tl.next) + "</span></div>"
    : '<div class="kick">Next visit</div>' +
      '<div class="h2" style="margin-top:10px;">He was just here 🥹 when\'s the next one?</div>' +
      '<button class="btn a sm" style="margin-top:12px;" onclick="A.go(\'settings\')">add his next visit date</button>';

  return '<div class="wrap"><div style="padding:14px 4px 22px;">' +
      '<div style="font-size:38px;font-weight:700;letter-spacing:-.5px;">' + g + " Louli " + (n ? "🌙" : "☀️") + "</div>" +
      '<div style="font-size:17px;font-weight:600;color:var(--sub);margin-top:5px;">' + WK[t.getDay()] + ", " + MO[t.getMonth()] + " " + t.getDate() +
        (tl.daysLeft !== null && !tl.pre ? " · you see him in " + tl.daysLeft + " days 💛" : "") + "</div></div>" +
    '<div class="grid">' +
      '<div class="card" style="cursor:pointer;" onclick="A.go(\'him\')">' + countdownInner + "</div>" +
      '<div class="card" style="cursor:pointer;" onclick="A.go(\'doctor\')">' +
        '<div class="kick">Today at the hospital</div>' +
        '<div class="row" style="margin-top:14px;"><div style="width:54px;height:54px;border-radius:18px;background:' + sh[2] + ';display:flex;align-items:center;justify-content:center;font-size:26px;">' + sh[1] + "</div>" +
        '<div><div style="font-size:21px;font-weight:700;">' + sh[0] + '</div><div class="sub" style="margin-top:2px;">' + esc(CT.rotation) + "</div></div></div>" +
        '<div class="sub" style="margin-top:14px;">' + nextShift + "</div></div>" +
      '<div class="card love" style="cursor:pointer;" onclick="A.go(\'him\')">' +
        '<div class="kick" style="color:var(--gold);">💌 Today, from Sheifo</div>' +
        '<div class="hand" style="margin-top:10px;">' + esc(dailyNote) + "</div></div>" +
      '<div class="card">' +
        '<div class="kick">How are you, really?</div>' +
        '<div class="row" style="margin-top:16px;gap:10px;">' + [1,2,3,4,5].map(i =>
          '<button class="mood' + (todayMood === i ? " on" : "") + '" onclick="A.pickMood(' + i + ')">' + ["😞","😕","😐","🙂","🥰"][i-1] + "</button>").join("") + "</div>" +
        '<div class="sub" style="margin-top:12px;text-align:center;">' + (todayMood ? moodCaptions[todayMood] : "tap to check in — it takes one second") + "</div></div>" +
      '<div class="card" style="cursor:pointer;" onclick="A.go(\'habits\')">' +
        '<div class="kick">Streaks going strong</div>' +
        '<div class="row wr" style="margin-top:15px;gap:10px;">' + (streaks.length ? streaks.map(s =>
          '<div class="chip" style="height:42px;font-size:15px;color:var(--ink);">' + s.emoji + " " + esc(s.name) + ' <span style="color:var(--acc);">🔥' + s.streak + "</span></div>").join("") : '<div class="sub">start one today — no pressure 🌿</div>') + "</div></div>" +
      '<div class="card" style="cursor:pointer;display:flex;align-items:center;gap:18px;" onclick="A.go(\'cookies\')">' +
        '<div style="font-size:44px;" class="float">🥠</div>' +
        '<div><div class="kick">Fortune jar</div><div style="font-size:20px;font-weight:700;margin-top:4px;">' + cookiesLeft + ' cookies left</div><div class="sub" style="margin-top:2px;">one a day until you see him</div></div></div>' +
      (nextLetter ?
      '<div class="card" style="cursor:pointer;" onclick="A.go(\'letters\')">' +
        '<div class="kick">✉️ Next letter wakes up</div>' +
        '<div style="font-size:20px;font-weight:700;margin-top:8px;">in ' + daysBetween(t, fromISO(nextLetter.unlockDate)) + " days</div>" +
        '<div class="hand sm" style="margin-top:4px;">"' + esc(nextLetter.title) + '" · ' + fmtShort(nextLetter.unlockDate) + "</div></div>" : "") +
    "</div>" +
    '<div class="kick" style="margin:34px 6px 16px;font-size:14px;">Louli\'s apps</div>' +
    '<div class="row wr" style="gap:26px 30px;padding:0 2px;align-items:flex-start;">' +
      [["him","💌","Sheifo","linear-gradient(135deg,#EFC6D2,#DFA3B6)"],
       ["doctor","🩺","Doctor Suite","linear-gradient(135deg,#CDE7E0,#A8D2C6)"],
       ["journal","📖","Journal","linear-gradient(135deg,#E2DBF5,#CBBFEC)"],
       ["reading","📚","Reading","linear-gradient(135deg,#F5E3C4,#EBCD96)"],
       ["recipes","🍰","Recipe Box","linear-gradient(135deg,#F5DCD1,#EBC0AE)"],
       ["watchlist","🎬","Watchlist","linear-gradient(135deg,#D4E5F5,#B0CDEC)"],
       ["gym","💪","Gym","linear-gradient(135deg,#F2DCE6,#E4BBCF)"],
       ["habits","🌿","Habits","linear-gradient(135deg,#DCEFD7,#BCDDB3)"],
       ["bucket","🧺","Bucket List","linear-gradient(135deg,#F7EDCB,#EDDA9E)"]].map(a =>
        '<button class="appicon" onclick="A.go(\'' + a[0] + '\')"><div class="ic" style="background:' + a[3] + ';">' + a[1] + '</div><div class="lb">' + a[2] + "</div></button>").join("") +
    "</div></div>";
};
A.pickMood = (i) => {
  const ti = todayISO();
  ST.mood[ti] = i; saveST();
  render();
  if (i <= 2 && CT.comfortNotes.length) {
    setTimeout(() => { U.overlay = { type: "comfort", body: CT.comfortNotes[Math.floor(Math.random() * CT.comfortNotes.length)] }; render(); }, 500);
  }
};

// ——— SETTINGS ———
R.settings = () => {
  const s = ST.setup;
  const reun = [...(s.reunions || [])].sort();
  const ti = todayISO();
  return '<div class="wrap narrow"><div class="head"><div class="h1">settings ⚙️</div></div>' +
    '<div class="col" style="gap:16px;">' +
    '<div class="card"><div class="kick">The dates</div>' +
      '<div class="sub" style="margin-top:10px;">Army entry: <b style="color:var(--ink);">' + fmtShort(s.entryDate) + "</b>" + (s.finalReturn ? " · home for good: <b style=\"color:var(--ink);\">" + fmtShort(s.finalReturn) + "</b>" : "") + "</div>" +
      '<div class="kick" style="margin-top:18px;">His visits</div>' +
      '<div class="col" style="margin-top:10px;">' + reun.map(r =>
        '<div class="row"><div class="chip ' + (r < ti ? "" : "a") + '">' + (r < ti ? "✓ " : "💛 ") + fmtShort(r) + "</div>" +
        (r >= ti ? '<button class="btn sm" onclick="A.delReunion(\'' + r + '\')">remove</button>' : "") + "</div>").join("") + "</div>" +
      '<div class="row" style="margin-top:14px;">' +
        '<input type="date" class="input" style="max-width:220px;" id="newReunion">' +
        '<button class="btn a" onclick="A.addReunion()">add next visit 💛</button></div>' +
      '<div class="sub" style="margin-top:10px;">every time a visit ends, add the next one here — the countdown follows it.</div>' +
      '<div class="kick" style="margin-top:18px;">Home for good (optional)</div>' +
      '<div class="row" style="margin-top:10px;"><input type="date" class="input" style="max-width:220px;" value="' + esc(s.finalReturn || "") + '" onchange="A.setFinal(this.value)"><div class="sub">used when no visit is scheduled</div></div>' +
    "</div>" +
    '<div class="card"><div class="kick">Backup — please do this sometimes 💾</div>' +
      '<div class="sub" style="margin-top:10px;">Everything lives on this iPad. A backup file keeps your journal, moods, answers and photos safe if anything happens to the device.</div>' +
      '<div class="row wr" style="margin-top:14px;">' +
        '<button class="btn p" onclick="A.doExport()">download backup file</button>' +
        '<button class="btn" onclick="document.getElementById(\'importFile\').click()">restore from backup</button>' +
        '<input type="file" id="importFile" accept=".json" style="display:none;" onchange="A.doImport(this)">' +
      '</div><div class="sub" style="margin-top:10px;" id="backupMsg"></div>' +
    "</div>" +
    '<div class="card"><div class="kick">Theme</div>' +
      '<div class="sub" style="margin-top:10px;">Night mode switches on automatically at 8pm. Use the ' + (isNight() ? "🌙" : "☀️") + " button in the top bar to override it.</div>" +
    "</div>" +
    "</div></div>";
};
A.addReunion = () => {
  const v = document.getElementById("newReunion").value;
  if (!v) return;
  if (!ST.setup.reunions.includes(v)) ST.setup.reunions.push(v);
  saveST(); render();
};
A.delReunion = (r) => { ST.setup.reunions = ST.setup.reunions.filter(x => x !== r); saveST(); render(); };
A.setFinal = (v) => { ST.setup.finalReturn = v || null; saveST(); render(); };
A.doExport = async () => {
  const m = document.getElementById("backupMsg");
  m.textContent = "packing everything up…";
  try { await exportBackup(); m.textContent = "backup downloaded 💛 keep it somewhere safe (iCloud, email it to Sheifo…)"; }
  catch (e) { m.textContent = "hmm, that failed: " + e.message; }
};
A.doImport = async (inp) => {
  const f = inp.files[0]; if (!f) return;
  const m = document.getElementById("backupMsg");
  try { await importBackup(f); m.textContent = "restored ✨"; setTimeout(() => { render(); }, 600); }
  catch (e) { m.textContent = "that file didn't work: " + e.message; }
};

// ——— init ———
window.addEventListener("DOMContentLoaded", () => {
  loadAll();
  buildStars();
  U.lastNight = isNight();
  render();
  // clock + auto night check, without stomping on typing: only re-render status bar
  setInterval(() => {
    const n = isNight();
    if (n !== U.lastNight) { render(); }
    else renderStatusbar();
  }, 30000);
});
