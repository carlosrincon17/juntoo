import { FinancialGoal } from "@/app/types/financial-goal";
import { useEffect, useState } from "react";
import { getFinancialGoals } from "../actions/financial-goals";
import { Card, CardHeader, Progress } from "@heroui/react";
import { FaFlagCheckered } from "react-icons/fa";
import { formatCurrency } from "@/app/lib/currency";
import { getTotalSavings } from "../savings/actions/savings";
import { CustomLoading } from "@/app/components/customLoading";

export default function FinancialGoals() {

    const [financialGoals, setFinancialGoals] = useState<FinancialGoal[]>([]);
    const [totalSavings, setTotalSavings] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    const loadFinancialGoals = async () => {
        const financialGoalsData = await getFinancialGoals();
        setFinancialGoals(financialGoalsData);
        const totalSavingsData = await getTotalSavings();
        setTotalSavings(totalSavingsData);
        setLoading(false);
    }

    useEffect(() => {
        loadFinancialGoals();
    }, []);

    return (
        <Card className="shadow-md p-4 bg-gradient-to-br from-white to-[#f9faff]">
            <CardHeader className="space-y-2">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#5a6bff]/5 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#5a6bff]/5 to-transparent rounded-full translate-y-16 -translate-x-16"></div>
                <div>
                    <h2 className="text-xl font-extralight w-full">Tus metas</h2>
                    <p className="text-xs text-default">
                        Sigue el progreso de tus metas y mantente motivado
                    </p>
                </div>
            </CardHeader>
            <div className="space-y-2 relative mt-2">
                {
                    loading ?
                        <CustomLoading className="mt-24" /> :
                        financialGoals.map((financialGoal) => (
                            <div 
                                key={financialGoal.id} 
                                className="space-y-2 justify-between p-3 pb-6 rounded-xl bg-gradient-to-r from-white via-white to-teal-50 border border-[#f0f4ff] hover:shadow-md hover:border-[#e4e9ff] transition-all duration-200"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <FaFlagCheckered className="h-4 w-4 text-emerald-500" />
                                        <div className="font-medium">{financialGoal.name}</div>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <Progress 
                                        maxValue={financialGoal.value} 
                                        size="sm" 
                                        label={`${formatCurrency(totalSavings)} / ${formatCurrency(financialGoal.value)}`}
                                        showValueLabel={true}
                                        value={totalSavings}
                                        color="success"
                                        classNames={{
                                            label: "font-light",
                                            value: "font-light",
                                        }}
                                    />
                                </div>
                            </div>
                        ))
                } 
            </div>
        </Card>
    )
}