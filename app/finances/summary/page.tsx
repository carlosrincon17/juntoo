"use client"

import FinancialOverview from "./components/financial-overview";
import TransactionsSummaryCard from "./components/transaction-summary";
import YearlyReports from "./components/anual_reports";
import { useState } from "react";
import { Select, SelectItem } from "@heroui/react";


export default function Page() {
    const currentYear = new Date().getFullYear();
    const [year, setYear] = useState(currentYear);

    // Generate last 5 years
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

    return (
        <div className="w-full max-w-8xl mx-auto space-y-6">
            <div className="flex justify-end">
                <Select
                    label="Año"
                    className="max-w-xs w-32"
                    defaultSelectedKeys={[String(currentYear)]}
                    onChange={(e) => setYear(Number(e.target.value))}
                    disallowEmptySelection
                >
                    {years.map((y) => (
                        <SelectItem key={y}>
                            {String(y)}
                        </SelectItem>
                    ))}
                </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                <div className="gap-4 w-full col-span-1 max-h-full">
                    <TransactionsSummaryCard />
                </div>
                <div className="col-span-1 md:col-span-2">
                    <FinancialOverview year={year} />
                </div>
            </div>
            <div className="mx-auto w-full">
                <YearlyReports year={year} />
            </div>
        </div>

    )
}