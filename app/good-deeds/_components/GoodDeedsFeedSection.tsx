"use client";

import { GoodDeedsFeed } from "./GoodDeedsFeed";
import type { GoodDeedsResponse } from "../types";

type Props = {
  items: GoodDeedsResponse["feed"];
  onBeFirst?: () => void;
};

export function GoodDeedsFeedSection({ items, onBeFirst }: Props) {
  return (
    <section
      id="good-deeds-feed"
      aria-label="Добрые дела участников"
      className="scroll-mt-20"
    >
      <GoodDeedsFeed items={items} onBeFirst={onBeFirst} />
    </section>
  );
}
