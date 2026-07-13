// ═══ Louli OS — Sheifo's module ═══
"use strict";

function backHim() { return '<button class="backbtn" onclick="A.go(\'him\')">‹ Sheifo\'s room</button>'; }

// ——— Sheifo's room (hub) ———
R.him = () => {
  const tl = timeline();
  const notes = CT.dailyNotes || [];
  const dailyNote = notes.length ? notes[tl.dayN % notes.length] : "";
  const ms = CT.milestones;
  const nextMs = ms.find(m => m.day > tl.dayN);
  const stops = ms.filter(m => m.day <= tl.stretchLen || tl.stretchKey === ST.setup.entryDate).map(m => ({
    x: Math.min(100, Math.round((m.day / tl.stretchLen) * 100)),
    label: m.day >= tl.stretchLen ? "🏠" : "d" + m.day,
    on: m.day <= tl.dayN,
  }));
  const unlocked = CT.letters.filter(l => l.unlockDate <= tl.ti).length;
  const owLeft = CT.openWhen.filter(o => !ST.opened.openWhen[o.id]).length;
  const ck = ST.cookies[tl.stretchKey] || { cracked: 0 };
  const cookiesLeft = Math.max(0, tl.stretchLen - ck.cracked);
  const redeemed = Object.values(ST.coupons).filter(c => c.redeemed).length;
  const sealed = Object.keys(ST.answers).length;

  const hero = tl.daysLeft !== null ?
    '<div class="card" style="border-radius:30px;padding:30px 34px;">' +
      '<div class="row wr" style="gap:28px;align-items:center;">' +
        '<div><div class="kick">' + (tl.usedFinal ? "The journey home — for good" : "Until you see him") + "</div>" +
        '<div style="display:flex;align-items:baseline;gap:12px;">' +
          '<div class="heroNum" style="font-size:84px;font-weight:700;line-height:1.05;background:linear-gradient(90deg,var(--acc),var(--lav));-webkit-background-clip:text;background-clip:text;color:transparent;">' + tl.daysLeft + "</div>" +
          '<div style="font-size:20px;font-weight:700;color:var(--sub);">days left</div></div>' +
        '<div class="sub" style="margin-top:2px;">day ' + tl.dayInStretch + " of " + tl.stretchLen + " · " + tl.pct + "% of the way there</div></div>" +
        '<div class="grow" style="min-width:300px;">' +
          '<div style="position:relative;height:56px;">' +
            '<div style="position:absolute;left:0;right:0;top:26px;height:8px;border-radius:4px;background:var(--accSoft);"></div>' +
            '<div style="position:absolute;left:0;top:26px;height:8px;border-radius:4px;background:linear-gradient(90deg,var(--acc),var(--lav));width:' + Math.max(2, tl.pct) + '%;"></div>' +
            stops.map(j =>
              '<div style="position:absolute;left:' + j.x + '%;top:0;transform:translateX(-50%);text-align:center;width:64px;">' +
              '<div style="font-size:11px;font-weight:700;color:var(--sub);height:16px;">' + j.label + "</div>" +
              '<div style="width:16px;height:16px;margin:14px auto 0;border-radius:50%;background:' + (j.on ? "var(--acc)" : "var(--card)") + ";border:3px solid " + (j.on ? "var(--acc)" : "var(--line)") + ';"></div></div>').join("") +
            '<div style="position:absolute;left:' + Math.max(2, tl.pct) + '%;top:16px;transform:translateX(-50%);font-size:22px;" class="float">🎒</div>' +
          "</div>" +
          '<div style="font-size:14px;font-weight:700;color:var(--acc);margin-top:10px;text-align:center;">' +
            (nextMs ? "next milestone: “" + esc(nextMs.title) + "” in " + (nextMs.day - tl.dayN) + " days ✨" : "you're seeing him so soon!!") + "</div>" +
        "</div></div></div>"
    : '<div class="card" style="border-radius:30px;padding:30px 34px;"><div class="kick">Between visits</div><div class="h2" style="margin-top:10px;">No countdown running — add his next visit in ⚙️ settings and I\'ll start counting 💛</div></div>';

  const shelf = [
    ["letters", "💌", "Sealed letters", unlocked + " awake · " + (CT.letters.length - unlocked) + " still sleeping"],
    ["openwhen", "📮", "Open when…", owLeft + " envelopes still sealed"],
    ["cookies", "🥠", "Fortune jar", cookiesLeft + " of " + tl.stretchLen + " cookies left"],
    ["constellation", "✨", "Memory constellation", CT.memories.length + " stars · best at night"],
    ["coupons", "🎟️", "Coupon book", redeemed + " redeemed, on Sheifo's tab"],
    ["milestones", "🗺️", "Milestones", nextMs ? "next: " + nextMs.title.toLowerCase() : "all unlocked!"],
    ["vault", "📼", "Photo & voice vault", "his face + his voice, anytime"],
    ["answers", "🔐", "Answers for later", sealed + " answers sealed for his return"],
    ["outbox", "📬", "Letters to Sheifo", ST.outbox.length + " waiting for his next visit"],
    ["bucket", "🧺", "When he's back list", ST.bucket.length + " plans and counting"],
  ];
  return '<div class="wrap">' +
    '<div style="padding:10px 4px 20px;display:flex;align-items:baseline;gap:14px;flex-wrap:wrap;">' +
      '<div style="font-size:36px;font-weight:700;letter-spacing:-.5px;">Sheifo\'s room</div>' +
      '<div class="hand">everything I left behind is in here — make yourself at home</div></div>' +
    hero +
    '<div class="card love" style="margin-top:18px;position:relative;">' +
      '<div style="position:absolute;top:-12px;left:32px;font-size:22px;">📌</div>' +
      '<div class="kick" style="color:var(--gold);">today\'s note · day ' + tl.dayN + "</div>" +
      '<div class="hand" style="font-size:26px;margin-top:6px;">' + esc(dailyNote) + "</div></div>" +
    '<div class="kick" style="margin:30px 6px 14px;font-size:14px;">the shelf</div>' +
    '<div class="grid g250">' + shelf.map(c =>
      '<button class="card" style="text-align:left;border:none;cursor:pointer;' + (c[0] === "constellation" ? "background:linear-gradient(150deg,#1A1E48,#2A2F63);color:#EAE8FA;" : "") + '" onclick="A.go(\'' + c[0] + '\')">' +
        '<div style="font-size:34px;">' + c[1] + "</div>" +
        '<div style="font-size:19px;font-weight:700;margin-top:10px;">' + c[2] + "</div>" +
        '<div style="font-size:14px;font-weight:600;color:' + (c[0] === "constellation" ? "#A9ACDA" : "var(--sub)") + ';margin-top:3px;">' + c[3] + "</div></button>").join("") +
    "</div></div>";
};

