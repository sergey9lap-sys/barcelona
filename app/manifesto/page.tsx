"use client";

import { DecisionBoardInteractive } from "@/components/DecisionBoardInteractive";
import { manifestoQuestions } from "@/lib/interactive-data";

function deriveManifesto(answers: Record<string, string>) {
  const values = Object.values(answers);
  const project = values.filter((value) => value === "project").length;
  if (project >= 5) return "Барса долгого проекта";
  if (project <= 1) return "Барса максимального риска";
  if (project >= 3) return "Барса умного баланса";
  return "Барса результата сейчас";
}

export default function ManifestoPage() {
  return <DecisionBoardInteractive step="Философия клуба · 45 секунд" title="Соберите манифест своей Барсы" description="Шесть принципиальных выборов определят, какой клуб строили бы именно вы." panelTitle="Ваши футбольные принципы" previewTitle="Манифест моей Барсы" previewSubtitle="Трансферы · стиль · молодёжь · риск" exportKicker="BARÇA · FAN MANIFESTO" fileName="barca-fan-manifesto" questions={manifestoQuestions} frame="manifesto" previewImage="/players/gavi-2026.jpg" deriveHeadline={deriveManifesto} next={[
    { href: "/season-predictor", label: "Предсказать результат проекта", description: "Восемь прогнозов на сезон 2026/27" },
    { href: "/deco", label: "Реализовать манифест", description: "Проведите собственную трансферную кампанию" },
  ]} />;
}
