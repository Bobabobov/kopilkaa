"use client";

import { useState, type ReactNode } from "react";
import { GlassModal, type GlassModalSize } from "@/components/ui/GlassModal";

export interface BeautifulModalProps {
  show: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: GlassModalSize;
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
}

export default function BeautifulModal({
  show,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
  closeOnBackdropClick = true,
}: BeautifulModalProps) {
  return (
    <GlassModal
      show={show}
      onClose={onClose}
      title={title}
      size={size}
      showCloseButton={showCloseButton}
      closeOnBackdropClick={closeOnBackdropClick}
    >
      {children}
    </GlassModal>
  );
}

export function useBeautifulModal() {
  const [modal, setModal] = useState<{
    show: boolean;
    title: string;
    content: ReactNode;
    size?: BeautifulModalProps["size"];
    showCloseButton?: boolean;
    closeOnBackdropClick?: boolean;
  }>({
    show: false,
    title: "",
    content: null,
  });

  const showModal = (
    title: string,
    content: ReactNode,
    options?: {
      size?: BeautifulModalProps["size"];
      showCloseButton?: boolean;
      closeOnBackdropClick?: boolean;
    },
  ) => {
    setModal({
      show: true,
      title,
      content,
      size: options?.size,
      showCloseButton: options?.showCloseButton,
      closeOnBackdropClick: options?.closeOnBackdropClick,
    });
  };

  const hideModal = () => {
    setModal((prev) => ({ ...prev, show: false }));
  };

  const ModalComponent = () => (
    <BeautifulModal
      show={modal.show}
      onClose={hideModal}
      title={modal.title}
      size={modal.size}
      showCloseButton={modal.showCloseButton}
      closeOnBackdropClick={modal.closeOnBackdropClick}
    >
      {modal.content}
    </BeautifulModal>
  );

  return { showModal, hideModal, ModalComponent };
}