// ——— sealed letters ———
R.letters = () => {
  const ti = todayISO();
  return '<div class="wrap mid"><div class="head">' + backHim() + '<div class="h1">sealed letters</div></div>' +
    '<div class="hand" style="padding:0 6px 18px;font-size:23px;">each one wakes up on its own day. no peeking — they\'ll know.</div>' +
    '<div class="grid g280">' + CT.letters.map(l => {
      const un = l.unlockDate <= ti;
      return '<button style="position:relative;text-align:center;border:none;cursor:pointer;background:' + (un ? "var(--loveBg)" : "var(--card)") + ";border-radius:22px;padding:26px 22px 22px;box-shadow:var(--shadow);opacity:" + (un ? "1" : ".75") + ';" onclick="A.openLetter(\'' + l.id + '\')">' +
        '<div style="font-size:44px;filter:' + (un ? "none" : "grayscale(.5)") + ';">' + (un ? "💌" : "✉️") + "</div>" +
        '<div class="hand" style="font-size:26px;margin-top:10px;line-height:1.15;">' + esc(l.title) + "</div>" +
        '<div class="chip ' + (un ? "a" : "") + '" style="margin-top:12px;">' + (un ? (ST.opened.letters[l.id] ? "open me again 💛" : "open me") : "🔒 wakes up " + fmtShort(l.unlockDate)) + "</div></button>";
    }).join("") + "</div></div>";
};
A.openLetter = (id) => {
  const l = CT.letters.find(x => x.id === id);
  const ti = todayISO();
  if (l.unlockDate > ti) {
    U.overlay = { type: "letter", chip: "not yet — it wakes up " + fmtShort(l.unlockDate), title: "patience, my love 🔒", body: "This one is still asleep. It knows its day, and it will be worth the wait.\n\n(Sheifo was very smug about the locking mechanism.)" };
  } else {
    ST.opened.letters[id] = todayISO(); saveST();
    U.overlay = { type: "letter", chip: "unsealed · " + fmtShort(l.unlockDate), title: l.title, body: l.body || "My Louli,\n\nThe words for this day are on real paper, in the wooden box under the bed — third envelope from the top. Go get it. I'll wait right here.\n\n— Sheifo" };
  }
  render();
};

