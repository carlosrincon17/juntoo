'use server'

import { FamilyGoal } from "@/app/types/family-goal";
import { db } from "@/utils/storage/db";
import { FamilyGoalsTable } from "@/drizzle/schema";
import { getUser } from "@/app/actions/auth";
import { desc, eq, and } from "drizzle-orm";

export async function getFamilyGoals(year: number): Promise<FamilyGoal[]> {
    const user = await getUser();
    const goals = await db.query.FamilyGoalsTable.findMany({
        where: and(
            eq(FamilyGoalsTable.familyId, user.familyId),
            eq(FamilyGoalsTable.year, year)
        ),
        orderBy: desc(FamilyGoalsTable.createdAt)
    });
    return goals as FamilyGoal[];
}

export async function createFamilyGoal(goal: Partial<FamilyGoal>) {
    const user = await getUser();
    await db.insert(FamilyGoalsTable).values({
        title: goal.title!,
        description: goal.description,
        year: goal.year!,
        progress: goal.progress || 0,
        isCompleted: goal.isCompleted || false,
        familyId: user.familyId,
        type: goal.type || 'BOOLEAN',
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount || 0,
    });
}

export async function updateFamilyGoal(goal: FamilyGoal) {
    await db.update(FamilyGoalsTable).set({
        title: goal.title,
        description: goal.description,
        year: goal.year,
        progress: goal.progress,
        isCompleted: goal.isCompleted,
        type: goal.type,
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount,
    }).where(
        eq(FamilyGoalsTable.id, goal.id)
    );
}

export async function deleteFamilyGoal(id: number) {
    await db.delete(FamilyGoalsTable).where(
        eq(FamilyGoalsTable.id, id)
    );
}
