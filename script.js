// ==========================================
// YETERLİ - Minimal Öneri Sistemi
// ==========================================

// ==========================================
// İÇERİK HAVUZLARI - İLK ÖNERİ (Soru 1 sonrası)
// ==========================================

// HAVUZ A — DURUM / FARKINDALIK (başlangıç)
const HAVUZ_A = [
  "Şu an biraz yavaş hissediyor olabilirsin.",
  "Zihnin dağınık olabilir.",
  "Bugün ağır ilerliyor gibi.",
  "Şu an net hissetmemen normal.",
  "Bir süredir duraksamış olabilirsin.",
  "Düşünceler üst üste binmiş olabilir.",
  "Şu an her şey açık olmak zorunda değil.",
  "Bugün biraz bulanık başlayabilir.",
  "Kendinle aranda küçük bir mesafe var gibi.",
  "Şu an acele eden bir şey yok.",
];

// HAVUZ B — YAKLAŞIM / YUMUŞATMA (köprü)
const HAVUZ_B = [
  "Bunun için bir şey yapman gerekmiyor.",
  "Şu an çözmeye çalışmak zorunda değilsin.",
  "Bu hâl geçici olabilir.",
  "Burada durmak da bir seçenek.",
  "Kendine yüklenmeden kalabilirsin.",
  "Bir adım atman şart değil.",
  "Olduğu gibi kalmasına izin verebilirsin.",
  "Şu an yeterince buradasın.",
  "Bir şey eksik yapmıyorsun.",
  "Bu an kendi hızında akabilir.",
];

// HAVUZ C — MİKRO SEÇENEK / AÇIK UÇ (kapanış)
const HAVUZ_C = [
  "İstersen sadece etrafına bak.",
  "İstersen birkaç nefes al.",
  "İstersen hiçbir şeye dokunma.",
  "İstersen küçük bir hareket yap.",
  "İstersen oturduğun yerde kal.",
  "İstersen düşüncelerini serbest bırak.",
  "İstersen sadece burada kal.",
  "İstersen ekrana bakmayı bırak.",
  "İstersen bir şey yapmadan bekle.",
  "İstersen bu anın geçmesine izin ver.",
];

// Cevaplara göre havuz filtreleri (index numaraları)
// Her cevap için A, B, C havuzlarından uygun öğeler seçilir

// Cevap grupları (yeni sistem)
const AGIR_GRUBU = ["yorgun", "bunalmis", "huzursuz", "bos", "isteksiz"]; // 🔴 dinlenmeli öncelik
const ZIHINSEL_GRUBU = ["kararsiz", "odaklanamiyorum"]; // 🟡 denge
const GERILIM_GRUBU = ["sikiSmis", "gergin"]; // 🟢 hareketli öncelik
const NOTR_GRUBU = ["normal"]; // ⚪ özel durum

// 2. soru için B ve C havuzu filtreleri (gruba göre)
const GRUP_FILTRELERI = {
  // 🔴 AĞIR: B yumuşatılır, C kapatıcı
  agir: {
    B: [0, 1, 2, 6], // dur, hızını düşür, ara ver, nefesine odaklan
    C: [0, 2, 8], // bu kadarı yeter, şimdilik bu, bugünlük yeter
  },
  // 🟡 ZİHİNSEL: B orta, C nötr
  zihinsel: {
    B: [3, 1, 7], // küçük bir adım at, yer değiştir, ellerini hareket ettir (HAREKETLI'den)
    C: [2, 7, 4], // yeterli, tamam, sonra bakarsın
  },
  // 🟢 GERİLİM: B aktif-kısa, C nötr/devam
  gerilim: {
    B: [0, 2, 5], // ayağa kalk, bedenini hareket ettir, bulunduğun alanı değiştir (HAREKETLI'den)
    C: [3, 2, 9], // buradan ilerle, yeterli, tamam
  },
  // ⚪ NÖTR: B orta, C nötr (2. soru sorulmaz ama fallback)
  notr: {
    B: [3, 7, 8], // küçük bir adım at, ellerini hareket ettir, nefesini derinleştir
    C: [2, 9, 4], // yeterli, tamam, sonra bakarsın
  },
};

