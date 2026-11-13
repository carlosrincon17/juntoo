CREATE TABLE "children" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"accent" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"family_id" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "illnesses" (
	"id" serial PRIMARY KEY NOT NULL,
	"child_id" integer NOT NULL,
	"family_id" integer NOT NULL,
	"name" text NOT NULL,
	"notes" text,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"ended_at" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "medication_doses" (
	"id" serial PRIMARY KEY NOT NULL,
	"illness_id" integer NOT NULL,
	"name" text NOT NULL,
	"dose" text,
	"given_at" timestamp DEFAULT now() NOT NULL,
	"note" text
);
--> statement-breakpoint
CREATE TABLE "temperature_readings" (
	"id" serial PRIMARY KEY NOT NULL,
	"illness_id" integer NOT NULL,
	"celsius" real NOT NULL,
	"taken_at" timestamp DEFAULT now() NOT NULL,
	"note" text
);
--> statement-breakpoint
ALTER TABLE "children" ADD CONSTRAINT "children_family_id_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "illnesses" ADD CONSTRAINT "illnesses_child_id_children_id_fk" FOREIGN KEY ("child_id") REFERENCES "public"."children"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "illnesses" ADD CONSTRAINT "illnesses_family_id_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medication_doses" ADD CONSTRAINT "medication_doses_illness_id_illnesses_id_fk" FOREIGN KEY ("illness_id") REFERENCES "public"."illnesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "temperature_readings" ADD CONSTRAINT "temperature_readings_illness_id_illnesses_id_fk" FOREIGN KEY ("illness_id") REFERENCES "public"."illnesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "children_family_name_idx" ON "children" USING btree ("family_id","name");--> statement-breakpoint
CREATE INDEX "illnesses_child_started_idx" ON "illnesses" USING btree ("child_id","started_at");--> statement-breakpoint
CREATE INDEX "illnesses_family_idx" ON "illnesses" USING btree ("family_id");--> statement-breakpoint
CREATE INDEX "medication_doses_illness_given_idx" ON "medication_doses" USING btree ("illness_id","given_at");--> statement-breakpoint
CREATE INDEX "temperature_readings_illness_taken_idx" ON "temperature_readings" USING btree ("illness_id","taken_at");