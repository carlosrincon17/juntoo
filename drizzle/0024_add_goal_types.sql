CREATE TABLE IF NOT EXISTS "family_goals" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"year" integer NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"is_completed" boolean DEFAULT false NOT NULL,
	"family_id" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"type" text DEFAULT 'BOOLEAN' NOT NULL,
	"target_amount" integer,
	"current_amount" integer DEFAULT 0
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "family_goals" ADD CONSTRAINT "family_goals_family_id_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
