ALTER TABLE "savings" ADD COLUMN "is_investment" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "savings" ADD COLUMN "annual_interest_rate" real;