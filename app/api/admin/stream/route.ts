// app/api/admin/stream/route.ts
import { getAllowedAdminUser } from "@/lib/adminAccess";
import { subscribe } from "@/lib/sse";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const admin = await getAllowedAdminUser();
  if (!admin)
    return new Response("Forbidden", { status: 403 });

  const encoder = new TextEncoder();
  let un: (() => void) | null = null;
  let pingTimer: ReturnType<typeof setInterval> | null = null;

  const stream = new ReadableStream({
    start(controller) {
      const write = (str: string) => controller.enqueue(encoder.encode(str));
      
      write(`retry: 3000\n\n`);
      write(`event: hello\ndata: "connected"\n\n`);

      un = subscribe(write);
      
      pingTimer = setInterval(
        () => write(`event: ping\ndata: "${Date.now()}"\n\n`),
        30000,
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
