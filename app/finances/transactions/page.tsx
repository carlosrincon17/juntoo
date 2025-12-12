'use client'

import { CustomLoading } from "@/app/components/customLoading";
import { useEffect, useState, ChangeEvent, Key } from "react";
import { Expense, TransactionsSummaryMetrics, GroupedCategoryExpense } from "@/app/types/expense";
import { getCountExpensesByFilter, getExpensesByFilter, removeExpense, getTransactionsSummary, getExpensesGroupedByCategory } from "@/app/actions/expenses";
import { getParentCategories } from "@/app/actions/categories";
import { ExpensesFilters } from "@/app/types/filters";
import { TransactionType } from "@/utils/enums/transaction-type";
import {
    Pagination,
    Select,
    SelectItem,
    DateRangePicker,
    Card,
    CardBody,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    useDisclosure,
    addToast,
    Switch
} from "@heroui/react";
import { getLocalTimeZone, today, CalendarDate, DateValue } from "@internationalized/date";
import type { RangeValue } from "@react-types/shared";
import { formatCurrency } from "@/app/lib/currency";
import { formateSimpleDate } from "@/app/lib/dates";
import { FaAngleDoubleDown, FaAngleDoubleUp, FaCheck, FaTimesCircle } from "react-icons/fa";
import ConfirmModal from "@/app/components/confirmModal";
import TransactionsSummaryCard from "@/app/finances/components/transactions-summary-card";
import TransactionsGroupedList from "@/app/finances/components/transactions-grouped-list";
import TransactionsTimelineList from "@/app/finances/components/transactions-timeline-list";
import { FaListUl, FaStream } from "react-icons/fa";


const ITEMS_PER_PAGE = 20;

