import { TelegramIcon } from "@/components/ui/icons/TelegramIcon";
import { VKIcon } from "@/components/ui/icons/VKIcon";
import { YouTubeIcon } from "@/components/ui/icons/YouTubeIcon";
import { cn } from "@/lib/utils";

export interface UserSocialLinksProps {
  vkLink?: string | null;
  telegramLink?: string | null;
  youtubeLink?: string | null;
  compact?: boolean;
  className?: string;
}

interface SocialChipProps {
  href: string;
  label: string;
  color: string;
  compact?: boolean;
  children: React.ReactNode;
}

function SocialChip({
  href,
  label,
  color,
  compact = false,
  children,
}: SocialChipProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      onClick={(event) => event.stopPropagation()}
      className={cn(
        "inline-flex items-center rounded-full border font-semibold transition-colors hover:brightness-110",
        compact
          ? "gap-1 px-2 py-1 text-[10px]"
          : "gap-1.5 px-2.5 py-1.5 text-xs",
      )}
      style={{
        color,
        borderColor: `${color}55`,
        backgroundColor: `${color}12`,
      }}
    >
      {children}
      {!compact && <span>{label}</span>}
    </a>
  );
}

export function UserSocialLinks({
  vkLink,
  telegramLink,
  youtubeLink,
  compact = false,
  className,
}: UserSocialLinksProps) {
  if (!vkLink && !telegramLink && !youtubeLink) {
    return null;
  }

  const iconClass = compact ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <div className={cn("inline-flex flex-wrap items-center gap-1.5", className)}>
      {vkLink && (
        <SocialChip href={vkLink} label="VK" color="#4c75a3" compact={compact}>
          <VKIcon className={iconClass} />
        </SocialChip>
      )}
      {telegramLink && (
        <SocialChip
          href={telegramLink}
          label="Telegram"
          color="#229ED9"
          compact={compact}
        >
          <TelegramIcon className={iconClass} />
        </SocialChip>
      )}
      {youtubeLink && (
        <SocialChip
          href={youtubeLink}
          label="YouTube"
          color="#ff4f45"
          compact={compact}
        >
          <YouTubeIcon className={iconClass} />
        </SocialChip>
      )}
    </div>
  );
}
