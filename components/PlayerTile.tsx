import Image from "next/image";
import { Check } from "lucide-react";

import { positionLabel, type Player } from "@/lib/data";

type Props = {
  player: Player;
  selected: boolean;
  onClick: () => void;
  meta?: string;
  disabled?: boolean;
};

export function PlayerTile({ player, selected, onClick, meta, disabled }: Props) {
  return (
    <button
      type="button"
      className={`player-tile${selected ? " is-selected" : ""}`}
      onClick={onClick}
      aria-pressed={selected}
      disabled={disabled}
    >
      <Image src={player.image} alt="" width={56} height={56} />
      <span>
        <strong>{player.name}</strong>
        <small>{meta ?? `${positionLabel(player.position)}${player.number ? ` · №${player.number}` : ""}`}</small>
      </span>
      <i>{selected ? <Check aria-hidden="true" /> : "+"}</i>
    </button>
  );
}
