'use server'

import { PeriodicPaymentsTable, CategoryTable, UserTable, ExpensesTable } from "@/drizzle/schema";
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
        lastApplied: payment.lastApplied,
    });
}

export async function getPeriodicPayments(): Promise<PeriodicPayment[]> {
    const user = await getUser();

    const rows = await db.select({
        payment: PeriodicPaymentsTable,
        category: CategoryTable,
        user: UserTable
    })
        .from(PeriodicPaymentsTable)
        .leftJoin(CategoryTable, eq(PeriodicPaymentsTable.category_id, CategoryTable.id))
        .leftJoin(UserTable, eq(PeriodicPaymentsTable.userId, UserTable.id))
        .where(eq(PeriodicPaymentsTable.familyId, user.familyId))
        .orderBy(desc(PeriodicPaymentsTable.id));

    return rows.map(row => ({
        ...row.payment,
        category: row.category,
        user: row.user
    })) as PeriodicPayment[];
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

export async function getPeriodicPaymentExpenses(periodicPaymentId: number) {
    const user = await getUser();

    // Verify ownership
    const payment = await db.query.PeriodicPaymentsTable.findFirst({
        where: and(
            eq(PeriodicPaymentsTable.id, periodicPaymentId),
            eq(PeriodicPaymentsTable.familyId, user.familyId)
        )
    });

    if (!payment) {
        throw new Error("Periodic payment not found or access denied");
    }

    // Fetch expenses
    const expenses = await db.query.ExpensesTable.findMany({
        where: eq(ExpensesTable.periodicPaymentId, periodicPaymentId),
        orderBy: desc(ExpensesTable.createdAt),
        with: {
            category: true
        }
    });

    return expenses;
}
