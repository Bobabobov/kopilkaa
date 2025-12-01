"use client";

interface QuickAmountButtonsProps {
  amounts: number[];
  selectedAmount: string;
  onSelect: (amount: number) => void;
}

export function QuickAmountButtons({ amounts, selectedAmount, onSelect }: QuickAmountButtonsProps) {
  return (
    <div>
      <p className="text-xs mb-2" style={{ color: "#6b7280" }}>
        Быстрый выбор:
      </p>
      <div className="grid grid-cols-4 gap-2">
        {amounts.map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => onSelect(amount)}
            className={`py-2 px-3 rounded-lg font-semibold text-sm transition-all ${
              selectedAmount === amount.toString()
                ? "scale-105"
                : "hover:scale-105"
            }`}
            style={{
              backgroundColor:
                selectedAmount === amount.toString() ? "#f9bc60" : "#1f2937",
              color: selectedAmount === amount.toString() ? "#001e1d" : "#abd1c6"
            }}
          >
            {amount}₽
          </button>
        ))}
      </div>
    </div>
  );
}

