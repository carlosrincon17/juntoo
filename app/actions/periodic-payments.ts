'use server'

import { PeriodicPaymentsTable } from "@/drizzle/schema";
import { db } from "@/utils/storage/db";
import { PeriodicPayment } from "../types/periodic-payment";
import { and, desc, eq } from "drizzle-orm";
import { getUser } from "./auth";

export async function addPeriodicPayment(payment: PeriodicPayment) {
    const user = await getUser()
    if (!user.id) {
        throw new Error("User ID is missing");
    }
    await db.insert(PeriodicPaymentsTable).values({
        name: payment.name,
        value: payment.value || 0,
        category_id: payment.category_id,
        frequency: payment.frequency,
        startDate: payment.startDate,
        userId: user.id,
        familyId: user.familyId,
        transactionType: payment.transactionType,
    });
}

export async function getPeriodicPayments(): Promise<PeriodicPayment[]> {
    const user = await getUser();
    return await db.query.PeriodicPaymentsTable.findMany({
        where: eq(PeriodicPaymentsTable.familyId, user.familyId),
        with: {
            category: true,
            user: true
        },
        orderBy: desc(PeriodicPaymentsTable.id),
    }) as PeriodicPayment[];
}

export async function deletePeriodicPayment(id: number) {
    const user = await getUser();
    await db.delete(PeriodicPaymentsTable).where(
        and(
            eq(PeriodicPaymentsTable.id, id),
            eq(PeriodicPaymentsTable.familyId, user.familyId)
        )
    );
}
