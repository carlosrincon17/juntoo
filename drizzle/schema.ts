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
    boolean,
    real
} from 'drizzle-orm/pg-core';


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
        value: bigint({ mode: 'number' }).notNull(),
        createdBy: text('createdBy').notNull(),
        userId: integer("user_id").references(() => UserTable.id),
        createdAt: date('createdAt', { mode: 'date' }).defaultNow().notNull(),
        transactionType: text('transaction_type').notNull(),
        budgetId: integer("budget_id").references(() => BudgetsTable.id),
        familyId: integer("family_id").references(() => FamilyTable.id),
    }
);

export const SavingsTable = pgTable(
    'savings',
    {
        id: serial('id').primaryKey(),
        name: text('name').notNull(),
        value: bigint({ mode: 'number' }).notNull(),
        owner: text('owner').notNull(),
        userId: integer("user_id").references(() => UserTable.id),
        currency: text('currency').notNull().default('COP'),
        familyId: integer("family_id").references(() => FamilyTable.id),
        isInvestment: boolean('is_investment').notNull().default(false),
        annualInterestRate: real('annual_interest_rate'),
    }
);


export const BudgetsTable = pgTable(
    'budgets',
    {
        id: serial('id').primaryKey(),
        name: text('name').notNull(),
        value: bigint({ mode: 'number' }).notNull(),
        isActive: boolean('is_active').notNull(),
        createdAt: date('createdAt', { mode: 'date' }).defaultNow().notNull(),
        familyId: integer("family_id").references(() => FamilyTable.id),
    }
);


export const DebtsTable = pgTable(
    'debts',
    {
        id: serial('id').primaryKey(),
        name: text('name').notNull(),
        value: bigint({ mode: 'number' }).notNull(),
        initialAmount: bigint('initial_amount', { mode: 'number' }).notNull().default(0),
        familyId: integer("family_id").references(() => FamilyTable.id),
    }
);

export const PatrimoniesTable = pgTable(
    'patrimonies',
    {
        id: serial('id').primaryKey(),
        name: text('name').notNull(),
        value: bigint({ mode: 'number' }).notNull(),
        familyId: integer("family_id").references(() => FamilyTable.id),
    }
);

export const FamilyTable = pgTable(
    'families',
    {
        id: serial('id').primaryKey(),
        name: text('name').notNull(),
        reference: text('reference').notNull().unique(),
    }
);

export const UserTable = pgTable(
    'users',
    {
        id: serial('id').primaryKey(),
        name: text('name').notNull(),
        email: text('email').notNull(),
        createdAt: timestamp('createdAt').defaultNow().notNull(),
        familyId: integer("family_id").references(() => FamilyTable.id).notNull(),
        isActive: boolean('is_active').notNull(),
        isAdmin: boolean('is_admin').notNull(),
    },
    (users) => {
        return {
            emailUniqueIdx: uniqueIndex('email_unique_idx').on(users.email),
        };
    },
);

export const LoansTable = pgTable(
    'loans',
    {
        id: serial('id').primaryKey(),
        name: text('name').notNull(),
        value: bigint({ mode: 'number' }).notNull(),
        familyId: integer("family_id").references(() => FamilyTable.id).notNull(),
    }
);

export const FinancialGoalsTable = pgTable(
    'financial_goals',
    {
        id: serial('id').primaryKey(),
        name: text('name').notNull(),
        value: bigint({ mode: 'number' }).notNull(),
        familyId: integer("family_id").references(() => FamilyTable.id).notNull(),
    }
);

export const PeriodicPaymentsTable = pgTable(
    'periodic_payments',
    {
        id: serial('id').primaryKey(),
        name: text('name').notNull(),
        value: bigint({ mode: 'number' }).notNull(),
        category_id: integer("category_id").references(() => CategoryTable.id).notNull(),
        frequency: text('frequency').notNull(),
        startDate: date('start_date', { mode: 'date' }).notNull(),
        userId: integer("user_id").references(() => UserTable.id).notNull(),
        familyId: integer("family_id").references(() => FamilyTable.id).notNull(),
        transactionType: text('transaction_type').notNull(),
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

export const userFamilyRelationship = relations(UserTable, ({ one }) => ({
    family: one(FamilyTable, {
        fields: [UserTable.familyId],
        references: [FamilyTable.id],
    }),
}));

export const userExpensesRelationship = relations(ExpensesTable, ({ one }) => ({
    user: one(UserTable, {
        fields: [ExpensesTable.userId],
        references: [UserTable.id],
    }),
}));

export const userSavingsRelationship = relations(SavingsTable, ({ one }) => ({
    user: one(UserTable, {
        fields: [SavingsTable.userId],
        references: [UserTable.id],
    }),
}));

export const periodicPaymentCategoryRelationship = relations(PeriodicPaymentsTable, ({ one }) => ({
    category: one(CategoryTable, {
        fields: [PeriodicPaymentsTable.category_id],
        references: [CategoryTable.id],
    }),
}));

export const periodicPaymentUserRelationship = relations(PeriodicPaymentsTable, ({ one }) => ({
    user: one(UserTable, {
        fields: [PeriodicPaymentsTable.userId],
        references: [UserTable.id],
    }),
}));