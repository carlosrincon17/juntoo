'use server'

import { GoogleGenerativeAI } from '@google/generative-ai';

function extractJson(textResponse: string): string {
    const pattern = /\{[^{}]*\}/;
    const match = textResponse.match(pattern);
    return match ? match[0] : '{}';
}

export async function generateFeedback(savings: number, debts: number, patrimonies: number): Promise<string> {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `I need a short feedback about my familiar financial situation. I have ${savings} COP savings, 
            ${debts} COP debts and ${patrimonies} COP patrimonies. (Take in account savings should be added to patrimonies)

            Please give me a very very short feedback with numbers and percentages about the following three questions en español:

            1. Que tan saludable es son mis finanzas en general con respecto al patromonio vs deuda?
            2. Cual es mi situación financiera teniendo en cuenta que somos una pareja joven de 30 y33 años en el contexto colombiano?
            3. Que tan saludable el estado de mi liquedez, teniendo en cuenta que lo unico liquido con los ahorros?
            using this JSON schema:Recipe = {'healthy': string, 'familiar_financial_status': string, 'financial_liquidity': string} Return: Array<Recipe>`;
    const result = await model.generateContent(prompt);
    return extractJson(result.response.text());
}