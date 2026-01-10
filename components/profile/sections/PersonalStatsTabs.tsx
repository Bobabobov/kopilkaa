import { LucideIcons } from "@/components/ui/LucideIcons";
import type { PersonalTabs, StatsTabId } from "../hooks/usePersonalStats";

interface PersonalStatsTabsProps {
  tabs: PersonalTabs[];
  activeTab: StatsTabId;
  onChange: (tab: StatsTabId) => void;
}

export function PersonalStatsTabs({ tabs, activeTab, onChange }: PersonalStatsTabsProps) {
  return (
    <div className="flex flex-wrap gap-1 xs:gap-1.5 sm:gap-2 mb-4 sm:mb-5 md:mb-6 border-b border-[#abd1c6]/10 pb-3 sm:pb-4 overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 scrollbar-hide">
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-1 sm:gap-1.5 md:gap-2 px-2 xs:px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] xs:text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
              activeTab === tab.id ? "bg-[#f9bc60] text-[#001e1d]" : "text-[#abd1c6] hover:bg-[#001e1d]/30"
            }`}
          >
            <IconComponent className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="hidden xs:inline">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
