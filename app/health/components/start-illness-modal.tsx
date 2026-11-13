"use client";

import { useEffect, useState } from "react";
import { Button, Input, ScrollShadow, Textarea } from "@heroui/react";
import { FaThermometerHalf, FaTimes } from "react-icons/fa";
import type { HealthChild } from "@/app/types/health";
import { startIllness } from "../actions/health";
import {
    FEVER_CHIP,
    FEVER_TEXT,
    ILLNESS_PRESETS,
    TEMPERATURE_PRESETS,
    feverTone,
    fromDatetimeLocal,
    toDatetimeLocal,
} from "../lib/illness";
import { toastError } from "./feedback";
import { clsx } from "clsx";

interface StartIllnessModalProps {
    child: HealthChild | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onStarted: (illnessId: number) => Promise<void>;
}

export function StartIllnessModal({ child, isOpen, onOpenChange, onStarted }: StartIllnessModalProps) {
    const [preset, setPreset] = useState<string | null>(null);
    const [customName, setCustomName] = useState("");
    const [notes, setNotes] = useState("");
    const [includeTemp, setIncludeTemp] = useState(false);
    const [draft, setDraft] = useState("37.5");
    const [startedAt, setStartedAt] = useState(toDatetimeLocal(new Date()));
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        setPreset(null);
        setCustomName("");
        setNotes("");
        setIncludeTemp(false);
        setDraft("37.5");
        setStartedAt(toDatetimeLocal(new Date()));
    }, [isOpen, child?.id]);

    const illnessName = preset === "otra" ? customName.trim() : preset ?? "";
    const parsedTemp = Number(draft);
    const tempTone = Number.isFinite(parsedTemp) ? feverTone(parsedTemp) : "calm";

    const bump = (delta: number) => {
        const current = Number(draft);
        const base = Number.isFinite(current) ? current : 37.5;
        const next = Math.round((base + delta) * 10) / 10;
        setDraft(Math.min(42, Math.max(34, next)).toFixed(1));
        setIncludeTemp(true);
    };

    const handleStart = async () => {
        if (!child || !illnessName) return;
        setIsSaving(true);
        try {
            const illnessId = await startIllness({
                childId: child.id,
                name: illnessName,
                notes: notes.trim() || undefined,
                temperature: includeTemp ? parsedTemp : undefined,
                startedAt: fromDatetimeLocal(startedAt),
            });
            await onStarted(illnessId);
            onOpenChange(false);
        } catch (error) {
            toastError(error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <div
                className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
                onClick={() => onOpenChange(false)}
            />
            <div
                className={`fixed inset-y-0 right-0 z-50 w-full transform bg-background shadow-xl transition-transform duration-300 ease-in-out sm:w-1/3 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="flex h-full flex-col">
                    <div className="flex items-center justify-between border-b p-4">
                        <div className="flex items-center gap-2">
                            <FaThermometerHalf className="text-indigo-500" />
                            <h2 className="text-2xl font-extralight">¿Qué tiene {child?.name}?</h2>
                        </div>
                        <Button isIconOnly variant="light" onPress={() => onOpenChange(false)}>
                            <FaTimes size={24} />
                        </Button>
                    </div>
                    <ScrollShadow className="flex-1 overflow-y-auto bg-gray-50">
                        <div className="space-y-6 p-6">
                            <div className="flex flex-wrap gap-2">
                                {ILLNESS_PRESETS.map((name) => (
                                    <button
                                        key={name}
                                        type="button"
                                        onClick={() => setPreset(name)}
                                        className={clsx(
                                            "rounded-full px-3.5 py-2 text-sm transition-colors",
                                            preset === name
                                                ? "bg-indigo-600 text-white"
                                                : "bg-zinc-100 text-gray-700 hover:bg-indigo-100",
                                        )}
                                    >
                                        {name}
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setPreset("otra")}
                                    className={clsx(
                                        "rounded-full px-3.5 py-2 text-sm transition-colors",
                                        preset === "otra"
                                            ? "bg-indigo-600 text-white"
                                            : "bg-zinc-100 text-gray-700 hover:bg-indigo-100",
                                    )}
                                >
                                    Otra
                                </button>
                            </div>

                            {preset === "otra" ? (
                                <Input
                                    autoFocus
                                    label="Qué es"
                                    placeholder="Ej: Conjuntivitis"
                                    value={customName}
                                    onValueChange={setCustomName}
                                    variant="bordered"
                                />
                            ) : null}

                            <Textarea
                                label="Síntomas"
                                placeholder="Tos, mocos, le duele el oído..."
                                value={notes}
                                onValueChange={setNotes}
                                variant="bordered"
                                minRows={2}
                            />

                            <div className="rounded-2xl bg-zinc-50 p-4">
                                <div className="flex items-end justify-between gap-3">
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-[0.14em] text-gray-400">
                                            Temperatura
                                        </p>
                                        <p className={clsx("text-5xl leading-none", includeTemp ? FEVER_TEXT[tempTone] : "text-gray-300")}>
                                            {includeTemp ? Number(draft).toFixed(1) : "—"}
                                            <span className="text-2xl">°</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            aria-label="Bajar temperatura"
                                            onClick={() => bump(-0.1)}
                                            className="flex size-11 items-center justify-center rounded-full bg-white text-xl text-gray-900 shadow-sm"
                                        >
                                            −
                                        </button>
                                        <button
                                            type="button"
                                            aria-label="Subir temperatura"
                                            onClick={() => bump(0.1)}
                                            className="flex size-11 items-center justify-center rounded-full bg-white text-xl text-gray-900 shadow-sm"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {TEMPERATURE_PRESETS.map((value) => {
                                        const selected = includeTemp && Number(draft) === value;
                                        return (
                                            <button
                                                key={value}
                                                type="button"
                                                onClick={() => {
                                                    setDraft(value.toFixed(1));
                                                    setIncludeTemp(true);
                                                }}
                                                className={clsx(
                                                    "rounded-full px-3 py-1.5 text-sm font-medium",
                                                    selected ? "bg-indigo-600 text-white" : FEVER_CHIP[feverTone(value)],
                                                )}
                                            >
                                                {value.toFixed(1)}°
                                            </button>
                                        );
                                    })}
                                </div>
                                {includeTemp ? (
                                    <button
                                        type="button"
                                        className="mt-3 text-sm text-gray-500 underline-offset-2 hover:underline"
                                        onClick={() => setIncludeTemp(false)}
                                    >
                                        Empezar sin temperatura
                                    </button>
                                ) : (
                                    <p className="mt-3 text-sm text-gray-400">Opcional. Toca un valor si ya se la tomaste.</p>
                                )}
                            </div>

                            <Input
                                type="datetime-local"
                                label="Empezó"
                                value={startedAt}
                                onValueChange={setStartedAt}
                                variant="bordered"
                                className="bg-white"
                            />
                        </div>
                    </ScrollShadow>
                    <div className="flex justify-end gap-2 border-t bg-white p-4">
                        <Button
                            color="primary"
                            isDisabled={!illnessName}
                            isLoading={isSaving}
                            onPress={() => void handleStart()}
                            className="w-full font-semibold shadow-md"
                        >
                            {illnessName ? `Empezar ${illnessName.toLowerCase()}` : "Elige qué tiene"}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
