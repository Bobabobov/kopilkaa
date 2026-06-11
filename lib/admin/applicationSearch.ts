import { Prisma, type PrismaClient } from "@prisma/client";
import { digitsFingerprint } from "@/lib/admin/requisitesFingerprint";

/** Убирает @ у ника и лишние пробелы. */
export function normalizeAdminApplicationSearchQuery(raw: string): string {
  return raw.trim().replace(/^@+/, "");
}

/** Экранирование для LIKE (SQLite). */
export function escapeSqlLikePattern(value: string): string {
  return value.replace(/[%_\\]/g, "\\$&");
}

/** Текст истории без HTML — для клиентского и серверного поиска. */
export function stripHtmlForSearch(html: string): string {
  return (html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Варианты строки для SQLite: contains без mode: 'insensitive'.
 * JS-корректно обрабатывает кириллицу (Иван → иван).
 */
export function getSearchTermVariants(term: string): string[] {
  const t = term.trim();
  if (!t) return [];

  const lower = t.toLowerCase();
  const upper = t.toUpperCase();
  const capitalized = lower.charAt(0).toUpperCase() + lower.slice(1);
  const titleCase = t
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  return [...new Set([t, lower, upper, capitalized, titleCase].filter(Boolean))];
}

function splitSearchTerms(rawQuery: string): string[] {
  const normalized = normalizeAdminApplicationSearchQuery(rawQuery);
  if (!normalized) return [];
  return normalized.split(/\s+/).filter((part) => part.length > 0);
}

function containsField(
  field: string,
  variants: string[],
): Prisma.ApplicationWhereInput[] {
  return variants.map((value) => ({ [field]: { contains: value } }));
}

function containsUserField(
  field: "name" | "username" | "email" | "telegramUsername",
  variants: string[],
): Prisma.ApplicationWhereInput[] {
  return variants.map((value) => ({
    user: { [field]: { contains: value } },
  }));
}

/** OR-условия Prisma для одного поискового термина. */
export function buildOrClausesForSearchTerm(
  term: string,
): Prisma.ApplicationWhereInput[] {
  const normalized = normalizeAdminApplicationSearchQuery(term);
  if (!normalized) return [];

  const variants = getSearchTermVariants(normalized);
  const withAtPrefix = normalized.startsWith("@")
    ? []
    : getSearchTermVariants(`@${normalized}`);

  const allVariants = [...new Set([...variants, ...withAtPrefix])];

  const clauses: Prisma.ApplicationWhereInput[] = [
    ...containsField("title", allVariants),
    ...containsField("summary", allVariants),
    ...containsField("story", allVariants),
    ...containsField("payment", allVariants),
    ...containsField("adminComment", allVariants),
    ...containsUserField("name", allVariants),
    ...containsUserField("username", allVariants),
    ...containsUserField("email", allVariants),
    ...containsUserField("telegramUsername", allVariants),
  ];

  const digits = digitsFingerprint(normalized);
  if (digits) {
    clauses.push({ paymentFingerprint: { contains: digits } });
  }

  const numeric = Number(normalized.replace(/\s/g, ""));
  if (!Number.isNaN(numeric) && normalized.replace(/\s/g, "") !== "") {
    clauses.push({ amount: numeric });
  }

  return clauses;
}

/**
 * WHERE для текстового поиска заявок в админке (Prisma).
 * Несколько слов — каждое должно встретиться хотя бы в одном поле (AND).
 */
export function buildApplicationTextSearchWhere(
  rawQuery: string,
): Prisma.ApplicationWhereInput | null {
  const terms = splitSearchTerms(rawQuery);
  if (terms.length === 0) return null;

  if (terms.length > 1) {
    return {
      AND: terms.map((term) => ({
        OR: buildOrClausesForSearchTerm(term),
      })),
    };
  }

  const or = buildOrClausesForSearchTerm(terms[0]);
  return or.length ? { OR: or } : null;
}

/** SQL-выражение: story без типовых HTML-тегов (для LIKE в SQLite). */
const STRIPPED_STORY_SQL = `replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(story, '<p>', ' '), '</p>', ' '), '<br/>', ' '), '<br>', ' '), '<strong>', ' '), '</strong>', ' '), '<em>', ' '), '</em>', ' '), '<li>', ' '), '</li>', ' '), '<h3>', ' '), '</h3>', ' ')`;

async function findIdsByPlainStoryVariant(
  prisma: PrismaClient,
  variant: string,
): Promise<string[]> {
  const pattern = `%${escapeSqlLikePattern(variant)}%`;
  const rows = await prisma.$queryRaw<Array<{ id: string }>>`
    SELECT id FROM Application
    WHERE ${Prisma.raw(STRIPPED_STORY_SQL)} LIKE ${pattern}
  `;
  return rows.map((row) => row.id);
}

/** ID заявок, где plain-text истории совпадает с термином (обход HTML). */
export async function findApplicationIdsByPlainStoryTerm(
  prisma: PrismaClient,
  term: string,
): Promise<string[]> {
  const normalized = normalizeAdminApplicationSearchQuery(term);
  if (!normalized) return [];

  const variants = getSearchTermVariants(normalized);
  const ids = new Set<string>();

  for (const variant of variants) {
    const found = await findIdsByPlainStoryVariant(prisma, variant);
    for (const id of found) ids.add(id);
  }

  return [...ids];
}

async function findIdsForSearchTerm(
  prisma: PrismaClient,
  term: string,
): Promise<Set<string>> {
  const ids = new Set<string>();

  const prismaWhere: Prisma.ApplicationWhereInput = {
    OR: buildOrClausesForSearchTerm(term),
  };

  const [fromPrisma, fromPlainStory] = await Promise.all([
    prisma.application.findMany({
      where: prismaWhere,
      select: { id: true },
    }),
    findApplicationIdsByPlainStoryTerm(prisma, term),
  ]);

  for (const row of fromPrisma) ids.add(row.id);
  for (const id of fromPlainStory) ids.add(id);

  return ids;
}

/**
 * Полный серверный поиск: Prisma OR + plain-text история.
 * Несколько слов — пересечение (AND).
 */
export async function buildApplicationSearchWhere(
  prisma: PrismaClient,
  rawQuery: string,
): Promise<Prisma.ApplicationWhereInput | null> {
  const terms = splitSearchTerms(rawQuery);
  if (terms.length === 0) return null;

  if (terms.length === 1) {
    const ids = await findIdsForSearchTerm(prisma, terms[0]);
    return ids.size ? { id: { in: [...ids] } } : { id: { in: [] } };
  }

  let intersection: Set<string> | null = null;

  for (const term of terms) {
    const ids = await findIdsForSearchTerm(prisma, term);
    if (intersection === null) {
      intersection = ids;
    } else {
      const prev = Array.from(intersection) as string[];
      intersection = new Set(prev.filter((id) => ids.has(id)));
    }
    if (intersection.size === 0) break;
  }

  return { id: { in: intersection ? Array.from(intersection) : [] } };
}

type ClientSearchUser = {
  name?: string | null;
  username?: string | null;
  email?: string | null;
  telegramUsername?: string | null;
};

type ClientSearchItem = {
  title: string;
  summary: string;
  story: string;
  payment: string;
  adminComment?: string | null;
  amount: number;
  user: ClientSearchUser;
};

/** Мгновенная клиентская фильтрация (пока ждём ответ API). */
export function applicationMatchesClientSearch(
  item: ClientSearchItem,
  rawQuery: string,
): boolean {
  const terms = splitSearchTerms(rawQuery);
  if (terms.length === 0) return true;

  const haystack = [
    item.title,
    item.summary,
    stripHtmlForSearch(item.story),
    item.payment,
    item.adminComment,
    item.user.name,
    item.user.username,
    item.user.email,
    item.user.telegramUsername,
    String(item.amount),
  ]
    .filter((part) => part != null && String(part).length > 0)
    .join(" ");

  return terms.every((term) => {
    const variants = getSearchTermVariants(term);
    return variants.some((variant) =>
      haystack.toLowerCase().includes(variant.toLowerCase()),
    );
  });
}
