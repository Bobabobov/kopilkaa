import Link from "next/link";
import {
  CheckCircle2,
  Clock3,
  ExternalLink,
  Trash2,
  XCircle,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { REJECT_TEMPLATES } from "../_lib/constants";
import type { ModerationItem } from "../_lib/types";

type Props = {
  item: ModerationItem;
  busyId: string | null;
  selected: boolean;
  rejectComment: string;
  onToggleSelect: (id: string) => void;
  onRejectCommentChange: (value: string) => void;
  onCopyId: (id: string) => void;
  onApplyRejectTemplate: (id: string, text: string) => void;
  onUpdateStatus: (id: string, action: "approve" | "reject") => void;
  onDelete: (id: string) => void;
};

export function ModerationCard({
  item,
  busyId,
  selected,
  rejectComment,
  onToggleSelect,
  onRejectCommentChange,
  onCopyId,
  onApplyRejectTemplate,
  onUpdateStatus,
  onDelete,
}: Props) {
  const profileHref = `/profile/${item.user.id}`;

  return (
    <Card
      variant="darkGlass"
      className={`space-y-4 ${
        item.status === "PENDING"
          ? "border border-[#f9bc60]/35 shadow-[0_0_0_1px_rgba(249,188,96,0.12)]"
          : ""
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold text-[#fffffe]">
            {item.taskTitle}
          </h3>
          <div className="mt-1">
            <span className="inline-flex items-center rounded-full border border-[#f9bc60]/35 bg-[#f9bc60]/12 px-2.5 py-1 text-xs font-semibold text-[#ffd89a]">
              Награда: +{item.reward} бонусов
            </span>
          </div>
          <p className="text-xs mt-1 flex items-center gap-2 flex-wrap">
            <span className="text-[#94a1b2]">Статус: </span>
            <span
              className={
                item.status === "APPROVED"
                  ? "text-[#10B981]"
                  : item.status === "REJECTED"
                    ? "text-[#e16162]"
                    : "text-[#f9bc60]"
              }
            >
              {item.status === "APPROVED"
                ? "Подтверждено"
                : item.status === "REJECTED"
                  ? "Отклонено"
                  : "На проверке"}
            </span>
            {item.status === "PENDING" && (
              <span className="inline-flex items-center gap-1 rounded-full border border-[#f9bc60]/35 bg-[#f9bc60]/15 px-2 py-0.5 text-[#f9bc60]">
                <Clock3 className="h-3 w-3" />
                Требует решения
              </span>
            )}
          </p>
        </div>
        <div className="text-xs text-[#94a1b2] text-right">
          <p>Создано: {new Date(item.createdAt).toLocaleString("ru-RU")}</p>
          {item.reviewedAt && (
            <p>Решение: {new Date(item.reviewedAt).toLocaleString("ru-RU")}</p>
          )}
          {item.status === "PENDING" && (
            <label className="mt-2 inline-flex items-center gap-2 text-xs text-[#abd1c6]">
              <input
                type="checkbox"
                checked={selected}
                onChange={() => onToggleSelect(item.id)}
                className="h-4 w-4 rounded border-[#abd1c6]/40 bg-[#003b3a] text-[#f9bc60] focus:ring-[#f9bc60]/40"
              />
              Выбрать
            </label>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-[#abd1c6]/30 bg-[#004643]/45 p-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#f9bc60] mb-1">
          Задание
        </p>
        <p className="text-sm text-[#e6fffb] leading-relaxed">
          {item.taskDescription}
        </p>
      </div>

      {item.storyText?.trim() && (
        <div className="rounded-xl border border-[#f9bc60]/25 bg-[#f9bc60]/8 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#f9bc60] mb-2">
            Рассказ участника
          </p>
          <p className="text-sm text-[#fffffe]/95 whitespace-pre-wrap leading-relaxed break-words [overflow-wrap:anywhere]">
            {item.storyText}
          </p>
          <p className="text-xs text-[#94a1b2] mt-2">
            Длина текста: {item.storyText.trim().length} символов
          </p>
        </div>
      )}

      {item.adminComment && (
        <div className="rounded-xl border border-[#abd1c6]/20 bg-black/10 p-3 text-sm text-[#abd1c6]">
          Комментарий администратора: {item.adminComment}
        </div>
      )}

      <div className="rounded-xl border border-[#abd1c6]/20 bg-black/10 p-2.5">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#94a1b2]">
          Отправитель
        </p>
        <div className="mt-1.5 flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <Link
              href={profileHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex max-w-full items-center gap-1.5 text-sm font-medium text-[#fffffe] underline-offset-4 transition hover:text-[#f9bc60] hover:underline"
            >
              <span className="truncate">
                {item.user.name}
                {item.user.username ? ` (@${item.user.username})` : ""}
              </span>
              <ExternalLink
                className="h-3.5 w-3.5 shrink-0 opacity-70"
                aria-hidden
              />
            </Link>
            {item.user.email && (
              <p className="mt-0.5 truncate text-xs text-[#94a1b2]">
                {item.user.email}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 rounded-lg border-[#abd1c6]/35 px-2.5 text-xs text-[#abd1c6] hover:border-[#f9bc60]/50 hover:bg-[#f9bc60]/10 hover:text-[#fffffe]"
              asChild
            >
              <Link
                href={profileHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                Профиль
              </Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onCopyId(item.id)}
              className="h-8 rounded-lg border-[#abd1c6]/35 px-2.5 text-xs text-[#abd1c6] hover:border-[#f9bc60]/50 hover:bg-[#f9bc60]/10 hover:text-[#fffffe]"
            >
              ID
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {item.media.map((media) => (
          <div
            key={`${item.id}-${media.url}`}
            className="rounded-xl overflow-hidden border border-white/10 bg-black/20"
          >
            {media.type === "VIDEO" ? (
              <video
                src={media.url}
                controls
                className="w-full h-52 object-cover"
              />
            ) : (
              <a href={media.url} target="_blank" rel="noopener noreferrer">
                <img
                  src={media.url}
                  alt="Отчёт по доброму делу"
                  className="w-full h-52 object-cover transition hover:opacity-90"
                />
              </a>
            )}
          </div>
        ))}
      </div>

      {item.status === "PENDING" && (
        <div className="flex flex-wrap gap-2">
          {REJECT_TEMPLATES.map((template) => (
            <button
              key={`${item.id}-${template}`}
              type="button"
              onClick={() => onApplyRejectTemplate(item.id, template)}
              className="rounded-lg border border-[#abd1c6]/25 bg-[#003b3a]/45 px-2.5 py-1 text-xs text-[#abd1c6] hover:border-[#f9bc60]/50 hover:text-[#fffffe]"
            >
              {template}
            </button>
          ))}
        </div>
      )}

      <textarea
        value={rejectComment}
        onChange={(e) => onRejectCommentChange(e.target.value)}
        placeholder="Комментарий для пользователя (обязательно при отклонении)"
        className="w-full min-h-[84px] rounded-xl border border-[#abd1c6]/30 bg-[#003b3a]/70 text-[#fffffe] placeholder:text-[#94a1b2] p-3 text-sm outline-none focus:border-[#f9bc60]"
      />

      <div className="flex flex-col sm:flex-row gap-2">
        {item.status === "PENDING" && (
          <>
            <Button
              onClick={() => onUpdateStatus(item.id, "approve")}
              disabled={busyId === item.id}
              className="bg-[#10B981] hover:bg-[#0fa372] text-white"
            >
              <CheckCircle2 className="w-4 h-4 mr-1" />
              Подтвердить
            </Button>
            <Button
              onClick={() => onUpdateStatus(item.id, "reject")}
              disabled={busyId === item.id}
              className="bg-[#e16162] hover:bg-[#cf5253] text-white"
            >
              <XCircle className="w-4 h-4 mr-1" />
              Отклонить
            </Button>
          </>
        )}
        <Button
          onClick={() => onDelete(item.id)}
          disabled={busyId === item.id}
          className="bg-[#343d49] hover:bg-[#2d3440] text-white"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Удалить
        </Button>
      </div>
    </Card>
  );
}
