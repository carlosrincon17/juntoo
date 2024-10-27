import { Category } from "./category";

export type Expense = {
    id?: number;
    category_id: number;
    category?: Category | null;
    value?: number;
    createdBy?: string;
    createdAt?: Date;
    transactionType?: string;
}

export type CategoryExpense = {
    categoryName: string;
    totalExpenses: number;
}

export type TotalExpenses = {
    totalExpenses: number;
    totalIncomes: number;
}
  