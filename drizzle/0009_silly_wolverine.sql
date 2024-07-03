CREATE TABLE IF NOT EXISTS "orders" (
	"order_id" text PRIMARY KEY NOT NULL,
	"cus_id" text NOT NULL,
	"session_id" text NOT NULL,
	"completed_at" timestamp NOT NULL,
	"user_id" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
