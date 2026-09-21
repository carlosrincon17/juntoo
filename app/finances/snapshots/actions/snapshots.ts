'use server'

import { getUser } from "@/app/actions/auth";
import {
    ConsolidatedSnapshotDetail,
    ConsolidatedSnapshotListItem,
    SnapshotDebtItem,
    SnapshotPatrimonyItem,
    SnapshotSavingItem,
    SnapshotTotals,
} from "@/app/types/consolidated-snapshot";
import { ConsolidatedSnapshotsTable } from "@/drizzle/schema";
import { db } from "@/utils/storage/db";
import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDebts } from "../../summary/actions/debts";
import { getPatrimonies } from "../../summary/actions/patrimonies";
import { getSavings } from "../../savings/actions/savings";

function requireUser() {
    return getUser();
}

function mapListItem(row: {
    id: number;
    note: string | null;
    createdAt: Date;
    totals: SnapshotTotals;
    createdByUser: { name: string } | null;
}): ConsolidatedSnapshotListItem {
    return {
        id: row.id,
        note: row.note,
        createdAt: row.createdAt,
        createdByName: row.createdByUser?.name ?? "Familia",
        totals: row.totals,
    };
}

export async function createConsolidatedSnapshot(note?: string): Promise<void> {
    const user = await requireUser();
    if (!user.familyId || !user.id) {
        throw new Error("No session found");
    }

    const [savings, patrimonies, debts] = await Promise.all([
        getSavings(),
        getPatrimonies(),
        getDebts(),
    ]);

    const savingsItems: SnapshotSavingItem[] = savings.map((saving) => ({
        id: saving.id,
        name: saving.name,
        value: saving.value,
        copValue: saving.copValue ?? saving.value,
        currency: saving.currency ?? "COP",
        owner: saving.user?.name || saving.owner,
        isInvestment: saving.isInvestment,
        annualInterestRate: saving.annualInterestRate ?? null,
        goalName: saving.goal?.name ?? null,
    }));

    const patrimoniesItems: SnapshotPatrimonyItem[] = patrimonies.map((patrimony) => ({
        id: patrimony.id,
        name: patrimony.name,
        value: patrimony.value,
    }));

    const debtsItems: SnapshotDebtItem[] = debts.map((debt) => ({
        id: debt.id,
        name: debt.name,
        value: debt.value,
        initialAmount: debt.initialAmount || 0,
    }));

    const savingsTotal = savingsItems.reduce((total, item) => total + item.copValue, 0);
    const assetsTotal = patrimoniesItems.reduce((total, item) => total + item.value, 0);
    const debtsTotal = debtsItems.reduce((total, item) => total + item.value, 0);

    const totals: SnapshotTotals = {
        savings: savingsTotal,
        assets: assetsTotal,
        debts: debtsTotal,
        balance: savingsTotal + assetsTotal - debtsTotal,
        savingsCount: savingsItems.length,
        assetsCount: patrimoniesItems.length,
        debtsCount: debtsItems.length,
    };

    const trimmedNote = note?.trim();

    await db.insert(ConsolidatedSnapshotsTable).values({
        familyId: user.familyId,
        createdBy: user.id,
        note: trimmedNote ? trimmedNote : null,
        savings: savingsItems,
        patrimonies: patrimoniesItems,
        debts: debtsItems,
        totals,
    });

    revalidatePath("/finances/snapshots");
    revalidatePath("/finances/savings");
}

export async function getConsolidatedSnapshots(): Promise<ConsolidatedSnapshotListItem[]> {
    const user = await requireUser();
    if (!user.familyId) {
        return [];
    }

    const rows = await db.query.ConsolidatedSnapshotsTable.findMany({
        where: eq(ConsolidatedSnapshotsTable.familyId, user.familyId),
        orderBy: desc(ConsolidatedSnapshotsTable.createdAt),
        columns: {
            id: true,
            note: true,
            createdAt: true,
            totals: true,
        },
        with: {
            createdByUser: {
                columns: {
                    name: true,
                },
            },
        },
    });

    return rows.map(mapListItem);
}

export async function getConsolidatedSnapshotById(
    id: number,
): Promise<ConsolidatedSnapshotDetail | null> {
    const user = await requireUser();
    if (!user.familyId) {
        return null;
    }

    const row = await db.query.ConsolidatedSnapshotsTable.findFirst({
        where: and(
            eq(ConsolidatedSnapshotsTable.id, id),
            eq(ConsolidatedSnapshotsTable.familyId, user.familyId),
        ),
        with: {
            createdByUser: {
                columns: {
                    name: true,
                },
            },
        },
    });

    if (!row) {
        return null;
    }

    return {
        ...mapListItem(row),
        savings: row.savings,
        patrimonies: row.patrimonies,
        debts: row.debts,
    };
}

export async function deleteConsolidatedSnapshot(id: number): Promise<void> {
    const user = await requireUser();
    if (!user.familyId) {
        throw new Error("No session found");
    }

    await db.delete(ConsolidatedSnapshotsTable).where(
        and(
            eq(ConsolidatedSnapshotsTable.id, id),
            eq(ConsolidatedSnapshotsTable.familyId, user.familyId),
        ),
    );

    revalidatePath("/finances/snapshots");
}