// ——— open when… ———
R.openwhen = () => {
  return '<div class="wrap mid"><div class="head">' + backHim() + '<div class="h1">open when…</div></div>' +
    '<div class="hand" style="padding:0 6px 18px;font-size:23px;">these don\'t have dates. open them by feeling. each one only breaks its seal once.</div>' +
    '<div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(320px,1fr));">' + CT.openWhen.map((o, i) => {
      const opened = !!ST.opened.openWhen[o.id];
      return '<button class="row" style="text-align:left;border:none;cursor:pointer;background:' + (opened ? "var(--card2)" : "var(--card)") + ";border-radius:20px;padding:18px 20px;box-shadow:var(--shadow);gap:16px;transform:rotate(" + (i % 2 === 0 ? "-.6deg" : ".7deg") + ');" onclick="A.openOW(\'' + o.id + '\')">' +
        '<div style="font-size:36px;">' + (opened ? "📭" : "📮") + "</div>" +
        '<div class="grow"><div class="hand" style="font-size:26px;line-height:1.1;">' + esc(o.label) + "</div>" +
        '<div style="font-size:12px;font-weight:700;color:' + (opened ? "var(--sub)" : "var(--acc)") + ';letter-spacing:1px;text-transform:uppercase;margin-top:5px;">' + (opened ? "opened · a keepsake now" : "sealed · tap to break the seal") + "</div></div></button>";
    }).join("") + "</div></div>";
};
A.openOW = (id) => {
  const o = CT.openWhen.find(x => x.id === id);
  const was = ST.opened.openWhen[id];
  if (!was) { ST.opened.openWhen[id] = todayISO(); saveST(); }
  U.overlay = { type: "letter", chip: was ? "keepsake · opened " + fmtShort(was) : "open when… · seal broken today", title: o.label, body: o.body };
  render();
};

// ——— coupon book ———
R.coupons = () => {
  const redeemed = Object.values(ST.coupons).filter(c => c.redeemed).length;
  return '<div class="wrap mid"><div class="head">' + backHim() + '<div class="h1">coupon book</div>' +
    '<div class="chip g" style="height:34px;">🧾 ' + redeemed + " to settle when Sheifo's home</div></div>" +
    '<div class="hand" style="padding:0 6px 18px;font-size:23px;">all legally binding. the redeemed ones go on my tab.</div>' +
    '<div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(310px,1fr));">' + CT.coupons.map(c => {
      const st = ST.coupons[c.id] || {};
      return '<div style="position:relative;display:flex;background:' + (st.redeemed ? "var(--card2)" : "var(--card)") + ';border-radius:18px;box-shadow:var(--shadow);overflow:hidden;">' +
        '<div style="width:52px;border-right:2px dashed var(--line);display:flex;align-items:center;justify-content:center;font-size:22px;background:var(--card2);">🎟️</div>' +
        '<div class="grow" style="padding:16px 18px;">' +
          '<div style="font-size:17px;font-weight:700;line-height:1.25;">' + esc(c.label) + "</div>" +
          '<div style="font-size:13px;font-weight:600;color:var(--sub);margin-top:4px;">' + esc(c.note) + "</div>" +
          '<button class="btn sm" style="margin-top:12px;' + (st.redeemed ? "" : "background:var(--accSoft);color:var(--acc);") + '" onclick="A.redeemCoupon(\'' + c.id + '\')">' + (st.redeemed ? "on his tab · " + fmtShort(st.date) + " 🧾" : "redeem now") + "</button></div>" +
        (st.redeemed ? '<div style="position:absolute;right:14px;top:12px;transform:rotate(12deg);border:3px solid var(--acc);color:var(--acc);border-radius:8px;padding:3px 10px;font-size:13px;font-weight:700;letter-spacing:1.5px;">REDEEMED ♥</div>' : "") +
      "</div>";
    }).join("") + "</div></div>";
};
A.redeemCoupon = (id) => {
  if (ST.coupons[id] && ST.coupons[id].redeemed) return;
  ST.coupons[id] = { redeemed: true, date: todayISO() };
  saveST(); render();
};

