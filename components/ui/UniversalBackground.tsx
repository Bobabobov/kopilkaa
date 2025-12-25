"use client";

export default function UniversalBackground() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes backgroundBreath {
          0%, 100% {
            transform: scale(1) translate(0, 0);
          }
          25% {
            transform: scale(1.015) translate(8px, -6px);
          }
          50% {
            transform: scale(1.03) translate(0, -12px);
          }
          75% {
            transform: scale(1.015) translate(-8px, -6px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .background-animated {
            animation: none !important;
            transform: scale(1) translate(0, 0) !important;
          }
        }

        .background-animated {
          animation: backgroundBreath 60s ease-in-out infinite;
          will-change: transform;
        }
      `}} />
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Фоновое изображение */}
        <img 
          src="/fon5.png" 
          alt=""
          className="background-animated w-full h-full object-cover md:object-center object-[center_top] md:scale-100 scale-110"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: -10,
          }}
        />
        
        {/* Затемняющий overlay */}
        <div
          className="fixed inset-0 -z-[9] pointer-events-none"
          style={{
            backgroundColor: "rgba(0, 70, 67, 0.35)",
          }}
        />
      </div>
    </>
  );
}
