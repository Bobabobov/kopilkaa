import { motion } from "framer-motion";

export function OtherUserInfo({ createdAt }: { createdAt: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="space-y-3 mb-5 sm:mb-6"
    >
      <div className="group/info bg-[#001e1d]/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 hover:bg-[#001e1d]/40 transition-all duration-300 border border-[#abd1c6]/10 hover:border-[#abd1c6]/20">
        <div className="flex justify-between items-center">
          <span className="text-[#abd1c6] text-sm">Дата регистрации:</span>
          <span className="text-[#fffffe] font-semibold text-sm">
            {new Date(createdAt).toLocaleDateString("ru-RU")}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
