"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { DownloadButton } from "@/components/DownloadButton";
import { InteractiveShell } from "@/components/InteractiveShell";
import { NextActions } from "@/components/NextActions";
import { PlayerTile } from "@/components/PlayerTile";
import { SharePreview } from "@/components/SharePreview";
import { exportLineupCard } from "@/lib/canvas";
import { MATCH } from "@/lib/config";
import { players } from "@/lib/data";

const positions = [
  { x: 50, y: 90 },
  { x: 15, y: 75 }, { x: 38, y: 78 }, { x: 62, y: 78 }, { x: 85, y: 75 },
  { x: 35, y: 57 }, { x: 65, y: 57 },
  { x: 17, y: 34 }, { x: 50, y: 42 }, { x: 83, y: 34 },
  { x: 50, y: 17 },
];

const positionLimits = { GK: 1, DF: 4, MF: 5, FW: 4 } as const;

function arrangeLineup(selected: typeof players) {
  const goalkeeper = selected.find((player) => player.position === "GK");
  const defenders = selected.filter((player) => player.position === "DF");
  const midfielders = selected.filter((player) => player.position === "MF");
  const forwards = selected.filter((player) => player.position === "FW");
  const striker = forwards.at(-1);
  const attackingThree = [...midfielders.slice(2), ...forwards.slice(0, -1)].slice(0, 3);

  if (!goalkeeper || defenders.length !== 4 || midfielders.length < 2 || !striker || attackingThree.length !== 3) return [];
  return [goalkeeper, ...defenders, ...midfielders.slice(0, 2), ...attackingThree, striker];
}

export function LineupInteractive() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const selectedPlayers = useMemo(() => selectedIds.map((id) => players.find((player) => player.id === id)).filter(Boolean) as typeof players, [selectedIds]);
  const lineupPlayers = useMemo(() => arrangeLineup(selectedPlayers), [selectedPlayers]);
  const positionCounts = useMemo(() => selectedPlayers.reduce((counts, player) => ({ ...counts, [player.position]: counts[player.position] + 1 }), { GK: 0, DF: 0, MF: 0, FW: 0 }), [selectedPlayers]);

  function toggle(id: string) {
    const player = players.find((item) => item.id === id)!;
    setSelectedIds((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= 11 || positionCounts[player.position] >= positionLimits[player.position]) return current;
      return [...current, id];
    });
  }

  async function download() {
    setBusy(true);
    try { await exportLineupCard(lineupPlayers); } finally { setBusy(false); }
  }

  const preview = (
    <SharePreview title="Мой состав на матч" subtitle={`${MATCH.opponent} — Барселона · ${MATCH.date}`}>
      <div className="pitch-preview">
        {lineupPlayers.map((player, index) => (
          <div className="pitch-dot" key={player.id} style={{ left: `${positions[index].x}%`, top: `${positions[index].y}%` }}>
            <Image src={player.image} alt="" width={44} height={44} />
            <span>{player.name}</span>
          </div>
        ))}
      </div>
    </SharePreview>
  );

  return (
    <InteractiveShell step="Перед матчем · 30 секунд" title="Соберите состав Барсы" description="Выберите 11 футболистов. Мы автоматически расставим их в схеме 4‑2‑3‑1 и подготовим картинку для Telegram." preview={preview}>
      <section className="control-panel">
        <div className="control-title"><h2>Выберите игроков</h2><span>{selectedIds.length} / 11</span></div>
        <div className="player-grid">
          {players.map((player) => <PlayerTile key={player.id} player={player} selected={selectedIds.includes(player.id)} onClick={() => toggle(player.id)} disabled={!selectedIds.includes(player.id) && (selectedIds.length >= 11 || positionCounts[player.position] >= positionLimits[player.position])} />)}
        </div>
        <p className="status-line"><strong>Схема:</strong> ВР {positionCounts.GK}/1 · ЗАЩ {positionCounts.DF}/4 · ПЗ {positionCounts.MF} · НАП {positionCounts.FW}. {lineupPlayers.length === 11 ? "Состав готов." : "Нужно минимум 2 полузащитника и 1 нападающий."}</p>
        <DownloadButton onClick={download} disabled={lineupPlayers.length !== 11} busy={busy} />
      </section>
      <NextActions actions={[
        { href: "/prognoz", label: "Сделать прогноз", description: "Выберите исход и точный счёт матча" },
        { href: "/fantasy", label: "Собрать Fantasy-пятёрку", description: "Пять игроков, бюджет и капитан ×2" },
      ]} />
    </InteractiveShell>
  );
}
