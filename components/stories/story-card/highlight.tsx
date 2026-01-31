function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getHighlightTokens(value: string) {
  return Array.from(
    new Set(
      value
        .toLowerCase()
        .split(/\s+/g)
        .map((token) => token.trim())
        .filter(Boolean),
    ),
  ).filter((token) => token.length >= 2);
}

export function renderHighlightedText(text: string, query: string) {
  if (!query.trim()) return text;
  const tokens = getHighlightTokens(query);
  if (!tokens.length) return text;
  const pattern = new RegExp(`(${tokens.map(escapeRegExp).join("|")})`, "gi");
  const parts = text.split(pattern);
  return parts.map((part, idx) =>
    idx % 2 === 1 ? (
      <mark
        key={`${part}-${idx}`}
        className="bg-[#f9bc60]/35 text-[#001e1d] px-1 rounded-sm"
      >
        {part}
      </mark>
    ) : (
      <span key={`${part}-${idx}`}>{part}</span>
    ),
  );
}
