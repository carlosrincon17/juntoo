export type ChildAccent = "rose" | "moss" | "gold";

export type TemperatureReading = {
    id: number;
    celsius: number;
    takenAt: string;
    note: string | null;
};

export type MedicationDose = {
    id: number;
    name: string;
    dose: string | null;
    givenAt: string;
    note: string | null;
};

export type IllnessRecord = {
    id: number;
    name: string;
    notes: string | null;
    startedAt: string;
    endedAt: string | null;
    temperatures: TemperatureReading[];
    medications: MedicationDose[];
};

export type HealthChild = {
    id: number;
    name: string;
    accent: ChildAccent;
    illnesses: IllnessRecord[];
};
