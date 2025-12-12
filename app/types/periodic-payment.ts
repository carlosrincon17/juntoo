import { Category } from "./category";
import { User } from "./user";

export type Frequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export type PeriodicPayment = {
    id?: number;
    name: string;
    value: number;
    category_id: number;
    category?: Category | null;
    frequency: Frequency;
    startDate: Date;
    userId: number;
    user?: User | null;
    familyId: number;
    transactionType: string;
    lastApplied?: Date | null;
}
