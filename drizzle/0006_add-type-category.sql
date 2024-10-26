-- Custom SQL migration file, put you code below! --
ALTER TABLE categories
ADD COLUMN transaction_type transaction_type_enum DEFAULT 'OUTCOME';

INSERT INTO "categories" ("name", "parent", "icon", "color") VALUES ('Comida', 'Mascota', 'restaurant', 'amber');
INSERT INTO "categories" ("name", "parent", "icon", "color") VALUES ('Veterinario', 'Mascota', 'restaurant', 'amber');
INSERT INTO "categories" ("name", "parent", "icon", "color") VALUES ('Baños', 'Mascota', 'restaurant', 'amber');

INSERT INTO "categories" ("name", "parent", "icon", "color") VALUES ('Salario', 'Entradas', 'restaurant', 'sky');
INSERT INTO "categories" ("name", "parent", "icon", "color") VALUES ('Inversion', 'Entradas', 'restaurant', 'sky');
INSERT INTO "categories" ("name", "parent", "icon", "color") VALUES ('Arriendo', 'Entradas', 'restaurant', 'sky');