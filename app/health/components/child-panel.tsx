"use client";

import { useState } from "react";
import { Button, Input } from "@heroui/react";
import { FaPen } from "react-icons/fa";
import type { HealthChild, IllnessRecord } from "@/app/types/health";
import { endIllness, logMedication, logTemperature, renameChild } from "../actions/health";
import {
    FEVER_CHIP,
    FEVER_LABEL,
    FEVER_TEXT,
    MEDICATION_PRESETS,
    TEMPERATURE_PRESETS,
    activeIllness,
    calendarDaySpan,
    durationPhrase,
    feverTone,
    formatClock,
    fromDatetimeLocal,
    latestTemperature,
    looseName,
    peakTemperature,
    relativeTime,
    repeatMedications,
    toDatetimeLocal,
} from "../lib/illness";
import { toastError, toastOk } from "./feedback";
import { TemperatureHistogram } from "./temperature-histogram";
import { clsx } from "clsx";

interface ChildPanelProps {
    child: HealthChild;
    onChanged: () => Promise<void>;
    onStart: () => void;
    onOpenSummary: (illnessId: number) => void;
    onEnded: (illnessId: number) => Promise<void>;
}

export function ChildPanel({ child, onChanged, onStart, onOpenSummary, onEnded }: ChildPanelProps) {
    const illness = activeIllness(child.illnesses);
    const latest = illness ? latestTemperature(illness.temperatures) : null;
    const repeats = illness ? repeatMedications(illness.medications) : [];
    const lastEpisode = child.illnesses.find((item) => item.endedAt !== null) ?? null;

    const [draft, setDraft] = useState(latest ? latest.celsius.toFixed(1) : "37.5");
    const [draftReadingId, setDraftReadingId] = useState(latest?.id ?? null);
    const [tempWhen, setTempWhen] = useState("");
    const [medWhen, setMedWhen] = useState("");
    const [composingMed, setComposingMed] = useState(false);
    const [medName, setMedName] = useState("");
    const [medDose, setMedDose] = useState("");
    const [savingTemp, setSavingTemp] = useState(false);
    const [savingMed, setSavingMed] = useState(false);
    const [confirmEnd, setConfirmEnd] = useState(false);
    const [ending, setEnding] = useState(false);
    const [editingName, setEditingName] = useState(false);
    const [nameDraft, setNameDraft] = useState(child.name);
    const [nameSource, setNameSource] = useState(child.name);
    const [episodeId, setEpisodeId] = useState(illness?.id ?? null);

    if ((latest?.id ?? null) !== draftReadingId) {
        setDraftReadingId(latest?.id ?? null);
        if (latest) setDraft(latest.celsius.toFixed(1));
    }

    if (child.name !== nameSource) {
        setNameSource(child.name);
        setNameDraft(child.name);
    }

    if ((illness?.id ?? null) !== episodeId) {
        setEpisodeId(illness?.id ?? null);
        setConfirmEnd(false);
        setComposingMed(false);
    }

    const tone = latest ? feverTone(latest.celsius) : "calm";
    const days = illness ? calendarDaySpan(illness.startedAt, null) : 0;
    const knownMeds = new Set(repeats.map((item) => looseName(item.name)));
    const suggestions = MEDICATION_PRESETS.filter((name) => !knownMeds.has(looseName(name)));

    const saveTemperature = async (value: number) => {
        if (!illness || savingTemp) return;
        setSavingTemp(true);
        try {
            await logTemperature({
                illnessId: illness.id,
                celsius: value,
                takenAt: tempWhen ? fromDatetimeLocal(tempWhen) : undefined,
            });
            setDraft(value.toFixed(1));
            setTempWhen("");
            await onChanged();
            toastOk("Temperatura anotada", `${value.toFixed(1)}°`);
        } catch (error) {
            toastError(error);
        } finally {
            setSavingTemp(false);
        }
    };

    const submitDraft = async () => {
        await saveTemperature(Number(draft));
    };

    const bump = (delta: number) => {
        const current = Number(draft);
        const base = Number.isFinite(current) ? current : 37.5;
        const next = Math.round((base + delta) * 10) / 10;
        setDraft(Math.min(42, Math.max(34, next)).toFixed(1));
    };

    const saveMedication = async (name: string, dose: string | null) => {
        if (!illness || savingMed) return;
        setSavingMed(true);
        try {
            await logMedication({
                illnessId: illness.id,
                name,
                dose: dose ?? undefined,
                givenAt: medWhen ? fromDatetimeLocal(medWhen) : undefined,
            });
            setComposingMed(false);
            setMedName("");
            setMedDose("");
            setMedWhen("");
            await onChanged();
            toastOk("Dosis anotada", dose ? `${name} · ${dose}` : name);
        } catch (error) {
            toastError(error);
        } finally {
            setSavingMed(false);
        }
    };

    const endEpisode = async () => {
        if (!illness) return;
        setEnding(true);
        try {
            await endIllness(illness.id);
            setConfirmEnd(false);
            await onEnded(illness.id);
        } catch (error) {
            toastError(error);
        } finally {
            setEnding(false);
        }
    };

    const saveName = async () => {
        const next = nameDraft.trim();
        if (!next || next === child.name) {
            setEditingName(false);
            setNameDraft(child.name);
            return;
        }
        try {
            await renameChild(child.id, next);
            setEditingName(false);
            await onChanged();
        } catch (error) {
            toastError(error);
        }
    };

    return (
        <article
            className="relative overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-sm"
        >
            <span className="pointer-events-none absolute -right-1 top-2 text-[7.5rem] italic leading-none text-indigo-100">
                {child.name.slice(0, 1)}
            </span>

            <div className="relative space-y-6 p-5 sm:p-6">
                <header className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        {editingName ? (
                            <form
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    void saveName();
                                }}
                            >
                                <input
                                    autoFocus
                                    value={nameDraft}
                                    onChange={(event) => setNameDraft(event.target.value)}
                                    onBlur={() => void saveName()}
                                    className="w-full bg-transparent text-4xl text-gray-900 outline-none"
                                />
                            </form>
                        ) : (
                            <h2 className="text-4xl font-bold tracking-tight text-gray-900">{child.name}</h2>
                        )}
                        <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                            {illness ? (
                                <>
                                    <span className="relative flex size-2.5">
                                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-indigo-500 opacity-60" />
                                        <span className="relative inline-flex size-2.5 rounded-full bg-indigo-500" />
                                    </span>
                                    {illness.name}
                                    <span className="text-gray-300">·</span>
                                    {durationPhrase(days, true)}
                                </>
                            ) : (
                                "Sin episodio abierto"
                            )}
                        </p>
                    </div>
                    <button
                        type="button"
                        aria-label={`Editar el nombre de ${child.name}`}
                        onClick={() => setEditingName(true)}
                        className="flex size-9 items-center justify-center rounded-full text-gray-400 hover:bg-zinc-100 hover:text-gray-900"
                    >
                        <FaPen size={12} />
                    </button>
                </header>

                {illness ? (
                    <>
                        <div className="flex items-end justify-between gap-4">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-[0.16em] text-gray-400">Última</p>
                                {latest ? (
                                    <>
                                        <p className={clsx("text-7xl font-bold leading-none tracking-tight", FEVER_TEXT[tone])}>
                                            {latest.celsius.toFixed(1)}
                                            <span className="text-3xl">°</span>
                                        </p>
                                        <p className={clsx("mt-1 text-sm font-medium", FEVER_TEXT[tone])}>
                                            {FEVER_LABEL[tone]}
                                            <span className="font-normal text-gray-400">
                                                {" "}
                                                · {formatClock(latest.takenAt)} · {relativeTime(latest.takenAt)}
                                            </span>
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-4xl text-gray-300">Sin fiebre anotada</p>
                                )}
                            </div>
                        </div>

                        <TemperatureHistogram readings={illness.temperatures} medications={illness.medications} />

                        <div className="space-y-3 rounded-[22px] bg-zinc-50 p-4">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <button type="button" aria-label="Bajar" onClick={() => bump(-0.1)} className="flex size-12 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
                                    −
                                </button>
                                <p className="text-4xl text-gray-900">{Number(draft || "0").toFixed(1)}°</p>
                                <button type="button" aria-label="Subir" onClick={() => bump(0.1)} className="flex size-12 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
                                    +
                                </button>
                                <Button color="primary" isLoading={savingTemp} onPress={() => void submitDraft()} className="min-h-12">
                                    Anotar
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {TEMPERATURE_PRESETS.map((value) => (
                                    <button
                                        key={value}
                                        type="button"
                                        disabled={savingTemp}
                                        onClick={() => void saveTemperature(value)}
                                        className={clsx("rounded-full px-3 py-1.5 text-sm font-medium", FEVER_CHIP[feverTone(value)])}
                                    >
                                        {value.toFixed(1)}°
                                    </button>
                                ))}
                            </div>
                            <details className="text-sm text-gray-500">
                                <summary className="cursor-pointer">La hora fue otra</summary>
                                <input
                                    type="datetime-local"
                                    value={tempWhen}
                                    max={toDatetimeLocal(new Date())}
                                    onChange={(event) => setTempWhen(event.target.value)}
                                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-gray-900"
                                />
                            </details>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-baseline justify-between">
                                <h3 className="text-xl text-gray-900">Medicamentos</h3>
                                {repeats[0] ? (
                                    <p className="text-xs text-gray-400">
                                        Última {repeats[0].name}
                                        {repeats[0].dose ? ` ${repeats[0].dose}` : ""} · {relativeTime(repeats[0].givenAt)}
                                    </p>
                                ) : null}
                            </div>
                            {repeats.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {repeats.map((item) => (
                                        <button
                                            key={item.name}
                                            type="button"
                                            disabled={savingMed}
                                            onClick={() => void saveMedication(item.name, item.dose)}
                                            className="rounded-2xl bg-indigo-600 px-3 py-2 text-left text-white"
                                        >
                                            <span className="block text-sm font-medium">
                                                Otra vez · {item.name}
                                                {item.dose ? ` ${item.dose}` : ""}
                                            </span>
                                            <span className="block text-[11px] text-white/70">{relativeTime(item.givenAt)}</span>
                                        </button>
                                    ))}
                                </div>
                            ) : null}
                            <div className="flex flex-wrap gap-2">
                                {suggestions.map((name) => (
                                    <button
                                        key={name}
                                        type="button"
                                        onClick={() => {
                                            setMedName(name);
                                            setMedDose("");
                                            setComposingMed(true);
                                        }}
                                        className="rounded-full bg-white px-3 py-1.5 text-sm text-gray-700 ring-1 ring-zinc-200"
                                    >
                                        {name}
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMedName("");
                                        setMedDose("");
                                        setComposingMed(true);
                                    }}
                                    className="rounded-full bg-white px-3 py-1.5 text-sm text-gray-700 ring-1 ring-zinc-200"
                                >
                                    Otro
                                </button>
                            </div>
                            {composingMed ? (
                                <form
                                    className="grid gap-2 rounded-2xl bg-white p-3 ring-1 ring-zinc-200 sm:grid-cols-[1fr_8rem_auto]"
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        void saveMedication(medName, medDose);
                                    }}
                                >
                                    <Input
                                        aria-label="Medicamento"
                                        placeholder="Medicamento"
                                        value={medName}
                                        onValueChange={setMedName}
                                        variant="bordered"
                                        size="sm"
                                    />
                                    <Input
                                        aria-label="Dosis"
                                        placeholder="5 ml"
                                        value={medDose}
                                        onValueChange={setMedDose}
                                        variant="bordered"
                                        size="sm"
                                    />
                                    <Button color="primary" type="submit" isLoading={savingMed} isDisabled={!medName.trim()}>
                                        Dar ahora
                                    </Button>
                                </form>
                            ) : null}
                            <details className="text-sm text-gray-500">
                                <summary className="cursor-pointer">La dosis fue a otra hora</summary>
                                <input
                                    type="datetime-local"
                                    value={medWhen}
                                    max={toDatetimeLocal(new Date())}
                                    onChange={(event) => setMedWhen(event.target.value)}
                                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-gray-900"
                                />
                            </details>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row">
                            <Button variant="flat" className="w-full sm:flex-1" onPress={() => onOpenSummary(illness.id)}>
                                Resumen para la doctora
                            </Button>
                            {confirmEnd ? (
                                <>
                                    <Button variant="light" className="w-full sm:w-auto" onPress={() => setConfirmEnd(false)}>
                                        Seguir anotando
                                    </Button>
                                    <Button color="primary" className="w-full sm:w-auto" isLoading={ending} onPress={() => void endEpisode()}>
                                        Cerrar episodio
                                    </Button>
                                </>
                            ) : (
                                <Button variant="bordered" className="w-full border-zinc-200 sm:flex-1" onPress={() => setConfirmEnd(true)}>
                                    Ya se recuperó
                                </Button>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="space-y-5">
                        {lastEpisode ? (
                            <>
                                <LastEpisode episode={lastEpisode} onOpen={() => onOpenSummary(lastEpisode.id)} />
                                {lastEpisode.temperatures.length > 0 ? (
                                    <TemperatureHistogram readings={lastEpisode.temperatures} medications={lastEpisode.medications} />
                                ) : null}
                            </>
                        ) : (
                            <p className="max-w-sm text-sm leading-relaxed text-gray-500">
                                Cuando empiece algo, anótalo aquí. Después vas a tener los días, lo que le diste y hasta dónde subió la fiebre.
                            </p>
                        )}
                        <Button color="primary" size="lg" className="min-h-12 w-full" onPress={onStart}>
                            {child.name} se siente mal
                        </Button>
                    </div>
                )}
            </div>
        </article>
    );
}

function LastEpisode({ episode, onOpen }: { episode: IllnessRecord; onOpen: () => void }) {
    const peak = peakTemperature(episode.temperatures);
    return (
        <button
            type="button"
            onClick={onOpen}
            className="w-full rounded-2xl bg-zinc-50 px-4 py-3 text-left"
        >
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-gray-400">Último episodio</p>
            <p className="text-2xl text-gray-900">{episode.name}</p>
            <p className="text-sm text-gray-500">
                {durationPhrase(calendarDaySpan(episode.startedAt, episode.endedAt), false)}
                {peak ? ` · pico ${peak.celsius.toFixed(1)}° a las ${formatClock(peak.takenAt)}` : ""}
            </p>
        </button>
    );
}

