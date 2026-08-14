-- This portal has not yet been deployed with user records. Existing environments
-- must map e-mails to phone numbers before applying this migration.
ALTER TABLE "User" DROP COLUMN "email", ADD COLUMN "phone" TEXT NOT NULL;

CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
