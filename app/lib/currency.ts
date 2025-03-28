
export const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
}

export const currencyToInteger = (value: string) => {
    const numberValue = value.replace(/\D/g, '') || '0';
    return parseInt(numberValue, 10) ;
}

export const formatToShortCurrency = (value: number) => {
    return (value / 1_000_000).toFixed(value < 10_000_000 ? 1 : 0) + 'M';
}