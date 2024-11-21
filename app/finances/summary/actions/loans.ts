'use server'

import { getUser } from "@/app/actions/auth";
import { Loan } from "@/app/types/loans";
import { LoansTable } from "@/drizzle/schema";
import { db } from "@/utils/storage/db";
import { desc, eq, sql } from "drizzle-orm";


export async function getLoans(): Promise<Loan[]> {
    const user = await getUser();
    return await db.query.LoansTable.findMany({
        where: eq(LoansTable.familyId, user.familyId),
        orderBy: desc(LoansTable.value),
    });
}

export async function getTotalLoans(): Promise<number> {
    const user = await getUser();
    const totalDebts = await db
        .select({
            totalDebts: sql`COALESCE(SUM(${LoansTable.value}), 0)`,
        })
        .from(LoansTable)
        .where(
            eq(LoansTable.familyId, user.familyId)
        )
    return totalDebts[0].totalDebts as number;
}

export async function updateLoan(loan: Loan): Promise<void> {
    await db.update(LoansTable)
        .set(loan)
        .where(eq(LoansTable.id, loan.id))
    return;
}

export async function deleteLoan(loanId: number): Promise<void> {
    await db.delete(LoansTable).where(
        eq(LoansTable.id, loanId)
    );
}

export async function createLoan(loan: Loan): Promise<void> {
    const user = await getUser();
    loan.familyId = user.familyId;
    await db.insert(LoansTable).values({
        name: loan.name,
        value: loan.value,
        familyId: user.familyId,
    });
}