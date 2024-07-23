ALTER TABLE "events" RENAME COLUMN "status" TO "completed";--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "completed" SET DATA TYPE boolean;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "completed" SET DEFAULT false;