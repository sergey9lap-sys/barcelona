import { DecisionBoardInteractive } from "@/components/DecisionBoardInteractive";
import { seasonQuestions } from "@/lib/interactive-data";

export default function SeasonPredictorPage() {
  return <DecisionBoardInteractive step="Сезон 2026/27 · 60 секунд" title="Предскажите сезон Барсы" description="Зафиксируйте восемь прогнозов до старта сезона и сохраните карточку, к которой можно вернуться в мае." panelTitle="Восемь прогнозов" previewTitle="Мой прогноз сезона" previewSubtitle="Ла Лига · Лига чемпионов · лидеры команды" exportKicker="BARÇA · SEASON PREDICTOR" fileName="barca-season-predictor" questions={seasonQuestions} frame="season" previewImage="/players/lamine-2026.jpg" next={[
    { href: "/squad-depth", label: "Собрать состав на сезон", description: "Укомплектуйте заявку из 25 футболистов" },
    { href: "/manifesto", label: "Определить свою Барсу", description: "Шесть решений сформируют футбольный манифест" },
  ]} />;
}
