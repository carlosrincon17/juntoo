'use server'

import { CategoryTable, ExpensesTable, UserTable } from "@/drizzle/schema";
import { db } from "@/utils/storage/db";
import { CategoryExpense, Expense, ExpenseByDate, TotalExpenses, UserExpense, TransactionsSummaryMetrics, GroupedCategoryExpense } from "../types/expense";
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

export async function getExpenses(page: number, perPage: number, transactionType?: TransactionType, filters?: ExpensesFilters): Promise<Expense[]> {
    const user = await getUser();
    const filter = [eq(ExpensesTable.familyId, user.familyId)];
    if (transactionType) {
        filter.push(eq(ExpensesTable.transactionType, transactionType));
    }
    if (filters) {
        filter.push(gte(ExpensesTable.createdAt, filters.startDate));
        filter.push(lte(ExpensesTable.createdAt, filters.endDate));
    }
    return await db.query.ExpensesTable.findMany({
        where: and(...filter),
        limit: perPage,
        offset: (page - 1) * perPage,
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

    const whereConditions = [
        eq(ExpensesTable.familyId, user.familyId)
    ];

    if (filters) {
        whereConditions.push(gte(ExpensesTable.createdAt, filters.startDate));
        whereConditions.push(lte(ExpensesTable.createdAt, filters.endDate));
        if (filters.transactionType) {
            whereConditions.push(eq(ExpensesTable.transactionType, filters.transactionType));
        }
    }

    if (filters?.parentCategory) {
        const expenses = await db.select({
            expense: ExpensesTable,
            category: CategoryTable,
            user: UserTable
        })
            .from(ExpensesTable)
            .innerJoin(CategoryTable, eq(ExpensesTable.category_id, CategoryTable.id))
            .leftJoin(UserTable, eq(ExpensesTable.userId, UserTable.id))
            .where(and(
                ...whereConditions,
                eq(CategoryTable.parent, filters.parentCategory)
            ))
            .limit(perPage)
            .offset((page - 1) * perPage)
            .orderBy(desc(ExpensesTable.id));

        return expenses.map(e => ({
            ...e.expense,
            category: e.category,
            user: e.user
        }));
    }

    return await db.query.ExpensesTable.findMany({
        where: and(...whereConditions),
        limit: perPage,
        offset: (page - 1) * perPage,
        with: {
            category: true,
            user: true
        },
        orderBy: desc(ExpensesTable.id),
    });
}

export async function getCountExpensesByFilter(filters?: ExpensesFilters): Promise<number> {
    const user = await getUser();

    const whereConditions = [
        eq(ExpensesTable.familyId, user.familyId)
    ];

    if (filters) {
        whereConditions.push(gte(ExpensesTable.createdAt, filters.startDate));
        whereConditions.push(lte(ExpensesTable.createdAt, filters.endDate));
        if (filters.transactionType) {
            whereConditions.push(eq(ExpensesTable.transactionType, filters.transactionType));
        }
    }

    if (filters?.parentCategory) {
        const counterResult = await db.select({
            count: count(ExpensesTable.id).mapWith(Number)
        }).from(
            ExpensesTable
        )
            .innerJoin(CategoryTable, eq(ExpensesTable.category_id, CategoryTable.id))
            .where(
                and(
                    ...whereConditions,
                    eq(CategoryTable.parent, filters.parentCategory)
                )
            )
        return counterResult[0].count as number;
    }

    const counterResult = await db.select({
        count: count(ExpensesTable.id).mapWith(Number)
    }).from(
        ExpensesTable
    ).where(
        and(...whereConditions)
    )
    return counterResult[0].count as number;
}


export async function getTopCategoriesWithMostExpenses(filters: ExpensesFilters | undefined, transactionType: TransactionType): Promise<CategoryExpense[]> {
    const user = await getUser();
    const condition = filters ? [
        gte(ExpensesTable.createdAt, filters.startDate),
        lte(ExpensesTable.createdAt, filters.endDate),
    ] : [];
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

export async function getFinancialOverviewByMonth(year?: number): Promise<FinancialData[]> {
    const user = await getUser();
    const currentYear = new Date().getFullYear();
    const targetYear = year || currentYear;

    const startDate = new Date(Date.UTC(targetYear, 0, 1));
    let endDate = new Date(Date.UTC(targetYear, 11, 31, 23, 59, 59, 999));

    if (targetYear === currentYear) {
        endDate = new Date();
    }

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
                inArray(ExpensesTable.transactionType, [TransactionType.Outcome, TransactionType.Income]),
                gte(ExpensesTable.createdAt, startDate),
                lte(ExpensesTable.createdAt, endDate)
            )
        )
        .groupBy(sql<string>`TO_CHAR(${ExpensesTable.createdAt}, 'Mon, YYYY')`)
        .orderBy(asc(sql<string>`MIN(${ExpensesTable.createdAt})`));

    return expensesByDate as FinancialData[];
}

export async function getExpensesByParentCategory(year?: number): Promise<FinancialCategoryData[]> {
    const user = await getUser();
    const currentYear = new Date().getFullYear();
    const targetYear = year || currentYear;

    const startDate = new Date(Date.UTC(targetYear, 0, 1));
    let endDate = new Date(Date.UTC(targetYear, 11, 31, 23, 59, 59, 999));

    if (targetYear === currentYear) {
        endDate = new Date();
    }

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
                eq(CategoryTable.transactionType, TransactionType.Outcome),
                gte(ExpensesTable.createdAt, startDate),
                lte(ExpensesTable.createdAt, endDate)
            )
        )
        .groupBy(
            CategoryTable.parent,
            sql<string>`TO_CHAR(${ExpensesTable.createdAt}, 'Mon, YYYY')`
        )
        .orderBy(
            CategoryTable.parent,
            asc(sql<string>`MIN(${ExpensesTable.createdAt})`)
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
        totalsByMonth: totalsByMonth,
    }));
}

