"use client";

import { useState } from "react";
import { Card, CardBody, Spinner, Chip, Button } from "@heroui/react";
import { ConsolidatedAiContext, generateConsolidatedAiFeedback } from "@/app/actions/ai";
import { FaRobot, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { FaChartPie, FaMoneyBillWave, FaArrowTrendUp, FaGem } from "react-icons/fa6";
import { Savings } from "@/app/types/saving";
import { Patrimony } from "@/app/types/patrimony";
import { Debts } from "@/app/types/debts";

interface AiConsolidatedAdvisorProps {
    savings: Savings[];
    patrimonies: Patrimony[];
    debts: Debts[];
    summary: {
        savings: number;
        assets: number;
        debts: number;
        balance: number;
    }
}

interface ConsolidatedFeedback {
    wealthHealth?: "positive" | "warning" | "danger";
    macroAnalysis?: string;
    debtStrategy?: string;
    growthOpportunity?: string;
    error?: string;
}

export default function AiConsolidatedAdvisor({ savings, patrimonies, debts, summary }: AiConsolidatedAdvisorProps) {
    const [feedback, setFeedback] = useState<ConsolidatedFeedback | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);

    const handleStartAnalysis = async () => {
        setHasStarted(true);
        setIsLoading(true);
        try {
            const context: ConsolidatedAiContext = {
                summary: {
                    totalSavings: summary.savings,
                    totalAssets: summary.assets,
                    totalDebts: summary.debts,
                    netWorth: summary.balance
                },
                savingsList: savings.map(s => ({ name: s.name, amount: s.copValue || s.value })),
                debtsList: debts.map(d => ({ name: d.name, amount: d.value })),
                assetsList: patrimonies.map(p => ({ name: p.name, amount: p.value }))
            };

            const rawJson = await generateConsolidatedAiFeedback(context);
            
            if (rawJson) {
                const parsed = JSON.parse(rawJson);
                setFeedback(parsed);
            }
        } catch (error) {
            console.error("Error fetching AI consolidated insight:", error);
            setFeedback({ error: "UNKNOWN_ERROR" });
        } finally {
            setIsLoading(false);
        }
    };

    if (!hasStarted) {
        return (
            <Card className="shadow-sm border-2 border-dashed border-emerald-100 bg-white/50 hover:bg-emerald-50/30 transition-colors duration-300">
                <CardBody className="p-6 flex flex-col items-center justify-center text-center gap-3">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-1">
                        <FaGem size={22} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-800 tracking-tight">Análisis Patrimonial IA</h3>
                        <p className="text-xs text-slate-500 max-w-[280px] mx-auto mt-1 mb-4 leading-relaxed">
                            Interroga a Juntoo Copilot para cruzar tu nivel de liquidez vs deudas y obtener una estrategia de Net Worth.
                        </p>
                    </div>
                    <Button 
                        color="success" 
                        variant="flat" 
                        onPress={handleStartAnalysis}
                        startContent={<FaChartPie />}
                        className="font-medium px-6 text-emerald-700 tracking-wide shadow-sm"
                    >
                        Auditar Patrimonio
                    </Button>
                </CardBody>
            </Card>
        );
    }

    if (isLoading) {
        return (
            <div className="flex flex-col h-[220px] w-full items-center justify-center p-6 border-2 border-dashed border-emerald-100 bg-emerald-50/50 rounded-2xl animate-pulse">
                <Spinner size="md" color="success" />
                <span className="mt-4 text-sm text-emerald-600 font-medium tracking-wide">Cuantificando tu Net Worth...</span>
            </div>
        );
    }

    if (!feedback || feedback.error) {
        return (
            <div className="w-full h-full min-h-[140px] flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-gray-200 bg-gray-50/50 rounded-2xl">
                <FaRobot className="text-gray-300 mb-2" size={28} />
                <h3 className="text-sm font-medium text-gray-500">Auditoría Fallida</h3>
                <p className="text-xs text-gray-400 mt-1 max-w-[250px]">
                    No se logró concretar el análisis de IA.
                </p>
                <Button size="sm" variant="light" className="mt-3 text-gray-400" onPress={() => setHasStarted(false)}>
                    Cerrar
                </Button>
            </div>
        );
    }

    const healthColor = 
        feedback.wealthHealth === 'positive' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
        feedback.wealthHealth === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' :
        'bg-rose-50 border-rose-200 text-rose-800';

    const HealthIcon = 
        feedback.wealthHealth === 'positive' ? FaCheckCircle :
        FaExclamationTriangle;

    return (
        <Card className={`shadow-md border ${healthColor} overflow-hidden relative group`}>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/40 rounded-full blur-xl group-hover:bg-white/60 transition-all duration-700 pointer-events-none"></div>

            <CardBody className="p-6 space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-black/5">
                    <div className="flex items-center gap-2">
                        <FaGem className="text-xl opacity-80" />
                        <h3 className="font-semibold tracking-tight">Macro-Análisis Patrimonial</h3>
                    </div>
                    <Chip size="sm" variant="flat" color={feedback.wealthHealth === 'positive' ? 'success' : feedback.wealthHealth === 'warning' ? 'warning' : 'danger'} startContent={<HealthIcon size={12} className="ml-1" />}>
                        {feedback.wealthHealth === 'positive' ? 'Patrimonio Sólido' : feedback.wealthHealth === 'warning' ? 'Riesgo de Liquidez' : 'Alto Apalancamiento'}
                    </Chip>
                </div>

                <div className="space-y-5">
                    <div className="flex gap-3">
                        <div className="mt-0.5 opacity-60"><FaChartPie /></div>
                        <p className="text-sm font-medium leading-relaxed">
                            {feedback.macroAnalysis}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white/80 rounded-xl p-4 shadow-sm border border-black/5">
                            <div className="flex gap-2 mb-2">
                                <FaMoneyBillWave className="text-rose-500 shrink-0 mt-0.5" size={14} />
                                <span className="text-xs font-bold block opacity-70 uppercase tracking-wider text-rose-800">Estrategia de Deuda</span>
                            </div>
                            <span className="text-sm font-medium opacity-90">{feedback.debtStrategy}</span>
                        </div>

                        <div className="bg-white/80 rounded-xl p-4 shadow-sm border border-black/5">
                            <div className="flex gap-2 mb-2">
                                <FaArrowTrendUp className="text-emerald-500 shrink-0 mt-0.5" size={14} />
                                <span className="text-xs font-bold block opacity-70 uppercase tracking-wider text-emerald-800">Crecimiento Copilot</span>
                            </div>
                            <span className="text-sm font-medium opacity-90">{feedback.growthOpportunity}</span>
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
