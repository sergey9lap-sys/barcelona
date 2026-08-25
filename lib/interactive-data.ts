import { players, transferTargets, type Player } from "@/lib/data";

export type DecisionOption = {
  value: string;
  label: string;
  detail?: string;
  delta?: number;
};

export type DecisionQuestion = {
  id: string;
  label: string;
  context?: string;
  options: DecisionOption[];
};

export const transferGameTargets = transferTargets.map((target, index) => ({
  ...target,
  fee: [120, 95, 70, 25, 85][index],
  wage: [18, 16, 9, 7, 14][index],
}));

export const transferGameSales = [
  { playerId: "balde", value: 55, wage: 8 },
  { playerId: "de-jong", value: 45, wage: 22 },
  { playerId: "kounde", value: 65, wage: 14 },
  { playerId: "christensen", value: 18, wage: 9 },
].map((item) => ({ ...item, player: players.find((player) => player.id === item.playerId) as Player }));

export const transferBattles = [
  { id: "striker", label: "Главная девятка", left: transferTargets[0], right: transferTargets[1] },
  { id: "centre-back", label: "Центр защиты", left: transferTargets[2], right: transferTargets[3] },
  { id: "finisher", label: "Голевой профиль", left: transferTargets[4], right: transferTargets[0] },
];

export const seasonQuestions: DecisionQuestion[] = [
  { id: "laliga", label: "Место в Ла Лиге", options: ["Чемпион", "2-е место", "3-е место", "Ниже топ-3"].map((label) => ({ value: label, label })) },
  { id: "ucl", label: "Результат в Лиге чемпионов", options: ["Победа", "Финал", "Полуфинал", "Четвертьфинал"].map((label) => ({ value: label, label })) },
  { id: "cups", label: "Сколько трофеев?", options: ["0", "1", "2", "3+"].map((label) => ({ value: label, label })) },
  { id: "scorer", label: "Лучший бомбардир", options: ["Ямаль", "Рафинья", "Гордон", "Адейеми"].map((label) => ({ value: label, label })) },
  { id: "assistant", label: "Лучший ассистент", options: ["Педри", "Ямаль", "Рафинья", "Ольмо"].map((label) => ({ value: label, label })) },
  { id: "mvp", label: "MVP сезона", options: ["Педри", "Ямаль", "Рафинья", "Родри"].map((label) => ({ value: label, label })) },
  { id: "breakout", label: "Главное открытие", options: ["Эспарт", "Хамза", "Пескер", "Бисиву"].map((label) => ({ value: label, label })) },
  { id: "clasico", label: "Кто выиграет больше Класико?", options: ["Барселона", "Поровну", "Реал"].map((label) => ({ value: label, label })) },
];

export const dominoQuestions: DecisionQuestion[] = [
  {
    id: "sale",
    label: "Первый ход: кого продать?",
    context: "Продажа увеличивает доступный бюджет.",
    options: [
      { value: "balde", label: "Бальде", detail: "+€55 млн", delta: 55 },
      { value: "de-jong", label: "Де Йонг", detail: "+€45 млн", delta: 45 },
      { value: "kounde", label: "Кунде", detail: "+€65 млн", delta: 65 },
    ],
  },
  {
    id: "star",
    label: "Второй ход: главная покупка",
    context: "Выберите игрока, вокруг которого строится окно.",
    options: [
      { value: "alvarez", label: "Хулиан Альварес", detail: "−€120 млн", delta: -120 },
      { value: "lautaro", label: "Лаутаро", detail: "−€95 млн", delta: -95 },
      { value: "gyokeres", label: "Гёкереш", detail: "−€85 млн", delta: -85 },
    ],
  },
  {
    id: "balance",
    label: "Третий ход: куда направить остаток?",
    context: "Закройте вторую проблему состава.",
    options: [
      { value: "lukeba", label: "Лукеба · ЦЗ", detail: "−€70 млн", delta: -70 },
      { value: "laporte", label: "Ляпорт · ЦЗ", detail: "−€25 млн", delta: -25 },
      { value: "reserve", label: "Сохранить резерв", detail: "€0", delta: 0 },
    ],
  },
];

export const deadlineQuestions: DecisionQuestion[] = [
  {
    id: "offer",
    label: "За 8 часов до дедлайна «Атлетико» требует €135 млн за Альвареса",
    options: [
      { value: "pay", label: "Заплатить", detail: "Закрыть главную цель" },
      { value: "bonus", label: "Предложить бонусы", detail: "Рискнуть переговорами" },
      { value: "leave", label: "Выйти из сделки", detail: "Сохранить бюджет" },
    ],
  },
  {
    id: "wage",
    label: "Агент просит увеличить зарплату на 25%",
    options: [
      { value: "accept", label: "Согласиться" },
      { value: "signing", label: "Дать подписной бонус" },
      { value: "refuse", label: "Отказать" },
    ],
  },
  {
    id: "defender",
    label: "Лукеба сорвался. Ляпорт доступен за €25 млн",
    options: [
      { value: "laporte", label: "Забрать Ляпорта" },
      { value: "academy", label: "Довериться Ла Масии" },
      { value: "winter", label: "Ждать зимы" },
    ],
  },
  {
    id: "sale",
    label: "Покупатель снизил предложение по Бальде до €42 млн",
    options: [
      { value: "sell", label: "Продать" },
      { value: "counter", label: "Требовать €50 млн" },
      { value: "keep", label: "Оставить" },
    ],
  },
  {
    id: "minute",
    label: "Последний час: доступна аренда молодого нападающего",
    options: [
      { value: "loan", label: "Оформить аренду" },
      { value: "hamza", label: "Дать шанс Хамзе" },
      { value: "none", label: "Закрыть окно" },
    ],
  },
];

