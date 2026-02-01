"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import { useEffect, useState } from "react";
import { LucideIcons } from "@/components/ui/LucideIcons";
import {
  getTextLengthFromHtml,
  normalizeUrl,
} from "@/components/applications/rich-text/editorUtils";
import { RichTextEditorStyles } from "@/components/applications/rich-text/EditorStyles";
import { RichTextEditorToolbar } from "@/components/applications/rich-text/EditorToolbar";
import { LinkModal } from "@/components/applications/rich-text/LinkModal";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  rows?: number;
  className?: string;
  allowLinks?: boolean; // Разрешить добавление ссылок
  allowPaste?: boolean; // Разрешить вставку текста
  error?: string; // Сообщение об ошибке
  required?: boolean; // Обязательное поле
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "",
  minLength = 0,
  maxLength,
  rows = 6,
  className = "",
  allowLinks = true,
  allowPaste = false,
  error,
  required = false,
}: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [pasteBlocked, setPasteBlocked] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [3],
        },
      }),
      Underline,
      ...(allowLinks
        ? [
            Link.configure({
              openOnClick: false,
              HTMLAttributes: {
                target: "_blank",
                rel: "noopener noreferrer",
              },
            }),
          ]
        : []),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        defaultAlignment: "left",
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
      handlePaste: () => {
        if (allowPaste) return false;
        // Запрещаем вставку — только ручной ввод
        setPasteBlocked(true);
        if (typeof window !== "undefined") {
          try {
            window.getSelection()?.removeAllRanges();
          } catch {
            // ignore
          }
        }
        return true;
      },
    },
  });

  // Синхронизация value с редактором (извне)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  const textLength = getTextLengthFromHtml(editor.getHTML());
  const isEmpty = textLength === 0;
  const isRequiredEmpty = required && isEmpty;
  const isValidLength =
    textLength >= minLength && (maxLength ? textLength <= maxLength : true);
  const hasError =
    error || isRequiredEmpty || (textLength > 0 && !isValidLength);

  const openLinkInput = (href: string) => {
    setLinkUrl(href || "");
    setShowLinkInput(true);
  };

  const closeLinkInput = () => {
    setShowLinkInput(false);
    setLinkUrl("");
  };

  const applyLink = () => {
    if (linkUrl.trim()) {
      const url = normalizeUrl(linkUrl);
      editor.chain().focus().setLink({ href: url }).run();
    } else {
      editor.chain().focus().unsetLink().run();
    }
    closeLinkInput();
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
    closeLinkInput();
  };

  return (
    <div className={`space-y-2 w-full max-w-full overflow-hidden ${className}`}>
      {pasteBlocked && !allowPaste && (
        <div className="text-[12px] text-[#e16162]">
          Вставка запрещена: введите текст вручную.
        </div>
      )}
      <RichTextEditorToolbar
        editor={editor}
        allowLinks={allowLinks}
        onOpenLink={openLinkInput}
      />

      {/* Модальное окно для ввода ссылки */}
      <LinkModal
        isOpen={allowLinks && showLinkInput}
        value={linkUrl}
        onChange={setLinkUrl}
        onApply={applyLink}
        onRemove={removeLink}
        onClose={closeLinkInput}
      />

      {/* Редактор */}
      <div className="w-full max-w-full overflow-hidden">
        <EditorContent
          editor={editor}
          className={`w-full max-w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
            hasError
              ? editor.isFocused
                ? "border-[#e16162]/60 bg-[#e16162]/8 focus-within:border-[#e16162] focus-within:ring-2 focus-within:ring-[#e16162]/30"
                : "border-[#e16162]/60 bg-[#e16162]/8"
              : editor.isFocused
                ? "border-[#f9bc60] bg-[#abd1c6]/5 focus-within:border-[#f9bc60] focus-within:ring-2 focus-within:ring-[#f9bc60]/50"
                : "border-[#abd1c6]/30 bg-[#004643]/50"
          }`}
        />
      </div>

      {/* Сообщение об ошибке */}
      {hasError && (
        <div className="flex items-center gap-2 text-sm text-[#e16162] mt-1">
          <LucideIcons.XCircle className="w-4 h-4" />
          <span>{error || "Заполните это поле"}</span>
        </div>
      )}

      <RichTextEditorStyles rows={rows} allowLinks={allowLinks} />

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