const HAVUZ_FILTRELERI = {
  // 🔴 AĞIR GRUP CEVAPLARI
  yorgun: {
    A: [0, 2, 3, 4, 9], // yavaş, ağır, net değil, duraksamış, acele yok
    B: [2, 3, 5, 7, 9], // geçici, durmak, adım şart değil, yeterince, kendi hızında
    C: [1, 4, 6, 8, 9], // nefes, otur, burada kal, bekle, geçmesine izin ver
  },
  bunalmis: {
    A: [0, 5, 6, 7, 8], // yavaş, üst üste, açık olmak zorunda değil, bulanık, mesafe
    B: [0, 1, 2, 4, 8], // yapman gerekmiyor, çözme, geçici, yüklenmeden, eksik yapmıyorsun
    C: [1, 2, 5, 6, 9], // nefes, dokunma, serbest bırak, burada kal, geçmesine izin ver
  },
  huzursuz: {
    A: [3, 6, 7, 8, 9], // net değil, açık olmak zorunda değil, bulanık, mesafe, acele yok
    B: [2, 3, 6, 7, 9], // geçici, durmak, izin ver, yeterince, kendi hızında
    C: [1, 2, 4, 6, 8], // nefes, dokunma, otur, burada kal, bekle
  },
  bos: {
    A: [0, 3, 4, 8, 9], // yavaş, net değil, duraksamış, mesafe, acele yok
    B: [2, 3, 6, 8, 9], // geçici, durmak, izin ver, eksik yapmıyorsun, kendi hızında
    C: [2, 4, 6, 8, 9], // dokunma, otur, burada kal, bekle, geçmesine izin ver
  },
  isteksiz: {
    A: [0, 3, 6, 8, 9], // yavaş, net değil, açık olmak zorunda değil, mesafe, acele yok
    B: [0, 2, 5, 8, 9], // yapman gerekmiyor, geçici, adım şart değil, eksik yapmıyorsun, kendi hızında
    C: [2, 4, 6, 8, 9], // dokunma, otur, burada kal, bekle, geçmesine izin ver
  },
  // 🟢 HAREKETE YAKIN CEVAPLAR
  kararsiz: {
    A: [1, 3, 6, 7, 8], // dağınık, net değil, açık olmak zorunda değil, bulanık, mesafe
    B: [2, 3, 6, 8, 9], // geçici, durmak, izin ver, eksik yapmıyorsun, kendi hızında
    C: [0, 1, 3, 5, 7], // etrafına bak, nefes, hareket, serbest bırak, ekrana bakma
  },
  odaklanamiyorum: {
    A: [1, 5, 7, 8, 9], // dağınık, üst üste, bulanık, mesafe, acele yok
    B: [0, 3, 5, 7, 8], // yapman gerekmiyor, durmak, adım şart değil, yeterince, eksik yapmıyorsun
    C: [0, 1, 3, 5, 7], // etrafına bak, nefes, hareket, serbest bırak, ekrana bakma
  },
  sikiSmis: {
    A: [0, 2, 5, 6, 8], // yavaş, ağır, üst üste, açık olmak zorunda değil, mesafe
    B: [0, 1, 4, 6, 8], // yapman gerekmiyor, çözme, yüklenmeden, izin ver, eksik yapmıyorsun
    C: [1, 3, 5, 6, 9], // nefes, hareket, serbest bırak, burada kal, geçmesine izin ver
  },
  gergin: {
    A: [0, 6, 7, 8, 9], // yavaş, açık olmak zorunda değil, bulanık, mesafe, acele yok
    B: [2, 4, 6, 7, 9], // geçici, yüklenmeden, izin ver, yeterince, kendi hızında
    C: [1, 3, 4, 5, 8], // nefes, hareket, otur, serbest bırak, bekle
  },
  normal: {
    A: [3, 6, 7, 8, 9], // net değil, açık olmak zorunda değil, bulanık, mesafe, acele yok
    B: [2, 3, 6, 8, 9], // geçici, durmak, izin ver, eksik yapmıyorsun, kendi hızında
    C: [0, 1, 3, 6, 7], // etrafına bak, nefes, hareket, burada kal, ekrana bakma
  },
};

// ==========================================
// İÇERİK HAVUZLARI - SON ÖNERİ (Soru 2 sonrası)
// İki mod: HAREKETLİ ve DİNLENMELİ
// Her modda 10x10x10 = 1000 ihtimal
// ==========================================

// HAREKETLİ MOD - Aktif ama agresif değil
const HAREKETLI_MOD = {
  // A HAVUZU – BAŞLANGIÇ TONU
  A: [
    "Şimdi",
    "Tam şu anda",
    "Olduğun yerden",
    "Buradan",
    "Hiç uzatmadan",
    "Fazla düşünmeden",
    "Bir anlığına",
    "Kısa bir an için",
    "Kendini zorlamadan",
    "Sessizce",
  ],
  // B HAVUZU – EYLEM ÇEKİRDEĞİ
  B: [
    "ayağa kalk",
    "yer değiştir",
    "bedenini hareket ettir",
    "küçük bir adım at",
    "fiziksel bir şey yap",
    "bulunduğun alanı değiştir",
    "kaslarını gevşet",
    "ellerini hareket ettir",
    "nefesini derinleştir",
    "harekete geç",
  ],
  // C HAVUZU – KAPANIŞ / YÖN
  C: [
    "ve devam et",
    "gerisi önemli değil",
    "yeterli",
    "buradan ilerle",
    "sonra bakarsın",
    "bu kadarı yeter",
    "burada durma",
    "akışa bırak",
    "şimdi bırakma",
    "tamam",
  ],
};

// DİNLENMELİ MOD - Mikro eylemli, pasif değil
const DINLENMELI_MOD = {
  // A HAVUZU – YUMUŞAK TON
  A: [
    "Şimdilik",
    "Bir süre",
    "Kısa bir an",
    "Acele etmeden",
    "Zorlamadan",
    "Olduğu kadar",
    "Yavaşça",
    "Sessizce",
    "Kendine izin vererek",
    "Bugünlük",
  ],
  // B HAVUZU – DİNLENME EYLEMİ (hep mikro eylem var)
  B: [
    "dur",
    "hızını düşür",
    "ara ver",
    "bekle",
    "yükü bırak",
    "baskıyı azalt",
    "nefesine odaklan",
    "bulunduğun yerde kal",
    "düşünmeyi bırak",
    "gevşe",
  ],
  // C HAVUZU – KAPANIŞ
  C: [
    "bu kadarı yeter",
    "sonra dönersin",
    "şimdilik bu",
    "burada kal",
    "bitir",
    "bırak bitsin",
    "devam etmek zorunda değilsin",
    "tamam",
    "bugünlük yeter",
    "kapat",
  ],
};

// ==========================================
// UYGULAMA DURUMU
// ==========================================

let state = {
  answer1: null,
  answer2: null,
  group: null, // "agir", "zihinsel", "gerilim", "notr"
  mode: null, // "hareketli" veya "dinlenmeli"
  isNight: false,
  skipQuestion2: false,
};

// ==========================================
// YARDIMCI FONKSİYONLAR
// ==========================================

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function isNightTime() {
  const hour = new Date().getHours();
  return hour >= 21 || hour < 6;
}

// ==========================================
// DİNAMİK ARKA PLAN SİSTEMİ
// ==========================================

