"use client";

import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import type { MedicationDose, TemperatureReading } from "@/app/types/health";
import {
    FEVER_LABEL,
    FEVER_TEXT,
    feverTone,
    formatClock,
    formatDay,
    formatShort,
    peakTemperature,
    temperatureTrend,
    type FeverTone,
} from "../lib/illness";
import { clsx } from "clsx";

const FLOOR = 36;
const DOT: Record<FeverTone, string> = {
    calm: "#34d399",
    warm: "#f59e0b",
    hot: "#f97316",
    high: "#e11d48",
};
const TREND_STYLE = {
    subiendo: "bg-rose-50 text-rose-600",
    bajando: "bg-emerald-50 text-emerald-700",
    estable: "bg-indigo-50 text-indigo-700",
} as const;

const WIDTH = 640;
const HEIGHT = 228;
const PAD = { top: 22, right: 14, bottom: 42, left: 40 };

interface FeverCurveProps {
    readings: TemperatureReading[];
    medications?: MedicationDose[];
    onRemove?: (id: number) => void;
}

export function TemperatureHistogram({ readings, medications = [], onRemove }: FeverCurveProps) {
    const points = [...readings].sort((a, b) => +new Date(a.takenAt) - +new Date(b.takenAt));
    const doses = [...medications].sort((a, b) => +new Date(a.givenAt) - +new Date(b.givenAt));
    const [pickedId, setPickedId] = useState<number | null>(null);

    if (points.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-6 text-sm text-gray-500">
                La curva aparece con la primera toma. Ahí queda la hora exacta.
            </div>
        );
    }

    const peak = peakTemperature(points);
    const trend = temperatureTrend(points);
    const selectedId = points.some((point) => point.id === pickedId) ? pickedId : points[points.length - 1].id;
    const innerW = WIDTH - PAD.left - PAD.right;
    const innerH = HEIGHT - PAD.top - PAD.bottom;

    const readingTimes = points.map((point) => +new Date(point.takenAt));
    const stamps = [...readingTimes, ...doses.map((dose) => +new Date(dose.givenAt))];
    let minTime = Math.min(...stamps);
    let maxTime = Math.max(...stamps);
    const realSpan = Math.max(...readingTimes) - Math.min(...readingTimes);
    if (realSpan < 20 * 60 * 1000) {
        minTime -= 25 * 60 * 1000;
        maxTime += 25 * 60 * 1000;
    } else if (maxTime - minTime < 60 * 60 * 1000) {
        minTime -= 20 * 60 * 1000;
        maxTime += 20 * 60 * 1000;
    } else {
        const pad = (maxTime - minTime) * 0.08;
        minTime -= pad;
        maxTime += pad;
    }

    const ceiling = Math.max(40, ...points.map((point) => point.celsius + 0.8));
    const span = ceiling - FLOOR;
    const xOf = (time: number) => PAD.left + ((time - minTime) / (maxTime - minTime)) * innerW;
    const yOf = (celsius: number) => PAD.top + (1 - (celsius - FLOOR) / span) * innerH;
    const feverY = yOf(37.5);
    const baseY = yOf(FLOOR);

    const line = points
        .map((point) => `${xOf(+new Date(point.takenAt)).toFixed(1)},${yOf(point.celsius).toFixed(1)}`)
        .join(" ");
    const firstX = xOf(+new Date(points[0].takenAt));
    const lastX = xOf(+new Date(points[points.length - 1].takenAt));
    const area = `${firstX.toFixed(1)},${baseY.toFixed(1)} ${line} ${lastX.toFixed(1)},${baseY.toFixed(1)}`;

    const yTicks = [36, 37.5, 38, 39, 40].filter((value) => value >= FLOOR && value <= ceiling);
    const xTicks = buildTimeTicks(minTime, maxTime);
    const selected = points.find((point) => point.id === selectedId) ?? points[points.length - 1];
    const selectedTone = feverTone(selected.celsius);
    const plotted = points.map((point) => ({
        point,
        x: xOf(+new Date(point.takenAt)),
        y: yOf(point.celsius),
        tone: feverTone(point.celsius),
    }));
    const clustered = plotted[plotted.length - 1].x - plotted[0].x < 48;

    return (
        <figure className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
            <figcaption className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-500">Curva de fiebre</p>
                    {peak ? (
                        <p className="mt-1 text-sm text-gray-700">
                            Más alta{" "}
                            <span className={clsx("font-bold", FEVER_TEXT[feverTone(peak.celsius)])}>
                                {peak.celsius.toFixed(1)}°
                            </span>
                            <span className="text-gray-400"> · {formatShort(peak.takenAt)}</span>
                        </p>
                    ) : null}
                </div>
                {trend ? (
                    <span className={clsx("rounded-full px-2.5 py-1 text-xs font-semibold", TREND_STYLE[trend])}>
                        {trend === "subiendo" ? "Subiendo" : trend === "bajando" ? "Bajando" : "Estable"}
                    </span>
                ) : null}
            </figcaption>

            <div className="mb-2 flex items-end justify-between gap-3 border-b border-zinc-100 pb-3">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400">Hora de la toma</p>
                    <p className="text-3xl font-semibold tabular-nums tracking-tight text-gray-900">{clockLabel(selected.takenAt, points)}</p>
                    <p className="text-xs text-gray-400">
                        {formatDay(selected.takenAt)} · {FEVER_LABEL[selectedTone]}
                    </p>
                </div>
                <p className={clsx("text-4xl font-bold tabular-nums leading-none", FEVER_TEXT[selectedTone])}>
                    {selected.celsius.toFixed(1)}°
                </p>
            </div>

            <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-auto w-full overflow-visible font-sans" role="img" aria-label="Curva de temperatura en el tiempo">
                <polygon points={area} fill="#6366f1" opacity="0.08" />
                <line
                    x1={PAD.left}
                    x2={WIDTH - PAD.right}
                    y1={feverY}
                    y2={feverY}
                    stroke="#e4e4e7"
                    strokeWidth="1"
                />
                {yTicks.map((value) => (
                    <text
                        key={value}
                        x={PAD.left - 6}
                        y={yOf(value) + 3}
                        textAnchor="end"
                        fontSize="11"
                        fontWeight={value === 37.5 ? 600 : 500}
                        fill={value === 37.5 ? "#71717a" : "#a1a1aa"}
                    >
                        {value === 37.5 ? "37.5" : value}
                    </text>
                ))}
                {points.length > 1 ? (
                    <polyline points={line} fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
                ) : null}
                {doses.map((dose) => {
                    const x = xOf(+new Date(dose.givenAt));
                    return (
                        <g key={`med-${dose.id}`}>
                            <title>{`${formatShort(dose.givenAt)} · ${dose.name}${dose.dose ? ` ${dose.dose}` : ""}`}</title>
                            <polygon
                                points={`${x},${baseY - 11} ${x - 5},${baseY - 4} ${x},${baseY + 3} ${x + 5},${baseY - 4}`}
                                fill="#4f46e5"
                            />
                        </g>
                    );
                })}
                {plotted.map(({ point, x, y, tone }, index) => {
                    const isPeak = peak?.id === point.id && points.length > 1;
                    const isSelected = point.id === selectedId;
                    const labelRight = clustered ? Math.max(...plotted.map((item) => item.x)) + 12 < WIDTH - 52 : x + 36 < WIDTH - PAD.right;
                    const labelX = clustered ? Math.max(...plotted.map((item) => item.x)) + 12 : x;
                    const nearby = plotted.slice(0, index).some((item) => Math.abs(item.x - x) < 42 && Math.abs(item.y - y) < 16);
                    const showLabel = clustered || !nearby || isSelected;
                    return (
                        <g key={point.id} onClick={() => setPickedId(point.id)} className="cursor-pointer">
                            <title>{`${formatShort(point.takenAt)} · ${point.celsius.toFixed(1)}°`}</title>
                            {isSelected ? (
                                <line x1={x} x2={x} y1={y} y2={baseY} stroke="#4f46e5" strokeDasharray="3 4" strokeWidth="1" />
                            ) : null}
                            <circle cx={x} cy={y} r="14" fill="transparent" />
                            <circle
                                cx={x}
                                cy={y}
                                r={isPeak || isSelected ? 6.5 : 4.5}
                                fill={DOT[tone]}
                                stroke="white"
                                strokeWidth="2"
                            />
                            {showLabel ? (
                                <text
                                    x={clustered ? (labelRight ? labelX : labelX - 24) : x}
                                    y={clustered ? y + 4 : y - 12}
                                    textAnchor={clustered ? (labelRight ? "start" : "end") : "middle"}
                                    fontSize="12"
                                    fontWeight="700"
                                    fill={DOT[tone]}
                                >
                                    {point.celsius.toFixed(1)}°
                                </text>
                            ) : null}
                        </g>
                    );
                })}
                {xTicks.map((tick, index) => {
                    const day = formatDay(new Date(tick).toISOString());
                    const previousDay = index > 0 ? formatDay(new Date(xTicks[index - 1]).toISOString()) : null;
                    return (
                        <g key={tick}>
                            <text x={xOf(tick)} y={HEIGHT - 24} textAnchor="middle" fontSize="12" fontWeight="700" fill="#3f3f46">
                                {formatClock(new Date(tick).toISOString())}
                            </text>
                            {index === 0 || day !== previousDay ? (
                                <text x={xOf(tick)} y={HEIGHT - 8} textAnchor="middle" fontSize="10" fill="#a1a1aa">
                                    {day}
                                </text>
                            ) : null}
                        </g>
                    );
                })}
            </svg>

            {doses.length > 0 ? (
                <ul className="mt-2 flex flex-wrap gap-1.5">
                    {doses.map((dose) => (
                        <li key={dose.id} className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-medium text-indigo-700">
                            <span className="tabular-nums">{formatClock(dose.givenAt)}</span>
                            <span>
                                {dose.name}
                                {dose.dose ? ` ${dose.dose}` : ""}
                            </span>
                        </li>
                    ))}
                </ul>
            ) : null}

            <ol className="mt-3 max-h-64 space-y-1 overflow-y-auto">
                {[...points].reverse().map((point) => {
                    const tone = feverTone(point.celsius);
                    const isPeak = peak?.id === point.id && points.length > 1;
                    const isSelected = point.id === selectedId;
                    return (
                        <li
                            key={point.id}
                            className={clsx("flex items-center gap-1 rounded-xl px-2", isSelected ? "bg-indigo-50" : "hover:bg-zinc-50")}
                        >
                            <button
                                type="button"
                                onClick={() => setPickedId(point.id)}
                                className="flex min-w-0 flex-1 items-center gap-3 py-2 text-left"
                            >
                                <span className="w-[7.6rem] shrink-0">
                                    <span className="block text-base font-semibold tabular-nums tracking-tight text-gray-900">
                                        {clockLabel(point.takenAt, points)}
                                    </span>
                                    <span className="block text-[11px] text-gray-400">{formatDay(point.takenAt)}</span>
                                </span>
                                <span className="min-w-0 flex-1 text-xs text-gray-400">
                                    {isPeak ? "la más alta" : ""}
                                </span>
                                <span className={clsx("text-xl font-bold tabular-nums", FEVER_TEXT[tone])}>
                                    {point.celsius.toFixed(1)}°
                                </span>
                            </button>
                            {onRemove ? (
                                <button
                                    type="button"
                                    aria-label={`Quitar ${point.celsius.toFixed(1)}° de las ${formatClock(point.takenAt)}`}
                                    className="flex size-7 items-center justify-center rounded-full text-gray-300 hover:bg-rose-50 hover:text-rose-600"
                                    onClick={() => onRemove(point.id)}
                                >
                                    <FaTimes size={10} />
                                </button>
                            ) : null}
                        </li>
                    );
                })}
            </ol>
        </figure>
    );
}