// ——— memory constellation ———
R.constellation = () => {
  let html = '<div style="position:fixed;top:54px;left:0;right:0;bottom:0;overflow:hidden;background:linear-gradient(180deg,#0B0E28 0%,#171B44 60%,#232858 100%);animation:fadeIn .6s ease;">' +
    '<div style="position:absolute;top:14px;left:24px;z-index:5;" class="row">' +
      '<button class="backbtn" style="background:rgba(255,255,255,.12);color:#EAE8FA;box-shadow:none;" onclick="A.go(\'him\')">‹ Sheifo\'s room</button>' +
      '<div style="font-size:26px;font-weight:700;color:#EAE8FA;">our constellation</div></div>' +
    '<div style="position:absolute;top:58px;left:26px;z-index:5;font-family:Caveat,cursive;font-size:22px;color:#A9ACDA;">every star is a memory. tap one.</div>' +
    '<div onclick="A.tapMoon()" style="position:absolute;top:40px;right:56px;width:74px;height:74px;border-radius:50%;background:radial-gradient(circle at 34% 34%,#FFF7DC,#F5DFA0 62%,#DDBE7D);box-shadow:0 0 44px 10px rgba(255,236,170,.35);cursor:pointer;" class="float"></div>';
  CT.memories.forEach(m => {
    const px = (m.size * 4 + 4);
    html += '<button onclick="A.openStar(\'' + m.id + '\')" style="position:absolute;left:' + m.x + "%;top:" + (14 + m.y * 0.8) + '%;width:44px;height:44px;margin:-22px;border:none;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;">' +
      '<div style="width:' + px + "px;height:" + px + "px;border-radius:50%;background:#FFF6D9;box-shadow:0 0 " + (m.size * 6 + 6) + "px rgba(255,246,217,.9);animation:twinkle " + (2.2 + (m.x % 5) * 0.5) + 's infinite;"></div>' +
      '<div style="position:absolute;top:34px;white-space:nowrap;font-family:Caveat,cursive;font-size:19px;color:#8B90C9;">' + esc(m.name) + "</div></button>";
  });
  if (U.selStar) {
    const m = CT.memories.find(x => x.id === U.selStar);
    html += '<div onclick="A.closeStar()" style="position:absolute;inset:0;z-index:10;background:rgba(8,10,32,.55);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;animation:fadeIn .35s ease;">' +
      '<div onclick="event.stopPropagation()" style="width:min(560px,88vw);background:#171B44;border:1px solid #34397C;border-radius:26px;padding:32px 36px;box-shadow:0 0 70px rgba(255,246,217,.18);animation:riseIn .5s ease;">' +
        '<div style="font-size:30px;">🌟</div>' +
        '<div style="font-family:Caveat,cursive;font-size:32px;color:#FFF6D9;margin-top:8px;">' + esc(m.name) + "</div>" +
        '<div style="font-family:Caveat,cursive;font-size:24px;line-height:1.4;color:#C9CCEF;margin-top:12px;">' + esc(m.story) + "</div>" +
        '<button class="btn" style="margin-top:22px;background:rgba(255,246,217,.14);color:#FFF6D9;" onclick="A.closeStar()">back to the sky ✨</button>' +
      "</div></div>";
  }
  return html + "</div>";
};
A.openStar = (id) => { U.selStar = id; render(); };
A.closeStar = () => { U.selStar = null; render(); };
A.tapMoon = () => {
  U.moonTaps++;
  if (U.moonTaps >= 3) { U.moonTaps = 0; U.overlay = { type: "egg", body: CT.moonSecret }; render(); }
};

