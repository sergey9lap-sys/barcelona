import { SharePreview } from "@/components/SharePreview";
import type { SummaryRow } from "@/lib/canvas";

type Props = {
  title: string;
  subtitle: string;
  headline?: string;
  rows: SummaryRow[];
  emptyText?: string;
  image?: string;
};

export function SummaryPreview({ title, subtitle, headline, rows, emptyText = "Сделайте выбор — результат появится здесь", image }: Props) {
  return (
    <SharePreview title={title} subtitle={subtitle} backgroundImage={image}>
      <div className="summary-preview">
        {headline ? <strong className="summary-headline">{headline}</strong> : null}
        {rows.length ? (
          <div className="summary-preview-list">
            {rows.map((row) => (
              <div key={`${row.label}-${row.value}`}>
                <small>{row.label}</small>
                <span>{row.value}</span>
              </div>
            ))}
          </div>
        ) : <p className="summary-empty">{emptyText}</p>}
      </div>
    </SharePreview>
  );
}
