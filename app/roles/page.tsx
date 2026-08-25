import { DecisionBoardInteractive } from "@/components/DecisionBoardInteractive";
import { roleQuestions } from "@/lib/interactive-data";

export default function RolesPage() {
  return <DecisionBoardInteractive step="Иерархия команды · 40 секунд" title="Назначьте роли в своей Барсе" description="Выберите капитана, исполнителей стандартов и футболиста, который первым выходит спасать матч." panelTitle="Шесть ключевых ролей" previewTitle="Иерархия моей Барсы" previewSubtitle="Лидеры, стандарты и решающий выход" exportKicker="BARÇA · TEAM ROLES" fileName="barca-team-roles" questions={roleQuestions} frame="roles" previewImage="/players/pedri-2026.jpg" next={[
    { href: "/squad-depth", label: "Собрать полную заявку", description: "Выберите 25 игроков для своей команды" },
    { href: "/rotation", label: "Распределить нагрузку", description: "Три матча и три разных плана" },
  ]} />;
}
