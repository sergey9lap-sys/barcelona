"use client";

import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

import { DownloadButton } from "@/components/DownloadButton";
import { InteractiveShell } from "@/components/InteractiveShell";
import { NextActions } from "@/components/NextActions";
import { SummaryPreview } from "@/components/SummaryPreview";
import { exportSummaryCard } from "@/lib/canvas";
import { laMasiaPlayers, positionLabel } from "@/lib/data";

const TOTAL_MINUTES = 600;
const STEP = 50;

export function LaMasiaPlanInteractive() {
  const [minutes, setMinutes] = useState<Record<string, number>>({});
  const [busy, setBusy] = useState(false);
  const used = Object.values(minutes).reduce((sum, value) => sum + value, 0);
  const rows = useMemo(() => laMasiaPlayers.filter((player) => (minutes[player.id] ?? 0) > 0).sort((left, right) => (minutes[right.id] ?? 0) - (minutes[left.id] ?? 0)).map((player) => ({ label: player.name, value: `${minutes[player.id]} минут · ${positionLabel(player.position)}` })), [minutes]);
  const complete = used === TOTAL_MINUTES && rows.length >= 2;
  const leadTalent = laMasiaPlayers.find((player) => player.name === rows[0]?.label) ?? laMasiaPlayers.slice().sort((left, right) => (minutes[right.id] ?? 0) - (minutes[left.id] ?? 0))[0];

  function change(id: string, delta: number) {
    setMinutes((current) => {
      const next = Math.max(0, (current[id] ?? 0) + delta);
      const nextTotal = used - (current[id] ?? 0) + next;
      if (nextTotal > TOTAL_MINUTES) return current;
      return { ...current, [id]: next };
    });
  }

  async function download() {
    setBusy(true);
    try { await exportSummaryCard({ title: "МОЙ ПЛАН ЛА МАСИИ", kicker: "BARÇA · 600 MINUTES", headline: "Будущее получает шанс", rows, image: leadTalent?.image, footerNote: "Распределено 600 игровых минут между талантами академии.", fileName: "barca-la-masia-minutes" }); }
    finally { setBusy(false); }
  }

  return (
    <InteractiveShell step="Ла Масия · 2 минуты" title="Кому отдать 600 минут?" description="Распределите ограниченное игровое время между талантами академии и соберите свой план их развития." afterVisible={complete} after={<NextActions actions={[
      { href: "/crisis-lineup", label: "Проверить молодых в кризисе", description: "Соберите состав без четырёх лидеров" },
      { href: "/squad-depth", label: "Добавить их в заявку", description: "Укомплектуйте полный состав из 25 игроков" },
    ]} />} preview={
      <SummaryPreview title="Мой план Ла Масии" subtitle="600 минут для будущего первой команды" headline={complete ? "Будущее получает шанс" : `${used} / ${TOTAL_MINUTES} минут`} rows={rows} image={leadTalent?.image} />
    }>
      <section className="control-panel">
        <div className="control-title"><h2>Банк игрового времени</h2><span>{TOTAL_MINUTES - used} минут осталось</span></div>
        <div className="minutes-track"><span style={{ transform: `scaleX(${used / TOTAL_MINUTES})` }} /></div>
        <div className="minutes-list">
          {laMasiaPlayers.map((player) => (
            <article key={player.id}>
              <Image src={player.image} alt="" width={64} height={76} />
              <span><strong>{player.name}</strong><small>{positionLabel(player.position)}</small></span>
              <div>
                <button type="button" onClick={() => change(player.id, -STEP)} disabled={(minutes[player.id] ?? 0) === 0} aria-label={`Уменьшить минуты для ${player.name}`}><Minus aria-hidden="true" /></button>
                <strong>{minutes[player.id] ?? 0}</strong>
                <button type="button" onClick={() => change(player.id, STEP)} disabled={used >= TOTAL_MINUTES} aria-label={`Добавить минуты для ${player.name}`}><Plus aria-hidden="true" /></button>
              </div>
            </article>
          ))}
        </div>
        <p className="status-line">Шаг — 50 минут. Для готового плана распределите все 600 минут минимум между двумя игроками.</p>
        <DownloadButton onClick={download} disabled={!complete} busy={busy} />
      </section>
    </InteractiveShell>
  );
}
