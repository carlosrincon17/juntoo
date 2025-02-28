export type DateRange = {
    startDate: Date;
    endDate: Date;
}

export const getDefaultDateRange = () => {
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    return { startDate, endDate };
}

export const addDaysToCurrentDate = (days = 1) => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + days);
    return currentDate;
}

export const formatDateToISOString = (date: Date): string => {
    const formatter = new Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    let formattedDate = formatter.format(date).split('/').reverse().join('-');
    formattedDate += 'T00:00:00.000';
    return formattedDate
}

export const getUTCDate = (date: Date) => {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0));
}

export const formateSimpleDate = (date: Date): string => {
    const fixedDate = date.toISOString().split("T")[0]; // "2025-03-01"
    const [year, month, day] = fixedDate.split("-").map(Number);
    const correctDate = new Date(year, month - 1, day);
    return Intl.DateTimeFormat('es-CO', { dateStyle: 'long', timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }).format(correctDate);
}