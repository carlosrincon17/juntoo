CREATE TABLE IF NOT EXISTS "periodic_payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"value" bigint NOT NULL,
	"category_id" integer NOT NULL,
	"frequency" text NOT NULL,
	"start_date" date NOT NULL,
	"user_id" integer NOT NULL,
	"family_id" integer NOT NULL,
	"transaction_type" text NOT NULL
);
DO $$ BEGIN
 ALTER TABLE "periodic_payments" ADD CONSTRAINT "periodic_payments_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
 ALTER TABLE "periodic_payments" ADD CONSTRAINT "periodic_payments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
 ALTER TABLE "periodic_payments" ADD CONSTRAINT "periodic_payments_family_id_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
