'use server'

import { formatDateToISOString } from "../lib/dates";

const USD_COP_DEFAULT_VALUE = 4000;

export async function convertUsdToCop(amount: number): Promise<number> {
    if (!amount) {
        return Promise.resolve(0);
    }
    const dateQueryFormatted = formatDateToISOString(new Date());
    const urlRequest = `${process.env.TRM_API as string}?vigenciadesde=${dateQueryFormatted}`;
    try {
        const responseRates = await (await fetch(urlRequest)).json();
        const rates = (await responseRates) as {valor: string}[];
        const rate = rates[0];
        return amount * parseFloat(rate?.valor || "0");
    } catch (error) {
        console.error(`Error converting USD to COP, url: ${urlRequest}`, error);
        return USD_COP_DEFAULT_VALUE * amount;
    }
}