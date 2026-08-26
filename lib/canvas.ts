import { BRAND_NAME, TELEGRAM_HANDLE } from "@/lib/config";
import { positionLabel, type Player } from "@/lib/data";

type ChoiceCard = {
  title: string;
  kicker: string;
  primary: string;
  secondary: string;
  image?: string;
  fileName: string;
};

export type SummaryRow = {
  label: string;
  value: string;
};

type SummaryCard = {
  title: string;
  kicker: string;
  headline?: string;
  rows: SummaryRow[];
  footerNote?: string;
  image?: string;
  fileName: string;
};

function fitText(context: CanvasRenderingContext2D, value: string, maxWidth: number) {
  if (context.measureText(value).width <= maxWidth) return value;
  let text = value;
  while (text.length > 1 && context.measureText(`${text}…`).width > maxWidth) text = text.slice(0, -1);
  return `${text}…`;
}

function roundedRect(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function wrapText(context: CanvasRenderingContext2D, value: string, maxWidth: number, maxLines = 3) {
  const words = value.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (context.measureText(candidate).width <= maxWidth) {
      current = candidate;
      continue;
    }
    if (current) lines.push(current);
    current = word;
    if (lines.length === maxLines - 1) break;
  }
  if (current && lines.length < maxLines) lines.push(current);
  const consumed = lines.join(" ").length;
  if (consumed < value.length && lines.length) lines[lines.length - 1] = fitText(context, `${lines[lines.length - 1]}…`, maxWidth);
  return lines;
}

function createBase(title: string, kicker: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas недоступен");

  const background = context.createLinearGradient(0, 0, 1080, 1350);
  background.addColorStop(0, "#071733");
  background.addColorStop(0.55, "#0a1430");
  background.addColorStop(1, "#480b2c");
  context.fillStyle = background;
  context.fillRect(0, 0, 1080, 1350);

  const blueGlow = context.createRadialGradient(140, 110, 10, 140, 110, 540);
  blueGlow.addColorStop(0, "rgba(50,105,255,.38)");
  blueGlow.addColorStop(1, "rgba(50,105,255,0)");
  context.fillStyle = blueGlow;
  context.fillRect(0, 0, 700, 650);

  context.fillStyle = "#ffffff";
  context.font = '750 44px "BV Unbounded", "Segoe UI", sans-serif';
  context.fillText(fitText(context, title.toUpperCase(), 950), 64, 82);
  context.fillStyle = "#f5c84b";
  context.font = '700 20px "Segoe UI", sans-serif';
  context.fillText(kicker.toUpperCase(), 64, 132);
  return { canvas, context };
}

function drawFooter(context: CanvasRenderingContext2D) {
  context.strokeStyle = "rgba(255,255,255,.16)";
  context.beginPath();
  context.moveTo(64, 1267);
  context.lineTo(1016, 1267);
  context.stroke();
  context.fillStyle = "rgba(233,239,255,.72)";
  context.font = '600 18px "Segoe UI", sans-serif';
  context.textAlign = "left";
  context.fillText(BRAND_NAME, 64, 1309);
  if (TELEGRAM_HANDLE) {
    context.textAlign = "right";
    context.fillStyle = "#f5c84b";
    context.fillText(TELEGRAM_HANDLE, 1016, 1309);
  }
}

