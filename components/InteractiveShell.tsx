import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { BRAND_NAME } from "@/lib/config";

type Props = {
  step: string;
  title: string;
  description: string;
  children: ReactNode;
  preview: ReactNode;
};

export function InteractiveShell({ step, title, description, children, preview }: Props) {
  return (
    <main className="app-shell">
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
            <p>{step}</p>
            <h1>{title}</h1>
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
    </main>
  );
}
