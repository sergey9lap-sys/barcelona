"use client";

import Image from "next/image";
import { useState } from "react";

import { DownloadButton } from "@/components/DownloadButton";
import { InteractiveShell } from "@/components/InteractiveShell";
import { NextActions } from "@/components/NextActions";
import { SharePreview } from "@/components/SharePreview";
import { exportPlayerListCard } from "@/lib/canvas";
import { RATING_MATCH } from "@/lib/config";
import { players } from "@/lib/data";

export function RankingInteractive() {
  const rankingPlayers = RATING_MATCH.playedPlayerIds.map((id) => players.find((player) => player.id === id)).filter(Boolean) as typeof players;
  const [orderedIds, setOrderedIds] = useState(rankingPlayers.map((player) => player.id));
  const [busy, setBusy] = useState(false);
  const orderedPlayers = orderedIds.map((id) => rankingPlayers.find((player) => player.id === id)!);
  const rowsPerColumn = Math.ceil(orderedPlayers.length / 2);

  function assign(slot: number, id: string) {
    setOrderedIds((current) => {
      const currentIndex = current.indexOf(id);
      const next = [...current];
      [next[slot], next[currentIndex]] = [next[currentIndex], next[slot]];
      return next;
    });
  }

  async function download() {
    setBusy(true);
    try { await exportPlayerListCard("МОЙ РЕЙТИНГ ИГРОКОВ", `${RATING_MATCH.home} — ${RATING_MATCH.away} · ${RATING_MATCH.date}`, orderedPlayers, "barca-player-ranking"); } finally { setBusy(false); }
  }

  return (
    <InteractiveShell className="ranking-shell" step="После матча · 40 секунд" title="Кто был лучшим?" description={`Расставьте ${rankingPlayers.length} сыгравших футболистов от лучшего к худшему. Список обновляется после каждого матча, а результат скачивается готовой карточкой.`} after={<NextActions actions={[
      { href: "/sostav", label: "Собрать состав Барсы", description: "Выберите стартовые 11 и расставьте их на поле" },
      { href: "/prognoz", label: "Сделать прогноз на матч", description: "Выберите исход и точный счёт" },
    ]} />} preview={
      <SharePreview title="Мой рейтинг игроков" subtitle={`${RATING_MATCH.home} — ${RATING_MATCH.away}`} compact>
        <div className="preview-list">{orderedPlayers.map((player, index) => <div key={player.id}><i>{index + 1}</i><Image src={player.image} alt="" width={28} height={28} /><span>{player.name}</span></div>)}</div>
      </SharePreview>
    }>
      <section className="control-panel">
        <div className="control-title"><h2>Ваш порядок</h2><span>{rankingPlayers.length} игроков</span></div>
        {RATING_MATCH.status === "preview" && <p className="ranking-preview-note">Демо-список для проверки механики. После матча здесь останутся только футболисты, которые вышли на поле.</p>}
        <div className="ranking-grid" style={{ gridTemplateRows: `repeat(${rowsPerColumn}, auto)` }}>
          {orderedPlayers.map((player, index) => (
            <div className="rank-slot" key={`slot-${index}`}>
              <strong>{index + 1}</strong><Image src={player.image} alt="" width={40} height={40} />
              <select aria-label={`Игрок на ${index + 1} месте`} value={player.id} onChange={(event) => assign(index, event.target.value)} style={{ colorScheme: "dark" }}>
                {rankingPlayers.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
              </select>
            </div>
          ))}
        </div>
        <DownloadButton onClick={download} busy={busy} />
      </section>
    </InteractiveShell>
  );
}
