"use server";

import {
    ChildrenTable,
    IllnessesTable,
    MedicationDosesTable,
    TemperatureReadingsTable,
} from "@/drizzle/schema";
import { getUser } from "@/app/actions/auth";
import type { ChildAccent, HealthChild, IllnessRecord } from "@/app/types/health";
import { db } from "@/utils/storage/db";
import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const ACCENT_CYCLE: ChildAccent[] = ["rose", "moss", "gold"];

function isUniqueViolation(error: unknown): boolean {
    let current: unknown = error;
    for (let depth = 0; depth < 4 && current && typeof current === "object"; depth += 1) {
        if ("code" in current && current.code === "23505") return true;
        current = "cause" in current ? current.cause : undefined;
    }
    return error instanceof Error && error.message.includes("children_family_name_idx");
}

function iso(value: Date | string): string {
    return new Date(value).toISOString();
}

function accentOf(value: string): ChildAccent {
    if (value === "moss" || value === "gold" || value === "rose") return value;
    return "rose";
}

function parseCelsius(value: number): number {
    if (!Number.isFinite(value)) throw new Error("La temperatura no es válida");
    const rounded = Math.round(value * 10) / 10;
    if (rounded < 34 || rounded > 42) {
        throw new Error("La temperatura debe estar entre 34 y 42 °C");
    }
    return rounded;
}

function parseWhen(value?: string): Date {
    if (!value) return new Date();
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) throw new Error("La hora no es válida");
    const now = Date.now();
    if (date.getTime() > now + 5 * 60 * 1000) throw new Error("La hora no puede ser futura");
    if (date.getTime() < now - 365 * 24 * 60 * 60 * 1000) throw new Error("La hora queda muy atrás");
    return date;
}

async function requireFamilyId(): Promise<number> {
    const session = await getUser();
    if (!session?.familyId) throw new Error("No se encontró la sesión");
    return session.familyId;
}

function toIllness(row: {
    id: number;
    name: string;
    notes: string | null;
    startedAt: Date;
    endedAt: Date | null;
    temperatures: { id: number; celsius: number; takenAt: Date; note: string | null }[];
    medications: { id: number; name: string; dose: string | null; givenAt: Date; note: string | null }[];
}): IllnessRecord {
    return {
        id: row.id,
        name: row.name,
        notes: row.notes,
        startedAt: iso(row.startedAt),
        endedAt: row.endedAt ? iso(row.endedAt) : null,
        temperatures: row.temperatures.map((reading) => ({
            id: reading.id,
            celsius: reading.celsius,
            takenAt: iso(reading.takenAt),
            note: reading.note,
        })),
        medications: row.medications.map((dose) => ({
            id: dose.id,
            name: dose.name,
            dose: dose.dose,
            givenAt: iso(dose.givenAt),
            note: dose.note,
        })),
    };
}

export async function getHealthBoard(): Promise<HealthChild[]> {
    const familyId = await requireFamilyId();

    const rows = await db.query.ChildrenTable.findMany({
        where: eq(ChildrenTable.familyId, familyId),
        orderBy: (child, { asc }) => [asc(child.sortOrder), asc(child.id)],
        with: {
            illnesses: {
                orderBy: (illness, { desc }) => [desc(illness.startedAt)],
                with: {
                    temperatures: {
                        orderBy: (reading, { desc }) => [desc(reading.takenAt)],
                    },
                    medications: {
                        orderBy: (dose, { desc }) => [desc(dose.givenAt)],
                    },
                },
            },
        },
    });

    return rows.map((child) => ({
        id: child.id,
        name: child.name,
        accent: accentOf(child.accent),
        illnesses: child.illnesses.map(toIllness),
    }));
}

async function ownedChild(childId: number, familyId: number) {
    const child = await db.query.ChildrenTable.findFirst({
        where: and(eq(ChildrenTable.id, childId), eq(ChildrenTable.familyId, familyId)),
    });
    if (!child) throw new Error("No encontramos ese registro");
    return child;
}

async function ownedIllness(illnessId: number, familyId: number) {
    const illness = await db.query.IllnessesTable.findFirst({
        where: and(eq(IllnessesTable.id, illnessId), eq(IllnessesTable.familyId, familyId)),
    });
    if (!illness) throw new Error("No encontramos ese registro");
    return illness;
}

export async function createChildren(names: string[]) {
    const familyId = await requireFamilyId();
    const cleaned = [...new Set(names.map((name) => name.trim()).filter(Boolean))];
    if (cleaned.length === 0) throw new Error("Escribe un nombre");
    if (cleaned.some((name) => name.length > 40)) throw new Error("El nombre es muy largo");

    const existing = await db
        .select({ id: ChildrenTable.id })
        .from(ChildrenTable)
        .where(eq(ChildrenTable.familyId, familyId));

    try {
        await db.insert(ChildrenTable).values(
            cleaned.map((name, index) => ({
                name,
                accent: ACCENT_CYCLE[(existing.length + index) % ACCENT_CYCLE.length],
                sortOrder: existing.length + index,
                familyId,
            })),
        );
    } catch (error) {
        if (isUniqueViolation(error)) throw new Error("Ya existe alguien con ese nombre");
        throw error;
    }

    revalidatePath("/health");
}

export async function addChild(name: string) {
    await createChildren([name]);
}

export async function renameChild(childId: number, name: string) {
    const familyId = await requireFamilyId();
    const trimmed = name.trim();
    if (!trimmed) throw new Error("Escribe un nombre");
    if (trimmed.length > 40) throw new Error("El nombre es muy largo");

    await ownedChild(childId, familyId);
    try {
        await db
            .update(ChildrenTable)
            .set({ name: trimmed })
            .where(and(eq(ChildrenTable.id, childId), eq(ChildrenTable.familyId, familyId)));
    } catch (error) {
        if (isUniqueViolation(error)) throw new Error("Ya existe alguien con ese nombre");
        throw error;
    }

    revalidatePath("/health");
}

