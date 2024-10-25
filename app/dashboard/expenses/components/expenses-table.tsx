import { getAttribute } from "@/app/lib/objects";
import { Expense } from "@/app/types/expense";
import { Chip, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";

export default function ExpensesTable(props: { expenses: Expense[] }) {
    const { expenses } = props;

    const columns = [
        { key: 'createdBy', label: 'Creado por' },
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
        <Table color="primary" className="w-full">
            <TableHeader columns={columns}>
                {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody items={rows} >
                {(item) => (
                    <TableRow key={item.id} className="hover:bg-stone-800">
                        {(columnKey) => <TableCell className="text-gray-100">{renderCell(item as Expense, columnKey as string)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}