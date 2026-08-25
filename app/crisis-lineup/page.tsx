import { LineupInteractive } from "@/components/LineupInteractive";

export default function CrisisLineupPage() {
  return <LineupInteractive step="Кризис состава · 60 секунд" title="Соберите XI без четырёх лидеров" description="Ямаль, Педри, Родри и Кунде недоступны. Найдите рабочий состав 4‑2‑3‑1 и обязательно выпустите минимум двух молодых." previewTitle="Мой антикризисный XI" previewSubtitle="Четыре лидера вне игры · минимум два таланта" exportTitle="МОЙ АНТИКРИЗИСНЫЙ XI" exportKicker="BARÇA · SQUAD CRISIS" fileName="barca-crisis-lineup" unavailableIds={["yamal", "pedri", "rodri", "kounde"]} requiredYouth={2} next={[
    { href: "/la-masia-plan", label: "Распределить минуты молодым", description: "Отдайте 600 минут талантам Ла Масии" },
    { href: "/rotation", label: "Спланировать три матча", description: "Распределите нагрузку на сложной неделе" },
  ]} />;
}
