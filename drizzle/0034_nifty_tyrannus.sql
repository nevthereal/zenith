CREATE TABLE IF NOT EXISTS "verification_codes" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"user_id" text,
	"email" text,
	"expires" timestamp,
	CONSTRAINT "verification_codes_user_id_unique" UNIQUE("user_id")
);
