'use server'

import { getUser } from "@/app/actions/auth";
import { Savings } from "@/app/types/saving";
import { SavingsTable } from "@/drizzle/schema";
import { db } from "@/utils/storage/db";
import { and, desc, eq, isNull, lt, or, sql } from "drizzle-orm";

const TRM_API_URL = "https://trm-colombia.vercel.app";
const TRM_STALE_MS = 24 * 60 * 60 * 1000;

async function fetchCurrentTrm(): Promise<number> {
    const today = new Date().toISOString().split('T')[0];
    const res = await fetch(`${TRM_API_URL}/?date=${today}`, {
        next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`TRM API error: ${res.status}`);
    const json = await res.json() as { data: { success: boolean; value: number } };
    if (!json.data.success) throw new Error('TRM API returned success=false');
    return json.data.value;
}

export async function refreshUsdSavingsTrm(familyId: number): Promise<void> {
    const staleThreshold = new Date(Date.now() - TRM_STALE_MS);

    const staleSavings = await db
        .select({ id: SavingsTable.id, value: SavingsTable.value })
        .from(SavingsTable)
        .where(
            and(
                eq(SavingsTable.familyId, familyId),
                eq(SavingsTable.currency, 'USD'),
                or(
                    isNull(SavingsTable.lastTrmUpdated),
                    lt(SavingsTable.lastTrmUpdated, staleThreshold)
                )
            )
        );

    if (staleSavings.length === 0) return;

    let trm: number;
    try {
        trm = await fetchCurrentTrm();
    } catch (err) {
        console.error('[TRM] Failed to fetch TRM rate:', err);
        return;
    }

    const now = new Date();
    await Promise.all(
        staleSavings.map((s) =>
            db.update(SavingsTable)
                .set({
                    trmValue: trm,
                    copValue: Math.round(s.value * trm),
                    lastTrmUpdated: now,
                })
                .where(eq(SavingsTable.id, s.id))
        )
    );
}

export async function getSavings(): Promise<Savings[]> {
    const user = await getUser();

    await refreshUsdSavingsTrm(user.familyId);

    return await db.query.SavingsTable.findMany({
        where: eq(SavingsTable.familyId, user.familyId),
        with: {
            user: true,
            goal: true
        },
        orderBy: desc(SavingsTable.id)
    });
}

export async function getTotalSavingsCop(): Promise<number> {
    const user = await getUser();
    const result = await db
        .select({
            total: sql<number>`COALESCE(SUM(COALESCE(${SavingsTable.copValue}, ${SavingsTable.value})), 0)`,
        })
        .from(SavingsTable)
        .where(eq(SavingsTable.familyId, user.familyId));
    return result[0].total as number;
}

export async function getTotalSavings(): Promise<number> {
    return getTotalSavingsCop();
}

export async function updateSavings(savings: Savings): Promise<void> {
    const trmClear = savings.currency === 'COP'
        ? { trmValue: null, copValue: savings.value, lastTrmUpdated: null }
        : { lastTrmUpdated: null };
    await db.update(SavingsTable)
        .set({ ...savings, ...trmClear })
        .where(eq(SavingsTable.id, savings.id));

    if (savings.currency === 'USD') {
        const user = await getUser();
        await refreshUsdSavingsTrm(user.familyId);
    }
}

export async function createSavings(savings: Savings): Promise<void> {
    const user = await getUser();
    savings.familyId = user.familyId;
    savings.userId = user.id as number;

    const copValue = savings.currency === 'COP' ? savings.value : undefined;

    await db.insert(SavingsTable).values({ ...savings, id: undefined, copValue });

    if (savings.currency === 'USD') {
        await refreshUsdSavingsTrm(user.familyId);
    }
}

export async function deleteSaving(savingId: number): Promise<void> {
    await db.delete(SavingsTable).where(
        eq(SavingsTable.id, savingId)
    );
}