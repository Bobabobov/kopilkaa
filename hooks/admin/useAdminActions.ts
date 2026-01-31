import { useState } from "react";
import type { ApplicationStatus } from "@/types/admin";

interface UseAdminActionsProps {
  refreshStats: () => Promise<void>;
  refreshApplications: () => Promise<void>;
  showToast: (type: "success" | "error", message: string) => void;
}

export function useAdminActions({
  refreshStats,
  refreshApplications,
  showToast,
}: UseAdminActionsProps) {
  const [modal, setModal] = useState<{
    id: string;
    status: ApplicationStatus;
    comment: string;
    decreaseTrustOnDecision: boolean;
  }>({
    id: "",
    status: "PENDING",
    comment: "",
    decreaseTrustOnDecision: false,
  });

  const [deleteModal, setDeleteModal] = useState<{
    id: string;
    title: string;
  }>({ id: "", title: "" });
  const toggleTrust = async (id: string, next: boolean) => {
    try {
      const response = await fetch(`/api/admin/applications/${id}/trust`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ countTowardsTrust: next }),
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      showToast("success", "Флаг доверия обновлён");
      await refreshApplications();
    } catch (err) {
      console.error("Failed to update trust flag:", err);
      showToast("error", "Ошибка обновления флага доверия");
    }
  };

  // Быстрое обновление статуса
  const quickUpdate = async (
    id: string,
    newStatus: ApplicationStatus,
    comment: string,
    decreaseTrustOnDecision?: boolean,
  ) => {
    try {
      const response = await fetch(`/api/admin/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          adminComment: comment,
          decreaseTrustOnDecision: Boolean(decreaseTrustOnDecision),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      showToast(
        "success",
        `Заявка ${newStatus === "APPROVED" ? "одобрена" : "отклонена"}!`,
      );

      // Обновляем данные
      await Promise.all([refreshStats(), refreshApplications()]);
    } catch (err) {
      console.error("Failed to update application:", err);
      showToast("error", "Ошибка обновления заявки");
    }
  };

  // Обновление статуса через модалку
  const updateStatus = async () => {
    try {
      const response = await fetch(`/api/admin/applications/${modal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: modal.status,
          adminComment: modal.comment,
          decreaseTrustOnDecision: Boolean(modal.decreaseTrustOnDecision),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      showToast("success", "Статус заявки обновлен!");

      // Закрываем модалку
      setModal({
        id: "",
        status: "PENDING",
        comment: "",
        decreaseTrustOnDecision: false,
      });

      // Обновляем данные
      await Promise.all([refreshStats(), refreshApplications()]);
    } catch (err) {
      console.error("Failed to update application:", err);
      showToast("error", "Ошибка обновления заявки");
    }
  };

  // Удаление заявки
  const deleteApplication = async () => {
    try {
      const response = await fetch(
        `/api/admin/applications/${deleteModal.id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      showToast("success", "Заявка удалена!");

      // Закрываем модалку
      setDeleteModal({ id: "", title: "" });

      // Обновляем данные
      await Promise.all([refreshStats(), refreshApplications()]);
    } catch (err) {
      console.error("Failed to delete application:", err);
      showToast("error", "Ошибка удаления заявки");
    }
  };

  // Обработчики для ApplicationCard
  const handleEdit = (
    id: string,
    status: ApplicationStatus,
    comment: string,
  ) => {
    setModal({ id, status, comment, decreaseTrustOnDecision: false });
  };

  const handleQuickApprove = (
    id: string,
    status: ApplicationStatus,
    comment: string,
    decreaseTrustOnDecision?: boolean,
  ) => {
    quickUpdate(id, status, comment, decreaseTrustOnDecision);
  };

  const handleQuickReject = (
    id: string,
    status: ApplicationStatus,
    comment: string,
    decreaseTrustOnDecision?: boolean,
  ) => {
    quickUpdate(id, status, comment, decreaseTrustOnDecision);
  };

  const handleDelete = (id: string, title: string) => {
    setDeleteModal({ id, title });
  };

  return {
    modal,
    setModal,
    deleteModal,
    setDeleteModal,
    updateStatus,
    deleteApplication,
    handleEdit,
    handleQuickApprove,
    handleQuickReject,
    handleDelete,
    toggleTrust,
  };
}
