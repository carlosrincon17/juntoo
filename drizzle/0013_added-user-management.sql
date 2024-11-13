CREATE TABLE IF NOT EXISTS "families" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"reference" text NOT NULL,
	CONSTRAINT "families_reference_unique" UNIQUE("reference")
);
