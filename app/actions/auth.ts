'use server'

import { StorageUsers } from "@/utils/storage/constants"
import { createSession, deleteSession, getSession } from "../lib/sessions"
import { redirect } from "next/navigation";

 
export async function signUp(user: StorageUsers) {
    await createSession(user);
    redirect("/dashboard/categories");
}

export async function logout() {
    await deleteSession();
    redirect("/");
}

export async function getUser() {
    return getSession();
}