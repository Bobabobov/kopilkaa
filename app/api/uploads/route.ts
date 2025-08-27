// app/api/uploads/route.ts
import { randomUUID } from "crypto";
import { writeFile, mkdir } from "fs/promises";
import { join, extname } from "path";

export const runtime = "nodejs"; // обязательно

const MAX_FILES = 5;
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const UPLOAD_DIR = join(process.cwd(), "uploads");

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const files = form.getAll("files") as File[];

    if (!files.length) {
      return Response.json({ error: "Файлы не переданы" }, { status: 400 });
    }
    if (files.length > MAX_FILES) {
      return Response.json({ error: `Максимум ${MAX_FILES} файлов` }, { status: 400 });
    }

    await mkdir(UPLOAD_DIR, { recursive: true });

    const saved: { url: string; name: string; size: number }[] = [];

    for (const f of files) {
      if (typeof f === "string") continue;
      if (f.size > MAX_SIZE) {
        return Response.json({ error: `Файл «${f.name}» больше 5 МБ` }, { status: 400 });
      }
      const buf = Buffer.from(await f.arrayBuffer());
      const ext = extname(f.name || "").toLowerCase() || ".jpg";
      const id = randomUUID().replace(/-/g, "");
      const filename = `${id}${ext}`;
      const filepath = join(UPLOAD_DIR, filename);
      await writeFile(filepath, buf);
      // Доступ к файлу отдаём через GET /api/uploads/[name]
      saved.push({ url: `/api/uploads/${filename}`, name: filename, size: f.size });
    }

    return Response.json({ ok: true, files: saved });
  } catch (e) {
    return Response.json({ error: "Ошибка загрузки" }, { status: 500 });
  }
}
