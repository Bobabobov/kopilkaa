// app/admin/components/ApplicationsGrid.tsx
"use client";

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
  ) => void;
  onQuickReject: (
    id: string,
    status: ApplicationStatus,
    comment: string,
  ) => void;
  onDelete: (id: string, title: string) => void;
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
}: ApplicationsGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-8 shadow-lg border border-gray-100 dark:border-gray-700 animate-pulse"
          >
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="flex gap-2">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
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
        className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700"
      >
        <div className="text-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-red-500 text-6xl mb-4"
          >
            ⚠️
          </motion.div>
          <motion.h3 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-xl font-bold text-gray-900 dark:text-white mb-2"
          >
            Ошибка загрузки
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-gray-600 dark:text-gray-400 mb-6"
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
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
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
        className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700"
      >
        <div className="text-center">
          <motion.div 
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 text-6xl mb-4"
          >
            📋
          </motion.div>
          <motion.h3 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-xl font-bold text-gray-900 dark:text-white mb-2"
          >
            Заявки не найдены
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-gray-600 dark:text-gray-400"
          >
            Попробуйте изменить фильтры поиска
          </motion.p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
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
        />
      ))}
    </div>
  );
}
