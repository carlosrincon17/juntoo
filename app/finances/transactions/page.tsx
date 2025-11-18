'use client'

import { CustomLoading } from "@/app/components/customLoading";
import { useEffect, useState } from "react";
import { Expense } from "@/app/types/expense";
import { getCountExpensesByFilter, getExpensesByFilter } from "@/app/actions/expenses";
import { getParentCategories } from "@/app/actions/categories";
import { ExpensesFilters } from "@/app/types/filters";
import { TransactionType } from "@/utils/enums/transaction-type";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Pagination,
    Select,
    SelectItem,
    DateRangePicker,
    Card,
    CardBody
} from "@heroui/react";
import { getLocalTimeZone, today, CalendarDate } from "@internationalized/date";
import { RangeValue } from "@react-types/shared";
import { DateValue } from "@react-types/datepicker";

const ITEMS_PER_PAGE = 20;

export default function TransactionsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [page, setPage] = useState(1);
    const [parentCategories, setParentCategories] = useState<string[]>([]);

    const [transactionType, setTransactionType] = useState<string>("");
    const [parentCategory, setParentCategory] = useState<string>("");

    const defaultEnd = today(getLocalTimeZone());
    const defaultStart = new CalendarDate(defaultEnd.year, defaultEnd.month, 1);
    const [dateRange, setDateRange] = useState<RangeValue<DateValue>>({
        start: defaultStart,
        end: defaultEnd
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categories = await getParentCategories();
                setParentCategories(categories.filter((c): c is string => c !== null));
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const startDate = dateRange.start.toDate(getLocalTimeZone());
                const endDate = dateRange.end.toDate(getLocalTimeZone());

                endDate.setHours(23, 59, 59, 999);

                const filters: ExpensesFilters = {
                    startDate,
                    endDate,
                    transactionType: transactionType || undefined,
                    parentCategory: parentCategory || undefined
                };
                const [data, count] = await Promise.all([
                    getExpensesByFilter(page, ITEMS_PER_PAGE, filters),
                    getCountExpensesByFilter(filters)
                ]);

                setExpenses(data);
                setTotalExpenses(count);
            } catch (error) {
                console.error("Failed to fetch transactions", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [page, transactionType, parentCategory, dateRange]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const formatDate = (dateStr?: Date | string) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('es-CO', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            timeZone: 'UTC'
        }).format(date);
    };

    const totalPages = Math.ceil(totalExpenses / ITEMS_PER_PAGE);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Transacciones</h1>

                <Card className="w-full shadow-md">
                    <CardBody className="flex flex-col md:flex-row gap-4">
                        <Select
                            label="Tipo de Transacción"
                            placeholder="Todos"
                            className="max-w-xs"
                            selectedKeys={transactionType ? [transactionType] : []}
                            onChange={(e) => {
                                setTransactionType(e.target.value);
                                setPage(1);
                            }}
                        >
                            <SelectItem key="">
                                Todos
                            </SelectItem>
                            <SelectItem key={TransactionType.Income}>
                                Ingresos
                            </SelectItem>
                            <SelectItem key={TransactionType.Outcome}>
                                Gastos
                            </SelectItem>
                        </Select>

                        <Select
                            label="Categoría Principal"
                            placeholder="Todas"
                            className="max-w-xs"
                            selectedKeys={parentCategory ? [parentCategory] : []}
                            onChange={(e) => {
                                setParentCategory(e.target.value);
                                setPage(1);
                            }}
                        >
                            {["", ...parentCategories].map((category) => (
                                <SelectItem key={category} textValue={category === "" ? "Todas" : category}>
                                    {category === "" ? "Todas" : category}
                                </SelectItem>
                            ))}
                        </Select>

                        <DateRangePicker
                            label="Rango de Fechas"
                            value={dateRange}
                            onChange={(value) => {
                                if (value) {
                                    setDateRange(value);
                                    setPage(1);
                                }
                            }}
                            className="max-w-xs"
                        />
                    </CardBody>
                </Card>
            </div>

            {isLoading ? (
                <div className="h-[400px]">
                    <CustomLoading text="Cargando transacciones..." />
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    <Table aria-label="Tabla de transacciones" className="w-full p-l-2">
                        <TableHeader>
                            <TableColumn className="min-w-[150px]">Fecha</TableColumn>
                            <TableColumn className="min-w-[150px]">Tipo</TableColumn>
                            <TableColumn className="min-w-[150px]">Categoria</TableColumn>
                            <TableColumn className="min-w-[150px]">Categoria Padre</TableColumn>
                            <TableColumn className="min-w-[150px]">Valor</TableColumn>
                        </TableHeader>
                        <TableBody emptyContent={"No se encontraron transacciones."}>
                            {expenses.map((expense) => (
                                <TableRow key={expense.id}>
                                    <TableCell>{formatDate(expense.createdAt)}</TableCell>
                                    <TableCell>
                                        <span className={expense.transactionType === TransactionType.Income ? "text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs" : "text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs"}>
                                            {expense.transactionType === TransactionType.Income ? "Ingreso" : "Gasto"}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span>{expense.category?.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{expense.category?.parent}</TableCell>
                                    <TableCell>
                                        <span className={expense.transactionType === TransactionType.Income ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                                            {expense.transactionType === TransactionType.Income ? "+" : "-"} {formatCurrency(expense.value || 0)}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {totalPages > 1 && (
                        <div className="flex justify-center">
                            <Pagination
                                total={totalPages}
                                page={page}
                                onChange={setPage}
                                showControls
                                color="primary"
                                className=""
                            />
                        </div>
                    )}
                </div>)}
        </div >
    );
}
