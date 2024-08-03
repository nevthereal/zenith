ALTER TABLE "events" ALTER COLUMN "completed" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "project_collaborators" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "project_collaborators" ALTER COLUMN "project_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "admin" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "paid" SET NOT NULL;