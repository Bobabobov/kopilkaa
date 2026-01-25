// app/admin/components/ApplicationsListItem.tsx
"use client";
import { motion } from "framer-motion";
import type { ApplicationItem } from "../types";
import ApplicationsListItemHeader from "./ApplicationsListItemHeader";
import ApplicationsListItemActions from "./ApplicationsListItemActions";
import ApplicationsListItemPayment from "./ApplicationsListItemPayment";
import ApplicationsListItemImages from "./ApplicationsListItemImages";
import ApplicationsListItemFooter from "./ApplicationsListItemFooter";

interface ApplicationsListItemProps {
  item: ApplicationItem;
  index: number;
  isEmailVisible: boolean;
  onToggleEmail: () => void;
  onStatusChange: (
    id: string,
    status: ApplicationItem["status"],
    comment?: string,
  ) => void;
  onQuickUpdate: (
    id: string,
    status: ApplicationItem["status"],
    comment?: string,
  ) => void;
  onImageClick: (images: string[], index: number) => void;
  onDelete: (id: string) => void;
}

export default function ApplicationsListItem({
  item,
  index,
  isEmailVisible,
  onToggleEmail,
  onStatusChange,
  onQuickUpdate,
  onImageClick,
  onDelete,
}: ApplicationsListItemProps) {
  return (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-indigo-500/10 transition-all duration-500"></div>

      <div className="relative">
        {/* Шапка */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <ApplicationsListItemHeader
            item={item}
            isEmailVisible={isEmailVisible}
            onToggleEmail={onToggleEmail}
          />
          <ApplicationsListItemActions
            item={item}
            onStatusChange={onStatusChange}
            onQuickUpdate={onQuickUpdate}
            onDelete={onDelete}
          />
        </div>

        {/* Кратко */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4 mb-6">
          <div className="text-gray-700 dark:text-gray-300 clamp-2 break-words max-w-full leading-relaxed">
            {item.summary}
          </div>
        </div>

        {/* Реквизиты */}
        <ApplicationsListItemPayment payment={item.payment} />

        {/* Картинки */}
        <ApplicationsListItemImages
          images={item.images}
          onImageClick={onImageClick}
        />

        {/* Футер */}
        <ApplicationsListItemFooter
          item={item}
          adminComment={item.adminComment}
        />
      </div>
    </motion.div>
  );
}
