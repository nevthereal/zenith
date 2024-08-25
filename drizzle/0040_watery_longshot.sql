ALTER TABLE "users" ADD COLUMN "trial_end" timestamp;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "quota";