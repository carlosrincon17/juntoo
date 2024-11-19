import { User } from "./user";

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
}