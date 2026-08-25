import { ChoiceInteractive } from "@/components/ChoiceInteractive";
import { laMasiaPlayers, positionLabel } from "@/lib/data";

export default function LaMasiaPage() {
  return <ChoiceInteractive step="Ла Масия · 20 секунд" title="Кому дать шанс в основе?" description="Выберите одного молодого игрока, который следующим должен получить минуты за первую команду." panelTitle="Таланты академии" previewTitle="Мой талант Ла Масии" previewSubtitle="Следующий шанс в первой команде" exportKicker="BARÇA · LA MASIA" fileName="barca-la-masia-pick" choices={laMasiaPlayers.map((player) => ({ id: player.id, name: player.name, meta: `${positionLabel(player.position)}${player.number ? ` · №${player.number}` : ""}`, image: player.image }))} next={[
    { href: "/sostav", label: "Поставить его в состав", description: "Соберите свои стартовые 11 на матч" },
    { href: "/transfer-vhod", label: "Или выбрать трансфер", description: "Кого Барсе нужно купить первым" },
  ]} />;
}
