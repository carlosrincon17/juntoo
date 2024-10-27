'use server'

import { Budget, BudgetWithExpenses } from "@/app/types/budget";
import { BudgetsTable, ExpensesTable } from "@/drizzle/schema";
import { db } from "@/utils/storage/db";
import { eq, sql } from "drizzle-orm";


export async function getBudgets(): Promise<Budget[]> {
    return await db.query.BudgetsTable.findMany({
        where: eq(BudgetsTable.isActive, true),
    });
}

export async function getBudgetsActiveWithExpenses(): Promise<BudgetWithExpenses[]> { 
    const activeBudgetsWithTotalExpenses = await db
        .select({
            id: BudgetsTable.id,
            name: BudgetsTable.name,
            value: BudgetsTable.value,
            totalExpenses: sql<number>`COALESCE(SUM(${ExpensesTable.value}), 0)`, 
            isActive: BudgetsTable.isActive,
        })
        .from(BudgetsTable)
        .leftJoin(ExpensesTable, eq(BudgetsTable.id, ExpensesTable.budgetId))
        .where(eq(BudgetsTable.isActive, true))
        .groupBy(BudgetsTable.id)
        .orderBy(BudgetsTable.name)
    return activeBudgetsWithTotalExpenses as BudgetWithExpenses[];
}