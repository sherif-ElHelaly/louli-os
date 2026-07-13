// ═══ Louli OS — build configuration ═══
//
// DEV_MODE = true  → the Admin panel (🛠 in the status bar) is available so HE
//                    can author every piece of content: daily notes, letters,
//                    fortunes, memories, coupons, photos, voice notes, secrets.
// DEV_MODE = false → FINAL BUILD for her. The admin panel is completely removed.
//                    Before flipping this, open Admin → Data → "export content"
//                    and paste the result into js/content-baked.js (see README).
//
const DEV_MODE = false;

// PIN for the Doctor Suite — "our day", MMDD of the anniversary (Dec 18).
const DOCTOR_PIN = "1218";

// The longest stretch apart: days from army entry until the first vacation.
const FIRST_STRETCH_DAYS = 45;

// Night mode hours (auto): night from 20:00 to 06:59.
const NIGHT_FROM = 20, NIGHT_TO = 7;
