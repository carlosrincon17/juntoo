'use server'

import { FamilyTable } from "@/drizzle/schema";
import { db } from "@/utils/storage/db";
import { generateRandomString } from "../lib/strings";
import { Family } from "../types/family";

export async function createFamily(familyName: string): Promise<Family> {
    return (await db.insert(FamilyTable).values({
        name: familyName,
        reference: generateRandomString(),
    }).returning())[0];
}