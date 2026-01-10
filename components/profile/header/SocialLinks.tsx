import { motion } from "framer-motion";
import { VKIcon } from "@/components/ui/icons/VKIcon";
import { TelegramIcon } from "@/components/ui/icons/TelegramIcon";
import { YouTubeIcon } from "@/components/ui/icons/YouTubeIcon";
import { getSafeExternalUrl } from "@/lib/safeExternalUrl";

type SocialUser = {
  vkLink?: string | null;
  telegramLink?: string | null;
  youtubeLink?: string | null;
};

interface SocialLinksProps {
  user: SocialUser;
  className?: string;
}

export function SocialLinks({ user, className }: SocialLinksProps) {
  const vk = getSafeExternalUrl(user.vkLink);
  const tg = getSafeExternalUrl(user.telegramLink);
  const yt = getSafeExternalUrl(user.youtubeLink);

  if (!vk && !tg && !yt) return null;

  return (
    <motion.div
      className={`flex items-center gap-2 flex-nowrap ${className ?? ""}`}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      {vk && (
        <motion.a
          href={vk}
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all"
          aria-label="VK"
          whileHover={{ scale: 1.05 }}
        >
          <VKIcon className="w-5 h-5" />
        </motion.a>
      )}
      {tg && (
        <motion.a
          href={tg}
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all"
          aria-label="Telegram"
          whileHover={{ scale: 1.05 }}
        >
          <TelegramIcon className="w-5 h-5" />
        </motion.a>
      )}
      {yt && (
        <motion.a
          href={yt}
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all"
          aria-label="YouTube"
          whileHover={{ scale: 1.05 }}
        >
          <YouTubeIcon className="w-5 h-5" />
        </motion.a>
      )}
    </motion.div>
  );
}
