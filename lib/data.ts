export type Position = "GK" | "DF" | "MF" | "FW";

export type Player = {
  id: string;
  name: string;
  number: number | null;
  position: Position;
  image: string;
  fantasyCost: number;
};

export const players: Player[] = [
  { id: "joan-garcia", name: "Жоан Гарсия", number: 13, position: "GK", image: "/players/joan-garcia-2026.jpg", fantasyCost: 7 },
  { id: "szczesny", name: "Войцех Щенсны", number: 25, position: "GK", image: "/players/szczesny-2026.jpg", fantasyCost: 5 },
  { id: "balde", name: "Алехандро Бальде", number: 3, position: "DF", image: "/players/balde-2026.jpg", fantasyCost: 7 },
  { id: "cubarsi", name: "Пау Кубарси", number: 5, position: "DF", image: "/players/cubarsi-2026.jpg", fantasyCost: 8 },
  { id: "christensen", name: "Андреас Кристенсен", number: 15, position: "DF", image: "/players/christensen-2026.jpg", fantasyCost: 6 },
  { id: "gerard-martin", name: "Жерар Мартин", number: 18, position: "DF", image: "/players/gerard-martin-2026.jpg", fantasyCost: 5 },
  { id: "kounde", name: "Жюль Кунде", number: 23, position: "DF", image: "/players/kounde-2026.jpg", fantasyCost: 8 },
  { id: "eric-garcia", name: "Эрик Гарсия", number: 24, position: "DF", image: "/players/eric-garcia-2026.jpg", fantasyCost: 6 },
  { id: "cancelo", name: "Жоау Канселу", number: 2, position: "DF", image: "/players/cancelo-2026.png", fantasyCost: 9 },
  { id: "gavi", name: "Гави", number: 6, position: "MF", image: "/players/gavi-2026.jpg", fantasyCost: 9 },
  { id: "pedri", name: "Педри", number: 8, position: "MF", image: "/players/pedri-2026.jpg", fantasyCost: 12 },
  { id: "fermin", name: "Фермин Лопес", number: 7, position: "MF", image: "/players/fermin-2026.jpg", fantasyCost: 9 },
  { id: "olmo", name: "Дани Ольмо", number: 20, position: "MF", image: "/players/olmo-2026.jpg", fantasyCost: 10 },
  { id: "de-jong", name: "Френки де Йонг", number: 21, position: "MF", image: "/players/de-jong-2026.png", fantasyCost: 8 },
  { id: "bernal", name: "Марк Берналь", number: 22, position: "MF", image: "/players/bernal-2026.jpg", fantasyCost: 6 },
  { id: "rodri", name: "Родри", number: 16, position: "MF", image: "/players/rodri-2026.png", fantasyCost: 12 },
  { id: "yamal", name: "Ламин Ямаль", number: 10, position: "FW", image: "/players/lamine-2026.jpg", fantasyCost: 14 },
  { id: "raphinha", name: "Рафинья", number: 11, position: "FW", image: "/players/raphinha-2026.jpg", fantasyCost: 13 },
  { id: "gordon", name: "Энтони Гордон", number: 17, position: "FW", image: "/players/gordon-2026.jpg", fantasyCost: 10 },
  { id: "adeyemi", name: "Карим Адейеми", number: 14, position: "FW", image: "/players/adeyemi-2026.jpg", fantasyCost: 10 },
  { id: "bisiwu", name: "Джесси Бисиву", number: 27, position: "FW", image: "/players/bisiwu-2026.jpg", fantasyCost: 8 },
  { id: "xavi-espart", name: "Хави Эспарт", number: 12, position: "DF", image: "/players/xavi-espart-official-2026.jpg", fantasyCost: 4 },
  { id: "jordi-pesquer", name: "Жорди Пескер", number: 33, position: "DF", image: "/la-masia/jordi-pesquer.jpg", fantasyCost: 4 },
  { id: "ebrima-tunkara", name: "Эбрима Тункара", number: null, position: "MF", image: "/la-masia/ebrima-tunkara.jpg", fantasyCost: 4 },
  { id: "orian-goren", name: "Ориан Горен", number: null, position: "MF", image: "/la-masia/orian-goren.jpg", fantasyCost: 4 },
  { id: "brian-farinas", name: "Брайан Фариньяс", number: 28, position: "MF", image: "/la-masia/brian-farinas.jpg", fantasyCost: 4 },
  { id: "alex-gonzalez", name: "Алекс Гонсалес", number: null, position: "FW", image: "/la-masia/alex-gonzalez.jpg", fantasyCost: 4 },
  { id: "iker-rodriguez", name: "Икер Родригес", number: null, position: "GK", image: "/la-masia/iker-rodriguez.jpg", fantasyCost: 4 },
  { id: "hamza", name: "Хамза Абделькарим", number: 29, position: "FW", image: "/la-masia/hamza-abdelkarim.jpg", fantasyCost: 4 }
];

export const rankingPlayers = players.filter((player) => [
  "raphinha", "joan-garcia", "fermin", "pedri", "xavi-espart", "gordon", "adeyemi", "yamal",
  "eric-garcia", "olmo", "bernal", "gavi", "gerard-martin", "kounde", "christensen", "cancelo",
].includes(player.id));

export const laMasiaPlayers = players.filter((player) => [
  "xavi-espart", "jordi-pesquer", "ebrima-tunkara", "orian-goren",
  "brian-farinas", "alex-gonzalez", "iker-rodriguez", "hamza",
].includes(player.id));

export const transferTargets = [
  { id: "alvarez", name: "Хулиан Альварес", club: "Атлетико", position: "Нападающий", image: "/players/julian-alvarez.png" },
  { id: "lautaro", name: "Лаутаро Мартинес", club: "Интер", position: "Нападающий", image: "/players/lautaro-martinez.png" },
  { id: "lukeba", name: "Кастелло Лукеба", club: "Лейпциг", position: "Центральный защитник", image: "/players/castello-lukeba.png" },
  { id: "laporte", name: "Эмерик Ляпорт", club: "Атлетик", position: "Центральный защитник", image: "/players/aymeric-laporte.png" },
  { id: "gyokeres", name: "Виктор Гёкереш", club: "Арсенал", position: "Нападающий", image: "/players/viktor-gyokeres.png" }
];

export const transferExitPlayers = players.filter((player) => ["balde", "de-jong", "kounde", "christensen"].includes(player.id));

export function positionLabel(position: Position) {
  return { GK: "Вратарь", DF: "Защитник", MF: "Полузащитник", FW: "Нападающий" }[position];
}
