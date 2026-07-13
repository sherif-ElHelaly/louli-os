# Louli OS 💌

A private iPad app for Louli — part daily companion, part doctor's toolkit, part love letter.
Zero dependencies, no build step, no network needed after first load. Everything she does is
saved on the device (localStorage + IndexedDB for photos/voice).

## Run it

It's a static site — any static server works:

```
cd app
python -m http.server 8000        # or: npx serve .
```

Open `http://<your-ip>:8000` on the iPad in Safari.

**On her iPad, do this once:** open the app in Safari → Share → **Add to Home Screen**.
That gives it a full-screen icon *and* protects the saved data from Safari's 7-day
cleanup of ordinary website storage. For real day-to-day use, host it somewhere always
reachable (any static host works — the app itself never phones home).

## Dev build vs final build

You are holding the **dev build** (`DEV_MODE = true` in `js/config.js`).
The 🛠 button in the status bar opens **Admin — Sheifo's desk**, where you author everything:

| Admin tab | What you write there |
|---|---|
| 🕐 Timeline | Time-travel (test any date), entry date, home-for-good date |
| ✍️ Note pools | Daily notes, comfort notes, fortunes, gratitude prompts (one per line) |
| 📦 Collections | Sealed letters (+ unlock dates), open-when envelopes, milestones, coupons, constellation stars, weekly questions, pharma entries |
| 📷🎙 Media | Upload vault photos, record/upload voice notes |
| 🤫 Secrets | Heart secret (❤️ ×5), moon secret (moon ×3), monthly anniversary message |
| 💾 Data | Export content / full backup / restore / reset |

### Shipping the final build (admin removed)

1. Write everything in Admin. Aim for **45+ daily notes** and **45+ fortunes** so the
   first stretch never repeats.
2. Admin → Data → **export content 📦** → downloads `louli-content-….json`.
3. Paste that JSON into `js/content-baked.js` (instructions inside the file).
4. Set `DEV_MODE = false` in `js/config.js`.
5. **Photos/voice note:** media lives in the browser's IndexedDB, not in the JSON.
   To move it to her iPad, take a **full backup** (Admin → Data) on your machine and
   **restore** it once on her iPad (Settings → restore from backup). After that it's local to her device.
6. Wipe your test data before handing it over (Admin → Data → wipe EVERYTHING), or
   just deploy fresh — her first launch runs the one-time setup where she enters your entry date.

## How the countdown works

- First-run setup asks her for your **army entry date** (one time).
- The first visit is auto-set to **entry + 45 days** (`FIRST_STRETCH_DAYS` in config).
- The countdown, journey bar, jar and milestones all track the **current stretch**
  (last visit → next visit). After each visit, she adds the next date in ⚙️ Settings.
- If a "home for good" date is set, it's used when no visit is scheduled.

## Odds & ends

- Doctor Suite PIN: `1218` (your day, MMDD) — `DOCTOR_PIN` in config.
- Fonts load from Google Fonts on first visit, then cache. If she'll be fully offline,
  download Quicksand + Caveat and self-host them in `css/`.
- Backups: Settings → "download backup file" bundles her data **and** all media into
  one JSON. Nag her (lovingly) to do it monthly.
