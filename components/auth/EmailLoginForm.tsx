"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface EmailLoginFormProps {
  onSubmit: (identifier: string, password: string) => Promise<void>;
  busy: boolean;
  error: string | null;
}

export function EmailLoginForm({ onSubmit, busy, error }: EmailLoginFormProps) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!identifier.trim()) {
      errors.identifier = "Введите логин или email";
    } else if (
      identifier.includes("@") &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier.trim())
    ) {
      errors.identifier = "Введите корректный email";
    } else if (
      !identifier.includes("@") &&
      identifier.trim().length < 3
    ) {
      errors.identifier = "Логин должен быть длиннее";
    }

    if (!password.trim()) {
      errors.password = "Введите пароль";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    if (!validateForm()) return;

    await onSubmit(identifier.trim(), password);
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative z-10"
    >
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="flex items-center gap-3 my-6"
      >
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#1f2937] to-[#1f2937]" />
        <span className="text-xs text-[#6b7280] uppercase tracking-wider font-semibold px-2">
          по почте
        </span>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#1f2937] to-[#1f2937]" />
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-sm font-medium mb-2.5" style={{ color: "#abd1c6" }}>
            Email или логин
          </label>
          <input
            className={`w-full px-4 py-3.5 rounded-xl border text-base bg-[#020617]/80 backdrop-blur-sm placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#f9bc60]/60 transition-all ${
              validationErrors.identifier
                ? "border-red-500/70 focus:border-red-500/70"
                : identifier.trim()
                  ? "border-[#4b5563] focus:border-[#f9bc60]/40"
                  : "border-[#1f2937] focus:border-[#f9bc60]/40"
            }`}
            style={{ color: "#fffffe" }}
            type="text"
            value={identifier}
            onChange={(e) => {
              setIdentifier(e.target.value);
              if (validationErrors.identifier) {
                setValidationErrors((prev) => ({
                  ...prev,
                  identifier: "",
                }));
              }
            }}
            placeholder="example@mail.com"
          />
          {validationErrors.identifier && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-xs text-red-400 flex items-center gap-1"
            >
              <LucideIcons.AlertCircle size="xs" />
              {validationErrors.identifier}
            </motion.p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
        >
          <label className="block text-sm font-medium mb-2.5" style={{ color: "#abd1c6" }}>
            Пароль
          </label>
          <input
            className={`w-full px-4 py-3.5 rounded-xl border text-base bg-[#020617]/80 backdrop-blur-sm placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#f9bc60]/60 transition-all ${
              validationErrors.password
                ? "border-red-500/70 focus:border-red-500/70"
                : password.trim()
                  ? "border-[#4b5563] focus:border-[#f9bc60]/40"
                  : "border-[#1f2937] focus:border-[#f9bc60]/40"
            }`}
            style={{ color: "#fffffe" }}
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (validationErrors.password) {
                setValidationErrors((prev) => ({
                  ...prev,
                  password: "",
                }));
              }
            }}
            placeholder="••••••••"
          />
          {validationErrors.password && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-xs text-red-400 flex items-center gap-1"
            >
              <LucideIcons.AlertCircle size="xs" />
              {validationErrors.password}
            </motion.p>
          )}
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-red-500/10 border border-red-500/40 text-red-300 text-sm px-4 py-3 rounded-xl flex items-start gap-2"
          >
            <LucideIcons.AlertCircle size="sm" className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: busy ? 1 : 1.02, y: busy ? 0 : -2 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={busy}
          className="w-full py-3.5 px-4 rounded-xl font-semibold text-base transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-xl relative overflow-hidden"
          style={{
            backgroundColor: "#f9bc60",
            color: "#001e1d"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#e8a545] to-[#f9bc60] opacity-0 hover:opacity-100 transition-opacity" />
          {busy ? (
            <span className="flex items-center justify-center gap-2 relative z-10">
              <div className="w-4 h-4 border-2 border-[#001e1d] border-t-transparent rounded-full animate-spin" />
              Входим...
            </span>
          ) : (
            <span className="relative z-10">Войти</span>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}

