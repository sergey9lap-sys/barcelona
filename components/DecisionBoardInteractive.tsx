"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";

import { DownloadButton } from "@/components/DownloadButton";
import { InteractiveShell } from "@/components/InteractiveShell";
import { NextActions } from "@/components/NextActions";
import { SummaryPreview } from "@/components/SummaryPreview";
import { exportSummaryCard, type SummaryRow } from "@/lib/canvas";
import type { DecisionQuestion } from "@/lib/interactive-data";

type Props = {
  step: string;
  title: string;
  description: string;
  panelTitle: string;
  previewTitle: string;
  previewSubtitle: string;
  exportKicker: string;
  fileName: string;
  questions: DecisionQuestion[];
  next: Array<{ href: string; label: string; description: string }>;
  paged?: boolean;
  startingBalance?: number;
  balanceLabel?: string;
  deriveHeadline?: (answers: Record<string, string>) => string;
  previewImage?: string;
  frame?: "season" | "domino" | "deadline" | "rotation" | "roles" | "budget" | "manifesto";
};

export function DecisionBoardInteractive(props: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const selectedOptions = useMemo(() => props.questions.flatMap((question) => {
    const selected = question.options.find((option) => option.value === answers[question.id]);
    return selected ? [{ question, option: selected }] : [];
  }), [answers, props.questions]);
  const balance = props.startingBalance == null ? null : props.startingBalance + selectedOptions.reduce((sum, item) => sum + (item.option.delta ?? 0), 0);
  const complete = selectedOptions.length === props.questions.length;
  const headline = complete ? (props.deriveHeadline?.(answers) ?? "Решение принято") : undefined;
  const rows: SummaryRow[] = selectedOptions.map(({ question, option }) => ({ label: question.label, value: option.label }));
  if (balance != null) rows.push({ label: props.balanceLabel ?? "Остаток бюджета", value: `€${balance} млн` });
  const activeQuestion = props.questions[activeIndex];

  function choose(questionId: string, value: string) {
    setAnswers((current) => ({ ...current, [questionId]: value }));
  }

  function wouldBreakBudget(question: DecisionQuestion, value: string) {
    if (props.startingBalance == null) return false;
    const nextAnswers = { ...answers, [question.id]: value };
    const nextBalance = props.startingBalance + props.questions.reduce((sum, item) => {
      const option = item.options.find((candidate) => candidate.value === nextAnswers[item.id]);
      return sum + (option?.delta ?? 0);
    }, 0);
    return nextBalance < 0;
  }

  async function download() {
    setBusy(true);
    try {
      await exportSummaryCard({ title: props.previewTitle, kicker: props.exportKicker, headline, rows, image: props.previewImage, footerNote: balance != null ? "Суммы — условная игровая модель, не финансовый прогноз клуба." : undefined, fileName: props.fileName });
    } finally { setBusy(false); }
  }

  function renderQuestion(question: DecisionQuestion) {
    return (
      <article className="decision-question" key={question.id}>
        <header>
          <h3>{question.label}</h3>
          {question.context ? <p>{question.context}</p> : null}
        </header>
        <div className="decision-options">
          {question.options.map((option) => {
            const selected = answers[question.id] === option.value;
            const disabled = !selected && wouldBreakBudget(question, option.value);
            return (
              <button key={option.value} className={selected ? "is-selected" : ""} type="button" onClick={() => choose(question.id, option.value)} aria-pressed={selected} disabled={disabled}>
                <span>{option.label}</span>
                {option.detail ? <small>{option.detail}</small> : null}
              </button>
            );
          })}
        </div>
      </article>
    );
  }

  return (
    <InteractiveShell step={props.step} title={props.title} description={props.description} after={<NextActions actions={props.next} />} afterVisible={complete} preview={
      <SummaryPreview title={props.previewTitle} subtitle={props.previewSubtitle} headline={headline} rows={rows} image={props.previewImage} />
    }>
      <section className="control-panel">
        <div className="control-title">
          <h2>{props.panelTitle}</h2>
          <span>{selectedOptions.length} / {props.questions.length}</span>
        </div>
        {balance != null ? <div className={`budget-signal${balance < 20 ? " is-tight" : ""}`}><small>{props.balanceLabel ?? "Доступный бюджет"}</small><strong>€{balance} млн</strong></div> : null}
        {props.paged ? (
          <div className={`decision-stage mechanic-${props.frame ?? "default"}`}>
            <div className="stage-progress"><span style={{ transform: `scaleX(${(activeIndex + 1) / props.questions.length})` }} /></div>
            {renderQuestion(activeQuestion)}
            <div className="stage-navigation">
              <button className="secondary-action" type="button" onClick={() => setActiveIndex((current) => Math.max(current - 1, 0))} disabled={activeIndex === 0}>
                <ArrowLeft aria-hidden="true" /> Назад
              </button>
              <button className="secondary-action" type="button" onClick={() => setActiveIndex((current) => Math.min(current + 1, props.questions.length - 1))} disabled={!answers[activeQuestion.id] || activeIndex === props.questions.length - 1}>
                Следующая ситуация <ArrowRight aria-hidden="true" />
              </button>
            </div>
          </div>
        ) : <div className={`decision-board mechanic-${props.frame ?? "default"}`}>{props.questions.map(renderQuestion)}</div>}
        <DownloadButton onClick={download} disabled={!complete} busy={busy} />
      </section>
    </InteractiveShell>
  );
}
