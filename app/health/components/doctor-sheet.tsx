"use client";

import { useMemo, useState } from "react";
import { Button, ScrollShadow, Textarea } from "@heroui/react";
import { FaCopy, FaTimes } from "react-icons/fa";
import type { HealthChild, IllnessRecord } from "@/app/types/health";
import {
    deleteIllness,
    deleteMedication,
    deleteTemperature,
    reopenIllness,
    updateIllnessNotes,
} from "../actions/health";
import {
    FEVER_TEXT,
    buildDoctorSummary,
    calendarDaySpan,
    durationPhrase,
    feverTone,
    formatShort,
    groupMedications,
    peakTemperature,
} from "../lib/illness";
import { toastError, toastOk } from "./feedback";
import { TemperatureHistogram } from "./temperature-histogram";
import { clsx } from "clsx";

interface DoctorSheetProps {
    child: HealthChild | null;
    illness: IllnessRecord | null;
    canReopen: boolean;
    isOpen: boolean;
    onClose: () => void;
    onChanged: () => Promise<void>;
}

export function DoctorSheet({ child, illness, canReopen, isOpen, onClose, onChanged }: DoctorSheetProps) {
    return (
        <>
            <div
                className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
                onClick={onClose}
            />
            <div
                className={`fixed inset-y-0 right-0 z-50 w-full transform bg-background shadow-xl transition-transform duration-300 ease-in-out sm:w-1/2 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                {isOpen && child && illness ? (
                    <DoctorSheetBody
                        key={illness.id}
                        child={child}
                        illness={illness}
                        canReopen={canReopen}
                        onClose={onClose}
                        onChanged={onChanged}
                    />
                ) : null}
            </div>
        </>
    );
}

function DoctorSheetBody({
    child,
    illness,
    canReopen,
    onClose,
    onChanged,
}: {
    child: HealthChild;
    illness: IllnessRecord;
    canReopen: boolean;
    onClose: () => void;
    onChanged: () => Promise<void>;
}) {
    const [notes, setNotes] = useState(illness.notes ?? "");
    const [isSavingNotes, setIsSavingNotes] = useState(false);
    const [isWorking, setIsWorking] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [copied, setCopied] = useState(false);

    const summary = useMemo(() => buildDoctorSummary(child.name, illness), [child.name, illness]);

    const active = illness.endedAt === null;
    const days = calendarDaySpan(illness.startedAt, illness.endedAt);
    const peak = peakTemperature(illness.temperatures);
    const medications = groupMedications(illness.medications);
    const doseCount = illness.medications.length;

    const run = async (action: () => Promise<void>) => {
        setIsWorking(true);
        try {
            await action();
            await onChanged();
        } catch (error) {
            toastError(error);
        } finally {
            setIsWorking(false);
        }
    };

    const copySummary = async () => {
        try {
            await navigator.clipboard.writeText(summary);
            setCopied(true);
            toastOk("Resumen copiado", "Listo para pegarlo en la cita o en WhatsApp");
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            toastError(new Error("No se pudo copiar"));
        }
    };

    const saveNotes = async () => {
        setIsSavingNotes(true);
        try {
            await updateIllnessNotes(illness.id, notes);
            await onChanged();
            toastOk("Nota guardada");
        } catch (error) {
            toastError(error);
        } finally {
            setIsSavingNotes(false);
        }
    };

    return (
        <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b p-4">
                <div>
                    <h2 id="doctor-summary-title" className="text-2xl font-extralight text-gray-900">
                        {child.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                        {illness.name}
                        <span className="mx-2 text-gray-300">·</span>
                        {active ? "En curso" : "Recuperado"}
                    </p>
                </div>
                <Button isIconOnly variant="light" aria-label="Cerrar" onPress={onClose}>
                    <FaTimes size={24} />
                </Button>
            </div>

            <ScrollShadow className="flex-1 overflow-y-auto bg-gray-50">
                <div className="space-y-6 p-6">
                    <div className="grid grid-cols-3 gap-2">
                        <Stat label={active ? "Lleva" : "Duró"} value={days <= 1 ? "1 día" : `${days} días`} detail={durationPhrase(days, active)} />
                        <Stat
                            label="Más alta"
                            value={peak ? `${peak.celsius.toFixed(1)}°` : "—"}
                            detail={peak ? formatShort(peak.takenAt) : "Sin fiebre anotada"}
                            valueClass={peak ? FEVER_TEXT[feverTone(peak.celsius)] : undefined}
                        />
                        <Stat
                            label="Dosis"
                            value={String(doseCount)}
                            detail={
                                doseCount === 0
                                    ? "Nada anotado"
                                    : medications.length === 1
                                        ? "1 medicamento"
                                        : `${medications.length} medicamentos`
                            }
                        />
                    </div>

                    <TemperatureHistogram
                        readings={illness.temperatures}
                        medications={illness.medications}
                        onRemove={(id) => run(() => deleteTemperature(id))}
                    />

                    <section className="space-y-3">
                        <h3 className="text-xl text-gray-900">Medicamentos</h3>
                        {medications.length === 0 ? (
                            <p className="text-sm text-gray-500">Todavía no hay dosis anotadas.</p>
                        ) : (
                            <ul className="space-y-3">
                                {medications.map((group) => (
                                    <li key={`${group.name}-${group.dose}`} className="rounded-2xl bg-zinc-50 p-3">
                                        <div className="flex items-baseline justify-between gap-3">
                                            <p className="font-medium text-gray-900">
                                                {group.name}
                                                {group.dose ? <span className="text-gray-500"> · {group.dose}</span> : null}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {group.doses.length === 1 ? "1 vez" : `${group.doses.length} veces`}
                                            </p>
                                        </div>
                                        <ul className="mt-2 flex flex-wrap gap-2">
                                            {group.doses.map((dose) => (
                                                <li key={dose.id}>
                                                    <button
                                                        type="button"
                                                        disabled={isWorking}
                                                        onClick={() => run(() => deleteMedication(dose.id))}
                                                        className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs text-gray-600"
                                                    >
                                                        {formatShort(dose.givenAt)}
                                                        <FaTimes size={8} className="text-gray-400" />
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    <section className="space-y-2">
                        <h3 className="text-xl text-gray-900">Notas</h3>
                        <Textarea
                            aria-label="Notas para la doctora"
                            placeholder="Qué le duele, si vomitó, qué dijo la doctora..."
                            value={notes}
                            onValueChange={setNotes}
                            variant="bordered"
                            minRows={3}
                        />
                        <Button
                            size="sm"
                            variant="flat"
                            isLoading={isSavingNotes}
                            isDisabled={notes.trim() === (illness.notes ?? "").trim()}
                            onPress={saveNotes}
                        >
                            Guardar nota
                        </Button>
                    </section>
                </div>
            </ScrollShadow>

            <div className="flex flex-col gap-3 border-t bg-white p-4">
                <Button color="primary" startContent={<FaCopy />} onPress={copySummary}>
                    {copied ? "Copiado" : "Copiar resumen"}
                </Button>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    {canReopen ? (
                        <button
                            type="button"
                            disabled={isWorking}
                            className="text-sm text-gray-500 underline-offset-2 hover:underline"
                            onClick={() => run(() => reopenIllness(illness.id))}
                        >
                                Se cerró por error — reabrir
                        </button>
                    ) : (
                        <span />
                    )}
                    {confirmDelete ? (
                        <span className="flex items-center gap-3 text-sm">
                            <button type="button" className="text-gray-500" onClick={() => setConfirmDelete(false)}>
                                    Cancelar
                            </button>
                            <button
                                type="button"
                                className="font-medium text-rose-600"
                                disabled={isWorking}
                                onClick={() =>
                                    run(async () => {
                                        await deleteIllness(illness.id);
                                        onClose();
                                    })
                                }
                            >
                                    Sí, eliminar
                            </button>
                        </span>
                    ) : (
                        <button
                            type="button"
                            className="text-sm text-gray-400 hover:text-rose-600"
                            onClick={() => setConfirmDelete(true)}
                        >
                                Eliminar episodio
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

function Stat({
    label,
    value,
    detail,
    valueClass,
}: {
    label: string;
    value: string;
    detail: string;
    valueClass?: string;
}) {
    return (
        <div className="rounded-2xl bg-zinc-50 px-3 py-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-gray-400">{label}</p>
            <p className={clsx("text-2xl leading-tight text-gray-900 sm:text-3xl", valueClass)}>{value}</p>
            <p className="mt-1 line-clamp-2 text-[11px] text-gray-400">{detail}</p>
        </div>
    );
}
