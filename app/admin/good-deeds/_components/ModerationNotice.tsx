import { Card } from "@/components/ui/Card";
import type { Notice } from "../_lib/types";

type Props = {
  notice: Notice | null;
};

export function ModerationNotice({ notice }: Props) {
  if (!notice) return null;

  return (
    <Card
      variant="darkGlass"
      className={`mb-5 border ${
        notice.type === "success"
          ? "border-[#10B981]/35 bg-[#10B981]/10"
          : "border-[#e16162]/35 bg-[#e16162]/10"
      }`}
    >
      <p className={notice.type === "success" ? "text-[#b8f7de]" : "text-[#ffd4d4]"}>
        {notice.text}
      </p>
    </Card>
  );
}
