import { relations } from 'drizzle-orm';
import {
    pgTable,
    serial,
    text,
    date,
    uniqueIndex,
    integer,
    timestamp,
    bigint
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
        category_id: integer("category_id").references(() => CategoryTable.id),
        value: bigint({mode: 'number'}).notNull(),
        createdBy: text('createdBy').notNull(),
        createdAt: date('createdAt').defaultNow().notNull(),
    }
);

export const expenseCategoryRelationship = relations(ExpensesTable, ({ one }) => ({
    category: one(CategoryTable, {
        fields: [ExpensesTable.category_id],
        references: [CategoryTable.id],
    }),
}));
