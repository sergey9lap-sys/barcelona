"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { DownloadButton } from "@/components/DownloadButton";
import { InteractiveShell } from "@/components/InteractiveShell";
import { NextActions } from "@/components/NextActions";
import { SummaryPreview } from "@/components/SummaryPreview";
import { exportSummaryCard } from "@/lib/canvas";
import { transferGameSales, transferGameTargets } from "@/lib/interactive-data";

const STARTING_BUDGET = 80;
const STARTING_WAGE_ROOM = 20;

export function DecoSimulatorInteractive() {
  const [saleIds, setSaleIds] = useState<string[]>([]);
  const [targetIds, setTargetIds] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const selectedSales = transferGameSales.filter((item) => saleIds.includes(item.playerId));
  const selectedTargets = transferGameTargets.filter((item) => targetIds.includes(item.id));
  const budget = STARTING_BUDGET + selectedSales.reduce((sum, item) => sum + item.value, 0) - selectedTargets.reduce((sum, item) => sum + item.fee, 0);
  const wageRoom = STARTING_WAGE_ROOM + selectedSales.reduce((sum, item) => sum + item.wage, 0) - selectedTargets.reduce((sum, item) => sum + item.wage, 0);
  const canExport = selectedTargets.length > 0 && budget >= 0 && wageRoom >= 0;
  const posterImage = selectedTargets[0]?.image ?? "/players/julian-alvarez.png";
  const rows = useMemo(() => [
    { label: "Продано", value: selectedSales.length ? selectedSales.map((item) => item.player.name).join(", ") : "Никого" },
    { label: "Подписано", value: selectedTargets.length ? selectedTargets.map((item) => item.name).join(", ") : "Пока никого" },
    { label: "Остаток бюджета", value: `€${budget} млн` },
    { label: "Запас зарплат", value: `€${wageRoom} млн/год` },
  ], [budget, selectedSales, selectedTargets, wageRoom]);

  function toggleSale(id: string) {
    setSaleIds((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < 3 ? [...current, id] : current);
  }

  function toggleTarget(id: string) {
    setTargetIds((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      const target = transferGameTargets.find((item) => item.id === id)!;
      if (current.length >= 3 || budget - target.fee < 0 || wageRoom - target.wage < 0) return current;
      return [...current, id];
    });
  }

  async function download() {
    setBusy(true);
    try { await exportSummaryCard({ title: "МОЁ ТРАНСФЕРНОЕ ОКНО", kicker: "ТЫ — ДЕКУ", headline: canExport ? "Окно закрыто" : "Соберите кампанию", rows, image: posterImage, footerNote: "Все суммы — условная игровая модель для интерактива.", fileName: "barca-deco-window" }); }
    finally { setBusy(false); }
  }

  return (
    <InteractiveShell step="Ты — Деку · 2 минуты" title="Проведите трансферное окно" description="Продайте до трёх игроков, подпишите до трёх новичков и удержите бюджет вместе с зарплатным лимитом." afterVisible={canExport} after={<NextActions actions={[
      { href: "/transfer-domino", label: "Сыграть в трансферное домино", description: "Три связанных решения меняют одно окно" },
      { href: "/squad-depth", label: "Собрать итоговый состав", description: "Укомплектуйте заявку из 25 игроков" },
    ]} />} preview={
      <SummaryPreview title="Моё трансферное окно" subtitle="Условная модель бюджета и зарплат" headline={canExport ? "Окно закрыто" : undefined} rows={rows} image={posterImage} />
    }>
      <section className="control-panel deco-console">
        <div className="control-title"><h2>Финансовая панель</h2><span>игровая модель</span></div>
        <div className="deco-ledger">
          <div className={budget < 0 ? "is-negative" : ""}><small>Трансферный бюджет</small><strong>€{budget} млн</strong></div>
          <div className={wageRoom < 0 ? "is-negative" : ""}><small>Запас зарплат</small><strong>€{wageRoom} млн/год</strong></div>
        </div>
        <h3 className="subsection-title">Продажи · максимум 3</h3>
        <div className="market-grid">
          {transferGameSales.map((item) => {
            const selected = saleIds.includes(item.playerId);
            return <button key={item.playerId} type="button" className={selected ? "is-selected" : ""} onClick={() => toggleSale(item.playerId)} aria-pressed={selected}>
              <Image src={item.player.image} alt="" width={72} height={88} />
              <span><strong>{item.player.name}</strong><small>+€{item.value} млн · +€{item.wage} млн зарплат</small></span>
            </button>;
          })}
        </div>
        <h3 className="subsection-title">Покупки · максимум 3</h3>
        <div className="market-grid">
          {transferGameTargets.map((item) => {
            const selected = targetIds.includes(item.id);
            const unavailable = !selected && (targetIds.length >= 3 || budget - item.fee < 0 || wageRoom - item.wage < 0);
            return <button key={item.id} type="button" className={selected ? "is-selected" : ""} onClick={() => toggleTarget(item.id)} aria-pressed={selected} disabled={unavailable}>
              <Image src={item.image} alt="" width={72} height={88} />
              <span><strong>{item.name}</strong><small>−€{item.fee} млн · €{item.wage} млн/год</small></span>
            </button>;
          })}
        </div>
        <p className="status-line">Модель специально упрощена: учитывает условную стоимость сделки и годовую зарплату, но не претендует на финансовые данные клуба.</p>
        <DownloadButton onClick={download} disabled={!canExport} busy={busy} />
      </section>
    </InteractiveShell>
  );
}