const SUNRISE_HOUR = 7.5;
const SUNSET_HOUR = 17.5;

function lerp(start, end, t) {
  return start + (end - start) * t;
}

function lerpColor(color1, color2, t) {
  return {
    r: Math.round(lerp(color1.r, color2.r, t)),
    g: Math.round(lerp(color1.g, color2.g, t)),
    b: Math.round(lerp(color1.b, color2.b, t)),
  };
}

const TIME_COLORS = {
  night: {
    bg: { r: 26, g: 26, b: 31 },
    gradient: { r: 80, g: 60, b: 120, a: 0.2 },
  },
  dawn: {
    bg: { r: 60, g: 55, b: 65 },
    gradient: { r: 140, g: 100, b: 130, a: 0.18 },
  },
  morning: {
    bg: { r: 225, g: 222, b: 218 },
    gradient: { r: 180, g: 170, b: 200, a: 0.15 },
  },
  day: {
    bg: { r: 232, g: 230, b: 227 },
    gradient: { r: 170, g: 165, b: 190, a: 0.12 },
  },
  sunset: {
    bg: { r: 80, g: 65, b: 70 },
    gradient: { r: 160, g: 100, b: 120, a: 0.2 },
  },
  evening: {
    bg: { r: 45, g: 42, b: 50 },
    gradient: { r: 120, g: 80, b: 140, a: 0.2 },
  },
  lateNight: {
    bg: { r: 30, g: 28, b: 35 },
    gradient: { r: 100, g: 70, b: 130, a: 0.22 },
  },
};

function getTimePhase() {
  const now = new Date();
  const hour = now.getHours() + now.getMinutes() / 60;

  if (hour >= 0 && hour < 5) return { phase: "night", progress: hour / 5 };
  if (hour >= 5 && hour < SUNRISE_HOUR)
    return { phase: "dawn", progress: (hour - 5) / (SUNRISE_HOUR - 5) };
  if (hour >= SUNRISE_HOUR && hour < 10)
    return {
      phase: "morning",
      progress: (hour - SUNRISE_HOUR) / (10 - SUNRISE_HOUR),
    };
  if (hour >= 10 && hour < 16)
    return { phase: "day", progress: (hour - 10) / 6 };
  if (hour >= 16 && hour < 19)
    return { phase: "sunset", progress: (hour - 16) / 3 };
  if (hour >= 19 && hour < 21)
    return { phase: "evening", progress: (hour - 19) / 2 };
  return { phase: "lateNight", progress: (hour - 21) / 3 };
}

function getNextPhase(currentPhase) {
  const phases = [
    "night",
    "dawn",
    "morning",
    "day",
    "sunset",
    "evening",
    "lateNight",
  ];
  const index = phases.indexOf(currentPhase);
  return phases[(index + 1) % phases.length];
}

function updateBackgroundColor() {
  const { phase, progress } = getTimePhase();
  const currentColors = TIME_COLORS[phase];
  const nextPhase = getNextPhase(phase);
  const nextColors = TIME_COLORS[nextPhase];

  const transitionStart = 0.7;
  let blendProgress = 0;
  if (progress > transitionStart) {
    blendProgress = (progress - transitionStart) / (1 - transitionStart);
  }

  const bgColor = lerpColor(currentColors.bg, nextColors.bg, blendProgress);
  const gradientBase = lerpColor(
    {
      r: currentColors.gradient.r,
      g: currentColors.gradient.g,
      b: currentColors.gradient.b,
    },
    {
      r: nextColors.gradient.r,
      g: nextColors.gradient.g,
      b: nextColors.gradient.b,
    },
    blendProgress,
  );
  const gradientAlpha = lerp(
    currentColors.gradient.a,
    nextColors.gradient.a,
    blendProgress,
  );

  const root = document.documentElement;
  root.style.setProperty(
    "--bg-color",
    `rgb(${bgColor.r}, ${bgColor.g}, ${bgColor.b})`,
  );

  root.style.setProperty(
    "--gradient-1",
    `rgba(${gradientBase.r}, ${gradientBase.g}, ${gradientBase.b + 20}, ${gradientAlpha})`,
  );
  root.style.setProperty(
    "--gradient-2",
    `rgba(${gradientBase.r - 10}, ${gradientBase.g + 10}, ${gradientBase.b + 30}, ${gradientAlpha * 0.9})`,
  );
  root.style.setProperty(
    "--gradient-3",
    `rgba(${gradientBase.r}, ${gradientBase.g + 20}, ${gradientBase.b + 10}, ${gradientAlpha * 0.7})`,
  );
  root.style.setProperty(
    "--gradient-4",
    `rgba(${gradientBase.r + 20}, ${gradientBase.g}, ${gradientBase.b}, ${gradientAlpha * 0.8})`,
  );

  const brightness = (bgColor.r + bgColor.g + bgColor.b) / 3;
  if (brightness < 100) {
    root.style.setProperty("--text-color", "rgba(255, 255, 255, 0.85)");
    document.body.classList.add("night");
    document.body.classList.remove("day");
    state.isNight = true;
  } else {
    root.style.setProperty("--text-color", "#3a3a3a");
    document.body.classList.add("day");
    document.body.classList.remove("night");
    state.isNight = false;
  }
}

