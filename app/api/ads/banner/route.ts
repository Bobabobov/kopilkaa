import { NextResponse } from "next/server";
import { findActiveAdByPlacement } from "../route";

// DEPRECATED: используйте GET /api/ads?placement=home_banner
// Оставлено для обратной совместимости. Контракт ответа НЕ меняем: { ad: Advertisement | null }
export async function GET() {
  try {
    const ad = await findActiveAdByPlacement("home_banner");
    return NextResponse.json({ ad: ad ?? null });
  } catch (error) {
    console.error("Error fetching banner ad (deprecated route):", error);
    return NextResponse.json({ ad: null });
  }
}




