"use client";

import { ChangeEvent, DragEvent, useCallback } from "react";

interface Props {
  onFiles: (files: FileList | File[]) => void;
}

export default function FileDropzone({ onFiles }: Props) {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files) return;
      onFiles(event.target.files);
    },
    [onFiles],
  );

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (event.dataTransfer.files.length) {
        onFiles(event.dataTransfer.files);
      }
    },
    [onFiles],
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(event) => event.preventDefault()}
      className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed"
    >
      <p className="text-sm text-muted-foreground">PDF veya görsel poliçe belgelerini sürükleyip bırakın</p>
      <label className="cursor-pointer rounded-lg border px-3 py-1 text-sm font-medium">
        Dosya Seç
        <input type="file" multiple className="hidden" onChange={handleChange} />
      </label>
    </div>
  );
}
