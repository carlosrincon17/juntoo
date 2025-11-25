import { User } from "./user";
import { FinancialGoal } from "./financial-goal";

export type Savings = {
    id: number;
    name: string;
    value: number;
    owner: string;
    userId: number | null;
    user?: User | null;
    currency?: string;
    familyId: number | null;
    isInvestment: boolean;
    annualInterestRate?: number | null;
    goalId?: number | null;
    goal?: FinancialGoal | null;
}