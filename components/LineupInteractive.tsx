"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { DownloadButton } from "@/components/DownloadButton";
import { InteractiveShell } from "@/components/InteractiveShell";
import { NextActions } from "@/components/NextActions";
import { PlayerTile } from "@/components/PlayerTile";
import { SharePreview } from "@/components/SharePreview";
import { exportLineupCard } from "@/lib/canvas";
import { MATCH } from "@/lib/config";
import { players } from "@/lib/data";

type Props = {
  step?: string;
  title?: string;
  description?: string;
  previewTitle?: string;
  previewSubtitle?: string;
  exportTitle?: string;
  exportKicker?: string;
  fileName?: string;
  unavailableIds?: string[];
  requiredYouth?: number;
  next?: Array<{ href: string; label: string; description: string }>;
};

type PitchPosition = { x: number; y: number };

const formationSlots: Record<(typeof players)[number]["position"], PitchPosition[]> = {
  GK: [{ x: 50, y: 90 }],
  DF: [{ x: 15, y: 75 }, { x: 38, y: 78 }, { x: 62, y: 78 }, { x: 85, y: 75 }],
  MF: [{ x: 35, y: 57 }, { x: 65, y: 57 }, { x: 50, y: 42 }, { x: 17, y: 34 }, { x: 83, y: 34 }],
  FW: [{ x: 50, y: 17 }, { x: 17, y: 34 }, { x: 83, y: 34 }, { x: 50, y: 42 }],
};

const positionLimits = { GK: 1, DF: 4, MF: 5, FW: 4 } as const;

