// ═══ Louli OS — Doctor Suite (PIN-locked) ═══
"use strict";

const SHIFT_TYPES = ["day", "evening", "night", "oncall", "post", "off"];
const SHIFT_META = { day: ["Day", "#D9B36C"], evening: ["Evening", "#DB8F73"], night: ["Night", "#8D82E8"], oncall: ["On call", "#6FAEE3"], post: ["Post-night", "#9BC7BE"], off: ["Off", "#D9D2DC"] };

R.doctor = () => {
  if (!U.pinOk) return doctorPin();
  const tabs = [["cases", "🗂 Cases"], ["pharma", "💊 Pharma"], ["cal", "📅 Shifts"], ["log", "📋 Logbook"], ["study", "📚 Study"]];
  let body = "";
  if (U.docTab === "cases") body = docCases();
  else if (U.docTab === "pharma") body = docPharma();
  else if (U.docTab === "cal") body = docCal();
  else if (U.docTab === "log") body = docLog();
  else body = docStudy();
  return '<div style="--acc:#4E9B8F;--accSoft:#D9EBE5;--love:#3D7A70;--loveBg:#EFF7F4;">' +
    '<div class="wrap"><div class="head">' +
      '<div style="font-size:28px;font-weight:700;">Doctor Suite</div>' +
      '<div class="chip a" style="height:30px;">Dr. Louli · ' + esc(CT.rotation) + "</div>" +
      '<div class="grow"></div>' +
      tabs.map(t => '<button class="tab' + (U.docTab === t[0] ? " on" : "") + '" onclick="A.docTab(\'' + t[0] + '\')">' + t[1] + "</button>").join("") +
    "</div>" + body + "</div></div>";
};
A.docTab = (t) => { U.docTab = t; U.selCase = null; render(); };

function doctorPin() {
  const pin = U.pin;
  const keys = ["1","2","3","4","5","6","7","8","9","clr","0","del"];
  return '<div style="position:fixed;top:54px;left:0;right:0;bottom:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;--acc:#4E9B8F;--accSoft:#D9EBE5;">' +
    '<div style="font-size:44px;">🩺</div>' +
    '<div style="font-size:26px;font-weight:700;margin-top:8px;">Doctor Suite</div>' +
    '<div class="sub">enter your PIN · hint: our day, MMDD 💍</div>' +
    '<div class="row" style="gap:14px;margin:18px 0 10px;">' + [0,1,2,3].map(i =>
      '<div style="width:16px;height:16px;border-radius:50%;background:' + (pin.length > i ? "var(--acc)" : "transparent") + ';border:2px solid var(--acc);"></div>').join("") + "</div>" +
    '<div style="font-size:14px;font-weight:700;color:var(--acc);height:20px;">' + esc(U.pinMsg) + "</div>" +
    '<div style="display:grid;grid-template-columns:repeat(3,76px);gap:12px;margin-top:8px;">' + keys.map(k =>
      '<button class="pinkey' + ((k === "del" || k === "clr") ? " alt" : "") + '" onclick="A.pinPress(\'' + k + '\')">' + (k === "del" ? "⌫" : k === "clr" ? "✕" : k) + "</button>").join("") +
    "</div></div>";
}
A.pinPress = (k) => {
  if (k === "del") { U.pin = U.pin.slice(0, -1); U.pinMsg = ""; render(); return; }
  if (k === "clr") { U.pin = ""; U.pinMsg = ""; render(); return; }
  const next = (U.pin + k).slice(0, 4);
  if (next.length === 4) {
    if (next === DOCTOR_PIN) { U.pin = ""; U.pinOk = true; U.pinMsg = ""; }
    else { U.pin = ""; U.pinMsg = "hmm, not our day 💭 try again"; }
  } else { U.pin = next; U.pinMsg = ""; }
  render();
};

