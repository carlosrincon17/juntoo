CREATE TABLE "financial_goals" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"value" bigint NOT NULL,
	"family_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "financial_goals" ADD CONSTRAINT "financial_goals_family_id_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON DELETE no action ON UPDATE no action;