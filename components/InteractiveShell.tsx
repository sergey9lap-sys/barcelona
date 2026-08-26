import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { BRAND_NAME } from "@/lib/config";

type Props = {
  className?: string;
  step: string;
  title: string;
  description: string;
  children: ReactNode;
  preview: ReactNode;
  after?: ReactNode;
  afterVisible?: boolean;
};

export function InteractiveShell({ className, step, title, description, children, preview, after, afterVisible = true }: Props) {
  return (
    <main className={`app-shell${className ? ` ${className}` : ""}`}>
      <header className="brand-bar">
        <Link className="brand-lockup" href="/sostav" aria-label="На стартовую страницу">
          <Image src="/club/barca.png" alt="" width={42} height={42} priority />
          <span>
            <strong>{BRAND_NAME}</strong>
            <small>интерактивы для болельщиков</small>
          </span>
        </Link>
        <span className="live-mark"><i /> без регистрации</span>
      </header>

      <section className="workspace">
        <div className="editor-column">
          <div className="page-heading">
            <h1>{title}</h1>
            <p>{step}</p>
            <span>{description}</span>
          </div>
          {children}
        </div>
        <aside className="preview-column" aria-label="Предпросмотр результата">
          <div className="preview-sticky">
            <div className="preview-label"><span>Ваш результат</span><em>PNG · 1080 × 1350</em></div>
            {preview}
          </div>
        </aside>
      </section>
      {after && afterVisible ? <div className="after-result">{after}</div> : null}
    </main>
  );
}
