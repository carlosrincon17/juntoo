'use server'

import { Budget } from "@/app/types/budget";
import { BudgetsTable } from "@/drizzle/schema";
import { db } from "@/utils/storage/db";
import { eq } from "drizzle-orm";

export async function getBudgets(): Promise<Budget[]> {
    return await db.query.BudgetsTable.findMany({
        where: eq(BudgetsTable.isActive, true),
    });
}