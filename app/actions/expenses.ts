'use server'

import { CategoryTable, ExpensesTable, UserTable } from "@/drizzle/schema";
import { db } from "@/utils/storage/db";
import { CategoryExpense, Expense, ExpenseByDate, TotalExpenses, UserExpense } from "../types/expense";
import { and, asc, count, desc, eq, gte, inArray, lte, not, sql } from "drizzle-orm";
import { ExpensesFilters } from "../types/filters";
import { TransactionType } from "@/utils/enums/transaction-type";
import { getUser } from "./auth";
import { FinancialCategoryData, FinancialData } from "../types/financial";

const totalsFilters = {
    totalExpenses: sql<number>`cast(sum(case when ${ExpensesTable.transactionType} = ${TransactionType.Outcome} then ${ExpensesTable.value} else 0 end) as bigint)`.mapWith(Number),
    totalIncomes: sql<number>`cast(sum(case when ${ExpensesTable.transactionType} = ${TransactionType.Income} then ${ExpensesTable.value} else 0 end) as bigint)`.mapWith(Number)
}

export async function addExpense(expense: Expense) {
    const user = await getUser()
    await db.insert(ExpensesTable).values({
        createdBy: expense.createdBy ?? "",
        value: expense.value ?? 0,
        category_id: expense.category_id,
        transactionType: expense.transactionType || TransactionType.Outcome,
        budgetId: expense.budgetId,
        createdAt: expense.createdAt,
        familyId: user.familyId,
        userId: user.id,
    });
}   

