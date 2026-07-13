// Louli OS — sample content. Loaded as a plain script; exposes window.LOULI_DATA.
// All medical entries are MOCK data for a design prototype. Brand names are invented.
window.LOULI_DATA = {

  dates: {
    departure: "2026-07-20",
    homecoming: "2027-10-20",
    anniversaryDay: 18,          // monthly, since 2025-12-18
    birthday: "2027-04-25"
  },

  // ————— HIM: daily surprise notes (pool, one per day) —————
  dailyNotes: [
    "Good morning, [NICKNAME]. Somewhere far away I just thought about the way you laugh at your own jokes before the punchline. Have a soft day.",
    "Reminder from me to you: you have saved actual human lives and you still get shy about ordering pizza on the phone. I adore you.",
    "If today is heavy, put it down for one minute and drink some water. Doctor's orders. (I outrank you, I'm the boyfriend.)",
    "I hid a kiss in this note. It's invisible. It's on your forehead. It has already landed.",
    "Thinking about the night we cooked [GENERIC MEMORY: the pasta disaster] and ate cereal at midnight instead. Best dinner of my life.",
    "You are exactly one day closer to me being home and annoying you in person. Hold on.",
    "Study tip: read one page, then imagine me clapping. Repeat. You'll be a professor by spring.",
    "The moon tonight is mine, the sun today is yours. We'll split the sky until I'm back."
  ],

  // ————— HIM: comfort pool (for hard days) —————
  comfortNotes: [
    "Hey. Come here. Whatever happened today, it doesn't get to define you. You're the person who shows up — that's rarer than you think. Breathe with me: in… out. I love you on your worst day exactly as much as your best.",
    "Bad shifts end. They always end. Wash your face, put on the soft socks, and let today be over. You did enough. You ARE enough. I'm proud of you in a way I can't fit into a note.",
    "If I were there I'd make you tea, say nothing, and let you talk or not talk. Pretend this note is that. I'm sitting with you right now, [NICKNAME]. You're not alone in this year — not for one single day.",
    "You chose the hardest, kindest job in the world. Some days it will break your heart. Let it — that's the proof you're good at it. Then come back tomorrow. I believe in you more than I believe in gravity."
  ],

  // ————— HIM: time-locked letters —————
  letters: [
    { id: "l1", title: "Two weeks in", unlockDate: "2026-08-01", sealed: false,
      body: "My [NICKNAME],\n\nTwo weeks. You made it through the worst part — the part where the apartment is too quiet and you keep almost texting me about nothing. Keep almost-texting me. Write it in the journal, I'll read every word when I'm home.\n\nI wrote this letter sitting on the floor of the living room while you were on a night shift, and I already missed you then, before I even left. That's how ahead of schedule my missing you is.\n\nAll of me,\n— Your boy" },
    { id: "l2", title: "For a hundred days", unlockDate: "2026-10-28", sealed: true },
    { id: "l3", title: "Our first anniversary apart", unlockDate: "2026-12-18", sealed: true },
    { id: "l4", title: "New year, half of it mine", unlockDate: "2027-01-01", sealed: true },
    { id: "l5", title: "Halfway. Downhill from here", unlockDate: "2027-03-06", sealed: true },
    { id: "l6", title: "Happy birthday, my love", unlockDate: "2027-04-25", sealed: true },
    { id: "l7", title: "The night before I'm home", unlockDate: "2027-10-19", sealed: true }
  ],

  // ————— HIM: open-when envelopes —————
  openWhen: [
    { id: "ow1", label: "open when you miss me", opened: true,
      body: "Of course you miss me. I'm very missable. But listen — missing someone is just love with nowhere to go for a while. Put it here, in this envelope, in the journal, in the bucket list. I'm collecting all of it when I'm back, with interest." },
    { id: "ow2", label: "open when you had a brutal shift", opened: false,
      body: "Take off the badge. You're not Doctor anyone right now, you're just mine. Order the good food. Watch something dumb. The hospital took twelve hours of you — it does NOT get the evening too." },
    { id: "ow3", label: "open after your first delivery", opened: false,
      body: "YOU DID IT. Somewhere in the world a whole new person's first-ever minutes had YOUR hands in them. I have goosebumps writing this in the past, imagining it. Tell me everything in the journal. Every detail. I want to celebrate this twice — now, and again when I'm home." },
    { id: "ow4", label: "open when you can't sleep", opened: false,
      body: "Hi, night owl. Warm milk, one boring documentary, phone face-down. Imagine my arm over you — the heavy one you complain about and then pull closer. I'm sleeping badly too, if it helps. We'll be tired together." },
    { id: "ow5", label: "open when you're angry at me", opened: false,
      body: "Fair. I'm probably guilty. I accept full responsibility for whatever I did in your dream or memory. For the record: you're right, I'm sorry, and I'll say it again in person with snacks." },
    { id: "ow6", label: "open before a big exam", opened: false,
      body: "You have never once walked into an exam and not walked out annoyed that you 'definitely failed' — and then passed beautifully. This is that, again. Go be brilliant. I already know how this story ends." },
    { id: "ow7", label: "open when something amazing happened", opened: false,
      body: "TELL ME EVERYTHING. Okay you can't. WRITE ME EVERYTHING. I'm so happy right now and I don't even know why yet. That's the deal with us — your joy is mine, even on delay." },
    { id: "ow8", label: "open on a completely ordinary day", opened: false,
      body: "No occasion. That's the point. I loved you on thousands of completely ordinary days and I plan to love you on thousands more. This envelope is just me waving at you across a normal Tuesday." }
  ],

  // ————— HIM: milestones —————
  milestones: [
    { day: 30,  title: "One month strong",   reward: "A voice clip: 'thirty days of missing you' + a photo I never showed you." },
    { day: 60,  title: "Two months",         reward: "The story of how I almost told you I loved you three weeks too early." },
    { day: 100, title: "Triple digits",      reward: "Letter unlock + a coupon: 'one entire day, you decide everything'." },
    { day: 229, title: "HALFWAY",            reward: "The big one. Video message + the halfway letter + confetti forever." },
    { day: 300, title: "Day 300",            reward: "A list: 300 tiny things I love about you. Yes, all three hundred." },
    { day: 365, title: "One full year",      reward: "Our year in numbers — every note read, cookie cracked, star visited." },
    { day: 457, title: "HOME",               reward: "Me. At the door. This one doesn't need an app." }
  ],

  // ————— HIM: coupon book —————
  coupons: [
    { id: "c1", label: "One massage, zero complaints", note: "Redeemable even at 2am", redeemed: false },
    { id: "c2", label: "Date night — your pick", note: "Yes, even the period drama", redeemed: false },
    { id: "c3", label: "I cook, you watch", note: "Kitchen chaos included", redeemed: true, redeemedOn: "2026-08-02" },
    { id: "c4", label: "Breakfast in bed", note: "Crumbs forgiven in advance", redeemed: false },
    { id: "c5", label: "One 'I was wrong' — no rebuttal", note: "Extremely rare. Spend wisely", redeemed: false },
    { id: "c6", label: "A whole Saturday, phone off", note: "Just us", redeemed: false },
    { id: "c7", label: "Bookstore trip, no budget", note: "I carry the bags", redeemed: false },
    { id: "c8", label: "Slow dance in the kitchen", note: "Song of your choosing", redeemed: false }
  ],

  // ————— HIM: memory constellation —————
  memories: [
    { id: "m1", x: 18, y: 26, size: 3, name: "First date", story: "You ordered the same thing as me because you panicked, then spent the night stealing my fries anyway. I knew right then. [GENERIC MEMORY — replace with ours]" },
    { id: "m2", x: 34, y: 14, size: 2, name: "The trip",   story: "Wrong bus, right city. We got gloriously lost and you navigated us home with a paper map and pure stubbornness. My hero." },
    { id: "m3", x: 51, y: 30, size: 3, name: "The inside joke", story: "I can't even write it here in case someone sees. You know the one. I'm laughing right now, wherever I am." },
    { id: "m4", x: 66, y: 18, size: 2, name: "White coat day", story: "You, in the coat, trying not to cry. Me, no coat, definitely crying. Proudest day of MY life and it wasn't even mine." },
    { id: "m5", x: 80, y: 32, size: 2, name: "The blackout", story: "Power went out for six hours and we lit every candle we owned and played cards by phone-light. Best six hours ever recorded." },
    { id: "m6", x: 25, y: 48, size: 2, name: "First 'I love you'", story: "You said it first. You deny this. This star is my permanent evidence, twinkling smugly forever." },
    { id: "m7", x: 44, y: 56, size: 3, name: "The midnight pancakes", story: "Post-night-shift, 3am, you texted 'pancakes?' and I was in the kitchen before I was awake. We ate them on the floor." },
    { id: "m8", x: 62, y: 47, size: 2, name: "Rooftop rain", story: "We watched the storm come in and stayed exactly forty seconds too long. Soaked. Worth it. You laughing in the rain lives in my head rent-free." },
    { id: "m9", x: 75, y: 60, size: 2, name: "The plant we didn't kill", story: "Against every odd, Gerald the fern lives. Water him. He's our firstborn." },
    { id: "m10", x: 33, y: 70, size: 2, name: "Anniversary #1", story: "Dec 18. You wore the blue dress. I forgot every word I'd rehearsed and said something dumb instead, and you said 'perfect'. It was." }
  ],

  // ————— HIM: fortune cookie jar —————
  fortunes: [
    "You will receive an extremely enthusiastic hug in the future. Source: me.",
    "A nap is in your stars today. Take it. This is legally binding.",
    "The exam fears YOU.",
    "Someone thinks you're the smartest person in the room. He's far away but he's very loud about it.",
    "Lucky numbers: 18, 25, 457. You know why.",
    "Today's forecast: 100% chance of being loved.",
    "Fortune says: text his mom back, she misses you too.",
    "You will find something you lost. Probably the lip balm. It's in the coat.",
    "A stranger's day will be better because of you. Occupational hazard of being you.",
    "Cookie wisdom: the couch, the blanket, episode seven. Tonight.",
    "He is thinking about you right now. (This fortune is always true.)",
    "Great fortune arrives on the 18th of every month.",
  ],

  // ————— HIM: shared bucket list (starts empty — she adds her own) —————
  bucketList: [],

  // ————— HIM: weekly questions (answer-for-later journal) —————
  weeklyQuestions: [
    { week: 1, q: "What made you laugh this week?", answered: true },
    { week: 2, q: "What's one thing you learned at the hospital that amazed you?", answered: true },
    { week: 3, q: "If I'd been home this week, what would we have done on Sunday?", answered: true },
    { week: 4, q: "What are you proud of this week — hospital or not?", answered: false },
    { week: 5, q: "Describe your week as a weather report.", answered: false }
  ],

  // ————— HIM: vault (photos + voice) —————
  vault: {
    photos: [
      { id: "p1", caption: "The rooftop, right before the rain" },
      { id: "p2", caption: "You + Gerald the fern, day one" },
      { id: "p3", caption: "Midnight pancakes, exhibit A" },
      { id: "p4", caption: "The blue dress. Dec 18." },
      { id: "p5", caption: "White coat ceremony" },
      { id: "p6", caption: "Us, ordinary Tuesday, my favorite" }
    ],
    voice: [
      { id: "v1", label: "good morning", length: "0:19" },
      { id: "v2", label: "good night", length: "0:24" },
      { id: "v3", label: "you can do this", length: "0:31" },
      { id: "v4", label: "just my laugh, for emergencies", length: "0:08" }
    ]
  },

  // ————— DOCTOR: case log (mock) —————
  cases: [
    { id: "k3", date: "2026-08-09", complaint: "G2P1 at 39+2, contractions", dx: "Spontaneous labor", outcome: "SVD, healthy infant 3.4kg", tags: ["OB", "L&D"], notes: "Assisted delivery. Placenta check, estimated blood loss ~300ml. The moment never gets old." }
  ],

  // ————— DOCTOR: pharma lookup (mock, ~30 entries) —————
  // All names invented. Structure: active ingredient → brands.
  pharma: [
    { ing: "Ferrous sulfate", cls: "Iron supplement", brands: ["Ferrolight", "Hemabor 80"], form: "Tablet, syrup", conditions: ["iron deficiency anemia", "anemia in pregnancy"], note: "Take with vitamin C, away from tea/coffee. GI upset common — consider alternate-day dosing." },
    { ing: "Ferric carboxymaltose", cls: "Iron supplement (IV)", brands: ["Ferinvia IV"], form: "IV infusion", conditions: ["iron deficiency anemia", "intolerance to oral iron"], note: "For oral-iron failures or 3rd-trimester rapid repletion. Watch for hypophosphatemia." },
    { ing: "Folic acid", cls: "Vitamin", brands: ["Folivera", "Natafol 5"], form: "Tablet", conditions: ["neural tube defect prevention", "pregnancy supplementation"], note: "400µg routine; 5mg high-risk (prior NTD, antiepileptics, diabetes)." },
    { ing: "Labetalol", cls: "Antihypertensive (β/α-blocker)", brands: ["Presolab", "Labetol 100"], form: "Tablet, IV", conditions: ["hypertension in pregnancy", "preeclampsia"], note: "First-line in pregnancy. Avoid in asthma. IV for urgent control." },
    { ing: "Methyldopa", cls: "Antihypertensive (central)", brands: ["Domet 250"], form: "Tablet", conditions: ["hypertension in pregnancy"], note: "Long safety record; slower onset. Watch sedation, LFTs." },
    { ing: "Nifedipine (ER)", cls: "Antihypertensive (CCB)", brands: ["Nifedra XL"], form: "ER tablet", conditions: ["hypertension in pregnancy", "tocolysis"], note: "Oral option for severe-range BP per protocol; also used off-label for tocolysis." },
    { ing: "Hydralazine", cls: "Antihypertensive (vasodilator)", brands: ["Hydravex IV"], form: "IV", conditions: ["severe hypertension in pregnancy"], note: "IV bolus for severe-range pressures; watch reflex tachycardia." },
    { ing: "Magnesium sulfate", cls: "Anticonvulsant (obstetric)", brands: ["MagnoSafe"], form: "IV infusion", conditions: ["eclampsia prophylaxis", "severe preeclampsia", "fetal neuroprotection"], note: "Loading + maintenance; monitor reflexes, RR, urine output. Calcium gluconate = antidote." },
    { ing: "Nitrofurantoin", cls: "Antibiotic (urinary)", brands: ["Uroniva", "Nitrofur 100"], form: "Capsule", conditions: ["UTI", "cystitis in pregnancy"], note: "Avoid at term (36+ wks) and in G6PD deficiency." },
    { ing: "Cephalexin", cls: "Antibiotic (1st-gen cephalosporin)", brands: ["Cefalor 500"], form: "Capsule, suspension", conditions: ["UTI", "mastitis", "skin infection"], note: "Pregnancy-compatible workhorse. QID dosing hurts adherence — counsel." },
    { ing: "Ceftriaxone", cls: "Antibiotic (3rd-gen cephalosporin)", brands: ["Triaxol IV"], form: "IV/IM", conditions: ["pyelonephritis", "gonorrhea", "PID (inpatient)"], note: "IM single dose for GC (+doxy for chlamydia coverage outside pregnancy)." },
    { ing: "Azithromycin", cls: "Antibiotic (macrolide)", brands: ["Azivera", "Zithrolan"], form: "Tablet", conditions: ["chlamydia", "chlamydia in pregnancy"], note: "1g single dose. Test-of-cure at 4 wks in pregnancy." },
    { ing: "Metronidazole", cls: "Antibiotic/antiprotozoal", brands: ["Metrogyl-F", "Vagizol gel"], form: "Tablet, vaginal gel", conditions: ["bacterial vaginosis", "trichomoniasis"], note: "Oral or PV for BV. No alcohol during course. Treat partner for trich." },
    { ing: "Clindamycin", cls: "Antibiotic (lincosamide)", brands: ["Clindora cream"], form: "Vaginal cream, capsule", conditions: ["bacterial vaginosis", "GBS (penicillin allergy)"], note: "Cream weakens latex condoms. Check GBS sensitivities in allergy cases." },
    { ing: "Amoxicillin–clavulanate", cls: "Antibiotic (penicillin combo)", brands: ["Amoclave 625"], form: "Tablet", conditions: ["UTI", "PPROM (protocol)", "endometritis step-down"], note: "Avoid as tocolysis-adjacent choice where NEC risk debated — follow local PPROM protocol." },
    { ing: "Aciclovir", cls: "Antiviral", brands: ["Herpavir 400"], form: "Tablet", conditions: ["genital herpes", "HSV suppression in pregnancy"], note: "Suppression from 36 wks to reduce cesarean-for-lesions." },
    { ing: "Fluconazole", cls: "Antifungal (oral)", brands: ["Flucoral 150"], form: "Capsule", conditions: ["vaginal candidiasis"], note: "Single 150mg dose. Prefer topicals in pregnancy, esp. 1st trimester." },
    { ing: "Clotrimazole", cls: "Antifungal (topical)", brands: ["Candilex PV"], form: "Pessary, cream", conditions: ["vaginal candidiasis", "candidiasis in pregnancy"], note: "First choice in pregnancy — 7-day course beats single dose." },
    { ing: "Ondansetron", cls: "Antiemetic (5-HT3)", brands: ["Onsera ODT"], form: "ODT, IV", conditions: ["hyperemesis gravidarum", "nausea and vomiting of pregnancy"], note: "Second-line after doxylamine-pyridoxine per most guidance." },
    { ing: "Doxylamine + pyridoxine", cls: "Antiemetic (combo)", brands: ["Nauselle B6"], form: "DR tablet", conditions: ["nausea and vomiting of pregnancy"], note: "First-line NVP. Sedation — dose at night first." },
    { ing: "Levonorgestrel", cls: "Emergency contraception / IUS", brands: ["Postella One", "Lunaris IUS"], form: "Tablet (EC), IUS", conditions: ["emergency contraception", "contraception", "heavy menstrual bleeding"], note: "EC within 72h (sooner = better). IUS also first-line for HMB." },
    { ing: "Ulipristal acetate", cls: "Emergency contraception (SPRM)", brands: ["Ellavue 30"], form: "Tablet", conditions: ["emergency contraception"], note: "Effective to 120h. Delay restarting hormonal contraception 5 days." },
    { ing: "Ethinylestradiol + levonorgestrel", cls: "Combined oral contraceptive", brands: ["Lovelle 20", "Cyclessa-LN"], form: "Tablet", conditions: ["contraception", "dysmenorrhea", "cycle regulation"], note: "Screen MEC contraindications: migraine w/ aura, VTE, smoking 35+." },
    { ing: "Desogestrel", cls: "Progestogen-only pill", brands: ["Solesse POP"], form: "Tablet", conditions: ["contraception", "contraception while breastfeeding"], note: "12-hour missed-pill window (vs 3h traditional POP)." },
    { ing: "Medroxyprogesterone acetate", cls: "Progestogen (depot)", brands: ["Depovia 150"], form: "IM injection", conditions: ["contraception", "endometriosis"], note: "Q12wk. Counsel on bone density with long use + return-to-fertility delay." },
    { ing: "Norethisterone", cls: "Progestogen", brands: ["Norlune 5"], form: "Tablet", conditions: ["heavy menstrual bleeding", "period delay", "endometriosis"], note: "TID for HMB rescue; not a contraceptive at this dose." },
    { ing: "Tranexamic acid", cls: "Antifibrinolytic", brands: ["Hemostat-TX", "Traxenda 500"], form: "Tablet, IV", conditions: ["heavy menstrual bleeding", "postpartum hemorrhage"], note: "Non-hormonal HMB option, days of bleeding only. IV early in PPH." },
    { ing: "Oxytocin", cls: "Uterotonic", brands: ["Oxytal IV"], form: "IV infusion, IM", conditions: ["labor induction", "postpartum hemorrhage prevention"], note: "Active management of 3rd stage. Titrate infusion per protocol." },
    { ing: "Misoprostol", cls: "Prostaglandin E1", brands: ["Misovel 200"], form: "Tablet (oral/PV/SL)", conditions: ["cervical ripening", "medical management of miscarriage", "postpartum hemorrhage"], note: "Route & dose vary sharply by indication — always check protocol card." },
    { ing: "Dinoprostone", cls: "Prostaglandin E2", brands: ["Cervigel E2"], form: "Vaginal gel/insert", conditions: ["cervical ripening", "labor induction"], note: "CTG before and after. Insert removable if hyperstimulation." },
    { ing: "Betamethasone", cls: "Corticosteroid (antenatal)", brands: ["Betacort IM"], form: "IM injection", conditions: ["fetal lung maturation", "preterm labor"], note: "2 doses 24h apart, 24–34 wks when delivery expected within 7 days." },
    { ing: "Levothyroxine", cls: "Thyroid hormone", brands: ["Thyrolan 50"], form: "Tablet", conditions: ["hypothyroidism in pregnancy"], note: "Requirements rise ~30% in pregnancy — recheck TSH each trimester." },
    { ing: "Aspirin (low-dose)", cls: "Antiplatelet", brands: ["Cardiprin 75"], form: "Tablet", conditions: ["preeclampsia prophylaxis"], note: "75–150mg nightly from 12 wks for high-risk patients." }
  ],

  // ————— DOCTOR: shifts (keyed by ISO date) —————
  shifts: {
    "2026-08-09": { type: "day" }
  },
  rotation: "OB — Labor & Delivery",

  // ————— DOCTOR: procedure logbook —————
  procedures: [
    { name: "Vaginal delivery", observed: 6, assisted: 4, performed: 1 }
  ],

  // ————— DOCTOR: study & exams —————
  exams: [
    { id: "e1", name: "OB/GYN Board — Step 1", date: "2026-11-12", topics: [
      { t: "Menstrual cycle physiology", done: true, review: "2026-08-16" },
      { t: "Hypertensive disorders of pregnancy", done: false, review: null },
      { t: "Contraception & MEC categories", done: false, review: null }
    ]}
  ],

  // ————— JOURNAL: entries + moods —————
  journal: [
    { date: "2026-08-12", mood: 5, title: "A good save", text: "The threatened miscarriage from Tuesday — repeat scan showed a heartbeat. I got to tell her. She cried, I nearly did. THIS is why.", gratitude: "Heartbeats." }
  ],
  moodHistory: {
    "2026-08-12": 5
  },
  gratitudePrompts: [
    "One tiny thing that went right today?",
    "Who made your day 1% better?",
    "Something your hands did well today?",
    "What did you taste, hear, or smell that you'd keep?"
  ],

  // ————— HOBBIES —————
  books: [
    { id: "bk1", title: "The Midnight Ward", author: "A. Harlow", status: "reading", progress: 62, quote: "We are all just walking each other home." }
  ],
  readingGoal: { year: 24, done: 0 },
  recipes: [
    { id: "r4", name: "Shakshuka, extra spicy", tag: "solo", status: "made", note: "Made it through a whole night-shift week. MVP recipe.", rating: 4 }
  ],
  shows: [
    { id: "s1", title: "The Residency", type: "show", status: "watching", note: "S2E7. Painfully accurate. Watching 'for research'." }
  ],
  workouts: [
    { date: "2026-08-12", type: "Lower body — glutes", note: "Hip thrusts 3×10, glute bridges, walking lunges" }
  ],
  personalRecords: [
    { name: "Squat", value: "50 kg" }
  ],
  habits: [
    { id: "h1", name: "Water", emoji: "💧", unit: "glasses", goal: 8, today: 0, streak: 0 },
    { id: "h2", name: "Sleep 7h+", emoji: "😴", unit: "", goal: 1, today: 0, streak: 0 },
    { id: "h3", name: "Walk outside", emoji: "🚶‍♀️", unit: "", goal: 1, today: 0, streak: 0 },
    { id: "h4", name: "Self-care moment", emoji: "🛁", unit: "", goal: 1, today: 0, streak: 0 }
  ],

  // ————— Easter eggs —————
  moonSecret: "You found it. Of course you found it — you always read the whole chart. This note has been waiting in the moon since the day I left. I love you past this moon and back. Tap it any night you need me. — hidden note #1 of ?",
  heartSecret: "A secret for the curious: check the coupon book on the 18th of any month. Something extra appears. (Also: I love you. That's not a secret, but it bears repeating.)"
};
