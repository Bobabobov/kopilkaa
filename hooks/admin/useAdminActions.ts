import { useState } from "react";
import type { ApplicationStatus, ApplicationIntegrityAccount } from "@/types/admin";
import { getMessageFromApiJson } from "@/lib/api/parseApiError";

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
    linkedAccounts?: ApplicationIntegrityAccount[];
  }>({
    id: "",
    status: "PENDING",
    comment: "",
    linkedAccounts: [],
  });

  const [deleteModal, setDeleteModal] = useState<{
    id: string;
    title: string;
  }>({ id: "", title: "" });

  const quickUpdate = async (
    id: string,
    newStatus: ApplicationStatus,
    comment: string,
  ) => {
    try {
      const response = await fetch(`/api/admin/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          adminComment: comment,
        }),
      });

      const raw = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(
          getMessageFromApiJson(raw, "Не удалось изменить статус заявки"),
        );
      }

      showToast(
        "success",
        `Заявка ${newStatus === "APPROVED" ? "одобрена" : "отклонена"}!`,
      );

      await Promise.all([refreshStats(), refreshApplications()]);
    } catch (err) {
      console.error("Failed to update application:", err);
      showToast(
        "error",
        err instanceof Error ? err.message : "Ошибка обновления заявки",
      );
    }
  };

  const updateStatus = async () => {
    try {
      const response = await fetch(`/api/admin/applications/${modal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: modal.status,
          adminComment: modal.comment,
        }),
      });

      const rawUpdate = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(
          getMessageFromApiJson(rawUpdate, "Не удалось обновить заявку"),
        );
      }

      showToast("success", "Статус заявки обновлен!");

      setModal({
        id: "",
        status: "PENDING",
        comment: "",
        linkedAccounts: [],
      });

      await Promise.all([refreshStats(), refreshApplications()]);
    } catch (err) {
      console.error("Failed to update application:", err);
      showToast(
        "error",
        err instanceof Error ? err.message : "Ошибка обновления заявки",
      );
    }
  };

  const deleteApplication = async () => {
    try {
      const response = await fetch(
        `/api/admin/applications/${deleteModal.id}`,
        {
          method: "DELETE",
        },
      );

      const rawDel = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(
          getMessageFromApiJson(rawDel, "Не удалось удалить заявку"),
        );
      }

      showToast("success", "Заявка удалена!");
      setDeleteModal({ id: "", title: "" });
      await Promise.all([refreshStats(), refreshApplications()]);
    } catch (err) {
      console.error("Failed to delete application:", err);
      showToast(
        "error",
        err instanceof Error ? err.message : "Ошибка удаления заявки",
      );
    }
  };

  const handleEdit = (
    id: string,
    status: ApplicationStatus,
    comment: string,
    linkedAccounts?: ApplicationIntegrityAccount[],
  ) => {
    setModal({
      id,
      status,
      comment,
      linkedAccounts: linkedAccounts ?? [],
    });
  };

  const handleQuickApprove = (
    id: string,
    status: ApplicationStatus,
    comment: string,
  ) => {
    quickUpdate(id, status, comment);
  };

  const handleQuickReject = (
    id: string,
    status: ApplicationStatus,
    comment: string,
  ) => {
    quickUpdate(id, status, comment);
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
  };
}
