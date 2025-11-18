import FinancialOverview from "./components/financial-overview";
import TransactionsSummaryCard from "./components/transaction-summary";
import YearlyReports from "./components/anual_reports";


export default function Page() {

    return (
        <div className="w-full max-w-8xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                <div className="gap-4 w-full col-span-1 max-h-full">
                    <TransactionsSummaryCard />
                </div>
                <div className="col-span-1 md:col-span-2">
                    <FinancialOverview />
                </div>
            </div>
            <div className="mx-auto w-full">
                <YearlyReports />
            </div>
        </div>

    )
}