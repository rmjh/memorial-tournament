/* =========================================================================
   2026 Nebraska State Little League Tournament — shared data + engine.
   Used by both the bracket tracker (/bracket/) and the scenario planner (/).

   Game slots reference each other so the whole bracket resolves from results:
     {seed:"Memorial"}  a team seeded directly into the game
     {w:"G5"}           the WINNER of Game 5
     {l:"G2"}           the LOSER of Game 2
   Enter scores -> winner/loser of each game resolves -> downstream games fill in.

   Results + GameChanger links live in localStorage (per browser/device), shared
   across both pages because they're on the same origin.
   ========================================================================= */
(function (global) {
  "use strict";

  var MAJOR_FIELD = "Championship Field · Diamond #3";
  var MINOR_FIELD = "Loyalty Field · Diamond #4";

  var TOURNAMENT = {
    major: {
      name: "Majors",
      field: MAJOR_FIELD,
      seedGame: "G1",            // Memorial's opening game
      teams: ["Memorial","Hillside","Grand Island","Benson","Blair",
              "Twin Valley","Hastings","Cardinal","Keystone","Kearney"],
      games: {
        G1:  {n:1,  date:"Thu, Jul 9",  time:"1:00 PM", type:"win",  a:{seed:"Memorial"},   b:{seed:"Hillside"}},
        G2:  {n:2,  date:"Thu, Jul 9",  time:"3:30 PM", type:"win",  a:{seed:"Grand Island"},b:{seed:"Benson"}},
        G3:  {n:3,  date:"Thu, Jul 9",  time:"6:00 PM", type:"win",  a:{seed:"Hastings"},    b:{seed:"Cardinal"}},
        G4:  {n:4,  date:"Thu, Jul 9",  time:"8:30 PM", type:"win",  a:{seed:"Keystone"},    b:{seed:"Kearney"}},
        G5:  {n:5,  date:"Fri, Jul 10", time:"1:00 PM", type:"win",  a:{w:"G2"},             b:{seed:"Blair"}},
        G6:  {n:6,  date:"Fri, Jul 10", time:"3:30 PM", type:"win",  a:{w:"G3"},             b:{seed:"Twin Valley"}},
        G7:  {n:7,  date:"Fri, Jul 10", time:"6:00 PM", type:"elim", a:{l:"G3"},             b:{l:"G2"}},
        G8:  {n:8,  date:"Fri, Jul 10", time:"8:30 PM", type:"elim", a:{l:"G1"},             b:{l:"G4"}},
        G9:  {n:9,  date:"Sat, Jul 11", time:"10:00 AM",type:"elim", a:{l:"G5"},             b:{w:"G7"}},
        G10: {n:10, date:"Sat, Jul 11", time:"12:30 PM",type:"elim", a:{w:"G8"},             b:{l:"G6"}},
        G11: {n:11, date:"Sat, Jul 11", time:"3:00 PM", type:"win",  a:{w:"G1"},             b:{w:"G5"}},
        G12: {n:12, date:"Sat, Jul 11", time:"5:30 PM", type:"win",  a:{w:"G4"},             b:{w:"G6"}},
        G13: {n:13, date:"Sun, Jul 12", time:"1:00 PM", type:"elim", a:{w:"G9"},             b:{l:"G12"}},
        G14: {n:14, date:"Sun, Jul 12", time:"3:00 PM", type:"elim", a:{l:"G11"},            b:{w:"G10"},
              note:"Bracket lists 3:00 PM; the schedule tab lists 3:30 PM."},
        G15: {n:15, date:"Fri, Jul 17", time:"6:00 PM", type:"elim", label:"Elimination Semifinal", a:{w:"G13"}, b:{w:"G14"}},
        G16: {n:16, date:"Fri, Jul 17", time:"8:30 PM", type:"win",  label:"Winners' Final",        a:{w:"G11"}, b:{w:"G12"}},
        G17: {n:17, date:"Sat, Jul 18", time:"11:00 AM",type:"elim", label:"Elimination Final",     a:{l:"G16"}, b:{w:"G15"}},
        G18: {n:18, date:"Sun, Jul 19", time:"12:00 PM",type:"champ", label:"Championship",         a:{w:"G16"}, b:{w:"G17"}}
      }
    },
    minor: {
      name: "Minors",
      field: MINOR_FIELD,
      seedGame: "G6",
      teams: ["Memorial","Hillside","SSC-Cardinal","Blair","Benson","Keystone",
              "Kearney","Twin Valley 1","Grand Island","Hastings","Twin Valley 2"],
      games: {
        G1:  {n:1,  date:"Wed, Jul 8",  time:"7:00 PM", type:"win",  loc:"Omaha-Memorial",        a:{seed:"Blair"},        b:{seed:"Benson"}},
        G2:  {n:2,  date:"Wed, Jul 8",  time:"6:00 PM", type:"win",  loc:"Kearney-Patriot #4",    a:{seed:"Kearney"},      b:{seed:"Twin Valley 1"}},
        G3:  {n:3,  date:"Wed, Jul 8",  time:"8:00 PM", type:"win",  loc:"Kearney-Patriot #4",    a:{seed:"Grand Island"}, b:{seed:"Hastings"}},
        G4:  {n:4,  date:"Thu, Jul 9",  time:"12:00 PM",type:"win",  a:{seed:"Hillside"},     b:{seed:"SSC-Cardinal"}},
        G5:  {n:5,  date:"Thu, Jul 9",  time:"2:00 PM", type:"win",  a:{w:"G1"},              b:{seed:"Keystone"}},
        G6:  {n:6,  date:"Thu, Jul 9",  time:"4:00 PM", type:"win",  a:{seed:"Memorial"},     b:{w:"G2"}},
        G7:  {n:7,  date:"Thu, Jul 9",  time:"6:30 PM", type:"win",  a:{w:"G3"},              b:{seed:"Twin Valley 2"}},
        G8:  {n:8,  date:"Fri, Jul 10", time:"2:00 PM", type:"elim", a:{l:"G4"},              b:{l:"G2"}},
        G9:  {n:9,  date:"Fri, Jul 10", time:"4:00 PM", type:"elim", a:{l:"G5"},              b:{l:"G3"}},
        G10: {n:10, date:"Fri, Jul 10", time:"6:30 PM", type:"elim", a:{l:"G1"},              b:{l:"G7"}},
        G11: {n:11, date:"Sat, Jul 11", time:"9:00 AM", type:"elim", a:{w:"G8"},              b:{w:"G9"}},
        G12: {n:12, date:"Sat, Jul 11", time:"11:00 AM",type:"elim", a:{l:"G6"},              b:{w:"G10"}},
        G13: {n:13, date:"Sat, Jul 11", time:"1:00 PM", type:"win",  a:{w:"G4"},              b:{w:"G5"}},
        G14: {n:14, date:"Sat, Jul 11", time:"3:30 PM", type:"win",  a:{w:"G6"},              b:{w:"G7"}},
        G15: {n:15, date:"Sun, Jul 12", time:"12:00 PM",type:"elim", a:{w:"G11"},             b:{w:"G12"}},
        G16: {n:16, date:"Sun, Jul 12", time:"2:00 PM", type:"elim", a:{l:"G14"},             b:{l:"G13"}},
        G17: {n:17, date:"Fri, Jul 17", time:"5:00 PM", type:"win",  label:"Winners' Final",        a:{w:"G13"}, b:{w:"G14"}},
        G18: {n:18, date:"Fri, Jul 17", time:"7:00 PM", type:"elim", label:"Elimination Semifinal", a:{w:"G15"}, b:{w:"G16"}},
        G19: {n:19, date:"Sat, Jul 18", time:"1:30 PM", type:"elim", label:"Elimination Final",     a:{w:"G18"}, b:{l:"G17"}},
        G20: {n:20, date:"Sun, Jul 19", time:"2:30 PM", type:"champ", label:"Championship",         a:{w:"G17"}, b:{w:"G19"}}
      }
    }
  };

  /* ---------- storage ----------
     STATE is the in-memory working copy. localStorage is written ONLY once you edit
     (the `edited` flag). Anyone who hasn't edited auto-loads the published scores.json,
     so viewers always see the latest you've published; your own edits are never clobbered. */
  var STORE_KEY = "mt_state_v1";
  var STATE = { major: { results: {}, gc: {} }, minor: { results: {}, gc: {} } };
  var edited = false;

  // scores.json lives next to tournament.js (repo root) — resolve it no matter which page loads us.
  var SCRIPT_SRC = (typeof document !== "undefined" && document.currentScript && document.currentScript.src) || "";
  var SCORES_URL = SCRIPT_SRC ? new URL("scores.json", SCRIPT_SRC).href : "scores.json";

  (function initFromLocal() {
    try {
      var s = JSON.parse(localStorage.getItem(STORE_KEY));
      if (s && s.edited) {
        edited = true;
        ["major", "minor"].forEach(function (d) {
          if (s[d]) { STATE[d].results = s[d].results || {}; STATE[d].gc = s[d].gc || {}; }
        });
      }
    } catch (e) {}
  })();

  function persist() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify({ edited: edited, major: STATE.major, minor: STATE.minor })); } catch (e) {}
  }
  function markEdited() { edited = true; persist(); }

  function getScore(div, gid) { return STATE[div].results[gid] || null; }
  function setScore(div, gid, a, b) {
    var na = (a === "" || a == null || (typeof a === "number" && isNaN(a))) ? null : a;
    var nb = (b === "" || b == null || (typeof b === "number" && isNaN(b))) ? null : b;
    if (na === null && nb === null) delete STATE[div].results[gid];
    else STATE[div].results[gid] = { a: na, b: nb };
    markEdited();
  }
  function clearDivision(div) { STATE[div].results = {}; markEdited(); }
  function clearAll() { STATE.major.results = {}; STATE.minor.results = {}; markEdited(); }
  function getGcLinks(div) { return STATE[div].gc || {}; }
  function setGcLink(div, team, url) {
    if (!url) delete STATE[div].gc[team]; else STATE[div].gc[team] = url;
    markEdited();
  }
  function exportData() {
    return { major: { results: STATE.major.results, gc: STATE.major.gc },
             minor: { results: STATE.minor.results, gc: STATE.minor.gc } };
  }
  function downloadScores() {
    var blob = new Blob([JSON.stringify(exportData(), null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob), a = document.createElement("a");
    a.href = url; a.download = "scores.json";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
  }
  function makeScoresFile() {
    return new File([JSON.stringify(exportData(), null, 2)], "scores.json", { type: "application/json" });
  }
  // True when the device can share a file via the OS share sheet (iOS/Android, secure context).
  function canShareScores() {
    try { return !!(navigator.canShare && navigator.canShare({ files: [makeScoresFile()] })); }
    catch (e) { return false; }
  }
  // Open the share sheet with scores.json (so it can go straight to a Working Copy shortcut,
  // AirDrop, Files, etc.). Falls back to a download where file-sharing isn't supported.
  function shareScores() {
    var file = makeScoresFile();
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      return navigator.share({ files: [file], title: "Memorial tournament scores" });
    }
    downloadScores();
    return Promise.resolve();
  }
  function applyPublished(p) {
    ["major", "minor"].forEach(function (d) {
      STATE[d].results = (p[d] && p[d].results) || {};
      STATE[d].gc = (p[d] && p[d].gc) || {};
    });
  }
  // Fetch the published scores.json. Skips if you have local edits (unless force=true).
  // cb(changed) runs after; changed=true means STATE was updated and the page should re-render.
  function loadPublished(cb, force) {
    cb = cb || function () {};
    if (edited && !force) { cb(false); return; }
    if (typeof fetch !== "function") { cb(false); return; }
    fetch(SCORES_URL + "?t=" + Date.now(), { cache: "no-store" })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (p) {
        applyPublished(p);
        if (force) { edited = false; try { localStorage.removeItem(STORE_KEY); } catch (e) {} }
        cb(true);
      })
      .catch(function () { cb(false); });
  }
  function isEdited() { return edited; }

  /* ---------- resolution engine ---------- */
  function norm(x) { return (x || "").toString().trim().toLowerCase(); }

  // 'a' | 'b' | null  — which side won (higher score; ties => undecided)
  function winnerSide(div, gid) {
    var sc = getScore(div, gid);
    if (!sc || sc.a == null || sc.b == null || sc.a === sc.b) return null;
    return sc.a > sc.b ? "a" : "b";
  }

  // Resolve a slot definition to {team, label, decided}
  function resolveSlot(div, slot) {
    if (!slot) return { team: null, label: "TBD", decided: false };
    if (slot.seed) return { team: slot.seed, label: slot.seed, decided: true };
    var gid = slot.w || slot.l;
    var g = TOURNAMENT[div].games[gid];
    var kind = slot.w ? "Winner" : "Loser";
    var fallback = kind + " of Game " + g.n;
    var side = winnerSide(div, gid);
    if (!side) return { team: null, label: fallback, decided: false };
    var target = slot.w ? side : (side === "a" ? "b" : "a");
    var r = resolveSlot(div, g[target]);
    return { team: r.team, label: r.team || fallback, decided: r.team != null };
  }

  function participants(div, gid) {
    var g = TOURNAMENT[div].games[gid];
    return { a: resolveSlot(div, g.a), b: resolveSlot(div, g.b) };
  }
  function teamFor(div, gid, which) { // which: 'w' | 'l'
    var side = winnerSide(div, gid);
    if (!side) return null;
    var s = which === "w" ? side : (side === "a" ? "b" : "a");
    return resolveSlot(div, TOURNAMENT[div].games[gid][s]).team;
  }
  function isPlayable(div, gid) {
    var p = participants(div, gid);
    return p.a.decided && p.b.decided;
  }

  // The game a team advances to after gid (resKey 'w' winner / 'l' loser), or null.
  function destOf(div, gid, resKey) {
    var games = TOURNAMENT[div].games;
    for (var id in games) {
      var g = games[id];
      if ((g.a && g.a[resKey] === gid) || (g.b && g.b[resKey] === gid)) return id;
    }
    return null;
  }

  /* ---------- Memorial helpers (for the scenario planner) ---------- */
  function memorialSideAt(div, gid, arrival) {
    // arrival: null (seeded) or {from:gid, res:'W'|'L'}
    var g = TOURNAMENT[div].games[gid];
    var sides = ["a", "b"], i, s;
    for (i = 0; i < 2; i++) {
      s = g[sides[i]];
      if (!s) continue;
      if (!arrival) { if (s.seed && norm(s.seed) === "memorial") return sides[i]; }
      else { var key = arrival.res === "W" ? "w" : "l"; if (s[key] === arrival.from) return sides[i]; }
    }
    return "a";
  }
  function opponentAt(div, gid, arrival) {
    var ms = memorialSideAt(div, gid, arrival);
    var other = ms === "a" ? "b" : "a";
    return resolveSlot(div, TOURNAMENT[div].games[gid][other]);
  }

  // Memorial's locked-in path from real results: [{gid, side, res, score}], stops at first unplayed game.
  function memorialActualPath(div) {
    var path = [], gid = TOURNAMENT[div].seedGame, arrival = null, guard = 0;
    while (gid && guard++ < 40) {
      var side = memorialSideAt(div, gid, arrival);
      var ws = winnerSide(div, gid);
      if (!ws) break;
      var res = ws === side ? "W" : "L";
      path.push({ gid: gid, side: side, res: res, score: getScore(div, gid) });
      var next = destOf(div, gid, res === "W" ? "w" : "l");
      arrival = { from: gid, res: res };
      gid = next;
    }
    return path;
  }

  global.Tournament = {
    DATA: TOURNAMENT,
    getScore: getScore, setScore: setScore, clearDivision: clearDivision, clearAll: clearAll,
    getGcLinks: getGcLinks, setGcLink: setGcLink, exportData: exportData,
    downloadScores: downloadScores, canShareScores: canShareScores, shareScores: shareScores,
    loadPublished: loadPublished, isEdited: isEdited,
    winnerSide: winnerSide, resolveSlot: resolveSlot, participants: participants,
    teamFor: teamFor, isPlayable: isPlayable, destOf: destOf,
    memorialSideAt: memorialSideAt, opponentAt: opponentAt, memorialActualPath: memorialActualPath
  };
})(typeof window !== "undefined" ? window : this);
