'use server'

import { Patrimony } from "@/app/types/patrimony";
import { PatrimoniesTable } from "@/drizzle/schema";
import { db } from "@/utils/storage/db";
import { desc, eq, sql } from "drizzle-orm";

export async function getPatrimonies(): Promise<Patrimony[]> {
    return db.query.PatrimoniesTable.findMany({
        orderBy: desc(PatrimoniesTable.value),
    });
}

export async function getTotalPatrimonies(): Promise<number> {
    const totalPatrimonies = await db
        .select({
            totalPatrimonies: sql`COALESCE(SUM(${PatrimoniesTable.value}), 0)`,
        })
        .from(PatrimoniesTable)

    return totalPatrimonies[0].totalPatrimonies as number;
}

export async function updatePatrimony(patrimony: Patrimony): Promise<void> {
    await db
        .update(PatrimoniesTable)
        .set(patrimony)
        .where(eq(PatrimoniesTable.id, patrimony.id))
    return;
}