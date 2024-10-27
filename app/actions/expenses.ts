'use server'

import { CategoryTable, ExpensesTable } from "@/drizzle/schema";
import { db } from "@/utils/storage/db";
import { CategoryExpense, Expense, TotalExpenses } from "../types/expense";
import { and, desc, eq, gte, lte, sql } from "drizzle-orm";
import { ExpensesFilters } from "../types/filters";
import { TransactionType } from "@/utils/enums/transaction-type";

const totalsFilters = {
    totalExpenses: sql<number>`cast(sum(case when ${ExpensesTable.transactionType} = ${TransactionType.Outcome} then ${ExpensesTable.value} else 0 end) as bigint)`,
    totalIncomes: sql<number>`cast(sum(case when ${ExpensesTable.transactionType} = ${TransactionType.Income} then ${ExpensesTable.value} else 0 end) as bigint)`
}

export async function addExpense(expense: Expense) {
    await db.insert(ExpensesTable).values({
        createdBy: expense.createdBy ?? "",
        value: expense.value ?? 0,
        category_id: expense.category_id,
        transactionType: expense.transactionType || TransactionType.Outcome,
        budgetId: expense.budgetId,
    });
}   

export async function getExpenses(page: number, perPage: number): Promise<Expense[]> {
    return await db.query.ExpensesTable.findMany({
        where: eq(ExpensesTable.transactionType, TransactionType.Outcome),
        limit: perPage,
        offset: page * perPage,
        with: {
            category: true,
        }
    });
}

export async function getTopCategoriesWithMostExpenses(filters: ExpensesFilters, transactionType: TransactionType): Promise<CategoryExpense[]> {
    const topCategoriesWithMostExpenses = await db
        .select({
            categoryName: CategoryTable.parent,
            totalExpenses: sql<number>`cast(sum(${ExpensesTable.value}) as bigint)`,
        })
        .from(ExpensesTable)
        .innerJoin(CategoryTable, eq(ExpensesTable.category_id, CategoryTable.id))
        .where(
            and(
                gte(ExpensesTable.createdAt, filters.startDate),
                lte(ExpensesTable.createdAt, filters.endDate),
                eq(ExpensesTable.transactionType, transactionType)
            )
        )
        .groupBy(CategoryTable.parent)
        .orderBy(desc(sql<number>`sum(${ExpensesTable.value})`))
        .limit(5)
    return topCategoriesWithMostExpenses as CategoryExpense[];
}

export async function getTotalsExpenses(filters: ExpensesFilters): Promise<TotalExpenses> {
    const totalExpenses = await db
        .select({
            ...totalsFilters
        })
        .from(ExpensesTable)
        .where(
            and(
                gte(ExpensesTable.createdAt, filters.startDate),
                lte(ExpensesTable.createdAt, filters.endDate),
            )
        )
    return totalExpenses[0] as TotalExpenses;
}