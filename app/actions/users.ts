'use server'

import { db } from "@/utils/storage/db";
import { User } from "../types/user";
import { eq } from "drizzle-orm";
import { UserTable } from "@/drizzle/schema";

export async function getUserByEmail(email: string): Promise<User | undefined> {
    return await db.query.UserTable.findFirst({
        where: eq(UserTable.email, email)
    });
}