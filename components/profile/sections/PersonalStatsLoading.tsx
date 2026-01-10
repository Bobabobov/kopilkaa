export function PersonalStatsLoading() {
  return (
    <div className="bg-[#004643]/60 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 p-4 sm:p-5 md:p-6 min-h-[400px]">
      <div className="animate-pulse space-y-4 sm:space-y-5 md:space-y-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#abd1c6]/20 rounded-lg"></div>
          <div className="h-6 bg-[#abd1c6]/20 rounded w-1/3"></div>
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2 pb-3 sm:pb-4 border-b border-[#abd1c6]/10">
          <div className="h-8 bg-[#abd1c6]/10 rounded-lg w-20"></div>
          <div className="h-8 bg-[#abd1c6]/10 rounded-lg w-20"></div>
          <div className="h-8 bg-[#abd1c6]/10 rounded-lg w-24"></div>
          <div className="h-8 bg-[#abd1c6]/10 rounded-lg w-28"></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          <div className="h-20 bg-[#abd1c6]/10 rounded-lg"></div>
          <div className="h-20 bg-[#abd1c6]/10 rounded-lg"></div>
          <div className="h-20 bg-[#abd1c6]/10 rounded-lg"></div>
          <div className="h-20 bg-[#abd1c6]/10 rounded-lg"></div>
        </div>
        <div className="h-32 bg-[#abd1c6]/10 rounded-xl"></div>
      </div>
    </div>
  );
}
