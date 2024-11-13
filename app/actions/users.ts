'use server'

import { db } from "@/utils/storage/db";
import { User } from "../types/user";
import { eq } from "drizzle-orm";
import { UserTable } from "@/drizzle/schema";
import { signIn } from "./auth";

export async function getUserByEmail(email: string): Promise<User | undefined> {
    return await db.query.UserTable.findFirst({
        where: eq(UserTable.email, email)
    });
}

export async function createUser(user: User) {
    await db.insert(UserTable).values({
        name: user.name,
        email: user.email,
        family_id: user.family_id,
        isActive: user.isActive,
        isAdmin: user.isAdmin,
    });
    await signIn(user.email);
}