function initializeBackgroundColor() {
  const { phase } = getTimePhase();
  const colors = TIME_COLORS[phase];
  const root = document.documentElement;

  root.style.setProperty(
    "--bg-color",
    `rgb(${colors.bg.r}, ${colors.bg.g}, ${colors.bg.b})`,
  );

  const g = colors.gradient;
  root.style.setProperty(
    "--gradient-1",
    `rgba(${g.r}, ${g.g}, ${g.b + 20}, ${g.a})`,
  );
  root.style.setProperty(
    "--gradient-2",
    `rgba(${g.r - 10}, ${g.g + 10}, ${g.b + 30}, ${g.a * 0.9})`,
  );
  root.style.setProperty(
    "--gradient-3",
    `rgba(${g.r}, ${g.g + 20}, ${g.b + 10}, ${g.a * 0.7})`,
  );
  root.style.setProperty(
    "--gradient-4",
    `rgba(${g.r + 20}, ${g.g}, ${g.b}, ${g.a * 0.8})`,
  );

  currentGradient = {
    g1: { r: g.r, g: g.g, b: g.b + 20, a: g.a },
    g2: { r: g.r - 10, g: g.g + 10, b: g.b + 30, a: g.a * 0.9 },
    g3: { r: g.r, g: g.g + 20, b: g.b + 10, a: g.a * 0.7 },
    g4: { r: g.r + 20, g: g.g, b: g.b, a: g.a * 0.8 },
  };

  const brightness = (colors.bg.r + colors.bg.g + colors.bg.b) / 3;
  if (brightness < 100) {
    root.style.setProperty("--text-color", "rgba(255, 255, 255, 0.85)");
    document.body.classList.add("night");
    document.body.classList.remove("day");
    state.isNight = true;
  } else {
    root.style.setProperty("--text-color", "#3a3a3a");
    document.body.classList.add("day");
    document.body.classList.remove("night");
    state.isNight = false;
  }
}

function startBackgroundUpdater() {
  initializeBackgroundColor();
  setTimeout(() => {
    document.body.classList.add("transitions-enabled");
  }, 100);
  setInterval(updateBackgroundColor, 60000);
}

function getLastVisitTime() {
  const lastVisit = localStorage.getItem("lastVisitTime");
  return lastVisit ? parseInt(lastVisit) : null;
}

function setLastVisitTime() {
  localStorage.setItem("lastVisitTime", Date.now().toString());
}

function getMinutesSinceLastVisit() {
  const lastVisit = getLastVisitTime();
  if (!lastVisit) return Infinity;
  return (Date.now() - lastVisit) / (1000 * 60);
}

// ==========================================
// EKRAN GEÇİŞLERİ
// ==========================================

function hideScreen(screenId) {
  return new Promise((resolve) => {
    const screen = document.getElementById(screenId);
    screen.classList.add("fade-out");
    setTimeout(() => {
      screen.classList.add("hidden");
      screen.classList.remove("fade-out");
      resolve();
    }, 800);
  });
}

function showScreen(screenId) {
  return new Promise((resolve) => {
    const screen = document.getElementById(screenId);
    screen.classList.remove("hidden");
    screen.classList.add("fade-in");
    setTimeout(() => {
      screen.classList.remove("fade-in");
      resolve();
    }, 500);
  });
}

// ==========================================
// ÖNERİ ÜRETME MOTORU
// ==========================================

function getRandomIndex(length) {
  return Math.floor(Math.random() * length);
}

function generateSuggestionId(answer1, indexA, indexB, indexC) {
  return `${answer1}-${indexA}-${indexB}-${indexC}`;
}

function getLastSuggestionId() {
  return localStorage.getItem("lastSuggestionId");
}

function saveLastSuggestionId(id) {
  localStorage.setItem("lastSuggestionId", id);
}

// İlk öneri üretme (Soru 1 sonrası) - Mod bazlı
function generateFirstSuggestion() {
  const answer1 = state.answer1;

  // Modu belirle
  const mode = determineMode();
  state.mode = mode; // Modu state'e kaydet (2. soru için kullanılabilir)

  // Mod havuzunu seç
  const havuz = mode === "hareketli" ? HAREKETLI_MOD : DINLENMELI_MOD;

  const lastId = getLastSuggestionId();
  let suggestionId;
  let indexA, indexB, indexC;
  let attempts = 0;
  const maxAttempts = 10;

  // Aynı ID gelmemesi için reroll yap
  do {
    indexA = getRandomIndex(havuz.A.length);
    indexB = getRandomIndex(havuz.B.length);
    indexC = getRandomIndex(havuz.C.length);

    suggestionId = `${mode}-${answer1}-${indexA}-${indexB}-${indexC}`;
    attempts++;
  } while (suggestionId === lastId && attempts < maxAttempts);

  // Yeni ID'yi kaydet
  saveLastSuggestionId(suggestionId);

  return {
    lineA: havuz.A[indexA],
    lineB: havuz.B[indexB],
    lineC: havuz.C[indexC],
  };
}

// Son öneri üretme (Soru 2 sonrası) - Mod ve Grup bazlı
function generateFinalSuggestion(mode = "dinlenmeli") {
  const havuz = mode === "hareketli" ? HAREKETLI_MOD : DINLENMELI_MOD;
  const group = state.group || "notr";
  const grupFiltre = GRUP_FILTRELERI[group];

  const lastId = localStorage.getItem("lastFinalSuggestionId");
  let suggestionId;
  let indexA, realIndexB, realIndexC;
  let attempts = 0;
  const maxAttempts = 10;

  // Aynı ID gelmemesi için reroll yap
  do {
    // A havuzundan rastgele (filtresiz)
    indexA = getRandomIndex(havuz.A.length);

    // B havuzundan gruba göre filtrelenmiş index seç
    const filteredBIndex = grupFiltre.B[getRandomIndex(grupFiltre.B.length)];
    realIndexB = filteredBIndex;

    // C havuzundan gruba göre filtrelenmiş index seç
    const filteredCIndex = grupFiltre.C[getRandomIndex(grupFiltre.C.length)];
    realIndexC = filteredCIndex;

    suggestionId = `${mode}-${group}-${indexA}-${realIndexB}-${realIndexC}`;
    attempts++;
  } while (suggestionId === lastId && attempts < maxAttempts);

  // Yeni ID'yi kaydet
  localStorage.setItem("lastFinalSuggestionId", suggestionId);

  // Cümleyi oluştur: "A B, C." formatında
  const lineA = havuz.A[indexA];
  const lineB = havuz.B[realIndexB];
  const lineC = havuz.C[realIndexC];

  return {
    lineA: lineA,
    lineB: lineB,
    lineC: lineC,
    // Birleşik cümle: "Şimdi ayağa kalk, ve devam et."
    fullSentence: `${lineA} ${lineB}, ${lineC}.`,
  };
}

