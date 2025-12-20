"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { useEffect } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  rows?: number;
  className?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "",
  minLength = 0,
  maxLength,
  rows = 6,
  className = "",
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [3],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        defaultAlignment: 'left',
      }),
      Placeholder.configure({
        placeholder: placeholder,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none",
        style: "min-height: " + rows * 1.75 + "rem;",
      },
    },
  });

  // Синхронизация value с редактором (извне)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  // Подсчет символов (без HTML тегов)
  const getTextLength = (html: string): number => {
    if (!html) return 0;
    const div = document.createElement("div");
    div.innerHTML = html;
    return (div.textContent || div.innerText || "").replace(/\s/g, "").length;
  };

  const textLength = getTextLength(editor.getHTML());

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Панель инструментов */}
      <div className="flex flex-wrap gap-2 p-3 bg-[#001e1d]/40 rounded-xl border border-[#abd1c6]/20">
        {/* Жирный */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
            editor.isActive("bold")
              ? "bg-[#f9bc60] text-[#001e1d]"
              : "bg-[#001e1d]/60 text-[#abd1c6] hover:bg-[#004643]"
          }`}
          title="Жирный (Ctrl+B)"
        >
          <strong>B</strong>
        </button>

        {/* Курсив */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            editor.isActive("italic")
              ? "bg-[#f9bc60] text-[#001e1d]"
              : "bg-[#001e1d]/60 text-[#abd1c6] hover:bg-[#004643]"
          }`}
          title="Курсив (Ctrl+I)"
          style={{ fontStyle: "italic" }}
        >
          I
        </button>

        {/* Подчеркивание */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            editor.isActive("underline")
              ? "bg-[#f9bc60] text-[#001e1d]"
              : "bg-[#001e1d]/60 text-[#abd1c6] hover:bg-[#004643]"
          }`}
          title="Подчеркивание (Ctrl+U)"
          style={{ textDecoration: "underline" }}
        >
          U
        </button>

        <div className="w-px h-8 bg-[#abd1c6]/30" />

        {/* Маркированный список */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-4 py-2 rounded-lg text-lg transition-colors ${
            editor.isActive("bulletList")
              ? "bg-[#f9bc60] text-[#001e1d]"
              : "bg-[#001e1d]/60 text-[#abd1c6] hover:bg-[#004643]"
          }`}
          title="Маркированный список"
        >
          •
        </button>

        {/* Нумерованный список */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            editor.isActive("orderedList")
              ? "bg-[#f9bc60] text-[#001e1d]"
              : "bg-[#001e1d]/60 text-[#abd1c6] hover:bg-[#004643]"
          }`}
          title="Нумерованный список"
        >
          1.
        </button>

        <div className="w-px h-8 bg-[#abd1c6]/30" />

        {/* Выравнивание по левому краю */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            editor.isActive({ textAlign: 'left' })
              ? "bg-[#f9bc60] text-[#001e1d]"
              : "bg-[#001e1d]/60 text-[#abd1c6] hover:bg-[#004643]"
          }`}
          title="Выровнять по левому краю"
        >
          ⬅
        </button>

        {/* Выравнивание по центру */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            editor.isActive({ textAlign: 'center' })
              ? "bg-[#f9bc60] text-[#001e1d]"
              : "bg-[#001e1d]/60 text-[#abd1c6] hover:bg-[#004643]"
          }`}
          title="Выровнять по центру"
        >
          ⬌
        </button>

        {/* Выравнивание по правому краю */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            editor.isActive({ textAlign: 'right' })
              ? "bg-[#f9bc60] text-[#001e1d]"
              : "bg-[#001e1d]/60 text-[#abd1c6] hover:bg-[#004643]"
          }`}
          title="Выровнять по правому краю"
        >
          ➡
        </button>

        <div className="w-px h-8 bg-[#abd1c6]/30" />

        {/* Заголовок */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            editor.isActive("heading", { level: 3 })
              ? "bg-[#f9bc60] text-[#001e1d]"
              : "bg-[#001e1d]/60 text-[#abd1c6] hover:bg-[#004643]"
          }`}
          title="Заголовок"
        >
          H
        </button>

        {/* Очистить форматирование */}
        <button
          type="button"
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          className="px-4 py-2 rounded-lg text-sm transition-colors bg-[#001e1d]/60 text-[#abd1c6] hover:bg-[#004643]"
          title="Очистить форматирование"
        >
          ✕
        </button>
      </div>

      {/* Редактор */}
      <EditorContent
        editor={editor}
        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus-within:border-[#f9bc60] focus-within:ring-2 focus-within:ring-[#f9bc60]/50 ${
          editor.isFocused
            ? "border-[#f9bc60] bg-[#abd1c6]/5"
            : "border-[#abd1c6]/30 bg-[#004643]/50"
        }`}
      />

      {/* Стили для редактора */}
      <style jsx global>{`
        .ProseMirror {
          outline: none;
          color: #fffffe;
          min-height: ${rows * 1.75}rem;
          line-height: 1.6;
        }
        .ProseMirror ul,
        .ProseMirror ol {
          margin-left: 1.5rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
          padding-left: 0;
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
        }
        .ProseMirror h3 {
          font-size: 1.25rem;
          font-weight: bold;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          color: #fffffe;
        }
        .ProseMirror p {
          margin-bottom: 0.5rem;
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
      `}</style>

      {/* Счетчик символов */}
      {maxLength && (
        <div className="flex justify-end">
          <span
            className={`text-sm ${
              textLength > maxLength
                ? "text-red-400"
                : textLength > maxLength * 0.8
                  ? "text-[#f9bc60]"
                  : "text-[#abd1c6]"
            }`}
          >
            {textLength} / {maxLength}
          </span>
        </div>
      )}
    </div>
  );
}
