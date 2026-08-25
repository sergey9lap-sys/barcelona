import { ChoiceInteractive } from "@/components/ChoiceInteractive";
import { positionLabel, transferExitPlayers } from "@/lib/data";

export default function TransferOutPage() {
  return <ChoiceInteractive step="Трансферное окно · 20 секунд" title="Кого продать первым?" description="Выберите футболиста, чей трансфер на выход сильнее всего поможет команде." panelTitle="Игроки на выход" previewTitle="Моё решение на выход" previewSubtitle="Кого Барсе стоит продать первым" exportKicker="BARÇA · TRANSFER OUT" fileName="barca-transfer-out" choices={transferExitPlayers.map((player) => ({ id: player.id, name: player.name, meta: `${positionLabel(player.position)} · №${player.number ?? "—"}`, image: player.image }))} next={[
    { href: "/transfer-vhod", label: "Выбрать замену", description: "Кого Барсе нужно купить первым" },
    { href: "/la-masia", label: "Довериться Ла Масии", description: "Выберите молодого игрока для основы" },
  ]} />;
}