async function triggerDownload(canvas: HTMLCanvasElement, fileName: string) {
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("Не удалось создать PNG");
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}-${Date.now()}.png`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

export async function exportChoiceCard(card: ChoiceCard) {
  await document.fonts.ready;
  const { canvas, context } = createBase(card.title, card.kicker);

  roundedRect(context, 64, 225, 952, 870, 30);
  context.fillStyle = "rgba(5,15,40,.8)";
  context.fill();
  context.strokeStyle = "rgba(137,170,255,.22)";
  context.lineWidth = 2;
  context.stroke();

  if (card.image) {
    try {
      const image = await loadImage(card.image);
      const box = { x: 150, y: 260, w: 780, h: 630 };
      const scale = Math.max(box.w / image.naturalWidth, box.h / image.naturalHeight);
      const w = image.naturalWidth * scale;
      const h = image.naturalHeight * scale;
      context.save();
      roundedRect(context, box.x, box.y, box.w, box.h, 28);
      context.clip();
      context.drawImage(image, box.x + (box.w - w) / 2, box.y + (box.h - h) / 2, w, h);
      context.restore();

      const imageGrade = context.createLinearGradient(0, box.y, 0, box.y + box.h);
      imageGrade.addColorStop(0, "rgba(6, 24, 61, .34)");
      imageGrade.addColorStop(.62, "rgba(5, 17, 46, .52)");
      imageGrade.addColorStop(1, "rgba(5, 14, 39, .94)");
      roundedRect(context, box.x, box.y, box.w, box.h, 28);
      context.fillStyle = imageGrade;
      context.fill();
    } catch {}
  }

  context.textAlign = "center";
  context.fillStyle = "#ffffff";
  context.font = '750 44px "BV Unbounded", "Segoe UI", sans-serif';
  context.fillText(fitText(context, card.primary, 840), 540, 975);
  context.fillStyle = "rgba(220,231,255,.74)";
  context.font = '600 25px "Segoe UI", sans-serif';
  context.fillText(fitText(context, card.secondary, 820), 540, 1024);

  drawFooter(context);
  await triggerDownload(canvas, card.fileName);
}

export async function exportSummaryCard(card: SummaryCard) {
  await document.fonts.ready;
  const { canvas, context } = createBase(card.title, card.kicker);
  if (card.image) {
    try {
      const image = await loadImage(card.image);
      const box = { x: 0, y: 165, w: 1080, h: 1035 };
      const scale = Math.max(box.w / image.naturalWidth, box.h / image.naturalHeight);
      const width = image.naturalWidth * scale;
      const height = image.naturalHeight * scale;
      context.save();
      context.globalAlpha = .24;
      context.drawImage(image, box.x + (box.w - width) / 2, box.y + (box.h - height) / 2, width, height);
      context.restore();
      const grade = context.createLinearGradient(0, box.y, 0, box.y + box.h);
      grade.addColorStop(0, "rgba(4,12,34,.18)");
      grade.addColorStop(.46, "rgba(4,12,34,.72)");
      grade.addColorStop(1, "rgba(38,7,31,.94)");
      context.fillStyle = grade;
      context.fillRect(box.x, box.y, box.w, box.h);
    } catch {}
  }
  const rows = card.rows.slice(0, 12);
  const columns = rows.length > 6 ? 2 : 1;
  const rowsPerColumn = Math.ceil(rows.length / columns);
  const columnWidth = columns === 2 ? 458 : 952;
  const gap = columns === 2 ? 36 : 0;
  const startY = card.headline ? 314 : 250;
  const availableHeight = 920 - (card.headline ? 86 : 0);
  const rowHeight = Math.min(132, Math.floor(availableHeight / Math.max(1, rowsPerColumn)));

  if (card.headline) {
    context.fillStyle = "#f5c84b";
    context.font = '750 30px "BV Unbounded", "Segoe UI", sans-serif';
    context.textAlign = "left";
    context.fillText(fitText(context, card.headline.toUpperCase(), 930), 64, 248);
  }

  rows.forEach((row, index) => {
    const column = Math.floor(index / rowsPerColumn);
    const rowIndex = index % rowsPerColumn;
    const x = 64 + column * (columnWidth + gap);
    const y = startY + rowIndex * rowHeight;

    roundedRect(context, x, y, columnWidth, rowHeight - 12, 18);
    context.fillStyle = "rgba(5,15,40,.78)";
    context.fill();
    context.strokeStyle = "rgba(137,170,255,.2)";
    context.lineWidth = 2;
    context.stroke();

    context.textAlign = "left";
    context.fillStyle = "#f5c84b";
    context.font = '750 15px "Segoe UI", sans-serif';
    context.fillText(fitText(context, row.label.toUpperCase(), columnWidth - 40), x + 20, y + 32);
    context.fillStyle = "#ffffff";
    context.font = `${columns === 2 ? 700 : 750} ${columns === 2 ? 20 : 25}px "Segoe UI", sans-serif`;
    const lines = wrapText(context, row.value, columnWidth - 40, columns === 2 ? 2 : 3);
    lines.forEach((line, lineIndex) => context.fillText(line, x + 20, y + 65 + lineIndex * 26));
  });

  if (card.footerNote) {
    context.fillStyle = "rgba(220,231,255,.68)";
    context.font = '600 17px "Segoe UI", sans-serif';
    context.textAlign = "left";
    context.fillText(fitText(context, card.footerNote, 930), 64, 1218);
  }
  drawFooter(context);
  await triggerDownload(canvas, card.fileName);
}

export async function exportPlayerListCard(title: string, kicker: string, orderedPlayers: Player[], fileName: string) {
  await document.fonts.ready;
  const { canvas, context } = createBase(title, kicker);
  const images = await Promise.all(orderedPlayers.map(async (player) => {
    try { return await loadImage(player.image); } catch { return null; }
  }));

  orderedPlayers.forEach((player, index) => {
    const column = index < 8 ? 0 : 1;
    const row = index % 8;
    const x = column === 0 ? 54 : 550;
    const y = 222 + row * 126;

    roundedRect(context, x, y, 476, 106, 20);
    context.fillStyle = index < 3 ? "rgba(31,66,150,.82)" : "rgba(6,17,44,.82)";
    context.fill();
    context.strokeStyle = index < 3 ? "rgba(225,55,112,.55)" : "rgba(147,178,255,.18)";
    context.lineWidth = 2;
    context.stroke();

    const badge = context.createLinearGradient(x + 14, y + 15, x + 74, y + 91);
    badge.addColorStop(0, "#2d65d5");
    badge.addColorStop(1, "#a81652");
    roundedRect(context, x + 14, y + 16, 60, 74, 16);
    context.fillStyle = badge;
    context.fill();
    context.fillStyle = "#fff";
    context.font = '800 29px "Segoe UI", sans-serif';
    context.textAlign = "center";
    context.fillText(String(index + 1), x + 44, y + 63);

    const image = images[index];
    if (image) {
      context.save();
      context.beginPath();
      context.arc(x + 113, y + 53, 34, 0, Math.PI * 2);
      context.clip();
      const scale = Math.max(68 / image.naturalWidth, 68 / image.naturalHeight);
      const w = image.naturalWidth * scale;
      const h = image.naturalHeight * scale;
      context.drawImage(image, x + 113 - w / 2, y + 19, w, h);
      context.restore();
    }

    context.textAlign = "left";
    context.fillStyle = "#fff";
    context.font = '750 22px "Segoe UI", sans-serif';
    context.fillText(fitText(context, player.name, 270), x + 160, y + 46);
    context.fillStyle = "rgba(221,230,255,.68)";
    context.font = '600 16px "Segoe UI", sans-serif';
    context.fillText(`${positionLabel(player.position)}${player.number ? ` · №${player.number}` : ""}`, x + 160, y + 74);
  });

  drawFooter(context);
  await triggerDownload(canvas, fileName);
}

const lineupPositions = [
  { x: 50, y: 91 },
  { x: 16, y: 76 }, { x: 38, y: 79 }, { x: 62, y: 79 }, { x: 84, y: 76 },
  { x: 35, y: 57 }, { x: 65, y: 57 },
  { x: 18, y: 35 }, { x: 50, y: 42 }, { x: 82, y: 35 },
  { x: 50, y: 18 },
];

export async function exportLineupCard(
  selectedPlayers: Player[],
  fileName = "barca-lineup",
  title = "МОЙ СОСТАВ НА МАТЧ",
  kicker = "BARÇA · MATCHDAY",
  customPositions?: Record<string, { x: number; y: number }>,
) {
  await document.fonts.ready;
  const { canvas, context } = createBase(title, kicker);
  const field = await loadImage("/background/tactical-field-original.png");
  context.save();
  roundedRect(context, 112, 205, 856, 1000, 30);
  context.clip();
  context.drawImage(field, 112, 205, 856, 1000);
  context.fillStyle = "rgba(3,10,30,.14)";
  context.fillRect(112, 205, 856, 1000);
  context.restore();

  const images = await Promise.all(selectedPlayers.map(async (player) => {
    try { return await loadImage(player.image); } catch { return null; }
  }));
  selectedPlayers.forEach((player, index) => {
    const position = customPositions?.[player.id] ?? lineupPositions[index];
    if (!position) return;
    const x = 112 + (position.x / 100) * 856;
    const y = 205 + (position.y / 100) * 1000;
    const image = images[index];

    context.save();
    context.beginPath();
    context.arc(x, y, 40, 0, Math.PI * 2);
    context.clip();
    context.fillStyle = "#102755";
    context.fillRect(x - 40, y - 40, 80, 80);
    if (image) {
      const scale = Math.max(80 / image.naturalWidth, 80 / image.naturalHeight);
      const w = image.naturalWidth * scale;
      const h = image.naturalHeight * scale;
      context.drawImage(image, x - w / 2, y - 40, w, h);
    }
    context.restore();

    roundedRect(context, x - 82, y + 42, 164, 48, 14);
    context.fillStyle = "rgba(4,12,33,.88)";
    context.fill();
    context.textAlign = "center";
    context.fillStyle = "#fff";
    context.font = '700 15px "Segoe UI", sans-serif';
    context.fillText(fitText(context, player.name, 145), x, y + 63);
    context.fillStyle = "#f5c84b";
    context.font = '700 13px "Segoe UI", sans-serif';
    context.fillText(player.number ? `№${player.number}` : positionLabel(player.position), x, y + 81);
  });

  drawFooter(context);
  await triggerDownload(canvas, fileName);
}

export async function exportFantasyCard(selectedPlayers: Player[], captainId: string) {
  await document.fonts.ready;
  const { canvas, context } = createBase("МОЯ FANTASY-ПЯТЁРКА", "BARÇA · FANTASY");
  const images = await Promise.all(selectedPlayers.map(async (player) => {
    try { return await loadImage(player.image); } catch { return null; }
  }));

  selectedPlayers.forEach((player, index) => {
    const x = 74 + index * 190;
    const y = index % 2 === 0 ? 330 : 520;
    roundedRect(context, x, y, 172, 480, 24);
    context.fillStyle = player.id === captainId ? "rgba(35,74,168,.9)" : "rgba(6,17,44,.86)";
    context.fill();
    context.strokeStyle = player.id === captainId ? "#f5c84b" : "rgba(147,178,255,.22)";
    context.lineWidth = 3;
    context.stroke();

    const image = images[index];
    if (image) {
      context.save();
      roundedRect(context, x + 12, y + 12, 148, 300, 18);
      context.clip();
      const scale = Math.max(148 / image.naturalWidth, 300 / image.naturalHeight);
      const w = image.naturalWidth * scale;
      const h = image.naturalHeight * scale;
      context.drawImage(image, x + 86 - w / 2, y + 12, w, h);
      context.restore();
    }
    context.textAlign = "center";
    context.fillStyle = "#fff";
    context.font = '750 21px "Segoe UI", sans-serif';
    context.fillText(fitText(context, player.name, 150), x + 86, y + 355);
    context.fillStyle = "rgba(221,230,255,.68)";
    context.font = '600 15px "Segoe UI", sans-serif';
    context.fillText(`${player.fantasyCost} CR · №${player.number ?? "—"}`, x + 86, y + 390);
    if (player.id === captainId) {
      context.fillStyle = "#f5c84b";
      context.font = '800 15px "Segoe UI", sans-serif';
      context.fillText("КАПИТАН ×2", x + 86, y + 430);
    }
  });

  drawFooter(context);
  await triggerDownload(canvas, "barca-fantasy-five");
}