export const rotationQuestions: DecisionQuestion[] = [
  {
    id: "elche",
    label: "Эльче · Ла Лига",
    context: "За четыре дня до матча ЛЧ.",
    options: [
      { value: "leaders", label: "Основа на 60 минут", detail: "Минимальный риск результата" },
      { value: "youth", label: "Три молодых в старте", detail: "Максимум ротации" },
      { value: "mixed", label: "Смешанный состав", detail: "Баланс нагрузки" },
    ],
  },
  {
    id: "ucl",
    label: "Интер · Лига чемпионов",
    context: "Главный матч недели.",
    options: [
      { value: "best", label: "Все сильнейшие" },
      { value: "control", label: "Усилить центр поля" },
      { value: "speed", label: "Ставка на скорость" },
    ],
  },
  {
    id: "clasico",
    label: "Реал · Класико",
    context: "Через три дня после Лиги чемпионов.",
    options: [
      { value: "press", label: "Высокий прессинг" },
      { value: "possession", label: "Контроль мяча" },
      { value: "counter", label: "Вертикальные атаки" },
    ],
  },
];

export const roleQuestions: DecisionQuestion[] = [
  { id: "captain", label: "Капитан", options: ["Родри", "Педри", "Рафинья", "Кунде"].map((label) => ({ value: label, label })) },
  { id: "vice", label: "Вице-капитан", options: ["Педри", "Рафинья", "Гави", "Кунде"].map((label) => ({ value: label, label })) },
  { id: "penalty", label: "Пенальти", options: ["Рафинья", "Ямаль", "Ольмо", "Гордон"].map((label) => ({ value: label, label })) },
  { id: "free-kick", label: "Штрафные", options: ["Ямаль", "Рафинья", "Педри", "Ольмо"].map((label) => ({ value: label, label })) },
  { id: "corners", label: "Угловые", options: ["Педри", "Рафинья", "Ямаль", "Ольмо"].map((label) => ({ value: label, label })) },
  { id: "closer", label: "Кого выпускать спасать матч?", options: ["Фермин", "Адейеми", "Гордон", "Хамза"].map((label) => ({ value: label, label })) },
];

export const budgetQuestions: DecisionQuestion[] = [
  {
    id: "centre-back",
    label: "Центральный защитник",
    options: [
      { value: "lukeba", label: "Кастелло Лукеба", detail: "€70 млн", delta: -70 },
      { value: "laporte", label: "Эмерик Ляпорт", detail: "€25 млн", delta: -25 },
      { value: "academy", label: "Довериться академии", detail: "€0", delta: 0 },
    ],
  },
  {
    id: "left-back",
    label: "Левый защитник",
    options: [
      { value: "raum", label: "Давид Раум", detail: "€40 млн", delta: -40 },
      { value: "salinas", label: "Хорхе Салинас", detail: "€12 млн", delta: -12 },
      { value: "keep", label: "Оставить текущую пару", detail: "€0", delta: 0 },
    ],
  },
  {
    id: "striker",
    label: "Нападающий",
    options: [
      { value: "alvarez", label: "Хулиан Альварес", detail: "€120 млн", delta: -120 },
      { value: "gyokeres", label: "Виктор Гёкереш", detail: "€85 млн", delta: -85 },
      { value: "hamza", label: "Дать шанс Хамзе", detail: "€0", delta: 0 },
    ],
  },
];

export const manifestoQuestions: DecisionQuestion[] = [
  { id: "academy", label: "Главный источник усиления", options: [{ value: "project", label: "Ла Масия" }, { value: "aggressive", label: "Трансферы" }] },
  { id: "football", label: "Главный стиль", options: [{ value: "project", label: "Контроль мяча" }, { value: "aggressive", label: "Вертикальный футбол" }] },
  { id: "timeline", label: "Горизонт проекта", options: [{ value: "project", label: "Строить на три года" }, { value: "aggressive", label: "Побеждать прямо сейчас" }] },
  { id: "market", label: "Как тратить бюджет?", options: [{ value: "aggressive", label: "Одна суперзвезда" }, { value: "project", label: "Три точечных усиления" }] },
  { id: "talent", label: "Кому давать спорные минуты?", options: [{ value: "project", label: "Молодому таланту" }, { value: "aggressive", label: "Опытному лидеру" }] },
  { id: "risk", label: "Допустимый риск", options: [{ value: "aggressive", label: "Высокий прессинг и смелость" }, { value: "project", label: "Контроль и стабильность" }] },
];
