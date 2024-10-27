export const getTransactionTypeLabel = (transactionType: string, isPlural: boolean) => {
    if (isPlural) {
        return transactionType === 'OUTCOME' ? 'Gastos' : 'Ingresos';
    }
    return transactionType === 'OUTCOME' ? 'Gasto' : 'Ingreso';
}