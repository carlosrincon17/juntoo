import type { IllnessRecord, MedicationDose, TemperatureReading } from "@/app/types/health";

export const ILLNESS_PRESETS = [
    "Fiebre",
    "Gripa",
    "Resfriado",
    "Dolor de garganta",
    "Tos",
    "Otitis",
    "Dolor de estómago",
    "Alergia",
    "Infección",
] as const;

export const MEDICATION_PRESETS = [
    "Acetaminofén",
    "Ibuprofeno",
    "Loratadina",
    "Cetirizina",
    "Suero oral",
    "Ambroxol",
    "Salbutamol",
] as const;

export const TEMPERATURE_PRESETS = [37.5, 38, 38.5, 39, 39.5, 40] as const;

const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

export type FeverTone = "calm" | "warm" | "hot" | "high";

export function looseName(value: string): string {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

export function feverTone(celsius: number): FeverTone {
    if (celsius < 37.5) return "calm";
    if (celsius < 38) return "warm";
    if (celsius < 39) return "hot";
    return "high";
}

export const FEVER_TEXT: Record<FeverTone, string> = {
    calm: "text-emerald-600",
    warm: "text-amber-600",
    hot: "text-orange-600",
    high: "text-rose-600",
};

export const FEVER_LABEL: Record<FeverTone, string> = {
    calm: "Sin fiebre",
    warm: "Febrícula",
    hot: "Fiebre",
    high: "Fiebre alta",
};

export const FEVER_CHIP: Record<FeverTone, string> = {
    calm: "bg-emerald-50 text-emerald-700",
    warm: "bg-amber-50 text-amber-700",
    hot: "bg-orange-50 text-orange-700",
    high: "bg-rose-50 text-rose-700",
};

export function calendarDaySpan(startIso: string, endIso: string | null, now = new Date()): number {
    const start = new Date(startIso);
    const end = endIso ? new Date(endIso) : now;
    const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
    const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
    const diff = Math.round((endDay - startDay) / 86_400_000);
    return Math.max(1, diff + 1);
}

export function durationPhrase(days: number, active: boolean): string {
    if (active) {
        return days <= 1 ? "Hoy, día 1" : `Lleva ${days} días`;
    }
    return days <= 1 ? "Duró el mismo día" : `Duró ${days} días`;
}

export function peakTemperature(readings: TemperatureReading[]): TemperatureReading | null {
    if (readings.length === 0) return null;
    return readings.reduce((peak, reading) => (reading.celsius > peak.celsius ? reading : peak));
}

export function latestTemperature(readings: TemperatureReading[]): TemperatureReading | null {
    if (readings.length === 0) return null;
    return [...readings].sort((a, b) => +new Date(b.takenAt) - +new Date(a.takenAt))[0];
}

export function activeIllness(illnesses: IllnessRecord[]): IllnessRecord | null {
    return illnesses.find((illness) => illness.endedAt === null) ?? null;
}

export type MedicationGroup = {
    name: string;
    dose: string | null;
    doses: { id: number; givenAt: string }[];
};

export function groupMedications(medications: MedicationDose[]): MedicationGroup[] {
    const groups = new Map<string, MedicationGroup>();
    const chronological = [...medications].sort((a, b) => +new Date(a.givenAt) - +new Date(b.givenAt));

    for (const medication of chronological) {
        const dose = medication.dose?.trim() || null;
        const key = `${looseName(medication.name)}|${looseName(dose ?? "")}`;
        const existing = groups.get(key);
        if (existing) {
            existing.doses.push({ id: medication.id, givenAt: medication.givenAt });
            continue;
        }
        groups.set(key, {
            name: medication.name.trim(),
            dose,
            doses: [{ id: medication.id, givenAt: medication.givenAt }],
        });
    }

    return [...groups.values()];
}

export type RepeatMedication = {
    name: string;
    dose: string | null;
    givenAt: string;
};

export function repeatMedications(medications: MedicationDose[]): RepeatMedication[] {
    const seen = new Set<string>();
    const result: RepeatMedication[] = [];
    const recentFirst = [...medications].sort((a, b) => +new Date(b.givenAt) - +new Date(a.givenAt));

    for (const medication of recentFirst) {
        const key = looseName(medication.name);
        if (!key || seen.has(key)) continue;
        seen.add(key);
        result.push({
            name: medication.name.trim(),
            dose: medication.dose?.trim() || null,
            givenAt: medication.givenAt,
        });
    }

    return result;
}

export function relativeTime(iso: string, now = Date.now()): string {
    const minutes = Math.round((now - new Date(iso).getTime()) / 60_000);
    if (!Number.isFinite(minutes) || minutes < 1) return "hace un momento";
    if (minutes < 60) return `hace ${minutes} min`;
    const hours = Math.round(minutes / 60);
    if (hours < 24) return `hace ${hours} h`;
    const days = Math.round(hours / 24);
    return days === 1 ? "hace 1 día" : `hace ${days} días`;
}

function clock(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const suffix = hours >= 12 ? "p. m." : "a. m.";
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes} ${suffix}`;
}

export function formatStamp(iso: string): string {
    const date = new Date(iso);
    return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}, ${clock(date)}`;
}

