import { DecisionBoardInteractive } from "@/components/DecisionBoardInteractive";
import { rotationQuestions } from "@/lib/interactive-data";

export default function RotationPage() {
  return <DecisionBoardInteractive step="Три матча · 45 секунд" title="Спланируйте ротацию недели" description="Эльче, Лига чемпионов и Класико идут почти подряд. Выберите подход к каждому матчу и сохраните свой план." panelTitle="Неделя без права на ошибку" previewTitle="Моя ротация на три матча" previewSubtitle="Ла Лига · Лига чемпионов · Класико" exportKicker="BARÇA · ROTATION PLAN" fileName="barca-three-match-rotation" questions={rotationQuestions} frame="rotation" previewImage="/background/tactical-field-original.png" next={[
    { href: "/crisis-lineup", label: "Собрать кризисный состав", description: "Четыре лидера недоступны, молодые обязательны" },
    { href: "/roles", label: "Назначить лидеров", description: "Капитан, стандарты и главное усиление со скамейки" },
  ]} />;
}
