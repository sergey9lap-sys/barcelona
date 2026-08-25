import { Download } from "lucide-react";

type Props = {
  onClick: () => void | Promise<void>;
  disabled?: boolean;
  busy?: boolean;
};

export function DownloadButton({ onClick, disabled, busy }: Props) {
  return (
    <button className="primary-action" type="button" onClick={() => void onClick()} disabled={disabled || busy}>
      <Download aria-hidden="true" />
      {busy ? "Создаём картинку…" : "Скачать результат"}
    </button>
  );
}
