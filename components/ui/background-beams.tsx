"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const PATHS = [
  "M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875",
  "M-366 -205C-366 -205 -298 200 166 327C630 454 698 859 698 859",
  "M-352 -221C-352 -221 -284 184 180 311C644 438 712 843 712 843",
  "M-338 -237C-338 -237 -270 168 194 295C658 422 726 827 726 827",
  "M-324 -253C-324 -253 -256 152 208 279C672 406 740 811 740 811",
  "M-310 -269C-310 -269 -242 136 222 263C686 390 754 795 754 795",
  "M-296 -285C-296 -285 -228 120 236 247C700 374 768 779 768 779",
  "M-282 -301C-282 -301 -214 104 250 231C714 358 782 763 782 763",
  "M-268 -317C-268 -317 -200 88 264 215C728 342 796 747 796 747",
  "M-254 -333C-254 -333 -186 72 278 199C742 326 810 731 810 731",
  "M-240 -349C-240 -349 -172 56 292 183C756 310 824 715 824 715",
  "M-226 -365C-226 -365 -158 40 306 167C770 294 838 699 838 699",
  "M-212 -381C-212 -381 -144 24 320 151C784 278 852 683 852 683",
  "M-198 -397C-198 -397 -130 8 334 135C798 262 866 667 866 667",
  "M-184 -413C-184 -413 -116 -8 348 119C812 246 880 651 880 651",
];

/**
 * Aceternity UI — Background Beams. Мягкие лучи за контентом hero.
 */
export function BackgroundBeams({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-0 overflow-hidden",
        className
      )}
    >
      <svg
        className="absolute h-full w-full"
        viewBox="-400 -250 1200 1200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="beam-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#f9bc60" stopOpacity="0" />
            <stop offset="40%" stopColor="#f9bc60" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#f9bc60" stopOpacity="0" />
          </linearGradient>
        </defs>
        {PATHS.map((path, i) => (
          <motion.path
            key={i}
            d={path}
            stroke="url(#beam-gradient)"
            strokeWidth="0.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: 1,
              opacity: 0.4,
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.04,
              ease: "easeOut",
            }}
          />
        ))}
      </svg>
    </div>
  );
}
