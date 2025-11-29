import { ExpensesFilters } from "@/app/types/filters";
import ExpensesByDate from "./expenses-by-date";
import { getExpensesFilterByDate } from "@/app/lib/dates";
import { ExpensesBreakdown } from "./expenses-breackdown";


export default function TransactionsSummary({ date }: { date: Date }) {

    const expensesFilter: ExpensesFilters = getExpensesFilterByDate(date);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ExpensesBreakdown expensesFilter={expensesFilter} />
            <ExpensesByDate expensesFilter={expensesFilter} />
        </div>
    );
}