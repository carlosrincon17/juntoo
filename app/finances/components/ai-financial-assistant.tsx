"use client";

import { useState } from "react";
import { Card, CardBody, Spinner, Chip, Button } from "@heroui/react";
import { FinancialMetrics } from "@/app/types/financial";
import { DashboardAiContext, generateAdvancedDashboardFeedback } from "@/app/actions/ai";
import { FaRobot, FaLightbulb, FaExclamationTriangle, FaCheckCircle, FaChartLine, FaMagic } from "react-icons/fa";
import { getTopCategoriesWithMostExpenses } from "@/app/actions/expenses";
import { getFamilyGoals } from "@/app/actions/family-goals";
import { TransactionType } from "@/utils/enums/transaction-type";
import { getExpensesFilterByDate } from "@/app/lib/dates";

interface AiFinancialAssistantProps {
    metrics: FinancialMetrics;
    date: Date;
}

interface AdvancedFeedback {
    globalHealth?: "positive" | "warning" | "danger";
    mainAnalysis?: string;
    savingsOpportunity?: string;
    goalEncouragement?: string;
    error?: string;
}

export default function AiFinancialAssistant({ metrics, date }: AiFinancialAssistantProps) {
    const [feedback, setFeedback] = useState<AdvancedFeedback | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);

    const handleStartAnalysis = async () => {
        setHasStarted(true);
        setIsLoading(true);
        try {
            const activeYear = date.getFullYear();
            const filters = getExpensesFilterByDate(date);
            
            const [topCategories, rawGoals] = await Promise.all([
                getTopCategoriesWithMostExpenses(filters, TransactionType.Outcome),
                getFamilyGoals(activeYear)
            ]);

            const formattedCategories = topCategories.slice(0, 3).map(c => ({
                name: c.categoryName,
                total: c.totalExpenses
            }));

            const activeGoals = rawGoals.filter(g => !g.isCompleted).map(g => ({
                title: g.title,
                progress: g.progress,
                target: g.targetAmount || 0
            }));

            const context: DashboardAiContext = {
                monthlyExpenses: metrics.expenses.total || 0,
                monthlyIncome: metrics.investmentIncome.total || 0,
                totalSavings: metrics.savings.total || 0,
                topCategories: formattedCategories,
                goals: activeGoals
            };

            const rawJson = await generateAdvancedDashboardFeedback(context);
            
            if (rawJson) {
                const parsed = JSON.parse(rawJson);
                setFeedback(parsed);
            }
        } catch (error) {
            console.error("Error fetching AI insight:", error);
            setFeedback({ error: "UNKNOWN_ERROR" });
        } finally {
            setIsLoading(false);
        }
    };

    if (!hasStarted) {
        return (
            <Card className="shadow-sm border-2 border-dashed border-indigo-100 bg-white/50 hover:bg-indigo-50/30 transition-colors duration-300">
                <CardBody className="p-6 flex flex-col items-center justify-center text-center gap-3">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-1">
                        <FaRobot size={24} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-800 tracking-tight">Copilot Financiero</h3>
                        <p className="text-xs text-slate-500 max-w-[220px] mx-auto mt-1 mb-4 leading-relaxed">
                            Obtén un diagnóstico avanzado de tus gastos y metas sin consumir tokens pasivamente.
                        </p>
                    </div>
                    <Button 
                        color="primary" 
                        variant="flat" 
                        onPress={handleStartAnalysis}
                        startContent={<FaMagic />}
                        className="font-medium px-6 tracking-wide shadow-sm"
                    >
                        Despertar al Oráculo
                    </Button>
                </CardBody>
            </Card>
        );
    }

    if (isLoading) {
        return (
            <div className="flex flex-col h-[200px] w-full items-center justify-center p-6 border-2 border-dashed border-indigo-100 bg-indigo-50/50 rounded-2xl animate-pulse">
                <Spinner size="md" color="primary" />
                <span className="mt-4 text-sm text-indigo-400 font-medium tracking-wide">Leyendo el destino de tus finanzas...</span>
            </div>
        );
    }

    if (!feedback || feedback.error) {
        let errorText = "No se pudo conectar con el motor de IA.";
        if (feedback?.error === "QUOTA_EXCEEDED") {
            errorText = "Límite de solicitudes de IA excedido (Error 429).";
        } else if (feedback?.error === "MISSING_API_KEY") {
            errorText = "Vercel no está detectando la variable GEMINI_API_KEY en Producción. ¡Asegúrate de haber redespachado (re-deploy) el proyecto!";
        }
        
        return (
            <div className="w-full h-full min-h-[140px] flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-gray-200 bg-gray-50/50 rounded-2xl">
                <FaRobot className="text-gray-300 mb-2" size={28} />
                <h3 className="text-sm font-medium text-gray-500">Copilot Inactivo</h3>
                <p className="text-xs text-gray-400 mt-1 max-w-[250px]">
                    {errorText}
                </p>
                <Button size="sm" variant="light" className="mt-3 text-gray-400" onPress={() => setHasStarted(false)}>
                    Volver a esconder
                </Button>
            </div>
        );
    }

    const healthColor = 
        feedback.globalHealth === 'positive' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
            feedback.globalHealth === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                'bg-rose-50 border-rose-200 text-rose-800';

    const HealthIcon = 
        feedback.globalHealth === 'positive' ? FaCheckCircle :
            feedback.globalHealth === 'warning' ? FaExclamationTriangle :
                FaExclamationTriangle;

    return (
        <Card className={`shadow-md border ${healthColor} overflow-hidden relative group`}>
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/40 rounded-full blur-xl group-hover:bg-white/60 transition-all duration-700 pointer-events-none"></div>

            <CardBody className="p-5 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-black/5">
                    <div className="flex items-center gap-2">
                        <FaRobot className="text-xl opacity-80" />
                        <h3 className="font-semibold tracking-tight">Juntoo Copilot</h3>
                    </div>
                    <Chip size="sm" variant="flat" color={feedback.globalHealth === 'positive' ? 'success' : feedback.globalHealth === 'warning' ? 'warning' : 'danger'} startContent={<HealthIcon size={12} className="ml-1" />}>
                        {feedback.globalHealth === 'positive' ? 'Viento en popa' : feedback.globalHealth === 'warning' ? 'Requiere atención' : 'Alerta crítica'}
                    </Chip>
                </div>

                <div className="space-y-4">
                    <div className="flex gap-3">
                        <div className="mt-0.5 opacity-60"><FaChartLine /></div>
                        <p className="text-sm font-medium leading-relaxed">
                            {feedback.mainAnalysis}
                        </p>
                    </div>

                    <div className="bg-white/80 rounded-xl p-3 shadow-sm border border-black/5">
                        <div className="flex gap-2">
                            <FaLightbulb className="text-amber-500 shrink-0 mt-0.5" size={14} />
                            <div>
                                <span className="text-xs font-semibold block mb-0.5 opacity-70 uppercase tracking-wider">Oportunidad de ahorro</span>
                                <span className="text-sm font-medium opacity-90">{feedback.savingsOpportunity}</span>
                            </div>
                        </div>
                    </div>

                    {feedback.goalEncouragement && (
                        <p className="text-xs font-medium opacity-80 pl-8 relative before:absolute before:left-3 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-current">
                            {feedback.goalEncouragement}
                        </p>
                    )}
                </div>
            </CardBody>
        </Card>
    );
}
