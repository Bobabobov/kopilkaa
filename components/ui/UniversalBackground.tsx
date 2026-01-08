"use client";
import Image from "next/image";

export default function UniversalBackground() {
  return (
    <div className="fixed inset-0 -z-10 w-full h-full">
      <Image
        src="/fon5.png"
        alt=""
        fill
        sizes="100vw"
        quality={45}
        className="universal-background-animated absolute inset-0 object-cover md:object-center object-[center_top] md:scale-100 scale-110"
        draggable={false}
      />
    </div>
  );
}
