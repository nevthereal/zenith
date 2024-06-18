DO $$ BEGIN
 CREATE TYPE "public"."tag" AS ENUM('Private', 'Work', 'Fitness', 'Events', 'Productivity');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "tag" "tag";