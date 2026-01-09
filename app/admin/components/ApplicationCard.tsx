// app/admin/components/ApplicationCard.tsx
"use client";

import { motion } from "framer-motion";
import type { ApplicationItem, ApplicationStatus } from "../types";
import ApplicationCardHeader from "./ApplicationCardHeader";
import ApplicationCardActions from "./ApplicationCardActions";
import ApplicationCardSummary from "./ApplicationCardSummary";
import ApplicationCardPayment from "./ApplicationCardPayment";
import ApplicationCardStory from "./ApplicationCardStory";
import ApplicationCardFooter from "./ApplicationCardFooter";

interface ApplicationCardProps {
  application: ApplicationItem;
  index: number;
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

export default function ApplicationCard({
  application: it,
  index,
  visibleEmails,
  onToggleEmail,
  onEdit,
  onQuickApprove,
  onQuickReject,
  onDelete,
}: ApplicationCardProps) {

  return (
    <motion.div
      key={it.id}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      whileHover={{ 
        y: -5, 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className="group relative overflow-hidden bg-gradient-to-br from-[#001e1d] via-[#004643]/90 to-[#001e1d] rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-[#abd1c6]/20 hover:border-[#f9bc60]/40"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#f9bc60]/5 via-[#abd1c6]/5 to-[#f9bc60]/5 group-hover:from-[#f9bc60]/10 group-hover:via-[#abd1c6]/10 group-hover:to-[#f9bc60]/10 transition-all duration-500"></div>

      <div className="relative">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4 sm:mb-6">
          <ApplicationCardHeader
            application={it}
            visibleEmails={visibleEmails}
            onToggleEmail={onToggleEmail}
          />
          <ApplicationCardActions
            application={it}
            onEdit={onEdit}
            onQuickApprove={onQuickApprove}
            onQuickReject={onQuickReject}
            onDelete={onDelete}
          />
        </div>

        <ApplicationCardSummary summary={it.summary} />

        <ApplicationCardPayment payment={it.payment} bankName={it.bankName} />

        <ApplicationCardStory story={it.story} />

        <ApplicationCardFooter
          applicationId={it.id}
          createdAt={it.createdAt}
        />
      </div>
    </motion.div>
  );
}
