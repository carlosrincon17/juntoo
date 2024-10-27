export type Budget = {
    id: number;
    name: string;
    value: number;
    isActive: boolean;
    createdAt?: Date;
}

export type BudgetWithExpenses = Budget & {totalExpenses: number}