export function formatClock(iso: string): string {
    return clock(new Date(iso));
}

export function formatShort(iso: string): string {
    const date = new Date(iso);
    return `${date.getDate()} ${MONTHS[date.getMonth()]} · ${clock(date)}`;
}

export function temperatureTrend(readings: TemperatureReading[]): "subiendo" | "bajando" | "estable" | null {
    const ordered = [...readings].sort((a, b) => +new Date(a.takenAt) - +new Date(b.takenAt));
    if (ordered.length < 2) return null;
    const delta = ordered[ordered.length - 1].celsius - ordered[ordered.length - 2].celsius;
    if (delta >= 0.3) return "subiendo";
    if (delta <= -0.3) return "bajando";
    return "estable";
}

export function formatDay(iso: string): string {
    const date = new Date(iso);
    return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

export function toDatetimeLocal(date: Date): string {
    const pad = (value: number) => value.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function fromDatetimeLocal(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        throw new Error("La hora no es válida");
    }
    return date.toISOString();
}

export function buildDoctorSummary(childName: string, illness: IllnessRecord, now = new Date()): string {
    const active = illness.endedAt === null;
    const days = calendarDaySpan(illness.startedAt, illness.endedAt, now);
    const peak = peakTemperature(illness.temperatures);
    const temperatures = [...illness.temperatures].sort((a, b) => +new Date(a.takenAt) - +new Date(b.takenAt));
    const medications = groupMedications(illness.medications);
    const endLabel = illness.endedAt ? formatStamp(illness.endedAt) : "en curso";
    const rangeEnd = illness.endedAt ? formatDay(illness.endedAt) : formatDay(now.toISOString());

    const lines = [
        `${childName} — ${illness.name}`,
        `Desde: ${formatStamp(illness.startedAt)}`,
        `Hasta: ${endLabel}`,
        `${durationPhrase(days, active)} (${formatDay(illness.startedAt)} – ${rangeEnd})`,
        "",
        peak
            ? `Temperatura más alta: ${peak.celsius.toFixed(1)}°C (${formatStamp(peak.takenAt)})`
            : "Temperatura más alta: sin registros",
        "",
        "Temperaturas",
        temperatures.length > 0
            ? temperatures.map((reading) => `• ${formatStamp(reading.takenAt)} — ${reading.celsius.toFixed(1)}°C`).join("\n")
            : "• Sin registros",
        "",
        "Medicamentos",
    ];

    if (medications.length === 0) {
        lines.push("• Sin registros");
    } else {
        for (const group of medications) {
            const dose = group.dose ? ` ${group.dose}` : "";
            const times = group.doses.length === 1 ? "1 vez" : `${group.doses.length} veces`;
            const when = group.doses.map((doseItem) => formatStamp(doseItem.givenAt)).join("; ");
            lines.push(`• ${group.name}${dose} — ${times}`);
            lines.push(`  ${when}`);
        }
    }

    if (illness.notes?.trim()) {
        lines.push("", "Notas", illness.notes.trim());
    }

    return lines.join("\n");
}
