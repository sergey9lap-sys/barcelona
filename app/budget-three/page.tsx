import { DecisionBoardInteractive } from "@/components/DecisionBoardInteractive";
import { budgetQuestions } from "@/lib/interactive-data";

export default function BudgetThreePage() {
  return <DecisionBoardInteractive step="€120 млн · 40 секунд" title="Усильте три позиции одним бюджетом" description="Закройте центр защиты, левый фланг и нападение. Дорогая звезда может оставить другие позиции без трансфера." panelTitle="Три проблемные позиции" previewTitle="Как я потратил €120 млн" previewSubtitle="ЦЗ · левый защитник · нападающий" exportKicker="ТЫ — ДЕКУ · €120M CHALLENGE" fileName="barca-budget-three" questions={budgetQuestions} frame="budget" previewImage="/players/castello-lukeba.png" startingBalance={120} balanceLabel="Остаток из €120 млн" next={[
    { href: "/transfer-battle", label: "Сравнить трансферные цели", description: "Три быстрые дуэли игроков по слухам" },
    { href: "/deco", label: "Открыть полный симулятор", description: "Добавьте продажи, зарплаты и несколько покупок" },
  ]} />;
}
