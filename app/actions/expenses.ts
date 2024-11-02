'use server'

import { CategoryTable, ExpensesTable } from "@/drizzle/schema";
import { db } from "@/utils/storage/db";
import { CategoryExpense, Expense, TotalExpenses, UserExpense } from "../types/expense";
import { and, count, desc, eq, gte, lte, sql } from "drizzle-orm";
import { ExpensesFilters } from "../types/filters";
import { TransactionType } from "@/utils/enums/transaction-type";
import { addDaysToCurrentDate } from "../lib/dates";

const totalsFilters = {
    totalExpenses: sql<number>`cast(sum(case when ${ExpensesTable.transactionType} = ${TransactionType.Outcome} then ${ExpensesTable.value} else 0 end) as bigint)`,
    totalIncomes: sql<number>`cast(sum(case when ${ExpensesTable.transactionType} = ${TransactionType.Income} then ${ExpensesTable.value} else 0 end) as bigint)`
}

export async function addExpense(expense: Expense) {
    const date = addDaysToCurrentDate();
    await db.insert(ExpensesTable).values({
        createdBy: expense.createdBy ?? "",
        value: expense.value ?? 0,
        category_id: expense.category_id,
        transactionType: expense.transactionType || TransactionType.Outcome,
        budgetId: expense.budgetId,
        createdAt: date,
    });
}   

export async function getExpenses(page: number, perPage: number): Promise<Expense[]> {
    return await db.query.ExpensesTable.findMany({
        limit: perPage,
        offset: (page -1) * perPage,
        with: {
            category: true,
        },
        orderBy: desc(ExpensesTable.createdAt),
    });
}

export async function removeExpense(expense: Expense): Promise<void> {
    if (!expense.id) {
        return;
    }
    await db.delete(ExpensesTable).where(
        eq(ExpensesTable.id, expense.id)
    );
}

export async function getCountExpenses(): Promise<number> {
    const counterResult = await db.select({
        count: count(ExpensesTable.id)
    }).from(
        ExpensesTable
    )
    return counterResult[0].count as number;
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

export async function getExpensesByUser(filters: ExpensesFilters): Promise<UserExpense[]> {
    const expensesByUser = await db
        .select({
            userName: ExpensesTable.createdBy,
            totalExpenses: sql<number>`cast(sum(${ExpensesTable.value}) as bigint)`,
        })
        .from(ExpensesTable)
        .where(
            and(
                gte(ExpensesTable.createdAt, filters.startDate),
                lte(ExpensesTable.createdAt, filters.endDate),
                eq(ExpensesTable.transactionType, TransactionType.Outcome)
            )
        )
        .groupBy(ExpensesTable.createdBy)
    return expensesByUser as UserExpense[];
}

export async function getIncomesByCategory(filters: ExpensesFilters): Promise<CategoryExpense[]> {
    const incomesByCategory = await db
        .select({
            categoryName: CategoryTable.name,
            totalExpenses: sql<number>`cast(sum(${ExpensesTable.value}) as bigint)`,
        })
        .from(ExpensesTable)
        .innerJoin(CategoryTable, eq(ExpensesTable.category_id, CategoryTable.id))
        .where(
            and(
                gte(ExpensesTable.createdAt, filters.startDate),
                lte(ExpensesTable.createdAt, filters.endDate),
                eq(ExpensesTable.transactionType, TransactionType.Income)
            )
        )
        .groupBy(CategoryTable.name)
        .orderBy(desc(sql<number>`sum(${ExpensesTable.value})`))
        .limit(3)
    return incomesByCategory as CategoryExpense[];
}