'use server'

import { getUser } from "@/app/actions/auth";
import { Savings } from "@/app/types/saving";
import { SavingsTable } from "@/drizzle/schema";
import { Currency } from "@/utils/enums/currency";
import { db } from "@/utils/storage/db";
import { and, desc, eq, sql } from "drizzle-orm";

export async function getSavings(): Promise<Savings[]> {
    const user = await getUser();
    return await db.query.SavingsTable.findMany({
        where: eq(SavingsTable.familyId, user.familyId),
        with: {
            user: true
        },
        orderBy: desc(SavingsTable.id)
    });
}   

export async function getTotalSavings(currency: Currency = Currency.COP): Promise<number> {
    const user = await getUser();
    const totalSavings = await db
        .select({
            totalSavings: sql<number>`COALESCE(SUM(${SavingsTable.value}), 0)`,
        })
        .from(SavingsTable)
        .where(
            and(
                eq(SavingsTable.currency, currency),
                eq(SavingsTable.familyId, user.familyId)
            )
        )
    return totalSavings[0].totalSavings as number;
}

export async function updateSavings(savings: Savings): Promise<void> {
    await db.update(SavingsTable)
        .set(savings)
        .where(eq(SavingsTable.id, savings.id));
    return;
}

export async function createSavings(savings: Savings): Promise<void> {
    const user = await getUser()
    savings.familyId = user.familyId
    savings.userId = user.id as number
    await db.insert(SavingsTable).values(savings);
}

export async function deleteSaving(savingId: number): Promise<void> {
    await db.delete(SavingsTable).where(
        eq(SavingsTable.id, savingId)
    );
}