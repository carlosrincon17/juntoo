-- Custom SQL migration file, put you code below! --
UPDATE categories SET transaction_type = 'INCOME' WHERE id IN (15,16,17);