'use server'

import { ExpensesTable } from "@/drizzle/schema";
import { db } from "@/utils/storage/db";
import { Expense } from "../types/expense";

export async function addExpense(expense: Expense) {
    await db.insert(ExpensesTable).values({
        category_id: expense.category?.id,
        value: expense.value,
        createdBy: expense.createdBy,
        createdAt: expense.createdAt,
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
