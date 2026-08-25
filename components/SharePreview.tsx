import Image from "next/image";
import type { ReactNode } from "react";

import { BRAND_NAME, TELEGRAM_HANDLE } from "@/lib/config";

type Props = {
  title: string;
  subtitle: string;
  children: ReactNode;
  compact?: boolean;
};

export function SharePreview({ title, subtitle, children, compact }: Props) {
  return (
    <div className={`share-preview${compact ? " is-compact" : ""}`}>
      <div className="share-preview-topline">
        <Image src="/club/barca.png" alt="" width={34} height={34} />
        <span>BARÇA · FAN CHOICE</span>
      </div>
      <h2>{title}</h2>
      <p>{subtitle}</p>
      <div className="share-preview-content">{children}</div>
      <footer>
        <strong>{BRAND_NAME}</strong>
        {TELEGRAM_HANDLE ? <span>{TELEGRAM_HANDLE}</span> : null}
      </footer>
    </div>
  );
}
