import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type Action = { href: string; label: string; description: string };

export function NextActions({ actions }: { actions: Action[] }) {
  return (
    <section className="next-actions" aria-label="Что сделать дальше">
      <h2>Ещё одно быстрое действие?</h2>
      <div className="next-actions-grid">
        {actions.slice(0, 2).map((action) => (
          <Link key={action.href} href={action.href}>
            <span>{action.label}</span>
            <small>{action.description}</small>
            <ArrowUpRight aria-hidden="true" />
          </Link>
        ))}
      </div>
    </section>
  );
}
