ALTER TABLE "users" ADD COLUMN "stripe-id" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "paid" boolean DEFAULT false;