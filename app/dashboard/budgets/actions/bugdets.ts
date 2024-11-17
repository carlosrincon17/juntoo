'use server'

import { getUser } from "@/app/actions/auth";
import { Budget, BudgetWithExpenses } from "@/app/types/budget";
import { BudgetsTable, ExpensesTable } from "@/drizzle/schema";
import { db } from "@/utils/storage/db";
import { eq, sql, and } from "drizzle-orm";


export async function getBudgets(): Promise<Budget[]> {
    const user = await getUser();
    return await db.query.BudgetsTable.findMany({
        where: and(
            eq(BudgetsTable.familyId, user.familyId),
            eq(BudgetsTable.isActive, true)
        )
    });
}

export async function getBudgetsActiveWithExpenses(): Promise<BudgetWithExpenses[]> {
    const user = await getUser();
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
        .where(
            and(
                eq(BudgetsTable.isActive, true),
                eq(BudgetsTable.familyId, user?.familyId)
            )
        )
        .groupBy(BudgetsTable.id)
        .orderBy(BudgetsTable.name)
    return activeBudgetsWithTotalExpenses as BudgetWithExpenses[];
}

export async function deleteBudget(budgetId: number): Promise<void> {
    await db.delete(BudgetsTable).where(
        eq(BudgetsTable.id, budgetId)
    );
}

export async function deactivateBudget(budgetId: number): Promise<void> {
    await db.update(BudgetsTable)
        .set({
            isActive: false,
        })
        .where(
            eq(BudgetsTable.id, budgetId)
        )
    return;
}