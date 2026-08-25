import { ChoiceInteractive } from "@/components/ChoiceInteractive";
import { transferTargets } from "@/lib/data";

export default function TransferInPage() {
  return <ChoiceInteractive step="Трансферное окно · 20 секунд" title="Кого купить первым?" description="Выберите одну главную трансферную цель Барсы и скачайте свой вариант." panelTitle="Трансферные цели" previewTitle="Моя главная покупка" previewSubtitle="Кого Барсе нужно подписать первым" exportKicker="BARÇA · TRANSFER IN" fileName="barca-transfer-in" choices={transferTargets.map((player) => ({ id: player.id, name: player.name, meta: `${player.position} · ${player.club}`, image: player.image }))} next={[
    { href: "/transfer-verdict", label: "Оценить конкретный трансфер", description: "Вынесите вердикт по Хулиану Альваресу" },
    { href: "/transfer-vyhod", label: "Кого продать первым?", description: "Выберите игрока Барсы на выход" },
  ]} />;
}
