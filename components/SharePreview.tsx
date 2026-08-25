import Image from "next/image";
import type { ReactNode } from "react";

import { BRAND_NAME, TELEGRAM_HANDLE } from "@/lib/config";

type Props = {
  title: string;
  subtitle: string;
  children: ReactNode;
  compact?: boolean;
  backgroundImage?: string;
};

export function SharePreview({ title, subtitle, children, compact, backgroundImage }: Props) {
  return (
    <div className={`share-preview${compact ? " is-compact" : ""}`}>
      {backgroundImage ? <Image className="share-preview-backdrop" src={backgroundImage} alt="" fill sizes="(max-width: 820px) 100vw, 470px" /> : null}
      <h2>{title}</h2>
      <div className="share-preview-topline">
        <Image src="/club/barca.png" alt="" width={34} height={34} />
        <span>BARÇA · FAN CHOICE</span>
      </div>
      <p>{subtitle}</p>
      <div className="share-preview-content">{children}</div>
      <footer>
        <strong>{BRAND_NAME}</strong>
        {TELEGRAM_HANDLE ? <span>{TELEGRAM_HANDLE}</span> : null}
      </footer>
    </div>
  );
}