// Son giriş zamanını localStorage'da tutmak için
const LAST_VISIT_KEY = "yeterli_last_visit";

function getVisitInterval() {
  const lastVisit = localStorage.getItem(LAST_VISIT_KEY);
  const now = Date.now();

  // Mevcut girişi kaydet
  localStorage.setItem(LAST_VISIT_KEY, now.toString());

  if (!lastVisit) {
    return "new"; // İlk giriş veya yeni gün
  }

  const lastVisitTime = parseInt(lastVisit);
  const diffMinutes = (now - lastVisitTime) / (1000 * 60);

  // Yeni gün kontrolü
  const lastDate = new Date(lastVisitTime).toDateString();
  const todayDate = new Date(now).toDateString();
  if (lastDate !== todayDate) {
    return "new_day";
  }

  if (diffMinutes <= 30) {
    return "short"; // 0-30 dakika
  } else if (diffMinutes <= 120) {
    return "medium"; // 30-120 dakika
  } else {
    return "long"; // 2 saat+
  }
}

function getTimeOfDayBonus() {
  const hour = new Date().getHours();

  // Gündüz (06:00-18:00) → hareketliye +10%
  if (hour >= 6 && hour < 18) {
    return { hareketli: 0.1, dinlenmeli: 0 };
  }
  // Gece geç (22:00-03:00) → dinlenmeliye +15%
  if (hour >= 22 || hour < 3) {
    return { hareketli: 0, dinlenmeli: 0.15 };
  }
  // Diğer saatler → nötr
  return { hareketli: 0, dinlenmeli: 0 };
}

// Mod belirleme fonksiyonu
function determineMode() {
  const answer1Element = document.querySelector(
    '#screen-question1 .option-btn[data-selected="true"]',
  );

  if (!answer1Element) {
    // Eğer cevap yoksa varsayılan
    return Math.random() < 0.5 ? "hareketli" : "dinlenmeli";
  }

  const answer = answer1Element.getAttribute("data-value");
  const group = answer1Element.getAttribute("data-group");

  // Grubu state'e kaydet (2. soru için kullanılacak)
  state.group = group;

  // Gruba göre mod belirleme
  let hareketliOlasilik = 0.5; // Başlangıç noktası

  if (group === "agir") {
    // 🔴 AĞIR: dinlenmeli öncelik (%80)
    hareketliOlasilik = 0.2;
    state.skipQuestion2 = false;
  } else if (group === "zihinsel") {
    // 🟡 ZİHİNSEL: denge (%50)
    hareketliOlasilik = 0.5;
    state.skipQuestion2 = false;
  } else if (group === "gerilim") {
    // 🟢 GERİLİM: hareketli öncelik (%80)
    hareketliOlasilik = 0.8;
    state.skipQuestion2 = false;
  } else if (group === "notr") {
    // ⚪ NÖTR: denge (%50)
    hareketliOlasilik = 0.5;
    // Normal seçildiğinde 2. soru atlanacak
    state.skipQuestion2 = true;
  }

  // 2. İkinci sinyal: Giriş aralığı
  const interval = getVisitInterval();

  if (interval === "short") {
    // 0-30 dakika → hareketli eğilim +10%
    hareketliOlasilik += 0.1;
  } else if (interval === "medium") {
    // 30-120 dakika → değişiklik yok
  } else if (
    interval === "long" ||
    interval === "new_day" ||
    interval === "new"
  ) {
    // 2 saat+ veya yeni gün → dinlenmeli eğilim +10%
    hareketliOlasilik -= 0.1;
  }

  // 3. Zayıf sinyal: Saat dilimi
  const timeBonus = getTimeOfDayBonus();
  hareketliOlasilik += timeBonus.hareketli;
  hareketliOlasilik -= timeBonus.dinlenmeli;

  // Olasılığı 0-1 arasında sınırla
  hareketliOlasilik = Math.max(0.1, Math.min(0.9, hareketliOlasilik));

  // Rastgele seçim yap
  return Math.random() < hareketliOlasilik ? "hareketli" : "dinlenmeli";
}

// ==========================================
// OLAY DİNLEYİCİLERİ
// ==========================================

