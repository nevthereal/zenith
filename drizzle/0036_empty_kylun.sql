ALTER TABLE "verification_codes" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "verification_codes" ALTER COLUMN "email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "verification_codes" ALTER COLUMN "expires" SET NOT NULL;