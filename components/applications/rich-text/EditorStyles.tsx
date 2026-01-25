"use client";

type Props = {
  rows: number;
  allowLinks: boolean;
};

export function RichTextEditorStyles({ rows, allowLinks }: Props) {
  return (
    <style jsx global>{`
      .ProseMirror {
        outline: none;
        color: #fffffe;
        min-height: ${rows * 1.75}rem;
        line-height: 1.6;
        word-wrap: break-word;
        word-break: break-word;
        overflow-wrap: break-word;
        max-width: 100%;
        overflow-x: hidden;
      }
      .ProseMirror ul,
      .ProseMirror ol {
        margin-left: 1.5rem;
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
        padding-left: 0;
        max-width: 100%;
        word-wrap: break-word;
        word-break: break-word;
        overflow-wrap: break-word;
      }
      .ProseMirror ul {
        list-style-type: disc;
      }
      .ProseMirror ol {
        list-style-type: decimal;
      }
      .ProseMirror li {
        margin-bottom: 0.25rem;
        display: list-item;
        word-wrap: break-word;
        word-break: break-word;
        overflow-wrap: break-word;
        max-width: 100%;
      }
      .ProseMirror h3 {
        font-size: 1.25rem;
        font-weight: bold;
        margin-top: 1rem;
        margin-bottom: 0.5rem;
        color: #fffffe;
        word-wrap: break-word;
        word-break: break-word;
        overflow-wrap: break-word;
        max-width: 100%;
        line-height: 1.4;
      }
      .ProseMirror p {
        margin-bottom: 0.5rem;
        word-wrap: break-word;
        word-break: break-word;
        overflow-wrap: break-word;
        max-width: 100%;
      }
      .ProseMirror p.is-editor-empty:first-child::before {
        content: attr(data-placeholder);
        float: left;
        color: rgba(171, 209, 198, 0.4);
        pointer-events: none;
        height: 0;
      }
      .ProseMirror-focused {
        outline: none;
      }
      .ProseMirror [style*="text-align: left"] {
        text-align: left;
      }
      .ProseMirror [style*="text-align: center"] {
        text-align: center;
      }
      .ProseMirror [style*="text-align: right"] {
        text-align: right;
      }
      ${allowLinks
        ? `
      .ProseMirror a {
        color: #3b82f6;
        text-decoration: underline;
        text-underline-offset: 2px;
      }
      .ProseMirror a:hover {
        color: #60a5fa;
      }
      `
        : ""}
    `}</style>
  );
}