export function LineupInteractive({
  step = "Перед матчем · 30 секунд",
  title = "Соберите состав Барсы",
  description = "Выберите 11 футболистов: каждый сразу появится на поле. Перетащите игроков в нужные зоны и скачайте готовую картинку для Telegram.",
  previewTitle = "Мой состав на матч",
  previewSubtitle = `${MATCH.opponent} — Барселона · ${MATCH.date}`,
  exportTitle = "МОЙ СОСТАВ НА МАТЧ",
  exportKicker = "BARÇA · MATCHDAY",
  fileName = "barca-lineup",
  unavailableIds = [],
  requiredYouth = 0,
  next = [
    { href: "/prognoz", label: "Сделать прогноз", description: "Выберите исход и точный счёт матча" },
    { href: "/fantasy", label: "Собрать Fantasy-пятёрку", description: "Пять игроков, бюджет и капитан ×2" },
  ],
}: Props = {}) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pitchPositions, setPitchPositions] = useState<Record<string, PitchPosition>>({});
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const pitchRef = useRef<HTMLDivElement>(null);
  const availablePlayers = useMemo(() => players.filter((player) => !unavailableIds.includes(player.id)), [unavailableIds]);
  const selectedPlayers = useMemo(() => selectedIds.map((id) => availablePlayers.find((player) => player.id === id)).filter(Boolean) as typeof players, [availablePlayers, selectedIds]);
  const positionCounts = useMemo(() => selectedPlayers.reduce((counts, player) => ({ ...counts, [player.position]: counts[player.position] + 1 }), { GK: 0, DF: 0, MF: 0, FW: 0 }), [selectedPlayers]);
  const youthIds = useMemo(() => new Set(["xavi-espart", "alvaro-cortes", "jordi-pesquer", "ebrima-tunkara", "orian-goren", "brian-farinas", "alex-gonzalez", "iker-rodriguez", "hamza"]), []);
  const youthCount = selectedIds.filter((id) => youthIds.has(id)).length;
  const complete = selectedIds.length === 11 && positionCounts.GK === 1 && positionCounts.DF === 4 && positionCounts.MF >= 2 && positionCounts.FW >= 1 && youthCount >= requiredYouth;

  function toggle(id: string) {
    const player = availablePlayers.find((item) => item.id === id)!;
    if (selectedIds.includes(id)) {
      setSelectedIds((current) => current.filter((item) => item !== id));
      setPitchPositions((positions) => {
        const next = { ...positions };
        delete next[id];
        return next;
      });
      return;
    }
    if (selectedIds.length >= 11 || positionCounts[player.position] >= positionLimits[player.position]) return;

    const occupied = Object.values(pitchPositions);
    const slot = formationSlots[player.position].find((candidate) =>
      !occupied.some((position) => Math.abs(position.x - candidate.x) < 1 && Math.abs(position.y - candidate.y) < 1),
    ) ?? formationSlots[player.position].at(-1)!;
    setSelectedIds((current) => [...current, id]);
    setPitchPositions((positions) => ({ ...positions, [id]: slot }));
  }

  const movePlayer = useCallback((id: string, clientX: number, clientY: number) => {
    const field = pitchRef.current;
    if (!field) return;
    const bounds = field.getBoundingClientRect();
    const x = Math.min(92, Math.max(8, ((clientX - bounds.left) / bounds.width) * 100));
    const y = Math.min(93, Math.max(7, ((clientY - bounds.top) / bounds.height) * 100));
    setPitchPositions((positions) => ({ ...positions, [id]: { x, y } }));
  }, []);

  useEffect(() => {
    if (!draggingId) return;

    const previousUserSelect = document.body.style.userSelect;
    document.body.style.userSelect = "none";

    const handleMove = (event: PointerEvent) => {
      event.preventDefault();
      movePlayer(draggingId, event.clientX, event.clientY);
    };
    const handleEnd = () => setDraggingId(null);

    window.addEventListener("pointermove", handleMove, { passive: false });
    window.addEventListener("pointerup", handleEnd);
    window.addEventListener("pointercancel", handleEnd);
    window.addEventListener("blur", handleEnd);

    return () => {
      document.body.style.userSelect = previousUserSelect;
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleEnd);
      window.removeEventListener("pointercancel", handleEnd);
      window.removeEventListener("blur", handleEnd);
    };
  }, [draggingId, movePlayer]);

  function nudgePlayer(id: string, dx: number, dy: number) {
    setPitchPositions((positions) => {
      const current = positions[id];
      if (!current) return positions;
      return { ...positions, [id]: { x: Math.min(92, Math.max(8, current.x + dx)), y: Math.min(93, Math.max(7, current.y + dy)) } };
    });
  }

  async function download() {
    setBusy(true);
    try { await exportLineupCard(selectedPlayers, fileName, exportTitle, exportKicker, pitchPositions); } finally { setBusy(false); }
  }

  const preview = (
    <SharePreview title={previewTitle} subtitle={previewSubtitle}>
      <div className="pitch-preview">
        <div className="pitch-drag-hint">Перетаскивайте игроков</div>
        <div className="pitch-drag-surface" ref={pitchRef}>
        {selectedPlayers.map((player) => {
          const position = pitchPositions[player.id];
          if (!position) return null;
          return (
          <button
            type="button"
            className={`pitch-dot${draggingId === player.id ? " is-dragging" : ""}`}
            key={player.id}
            style={{ left: `${position.x}%`, top: `${position.y}%` }}
            aria-label={`${player.name}. Перетащите по полю или перемещайте стрелками`}
            onPointerDown={(event) => {
              event.preventDefault();
              setDraggingId(player.id);
              movePlayer(player.id, event.clientX, event.clientY);
            }}
            onDragStart={(event) => event.preventDefault()}
            onKeyDown={(event) => {
              const movement = event.shiftKey ? 5 : 2;
              if (event.key === "ArrowLeft") { event.preventDefault(); nudgePlayer(player.id, -movement, 0); }
              if (event.key === "ArrowRight") { event.preventDefault(); nudgePlayer(player.id, movement, 0); }
              if (event.key === "ArrowUp") { event.preventDefault(); nudgePlayer(player.id, 0, -movement); }
              if (event.key === "ArrowDown") { event.preventDefault(); nudgePlayer(player.id, 0, movement); }
            }}
          >
            <Image src={player.image} alt="" width={44} height={44} draggable={false} />
            <span>{player.name}</span>
          </button>
        );})}
        </div>
      </div>
    </SharePreview>
  );

  return (
    <InteractiveShell className="lineup-shell" step={step} title={title} description={description} preview={preview} after={<NextActions actions={next} />} afterVisible={complete}>
      <section className="control-panel">
        <div className="control-title"><h2>Выберите игроков</h2><span>{selectedIds.length} / 11</span></div>
        <div className="player-grid">
          {availablePlayers.map((player) => <PlayerTile key={player.id} player={player} selected={selectedIds.includes(player.id)} onClick={() => toggle(player.id)} disabled={!selectedIds.includes(player.id) && (selectedIds.length >= 11 || positionCounts[player.position] >= positionLimits[player.position])} />)}
        </div>
        <p className="status-line"><strong>Схема:</strong> ВР {positionCounts.GK}/1 · ЗАЩ {positionCounts.DF}/4 · ПЗ {positionCounts.MF} · НАП {positionCounts.FW}.{requiredYouth ? ` Молодые: ${youthCount}/${requiredYouth}.` : ""} {complete ? "Состав готов." : "Нужно минимум 2 полузащитника, 1 нападающий и выполнить условие сценария."}</p>
        <DownloadButton onClick={download} disabled={!complete} busy={busy} />
      </section>
    </InteractiveShell>
  );
}