export default function TransactionsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [groupedExpenses, setGroupedExpenses] = useState<GroupedCategoryExpense[]>([]);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [page, setPage] = useState(1);
    const [parentCategories, setParentCategories] = useState<string[]>([]);
    const [summaryMetrics, setSummaryMetrics] = useState<TransactionsSummaryMetrics>({
        count: 0,
        total: 0,
        topCategory: "",
        topCategoryCount: 0,
        topCategoryTotal: 0
    });

    const [transactionType, setTransactionType] = useState<string>(TransactionType.Outcome);
    const [parentCategory, setParentCategory] = useState<string>("");
    const [isGrouped, setIsGrouped] = useState(false);
    const [viewMode, setViewMode] = useState<'list' | 'timeline'>('timeline');

    const defaultEnd = today(getLocalTimeZone());
    const defaultStart = new CalendarDate(defaultEnd.year, defaultEnd.month, 1);
    const [dateRange, setDateRange] = useState<RangeValue<DateValue>>({
        start: defaultStart,
        end: defaultEnd
    });

    const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onOpenChange: onDeleteModalChange } = useDisclosure();
    const [selectedTransaction, setSelectedTransaction] = useState<Expense | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categories = await getParentCategories(transactionType);
                setParentCategories(categories.filter((c): c is string => c !== null));
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        };
        fetchCategories();
    }, [transactionType]);

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

            const promises: Promise<number | TransactionsSummaryMetrics | GroupedCategoryExpense[] | Expense[]>[] = [
                getCountExpensesByFilter(filters),
                getTransactionsSummary(filters)
            ];

            if (isGrouped) {
                promises.push(getExpensesGroupedByCategory(filters));
            } else {
                promises.push(getExpensesByFilter(page, ITEMS_PER_PAGE, filters));
            }

            const results = await Promise.all(promises);
            const count = results[0] as number;
            const summary = results[1] as TransactionsSummaryMetrics;

            if (isGrouped) {
                setGroupedExpenses(results[2] as GroupedCategoryExpense[]);
            } else {
                setExpenses(results[2] as Expense[]);
            }

            setTotalExpenses(count);
            setSummaryMetrics(summary);
        } catch (error) {
            console.error("Failed to fetch transactions", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, transactionType, parentCategory, dateRange, isGrouped]);

    const executeTransactionAction = async (action: Key, transaction: Expense) => {
        if (action === 'delete') {
            setSelectedTransaction(transaction);
            onDeleteModalOpen();
        }
    };

    const onConfirmDeleteTransaction = async (onClose: () => void) => {
        if (selectedTransaction) {
            await removeExpense(selectedTransaction);
            // Refresh data after deletion to ensure correct pagination and totals
            await fetchData();
            addToast({
                title: 'Transacción eliminada',
                description: 'La transacción ha sido eliminada correctamente.',
                icon: <FaCheck size={24} />,
            })
            setSelectedTransaction(null);
            onClose();
        }
    }


    const totalPages = Math.ceil(totalExpenses / ITEMS_PER_PAGE);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <Card className="w-full shadow-md">
                    <CardBody className="flex flex-col md:flex-row gap-4 items-center">
                        <Select
                            label="Tipo de Transacción"
                            placeholder="Todos"
                            className="md:max-w-xs"
                            selectedKeys={transactionType ? [transactionType] : []}
                            onChange={(e) => {
                                setTransactionType(e.target.value);
                                setParentCategory("");
                                setPage(1);
                            }}
                            disallowEmptySelection
                        >
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
                            className="md:max-w-xs"
                            selectedKeys={parentCategory ? [parentCategory] : []}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
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
                                    setDateRange(value as RangeValue<DateValue>);
                                    setPage(1);
                                }
                            }}
                            className="md:max-w-xs"
                        />

                        <div className="flex items-center gap-4 ml-auto">
                            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                                    title="Vista de lista"
                                >
                                    <FaListUl />
                                </button>
                                <button
                                    onClick={() => setViewMode('timeline')}
                                    className={`p-2 rounded-md transition-all ${viewMode === 'timeline' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                                    title="Vista de línea de tiempo"
                                >
                                    <FaStream />
                                </button>
                            </div>
                            <div className="flex items-center gap-2 border-l pl-4 border-gray-200">
                                <span className="text-sm text-gray-600">Agrupar</span>
                                <Switch isSelected={isGrouped} onValueChange={setIsGrouped} size="sm" />
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <TransactionsSummaryCard metrics={summaryMetrics} />
            </div>

            {isLoading ? (
                <div className="h-[400px]">
                    <CustomLoading text="Cargando transacciones..." />
                </div>
            ) : (
                <>
                    {isGrouped ? (
                        <TransactionsGroupedList
                            data={groupedExpenses}
                            filters={{
                                startDate: dateRange.start.toDate(getLocalTimeZone()),
                                endDate: dateRange.end.toDate(getLocalTimeZone()),
                                transactionType: transactionType || undefined,
                                parentCategory: parentCategory || undefined
                            }}
                        />
                    ) : viewMode === 'timeline' ? (
                        <TransactionsTimelineList data={expenses} />
                    ) : (
                        <Card className="shadow-md flex flex-col gap-4">
                            <CardBody className="space-y-2 relative mt-3">
                                {expenses.length === 0 ? (
                                    <div className="text-center py-10 text-gray-500">
                                        No se encontraron transacciones.
                                    </div>
                                ) : (
                                    expenses.map((transaction) => (
                                        <Dropdown
                                            key={transaction.id}
                                        >
                                            <DropdownTrigger className="w-full">
                                                <div
                                                    key={transaction.id}
                                                    className="group flex items-center justify-between p-2 rounded-xl bg-gradient-to-r from-white to-[#f9faff] border border-[#f0f4ff] hover:shadow-md hover:border-[#e4e9ff] transition-all duration-200 cursor-pointer"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${transaction.transactionType === TransactionType.Income ? 'from-[#2dd4bf] to-[#34d399]' : 'from-[#f97066] to-[#fb7185]'} flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110`}>
                                                            {
                                                                transaction.transactionType === TransactionType.Income ?
                                                                    <FaAngleDoubleUp className="h-3 w-3 text-white" /> :
                                                                    <FaAngleDoubleDown className="h-3 w-3 text-white" />
                                                            }
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <h5 className="text-sm font-medium text-[#121432]">{transaction.category?.name}</h5>
                                                            </div>
                                                            <div className="flex items-center gap-3 mt-0.5">
                                                                <span className="text-xs font-light text-[#121432]/60">{formateSimpleDate(transaction.createdAt as Date)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end">
                                                        <span
                                                            className={`text-base font-medium ${transaction.transactionType === TransactionType.Income
                                                                ? 'bg-gradient-to-r from-[#2dd4bf] to-[#34d399] bg-clip-text text-transparent'
                                                                : 'bg-gradient-to-r from-[#f97066] to-[#fb7185] bg-clip-text text-transparent'
                                                                }`}
                                                        >
                                                            {transaction.transactionType === TransactionType.Income ? '+' : '-'} {formatCurrency(transaction.value || 0)}
                                                        </span>
                                                        <div
                                                            className="text-[10px] font-light text-white px-2 py-0.5 rounded-full bg-[#121432]/70"
                                                        >
                                                            {transaction.category?.parent}
                                                        </div>
                                                    </div>
                                                </div>
                                            </DropdownTrigger>
                                            <DropdownMenu aria-label="Transaction options" className="w-full" onAction={(action) => { executeTransactionAction(action, transaction) }}>
                                                <DropdownItem
                                                    key="delete"
                                                    startContent={<FaTimesCircle className="text-danger" />}
                                                >
                                                    Eliminar movimiento
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                    ))
                                )}
                            </CardBody>

                            {totalPages > 1 && (
                                <div className="flex justify-center mt-4">
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
                        </Card>
                    )}
                </>
            )}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onOpenChange={onDeleteModalChange}
                title="Eliminar transacción"
                message="¿Estás seguro de que quieres eliminar esta transacción?"
                onConfirm={onConfirmDeleteTransaction}
            />
        </div>
    );
}