// ——— cases ———
function docCases() {
  const q = U.caseSearch.toLowerCase();
  const cases = ST.cases.filter(c => !q || (c.complaint + " " + c.dx + " " + (c.tags || []).join(" ")).toLowerCase().includes(q));
  const sel = ST.cases.find(c => c.id === U.selCase);
  const f = U.forms;
  return '<div style="display:flex;gap:18px;flex-wrap:wrap;">' +
    '<div class="grow" style="min-width:320px;">' +
      '<div class="row"><input class="input pill grow" id="caseSearchIn" placeholder="🔍 search complaint, diagnosis, tag…" value="' + esc(U.caseSearch) + '" oninput="A.caseSearch(this.value)">' +
      '<button class="btn a" style="height:52px;flex-shrink:0;" onclick="A.formToggle(\'newCase\')">+ case</button></div>' +
      (f.newCase ?
        '<div class="card" style="margin-top:14px;"><div class="kick">New case</div>' +
        '<div class="col" style="margin-top:10px;">' +
        '<input class="input" id="nc-complaint" placeholder="presenting complaint">' +
        '<input class="input" id="nc-dx" placeholder="diagnosis">' +
        '<input class="input" id="nc-outcome" placeholder="outcome">' +
        '<textarea class="ta" id="nc-notes" style="min-height:70px;" placeholder="follow-up notes"></textarea>' +
        '<input class="input" id="nc-tags" placeholder="tags, comma separated (e.g. obstetrics, ER)">' +
        '<button class="btn p" onclick="A.addCase()">save case</button></div></div>' : "") +
      '<div class="col" style="margin-top:14px;">' + cases.map(c =>
        '<button style="text-align:left;border:none;cursor:pointer;background:' + (U.selCase === c.id ? "var(--accSoft)" : "var(--card)") + ';border-radius:18px;padding:15px 20px;box-shadow:var(--shadow);color:var(--ink);" onclick="A.selCase(\'' + c.id + '\')">' +
          '<div class="row wr" style="gap:8px;"><div style="font-size:13px;font-weight:700;color:var(--sub);">' + esc(c.date) + "</div>" +
          (c.tags || []).map(tg => '<div class="chip a" style="height:22px;font-size:11px;">' + esc(tg) + "</div>").join("") + "</div>" +
          '<div style="font-size:16px;font-weight:700;margin-top:6px;">' + esc(c.complaint) + "</div>" +
          '<div class="sub" style="margin-top:2px;">' + esc(c.dx) + "</div></button>").join("") + "</div></div>" +
    (sel ?
      '<div class="card" style="flex:1;min-width:320px;align-self:flex-start;">' +
        '<div style="font-size:13px;font-weight:700;color:var(--sub);">' + esc(sel.date) + " · case detail</div>" +
        '<div style="font-size:22px;font-weight:700;margin-top:8px;">' + esc(sel.complaint) + "</div>" +
        '<div class="col" style="gap:14px;margin-top:18px;">' +
          '<div><div class="kick" style="color:var(--acc);">Diagnosis</div><div style="font-size:16px;font-weight:600;margin-top:3px;">' + esc(sel.dx) + "</div></div>" +
          '<div><div class="kick" style="color:var(--acc);">Outcome</div><div style="font-size:16px;font-weight:600;margin-top:3px;">' + esc(sel.outcome) + "</div></div>" +
          '<div><div class="kick" style="color:var(--acc);">Follow-up notes</div><div style="font-size:15px;font-weight:600;line-height:1.5;color:var(--sub);margin-top:3px;">' + esc(sel.notes) + "</div></div>" +
        "</div></div>" : "") +
  "</div>";
}
A.caseSearch = (v) => {
  U.caseSearch = v;
  clearTimeout(A._cst); A._cst = setTimeout(() => { U.refocus = "caseSearchIn"; render(); }, 350);
};
A.selCase = (id) => { U.selCase = id; render(); };
A.formToggle = (k) => { U.forms[k] = !U.forms[k]; render(); };
A.addCase = () => {
  const g = (id) => (document.getElementById(id) || {}).value || "";
  if (!g("nc-complaint").trim()) return;
  ST.cases.unshift({
    id: uid("cs"), date: todayISO(),
    complaint: g("nc-complaint").trim(), dx: g("nc-dx").trim() || "—",
    outcome: g("nc-outcome").trim() || "—", notes: g("nc-notes").trim() || "—",
    tags: g("nc-tags").split(",").map(s => s.trim()).filter(Boolean),
  });
  U.forms.newCase = false;
  saveST(); render();
};

