import FinancialSummary from "./components/financial-summary";
import FloatingManageButton from "./components/floating-manage-buttons";
import TransactionsSummary from "./components/transactions-summary";


export default function Page() {

    return (
        <div>
            <FloatingManageButton />
            <div className="w-full max-w-8xl mx-auto space-y-6">
                <FinancialSummary />
                <TransactionsSummary />
            </div>
        </div>
    )
}