const MOOD_COLORS = {
  // 🔴 DİNLENMEYE YAKIN - daha soğuk, sakin tonlar
  yorgun: {
    g1: { r: 90, g: 80, b: 160, a: 0.26 },
    g2: { r: 80, g: 90, b: 170, a: 0.22 },
    g3: { r: 100, g: 95, b: 165, a: 0.16 },
    g4: { r: 85, g: 85, b: 155, a: 0.18 },
  },
  bunalmis: {
    g1: { r: 130, g: 110, b: 170, a: 0.24 },
    g2: { r: 120, g: 100, b: 180, a: 0.2 },
    g3: { r: 125, g: 105, b: 175, a: 0.15 },
    g4: { r: 115, g: 95, b: 165, a: 0.17 },
  },
  huzursuz: {
    g1: { r: 140, g: 120, b: 160, a: 0.25 },
    g2: { r: 130, g: 115, b: 170, a: 0.21 },
    g3: { r: 135, g: 118, b: 165, a: 0.16 },
    g4: { r: 125, g: 110, b: 155, a: 0.18 },
  },
  bos: {
    g1: { r: 140, g: 140, b: 155, a: 0.2 },
    g2: { r: 135, g: 145, b: 160, a: 0.17 },
    g3: { r: 138, g: 142, b: 158, a: 0.13 },
    g4: { r: 132, g: 138, b: 152, a: 0.15 },
  },
  isteksiz: {
    g1: { r: 150, g: 130, b: 160, a: 0.22 },
    g2: { r: 145, g: 125, b: 165, a: 0.18 },
    g3: { r: 147, g: 128, b: 162, a: 0.14 },
    g4: { r: 142, g: 122, b: 157, a: 0.16 },
  },
  // 🟢 HAREKETE YAKIN - biraz daha sıcak, enerjik tonlar
  kararsiz: {
    g1: { r: 160, g: 140, b: 170, a: 0.24 },
    g2: { r: 155, g: 145, b: 175, a: 0.2 },
    g3: { r: 158, g: 142, b: 172, a: 0.15 },
    g4: { r: 152, g: 138, b: 168, a: 0.17 },
  },
  odaklanamiyorum: {
    g1: { r: 165, g: 145, b: 175, a: 0.25 },
    g2: { r: 160, g: 150, b: 180, a: 0.21 },
    g3: { r: 162, g: 148, b: 177, a: 0.16 },
    g4: { r: 157, g: 143, b: 172, a: 0.18 },
  },
  sikiSmis: {
    g1: { r: 170, g: 130, b: 160, a: 0.26 },
    g2: { r: 165, g: 125, b: 165, a: 0.22 },
    g3: { r: 167, g: 128, b: 162, a: 0.17 },
    g4: { r: 162, g: 122, b: 157, a: 0.19 },
  },
  gergin: {
    g1: { r: 175, g: 135, b: 155, a: 0.25 },
    g2: { r: 170, g: 130, b: 160, a: 0.21 },
    g3: { r: 172, g: 132, b: 157, a: 0.16 },
    g4: { r: 167, g: 127, b: 152, a: 0.18 },
  },
  normal: {
    g1: { r: 155, g: 150, b: 165, a: 0.22 },
    g2: { r: 150, g: 155, b: 170, a: 0.18 },
    g3: { r: 152, g: 152, b: 167, a: 0.14 },
    g4: { r: 147, g: 147, b: 162, a: 0.16 },
  },
};

const WEIGHT_COLORS = {
  zaman: {
    g1: { r: 140, g: 120, b: 170, a: 0.26 },
    g2: { r: 130, g: 130, b: 180, a: 0.22 },
  },
  enerji: {
    g1: { r: 160, g: 130, b: 150, a: 0.26 },
    g2: { r: 155, g: 140, b: 160, a: 0.22 },
  },
  odak: {
    g1: { r: 130, g: 140, b: 175, a: 0.26 },
    g2: { r: 125, g: 145, b: 180, a: 0.22 },
  },
  baski: {
    g1: { r: 150, g: 120, b: 160, a: 0.28 },
    g2: { r: 145, g: 125, b: 165, a: 0.24 },
  },
  kararsizlik: {
    g1: { r: 145, g: 140, b: 165, a: 0.24 },
    g2: { r: 140, g: 145, b: 170, a: 0.2 },
  },
  bilmiyorum: {
    g1: { r: 150, g: 145, b: 160, a: 0.22 },
    g2: { r: 145, g: 150, b: 165, a: 0.18 },
  },
};

let currentGradient = {
  g1: { r: 180, g: 160, b: 200, a: 0.15 },
  g2: { r: 160, g: 180, b: 200, a: 0.12 },
  g3: { r: 140, g: 160, b: 180, a: 0.1 },
  g4: { r: 170, g: 150, b: 190, a: 0.12 },
};

let colorTransitionRAF = null;

function smoothColorTransition(targetColors, duration = 3000) {
  if (colorTransitionRAF) {
    cancelAnimationFrame(colorTransitionRAF);
  }

  const startColors = JSON.parse(JSON.stringify(currentGradient));
  const startTime = performance.now();
  const root = document.documentElement;

  function animate(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const easeProgress =
      progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    ["g1", "g2", "g3", "g4"].forEach((key, index) => {
      if (targetColors[key]) {
        const start = startColors[key];
        const target = targetColors[key];

        currentGradient[key] = {
          r: Math.round(lerp(start.r, target.r, easeProgress)),
          g: Math.round(lerp(start.g, target.g, easeProgress)),
          b: Math.round(lerp(start.b, target.b, easeProgress)),
          a: lerp(start.a, target.a, easeProgress),
        };

        const c = currentGradient[key];
        root.style.setProperty(
          `--gradient-${index + 1}`,
          `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a.toFixed(3)})`,
        );
      }
    });

    if (progress < 1) {
      colorTransitionRAF = requestAnimationFrame(animate);
    } else {
      colorTransitionRAF = null;
    }
  }

  colorTransitionRAF = requestAnimationFrame(animate);
}

function resetGradientToDefault() {
  const { phase } = getTimePhase();
  const colors = TIME_COLORS[phase];
  const g = colors.gradient;

  const defaultColors = {
    g1: { r: g.r, g: g.g, b: g.b + 20, a: g.a },
    g2: { r: g.r - 10, g: g.g + 10, b: g.b + 30, a: g.a * 0.9 },
    g3: { r: g.r, g: g.g + 20, b: g.b + 10, a: g.a * 0.7 },
    g4: { r: g.r + 20, g: g.g, b: g.b, a: g.a * 0.8 },
  };

  smoothColorTransition(defaultColors, 2500);
}

function applyMoodToBackground(mood) {
  document.body.classList.remove(
    "mood-zihinsel-yorgun",
    "mood-bedensel-yorgun",
    "mood-karisik",
    "mood-daginik",
  );

  if (MOOD_COLORS[mood]) {
    smoothColorTransition(MOOD_COLORS[mood], 3000);
  }
}

