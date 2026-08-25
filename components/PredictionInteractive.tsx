"use client";

import { useState } from "react";

import { DownloadButton } from "@/components/DownloadButton";
import { InteractiveShell } from "@/components/InteractiveShell";
import { NextActions } from "@/components/NextActions";
import { SharePreview } from "@/components/SharePreview";
import { exportChoiceCard } from "@/lib/canvas";
import { MATCH } from "@/lib/config";

const outcomes = [
  { id: "win", label: "Победа Барсы", detail: "Забираем три очка" },
  { id: "draw", label: "Ничья", detail: "Очки будут разделены" },
  { id: "loss", label: "Поражение", detail: "Соперник окажется сильнее" },
];

export function PredictionInteractive() {
  const [homeScore, setHomeScore] = useState(1);
  const [awayScore, setAwayScore] = useState(3);
  const [busy, setBusy] = useState(false);
  const outcome = awayScore > homeScore ? "win" : awayScore === homeScore ? "draw" : "loss";
  const selectedOutcome = outcomes.find((item) => item.id === outcome)!;

  function chooseOutcome(nextOutcome: string) {
    if (nextOutcome === "win") { setHomeScore(1); setAwayScore(2); }
    if (nextOutcome === "draw") { setHomeScore(1); setAwayScore(1); }
    if (nextOutcome === "loss") { setHomeScore(2); setAwayScore(1); }
  }

  function clampScore(value: number) {
    return Math.min(12, Math.max(0, Number.isFinite(value) ? value : 0));
  }

  async function download() {
    setBusy(true);
    try {
      await exportChoiceCard({ title: "МОЙ ПРОГНОЗ НА МАТЧ", kicker: `${MATCH.home} — ${MATCH.away}`, primary: `${homeScore} : ${awayScore}`, secondary: selectedOutcome.label, fileName: "barca-match-prediction" });
    } finally { setBusy(false); }
  }

  return (
    <InteractiveShell step="Перед матчем · 20 секунд" title="Дайте свой прогноз" description="Выберите исход и точный счёт. Никакой регистрации — только ваш прогноз и готовая карточка." preview={
      <SharePreview title="Мой прогноз" subtitle={`${MATCH.home} — ${MATCH.away} · ${MATCH.date}`}>
        <div className="preview-score"><small>{selectedOutcome.label}</small><strong>{homeScore} : {awayScore}</strong><span>{MATCH.time}</span></div>
      </SharePreview>
    }>
      <section className="control-panel">
        <div className="control-title"><h2>Исход матча</h2><span>1 выбор</span></div>
        <div className="choice-grid">
          {outcomes.map((item) => <button key={item.id} className={`choice-card${outcome === item.id ? " is-selected" : ""}`} onClick={() => chooseOutcome(item.id)} type="button"><span><strong>{item.label}</strong><small>{item.detail}</small></span></button>)}
        </div>
      </section>
      <section className="control-panel">
        <div className="control-title"><h2>Точный счёт</h2><span>{MATCH.time}</span></div>
        <div className="score-controls">
          <div className="score-control"><label htmlFor="home-score">{MATCH.home}</label><input id="home-score" type="number" min="0" max="12" value={homeScore} onChange={(event) => setHomeScore(clampScore(Number(event.target.value)))} /></div>
          <div className="score-divider">:</div>
          <div className="score-control"><label htmlFor="away-score">{MATCH.away}</label><input id="away-score" type="number" min="0" max="12" value={awayScore} onChange={(event) => setAwayScore(clampScore(Number(event.target.value)))} /></div>
        </div>
        <DownloadButton onClick={download} busy={busy} />
      </section>
      <NextActions actions={[
        { href: "/sostav", label: "Собрать стартовый состав", description: "Выберите свои 11 игроков на матч" },
        { href: "/fantasy", label: "Собрать Fantasy-пятёрку", description: "Уложитесь в бюджет и назначьте капитана" },
      ]} />
    </InteractiveShell>
  );
}
