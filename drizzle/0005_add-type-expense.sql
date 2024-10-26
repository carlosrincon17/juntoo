-- Custom SQL migration file, put you code below! --
CREATE TYPE transaction_type_enum AS ENUM ('OUTCOME', 'INCOME');

ALTER TABLE expenses
ADD COLUMN transaction_type transaction_type_enum DEFAULT 'OUTCOME';