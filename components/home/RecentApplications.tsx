"use client";

import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { DEFAULT_AVATAR, resolveAvatarUrl } from "@/lib/avatar";
import { UserPublicBadges } from "@/components/users/UserPublicBadges";
import { HomeSectionLayout } from "@/components/home/HomeSectionLayout";
import { buildUploadUrl } from "@/lib/uploads/url";
import type { RecentApplicationItem } from "@/lib/applications/getRecentApplications";

interface RecentApplicationsProps {
  applications: RecentApplicationItem[];
}

const imagePreviewUrl = (url?: string | null): string =>
  url ? buildUploadUrl(url, { variant: "thumb" }) : "/stories-preview.jpg";

export default function RecentApplications({
  applications,
}: RecentApplicationsProps) {
  if (applications.length === 0) {
    return null;
  }

  return (
    <section className="pt-10 pb-24 px-4" id="recent-applications">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span
            className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider mb-4"
            style={{ color: "#f9bc60", letterSpacing: "0.12em" }}
          >
            <Heart className="w-4 h-4" />
            Реальные истории
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold mb-3 tracking-tight"
            style={{ color: "#fffffe" }}
          >
            Истории людей
          </h2>
          <p
            className="text-lg md:text-xl max-w-xl mx-auto"
            style={{ color: "#abd1c6" }}
          >
            Люди, которым уже помогли
          </p>
        </div>

        <HomeSectionLayout ariaLabel="Истории людей">
          {applications.map((app) => {
            const coverUrl = imagePreviewUrl(app.images[0]?.url);
            const avatarUrl = imagePreviewUrl(
              resolveAvatarUrl(app.user?.avatar),
            );
            const createdAt =
              app.createdAt instanceof Date
                ? app.createdAt
                : new Date(app.createdAt);

            return (
              <div key={app.id} className="h-full">
                <Link
                  href={`/stories/${app.id}`}
                  className="group block h-full rounded-2xl overflow-hidden transition-all duration-300 md:hover:scale-[1.02] md:hover:shadow-xl"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                    boxShadow:
                      "0 4px 24px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.08)",
                  }}
                >
                  <div className="relative h-44 sm:h-52 overflow-hidden">
                    <img
                      src={coverUrl}
                      alt={app.title}
                      loading="lazy"
                      decoding="async"
                      width={640}
                      height={360}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 md:group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = "/stories-preview.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <span
                      className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-semibold"
                      style={{
                        background: "rgba(249, 188, 96, 0.95)",
                        color: "#001e1d",
                      }}
                    >
                      Помогли
                    </span>
                  </div>

                  <div className="p-5 sm:p-6">
                    <h3
                      className="text-lg font-bold mb-2 line-clamp-2 leading-snug transition-colors group-hover:text-[#f9bc60]"
                      style={{ color: "#fffffe" }}
                    >
                      {app.title}
                    </h3>
                    <p
                      className="text-sm mb-4 line-clamp-3 leading-relaxed"
                      style={{ color: "#abd1c6" }}
                    >
                      {app.summary}
                    </p>

                    <div
                      className="inline-flex items-baseline gap-1 rounded-xl px-3 py-1.5 mb-4"
                      style={{ background: "rgba(249, 188, 96, 0.12)" }}
                    >
                      <span
                        className="text-xl font-bold tabular-nums"
                        style={{ color: "#f9bc60" }}
                      >
                        {app.amount.toLocaleString("ru-RU")}
                      </span>
                      <span
                        className="text-sm font-semibold"
                        style={{ color: "#f9bc60" }}
                      >
                        руб
                      </span>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                      <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white/10 group-hover:ring-[#f9bc60]/40 transition-all">
                        <img
                          src={avatarUrl}
                          alt={app.user ? app.user.name || "User" : "User"}
                          loading="lazy"
                          decoding="async"
                          width={72}
                          height={72}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = DEFAULT_AVATAR;
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="flex items-center gap-1.5 text-sm font-medium truncate"
                          style={{ color: "#fffffe" }}
                        >
                          <span className="truncate">
                            {app.user ? app.user.name || "Аноним" : "Аноним"}
                          </span>
                          {app.user ? (
                            <UserPublicBadges
                              markedAsDeceiver={app.user.markedAsDeceiver}
                            />
                          ) : null}
                        </p>
                        <p className="text-xs" style={{ color: "#94a1b2" }}>
                          {createdAt.toLocaleDateString("ru-RU", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </HomeSectionLayout>

        <div className="text-center mt-12">
          <Link
            href="/stories"
            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-bold rounded-xl transition-all duration-300 md:hover:scale-[1.02] md:hover:shadow-lg"
            style={{
              background:
                "linear-gradient(135deg, #e8a545 0%, #f9bc60 50%, #e8a545 100%)",
              color: "#001e1d",
              boxShadow: "0 8px 32px rgba(249, 188, 96, 0.25)",
            }}
          >
            Смотреть все истории
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