function clockLabel(iso: string, readings: TemperatureReading[]): string {
    const base = formatClock(iso);
    const shared = readings.filter((reading) => formatClock(reading.takenAt) === base).length > 1;
    if (!shared) return base;
    const date = new Date(iso);
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const suffix = date.getHours() >= 12 ? "p. m." : "a. m.";
    const hour12 = date.getHours() % 12 || 12;
    return `${hour12}:${minutes}:${seconds} ${suffix}`;
}

function buildTimeTicks(minTime: number, maxTime: number): number[] {
    const span = maxTime - minTime;
    const hour = 60 * 60 * 1000;
    const steps = [0.25, 0.5, 1, 2, 3, 4, 6, 8, 12, 24];
    const ideal = span / hour / 4;
    const stepHours = steps.find((step) => step >= ideal) ?? 24;
    const step = stepHours * hour;
    const first = new Date(minTime);
    first.setSeconds(0, 0);
    if (stepHours >= 1) {
        first.setMinutes(0);
        const hourStep = stepHours;
        while (first.getHours() % hourStep !== 0) {
            first.setHours(first.getHours() + 1);
        }
    } else {
        const minuteStep = Math.round(stepHours * 60);
        const minutes = first.getMinutes();
        first.setMinutes(minutes - (minutes % minuteStep));
    }
    let tick = first.getTime();
    while (tick < minTime) tick += step;
    const ticks: number[] = [];
    while (tick <= maxTime && ticks.length < 6) {
        ticks.push(tick);
        tick += step;
    }
    if (ticks.length === 0) ticks.push(minTime);
    return ticks;
}