// ——— fortune cookie jar (one per day of the current stretch) ———
R.cookies = () => {
  const tl = timeline();
  const ck = ST.cookies[tl.stretchKey] || { cracked: 0, lastCrack: null };
  const cookiesLeft = Math.max(0, tl.stretchLen - ck.cracked);
  const fill = Math.round((cookiesLeft / tl.stretchLen) * 100);
  const crackedToday = ck.lastCrack === tl.ti;
  return '<div class="wrap narrow" style="text-align:center;"><div class="head" style="justify-content:center;">' + backHim() + '<div class="h1">fortune cookie jar</div></div>' +
    '<div class="hand" style="padding:2px 6px 10px;font-size:23px;">' + tl.stretchLen + " cookies, one per day until I see you. the jar empties, then I'm at your door.</div>" +
    '<div style="position:relative;width:280px;margin:16px auto 0;">' +
      '<div style="height:34px;background:var(--lavSoft);border-radius:12px 12px 4px 4px;box-shadow:var(--shadow);"></div>' +
      '<div style="position:relative;height:300px;background:var(--card);border-radius:8px 8px 42px 42px;box-shadow:var(--shadow);overflow:hidden;margin-top:4px;">' +
        '<div style="position:absolute;left:0;right:0;bottom:0;height:' + fill + '%;background:linear-gradient(180deg,var(--goldSoft),var(--gold));opacity:.85;transition:height .8s ease;border-radius:0 0 42px 42px;"></div>' +
        '<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;">' +
          '<div style="font-size:56px;animation:' + (U.crackAnim ? "crackShake .7s ease" : "floaty 4s infinite") + ';">🥠</div>' +
          '<div style="font-size:44px;font-weight:700;margin-top:6px;">' + cookiesLeft + "</div>" +
          '<div class="kick">cookies left</div></div></div></div>' +
    '<button class="btn p" style="margin-top:26px;height:56px;padding:0 34px;font-size:18px;' + (crackedToday && !U.lastFortune ? "opacity:.6;" : "") + '" onclick="A.crackCookie()">' +
      (U.crackAnim ? "cracking…" : crackedToday ? "come back tomorrow 🌙" : "crack today's cookie 🥠") + "</button>" +
    (U.lastFortune ?
      '<div style="width:min(480px,86vw);margin:26px auto 0;background:var(--loveBg);border:1px dashed var(--gold);border-radius:6px;padding:20px 26px;animation:slipOut .7s ease both;box-shadow:var(--shadow);">' +
        '<div style="font-size:11px;font-weight:700;color:var(--gold);letter-spacing:2.5px;font-family:monospace;">· YOUR FORTUNE ·</div>' +
        '<div class="hand" style="font-size:25px;margin-top:8px;">' + esc(U.lastFortune) + "</div></div>" : "") +
    "</div>";
};
A.crackCookie = () => {
  const tl = timeline();
  const ck = ST.cookies[tl.stretchKey] || { cracked: 0, lastCrack: null };
  if (U.crackAnim) return;
  if (ck.lastCrack === tl.ti) {
    if (!U.lastFortune) { U.lastFortune = null; }
    return;
  }
  if (ck.cracked >= tl.stretchLen) return;
  U.crackAnim = true; U.lastFortune = null; render();
  setTimeout(() => {
    const pool = CT.fortunes.length ? CT.fortunes : ["(the fortune pool is empty — Sheifo, write some in Admin!)"];
    U.lastFortune = pool[(tl.dayN + ck.cracked) % pool.length];
    U.crackAnim = false;
    ST.cookies[tl.stretchKey] = { cracked: ck.cracked + 1, lastCrack: tl.ti };
    saveST(); render();
  }, 700);
};

// ——— milestones ———
R.milestones = () => {
  const tl = timeline();
  return '<div class="wrap narrow"><div class="head">' + backHim() + '<div class="h1">the journey</div></div>' +
    '<div class="hand" style="padding:0 6px 18px;font-size:23px;">not a countdown — a treasure trail. every stop has something buried at it.</div>' +
    '<div class="col" style="gap:0;">' + CT.milestones.map((m, i, arr) => {
      const dt = addDays(fromISO(ST.setup.entryDate), m.day);
      const passed = m.day <= tl.dayN;
      return '<div style="display:flex;gap:20px;">' +
        '<div style="display:flex;flex-direction:column;align-items:center;width:56px;">' +
          '<div style="width:46px;height:46px;border-radius:50%;background:' + (passed ? "var(--accSoft)" : "var(--card)") + ";border:3px solid " + (passed ? "var(--acc)" : "var(--line)") + ';display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">' + (passed ? "🎁" : "🔒") + "</div>" +
          '<div style="width:4px;flex:1;min-height:26px;background:' + (i === arr.length - 1 ? "transparent" : (arr[i + 1].day <= tl.dayN ? "var(--acc)" : "var(--line)")) + ';border-radius:2px;"></div></div>' +
        '<div class="grow" style="background:' + (passed ? "var(--loveBg)" : "var(--card)") + ";border-radius:20px;padding:16px 22px;margin-bottom:14px;box-shadow:var(--shadow);opacity:" + (passed ? "1" : ".72") + ';">' +
          '<div class="row wr" style="align-items:baseline;gap:10px;"><div style="font-size:18px;font-weight:700;">' + esc(m.title) + '</div><div style="font-size:13px;font-weight:700;color:var(--sub);">day ' + m.day + " · " + MOS[dt.getMonth()] + " " + dt.getDate() + "</div></div>" +
          '<div style="font-size:15px;font-weight:600;margin-top:5px;' + (passed ? "font-family:Caveat,cursive;font-size:21px;color:var(--love);" : "color:var(--sub);") + '">' + (passed ? esc(m.reward) : "sealed — unwraps in " + (m.day - tl.dayN) + " days") + "</div></div></div>";
    }).join("") + "</div></div>";
};

