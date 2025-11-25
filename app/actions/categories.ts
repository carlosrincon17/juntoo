'use server'

import { CategoryTable } from "@/drizzle/schema";
import { db } from "@/utils/storage/db";
import { asc } from "drizzle-orm";

import { TransactionType } from "@/utils/enums/transaction-type";
import { eq } from "drizzle-orm";

export async function getParentCategories(transactionType?: string) {
    const baseQuery = db
        .selectDistinct({ parent: CategoryTable.parent })
        .from(CategoryTable);

    const query = transactionType
        ? baseQuery.where(eq(CategoryTable.transactionType, transactionType as TransactionType))
        : baseQuery;

    const categories = await query.orderBy(asc(CategoryTable.parent));

    return categories.map(c => c.parent);
}
