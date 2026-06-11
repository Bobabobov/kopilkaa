import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import {
  DEFAULT_AVATAR,
  needsNoReferrerAvatar,
  resolveAvatarUrl,
} from "@/lib/avatar";
import { cn } from "@/lib/utils";

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className,
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, src, onError, ...props }, ref) => {
  const resolvedSrc = typeof src === "string" ? resolveAvatarUrl(src) : src;
  return (
  <AvatarPrimitive.Image
    ref={ref}
    src={resolvedSrc}
    referrerPolicy={
      typeof src === "string" && needsNoReferrerAvatar(src)
        ? "no-referrer"
        : undefined
    }
    className={cn("aspect-square h-full w-full", className)}
    onError={(event) => {
      const img = event.currentTarget;
      if (img.src.endsWith(DEFAULT_AVATAR)) return;
      img.src = DEFAULT_AVATAR;
      onError?.(event);
    }}
    {...props}
  />
  );
});
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className,
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };
