'use server'

import { Category } from "@/app/types/category";
import { db } from "@/utils/storage/db"

 
export async function getCategories(page: number, perPage: number): Promise<Category[]> {
    return await db.query.CategoryTable.findMany({
        limit: perPage,
        offset: page * perPage,
    });
}