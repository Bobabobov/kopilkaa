import { TelegramIcon } from "@/components/ui/icons/TelegramIcon";
import { VKIcon } from "@/components/ui/icons/VKIcon";
import { YouTubeIcon } from "@/components/ui/icons/YouTubeIcon";

interface ReviewSocialLinksProps {
  vkLink?: string | null;
  telegramLink?: string | null;
  youtubeLink?: string | null;
}

export function ReviewSocialLinks({
  vkLink,
  telegramLink,
  youtubeLink,
}: ReviewSocialLinksProps) {
  if (!vkLink && !telegramLink && !youtubeLink) {
    return null;
  }

  return (
    <section className="w-full min-w-0 space-y-2 rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-md sm:p-4 sm:rounded-2xl md:p-5 sm:space-y-3">
      <h3 className="text-xs font-semibold text-white/80 sm:text-sm">
        Социальные сети
      </h3>
      <div className="flex w-full flex-wrap gap-2 sm:gap-2.5">
        {vkLink && (
          <SocialChip href={vkLink} label="VK" color="#4c75a3">
            <VKIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </SocialChip>
        )}
        {telegramLink && (
          <SocialChip href={telegramLink} label="Telegram" color="#229ED9">
            <TelegramIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </SocialChip>
        )}
        {youtubeLink && (
          <SocialChip href={youtubeLink} label="YouTube" color="#ff4f45">
            <YouTubeIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </SocialChip>
        )}
      </div>
    </section>
  );
}

function SocialChip({
  href,
  label,
  color,
  children,
}: {
  href: string;
  label: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-full border border-transparent px-2.5 py-1.5 text-[10px] font-semibold tracking-wide text-white transition-colors hover:text-white/90 xs:text-xs sm:gap-2 sm:px-3 sm:py-2 md:px-3.5"
      style={{
        backgroundColor: `${color}22`,
        borderColor: `${color}55`,
        boxShadow: `0 10px 30px -18px ${color}dd`,
      }}
    >
      {children}
      <span className="whitespace-nowrap">{label}</span>
    </a>
  );
}