export async function getTransactionsSummary(filters?: ExpensesFilters): Promise<TransactionsSummaryMetrics> {
    const user = await getUser();

    const whereConditions = [
        eq(ExpensesTable.familyId, user.familyId)
    ];

    if (filters) {
        whereConditions.push(gte(ExpensesTable.createdAt, filters.startDate));
        whereConditions.push(lte(ExpensesTable.createdAt, filters.endDate));
        if (filters.transactionType) {
            whereConditions.push(eq(ExpensesTable.transactionType, filters.transactionType));
        }
    }

    const baseQuery = db.select({
        count: count(ExpensesTable.id).mapWith(Number),
        total: sql<number>`coalesce(sum(${ExpensesTable.value}), 0)`.mapWith(Number)
    }).from(ExpensesTable).where(and(...whereConditions));

    if (filters?.parentCategory) {
        // If parent category is selected, we need to join to filter, but the base metrics are simple
        // However, to be consistent with the list, we should apply the same filtering.
        // The previous implementation joined for parent category.
        // Let's do it properly.
        const queryWithCategory = db.select({
            count: count(ExpensesTable.id).mapWith(Number),
            total: sql<number>`coalesce(sum(${ExpensesTable.value}), 0)`.mapWith(Number)
        })
            .from(ExpensesTable)
            .innerJoin(CategoryTable, eq(ExpensesTable.category_id, CategoryTable.id))
            .where(and(
                ...whereConditions,
                eq(CategoryTable.parent, filters.parentCategory)
            ));

        const result = await queryWithCategory;

        // For top category, we query within the filtered set
        const topCategoryQuery = db.select({
            name: CategoryTable.name,
            total: sql<number>`sum(${ExpensesTable.value})`,
            count: count(ExpensesTable.id).mapWith(Number)
        })
            .from(ExpensesTable)
            .innerJoin(CategoryTable, eq(ExpensesTable.category_id, CategoryTable.id))
            .where(and(
                ...whereConditions,
                eq(CategoryTable.parent, filters.parentCategory)
            ))
            .groupBy(CategoryTable.name)
            .orderBy(desc(sql<number>`sum(${ExpensesTable.value})`))
            .limit(1);

        const topCategoryResult = await topCategoryQuery;

        return {
            count: result[0]?.count || 0,
            total: result[0]?.total || 0,
            topCategory: topCategoryResult[0]?.name || "N/A",
            topCategoryCount: topCategoryResult[0]?.count || 0,
            topCategoryTotal: topCategoryResult[0]?.total || 0
        };
    }

    const result = await baseQuery;

    // Top category for general filter
    const topCategoryQuery = db.select({
        name: CategoryTable.name,
        total: sql<number>`sum(${ExpensesTable.value})`,
        count: count(ExpensesTable.id).mapWith(Number)
    })
        .from(ExpensesTable)
        .innerJoin(CategoryTable, eq(ExpensesTable.category_id, CategoryTable.id))
        .where(and(...whereConditions))
        .groupBy(CategoryTable.name)
        .orderBy(desc(sql<number>`sum(${ExpensesTable.value})`))
        .limit(1);

    const topCategoryResult = await topCategoryQuery;

    return {
        count: result[0]?.count || 0,
        total: result[0]?.total || 0,
        topCategory: topCategoryResult[0]?.name || "N/A",
        topCategoryCount: topCategoryResult[0]?.count || 0,
        topCategoryTotal: topCategoryResult[0]?.total || 0
    };
}

export async function getExpensesGroupedByCategory(filters?: ExpensesFilters): Promise<GroupedCategoryExpense[]> {
    const user = await getUser();

    const whereConditions = [
        eq(ExpensesTable.familyId, user.familyId)
    ];

    if (filters) {
        whereConditions.push(gte(ExpensesTable.createdAt, filters.startDate));
        whereConditions.push(lte(ExpensesTable.createdAt, filters.endDate));
        if (filters.transactionType) {
            whereConditions.push(eq(ExpensesTable.transactionType, filters.transactionType));
        }
    }

    if (filters?.parentCategory) {
        whereConditions.push(eq(CategoryTable.parent, filters.parentCategory));
    }

    const groupedExpenses = await db.select({
        categoryName: CategoryTable.name,
        parentCategory: CategoryTable.parent,
        total: sql<number>`cast(sum(${ExpensesTable.value}) as bigint)`.mapWith(Number),
        count: count(ExpensesTable.id).mapWith(Number)
    })
        .from(ExpensesTable)
        .innerJoin(CategoryTable, eq(ExpensesTable.category_id, CategoryTable.id))
        .where(and(...whereConditions))
        .groupBy(CategoryTable.name, CategoryTable.parent)
        .orderBy(desc(sql<number>`sum(${ExpensesTable.value})`));

    return groupedExpenses.map(e => ({
        categoryName: e.categoryName,
        parentCategory: e.parentCategory || "Sin categoría",
        total: e.total,
        count: e.count
    }));
}
