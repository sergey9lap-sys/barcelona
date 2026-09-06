"use client";

import Image from "next/image";
import { ArrowRightLeft, X } from "lucide-react";
import { useState } from "react";

import { DownloadButton } from "@/components/DownloadButton";
import { InteractiveShell } from "@/components/InteractiveShell";
import { NextActions } from "@/components/NextActions";
import { SharePreview } from "@/components/SharePreview";
import { exportPlayerListCard } from "@/lib/canvas";
import { RATING_MATCH } from "@/lib/config";
import { players, positionLabel } from "@/lib/data";

export function RankingInteractive() {
  const rankingPlayers = RATING_MATCH.playedPlayerIds.map((id) => players.find((player) => player.id === id)).filter(Boolean) as typeof players;
  const [orderedIds, setOrderedIds] = useState(rankingPlayers.map((player) => player.id));
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const orderedPlayers = orderedIds.map((id) => rankingPlayers.find((player) => player.id === id)!);
  const rowsPerColumn = Math.ceil(orderedPlayers.length / 2);
  const rankingColumns = [orderedPlayers.slice(0, rowsPerColumn), orderedPlayers.slice(rowsPerColumn)];

  function selectSlot(slot: number) {
    if (selectedSlot === null) {
      setSelectedSlot(slot);
      return;
    }

    if (selectedSlot === slot) {
      setSelectedSlot(null);
      return;
    }

    setOrderedIds((current) => {
      const next = [...current];
      [next[slot], next[selectedSlot]] = [next[selectedSlot], next[slot]];
      return next;
    });
    setSelectedSlot(null);
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
        <p className="ranking-instruction">Нажмите на игрока, которого хотите переставить, а затем — на его новое место.</p>
        {selectedSlot !== null && (
          <div className="ranking-swap-status" role="status">
            <Image src={orderedPlayers[selectedSlot].image} alt="" width={38} height={38} />
            <span><small>Кого переставляем</small><strong>{orderedPlayers[selectedSlot].name}</strong></span>
            <button type="button" onClick={() => setSelectedSlot(null)} aria-label="Отменить выбор"><X /></button>
          </div>
        )}
        <div className="ranking-grid">
          {rankingColumns.map((column, columnIndex) => (
            <div className="ranking-column" key={`column-${columnIndex}`}>
              {column.map((player, rowIndex) => {
                const index = columnIndex * rowsPerColumn + rowIndex;
                const isSelected = selectedSlot === index;
                return (
                  <button
                    className={`rank-slot${isSelected ? " is-selected" : ""}${selectedSlot !== null && !isSelected ? " is-target" : ""}`}
                    key={player.id}
                    type="button"
                    aria-pressed={isSelected}
                    aria-label={isSelected ? `${player.name} выбран. Нажмите ещё раз, чтобы отменить` : `Поставить ${player.name} на ${selectedSlot === null ? "другое" : selectedSlot + 1} место`}
                    onClick={() => selectSlot(index)}
                  >
                    <strong>{index + 1}</strong>
                    <Image src={player.image} alt="" width={52} height={52} />
                    <span><b>{player.name}</b><small>{positionLabel(player.position)}{player.number ? ` · №${player.number}` : ""}</small></span>
                    <ArrowRightLeft aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <DownloadButton onClick={download} busy={busy} />
      </section>
    </InteractiveShell>
  );
}
