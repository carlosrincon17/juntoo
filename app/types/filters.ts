export type ExpensesFilters = {
    startDate: Date;
    endDate: Date;
    transactionType?: string;
    parentCategory?: string;
}