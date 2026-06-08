"use client";

import { useRef, useState } from "react";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";
import { buildUploadUrl } from "@/lib/uploads/url";
import { getMessageFromApiJson, logRouteCatchError } from "@/lib/api/parseApiError";

interface HeaderCoverSectionProps {
  headerCover?: string | null;
  onCoverChange: (coverUrl: string | null) => void;
}

export function HeaderCoverSection({
  headerCover,
  onCoverChange,
}: HeaderCoverSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const { showToast, ToastComponent } = useBeautifulToast();

  const previewUrl = headerCover ? buildUploadUrl(headerCover) : null;

  const uploadCover = async (file: File) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      showToast("error", "Формат", "Загрузите JPG, PNG или WebP");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      showToast("error", "Размер", "Максимальный размер — 8 МБ");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("cover", file);

      const res = await fetch("/api/profile/header-cover", {
        method: "POST",
        body: formData,
      });
      const json = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          getMessageFromApiJson(json, "Не удалось загрузить обложку"),
        );
      }

      const nextCover = (json?.headerCover as string | null) ?? null;
      onCoverChange(nextCover);
      showToast(
        "success",
        "Обложка загружена",
        "Её видят все пользователи на вашем профиле",
      );
    } catch (error) {
      logRouteCatchError("[HeaderCoverSection] upload", error);
      showToast(
        "error",
        "Не загружено",
        error instanceof Error ? error.message : "Попробуйте позже",
      );
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeCover = async () => {
    setRemoving(true);
    try {
      const res = await fetch("/api/profile/header-cover", { method: "DELETE" });
      const json = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          getMessageFromApiJson(json, "Не удалось удалить обложку"),
        );
      }

      onCoverChange(null);
      showToast("success", "Обложка удалена", "Снова используется выбранная тема");
    } catch (error) {
      logRouteCatchError("[HeaderCoverSection] remove", error);
      showToast(
        "error",
        "Ошибка",
        error instanceof Error ? error.message : "Попробуйте позже",
      );
    } finally {
      setRemoving(false);
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-[#fffffe]">Своя обложка</h3>
          <p className="mt-1 text-sm text-[#abd1c6]">
            Загрузите изображение — оно будет видно всем на вашем профиле.
            Рекомендуемый формат: широкое фото от 1200×400 px.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#abd1c6]/20 bg-[#001e1d]/50">
          <div
            className="relative h-32 w-full bg-gradient-to-br from-[#004643] to-[#001e1d] sm:h-36"
            style={
              previewUrl
                ? {
                    backgroundImage: `url(${previewUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : undefined
            }
          >
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/40 to-transparent px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-white/80">
                {previewUrl ? "Текущая обложка" : "Обложка не загружена"}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-[#abd1c6]/15 p-4 sm:flex-row sm:flex-wrap">
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void uploadCover(file);
              }}
            />
            <button
              type="button"
              disabled={uploading || removing}
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#f9bc60] px-4 py-2.5 text-sm font-semibold text-[#001e1d] transition-colors hover:bg-[#e8a545] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? (
                <LucideIcons.Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LucideIcons.Upload className="h-4 w-4" />
              )}
              {uploading
                ? "Загрузка…"
                : previewUrl
                  ? "Заменить обложку"
                  : "Загрузить обложку"}
            </button>
            {previewUrl && (
              <button
                type="button"
                disabled={uploading || removing}
                onClick={() => void removeCover()}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#abd1c6]/25 px-4 py-2.5 text-sm font-semibold text-[#abd1c6] transition-colors hover:border-red-400/40 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {removing ? (
                  <LucideIcons.Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LucideIcons.Trash2 className="h-4 w-4" />
                )}
                Удалить свою обложку
              </button>
            )}
          </div>
        </div>

        {previewUrl && (
          <p className="text-xs text-[#94a1b2]">
            Своя обложка имеет приоритет над готовой темой. Чтобы вернуться к
            теме, удалите загруженное изображение.
          </p>
        )}
      </div>
      <ToastComponent />
    </>
  );
}
