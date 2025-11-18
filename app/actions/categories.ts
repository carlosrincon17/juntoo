'use server'

import { CategoryTable } from "@/drizzle/schema";
import { db } from "@/utils/storage/db";
import { asc } from "drizzle-orm";

export async function getParentCategories() {
    const categories = await db
        .selectDistinct({ parent: CategoryTable.parent })
        .from(CategoryTable)
        .orderBy(asc(CategoryTable.parent));

    return categories.map(c => c.parent);
}
