import { getAttribute } from "@/app/lib/objects";
import { Expense } from "@/app/types/expense";
import { TransactionType } from "@/utils/enums/transaction-type";
import { Chip, Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";

export default function ExpensesTable(props: { 
    expenses: Expense[],
    perPage: number,
    currentPage: number,
    countExpenses: number,
    onPageChange: (page: number) => void
}) {
    const { expenses, onPageChange, currentPage, countExpenses } = props;

    const columns = [
        { key: 'createdBy', label: 'Creado por' },
        { key: 'transactionType', label: 'Tipo' },
        { key: 'category', label: 'Categoría' },
        { key: 'value', label: 'Valor' },
        { key: 'createdAt', label: 'Creado en' },
    ];

    const rows = [...expenses];

    const renderCell = (expense: Expense, columnKey: string) => {
        if (columnKey === 'category') {
            return (
                <div>
                    <Chip color="primary" size="sm" variant="flat">
                        {expense.category?.name}
                    </Chip>
                </div>
            );
        }
        if(columnKey === 'transactionType') {
            const color = expense.transactionType === TransactionType.Income ? 'success' : 'danger';
            const expenseType = expense.transactionType === TransactionType.Income ? 'Ingreso' : 'Gasto';
            return (
                <div>
                    <Chip color={color} size="sm" variant="flat">
                        <span > { expenseType}</span>
                    </Chip>
                </div>
            );
        }
        if (columnKey === 'value') {
            return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(expense.value || 0);
        }
        if (columnKey === 'createdAt') {
            return new Date(expense.createdAt as Date).toLocaleDateString('es-CO');
        }
        const value = getAttribute(expense, columnKey);
        return value as string;
    };

    return (
        <div>
            <Table color="primary" className="w-full">
                <TableHeader columns={columns}>
                    {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                </TableHeader>
                <TableBody items={rows} >
                    {(item) => (
                        <TableRow key={item.id} className="hover:bg-gray-100">
                            {(columnKey) => <TableCell>{renderCell(item as Expense, columnKey as string)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <div className="flex justify-center mt-6">
                <Pagination
                    color="primary"
                    isCompact
                    total={countExpenses}
                    page={currentPage} 
                    size='sm'
                    onChange={(page) => onPageChange(page)} 
                />
            </div>
        </div>
        
    );
}