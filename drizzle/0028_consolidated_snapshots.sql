CREATE TABLE "consolidated_snapshots" (
	"id" serial PRIMARY KEY NOT NULL,
	"family_id" integer NOT NULL,
	"created_by" integer NOT NULL,
	"note" text,
	"savings" jsonb NOT NULL,
	"patrimonies" jsonb NOT NULL,
	"debts" jsonb NOT NULL,
	"totals" jsonb NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "consolidated_snapshots" ADD CONSTRAINT "consolidated_snapshots_family_id_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consolidated_snapshots" ADD CONSTRAINT "consolidated_snapshots_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "consolidated_snapshots_family_created_idx" ON "consolidated_snapshots" USING btree ("family_id","createdAt");