'use server'

import { formatDateToISOString } from "../lib/dates";

export async function convertUsdToCop(amount: number): Promise<number> {
    const dateQueryFormatted = formatDateToISOString(new Date());
    const urlRequest = `${process.env.TRM_API as string}?vigenciadesde=${dateQueryFormatted}`;
    const responseRates = await (await fetch(urlRequest)).json();
    const rates = (await responseRates) as {valor: string}[];
    const rate = rates[0];
    return amount * parseFloat(rate.valor);
}