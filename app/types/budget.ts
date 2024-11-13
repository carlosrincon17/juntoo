export type Budget = {
    id: number;
    name: string;
    value: number;
    isActive: boolean;
    createdAt?: Date;
    familyId: number | null;
}

export type BudgetWithExpenses = Budget & {totalExpenses: number}