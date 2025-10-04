// components/layout/HeaderMobileButton.tsx
"use client";
import { useState } from "react";

interface HeaderMobileButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export default function HeaderMobileButton({ onClick, isOpen }: HeaderMobileButtonProps) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden p-3 rounded-xl transition-all duration-200 drop-shadow-md"
      style={{ color: '#fffffe' }}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {isOpen ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        )}
      </svg>
    </button>
  );
}
