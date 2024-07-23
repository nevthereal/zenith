DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('active', 'archived', 'completed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"user_id" text NOT NULL,
	"status" "status" DEFAULT 'active',
	"deadline" timestamp
);
--> statement-breakpoint
ALTER TABLE "events" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "events" DROP CONSTRAINT "events_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "status" "status" DEFAULT 'active';--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "project_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "events" ADD CONSTRAINT "events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "events" ADD CONSTRAINT "events_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
