import { ExpensesFilters } from "../types/filters";
import FinancialSummary from "./components/financial-summary";
import FloatingManageButton from "./components/floating-manage-buttons";
import TransactionsSummary from "./components/transactions-summary";



export default function Page() {

    const currentDate = new Date();
    const expensesFilter: ExpensesFilters ={
        startDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
        endDate: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0),
    };

    return (
        <div>
            <FloatingManageButton />
            <div className="w-full max-w-8xl mx-auto space-y-6">
                <FinancialSummary expensesFilter={expensesFilter} />
                <TransactionsSummary expensesFilter={expensesFilter} />
            </div>   
        </div>
    )
}