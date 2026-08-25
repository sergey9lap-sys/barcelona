"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { DownloadButton } from "@/components/DownloadButton";
import { InteractiveShell } from "@/components/InteractiveShell";
import { NextActions } from "@/components/NextActions";
import { PlayerTile } from "@/components/PlayerTile";
import { SharePreview } from "@/components/SharePreview";
import { exportFantasyCard } from "@/lib/canvas";
import { MATCH } from "@/lib/config";
import { players } from "@/lib/data";

const BUDGET = 45;

export function FantasyInteractive() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [captainId, setCaptainId] = useState("");
  const [busy, setBusy] = useState(false);
  const selected = useMemo(() => selectedIds.map((id) => players.find((player) => player.id === id)!).filter(Boolean), [selectedIds]);
  const spent = selected.reduce((sum, player) => sum + player.fantasyCost, 0);

  function toggle(id: string) {
    const player = players.find((item) => item.id === id)!;
    setSelectedIds((current) => {
      if (current.includes(id)) { if (captainId === id) setCaptainId(""); return current.filter((item) => item !== id); }
      if (current.length >= 5 || spent + player.fantasyCost > BUDGET) return current;
      return [...current, id];
    });
  }

  async function download() {
    setBusy(true);
    try { await exportFantasyCard(selected, captainId); } finally { setBusy(false); }
  }

  const ready = selected.length === 5 && Boolean(captainId);
  return (
    <InteractiveShell step="Перед матчем · 40 секунд" title="Соберите Fantasy-пятёрку" description="Выберите любых пять футболистов, уложитесь в 45 CR и назначьте капитана с двойными очками." preview={
      <SharePreview title="Моя Fantasy-пятёрка" subtitle={`${MATCH.home} — ${MATCH.away}`}>
        <div className="preview-five">{selected.map((player) => <div key={player.id}><Image src={player.image} alt="" width={70} height={95} /><strong>{player.name}</strong><span>{player.id === captainId ? "Капитан ×2" : `${player.fantasyCost} CR`}</span></div>)}</div>
      </SharePreview>
    }>
      <section className="control-panel">
        <div className="fantasy-summary"><span>Игроков: <strong>{selected.length} / 5</strong></span><span>Бюджет: <strong>{spent} / {BUDGET} CR</strong></span><span>Осталось: <strong>{BUDGET - spent} CR</strong></span></div>
        <div className="player-grid">{players.map((player) => <PlayerTile key={player.id} player={player} selected={selectedIds.includes(player.id)} onClick={() => toggle(player.id)} meta={`${player.fantasyCost} CR · №${player.number ?? "—"}`} disabled={!selectedIds.includes(player.id) && (selected.length >= 5 || spent + player.fantasyCost > BUDGET)} />)}</div>
      </section>
      {selected.length === 5 ? <section className="control-panel"><div className="control-title"><h2>Назначьте капитана</h2><span>очки ×2</span></div><div className="captain-grid">{selected.map((player) => <button key={player.id} className={captainId === player.id ? "is-selected" : ""} type="button" onClick={() => setCaptainId(player.id)}>{player.name}</button>)}</div><DownloadButton onClick={download} disabled={!ready} busy={busy} /></section> : null}
      <NextActions actions={[
        { href: "/prognoz", label: "Сделать прогноз", description: "Выберите исход и точный счёт" },
        { href: "/sostav", label: "Собрать стартовые 11", description: "Расставьте полный состав на поле" },
      ]} />
    </InteractiveShell>
  );
}
