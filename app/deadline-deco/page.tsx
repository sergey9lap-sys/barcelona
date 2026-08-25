"use client";

import { DecisionBoardInteractive } from "@/components/DecisionBoardInteractive";
import { deadlineQuestions } from "@/lib/interactive-data";

function deriveDirectorType(answers: Record<string, string>) {
  const bold = ["pay", "accept", "laporte", "sell", "loan"].filter((value) => Object.values(answers).includes(value)).length;
  const academy = ["academy", "hamza"].filter((value) => Object.values(answers).includes(value)).length;
  if (academy >= 2) return "Директор Ла Масии";
  if (bold >= 4) return "Охотник за звёздами";
  if (bold <= 1) return "Холодный переговорщик";
  return "Гибкий стратег";
}

export default function DeadlineDecoPage() {
  return <DecisionBoardInteractive step="Deadline Day · 2 минуты" title="Переживите последний день окна" description="Пять ситуаций появляются одна за другой. Решайте быстро — в конце узнаете свой тип спортивного директора." panelTitle="До закрытия окна" previewTitle="Мой дедлайн Деку" previewSubtitle="Пять решений последнего трансферного дня" exportKicker="ТЫ — ДЕКУ · DEADLINE DAY" fileName="barca-deadline-deco" questions={deadlineQuestions} paged frame="deadline" previewImage="/players/aymeric-laporte.png" deriveHeadline={deriveDirectorType} next={[
    { href: "/deco", label: "Провести обычное окно", description: "Соберите продажи и покупки без давления времени" },
    { href: "/transfer-domino", label: "Сыграть в домино", description: "Три сделки с одним изменяемым бюджетом" },
  ]} />;
}