export async function getExpenses(page: number, perPage: number, transactionType?: TransactionType): Promise<Expense[]> {
    const user = await getUser();
    const filter = [eq(ExpensesTable.familyId, user.familyId)];
    if (transactionType) {
        filter.push(eq(ExpensesTable.transactionType, transactionType));
    }
    return await db.query.ExpensesTable.findMany({
        where: and(...filter),
        limit: perPage,
        offset: (page -1) * perPage,
        with: {
            category: true,
            user: true
        },
        orderBy: desc(ExpensesTable.id),
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
    const user = await getUser();
    const counterResult = await db.select({
        count: count(ExpensesTable.id)
    }).from(
        ExpensesTable
    ).where(
        eq(ExpensesTable.familyId, user.familyId)
    )
    return counterResult[0].count as number;
}

export async function getExpensesByFilter(page: number, perPage: number, filters?: ExpensesFilters): Promise<Expense[]> {
    const user = await getUser();
    const condition = filters ? and(
        gte(ExpensesTable.createdAt, filters.startDate),
        lte(ExpensesTable.createdAt, filters.endDate),
    ) : and();
    return await db.query.ExpensesTable.findMany({
        where: condition?.append(eq(ExpensesTable.familyId, user.familyId)),
        limit: perPage,
        offset: (page -1) * perPage,
        with: {
            category: true,
            user: true
        },
        orderBy: desc(ExpensesTable.id),
    });
}

export async function getCountExpensesByFilter(filters?: ExpensesFilters): Promise<number> {
    const user = await getUser();
    const condition = filters ? and(
        gte(ExpensesTable.createdAt, filters.startDate),
        lte(ExpensesTable.createdAt, filters.endDate),
    ) : and();
    const counterResult = await db.select({
        count: count(ExpensesTable.id).mapWith(Number)
    }).from(
        ExpensesTable
    ).where(
        condition?.append(eq(ExpensesTable.familyId, user.familyId))
    )
    return counterResult[0].count as number;
}


export async function getTopCategoriesWithMostExpenses(filters: ExpensesFilters | undefined, transactionType: TransactionType): Promise<CategoryExpense[]> {
    const user = await getUser();
    const condition =  filters ? [
        gte(ExpensesTable.createdAt, filters.startDate),
        lte(ExpensesTable.createdAt, filters.endDate),
    ]: [];
    const topCategoriesWithMostExpenses = await db
        .select({
            categoryName: transactionType === TransactionType.Outcome ? CategoryTable.parent : CategoryTable.name,
            totalExpenses: sql<number>`cast(sum(${ExpensesTable.value}) as bigint)`.mapWith(Number),
        })
        .from(ExpensesTable)
        .innerJoin(CategoryTable, eq(ExpensesTable.category_id, CategoryTable.id))
        .where(
            and(
                ...condition,
                eq(ExpensesTable.familyId, user.familyId),
                eq(ExpensesTable.transactionType, transactionType),
                not(eq(CategoryTable.parent, 'Deudas')) 
            )
        )
        .groupBy(transactionType === TransactionType.Outcome ? CategoryTable.parent : CategoryTable.name)
        .orderBy(desc(sql<number>`sum(${ExpensesTable.value})`))
    return topCategoriesWithMostExpenses as CategoryExpense[];
}

export async function getTotalsExpenses(filters: ExpensesFilters): Promise<TotalExpenses> {
    const user = await getUser();
    const totalExpenses = await db
        .select({
            ...totalsFilters
        })
        .from(ExpensesTable)
        .where(
            and(
                eq(ExpensesTable.familyId, user.familyId),
                gte(ExpensesTable.createdAt, filters.startDate),
                lte(ExpensesTable.createdAt, filters.endDate),
            )
        )
    return totalExpenses[0] as TotalExpenses;
}

export async function getExpensesByUser(filters: ExpensesFilters): Promise<UserExpense[]> {
    const user = await getUser();
    const expensesByUser = await db
        .select({
            userName: UserTable.name,
            totalExpenses: sql<number>`sum(${ExpensesTable.value}) as bigint`.mapWith(Number),
        })
        .from(ExpensesTable)
        .leftJoin(UserTable, eq(ExpensesTable.userId, UserTable.id))
        .where(
            and(
                eq(ExpensesTable.familyId, user.familyId),
                gte(ExpensesTable.createdAt, filters.startDate),
                lte(ExpensesTable.createdAt, filters.endDate),
                eq(ExpensesTable.transactionType, TransactionType.Outcome)
            )
        )
        .groupBy(UserTable.name)
    return expensesByUser as UserExpense[];
}

export async function getIncomesByCategory(filters: ExpensesFilters): Promise<CategoryExpense[]> {
    const user = await getUser();
    const incomesByCategory = await db
        .select({
            categoryName: CategoryTable.name,
            totalExpenses: sql<number>`cast(sum(${ExpensesTable.value}) as bigint)`.mapWith(Number),
        })
        .from(ExpensesTable)
        .innerJoin(CategoryTable, eq(ExpensesTable.category_id, CategoryTable.id))
        .where(
            and(
                eq(ExpensesTable.familyId, user.familyId),
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

export async function getExpensesByDate(filters?: ExpensesFilters): Promise<ExpenseByDate[]> {
    const user = await getUser();
    const initialFilters = filters ? [
        gte(ExpensesTable.createdAt, filters.startDate),
        lte(ExpensesTable.createdAt, filters.endDate),
    ] : [];
    const expensesByDate = await db
        .select({
            date: sql<string>`EXTRACT(DAY FROM "createdAt")`,
            totalExpenses: sql<number>`COALESCE(SUM(${ExpensesTable.value}), 0)`.mapWith(Number),
        })
        .from(ExpensesTable)
        .leftJoin(CategoryTable, eq(ExpensesTable.category_id, CategoryTable.id))
        .where(
            and(
                ...initialFilters,
                eq(ExpensesTable.familyId, user.familyId),
                eq(ExpensesTable.transactionType, TransactionType.Outcome),
                not(eq(CategoryTable.parent, 'Deudas'))
            )
        )
        .groupBy(sql<string>`EXTRACT(DAY FROM "createdAt")`)
        .orderBy(asc(sql<number>`EXTRACT(DAY FROM "createdAt")`))
    return expensesByDate as ExpenseByDate[];
}

export async function getExpensesByMonth(): Promise<ExpenseByDate[]> {
    const user = await getUser();
    const expensesByDate = await db
        .select({
            date: sql<string>`TO_CHAR("createdAt", 'Mon, YYYY')`,
            totalExpenses: sql<number>`COALESCE(SUM(${ExpensesTable.value}), 0)`.mapWith(Number),
            minDate: sql<string>`MIN("createdAt")`
        })
        .from(ExpensesTable)
        .leftJoin(CategoryTable, eq(ExpensesTable.category_id, CategoryTable.id))
        .where(
            and(
                eq(ExpensesTable.familyId, user.familyId),
                eq(ExpensesTable.transactionType, TransactionType.Outcome),
            )
        )
        .groupBy(sql<string>`TO_CHAR("createdAt", 'Mon, YYYY')`)
        .orderBy(asc(sql<string>`MIN("createdAt")`)) 
        .limit(6)
    return expensesByDate as ExpenseByDate[];
}

export async function getFinancialOverviewByMonth(): Promise<FinancialData[]> {
    const user = await getUser();
    const expensesByDate = await db
        .select({
            month: sql<string>`TO_CHAR(${ExpensesTable.createdAt}, 'Mon, YYYY')`,
            expenses: sql<number>`
                COALESCE(
                    SUM(CASE WHEN ${CategoryTable.transactionType} = ${TransactionType.Outcome} THEN ${ExpensesTable.value} ELSE 0 END),
                    0
                )
            `.mapWith(Number),
            income: sql<number>`
                COALESCE(
                    SUM(CASE WHEN ${CategoryTable.transactionType} = ${TransactionType.Income} THEN ${ExpensesTable.value} ELSE 0 END),
                    0
                )
            `.mapWith(Number),
            savings: sql<number>`
                COALESCE(
                    SUM(CASE WHEN ${CategoryTable.transactionType} = ${TransactionType.Income} THEN ${ExpensesTable.value} ELSE 0 END) -
                    SUM(CASE WHEN ${CategoryTable.transactionType} = ${TransactionType.Outcome} THEN ${ExpensesTable.value} ELSE 0 END),
                    0
                )
            `.mapWith(Number)
        })
        .from(ExpensesTable)
        .leftJoin(CategoryTable, eq(ExpensesTable.category_id, CategoryTable.id))
        .where(
            and(
                eq(ExpensesTable.familyId, user.familyId),
                inArray(ExpensesTable.transactionType, [TransactionType.Outcome, TransactionType.Income])
            )
        )
        .groupBy(sql<string>`TO_CHAR(${ExpensesTable.createdAt}, 'Mon, YYYY')`)
        .orderBy(desc(sql<string>`MIN(${ExpensesTable.createdAt})`))
        .limit(12);
    return (expensesByDate as FinancialData[]).reverse();
}

export async function getExpensesByParentCategory(): Promise<FinancialCategoryData[]> {
    const user = await getUser();

    const rawData = await db
        .select({
            categoryParent: CategoryTable.parent,
            month: sql<string>`TO_CHAR(${ExpensesTable.createdAt}, 'Mon, YYYY')`,
            total: sql<number>`
        COALESCE(SUM(${ExpensesTable.value}), 0)
      `.mapWith(Number),
        })
        .from(ExpensesTable)
        .leftJoin(CategoryTable, eq(ExpensesTable.category_id, CategoryTable.id))
        .where(
            and(
                eq(ExpensesTable.familyId, user.familyId),
                eq(CategoryTable.transactionType, TransactionType.Outcome)
            )
        )
        .groupBy(
            CategoryTable.parent,
            sql<string>`TO_CHAR(${ExpensesTable.createdAt}, 'Mon, YYYY')`
        )
        .orderBy(
            CategoryTable.parent,
            desc(sql<string>`MIN(${ExpensesTable.createdAt})`)
        );

    const grouped: Record<string, { month: string; total: number }[]> = {};
    for (const row of rawData) {
        if (!row.categoryParent) {
            continue;
        }
        if (!grouped[row.categoryParent]) {
            grouped[row.categoryParent] = [];
        }
        grouped[row.categoryParent].push({
            month: row.month,
            total: row.total,
        });
    }

    return Object.entries(grouped).map(([categoryParent, totalsByMonth]) => ({
        categoryParent,
        totalsByMonth: totalsByMonth.reverse(),
    }));
}
