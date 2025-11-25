import { FinancialGoal } from "@/app/types/financial-goal";
import { useEffect, useState } from "react";
import { getFinancialGoals } from "../actions/financial-goals";
import { Card, CardBody, CardHeader, Progress } from "@heroui/react";
import { FaTrophy } from "react-icons/fa";
import { getTotalSavings } from "../savings/actions/savings";
import { CustomLoading } from "@/app/components/customLoading";
import AnimatedNumber from "@/app/components/animated-number";

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
        <Card className="shadow-md p-4 bg-gradient-to-br from-white to-[#f9faff] overflow-hidden relative">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#5a6bff]/5 to-transparent rounded-full -translate-y-32 translate-x-32 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#5a6bff]/5 to-transparent rounded-full translate-y-16 -translate-x-16 pointer-events-none"></div>

            <CardHeader className="flex flex-col items-start px-2 pt-2 pb-2 z-10">
                <div className="flex items-center gap-2 mb-1">
                    <div className="p-2 bg-yellow-500/10 rounded-lg">
                        <FaTrophy className="h-5 w-5 text-yellow-500" />
                    </div>
                    <h2 className="text-xl font-extralight">Tus metas </h2>
                </div>
                <p className="text-sm text-gray-500 font-light">
                    Visualiza y alcanza tus objetivos financieros
                </p>
            </CardHeader>

            <CardBody className="px-2 pb-2 pt-2 z-10">
                <div className="space-y-4 mt-2">
                    {
                        loading ?
                            <div className="flex justify-center py-12">
                                <CustomLoading />
                            </div> :
                            financialGoals.length === 0 ? (
                                <div className="text-center py-8 text-gray-400 text-sm">
                                    No tienes metas definidas aún.
                                </div>
                            ) :
                                financialGoals.map((financialGoal) => {
                                    const percentage = Math.min((totalSavings / financialGoal.value) * 100, 100);
                                    const isCompleted = totalSavings >= financialGoal.value;

                                    return (
                                        <div
                                            key={financialGoal.id}
                                            className="group relative p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                        {financialGoal.name}
                                                    </h3>
                                                    <div className="flex items-baseline gap-1.5 mt-1">
                                                        <span className="text-2xl font-light text-gray-900 tracking-tight">
                                                            <AnimatedNumber value={totalSavings} />
                                                        </span>
                                                        <span className="text-xs text-gray-500 font-medium">
                                                            / <AnimatedNumber value={financialGoal.value} />
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className={`text-lg font-bold ${isCompleted ? 'text-emerald-500' : 'text-blue-500'}`}>
                                                        {Math.round(percentage)}%
                                                    </span>
                                                </div>
                                            </div>

                                            <Progress
                                                aria-label={`Progreso de ${financialGoal.name}`}
                                                size="sm"
                                                value={totalSavings}
                                                maxValue={financialGoal.value}
                                                classNames={{
                                                    base: "max-w-full",
                                                    track: "bg-gray-100 h-2",
                                                    indicator: isCompleted ? "bg-gradient-to-r from-emerald-500 to-teal-400" : "bg-gradient-to-r from-blue-500 to-indigo-500",
                                                }}
                                            />

                                            {!isCompleted && (
                                                <div className="mt-2 text-right">
                                                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">
                                                        Faltan <AnimatedNumber value={financialGoal.value - totalSavings} />
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })
                    }
                </div>
            </CardBody>
        </Card>
    )
}