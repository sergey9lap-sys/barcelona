"use client";

import { useMemo, useState } from "react";

import { DownloadButton } from "@/components/DownloadButton";
import { InteractiveShell } from "@/components/InteractiveShell";
import { NextActions } from "@/components/NextActions";
import { PlayerTile } from "@/components/PlayerTile";
import { SummaryPreview } from "@/components/SummaryPreview";
import { exportSummaryCard } from "@/lib/canvas";
import { players, positionLabel, type Position } from "@/lib/data";

const limits: Record<Position, number> = { GK: 3, DF: 9, MF: 8, FW: 5 };
const order: Position[] = ["GK", "DF", "MF", "FW"];

export function SquadDepthInteractive() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const selected = useMemo(() => players.filter((player) => selectedIds.includes(player.id)), [selectedIds]);
  const counts = useMemo(() => selected.reduce((result, player) => ({ ...result, [player.position]: result[player.position] + 1 }), { GK: 0, DF: 0, MF: 0, FW: 0 }), [selected]);
  const rows = order.map((position) => ({
    label: `${positionLabel(position)}и · ${counts[position]}/${limits[position]}`,
    value: selected.filter((player) => player.position === position).map((player) => player.name).join(", ") || "Позиция пока не заполнена",
  }));
  const complete = selected.length === 25 && order.every((position) => counts[position] === limits[position]);

  function toggle(id: string) {
    const player = players.find((item) => item.id === id)!;
    setSelectedIds((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= 25 || counts[player.position] >= limits[player.position]) return current;
      return [...current, id];
    });
  }

  async function download() {
    setBusy(true);
    try { await exportSummaryCard({ title: "МОЯ БАРСА · 25 ИГРОКОВ", kicker: "BARÇA · SQUAD DEPTH", headline: "Заявка укомплектована", rows, image: "/background/tactical-field-original.png", footerNote: "3 вратаря · 9 защитников · 8 полузащитников · 5 нападающих", fileName: "barca-squad-depth" }); }
    finally { setBusy(false); }
  }

  return (
    <InteractiveShell step="Состав клуба · 3 минуты" title="Укомплектуйте Барсу из 25 игроков" description="Выберите полную заявку. Лимиты по линиям сразу покажут, где состав перегружен, а где не хватает глубины." afterVisible={complete} after={<NextActions actions={[
      { href: "/deco", label: "Изменить состав трансферами", description: "Продайте игроков и подпишите усиления" },
      { href: "/roles", label: "Назначить роли", description: "Капитан, стандарты и игрок для спасения матча" },
    ]} />} preview={
      <SummaryPreview title="Моя Барса · 25 игроков" subtitle="Полная заявка и глубина по линиям" headline={complete ? "Заявка укомплектована" : `${selected.length} из 25`} rows={rows} image="/background/tactical-field-original.png" />
    }>
      <section className="control-panel">
        <div className="control-title"><h2>Полная заявка</h2><span>{selected.length} / 25</span></div>
        <div className="depth-meter">
          {order.map((position) => <div key={position} className={counts[position] === limits[position] ? "is-complete" : ""}><small>{position}</small><strong>{counts[position]}/{limits[position]}</strong></div>)}
        </div>
        {order.map((position) => (
          <section className="position-section" key={position}>
            <h3>{positionLabel(position)}и</h3>
            <div className="player-grid">
              {players.filter((player) => player.position === position).map((player) => <PlayerTile key={player.id} player={player} selected={selectedIds.includes(player.id)} onClick={() => toggle(player.id)} disabled={!selectedIds.includes(player.id) && (selected.length >= 25 || counts[position] >= limits[position])} />)}
            </div>
          </section>
        ))}
        <DownloadButton onClick={download} disabled={!complete} busy={busy} />
      </section>
    </InteractiveShell>
  );
}
