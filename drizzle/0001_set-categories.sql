-- Custom SQL migration file, put you code below! --
INSERT INTO "categories" ("name", "parent", "icon", "color", "transaction_type") VALUES ('Domicilio', 'Comidas', 'restaurant', 'indigo', 'OUTCOME');
INSERT INTO "categories" ("name", "parent", "icon", "color", "transaction_type") VALUES ('Restaurante', 'Comidas', 'restaurant', 'indigo', 'OUTCOME');

INSERT INTO "categories" ("name", "parent", "icon", "color", "transaction_type") VALUES ('Agua', 'Servicios', 'restaurant', 'fuchsia', 'OUTCOME');
INSERT INTO "categories" ("name", "parent", "icon", "color", "transaction_type") VALUES ('Gas', 'Servicios', 'restaurant', 'fuchsia', 'OUTCOME');
INSERT INTO "categories" ("name", "parent", "icon", "color", "transaction_type") VALUES ('Internet', 'Servicios', 'restaurant', 'fuchsia', 'OUTCOME');
INSERT INTO "categories" ("name", "parent", "icon", "color", "transaction_type") VALUES ('Luz', 'Servicios', 'restaurant', 'fuchsia', 'OUTCOME');
INSERT INTO "categories" ("name", "parent", "icon", "color", "transaction_type") VALUES ('Celular', 'Servicios', 'restaurant', 'fuchsia', 'OUTCOME');

INSERT INTO "categories" ("name", "parent", "icon", "color", "transaction_type") VALUES ('Youtube', 'Suscripciones', 'restaurant', 'cyan', 'OUTCOME');
INSERT INTO "categories" ("name", "parent", "icon", "color", "transaction_type") VALUES ('Netflix', 'Suscripciones', 'restaurant', 'cyan', 'OUTCOME');
INSERT INTO "categories" ("name", "parent", "icon", "color", "transaction_type") VALUES ('Disney', 'Suscripciones', 'restaurant', 'cyan', 'OUTCOME');
INSERT INTO "categories" ("name", "parent", "icon", "color", "transaction_type") VALUES ('Amazon', 'Suscripciones', 'restaurant', 'cyan', 'OUTCOME');
INSERT INTO "categories" ("name", "parent", "icon", "color", "transaction_type") VALUES ('Goole One', 'Suscripciones', 'restaurant', 'cyan', 'OUTCOME');

INSERT INTO "categories" ("name", "parent", "icon", "color", "transaction_type") VALUES ('Comida', 'Mascota', 'restaurant', 'amber', 'OUTCOME');
INSERT INTO "categories" ("name", "parent", "icon", "color", "transaction_type") VALUES ('Veterinario', 'Mascota', 'restaurant', 'amber', 'OUTCOME');
INSERT INTO "categories" ("name", "parent", "icon", "color", "transaction_type") VALUES ('Baños', 'Mascota', 'restaurant', 'amber', 'OUTCOME');

INSERT INTO "categories" ("name", "parent", "icon", "color", "transaction_type") VALUES ('Prestamo Familiar', 'Deudas', 'restaurant', 'rose', 'OUTCOME');
INSERT INTO "categories" ("name", "parent", "icon", "color", "transaction_type") VALUES ('Lote', 'Deudas', 'restaurant', 'rose', 'OUTCOME');
INSERT INTO "categories" ("name", "parent", "icon", "color", "transaction_type") VALUES ('Crédito de vivienda', 'Deudas', 'restaurant', 'rose', 'OUTCOME');

INSERT INTO "categories" ("name", "parent", "icon", "color", "transaction_type") VALUES ('Mercado', 'Hogar', 'restaurant', 'violet', 'OUTCOME');
INSERT INTO "categories" ("name", "parent", "icon", "color", "transaction_type") VALUES ('Cositas', 'Hogar', 'restaurant', 'violet', 'OUTCOME');
INSERT INTO "categories" ("name", "parent", "icon", "color", "transaction_type") VALUES ('Salario empleada', 'Hogar', 'restaurant', 'violet', 'OUTCOME');

INSERT INTO "categories" ("name", "parent", "icon", "color", "transaction_type") VALUES ('Salario', 'Entradas', 'restaurant', 'emerald', 'INCOME');
INSERT INTO "categories" ("name", "parent", "icon", "color", "transaction_type") VALUES ('Inversion', 'Entrada pasiva', 'restaurant', 'green', 'INCOME');
INSERT INTO "categories" ("name", "parent", "icon", "color", "transaction_type") VALUES ('Arriendo', 'Entrada pasiva', 'restaurant', 'green', 'INCOME');
