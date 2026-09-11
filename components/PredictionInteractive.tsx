"use client";

import Image from "next/image";
import { useState } from "react";

import { DownloadButton } from "@/components/DownloadButton";
import { InteractiveShell } from "@/components/InteractiveShell";
import { NextActions } from "@/components/NextActions";
import { SharePreview } from "@/components/SharePreview";
import { exportMatchPredictionCard } from "@/lib/canvas";
import { PREDICTION_MATCH as MATCH } from "@/lib/config";

export function PredictionInteractive() {
  const barcaIsHome = MATCH.home === "Барселона";
  const outcomes = [
    { id: "win", code: barcaIsHome ? "П1" : "П2", label: "Победа Барсы", detail: "Барса забирает три очка" },
    { id: "draw", code: "X", label: "Ничья", detail: "Команды делят очки" },
    { id: "loss", code: barcaIsHome ? "П2" : "П1", label: "Поражение", detail: `${MATCH.opponent} забирает матч` },
  ];
  const [homeScore, setHomeScore] = useState(barcaIsHome ? 2 : 1);
  const [awayScore, setAwayScore] = useState(barcaIsHome ? 1 : 2);
  const [busy, setBusy] = useState(false);
  const barcaWon = barcaIsHome ? homeScore > awayScore : awayScore > homeScore;
  const outcome = homeScore === awayScore ? "draw" : barcaWon ? "win" : "loss";
  const selectedOutcome = outcomes.find((item) => item.id === outcome)!;

  function chooseOutcome(nextOutcome: string) {
    if (nextOutcome === "win") { setHomeScore(barcaIsHome ? 2 : 1); setAwayScore(barcaIsHome ? 1 : 2); }
    if (nextOutcome === "draw") { setHomeScore(1); setAwayScore(1); }
    if (nextOutcome === "loss") { setHomeScore(barcaIsHome ? 1 : 2); setAwayScore(barcaIsHome ? 2 : 1); }
  }

  function clampScore(value: number) {
    return Math.min(12, Math.max(0, Number.isFinite(value) ? value : 0));
  }

  async function download() {
    setBusy(true);
    try {
      await exportMatchPredictionCard({
        competition: MATCH.competition,
        competitionStage: MATCH.competitionStage,
        competitionLogo: MATCH.competitionLogo,
        competitionLogoMonochrome: MATCH.competitionLogoMonochrome,
        home: MATCH.home,
        homeLogo: MATCH.homeLogo,
        away: MATCH.away,
        awayLogo: MATCH.awayLogo,
        date: MATCH.date,
        time: MATCH.time,
        venue: MATCH.venue,
        homeScore,
        awayScore,
        outcome: selectedOutcome.label,
        fileName: "barca-match-prediction",
      });
    } finally { setBusy(false); }
  }

  return (
    <InteractiveShell className="prediction-shell" step="Перед матчем · 20 секунд" title="Дайте свой прогноз" description="Выберите исход и точный счёт. Никакой регистрации — только ваш прогноз и готовая карточка." after={<NextActions actions={[
      { href: "/sostav", label: "Собрать состав Барсы", description: "Выберите стартовые 11 и расставьте их на поле" },
      { href: "/rating", label: "Оценить игроков после матча", description: "Расставьте сыгравших от лучшего к худшему" },
    ]} />} preview={
      <SharePreview title="Мой прогноз" subtitle={`${MATCH.home} — ${MATCH.away} · ${MATCH.time}`}>
        <div className="preview-score">
          <div className="preview-competition"><Image src={MATCH.competitionLogo} alt={MATCH.competition} width={104} height={35} style={MATCH.competitionLogoMonochrome ? { filter: "brightness(0) invert(1)" } : undefined} /></div>
          <small>{selectedOutcome.label}</small>
          <strong>{homeScore} : {awayScore}</strong>
          <div className="preview-score-teams"><span>{MATCH.home}</span><i>—</i><span>{MATCH.away}</span></div>
          <b>{MATCH.time}</b>
        </div>
      </SharePreview>
    }>
      <section className="control-panel">
        <div className="prediction-matchup" aria-label={`${MATCH.home} против ${MATCH.away}, начало в ${MATCH.time}`}>
          <div className="match-competition">
            <Image src={MATCH.competitionLogo} alt={MATCH.competition} width={98} height={33} style={MATCH.competitionLogoMonochrome ? { filter: "brightness(0) invert(1)" } : undefined} />
            <span>{MATCH.competitionStage}</span>
          </div>
          <div className="prediction-team">
            <Image src={MATCH.homeLogo} alt={`Эмблема ${MATCH.home}`} width={54} height={54} />
            <span><small>Хозяева</small><strong>{MATCH.home}</strong></span>
          </div>
          <div className="prediction-kickoff"><small>Начало матча</small><strong>{MATCH.time}</strong><span>{MATCH.venue}</span></div>
          <div className="prediction-team is-away">
            <Image src={MATCH.awayLogo} alt={`Эмблема ${MATCH.away}`} width={58} height={58} />
            <span><small>Гости</small><strong>{MATCH.away}</strong></span>
          </div>
        </div>
        <div className="control-title"><h2>Как закончится матч?</h2><span>Выберите исход</span></div>
        <div className="choice-grid">
          {outcomes.map((item) => <button key={item.id} className={`choice-card${outcome === item.id ? " is-selected" : ""}`} onClick={() => chooseOutcome(item.id)} type="button" aria-pressed={outcome === item.id}><b>{item.code}</b><span><strong>{item.label}</strong><small>{item.detail}</small></span></button>)}
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
    </InteractiveShell>
  );
}
