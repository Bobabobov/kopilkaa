import { SocialLinks } from "./SocialLinks";

type SocialUser = {
  vkLink?: string | null;
  telegramLink?: string | null;
  youtubeLink?: string | null;
};

interface CtaRowProps {
  hasSocialLinks: boolean;
  user: { id: string } & SocialUser;
}

export function CtaRow({ hasSocialLinks, user }: CtaRowProps) {
  if (!hasSocialLinks) {
    return null;
  }

  return (
    <div className="flex min-w-0 w-full max-w-full flex-wrap items-center gap-1.5 xs:gap-2 sm:gap-3">
      <SocialLinks user={user} />
    </div>
  );
}
