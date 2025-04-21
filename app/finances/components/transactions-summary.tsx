import { ExpensesFilters } from "@/app/types/filters";
import ExpensesByDate from "./expenses-by-date";
import TransactionsList from "./transactions-list";

interface TransactionSummaryProps {
    expensesFilter: ExpensesFilters;
}
export default function TransactionsSummary({ expensesFilter }: TransactionSummaryProps) {

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ExpensesByDate expensesFilter={expensesFilter} />
            <TransactionsList  />
        </div>
    );
}