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