// ——— pharma lookup ———
function docPharma() {
  const q = U.search.toLowerCase();
  const rows = CT.pharma.filter(p => !q || (p.ing + " " + p.cls + " " + p.brands.join(" ") + " " + p.conditions.join(" ")).toLowerCase().includes(q));
  return '<input class="input pill" id="pharmaSearchIn" style="height:54px;" placeholder="🔍 search by condition (&quot;UTI&quot;, &quot;preeclampsia&quot;) or active ingredient (&quot;labetalol&quot;)…" value="' + esc(U.search) + '" oninput="A.pharmaSearch(this.value)">' +
    '<div class="row wr" style="margin:12px 2px 4px;gap:8px;"><div style="font-size:13px;font-weight:700;color:var(--sub);">quick picks:</div>' +
    ["anemia", "UTI", "preeclampsia", "contraception", "candidiasis", "hemorrhage"].map(c =>
      '<button class="btn sm a" onclick="A.pharmaSearch(\'' + c + '\');render()">' + c + "</button>").join("") + "</div>" +
    '<div style="font-size:14px;font-weight:700;color:var(--sub);margin:12px 2px;">' + rows.length + " of " + CT.pharma.length + " entries · mock formulary, grouped by active ingredient</div>" +
    '<div class="grid g340">' + rows.map(d =>
      '<div class="card" style="padding:18px 22px;">' +
        '<div class="row wr" style="align-items:baseline;gap:9px;"><div style="font-size:18px;font-weight:700;">' + esc(d.ing) + '</div><div style="font-size:12px;font-weight:700;color:var(--sub);">' + esc(d.cls) + "</div></div>" +
        '<div class="row wr" style="gap:8px;margin-top:9px;">' + d.brands.map(br => '<div class="chip a" style="height:28px;font-size:14px;">💊 ' + esc(br) + "</div>").join("") + "</div>" +
        '<div style="font-size:13px;font-weight:700;color:var(--sub);margin-top:9px;">' + esc(d.form) + "</div>" +
        '<div class="row wr" style="gap:6px;margin-top:8px;">' + d.conditions.map(co => '<div class="chip l" style="height:22px;font-size:11px;">' + esc(co) + "</div>").join("") + "</div>" +
        '<div style="font-size:13px;font-weight:600;color:var(--sub);line-height:1.45;margin-top:10px;border-top:1px solid var(--line);padding-top:9px;">📝 ' + esc(d.note) + "</div></div>").join("") +
    "</div>";
}
A.pharmaSearch = (v) => {
  U.search = v;
  clearTimeout(A._pst); A._pst = setTimeout(() => { U.refocus = "pharmaSearchIn"; render(); }, 350);
};

// ——— shift calendar (month + week, tap a day to set the shift) ———
function calCursor() {
  if (!U.calCursor) { const t = todayD(); U.calCursor = iso(new Date(t.getFullYear(), t.getMonth(), 1)); }
  return fromISO(U.calCursor);
}
function docCal() {
  const cur = calCursor();
  const ti = todayISO();
  const legend = SHIFT_TYPES.map(k => '<div class="row" style="gap:6px;font-size:12px;font-weight:700;color:var(--sub);"><div style="width:12px;height:12px;border-radius:4px;background:' + SHIFT_META[k][1] + ';"></div>' + SHIFT_META[k][0] + "</div>").join("");
  let body = "";
  if (U.calMode === "month") {
    const first = new Date(cur.getFullYear(), cur.getMonth(), 1);
    const daysIn = new Date(cur.getFullYear(), cur.getMonth() + 1, 0).getDate();
    let cells = "";
    for (let i = 0; i < first.getDay(); i++) cells += "<div></div>";
    for (let d = 1; d <= daysIn; d++) {
      const dIso = iso(new Date(cur.getFullYear(), cur.getMonth(), d));
      const s = (ST.shifts[dIso] || { type: "off" }).type;
      cells += '<div class="cell" style="border-color:' + (dIso === ti ? "var(--acc)" : "transparent") + ";opacity:" + (s === "off" ? ".65" : "1") + ';" onclick="A.cycleShift(\'' + dIso + '\')">' +
        '<div class="n">' + d + '</div><div class="t" style="color:var(--sub);"><span style="display:inline-block;width:8px;height:8px;border-radius:3px;background:' + SHIFT_META[s][1] + ';margin-right:4px;"></span>' + SHIFT_META[s][0] + "</div></div>";
    }
    body = '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:8px;">' +
      WKS.map(h => '<div style="text-align:center;font-size:12px;font-weight:700;color:var(--sub);letter-spacing:1px;padding:4px 0;">' + h.toUpperCase() + "</div>").join("") + cells + "</div>";
  } else {
    const t = todayD();
    const start = addDays(t, -t.getDay());
    body = '<div class="col">' + [0,1,2,3,4,5,6].map(i => {
      const d = addDays(start, i), dIso = iso(d);
      const s = (ST.shifts[dIso] || { type: "off" }).type;
      return '<div class="row card" style="padding:14px 20px;border:2px solid ' + (dIso === ti ? "var(--acc)" : "transparent") + ';cursor:pointer;" onclick="A.cycleShift(\'' + dIso + '\')">' +
        '<div style="width:90px;font-weight:700;">' + WKS[d.getDay()] + " " + d.getDate() + "</div>" +
        '<div style="width:14px;height:14px;border-radius:4px;background:' + SHIFT_META[s][1] + ';"></div>' +
        '<div style="font-weight:700;">' + SHIFT_META[s][0] + "</div>" +
        '<div class="grow"></div><div class="sub" style="font-size:12px;">tap to change</div></div>';
    }).join("") + "</div>";
  }
  return '<div class="row wr" style="margin-bottom:14px;">' +
    '<button class="btn sm" onclick="A.calNav(-1)">‹</button>' +
    '<div style="font-size:22px;font-weight:700;min-width:190px;text-align:center;">' + MO[cur.getMonth()] + " " + cur.getFullYear() + "</div>" +
    '<button class="btn sm" onclick="A.calNav(1)">›</button>' +
    '<button class="btn sm ' + (U.calMode === "month" ? "a" : "") + '" onclick="A.calMode(\'month\')">month</button>' +
    '<button class="btn sm ' + (U.calMode === "week" ? "a" : "") + '" onclick="A.calMode(\'week\')">this week</button>' +
    '<div class="grow"></div>' + legend + "</div>" +
    '<div class="sub" style="margin:0 2px 12px;">tap any day to cycle its shift: day → evening → night → on call → post-night → off</div>' + body;
}
A.calNav = (n) => { const c = calCursor(); U.calCursor = iso(new Date(c.getFullYear(), c.getMonth() + n, 1)); render(); };
A.calMode = (m) => { U.calMode = m; render(); };
A.cycleShift = (dIso) => {
  const curT = (ST.shifts[dIso] || { type: "off" }).type;
  const next = SHIFT_TYPES[(SHIFT_TYPES.indexOf(curT) + 1) % SHIFT_TYPES.length];
  if (next === "off") delete ST.shifts[dIso]; else ST.shifts[dIso] = { type: next };
  saveST(); render();
};

