export const getTextLengthFromHtml = (html: string): number => {
  if (!html) return 0;
  const div = document.createElement("div");
  div.innerHTML = html;
  return (div.textContent || div.innerText || "").replace(/\s/g, "").length;
};

export const normalizeUrl = (input: string): string => {
  const trimmed = input.trim();
  if (!trimmed) return "";
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
};
