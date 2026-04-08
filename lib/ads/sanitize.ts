import sanitizeHtml from "sanitize-html";

export function sanitizeAdHtml(html: string) {
  return sanitizeHtml(html || "", {
    allowedTags: [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "ul",
      "ol",
      "li",
      "h3",
      "blockquote",
      "a",
    ],
    allowedAttributes: {
      "*": ["style"],
      a: ["href", "target", "rel"],
    },
    allowedStyles: {
      "*": {
        "text-align": [/^left$/, /^right$/, /^center$/],
      },
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    transformTags: {
      a: (tagName, attribs) => {
        const href =
          typeof attribs.href === "string" ? attribs.href.trim() : "";
        if (!href) {
          return { tagName: "span", attribs: {}, text: "" };
        }
        return {
          tagName,
          attribs: {
            ...attribs,
            href,
            target: "_blank",
            rel: "noopener noreferrer nofollow",
          },
        };
      },
    },
    disallowedTagsMode: "discard",
  });
}
