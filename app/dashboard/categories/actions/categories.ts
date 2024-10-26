'use server'

import { Category } from "@/app/types/category";
import { CategoryTable } from "@/drizzle/schema";
import { TransactionType } from "@/utils/enums/transaction-type";
import { db } from "@/utils/storage/db"
import { eq } from "drizzle-orm";

 
export async function getCategories(transactionType: TransactionType): Promise<Category[]> {
    return await db.query.CategoryTable.findMany({
        where: eq(CategoryTable.transactionType, transactionType),
    });
}