'use server'

import { CategoryTable, ExpensesTable } from "@/drizzle/schema";
import { db } from "@/utils/storage/db";
import { CategoryExpense, Expense } from "../types/expense";
import { desc, eq, sql } from "drizzle-orm";

export async function addExpense(expense: Expense) {
    await db.insert(ExpensesTable).values({
        createdBy: expense.createdBy ?? "",
        value: expense.value ?? 0,
        category_id: expense.category_id,
    });
}   

export async function getExpenses(page: number, perPage: number): Promise<Expense[]> {
    return await db.query.ExpensesTable.findMany({
        limit: perPage,
        offset: page * perPage,
        with: {
            category: true,
        }
    });
}

export async function getTopCategoriesWithMostExpenses(): Promise<CategoryExpense[]> {
    const topCategoriesWithMostExpenses = await db
        .select({
            categoryName: CategoryTable.parent,
            totalExpenses: sql<number>`cast(sum(${ExpensesTable.value}) as bigint)`,
        })
        .from(ExpensesTable)
        .innerJoin(CategoryTable, eq(ExpensesTable.category_id, CategoryTable.id))
        .groupBy(CategoryTable.parent)
        .orderBy(desc(sql<number>`sum(${ExpensesTable.value})`))
        .limit(5)
    return topCategoriesWithMostExpenses as CategoryExpense[];
}

export async function getTotalsExpenses(): Promise<number> {
    const totalExpenses = await db
        .select({
            totalExpenses: sql<number>`cast(sum(${ExpensesTable.value}) as bigint)`,
        })
        .from(ExpensesTable)    
    return totalExpenses[0].totalExpenses as number;
}