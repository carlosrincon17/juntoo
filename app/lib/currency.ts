
export const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
}

export const currencyToInteger = (value: string) => {
    const numberValue = value.replace(/\D/g, '') || '0';
    return parseInt(numberValue, 10) ;
}