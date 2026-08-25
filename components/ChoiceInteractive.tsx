"use client";

import Image from "next/image";
import { useState } from "react";

import { DownloadButton } from "@/components/DownloadButton";
import { InteractiveShell } from "@/components/InteractiveShell";
import { NextActions } from "@/components/NextActions";
import { SharePreview } from "@/components/SharePreview";
import { exportChoiceCard } from "@/lib/canvas";

export type SimpleChoice = {
  id: string;
  name: string;
  meta: string;
  image: string;
};

type Props = {
  step: string;
  title: string;
  description: string;
  panelTitle: string;
  previewTitle: string;
  previewSubtitle: string;
  exportKicker: string;
  fileName: string;
  choices: SimpleChoice[];
  next: Array<{ href: string; label: string; description: string }>;
};

export function ChoiceInteractive(props: Props) {
  const [selectedId, setSelectedId] = useState(props.choices[0]?.id ?? "");
  const [busy, setBusy] = useState(false);
  const selected = props.choices.find((choice) => choice.id === selectedId)!;

  async function download() {
    setBusy(true);
    try {
      await exportChoiceCard({ title: props.previewTitle, kicker: props.exportKicker, primary: selected.name, secondary: selected.meta, image: selected.image, fileName: props.fileName });
    } finally { setBusy(false); }
  }

  return (
    <InteractiveShell step={props.step} title={props.title} description={props.description} after={<NextActions actions={props.next} />} preview={
      <SharePreview title={props.previewTitle} subtitle={props.previewSubtitle}>
        <div className="preview-choice"><div><Image src={selected.image} alt="" width={270} height={360} /><strong>{selected.name}</strong><span>{selected.meta}</span></div></div>
      </SharePreview>
    }>
      <section className="control-panel">
        <div className="control-title"><h2>{props.panelTitle}</h2><span>1 выбор</span></div>
        <div className="choice-grid">
          {props.choices.map((choice) => (
            <button key={choice.id} className={`choice-card${selectedId === choice.id ? " is-selected" : ""}`} type="button" onClick={() => setSelectedId(choice.id)} aria-pressed={selectedId === choice.id}>
              <Image src={choice.image} alt="" width={200} height={240} />
              <span><strong>{choice.name}</strong><small>{choice.meta}</small></span>
            </button>
          ))}
        </div>
        <DownloadButton onClick={download} busy={busy} />
      </section>
    </InteractiveShell>
  );
}
