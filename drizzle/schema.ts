import { relations } from 'drizzle-orm';
import {
    pgTable,
    serial,
    text,
    date,
    uniqueIndex,
    integer,
    timestamp,
    bigint,
    boolean
} from 'drizzle-orm/pg-core';
 
export const UsersTable = pgTable(
    'users',
    {
        id: serial('id').primaryKey(),
        name: text('name').notNull(),
        email: text('email').notNull(),
        image: text('image').notNull(),
        password: text('password').notNull(),
        createdAt: timestamp('createdAt').defaultNow().notNull(),
    },
    (users) => {
        return {
            uniqueIdx: uniqueIndex('unique_idx').on(users.email),
        };
    },
);


export const CategoryTable = pgTable(
    'categories',
    {
        id: serial('id').primaryKey(),
        name: text('name').notNull(),
        parent: text('parent').notNull(),
        icon: text('icon').notNull(),
        color: text('color').notNull(),
        transactionType: text('transaction_type').notNull(),
    },
    (categories) => {
        return {
            uniqueIdx: uniqueIndex('category_unique_idx').on(categories.name),
        };
    },
);

export const ExpensesTable = pgTable(
    'expenses',
    {
        id: serial('id').primaryKey(),
        category_id: integer("category_id").references(() => CategoryTable.id).notNull(),
        value: bigint({mode: 'number'}).notNull(),
        createdBy: text('createdBy').notNull(),
        createdAt: date('createdAt', {mode: 'date'}).defaultNow().notNull(),
        transactionType: text('transaction_type').notNull(),
        budgetId: integer("budget_id").references(() => BudgetsTable.id),
    }
);

export const SavingsTable = pgTable(
    'savings',
    {
        id: serial('id').primaryKey(),
        name: text('name').notNull(),
        value: bigint({mode: 'number'}).notNull(),
        owner: text('owner').notNull(),
    }
);


export const BudgetsTable = pgTable(
    'budgets',
    {
        id: serial('id').primaryKey(),
        name: text('name').notNull(),
        value: bigint({mode: 'number'}).notNull(),
        isActive: boolean('is_active').notNull(),
        createdAt: date('createdAt', {mode: 'date'}).defaultNow().notNull(),
    }
);

export const expenseCategoryRelationship = relations(ExpensesTable, ({ one }) => ({
    category: one(CategoryTable, {
        fields: [ExpensesTable.category_id],
        references: [CategoryTable.id],
    }),
}));

export const expenseBudgetRelationship = relations(ExpensesTable, ({ one }) => ({
    budget: one(BudgetsTable, {
        fields: [ExpensesTable.category_id],
        references: [BudgetsTable.id],
    }),
}));
