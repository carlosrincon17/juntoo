CREATE INDEX "idx_categories_parent" ON "categories" USING btree ("parent");--> statement-breakpoint
CREATE INDEX "idx_categories_type" ON "categories" USING btree ("transaction_type");--> statement-breakpoint
CREATE INDEX "idx_expenses_family_created" ON "expenses" USING btree ("family_id","createdAt");--> statement-breakpoint
CREATE INDEX "idx_expenses_family_type" ON "expenses" USING btree ("family_id","transaction_type");--> statement-breakpoint
CREATE INDEX "idx_expenses_category" ON "expenses" USING btree ("category_id");