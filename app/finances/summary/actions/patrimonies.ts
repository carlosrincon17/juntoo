'use server'

import { getUser } from "@/app/actions/auth";
import { Patrimony } from "@/app/types/patrimony";
import { PatrimoniesTable } from "@/drizzle/schema";
import { db } from "@/utils/storage/db";
import { desc, eq, sql } from "drizzle-orm";

export async function getPatrimonies(): Promise<Patrimony[]> {
    const user = await getUser();
    return db.query.PatrimoniesTable.findMany({
        orderBy: desc(PatrimoniesTable.value),
        where: eq(PatrimoniesTable.familyId, user.familyId),
    });
}

export async function getTotalPatrimonies(): Promise<number> {
    const user = await getUser();
    const totalPatrimonies = await db
        .select({
            totalPatrimonies: sql`COALESCE(SUM(${PatrimoniesTable.value}), 0)`,
        })
        .from(PatrimoniesTable)
        .where(
            eq(PatrimoniesTable.familyId, user.familyId)
        )

    return totalPatrimonies[0].totalPatrimonies as number;
}

export async function updatePatrimony(patrimony: Patrimony): Promise<void> {
    await db
        .update(PatrimoniesTable)
        .set(patrimony)
        .where(eq(PatrimoniesTable.id, patrimony.id))
    return;
}

export async function deletePatrimony(id: number): Promise<void> {
    await db.delete(
        PatrimoniesTable
    ).where(eq(PatrimoniesTable.id, id));
}