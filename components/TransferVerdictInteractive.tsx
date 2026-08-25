"use client";

import Image from "next/image";
import { useState } from "react";

import { DownloadButton } from "@/components/DownloadButton";
import { InteractiveShell } from "@/components/InteractiveShell";
import { NextActions } from "@/components/NextActions";
import { SharePreview } from "@/components/SharePreview";
import { exportChoiceCard } from "@/lib/canvas";
import { transferTargets } from "@/lib/data";

const target = transferTargets[0];
const verdicts = [
  { id: "buy", label: "Покупать", detail: "Идеально подходит Барсе" },
  { id: "price", label: "Только за разумную цену", detail: "Интересно, но без переплаты" },
  { id: "skip", label: "Не нужен", detail: "Лучше усилить другую позицию" },
];

export function TransferVerdictInteractive() {
  const [verdictId, setVerdictId] = useState("buy");
  const [busy, setBusy] = useState(false);
  const verdict = verdicts.find((item) => item.id === verdictId)!;

  async function download() {
    setBusy(true);
    try { await exportChoiceCard({ title: "МОЙ ТРАНСФЕРНЫЙ ВЕРДИКТ", kicker: "BARÇA · TRANSFER", primary: verdict.label, secondary: target.name, image: target.image, fileName: "barca-transfer-verdict" }); } finally { setBusy(false); }
  }

  return (
    <InteractiveShell step="Трансферное окно · 20 секунд" title={`${target.name} в Барсе?`} description="Выберите свой вердикт по конкретной трансферной цели и скачайте карточку для обсуждения." preview={
      <SharePreview title="Мой трансферный вердикт" subtitle={`${target.name} · ${target.club}`}>
        <div className="preview-choice"><div><Image src={target.image} alt="" width={270} height={360} /><strong>{verdict.label}</strong><span>{verdict.detail}</span></div></div>
      </SharePreview>
    }>
      <section className="control-panel">
        <div className="control-title"><h2>Ваше решение</h2><span>1 выбор</span></div>
        <div className="choice-grid">{verdicts.map((item) => <button key={item.id} className={`choice-card${verdictId === item.id ? " is-selected" : ""}`} type="button" onClick={() => setVerdictId(item.id)}><span><strong>{item.label}</strong><small>{item.detail}</small></span></button>)}</div>
        <DownloadButton onClick={download} busy={busy} />
      </section>
      <NextActions actions={[
        { href: "/transfer-vhod", label: "Выбрать главную покупку", description: "Кого Барсе нужно подписать первым" },
        { href: "/transfer-vyhod", label: "Выбрать игрока на выход", description: "Кого стоит продать первым" },
      ]} />
    </InteractiveShell>
  );
}
