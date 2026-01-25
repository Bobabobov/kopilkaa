import { LucideIcons } from "@/components/ui/LucideIcons";

interface DonationsErrorProps {
  error: string;
}

export function DonationsError({ error }: DonationsErrorProps) {
  return (
    <div className="bg-[#004643]/60 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 p-4 sm:p-5 md:p-6">
      <div className="text-center py-8">
        <LucideIcons.AlertTriangle
          className="text-red-400 mx-auto mb-2"
          size="lg"
        />
        <p className="text-sm text-[#abd1c6]">{error}</p>
      </div>
    </div>
  );
}
