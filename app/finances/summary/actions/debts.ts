'use server'

import { getUser } from "@/app/actions/auth";
import { Debts } from "@/app/types/debts";
import { DebtsTable } from "@/drizzle/schema";
import { db } from "@/utils/storage/db";
import { desc, eq, sql } from "drizzle-orm";


export async function getDebts(): Promise<Debts[]> {
    const user = await getUser();
    return await db.query.DebtsTable.findMany({
        where: eq(DebtsTable.familyId, user.familyId),
        orderBy: desc(DebtsTable.value),
    });
}

export async function getTotalDebts(): Promise<number> {
    const user = await getUser();
    const totalDebts = await db
        .select({
            totalDebts: sql`COALESCE(SUM(${DebtsTable.value}), 0)`,
        })
        .from(DebtsTable)
        .where(
            eq(DebtsTable.familyId, user.familyId)
        )
    return totalDebts[0].totalDebts as number;
}

export async function updateDebt(debt: Debts): Promise<void> {
    await db.update(DebtsTable)
        .set(debt)
        .where(eq(DebtsTable.id, debt.id))
    return;
}