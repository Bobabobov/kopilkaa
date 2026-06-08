"use client";

import { useState } from "react";
import { PasswordEditor } from "../settings/editors/PasswordEditor";
import { SettingsSection } from "./SettingsFields";

interface SettingsAccountSectionProps {
  saving: boolean;
  isChangingPassword: boolean;
  passwordData: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  passwordError: string;
  onStartPasswordChange: () => void;
  onCancelPasswordChange: () => void;
  onPasswordSubmit: () => void;
  onPasswordFieldChange: (
    field: "oldPassword" | "newPassword" | "confirmPassword",
    value: string,
  ) => void;
  onDeleteAccount: () => Promise<void>;
}

export function SettingsAccountSection({
  saving,
  isChangingPassword,
  passwordData,
  passwordError,
  onStartPasswordChange,
  onCancelPasswordChange,
  onPasswordSubmit,
  onPasswordFieldChange,
  onDeleteAccount,
}: SettingsAccountSectionProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deletePhrase, setDeletePhrase] = useState("");

  const handleDelete = async () => {
    if (deletePhrase.trim() !== "УДАЛИТЬ") return;
    await onDeleteAccount();
  };

  return (
    <>
      <SettingsSection title="Безопасность">
        <PasswordEditor
          disabled={saving}
          isChanging={isChangingPassword}
          passwordData={passwordData}
          passwordError={passwordError}
          onStartChange={onStartPasswordChange}
          onCancel={onCancelPasswordChange}
          onSubmit={onPasswordSubmit}
          onFieldChange={onPasswordFieldChange}
        />
      </SettingsSection>

      <SettingsSection title="Опасная зона">
        {!confirmDelete ? (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-red-500/10 rounded-xl border border-red-400/25">
            <div>
              <h4 className="text-sm font-medium text-[#fffffe] mb-1">
                Удаление аккаунта
              </h4>
              <p className="text-xs text-[#abd1c6]">
                Безвозвратно удалит профиль и все связанные данные
              </p>
            </div>
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              disabled={saving}
              className="w-full sm:w-auto px-4 py-2.5 bg-transparent border border-red-400/40 text-red-300 hover:bg-red-500/15 disabled:opacity-50 font-semibold rounded-xl transition-colors"
            >
              Удалить аккаунт
            </button>
          </div>
        ) : (
          <div className="space-y-3 p-4 bg-red-500/10 rounded-xl border border-red-400/25">
            <p className="text-sm text-[#fffffe]">
              Введите <span className="font-bold text-red-300">УДАЛИТЬ</span>,
              чтобы подтвердить
            </p>
            <input
              type="text"
              value={deletePhrase}
              onChange={(e) => setDeletePhrase(e.target.value)}
              disabled={saving}
              placeholder="УДАЛИТЬ"
              className="w-full px-3 py-2.5 border border-red-400/30 rounded-xl bg-[#001e1d]/20 text-[#fffffe] focus:ring-2 focus:ring-red-400/50 focus:border-transparent"
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void handleDelete()}
                disabled={saving || deletePhrase.trim() !== "УДАЛИТЬ"}
                className="px-4 py-2.5 bg-red-500 hover:bg-red-600 disabled:bg-[#6B7280] text-white font-semibold rounded-xl transition-colors"
              >
                Подтвердить удаление
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmDelete(false);
                  setDeletePhrase("");
                }}
                disabled={saving}
                className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-[#abd1c6] font-semibold rounded-xl border border-white/10 transition-colors"
              >
                Отмена
              </button>
            </div>
          </div>
        )}
      </SettingsSection>
    </>
  );
}
