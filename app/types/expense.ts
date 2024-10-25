import { Category } from "./category";

export type Expense = {
    id?: number;
    category_id: number;
    category?: Category | null;
    value?: number;
    createdBy?: string;
    createdAt?: Date;
}

export type CategoryExpense = {
    categoryName: string;
    totalExpenses: number;
  }
  