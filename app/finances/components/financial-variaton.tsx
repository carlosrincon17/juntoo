import { formatCurrency } from "@/app/lib/currency";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const FinancialVariation = ({variationPercentage, amount}: {variationPercentage: number, amount: number}) => {
    return (
        <div className="flex items-center gap-1 relative">
            <div className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full">
                {
                    variationPercentage > 0 ?
                        <FaChevronUp className="h-3 w-3 text-white" /> :
                        <FaChevronDown className="h-3 w-3 text-white" />
                }
                <span className="text-xs text-white">{Math.abs(Math.round(variationPercentage))}%</span>
                <span className="text-xs text-white/50">({formatCurrency(amount)})</span>
            </div>
        </div>
    );
}

export default FinancialVariation;