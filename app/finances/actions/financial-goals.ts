'use server'

import { FinancialGoal } from "@/app/types/financial-goal";
import { db } from "@/utils/storage/db";
import { FinancialGoalsTable } from "@/drizzle/schema";
import { getUser } from "@/app/actions/auth";
import { desc, eq } from "drizzle-orm";


export async function getFinancialGoals(): Promise<FinancialGoal[]> {
    const user = await getUser();
    const financialGoals = await db
        .select()
        .from(FinancialGoalsTable)
        .where(
            eq(FinancialGoalsTable.familyId, user.familyId)
        )
        .orderBy(desc(FinancialGoalsTable.id))
    return financialGoals;
}

export async function addFinancialGoal(financialGoal: FinancialGoal) {
    const user = await getUser();
    await db.insert(FinancialGoalsTable).values({
        name: financialGoal.name,
        value: financialGoal.value,
        familyId: user.familyId,
    });
}

export async function updateFinancialGoal(financialGoal: FinancialGoal) {
    await db.update(FinancialGoalsTable).set({
        name: financialGoal.name,
        value: financialGoal.value,
    }).where(
        eq(FinancialGoalsTable.id, financialGoal.id)
    );
}

export async function removeFinancialGoal(financialGoal: FinancialGoal) {
    await db.delete(FinancialGoalsTable).where(
        eq(FinancialGoalsTable.id, financialGoal.id)
    );
}

