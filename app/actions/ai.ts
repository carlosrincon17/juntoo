'use server'

import { GoogleGenerativeAI } from '@google/generative-ai';

function extractJson(textResponse: string): string {
    const pattern = /\{[^{}]*\}/;
    const match = textResponse.match(pattern);
    return match ? match[0] : '{}';
}

export async function generateFeedback(savings: number, debts: number, patrimonies: number): Promise<string> {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });
    const prompt = `
            You are a modern financial advisor, I need a concise feedback on my family financial situation based on colombia context.   
            My current assets include: 
            ---- ${debts} ----- ${patrimonies}
            Investments: 
                 - CDTS: ${savings} COP (invested with 12% of annual interest rate in a account of easy access) it should represent 600000 COP of monthly incomes
                 - Real state: A house of 390000000 with a mortgage of 80000000 (8.9% of annual interest rate)

            Patrimonies:
                 - A house of 390000000 COP in rent, the familiar house of 300000000 COP and the savings

            Monthly Incomes:
                - Salary 20000000 COP
                - Rent of a house 2000000 COP
                - Interest of CDT investment 600000 COP

            Please give me a short feedback and a short tip based in the described finances, it should be very briefly (one or two phrases) taking in account the Colombian context and that the salaries in this country, its should be for the family in Spanish:

            Using this JSON schema:Recipe = {'feedback': string, 'tips': string} Return: Recipe`;
    const result = await model.generateContent(prompt);
    return extractJson(result.response.text());
}