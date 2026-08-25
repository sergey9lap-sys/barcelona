import { DecisionBoardInteractive } from "@/components/DecisionBoardInteractive";
import { dominoQuestions } from "@/lib/interactive-data";

export default function TransferDominoPage() {
  return <DecisionBoardInteractive step="Трансферное домино · 45 секунд" title="Проведите цепочку из трёх сделок" description="Каждый ход меняет доступный бюджет следующего. Продайте игрока, выберите звезду и закройте вторую позицию." panelTitle="Три связанных хода" previewTitle="Моё трансферное домино" previewSubtitle="Один выход · две точки усиления" exportKicker="ТЫ — ДЕКУ · TRANSFER DOMINO" fileName="barca-transfer-domino" questions={dominoQuestions} paged frame="domino" previewImage="/players/julian-alvarez.png" startingBalance={80} balanceLabel="Бюджет после ходов" next={[
    { href: "/deco", label: "Открыть полный симулятор Деку", description: "До трёх продаж и трёх покупок с зарплатами" },
    { href: "/deadline-deco", label: "Пережить дедлайн", description: "Пять неожиданных ситуаций последнего дня" },
  ]} />;
}
