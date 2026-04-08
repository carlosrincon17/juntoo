'use server'

import { ImportantIdsTable } from "@/drizzle/schema";
import { db } from "@/utils/storage/db";
import { eq, and } from "drizzle-orm";
import { getUser } from "@/app/actions/auth";
import { revalidatePath } from "next/cache";

export async function getImportantIds() {
    const session = await getUser();
    if (!session || !session.familyId) return [];

    return await db.query.ImportantIdsTable.findMany({
        where: eq(ImportantIdsTable.familyId, session.familyId),
        orderBy: (ids, { desc }) => [desc(ids.createdAt)],
    });
}

export async function createImportantId(name: string, value: string, description?: string) {
    const session = await getUser();
    if (!session || !session.familyId) throw new Error("No session found");

    await db.insert(ImportantIdsTable).values({
        name,
        value,
        description,
        familyId: session.familyId,
    });
    
    revalidatePath("/planner/ids");
}

export async function deleteImportantId(id: number) {
    const session = await getUser();
    if (!session || !session.familyId) throw new Error("No session found");

    await db.delete(ImportantIdsTable).where(
        and(
            eq(ImportantIdsTable.id, id),
            eq(ImportantIdsTable.familyId, session.familyId)
        )
    );
    
    revalidatePath("/planner/ids");
}
