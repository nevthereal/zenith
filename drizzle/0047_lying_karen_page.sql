ALTER TABLE "users" ALTER COLUMN "paid" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "admin" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "admin" SET NOT NULL;