// ——— photo & voice vault ———
R.vault = () => {
  return '<div class="wrap mid"><div class="head">' + backHim() + '<div class="h1">photo & voice vault</div></div>' +
    '<div class="hand" style="padding:0 6px 18px;font-size:23px;">my face and my voice, on demand. use responsibly.</div>' +
    '<div class="kick" style="margin:4px 6px 12px;font-size:14px;">🎙 voice notes</div>' +
    '<div class="grid g250">' + CT.voice.map(v => {
      const playing = U.voicePlay === v.id;
      return '<div class="row card" style="padding:14px 18px;gap:14px;">' +
        '<button class="btn round" style="background:' + (playing ? "var(--lav)" : "var(--acc)") + ';color:#fff;font-size:18px;flex-shrink:0;width:48px;height:48px;" onclick="A.toggleVoice(\'' + v.id + '\')">' + (playing ? "⏸" : "▶") + "</button>" +
        '<div class="grow"><div class="hand" style="font-size:23px;line-height:1;">"' + esc(v.label) + '"</div>' +
        '<div class="bar" style="height:6px;margin-top:9px;"><div id="vprog-' + v.id + '" style="width:0%;"></div></div></div>' +
        '<div style="font-size:12px;font-weight:700;color:var(--sub);">' + (v.mediaId ? esc(v.length || "") : "no audio yet") + "</div></div>";
    }).join("") + "</div>" +
    (CT.voice.some(v => !v.mediaId) && DEV_MODE ? '<div class="sub" style="margin:10px 6px;">🛠 dev note: record or upload the real audio in Admin → Media.</div>' : "") +
    '<div class="row" style="margin:26px 6px 12px;">' +
      '<div class="kick" style="font-size:14px;">📷 photos</div><div class="grow"></div>' +
      '<button class="btn sm a" onclick="A.vaultPhotoPick()">＋ add a photo</button>' +
      '<input type="file" accept="image/*" id="vault-photo-in" style="display:none;" onchange="A.vaultPhoto(this)"></div>' +
    (() => {
      const his = CT.photos.map(p => ({ ...p, own: false }));
      const hers = (ST.userPhotos || []).map(p => ({ ...p, own: true }));
      const all = his.concat(hers);
      if (all.length === 0) return '<div class="sub" style="text-align:center;margin:8px 0 4px;">no photos yet — tap “add a photo” to start your own little album 💛</div>';
      return '<div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(230px,1fr));">' + all.map((p, i) =>
        '<div class="card" style="padding:10px 10px 14px;transform:rotate(' + (i % 3 === 0 ? "-1.2deg" : i % 3 === 1 ? "1deg" : "-.4deg") + ');position:relative;">' +
          '<div style="cursor:' + (p.mediaId ? "pointer" : "default") + ';" ' + (p.mediaId ? 'onclick="A.viewPhoto(\'' + p.mediaId + '\')"' : "") + ">" +
          (p.mediaId
            ? '<img data-media="' + esc(p.mediaId) + '" style="width:100%;height:160px;object-fit:cover;border-radius:14px;display:none;">'
            : '<div style="height:160px;border-radius:14px;background:repeating-linear-gradient(45deg,var(--accSoft),var(--accSoft) 10px,var(--lavSoft) 10px,var(--lavSoft) 20px);display:flex;align-items:center;justify-content:center;"><div style="font-family:monospace;font-size:12px;color:var(--sub);background:var(--card);padding:4px 10px;border-radius:8px;">tap “add a photo”</div></div>') +
          "</div>" +
          '<div class="hand sm" style="margin-top:9px;text-align:center;' + (p.own ? "cursor:pointer;" : "") + '" ' + (p.own ? 'onclick="A.captionVaultPhoto(\'' + p.id + '\')"' : "") + ">" + (p.caption ? esc(p.caption) : (p.own ? "＋ add a caption" : "")) + "</div>" +
          (p.own ? '<button class="btn round sm" style="position:absolute;top:4px;right:4px;width:28px;height:28px;background:rgba(0,0,0,.35);color:#fff;font-size:13px;" onclick="A.deleteVaultPhoto(\'' + p.id + '\')">🗑</button>' : "") +
        "</div>").join("") + "</div>";
    })() +
    "</div>";
};
A.vaultPhotoPick = () => document.getElementById("vault-photo-in").click();
A.vaultPhoto = async (inp) => {
  const f = inp.files[0]; if (!f) return;
  const mid = uid("img");
  await mediaPut(mid, f);
  const cap = prompt("Add a caption (optional):", "") || "";
  if (!ST.userPhotos) ST.userPhotos = [];
  ST.userPhotos.unshift({ id: uid("ph"), caption: cap.trim(), mediaId: mid });
  saveST(); render();
};
A.captionVaultPhoto = (id) => {
  const p = (ST.userPhotos || []).find(x => x.id === id); if (!p) return;
  const cap = prompt("Caption:", p.caption || "");
  if (cap !== null) { p.caption = cap.trim(); saveST(); render(); }
};
A.deleteVaultPhoto = async (id) => {
  const p = (ST.userPhotos || []).find(x => x.id === id); if (!p) return;
  if (!confirm("Remove this photo?")) return;
  if (p.mediaId) { try { await mediaDel(p.mediaId); } catch (e) {} }
  ST.userPhotos = ST.userPhotos.filter(x => x.id !== id);
  saveST(); render();
};
let _audio = null, _voiceTimer = null;
A.toggleVoice = async (id) => {
  const v = CT.voice.find(x => x.id === id);
  if (_audio) { _audio.pause(); _audio = null; }
  clearInterval(_voiceTimer);
  if (U.voicePlay === id) { U.voicePlay = null; render(); return; }
  U.voicePlay = id; render();
  if (v.mediaId) {
    const url = await mediaURL(v.mediaId);
    if (url) {
      _audio = new Audio(url);
      _audio.play();
      _audio.ontimeupdate = () => {
        const el = document.getElementById("vprog-" + id);
        if (el && _audio.duration) el.style.width = Math.round((_audio.currentTime / _audio.duration) * 100) + "%";
      };
      _audio.onended = () => { U.voicePlay = null; _audio = null; render(); };
      return;
    }
  }
  // no media attached — simulate a short playback so the UI still demos
  let p = 0;
  _voiceTimer = setInterval(() => {
    p += 5;
    const el = document.getElementById("vprog-" + id);
    if (el) el.style.width = p + "%";
    if (p >= 100) { clearInterval(_voiceTimer); U.voicePlay = null; render(); }
  }, 150);
};
A.viewPhoto = (mediaId) => { U.overlay = { type: "fullPhoto", mediaId }; render(); };

