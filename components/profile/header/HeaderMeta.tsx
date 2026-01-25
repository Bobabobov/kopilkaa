import { LucideIcons } from "@/components/ui/LucideIcons";

interface HeaderMetaProps {
  isOwner: boolean;
  emailText: string;
  createdText: string;
  showActivity: boolean;
  activityText: string;
}

export function HeaderMeta({
  isOwner,
  emailText,
  createdText,
  showActivity,
  activityText,
}: HeaderMetaProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-white/80 mb-4">
      {isOwner && (
        <span className="inline-flex items-center gap-1.5">
          <LucideIcons.Mail className="w-4 h-4 text-white/70" />
          <span className="truncate max-w-[200px]">{emailText}</span>
        </span>
      )}
      <span className="inline-flex items-center gap-1.5">
        <LucideIcons.Calendar className="w-4 h-4 text-white/70" />
        <span>{createdText}</span>
      </span>
      {showActivity && (
        <span className="inline-flex items-center gap-1.5 hidden sm:inline-flex">
          <LucideIcons.Clock className="w-4 h-4 text-white/70" />
          <span>Активность: {activityText}</span>
        </span>
      )}
    </div>
  );
}
