import { Expense } from "@/app/types/expense";
import { Chip, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from "@nextui-org/react";

export default function ExpensesTable(props: { expenses: Expense[] }) {
    const { expenses } = props;

    const columns = [
        { key: 'createdBy', label: 'Creado por' },
        { key: 'category', label: 'Categoría' },
        { key: 'value', label: 'Valor' },
        { key: 'createdAt', label: 'Creado en' },
    ];

    const rows = [...expenses];

    const renderCell = (expense:  Expense, columnKey: string) => {
        const value = getKeyValue(expense, columnKey);
        if (columnKey === 'category') {
            return (
                <div>
                    <Chip color="primary" size="sm" variant="flat">
                        {value as string}
                    </Chip>
                </div>
            );
        }
        if (columnKey === 'value') {
            return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
        }
        if (columnKey === 'createdAt') {
            return new Date(value as Date).toLocaleDateString('es-CO');
        }
        return value;
    };

    return (
        <Table color="primary" className="w-full">
            <TableHeader columns={columns}>
                {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody items={rows} >
                {(item) => (
                    <TableRow key={item.id} className="hover:bg-stone-800">
                        {(columnKey) => <TableCell className="text-gray-100">{renderCell(item, columnKey as string)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}