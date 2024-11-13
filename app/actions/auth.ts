'use server'

import { createUserSession, deleteSession, getSession } from "../lib/sessions"
import { redirect } from "next/navigation";
import { getUserByEmail } from "./users";


export async function signIn(userEmail: string) {
    const user = await getUserByEmail(userEmail);
    if (!user) {
        return redirect("/sign-up");
    }
    await createUserSession(user);
    redirect("/dashboard/categories");
}

export async function logout() {
    await deleteSession();
    redirect("/");
}

export async function getUser() {
    return getSession();
}