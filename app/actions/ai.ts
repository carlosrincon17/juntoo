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
                1. Savings:${savings} COP (invested with 12% of annual interest rate in a account of easy access)
                2. Debts: ${debts} COP (100M of mortgage) and other is related with a new house we are buying
                3. Real state: ${+patrimonies} COP (2 houses, 1 car. Im living in one house and the other one is rented by $2000000 COP per month)

            currently we have a salaries of 20000000 COP per month (me) and 0 COP per month (my wife), 2000000 COP per rent (real state investment), 600000 COP per interest (bank investment) and with a outcome of 17000000 COP per month.
            All monthly savings will be added to the bank investment.
            
            Please answer the following three questions very briefly taking in account the Colombian context and that the salaries in this country, its should be for the family in Spanish:

            1. How healthy are my finances overall?
            2. What is our financial situation considering we are a young couple, aged 30 and 33 located in colombia?
            3. How healthy is my liquidity status?

            Using this JSON schema:Recipe = {'healthy': string, 'familiar_financial_status': string, 'financial_liquidity': string} Return: Recipe`;
    const result = await model.generateContent(prompt);
    return extractJson(result.response.text());
}