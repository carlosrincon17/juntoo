'use server'

import { Debts } from "@/app/types/debts";
import { DebtsTable } from "@/drizzle/schema";
import { db } from "@/utils/storage/db";
import { eq, sql } from "drizzle-orm";


export async function getDebts(): Promise<Debts[]> {
    return await db.query.DebtsTable.findMany({});
}

export async function getTotalDebts(): Promise<number> {
    const totalDebts = await db
        .select({
            totalDebts: sql`COALESCE(SUM(${DebtsTable.value}), 0)`,
        })
        .from(DebtsTable)
    return totalDebts[0].totalDebts as number;
}

export async function updateDebt(debt: Debts): Promise<void> {
    await db.update(DebtsTable)
        .set(debt)
        .where(eq(DebtsTable.id, debt.id))
    return;
}