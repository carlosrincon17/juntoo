"use client";

import { useMemo, useState } from "react";
import { Button, Input } from "@heroui/react";
import type { HealthChild } from "@/app/types/health";
import { addChild, createChildren, getHealthBoard } from "../actions/health";
import {
    activeIllness,
    calendarDaySpan,
    durationPhrase,
    formatDay,
    peakTemperature,
} from "../lib/illness";
import { ChildPanel } from "./child-panel";
import { DoctorSheet } from "./doctor-sheet";
import { toastError, toastOk } from "./feedback";
import { StartIllnessModal } from "./start-illness-modal";
import { clsx } from "clsx";

function SetupNotebook({ onCreated }: { onCreated: () => Promise<void> }) {
    const [firstName, setFirstName] = useState("Paulina");
    const [secondName, setSecondName] = useState("Adrian");
    const [saving, setSaving] = useState(false);
    const ready = firstName.trim().length > 0 || secondName.trim().length > 0;

    const create = async () => {
        setSaving(true);
        try {
            await createChildren([firstName, secondName]);
            await onCreated();
            toastOk("Listo", "Ya puedes abrir un episodio cuando alguno se sienta mal");
        } catch (error) {
            toastError(error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <section className="mx-auto max-w-xl space-y-6 rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-indigo-600">Salud</p>
                <h1 className="text-4xl font-bold tracking-tight text-gray-900">Cuaderno de salud</h1>
                <p className="leading-relaxed text-gray-500">
                    Paulina y Adrian quedan listos para anotar fiebre, medicamentos y cuántos días dura cada cosa. Cuando vayan a la doctora, el resumen se copia en un toque.
                </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
                <Input label="Primer hijo" value={firstName} onValueChange={setFirstName} variant="bordered" />
                <Input label="Segundo hijo" value={secondName} onValueChange={setSecondName} variant="bordered" />
            </div>
            <Button color="primary" className="min-h-12 w-full" isDisabled={!ready} isLoading={saving} onPress={() => void create()}>
                Crear perfiles
            </Button>
        </section>
    );
}

const ACCENT_DOT = {
    rose: "bg-violet-500",
    moss: "bg-indigo-500",
    gold: "bg-fuchsia-500",
} as const;

export function HealthBoard({
    initialChildren,
    startChildId = null,
    episodeId = null,
}: {
    initialChildren: HealthChild[];
    startChildId?: number | null;
    episodeId?: number | null;
}) {
    const requestedStart = startChildId == null
        ? null
        : initialChildren.find((child) => child.id === startChildId) ?? null;
    const [children, setChildren] = useState(initialChildren);
    const [startingChild, setStartingChild] = useState<HealthChild | null>(
        episodeId == null && requestedStart && !activeIllness(requestedStart.illnesses) ? requestedStart : null,
    );
    const [summaryId, setSummaryId] = useState<number | null>(episodeId);
    const [newName, setNewName] = useState("");
    const [adding, setAdding] = useState(false);

    const refresh = async () => {
        const next = await getHealthBoard();
        setChildren(next);
    };

    const summary = useMemo(() => {
        if (summaryId == null) return null;
        for (const child of children) {
            const illness = child.illnesses.find((item) => item.id === summaryId);
            if (!illness) continue;
            const hasActive = child.illnesses.some((item) => item.endedAt === null);
            return {
                child,
                illness,
                canReopen: illness.endedAt !== null && !hasActive,
            };
        }
        return null;
    }, [children, summaryId]);

    const history = useMemo(() => {
        return children
            .flatMap((child) =>
                child.illnesses
                    .filter((illness) => illness.endedAt !== null)
                    .map((illness) => ({ child, illness })),
            )
            .sort((a, b) => +new Date(b.illness.startedAt) - +new Date(a.illness.startedAt));
    }, [children]);

    const handleAdd = async () => {
        const name = newName.trim();
        if (!name) return;
        setAdding(true);
        try {
            await addChild(name);
            setNewName("");
            await refresh();
            toastOk(`${name} ya está en el cuaderno`);
        } catch (error) {
            toastError(error);
        } finally {
            setAdding(false);
        }
    };

    if (children.length === 0) {
        return <SetupNotebook onCreated={refresh} />;
    }

    return (
        <div className="space-y-8">
            <header className="max-w-2xl space-y-2">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Cuaderno</h1>
                <p className="text-base leading-relaxed text-gray-500">
                    Aquí se abre el episodio, se anota cada toma y cada dosis, y se cierra cuando ya pasó. El resumen queda listo para la doctora.
                </p>
            </header>

            <div className="grid items-start gap-5 lg:grid-cols-2">
                {children.map((child) => (
                    <ChildPanel
                        key={child.id}
                        child={child}
                        onChanged={refresh}
                        onStart={() => setStartingChild(child)}
                        onOpenSummary={setSummaryId}
                        onEnded={async (illnessId) => {
                            await refresh();
                            setSummaryId(illnessId);
                            toastOk("Episodio cerrado", "Este es el resumen para la doctora");
                        }}
                    />
                ))}
            </div>

            <section className="space-y-3">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Episodios anteriores</h2>
                {history.length === 0 ? (
                    <p className="rounded-[24px] border border-dashed border-zinc-200 bg-white/80 px-5 py-8 text-sm text-gray-500">
                        Los episodios cerrados quedan aquí: cuántos días duraron, la fiebre más alta y los medicamentos.
                    </p>
                ) : (
                    <ul className="divide-y divide-zinc-200 overflow-hidden rounded-[24px] border border-zinc-200 bg-white">
                        {history.map(({ child, illness }) => {
                            const peak = peakTemperature(illness.temperatures);
                            const days = calendarDaySpan(illness.startedAt, illness.endedAt);
                            return (
                                <li key={illness.id}>
                                    <button
                                        type="button"
                                        onClick={() => setSummaryId(illness.id)}
                                        className="flex w-full items-center gap-4 px-4 py-4 text-left hover:bg-zinc-50 sm:px-5"
                                    >
                                        <span className={clsx("size-2.5 shrink-0 rounded-full", ACCENT_DOT[child.accent])} />
                                        <span className="min-w-0 flex-1">
                                            <span className="block font-medium text-gray-900">
                                                {child.name}
                                                <span className="font-normal text-gray-400"> · {illness.name}</span>
                                            </span>
                                            <span className="block text-sm text-gray-500">
                                                {formatDay(illness.startedAt)}
                                                {illness.endedAt ? ` – ${formatDay(illness.endedAt)}` : ""}
                                                {" · "}
                                                {durationPhrase(days, false)}
                                            </span>
                                        </span>
                                        <span className="text-right">
                                            <span className="block text-xl text-gray-900">
                                                {peak ? `${peak.celsius.toFixed(1)}°` : "—"}
                                            </span>
                                            <span className="block text-[11px] uppercase tracking-wide text-gray-400">pico</span>
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </section>

            <form
                className="flex flex-col gap-2 sm:flex-row sm:items-end"
                onSubmit={(event) => {
                    event.preventDefault();
                    void handleAdd();
                }}
            >
                <Input
                    label="Otro hijo"
                    placeholder="Nombre"
                    value={newName}
                    onValueChange={setNewName}
                    variant="bordered"
                    className="max-w-xs"
                />
                <Button type="submit" variant="flat" isLoading={adding} isDisabled={!newName.trim()}>
                    Agregar
                </Button>
            </form>

            <StartIllnessModal
                child={startingChild}
                isOpen={startingChild !== null}
                onOpenChange={(open) => {
                    if (!open) setStartingChild(null);
                }}
                onStarted={async () => {
                    await refresh();
                    toastOk("Seguimiento empezado", "Anota la fiebre y cada dosis desde la tarjeta");
                }}
            />

            <DoctorSheet
                child={summary?.child ?? null}
                illness={summary?.illness ?? null}
                canReopen={summary?.canReopen ?? false}
                isOpen={summary !== null}
                onClose={() => setSummaryId(null)}
                onChanged={refresh}
            />
        </div>
    );
}
