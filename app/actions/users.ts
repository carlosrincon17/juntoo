'use server'

import { db } from "@/utils/storage/db";
import { User } from "../types/user";
import { eq } from "drizzle-orm";
import { UserTable } from "@/drizzle/schema";
import { getUser, signIn } from "./auth";

export async function getUserByEmail(email: string): Promise<User | undefined> {
    return await db.query.UserTable.findFirst({
        where: eq(UserTable.email, email),
        with: {
            family: true,
        },
    });
}

export async function createUser(user: User) {
    await db.insert(UserTable).values({
        name: user.name,
        email: user.email,
        familyId: user.familyId,
        isActive: user.isActive,
        isAdmin: user.isAdmin,
    });
    await signIn(user.email);
}

export async function getUsersByFamily(): Promise<User[]> {
    const user = await getUser();
    return await db.query.UserTable.findMany({
        where: eq(UserTable.familyId, user.familyId),
    });
}