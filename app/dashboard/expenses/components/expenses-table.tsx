import { getAttribute } from "@/app/lib/objects";
import { Expense } from "@/app/types/expense";
import { TransactionType } from "@/utils/enums/transaction-type";
import { Tooltip, Chip, Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import {  FaTrashAlt } from "react-icons/fa";

export default function ExpensesTable(props: { 
    expenses: Expense[],
    perPage: number,
    currentPage: number,
    countExpenses: number,
    onPageChange: (page: number) => void,
    onDeleteExpense: (expense: Expense) => void
}) {
    const { expenses, onPageChange, currentPage, countExpenses, onDeleteExpense } = props;

    const columns = [
        { key: 'createdBy', label: 'Creado por' },
        { key: 'transactionType', label: 'Tipo' },
        { key: 'category', label: 'Categoría' },
        { key: 'value', label: 'Valor' },
        { key: 'createdAt', label: 'Creado en' },
        { key: 'actions', label: 'Acciones' },
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
            return new Date(expense.createdAt?.toUTCString() as string).toLocaleDateString('es-CO');
        }
        if (columnKey === 'actions') {
            return (
                <div className="flex gap-2">
                    <Tooltip content="Eliminar gasto" color="foreground" placement="top-start">
                        <span className="text-lg text-danger cursor-pointer opacity-70" onClick={() => onDeleteExpense(expense)}>
                            <FaTrashAlt />
                        </span>
                    </Tooltip>
                </div>
            );
        }
        const value = getAttribute(expense, columnKey);
        return value as string;
    };

    return (
        <div>
            <Table color="primary" className="w-full" aria-labelledby="table-expenses">
                <TableHeader columns={columns}>
                    {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                </TableHeader>
                <TableBody items={rows} >
                    {(item) => (
                        <TableRow key={item.id} className="hover:bg-gray-100">
                            {(columnKey) => <TableCell key={`${item.id}-${columnKey}`}>{renderCell(item as Expense, columnKey as string)}</TableCell>}
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