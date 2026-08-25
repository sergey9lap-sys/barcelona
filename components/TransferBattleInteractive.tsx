"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { DownloadButton } from "@/components/DownloadButton";
import { InteractiveShell } from "@/components/InteractiveShell";
import { NextActions } from "@/components/NextActions";
import { SummaryPreview } from "@/components/SummaryPreview";
import { exportSummaryCard } from "@/lib/canvas";
import { transferBattles } from "@/lib/interactive-data";

export function TransferBattleInteractive() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const rows = useMemo(() => transferBattles.flatMap((battle) => {
    const target = [battle.left, battle.right].find((item) => item.id === answers[battle.id]);
    return target ? [{ label: battle.label, value: target.name }] : [];
  }), [answers]);
  const complete = rows.length === transferBattles.length;
  const leadWinner = transferBattles.flatMap((battle) => [battle.left, battle.right]).find((target) => target.id === answers[transferBattles[0].id]);

  async function download() {
    setBusy(true);
    try { await exportSummaryCard({ title: "МОЙ ТРАНСФЕРНЫЙ ШОРТ-ЛИСТ", kicker: "BARÇA · TRANSFER BATTLE", headline: "Три победителя", rows, image: leadWinner?.image ?? "/players/julian-alvarez.png", fileName: "barca-transfer-battle" }); }
    finally { setBusy(false); }
  }

  return (
    <InteractiveShell step="Трансферные слухи · 30 секунд" title="Кого подписать?" description="Выберите победителя в каждой паре слухов. Из трёх решений соберётся ваш персональный шорт-лист." afterVisible={complete} after={<NextActions actions={[
      { href: "/deco", label: "Провести своё трансферное окно", description: "Продажи, покупки и условный лимит FFP" },
      { href: "/budget-three", label: "Распределить €120 млн", description: "Усилить сразу три проблемные позиции" },
    ]} />} preview={
      <SummaryPreview title="Мой трансферный шорт-лист" subtitle="Победители трёх трансферных дуэлей" headline={complete ? "Три победителя" : undefined} rows={rows} image={leadWinner?.image ?? "/players/julian-alvarez.png"} />
    }>
      <section className="control-panel">
        <div className="control-title"><h2>Трансферные дуэли</h2><span>{rows.length} / {transferBattles.length}</span></div>
        <div className="battle-list">
          {transferBattles.map((battle) => (
            <article className="battle-row" key={battle.id}>
              <h3>{battle.label}</h3>
              <div>
                {[battle.left, battle.right].map((target) => {
                  const selected = answers[battle.id] === target.id;
                  return (
                    <button key={target.id} type="button" className={selected ? "is-selected" : ""} onClick={() => setAnswers((current) => ({ ...current, [battle.id]: target.id }))} aria-pressed={selected}>
                      <Image src={target.image} alt="" width={124} height={150} />
                      <span><strong>{target.name}</strong><small>{target.position} · {target.club}</small></span>
                    </button>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
        <DownloadButton onClick={download} disabled={!complete} busy={busy} />
      </section>
    </InteractiveShell>
  );
}
