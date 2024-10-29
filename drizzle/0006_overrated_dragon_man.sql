CREATE TABLE IF NOT EXISTS "patrimonies" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"value" bigint NOT NULL
);

INSERT INTO "patrimonies" ("name", "value") VALUES ('Casa Canela', '270000000');
INSERT INTO "patrimonies" ("name", "value") VALUES ('Lote', '103000000'); 
INSERT INTO "patrimonies" ("name", "value") VALUES ('Vegas del Rio', '103000000');	
INSERT INTO "patrimonies" ("name", "value") VALUES ('Nissan Sentra SR', '55000000');	
