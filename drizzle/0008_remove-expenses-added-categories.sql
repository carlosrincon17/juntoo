-- Custom SQL migration file, put you code below! --
DELETE FROM "expenses";

INSERT INTO "categories" ("name", "parent", "icon", "color", "transaction_type") VALUES ('Ayudas a familias', 'Familia', 'restaurant', 'blue', 'OUTCOME');
INSERT INTO "categories" ("name", "parent", "icon", "color", "transaction_type") VALUES ('Regalos', 'Familia', 'restaurant', 'blue', 'OUTCOME');

INSERT INTO "categories" ("name", "parent", "icon", "color", "transaction_type") VALUES ('Farmatodo', 'Salud', 'restaurant', 'stone', 'OUTCOME');
INSERT INTO "categories" ("name", "parent", "icon", "color", "transaction_type") VALUES ('Entrenamiento/Gym', 'Salud', 'restaurant', 'stone', 'OUTCOME');
INSERT INTO "categories" ("name", "parent", "icon", "color", "transaction_type") VALUES ('Citas Medicas', 'Salud', 'restaurant', 'stone', 'OUTCOME');