// ——— procedure logbook ———
function docLog() {
  const procs = ST.procedures;
  const tot = (k) => procs.reduce((a, p) => a + p[k], 0);
  const maxT = Math.max(...procs.map(p => p.observed + p.assisted + p.performed), 1);
  return '<div class="row wr" style="margin-bottom:16px;">' +
    [["observed", tot("observed")], ["assisted", tot("assisted")], ["performed", tot("performed")]].map(x =>
      '<div class="stat"><div class="n" style="font-size:34px;">' + x[1] + '</div><div class="l">' + x[0] + "</div></div>").join("") + "</div>" +
    '<div class="row" style="margin-bottom:14px;"><input class="input grow" id="newProc" placeholder="add a procedure (e.g. Cesarean section)"><button class="btn a" onclick="A.addProc()">add</button></div>' +
    '<div class="col">' + procs.map((p, i) => {
      const t = p.observed + p.assisted + p.performed;
      return '<div class="card" style="padding:14px 22px;">' +
        '<div class="row wr" style="gap:10px;">' +
          '<div style="font-size:16px;font-weight:700;flex:1;min-width:180px;">' + esc(p.name) + "</div>" +
          '<div class="row" style="gap:6px;font-size:13px;font-weight:700;color:var(--sub);">' +
            '👀 ' + p.observed + ' <button class="btn sm" style="height:26px;padding:0 9px;" onclick="A.bumpProc(' + i + ',\'observed\')">+</button>' +
            ' 🤝 ' + p.assisted + ' <button class="btn sm" style="height:26px;padding:0 9px;" onclick="A.bumpProc(' + i + ',\'assisted\')">+</button>' +
            ' ⭐ ' + p.performed + ' <button class="btn sm" style="height:26px;padding:0 9px;" onclick="A.bumpProc(' + i + ',\'performed\')">+</button></div>' +
          '<div style="font-size:15px;font-weight:700;color:var(--acc);">' + t + " total</div></div>" +
        '<div style="display:flex;height:10px;border-radius:5px;overflow:hidden;background:var(--card2);margin-top:10px;">' +
          '<div style="width:' + Math.round(p.observed / maxT * 100) + '%;background:var(--lavSoft);"></div>' +
          '<div style="width:' + Math.round(p.assisted / maxT * 100) + '%;background:var(--lav);"></div>' +
          '<div style="width:' + Math.round(p.performed / maxT * 100) + '%;background:var(--acc);"></div></div></div>';
    }).join("") + "</div>";
}
A.bumpProc = (i, k) => { ST.procedures[i][k]++; saveST(); render(); };
A.addProc = () => {
  const v = (document.getElementById("newProc") || {}).value || "";
  if (!v.trim()) return;
  ST.procedures.push({ name: v.trim(), observed: 0, assisted: 0, performed: 0 });
  saveST(); render();
};

