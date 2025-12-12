ALTER TABLE "periodic_payments" ADD COLUMN "last_applied" date;--> statement-breakpoint
ALTER TABLE "expenses" ADD COLUMN "periodic_payment_id" integer;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_periodic_payment_id_periodic_payments_id_fk" FOREIGN KEY ("periodic_payment_id") REFERENCES "public"."periodic_payments"("id") ON DELETE no action ON UPDATE no action;