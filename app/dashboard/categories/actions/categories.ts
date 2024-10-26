'use server'

import { Category } from "@/app/types/category";
import { db } from "@/utils/storage/db"

 
export async function getCategories(): Promise<Category[]> {
    return await db.query.CategoryTable.findMany();
}