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
    
    const prompt = `
            You are a modern financial advisor, I need a concise feedback on my family financial situation based on colombia context.   
            My current assets include:
                1. Savings:${savings} COP (invested with 12% of annual interest rate in a account of easy access)
                2. Debts: ${debts} COP (mortgage)
                3. Properties: ${+patrimonies + savings} COP (2 houses, 1 car. Im living in one house and the other one is rented by $2000000 COP per month)

            currently we have a salaries of 20000000 COP per month (me) and 10000000 COP per month (my wife), 2000000 COP per rent and with a outcome of 22000000 COP per month.
            
            Please answer the following three questions very briefly with very data oriented responses, its should be for the family in Spanish:

            1. How healthy are my finances overall?
            2. What is our financial situation considering we are a young couple, aged 30 and 33?
            3. How healthy is my liquidity status?

            They should fe formated  like this: "[Positive, Negative, Neutral]: [Here the explanation brief about the answer]"
            Using this JSON schema:Recipe = {'healthy': string, 'familiar_financial_status': string, 'financial_liquidity': string} Return: Array<Recipe>`;
    const result = await model.generateContent(prompt);
    return extractJson(result.response.text());
}