// ——— answers for later ———
R.answers = () => {
  const tl = timeline();
  const currentWeek = Math.floor(tl.dayN / 7) + 1;
  const openTo = ST.setup.finalReturn ? fmtShort(ST.setup.finalReturn) : "the day he's home for good";
  const active = CT.weeklyQuestions.filter(q => q.week <= currentWeek && !ST.answers[q.week]).sort((a, b) => a.week - b.week)[0];
  return '<div class="wrap narrow"><div class="head">' + backHim() + '<div class="h1">answers for later</div></div>' +
    '<div class="hand" style="padding:0 6px 16px;font-size:23px;">one question a week. your answers seal themselves shut until I\'m home for good — then we read all of you, together.</div>' +
    '<div class="row card" style="margin-bottom:18px;gap:14px;"><div style="font-size:34px;">🔐</div>' +
      '<div><div class="h2">The vault opens ' + esc(openTo) + "</div>" +
      '<div class="sub" style="margin-top:2px;">' + Object.keys(ST.answers).length + " answers sealed inside · not even you can peek</div></div></div>" +
    '<div class="col" style="gap:14px;">' + CT.weeklyQuestions.map(q => {
      const sealed = !!ST.answers[q.week];
      const isCur = active && q.week === active.week;
      return '<div class="card" style="background:' + (isCur ? "var(--loveBg)" : "var(--card)") + ';">' +
        '<div class="row wr"><div style="font-size:13px;font-weight:700;color:var(--sub);letter-spacing:1px;">WEEK ' + q.week + "</div>" +
        '<div class="chip ' + (sealed ? "" : isCur ? "a" : "") + '" style="height:26px;font-size:12px;">' + (sealed ? "🔒 sealed in the vault" : isCur ? "this week — answer me!" : q.week > currentWeek ? "waiting its turn" : "catch-up — still open") + "</div></div>" +
        '<div class="hand" style="font-size:26px;margin-top:8px;">' + esc(q.q) + "</div>" +
        (isCur ?
          '<textarea class="ta" style="margin-top:12px;background:var(--card2);" id="answerTa" placeholder="write it for future-you and future-him…"></textarea>' +
          '<button class="btn" style="margin-top:10px;background:var(--acc);color:#fff;" onclick="A.sealAnswer(' + q.week + ')">seal it in the vault 🔒</button>' : "") +
        "</div>";
    }).join("") + "</div></div>";
};
A.sealAnswer = (week) => {
  const ta = document.getElementById("answerTa");
  const t = (ta && ta.value || "").trim();
  if (!t) return;
  ST.answers[week] = { text: t, date: todayISO() };
  saveST(); render();
};

