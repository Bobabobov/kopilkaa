// app/api/uploads/[name]/route.ts
import { stat, readFile } from "fs/promises";
import { join } from "path";

export const runtime = "nodejs";

export async function GET(_: Request, { params }: { params: { name: string } }) {
  try {
    const filePath = join(process.cwd(), "uploads", params.name);
    await stat(filePath);
    const data = await readFile(filePath);
    // Простейшее определение типа (можно улучшить)
    const lc = params.name.toLowerCase();
    const ct = lc.endsWith(".png")
      ? "image/png"
      : lc.endsWith(".webp")
      ? "image/webp"
      : lc.endsWith(".gif")
      ? "image/gif"
      : "image/jpeg";

    return new Response(data, { headers: { "Content-Type": ct, "Cache-Control": "public, max-age=31536000, immutable" } });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
