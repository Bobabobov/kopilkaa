-- Project news section is no longer used.
DROP TABLE IF EXISTS "ProjectNewsReaction";
DROP TABLE IF EXISTS "ProjectNewsMedia";
DROP TABLE IF EXISTS "ProjectNewsPost";
DROP TABLE IF EXISTS "ProjectNewsBadge";

DROP INDEX IF EXISTS "ProjectNewsReaction_postId_idx";
DROP INDEX IF EXISTS "ProjectNewsReaction_userId_idx";
DROP INDEX IF EXISTS "ProjectNewsReaction_type_idx";
DROP INDEX IF EXISTS "ProjectNewsMedia_postId_idx";
DROP INDEX IF EXISTS "ProjectNewsMedia_sort_idx";
DROP INDEX IF EXISTS "ProjectNewsPost_authorId_idx";
DROP INDEX IF EXISTS "ProjectNewsPost_createdAt_idx";
DROP INDEX IF EXISTS "ProjectNewsPost_isPublished_idx";
DROP INDEX IF EXISTS "ProjectNewsPost_badge_idx";
