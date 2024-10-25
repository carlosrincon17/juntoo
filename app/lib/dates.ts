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