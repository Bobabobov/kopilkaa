import Link from "next/link";
import { CoinCatchPage } from "@/features/games/coin-catch/_components/CoinCatchPage";

export default function CoinCatchGamePage() {
  if (process.env.NEXT_PUBLIC_GAMES_ENABLED !== "true") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0f1614]">
        <p className="text-[#f9bc60] text-lg font-semibold">Игра ещё не готова</p>
        <Link
          href="/games"
          className="mt-4 text-[#abd1c6] hover:text-[#f9bc60] transition-colors"
        >
          ← Назад к играм
        </Link>
      </div>
    );
  }
  return <CoinCatchPage />;
}