// ——— letters to Sheifo (her outbox — NEW) ———
R.outbox = () => {
  return '<div class="wrap narrow"><div class="head">' + backHim() + '<div class="h1">letters to Sheifo 📬</div></div>' +
    '<div class="hand" style="padding:0 6px 16px;font-size:23px;">anything you want to tell me between visits — write it here. I read every one of these the moment I\'m back.</div>' +
    '<div class="card">' +
      '<textarea class="ta" id="outboxTa" placeholder="dear Sheifo…"></textarea>' +
      '<button class="btn p" style="margin-top:12px;" onclick="A.sendOutbox()">put it in the pile 💌</button></div>' +
    '<div class="col" style="margin-top:18px;">' + ST.outbox.map(l =>
      '<div class="card" style="padding:16px 22px;">' +
        '<div class="row"><div class="chip g" style="height:26px;font-size:12px;">' + fmtShort(l.date) + "</div>" +
        '<div class="sub">waiting for his visit</div></div>' +
        '<div class="hand sm" style="margin-top:8px;white-space:pre-line;">' + esc(l.text) + "</div></div>").join("") +
    (ST.outbox.length === 0 ? '<div class="sub" style="text-align:center;margin-top:10px;">nothing in the pile yet — he\'d love even a one-liner.</div>' : "") +
    "</div></div>";
};
A.sendOutbox = () => {
  const ta = document.getElementById("outboxTa");
  const t = (ta && ta.value || "").trim();
  if (!t) return;
  ST.outbox.unshift({ id: uid("ob"), date: todayISO(), text: t });
  saveST(); render();
};

// ——— when he's back (bucket list) ———
R.bucket = () => {
  return '<div class="wrap narrow"><div class="head">' + backHim() + '<div class="h1">when he\'s back 🧺</div></div>' +
    '<div class="hand" style="padding:0 6px 18px;font-size:23px;">I started this list. keep it growing — we\'re doing every single one.</div>' +
    '<div class="row" style="margin-bottom:18px;">' +
      '<input class="input pill grow" id="bucketIn" placeholder="add a plan for us…">' +
      '<button class="btn p" style="height:52px;" onclick="A.addBucket()">add it ✨</button></div>' +
    '<div class="col">' + ST.bucket.map(b =>
      '<div class="row card" style="padding:14px 20px;gap:14px;">' +
        '<div style="font-size:20px;">' + (b.by === "him" ? "💙" : "💗") + "</div>" +
        '<div class="grow" style="font-size:16px;font-weight:700;' + (b.done ? "text-decoration:line-through;opacity:.6;" : "") + '">' + esc(b.text) + "</div>" +
        '<div class="chip ' + (b.by === "him" ? "s" : "a") + '" style="height:26px;font-size:12px;">' + (b.by === "him" ? "Sheifo's idea" : "her idea") + "</div>" +
        '<button class="btn sm" onclick="A.toggleBucket(\'' + b.id + '\')">' + (b.done ? "↩" : "done ✓") + "</button></div>").join("") +
    "</div></div>";
};
A.addBucket = () => {
  const inp = document.getElementById("bucketIn");
  const t = (inp && inp.value || "").trim();
  if (!t) return;
  ST.bucket.push({ id: uid("b"), text: t, by: "her", done: false });
  saveST(); render();
};
A.toggleBucket = (id) => {
  const b = ST.bucket.find(x => x.id === id);
  if (b) { b.done = !b.done; saveST(); render(); }
};
