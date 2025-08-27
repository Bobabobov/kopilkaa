// components/ui/ExpandableText.tsx
"use client";
import { useState } from "react";

export default function ExpandableText({
  text,
  threshold = 260,
  className = "",
}: {
  text: string;
  threshold?: number;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const safe = text ?? "";
  const isLong = safe.length > threshold;
  const visible = open || !isLong ? safe : safe.slice(0, threshold) + "…";

  return (
    <div className={`whitespace-pre-line break-words text-anywhere ${className}`}>
      {visible}
      {isLong && (
        <span
          role="button"
          tabIndex={0}
          className="ml-1 underline cursor-pointer select-none inline"
          onClick={() => setOpen((v) => !v)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setOpen((v) => !v);
          }}
        >
          {open ? "Свернуть" : "Показать полностью"}
        </span>
      )}
    </div>
  );
}
