'use server'

import { GoogleGenerativeAI } from '@google/generative-ai';

function extractJson(textResponse: string): string {
    const pattern = /\{[^{}]*\}/;
    const match = textResponse.match(pattern);
    return match ? match[0] : '{}';
}

export interface DashboardAiContext {
    monthlyExpenses: number;
    monthlyIncome: number;
    totalSavings: number;
    topCategories: { name: string; total: number }[];
    goals: { title: string; progress: number; target: number }[];
}

export async function generateAdvancedDashboardFeedback(context: DashboardAiContext): Promise<string> {
    if (!process.env.GEMINI_API_KEY) {
        console.error("Vercel Env Warning: GEMINI_API_KEY is undefined on the server.");
        return JSON.stringify({ error: "MISSING_API_KEY" });
    }
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `
            Eres Juntoo AI, un asesor financiero sumamente avanzado, directo y creativo.
            Contexto del mes actual de la familia:
            - Gastos Mensuales Totales: $${context.monthlyExpenses}
            - Ingresos (Entradas): $${context.monthlyIncome}
            - Ahorros Acumulados Totales: $${context.totalSavings}
            - Top Categorias de Gasto: ${JSON.stringify(context.topCategories)}
            - Metas Activas: ${JSON.stringify(context.goals)}

            Analiza profundamente estos datos. Relaciona si están gastando demasiado en una categoría comparado con lo que les falta para una meta.
            Actúa como un experto amigable.
            
            Usa ESTRICTAMENTE el siguiente esquema JSON: 
            {
                "globalHealth": "positive" | "warning" | "danger",
                "mainAnalysis": "Un diagnóstico perspicaz de 2 líneas sobre sus ingresos, gastos y categorías.",
                "savingsOpportunity": "Una sugerencia accionable y creativa de recorte basada en su top de gastos.",
                "goalEncouragement": "Una frase conectando su salud financiera mensual con el progreso de una de sus metas."
            }
            Devuelve ÚNICAMENTE el código JSON válido.`;
    try {
        const result = await model.generateContent(prompt);
        return extractJson(result.response.text());
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Gemini AI API Error:", error.message);
            if (error.message.includes("429") || error.message.includes("Quota")) {
                return JSON.stringify({ error: "QUOTA_EXCEEDED" });
            }
        } else {
            console.error("Gemini AI API Error:", error);
        }
        return JSON.stringify({ error: "UNKNOWN_ERROR" });
    }
}

export interface ConsolidatedAiContext {
    summary: { totalSavings: number; totalAssets: number; totalDebts: number; netWorth: number };
    savingsList: { name: string; amount: number }[];
    debtsList: { name: string; amount: number; interestRate?: number }[];
    assetsList: { name: string; amount: number }[];
}

export async function generateConsolidatedAiFeedback(context: ConsolidatedAiContext): Promise<string> {
    if (!process.env.GEMINI_API_KEY) {
        console.error("Vercel Env Warning: GEMINI_API_KEY is undefined on the server.");
        return JSON.stringify({ error: "MISSING_API_KEY" });
    }
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `
            Eres Juntoo AI, un asesor patrimonial sumamente avanzado y analítico.
            Contexto del "Consolidado Patrimonial" de la familia:
            - Ahorros Totales Líquidos: $${context.summary.totalSavings}
            - Activos (Patrimonio No Líquido): $${context.summary.totalAssets}
            - Deudas Activas: $${context.summary.totalDebts}
            - Patrimonio Neto (Net Worth): $${context.summary.netWorth}

            Detalles:
            - Lista de Ahorros: ${JSON.stringify(context.savingsList.slice(0, 5))}
            - Lista de Deudas: ${JSON.stringify(context.debtsList.slice(0, 5))}
            - Lista de Activos: ${JSON.stringify(context.assetsList.slice(0, 5))}

            Calcula el nivel de apalancamiento (Deudas vs Activos/Ahorros) y la liquidez.
            Da consejos estratégicos reales: Ej. "Sus deudas superan el 50% de sus ahorros líquidos, prioricen pagar [Deuda más cara] antes de subir activos no líquidos".
            
            Usa ESTRICTAMENTE el siguiente esquema JSON: 
            {
                "wealthHealth": "positive" | "warning" | "danger",
                "macroAnalysis": "Un resumen crudo pero empático de 2-3 líneas sobre cómo está su relación Liquidez vs Deuda vs Patrimonio.",
                "debtStrategy": "Una recomendación clara si tienen deudas (cómo liquidarlas estratégicamente), o qué hacer si no las tienen.",
                "growthOpportunity": "Sugerencia avanzada para hacer crecer su Net Worth o invertir el ahorro inactivo."
            }
            Devuelve ÚNICAMENTE el código JSON.`;
    try {
        const result = await model.generateContent(prompt);
        return extractJson(result.response.text());
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Gemini AI API Error:", error.message);
            if (error.message.includes("429") || error.message.includes("Quota")) {
                return JSON.stringify({ error: "QUOTA_EXCEEDED" });
            }
        } else {
            console.error("Gemini AI API Error:", error);
        }
        return JSON.stringify({ error: "UNKNOWN_ERROR" });
    }
}