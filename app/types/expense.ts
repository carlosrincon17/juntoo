import { Category } from "./category";
import { Budget } from "./budget";
import { User } from "./user";

export type Expense = {
    id?: number;
    category_id: number;
    category?: Category | null;
    value?: number;
    createdBy?: string;
    createdAt?: Date;
    transactionType?: string;
    budgetId: number | null;
    budget?: Budget | null;
    userId: number | null;
    user?: User | null;
    familyId?: number | null;
}

export type CategoryExpense = {
    categoryName: string;
    totalExpenses: number;
}

export type UserExpense = {
    userName: string;
    totalExpenses: number;
}


export type TotalExpenses = {
    totalExpenses: number;
    totalIncomes: number;
}

export type ExpenseByDate = {
    parent: string
    date: string;
    totalExpenses: number;
}
  