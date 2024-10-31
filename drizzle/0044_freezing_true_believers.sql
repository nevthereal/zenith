ALTER TABLE "users" DROP CONSTRAINT "users_github_id_unique";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "provider" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "github_id";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "trial_end";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "stripe_id";