import { FinancialGoal } from "@/app/types/financial-goal";
import { useEffect, useTransition } from "react";
import { useState } from "react";
import { getFinancialGoals } from "../actions/financial-goals";
import { Card, CardBody, CardHeader, Progress } from "@heroui/react";
import { FaTrophy } from "react-icons/fa";
import { CustomLoading } from "@/app/components/customLoading";
import AnimatedNumber from "@/app/components/animated-number";

export default function FinancialGoals({ date }: { date?: Date }) {

    const [financialGoals, setFinancialGoals] = useState<FinancialGoal[]>([]);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        startTransition(async () => {
            const data = await getFinancialGoals();
            setFinancialGoals(data);
        });
    }, [date]);

    const isCurrentMonth = () => {
        if (!date) return true;
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }

    if (!isCurrentMonth()) {
        return null;
    }

    return (
        <Card className="shadow-sm border border-gray-100 p-1 bg-white overflow-hidden relative rounded-2xl">
            {/* Minimalist decorative elements */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50/50 rounded-full blur-3xl -translate-y-24 translate-x-24 pointer-events-none"></div>

            <CardHeader className="flex flex-col items-start px-5 pt-5 pb-3 z-10 border-b border-gray-50/80">
                <div className="flex items-center justify-between w-full mb-1">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-yellow-50 rounded-xl border border-yellow-100/50">
                            <FaTrophy className="h-4 w-4 text-yellow-500" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Tus metas</h2>
                    </div>
                </div>
                <p className="text-sm text-gray-500 font-medium mt-1">
                    Visualiza y alcanza tus objetivos financieros
                </p>
            </CardHeader>

            <CardBody className="px-5 pb-5 pt-4 z-10 relative">
                <div className="space-y-4">
                    {
                        isPending ?
                            <div className="flex justify-center py-10">
                                <CustomLoading />
                            </div> :
                            financialGoals.length === 0 ? (
                                <div className="text-center py-10 text-gray-400 text-sm font-medium border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                                    No tienes metas definidas aún.
                                </div>
                            ) :
                                financialGoals.map((financialGoal) => {
                                    const currentAmount = financialGoal.currentAmount || 0;
                                    const percentage = Math.min((currentAmount / financialGoal.value) * 100, 100);
                                    const isCompleted = currentAmount >= financialGoal.value;

                                    return (
                                        <div
                                            key={financialGoal.id}
                                            className="group relative p-4 rounded-2xl bg-white border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-300"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                        {financialGoal.name}
                                                    </h3>
                                                    <div className="flex items-baseline gap-1.5 mt-1">
                                                        <span className="text-lg font-semibold text-gray-900 tracking-tight">
                                                            <AnimatedNumber value={currentAmount} />
                                                        </span>
                                                        <span className="text-xs text-gray-400 font-medium">
                                                            / <AnimatedNumber value={financialGoal.value} />
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className={`text-sm font-bold bg-gray-50 px-2 py-0.5 rounded-full ${isCompleted ? 'text-emerald-500 border border-emerald-100/50' : 'text-blue-500 border border-blue-100/50'}`}>
                                                        {Math.round(percentage)}%
                                                    </span>
                                                </div>
                                            </div>

                                            <Progress
                                                aria-label={`Progreso de ${financialGoal.name}`}
                                                size="sm"
                                                value={currentAmount}
                                                maxValue={financialGoal.value}
                                                classNames={{
                                                    base: "max-w-full",
                                                    track: "bg-gray-100 h-1.5 rounded-full overflow-hidden",
                                                    indicator: isCompleted ? "bg-emerald-500" : "bg-blue-500",
                                                }}
                                            />

                                            {!isCompleted && (
                                                <div className="mt-2.5 text-right opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                                                        Faltan <AnimatedNumber value={financialGoal.value - currentAmount} />
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