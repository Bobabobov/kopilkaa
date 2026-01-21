// app/admin/components/ApplicationsGrid.tsx
"use client";

import { motion } from "framer-motion";
import { ApplicationItem, ApplicationStatus } from "../types";
import ApplicationCard from "./ApplicationCard";

interface ApplicationsGridProps {
  applications: ApplicationItem[];
  loading: boolean;
  error: string | null;
  visibleEmails: Set<string>;
  onToggleEmail: (id: string) => void;
  onEdit: (id: string, status: ApplicationStatus, comment: string) => void;
  onQuickApprove: (
    id: string,
    status: ApplicationStatus,
    comment: string,
    decreaseTrustOnDecision?: boolean,
  ) => void;
  onQuickReject: (
    id: string,
    status: ApplicationStatus,
    comment: string,
    decreaseTrustOnDecision?: boolean,
  ) => void;
  onDelete: (id: string, title: string) => void;
  onToggleTrust?: (id: string, next: boolean) => void;
}

export default function ApplicationsGrid({
  applications,
  loading,
  error,
  visibleEmails,
  onToggleEmail,
  onEdit,
  onQuickApprove,
  onQuickReject,
  onDelete,
  onToggleTrust,
}: ApplicationsGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-[#001e1d] via-[#004643]/90 to-[#001e1d] rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl border border-[#abd1c6]/20 animate-pulse"
          >
            <div className="space-y-4">
              <div className="h-6 bg-[#abd1c6]/20 rounded w-3/4"></div>
              <div className="h-4 bg-[#abd1c6]/20 rounded w-1/2"></div>
              <div className="h-20 bg-[#abd1c6]/20 rounded"></div>
              <div className="flex gap-2">
                <div className="h-8 bg-[#abd1c6]/20 rounded w-20"></div>
                <div className="h-8 bg-[#abd1c6]/20 rounded w-20"></div>
                <div className="h-8 bg-[#abd1c6]/20 rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#001e1d] via-[#004643]/90 to-[#001e1d] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-[#e16162]/40"
      >
        <div className="text-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[#e16162] text-4xl sm:text-6xl mb-4"
          >
            ⚠️
          </motion.div>
          <motion.h3 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg sm:text-xl font-black text-[#fffffe] mb-2"
          >
            Ошибка загрузки
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-[#abd1c6] mb-6 text-sm sm:text-base"
          >
            {error}
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#f9bc60] to-[#e8a545] hover:from-[#e8a545] hover:to-[#f9bc60] text-[#001e1d] rounded-lg sm:rounded-xl transition-all duration-300 font-bold shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            Попробовать снова
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (applications.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#001e1d] via-[#004643]/90 to-[#001e1d] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-[#abd1c6]/20"
      >
        <div className="text-center">
          <motion.div 
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#abd1c6] text-4xl sm:text-6xl mb-4"
          >
            📋
          </motion.div>
          <motion.h3 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg sm:text-xl font-black text-[#fffffe] mb-2"
          >
            Заявки не найдены
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-[#abd1c6] text-sm sm:text-base"
          >
            Попробуйте изменить фильтры поиска
          </motion.p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6">
      {applications.map((application, index) => (
        <ApplicationCard
          key={application.id}
          application={application}
          index={index}
          visibleEmails={visibleEmails}
          onToggleEmail={onToggleEmail}
          onEdit={onEdit}
          onQuickApprove={onQuickApprove}
          onQuickReject={onQuickReject}
          onDelete={onDelete}
          onToggleTrust={onToggleTrust}
        />
      ))}
    </div>
  );
}
