"use client";

import NotFoundContent from "@/components/not-found/NotFoundContent";
import NotFoundActions from "@/components/not-found/NotFoundActions";

type NotFoundViewProps = {
  homeOrigin: string;
};

export default function NotFoundView({ homeOrigin }: NotFoundViewProps) {
  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      <div className="relative z-10 w-full">
        <div className="w-full pt-16 sm:pt-20 md:pt-24 lg:pt-32 pb-8 sm:pb-12 md:pb-16">
          <NotFoundContent />
        </div>

        <div className="w-full pb-16 sm:pb-20 md:pb-24 lg:pb-32">
          <NotFoundActions homeOrigin={homeOrigin} />
        </div>
      </div>
    </div>
  );
}
