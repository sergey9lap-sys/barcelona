export const BRAND_NAME = process.env.NEXT_PUBLIC_BRAND_NAME || "1899 Barcelona Vision";

// Add the confirmed Telegram username once the user provides it, for example: "@barcelona_vision".
export const TELEGRAM_HANDLE = process.env.NEXT_PUBLIC_TELEGRAM_HANDLE || "";

export const MATCH = {
  opponent: "Валенсия",
  home: "Валенсия",
  away: "Барселона",
  date: "6 сентября 2026",
  time: "17:15 МСК",
  venue: "Месталья",
  competition: "Ла Лига",
  competitionStage: "4-й тур · 2026/27",
  competitionLogo: "/competition/laliga.png",
  homeLogo: "/club/valencia.png",
  awayLogo: "/club/barca.png",
};

// После матча достаточно заменить этот список на реально сыгравших футболистов.
// Страница рейтинга и PNG автоматически перестроятся под их количество.
export const RATING_MATCH = {
  ...MATCH,
  status: "preview" as "preview" | "ready",
  playedPlayerIds: [
    "joan-garcia", "cubarsi", "christensen", "gerard-martin", "kounde", "eric-garcia",
    "pedri", "fermin", "olmo", "de-jong", "rodri", "yamal", "raphinha", "gordon", "adeyemi", "bisiwu",
  ],
};
