'use server'

import { FamilyTable } from "@/drizzle/schema";
import { db } from "@/utils/storage/db";
import { generateRandomString } from "../lib/strings";
import { Family } from "../types/family";
import { eq } from "drizzle-orm";

export async function createFamily(familyName: string): Promise<Family> {
    return (await db.insert(FamilyTable).values({
        name: familyName,
        reference: generateRandomString(),
    }).returning())[0];
}

export async function getFamilyByReferenceCode(referenceCode: string): Promise<Family | undefined> {
    return await db.query.FamilyTable.findFirst({
        where: eq(FamilyTable.reference, referenceCode),
    });
}