function applyWeightToBackground(weight) {
  document.body.classList.remove(
    "weight-zihnim",
    "weight-bedenim",
    "weight-ikisi-de",
    "weight-emin-degilim",
  );

  if (weight && WEIGHT_COLORS[weight]) {
    smoothColorTransition(WEIGHT_COLORS[weight], 2500);
  }
}

function pauseGradientFlow() {
  const gradientBg = document.querySelector(".gradient-bg");
  gradientBg.classList.add("paused");
}

function resumeGradientFlow() {
  const gradientBg = document.querySelector(".gradient-bg");
  gradientBg.classList.remove("paused");
}

function setupQuestion1Listeners() {
  const buttons = document.querySelectorAll("#screen-question1 .option-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      // Önce tüm butonlardan seçili işaretini kaldır
      buttons.forEach((b) => b.removeAttribute("data-selected"));
      // Bu butonu seçili olarak işaretle
      btn.setAttribute("data-selected", "true");

      pauseGradientFlow();
      state.answer1 = btn.dataset.value;
      applyMoodToBackground(state.answer1);

      await hideScreen("screen-question1");
      resumeGradientFlow();

      // İlk öneriyi göster
      await showFirstSuggestion();
    });
  });
}

function setupContinueButtonListener() {
  const continueBtn = document.querySelector(".continue-btn");
  continueBtn.addEventListener("click", async () => {
    pauseGradientFlow();
    await hideScreen("screen-suggestion1");
    resumeGradientFlow();

    // Normal seçildiyse 2. soruyu atla, direkt son öneriyi göster
    if (state.skipQuestion2) {
      showFinalSuggestion();
    } else {
      await showScreen("screen-question2");
    }
  });
}

function setupSkipButtonListener() {
  const skipBtn = document.querySelector(".skip-btn");
  skipBtn.addEventListener("click", () => {
    pauseGradientFlow();

    const container = document.querySelector(".container");
    container.style.transition = "opacity 0.8s ease";
    container.style.opacity = "0";

    document.body.classList.add("closed");

    setTimeout(() => {
      container.style.display = "none";

      // "Tamam" yazısını göster
      const tamamText = document.createElement("p");
      tamamText.textContent = "Tamam.";
      tamamText.className = "tamam-text";
      document.body.appendChild(tamamText);

      // Yazıyı fade-in yap
      requestAnimationFrame(() => {
        tamamText.classList.add("visible");
      });

      // Gradient'ı tekrar başlat
      resumeGradientFlow();

      // Yazıyı fade-out yap ve kaldır
      setTimeout(() => {
        tamamText.classList.remove("visible");
        tamamText.classList.add("fade-out");

        setTimeout(() => {
          tamamText.remove();
        }, 1200);
      }, 2000);
    }, 800);

    resetGradientToDefault();
  });
}

function setupQuestion2Listeners() {
  const buttons = document.querySelectorAll("#screen-question2 .option-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      pauseGradientFlow();
      state.answer2 = btn.dataset.value;
      applyWeightToBackground(state.answer2);

      await hideScreen("screen-question2");
      resumeGradientFlow();
      showFinalSuggestion();
    });
  });
}

function setupCloseButtonListener() {
  const closeBtn = document.querySelector(".close-btn");
  closeBtn.addEventListener("click", () => {
    pauseGradientFlow();

    const container = document.querySelector(".container");
    container.style.transition = "opacity 0.8s ease";
    container.style.opacity = "0";

    document.body.classList.add("closed");

    setTimeout(() => {
      container.style.display = "none";

      // "Tamam" yazısını göster
      const tamamText = document.createElement("p");
      tamamText.textContent = "Tamam.";
      tamamText.className = "tamam-text";
      document.body.appendChild(tamamText);

      // Yazıyı fade-in yap
      requestAnimationFrame(() => {
        tamamText.classList.add("visible");
      });

      // Gradient'ı tekrar başlat
      resumeGradientFlow();

      // Yazıyı fade-out yap ve kaldır
      setTimeout(() => {
        tamamText.classList.remove("visible");
        tamamText.classList.add("fade-out");

        setTimeout(() => {
          tamamText.remove();
        }, 1200);
      }, 2000);
    }, 800);

    resetGradientToDefault();
  });
}

// ==========================================
// ÖNERİ GÖSTERİMİ
// ==========================================

async function showFirstSuggestion() {
  const suggestion = generateFirstSuggestion();

  document.getElementById("line1-a").textContent = suggestion.lineA;
  document.getElementById("line1-b").textContent = suggestion.lineB;
  document.getElementById("line1-c").textContent = suggestion.lineC;

  await showScreen("screen-suggestion1");

  const lines = document.querySelectorAll(
    "#screen-suggestion1 .suggestion-line",
  );
  lines.forEach((line, index) => {
    setTimeout(() => {
      line.classList.add("animate");
    }, index * 500);
  });

  // Öneri satırları bittikten 1.5 saniye sonra butonları göster
  const continueBtn = document.querySelector(".continue-btn");
  const skipBtn = document.querySelector(".skip-btn");
  const lastLineDelay = (lines.length - 1) * 500 + 1000; // Son satır animasyonu + 1sn bekleme
  setTimeout(() => {
    continueBtn.classList.add("visible");
    skipBtn.classList.add("visible");
  }, lastLineDelay + 1500);
}

