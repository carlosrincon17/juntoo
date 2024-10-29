'use server'

import { Patrimony } from "@/app/types/patrimony";
import { PatrimoniesTable } from "@/drizzle/schema";
import { db } from "@/utils/storage/db";
import { sql } from "drizzle-orm";

export async function getPatrimonies(): Promise<Patrimony[]> {
    return db.query.PatrimoniesTable.findMany({});
}

export async function getTotalPatrimonies(): Promise<number> {
    const totalPatrimonies = await db
        .select({
            totalPatrimonies: sql`COALESCE(SUM(${PatrimoniesTable.value}), 0)`,
        })
        .from(PatrimoniesTable)
    return totalPatrimonies[0].totalPatrimonies as number;
}