// components/profile/other-user/widgets/FriendActionsMenu.tsx
"use client";

import { useState } from "react";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";

interface FriendActionsMenuProps {
  friendshipId: string | null;
  onAfterChange?: () => void;
}

export default function FriendActionsMenu(_: FriendActionsMenuProps) {
  // Компонент выключен: кнопка «Действия» удалена по требованию.
  return null;
}