// ——— study & exams ———
function docStudy() {
  const t = todayD();
  return '<div class="row" style="margin-bottom:14px;">' +
    '<input class="input" id="newExamName" placeholder="exam name" style="max-width:280px;">' +
    '<input type="date" class="input" id="newExamDate" style="max-width:200px;">' +
    '<button class="btn a" onclick="A.addExam()">add exam</button></div>' +
    '<div class="grid g340">' + ST.exams.map(e => {
      const days = Math.max(0, daysBetween(t, fromISO(e.date)));
      const dc = e.topics.filter(x => x.done).length;
      const pct = e.topics.length ? Math.round(dc / e.topics.length * 100) : 0;
      return '<div class="card" style="padding:24px 28px;">' +
        '<div class="row" style="gap:14px;">' +
          '<div style="width:64px;height:64px;border-radius:20px;background:var(--accSoft);display:flex;flex-direction:column;align-items:center;justify-content:center;">' +
            '<div style="font-size:22px;font-weight:700;color:var(--acc);line-height:1;">' + days + '</div><div style="font-size:10px;font-weight:700;color:var(--acc);">DAYS</div></div>' +
          '<div><div style="font-size:18px;font-weight:700;">' + esc(e.name) + '</div><div class="sub" style="margin-top:2px;">' + fmtShort(e.date) + " · " + dc + "/" + e.topics.length + " topics done</div></div></div>" +
        '<div class="bar" style="height:8px;margin-top:16px;"><div style="width:' + pct + '%;"></div></div>' +
        '<div class="col" style="gap:8px;margin-top:16px;">' + e.topics.map((tp, ti2) =>
          '<div class="row" style="background:var(--card2);border-radius:14px;padding:10px 14px;gap:10px;">' +
            '<button style="width:28px;height:28px;border:2px solid var(--acc);border-radius:9px;background:' + (tp.done ? "var(--acc)" : "transparent") + ';color:#fff;font-size:14px;cursor:pointer;flex-shrink:0;" onclick="A.toggleTopic(\'' + e.id + "'," + ti2 + ')">' + (tp.done ? "✓" : "") + "</button>" +
            '<div class="grow" style="font-size:14px;font-weight:700;">' + esc(tp.t) + "</div>" +
            '<button class="btn sm a" style="font-size:11px;height:30px;" onclick="A.scheduleTopic(\'' + e.id + "'," + ti2 + ')">' + (tp.review ? "review " + tp.review.slice(5).replace("-", "/") : "review in 3d") + "</button></div>").join("") + "</div>" +
        '<div class="row" style="margin-top:12px;"><input class="input" id="nt-' + e.id + '" placeholder="add topic" style="height:40px;padding:6px 14px;"><button class="btn sm a" onclick="A.addTopic(\'' + e.id + '\')">+</button></div>' +
      "</div>";
    }).join("") + "</div>";
}
A.addExam = () => {
  const n = (document.getElementById("newExamName") || {}).value || "";
  const d = (document.getElementById("newExamDate") || {}).value || "";
  if (!n.trim() || !d) return;
  ST.exams.push({ id: uid("ex"), name: n.trim(), date: d, topics: [] });
  saveST(); render();
};
A.addTopic = (eid) => {
  const v = (document.getElementById("nt-" + eid) || {}).value || "";
  if (!v.trim()) return;
  ST.exams.find(e => e.id === eid).topics.push({ t: v.trim(), done: false, review: null });
  saveST(); render();
};
A.toggleTopic = (eid, i) => {
  const tp = ST.exams.find(e => e.id === eid).topics[i];
  tp.done = !tp.done; saveST(); render();
};
A.scheduleTopic = (eid, i) => {
  const tp = ST.exams.find(e => e.id === eid).topics[i];
  tp.review = iso(addDays(todayD(), 3)); saveST(); render();
};
