-- Custom SQL migration file, put you code below! --
UPDATE categories SET color = 'indigo' WHERE parent = 'Comidas';
UPDATE categories SET color = 'fuchsia' WHERE parent = 'Servicios';
UPDATE categories SET color = 'emerald' WHERE parent = 'Suscripciones';