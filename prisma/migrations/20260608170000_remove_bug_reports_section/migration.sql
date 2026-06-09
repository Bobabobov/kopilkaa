-- Bug reports section is no longer used.
DROP TABLE IF EXISTS "BugReportLike";
DROP TABLE IF EXISTS "BugReportImage";
DROP TABLE IF EXISTS "BugReport";

DROP INDEX IF EXISTS "BugReportLike_userId_bugReportId_key";
DROP INDEX IF EXISTS "BugReportLike_userId_idx";
DROP INDEX IF EXISTS "BugReportLike_bugReportId_idx";
DROP INDEX IF EXISTS "BugReportLike_isLike_idx";
DROP INDEX IF EXISTS "BugReportImage_bugReportId_idx";
DROP INDEX IF EXISTS "BugReportImage_sort_idx";
DROP INDEX IF EXISTS "BugReport_userId_idx";
DROP INDEX IF EXISTS "BugReport_status_idx";
DROP INDEX IF EXISTS "BugReport_category_idx";
DROP INDEX IF EXISTS "BugReport_createdAt_idx";
