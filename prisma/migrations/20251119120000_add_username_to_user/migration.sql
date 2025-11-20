-- Add username column to User table
ALTER TABLE "User" ADD COLUMN "username" TEXT;

-- Fill usernames for existing users based on email prefix + user id fragment
UPDATE "User"
SET "username" = lower(
  replace(
    substr(
      "email",
      1,
      CASE
        WHEN instr("email", '@') > 0 THEN instr("email", '@') - 1
        ELSE length("email")
      END
    ),
    ' ',
    ''
  )
) || '_' || substr("id", 1, 4)
WHERE "username" IS NULL;

-- Ensure usernames are unique (SQLite allows multiple NULLs)
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

