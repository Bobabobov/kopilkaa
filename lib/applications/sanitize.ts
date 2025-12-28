import sanitizeHtml from "sanitize-html";

export function sanitizeApplicationStoryHtml(html: string) {
  return sanitizeHtml(html || "", {
    allowedTags: ["p", "br", "strong", "em", "u", "ul", "ol", "li", "h3", "blockquote"],
    allowedAttributes: {
      "*": ["style"],
    },
    allowedStyles: {
      "*": {
        "text-align": [/^left$/, /^right$/, /^center$/],
      },
    },
    disallowedTagsMode: "discard",
  });
}

export function getPlainTextLenFromHtml(html: string) {
  const textOnly = sanitizeHtml(html || "", { allowedTags: [], allowedAttributes: {} });
  return textOnly.replace(/\s/g, "").length;
}


