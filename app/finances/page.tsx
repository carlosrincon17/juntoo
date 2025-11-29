'use client';

import FinancialSummary from "./components/financial-summary";
import FloatingManageButton from "./components/floating-manage-buttons";
import TransactionsSummary from "./components/transactions-summary";
import MonthYearPicker from "./components/month-year-picker";
import { Button } from "@heroui/react";
import { FaCalendarAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { getCountExpensesByFilter } from "../actions/expenses";
import { getExpensesFilterByDate } from "../lib/dates";
import { CustomLoading } from "../components/customLoading";

export default function Page() {
    const [date, setDate] = useState<Date>(new Date());
    const [showFilter, setShowFilter] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasData, setHasData] = useState(false);

    useEffect(() => {
        const checkData = async () => {
            setIsLoading(true);
            const filter = getExpensesFilterByDate(date);
            const count = await getCountExpensesByFilter(filter);
            setHasData(count > 0);
            setIsLoading(false);
        };
        checkData();
    }, [date]);

    return (
        <div>
            <FloatingManageButton />
            <div className="w-full max-w-8xl mx-auto space-y-6">
                <div className="flex justify-end w-full">
                    {showFilter ? (
                        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300 w-full sm:w-auto">
                            <MonthYearPicker date={date} onChange={setDate} />
                            <Button
                                isIconOnly
                                variant="light"
                                className="text-gray-500 hover:text-gray-700"
                                aria-label="Cerrar filtro"
                                onPress={() => setShowFilter(false)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </Button>
                        </div>
                    ) : (
                        <Button
                            variant="flat"
                            color="primary"
                            startContent={<FaCalendarAlt />}
                            onPress={() => setShowFilter(true)}
                            className="bg-white shadow-sm capitalize"
                        >
                            {date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                        </Button>
                    )}
                </div>

                {isLoading ? (
                    <CustomLoading />
                ) : !hasData ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-6">
                        <div className="text-center space-y-2">
                            <h3 className="text-xl font-medium text-gray-900">¡Upps! Aún no tienes movimientos para este mes</h3>
                            <p className="text-gray-500">Parece que este mes está muy tranquilo... ¿Por qué no añades algunos gastos o ingresos?</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <FinancialSummary date={date} />
                        <TransactionsSummary date={date} />
                    </>
                )}
            </div>
        </div>
    )
}