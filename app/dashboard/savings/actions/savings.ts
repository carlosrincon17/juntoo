'use server'

import { Savings } from "@/app/types/saving";
import { SavingsTable } from "@/drizzle/schema";
import { db } from "@/utils/storage/db";
import { sql } from "drizzle-orm";

export async function getSavings(): Promise<Savings[]> {
    return await db.query.SavingsTable.findMany();
}   

export async function getTotalSavings(): Promise<number> {
    const totalSavings = await db
        .select({
            totalSavings: sql<number>`COALESCE(SUM(${SavingsTable.value}), 0)`,
        })
        .from(SavingsTable)
    return totalSavings[0].totalSavings as number;
}