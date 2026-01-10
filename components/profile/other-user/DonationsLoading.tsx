export function DonationsLoading() {
  return (
    <div className="bg-[#004643]/60 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 p-4 sm:p-5 md:p-6 min-h-[280px]">
      <div className="animate-pulse space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#abd1c6]/20 rounded-lg"></div>
            <div className="h-6 bg-[#abd1c6]/20 rounded w-32"></div>
          </div>
          <div className="h-6 bg-[#abd1c6]/20 rounded w-16"></div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 p-4 bg-[#001e1d]/20 rounded-xl">
          <div className="h-20 bg-[#abd1c6]/10 rounded-lg"></div>
          <div className="h-20 bg-[#abd1c6]/10 rounded-lg"></div>
        </div>
        <div className="space-y-2 sm:space-y-3">
          <div className="h-16 bg-[#abd1c6]/10 rounded-lg"></div>
          <div className="h-16 bg-[#abd1c6]/10 rounded-lg"></div>
          <div className="h-16 bg-[#abd1c6]/10 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}
