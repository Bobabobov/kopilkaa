import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export type CoinCatchStatus =
  | { canPlay: true; mode: "test"; testAttemptsLeft: number }
  | { canPlay: true; mode: "real"; testAttemptsLeft: 0 }
  | { canPlay: false; mode: "banned"; bannedUntil: string };

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let trial = await prisma.coinCatchTrial.findUnique({
      where: { userId: session.uid },
    });
    if (!trial) {
      trial = await prisma.coinCatchTrial.create({
        data: { userId: session.uid, testAttemptsUsed: 0 },
      });
    }

    const now = new Date();

    if (trial.bannedUntil && trial.bannedUntil > now) {
      return NextResponse.json({
        canPlay: false,
        mode: "banned",
        bannedUntil: trial.bannedUntil.toISOString(),
      } satisfies CoinCatchStatus);
    }

    const testUsed = trial.testAttemptsUsed ?? 0;
    if (testUsed < 3) {
      return NextResponse.json({
        canPlay: true,
        mode: "test",
        testAttemptsLeft: 3 - testUsed,
      } satisfies CoinCatchStatus);
    }

    return NextResponse.json({
      canPlay: true,
      mode: "real",
      testAttemptsLeft: 0,
    } satisfies CoinCatchStatus);
  } catch (error) {
    console.error("Error fetching coin-catch status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
