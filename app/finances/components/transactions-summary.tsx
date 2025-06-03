import { ExpensesFilters } from "@/app/types/filters";
import ExpensesByDate from "./expenses-by-date";
import TransactionsList from "./transactions-list";
import { getExpensesFilter } from "@/app/lib/dates";


export default function TransactionsSummary() {

    const expensesFilter: ExpensesFilters =  getExpensesFilter();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ExpensesByDate expensesFilter={expensesFilter} />
            <TransactionsList  />
        </div>
    );
}