"use client";

import Image from "next/image";
import { useState } from "react";

import { DownloadButton } from "@/components/DownloadButton";
import { InteractiveShell } from "@/components/InteractiveShell";
import { NextActions } from "@/components/NextActions";
import { SharePreview } from "@/components/SharePreview";
import { exportPlayerListCard } from "@/lib/canvas";
import { MATCH } from "@/lib/config";
import { rankingPlayers } from "@/lib/data";

export function RankingInteractive() {
  const [orderedIds, setOrderedIds] = useState(rankingPlayers.map((player) => player.id));
  const [busy, setBusy] = useState(false);
  const orderedPlayers = orderedIds.map((id) => rankingPlayers.find((player) => player.id === id)!);

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
    try { await exportPlayerListCard("МОЙ РЕЙТИНГ ИГРОКОВ", `${MATCH.home} — ${MATCH.away}`, orderedPlayers, "barca-player-ranking"); } finally { setBusy(false); }
  }

  return (
    <InteractiveShell step="После матча · 40 секунд" title="Кто был лучшим?" description="Расставьте 16 игроков от лучшего к худшему. Слева места 1–8, справа 9–16 — так же будет выглядеть скачанная карточка." preview={
      <SharePreview title="Мой рейтинг игроков" subtitle={`${MATCH.home} — ${MATCH.away}`} compact>
        <div className="preview-list">{orderedPlayers.map((player, index) => <div key={player.id}><i>{index + 1}</i><Image src={player.image} alt="" width={28} height={28} /><span>{player.name}</span></div>)}</div>
      </SharePreview>
    }>
      <section className="control-panel">
        <div className="control-title"><h2>Ваш порядок</h2><span>16 игроков</span></div>
        <div className="ranking-grid">
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
      <NextActions actions={[
        { href: "/transfer-vhod", label: "Предложить усиление", description: "Выберите, кого Барсе нужно купить первым" },
        { href: "/la-masia", label: "Выбрать талант Ла Масии", description: "Кому следующим дать шанс в основе" },
      ]} />
    </InteractiveShell>
  );
}