async function showFinalSuggestion() {
  // Mod zaten state'te kayıtlı (1. sorudan)
  const mode = state.mode;
  const suggestion = generateFinalSuggestion(mode);

  // Birleşik cümle formatında göster
  document.getElementById("line-baglam").textContent = suggestion.lineA;
  document.getElementById("line-eylem").textContent = suggestion.lineB + ",";
  document.getElementById("line-kapanis").textContent = suggestion.lineC + ".";

  await showScreen("screen-suggestion");

  const lines = document.querySelectorAll(
    "#screen-suggestion .suggestion-line",
  );
  lines.forEach((line, index) => {
    setTimeout(() => {
      line.classList.add("animate");
    }, index * 500);
  });

  // Öneri satırları bittikten 1.5 saniye sonra "Bu yeterli" yazısını göster
  const lastLineDelay = (lines.length - 1) * 500 + 1000; // Son satır animasyonu + 1sn bekleme
  setTimeout(() => {
    document.querySelector(".closing-text").classList.add("animate");
  }, lastLineDelay + 1500);

  // "Bu yeterli" yazısından 1 saniye sonra Kapat butonunu göster
  setTimeout(() => {
    document.querySelector(".close-btn").classList.add("animate");
  }, lastLineDelay + 2500);
}

// ==========================================
// AÇILIŞ AKIŞI
// ==========================================

function isNewDay() {
  const lastVisit = getLastVisitTime();
  if (!lastVisit) return true;

  const lastDate = new Date(lastVisit);
  const now = new Date();

  return (
    lastDate.getDate() !== now.getDate() ||
    lastDate.getMonth() !== now.getMonth() ||
    lastDate.getFullYear() !== now.getFullYear()
  );
}

async function startApp() {
  startBackgroundUpdater();

  const gradientBg = document.querySelector(".gradient-bg");
  gradientBg.classList.add("visible");

  // Gradient görünür olduktan kısa süre sonra devam et
  await new Promise((resolve) => setTimeout(resolve, 800));

  const minutesSince = getMinutesSinceLastVisit();
  const newDay = isNewDay();
  const openingText = document.querySelector(".opening-text");
  const openingScreen = document.getElementById("screen-opening");

  if (newDay && minutesSince !== Infinity) {
    // Yeni gün - "Yeniden" (küçük, silik) → "Buradasın" (ana metin)
    openingScreen.classList.remove("hidden");

    // "Yeniden" - daha küçük, daha silik
    openingText.textContent = "Yeniden.";
    openingText.style.fontSize = "1.2rem";
    openingText.style.opacity = "0";
    openingText.classList.add("fade-in");

    await new Promise((resolve) => setTimeout(resolve, 900));

    openingText.classList.remove("fade-in");
    openingText.classList.add("fade-out");
    await new Promise((resolve) => setTimeout(resolve, 600));

    // 0.2 sn boşluk
    openingText.classList.remove("fade-out");
    openingText.style.opacity = "0";
    await new Promise((resolve) => setTimeout(resolve, 200));

    // "Buradasın" - ana metin
    openingText.textContent = "Buradasın.";
    openingText.style.fontSize = "";
    openingText.classList.add("fade-in");

    await new Promise((resolve) => setTimeout(resolve, 1800));

    openingText.classList.remove("fade-in");
    openingText.classList.add("fade-out");
    await new Promise((resolve) => setTimeout(resolve, 800));

    openingText.style.opacity = "";
    openingScreen.classList.add("hidden");
    openingText.classList.remove("fade-out");
    setLastVisitTime();
    await showScreen("screen-question1");
  } else if (minutesSince <= 30) {
    // 0-30 dakika - "Devam." (~0.8 sn, çok hafif fade)
    openingScreen.classList.remove("hidden");
    openingText.textContent = "Devam.";

    openingText.classList.add("fade-in");

    await new Promise((resolve) => setTimeout(resolve, 800));

    openingText.classList.remove("fade-in");
    openingText.classList.add("fade-out");
    await new Promise((resolve) => setTimeout(resolve, 500));

    openingScreen.classList.add("hidden");
    openingText.classList.remove("fade-out");
    setLastVisitTime();
    await showScreen("screen-question1");
  } else if (minutesSince <= 120) {
    // 30-120 dakika - "Bir süre geçmiş." → sonra "Sorun değil." (gecikmeli, silik)
    openingScreen.classList.remove("hidden");
    openingText.innerHTML =
      'Bir süre geçmiş.<br><span id="sorun-degil" style="font-size: 0.9rem; opacity: 0; display: inline-block; margin-top: 12px; transition: opacity 0.8s ease;">Sorun değil.</span>';

    openingText.style.opacity = "0";
    openingText.classList.add("fade-in");

    // Ana metin göründükten sonra alt metni gecikmeli getir
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const sorunDegil = document.getElementById("sorun-degil");
    if (sorunDegil) sorunDegil.style.opacity = "0.35";

    await new Promise((resolve) => setTimeout(resolve, 2000));

    openingText.classList.remove("fade-in");
    openingText.classList.add("fade-out");
    await new Promise((resolve) => setTimeout(resolve, 800));

    openingText.innerHTML = "";
    openingText.style.opacity = "";
    openingScreen.classList.add("hidden");
    openingText.classList.remove("fade-out");
    setLastVisitTime();
    await showScreen("screen-question1");
  } else {
    // 2+ saat veya ilk ziyaret - "Buradasın."
    openingScreen.classList.remove("hidden");
    openingText.textContent = "Buradasın.";

    openingText.classList.add("fade-in");

    await new Promise((resolve) => setTimeout(resolve, 2000));

    openingText.classList.remove("fade-in");
    openingText.classList.add("fade-out");
    await new Promise((resolve) => setTimeout(resolve, 800));

    openingScreen.classList.add("hidden");
    openingText.classList.remove("fade-out");
    setLastVisitTime();
    await showScreen("screen-question1");
  }
}

// ==========================================
// BAŞLANGIÇ
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.add("hidden");
  });

  setupQuestion1Listeners();
  setupContinueButtonListener();
  setupSkipButtonListener();
  setupQuestion2Listeners();
  setupCloseButtonListener();

  startApp();
});
