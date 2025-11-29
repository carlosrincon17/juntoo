export type FamilyGoal = {
    id: number;
    title: string;
    description?: string | null;
    year: number;
    progress: number;
    isCompleted: boolean;
    familyId: number;
    createdAt: Date;
    type: 'BOOLEAN' | 'ITEMIZED';
    targetAmount?: number | null;
    currentAmount?: number | null;
}
