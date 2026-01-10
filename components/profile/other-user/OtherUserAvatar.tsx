import { motion } from "framer-motion";
import { getAvatarFrame } from "@/lib/header-customization";
import { TelegramIcon } from "@/components/ui/icons/TelegramIcon";
import { VKIcon } from "@/components/ui/icons/VKIcon";
import { YouTubeIcon } from "@/components/ui/icons/YouTubeIcon";

export interface OtherUserBasic {
  id: string;
  email: string | null;
  name?: string | null;
  createdAt: string;
  avatar?: string | null;
  avatarFrame?: string | null;
  hideEmail?: boolean;
  vkLink?: string | null;
  telegramLink?: string | null;
  youtubeLink?: string | null;
}

export function OtherUserAvatar({ user }: { user: OtherUserBasic }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="text-center mb-5 sm:mb-6"
    >
      <div className="relative inline-block group/avatar">
        {renderAvatarWithFrame(user)}
        {!user.avatar && (
          <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-emerald-500/20 to-green-500/20 blur-sm group-hover/avatar:scale-110 transition-transform duration-500 -z-10" />
        )}
      </div>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-bold text-[#fffffe] mb-2"
      >
        {user.name || "Пользователь"}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-sm text-[#abd1c6]"
      >
        {!user.hideEmail ? user.email : "Email скрыт"}
      </motion.p>

      {(user.vkLink || user.telegramLink || user.youtubeLink) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-4 w-full"
        >
          <p className="text-xs uppercase tracking-wide text-center text-[#abd1c6]/70 mb-2">Соц сети</p>
          <div className="flex flex-wrap justify-center gap-2">
            {user.vkLink && (
              <SocialChip href={user.vkLink} color="#4c75a3" label="VK">
                <VKIcon className="w-4 h-4" />
              </SocialChip>
            )}
            {user.telegramLink && (
              <SocialChip href={user.telegramLink} color="#229ED9" label="Telegram">
                <TelegramIcon className="w-4 h-4" />
              </SocialChip>
            )}
            {user.youtubeLink && (
              <SocialChip href={user.youtubeLink} color="#ff4f45" label="YouTube">
                <YouTubeIcon className="w-4 h-4" />
              </SocialChip>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function renderAvatarWithFrame(user: OtherUserBasic) {
  const frame = getAvatarFrame(user.avatarFrame || "none");
  const frameKey = user.avatarFrame || "none";

  if (frame.type === "image") {
    return (
      <div className="w-24 h-24 rounded-lg mx-auto mb-4 overflow-hidden relative group-hover/avatar:scale-105 transition-transform duration-300">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat rounded-lg"
          style={{ backgroundImage: `url(${(frame as any).imageUrl || "/default-avatar.png"})` }}
        />
        <div className="absolute inset-2 rounded-md overflow-hidden">
          <img
            src={user.avatar || "/default-avatar.png"}
            alt="Аватар"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/default-avatar.png";
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-24 h-24 rounded-lg shadow-2xl mx-auto mb-4 group-hover/avatar:scale-105 transition-transform duration-300 ${frame.className}`}
    >
      <img
        src={user.avatar || "/default-avatar.png"}
        alt="Аватар"
        className={`w-full h-full object-cover rounded-lg ${frameKey === "rainbow" ? "rounded-lg" : ""}`}
        onError={(e) => {
          e.currentTarget.src = "/default-avatar.png";
        }}
      />
    </div>
  );
}

function SocialChip({
  href,
  color,
  label,
  children,
}: {
  href: string;
  color: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold bg-opacity-10 hover:bg-opacity-20 transition-colors"
      style={{ color, borderColor: `${color}99`, backgroundColor: `${color}1A` }}
      aria-label={label}
    >
      {children}
      <span>{label}</span>
    </a>
  );
}
