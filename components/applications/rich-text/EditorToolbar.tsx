"use client";

import type { Editor } from "@tiptap/react";

type Props = {
  editor: Editor;
  allowLinks: boolean;
  onOpenLink: (href: string) => void;
};

type ButtonProps = {
  title: string;
  active: boolean;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
};

function ToolbarButton({
  title,
  active,
  onClick,
  className = "",
  children,
}: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm transition-colors ${
        active
          ? "bg-[#f9bc60] text-[#001e1d]"
          : "bg-[#001e1d]/60 text-[#abd1c6] hover:bg-[#004643]"
      } ${className}`}
      title={title}
    >
      {children}
    </button>
  );
}

export function RichTextEditorToolbar({
  editor,
  allowLinks,
  onOpenLink,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2 p-3 bg-[#001e1d]/40 rounded-xl border border-[#abd1c6]/20 w-full max-w-full">
      <ToolbarButton
        title="Жирный (Ctrl+B)"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
        className="font-bold"
      >
        <strong>B</strong>
      </ToolbarButton>

      <ToolbarButton
        title="Курсив (Ctrl+I)"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className="italic"
      >
        I
      </ToolbarButton>

      <ToolbarButton
        title="Подчеркивание (Ctrl+U)"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className="underline"
      >
        U
      </ToolbarButton>

      <div className="w-px h-8 bg-[#abd1c6]/30" />

      <ToolbarButton
        title="Маркированный список"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className="text-lg"
      >
        •
      </ToolbarButton>

      <ToolbarButton
        title="Нумерованный список"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className="font-semibold"
      >
        1.
      </ToolbarButton>

      <div className="w-px h-8 bg-[#abd1c6]/30" />

      <ToolbarButton
        title="Выровнять по левому краю"
        active={editor.isActive({ textAlign: "left" })}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        ⬅
      </ToolbarButton>

      <ToolbarButton
        title="Выровнять по центру"
        active={editor.isActive({ textAlign: "center" })}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        ⬌
      </ToolbarButton>

      <ToolbarButton
        title="Выровнять по правому краю"
        active={editor.isActive({ textAlign: "right" })}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        ➡
      </ToolbarButton>

      <div className="w-px h-8 bg-[#abd1c6]/30" />

      <ToolbarButton
        title="Заголовок"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className="font-semibold"
      >
        H
      </ToolbarButton>

      {allowLinks && <div className="w-px h-8 bg-[#abd1c6]/30" />}

      {allowLinks && (
        <ToolbarButton
          title="Ссылка (Ctrl+K)"
          active={editor.isActive("link")}
          onClick={() => onOpenLink(editor.getAttributes("link")?.href || "")}
          className="font-semibold"
        >
          🔗
        </ToolbarButton>
      )}

      <ToolbarButton
        title="Очистить форматирование"
        active={false}
        onClick={() =>
          editor.chain().focus().clearNodes().unsetAllMarks().run()
        }
      >
        ✕
      </ToolbarButton>
    </div>
  );
}
