CREATE TABLE IF NOT EXISTS "loans" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"value" bigint NOT NULL,
	"family_id" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "loans" ADD CONSTRAINT "loans_family_id_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
