export interface FinancialGoal {
    id: number;
    name: string;
    value: number;
    familyId: number;
    currentAmount?: number;
}