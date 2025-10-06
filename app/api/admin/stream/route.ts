// app/api/admin/stream/route.ts
import { getSession } from "@/lib/auth";
import { subscribe } from "@/lib/sse";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const s = await getSession();
  if (!s || s.role !== "ADMIN")
    return new Response("Forbidden", { status: 403 });

  const encoder = new TextEncoder();
  let un: (() => void) | null = null;
  let pingTimer: ReturnType<typeof setInterval> | null = null;

  const stream = new ReadableStream({
    start(controller) {
      const write = (str: string) => controller.enqueue(encoder.encode(str));
      write(`retry: 3000\n\n`); // рекомендованная задержка реконнекта
      write(`event: hello\ndata: "connected"\n\n`);

      un = subscribe(write);
      pingTimer = setInterval(
        () => write(`event: ping\ndata: "${Date.now()}"\n\n`),
        25000,
      );
    },
    cancel() {
      if (pingTimer) clearInterval(pingTimer);
      if (un) un();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
