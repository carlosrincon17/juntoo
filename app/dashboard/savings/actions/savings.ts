'use server'

import { Savings } from "@/app/types/saving";
import { SavingsTable } from "@/drizzle/schema";
import { Currency } from "@/utils/enums/currency";
import { db } from "@/utils/storage/db";
import { eq, sql } from "drizzle-orm";

export async function getSavings(): Promise<Savings[]> {
    return await db.query.SavingsTable.findMany();
}   

export async function getTotalSavings(currency: Currency = Currency.COP): Promise<number> {
    const totalSavings = await db
        .select({
            totalSavings: sql<number>`COALESCE(SUM(${SavingsTable.value}), 0)`,
        })
        .from(SavingsTable)
        .where(
            eq(SavingsTable.currency, currency)
        )
    return totalSavings[0].totalSavings as number;
}

export async function updateSavings(savings: Savings): Promise<void> {
    await db.update(SavingsTable)
        .set(savings)
        .where(eq(SavingsTable.id, savings.id));
    return;
}