export async function startIllness(input: {
    childId: number;
    name: string;
    notes?: string;
    temperature?: number;
    startedAt?: string;
}) {
    const familyId = await requireFamilyId();
    const name = input.name.trim();
    if (!name) throw new Error("Escribe qué tiene");
    if (name.length > 80) throw new Error("El nombre es muy largo");

    const child = await ownedChild(input.childId, familyId);
    const active = await db.query.IllnessesTable.findFirst({
        where: and(
            eq(IllnessesTable.childId, child.id),
            eq(IllnessesTable.familyId, familyId),
            isNull(IllnessesTable.endedAt),
        ),
    });
    if (active) throw new Error("Ya hay un episodio abierto");

    const startedAt = parseWhen(input.startedAt);
    const notes = input.notes?.trim() || null;
    const [created] = await db
        .insert(IllnessesTable)
        .values({
            childId: child.id,
            familyId,
            name,
            notes,
            startedAt,
        })
        .returning({ id: IllnessesTable.id });

    if (input.temperature != null) {
        await db.insert(TemperatureReadingsTable).values({
            illnessId: created.id,
            celsius: parseCelsius(input.temperature),
            takenAt: startedAt,
        });
    }

    revalidatePath("/health");
    return created.id;
}

export async function endIllness(illnessId: number) {
    const familyId = await requireFamilyId();
    const illness = await ownedIllness(illnessId, familyId);
    if (illness.endedAt) return;

    await db
        .update(IllnessesTable)
        .set({ endedAt: new Date() })
        .where(and(eq(IllnessesTable.id, illnessId), eq(IllnessesTable.familyId, familyId)));

    revalidatePath("/health");
}

export async function reopenIllness(illnessId: number) {
    const familyId = await requireFamilyId();
    const illness = await ownedIllness(illnessId, familyId);
    if (!illness.endedAt) return;

    const active = await db.query.IllnessesTable.findFirst({
        where: and(
            eq(IllnessesTable.childId, illness.childId),
            eq(IllnessesTable.familyId, familyId),
            isNull(IllnessesTable.endedAt),
        ),
    });
    if (active) throw new Error("Ya hay un episodio abierto");

    await db
        .update(IllnessesTable)
        .set({ endedAt: null })
        .where(and(eq(IllnessesTable.id, illnessId), eq(IllnessesTable.familyId, familyId)));

    revalidatePath("/health");
}

async function requireOpenIllness(illnessId: number, familyId: number) {
    const illness = await ownedIllness(illnessId, familyId);
    if (illness.endedAt) throw new Error("Este episodio ya está cerrado");
    return illness;
}

export async function logTemperature(input: { illnessId: number; celsius: number; takenAt?: string }) {
    const familyId = await requireFamilyId();
    await requireOpenIllness(input.illnessId, familyId);

    await db.insert(TemperatureReadingsTable).values({
        illnessId: input.illnessId,
        celsius: parseCelsius(input.celsius),
        takenAt: parseWhen(input.takenAt),
    });

    revalidatePath("/health");
}

export async function logMedication(input: { illnessId: number; name: string; dose?: string; givenAt?: string }) {
    const familyId = await requireFamilyId();
    await requireOpenIllness(input.illnessId, familyId);

    const name = input.name.trim();
    if (!name) throw new Error("Escribe el medicamento");
    if (name.length > 80) throw new Error("El nombre es muy largo");

    const dose = input.dose?.trim() || null;
    if (dose && dose.length > 40) throw new Error("La dosis es muy larga");

    await db.insert(MedicationDosesTable).values({
        illnessId: input.illnessId,
        name,
        dose,
        givenAt: parseWhen(input.givenAt),
    });

    revalidatePath("/health");
}

export async function deleteTemperature(readingId: number) {
    const familyId = await requireFamilyId();
    const reading = await db.query.TemperatureReadingsTable.findFirst({
        where: eq(TemperatureReadingsTable.id, readingId),
        with: { illness: true },
    });
    if (!reading || reading.illness.familyId !== familyId) {
        throw new Error("No encontramos ese registro");
    }

    await db.delete(TemperatureReadingsTable).where(eq(TemperatureReadingsTable.id, readingId));
    revalidatePath("/health");
}

export async function deleteMedication(doseId: number) {
    const familyId = await requireFamilyId();
    const dose = await db.query.MedicationDosesTable.findFirst({
        where: eq(MedicationDosesTable.id, doseId),
        with: { illness: true },
    });
    if (!dose || dose.illness.familyId !== familyId) {
        throw new Error("No encontramos ese registro");
    }

    await db.delete(MedicationDosesTable).where(eq(MedicationDosesTable.id, doseId));
    revalidatePath("/health");
}

export async function updateIllnessNotes(illnessId: number, notes: string) {
    const familyId = await requireFamilyId();
    await ownedIllness(illnessId, familyId);
    const trimmed = notes.trim();

    await db
        .update(IllnessesTable)
        .set({ notes: trimmed || null })
        .where(and(eq(IllnessesTable.id, illnessId), eq(IllnessesTable.familyId, familyId)));

    revalidatePath("/health");
}

export async function deleteIllness(illnessId: number) {
    const familyId = await requireFamilyId();
    await ownedIllness(illnessId, familyId);

    await db
        .delete(IllnessesTable)
        .where(and(eq(IllnessesTable.id, illnessId), eq(IllnessesTable.familyId, familyId)));

    revalidatePath("/health");
}
