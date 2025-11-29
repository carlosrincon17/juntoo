'use client'

import { Select, SelectItem, SharedSelection } from "@heroui/react";

interface MonthYearPickerProps {
    date: Date;
    onChange: (date: Date) => void;
}

export default function MonthYearPicker({ date, onChange }: MonthYearPickerProps) {

    const years = [
        { label: '2023', key: 2023 },
        { label: '2024', key: 2024 },
        { label: '2025', key: 2025 },
        { label: '2026', key: 2026 }
    ];

    const months = [
        { label: 'Enero', key: 0 },
        { label: 'Febrero', key: 1 },
        { label: 'Marzo', key: 2 },
        { label: 'Abril', key: 3 },
        { label: 'Mayo', key: 4 },
        { label: 'Junio', key: 5 },
        { label: 'Julio', key: 6 },
        { label: 'Agosto', key: 7 },
        { label: 'Septiembre', key: 8 },
        { label: 'Octubre', key: 9 },
        { label: 'Noviembre', key: 10 },
        { label: 'Diciembre', key: 11 }
    ];

    const selectedYear = date.getFullYear();
    const selectedMonth = date.getMonth();

    const handleYearChange = (keys: SharedSelection) => {
        const year = Number(keys.currentKey);
        const newDate = new Date(date);
        newDate.setFullYear(year);

        const now = new Date();
        let updatedDate: Date;

        if (year === now.getFullYear() && selectedMonth === now.getMonth()) {
            updatedDate = new Date();
        } else {
            updatedDate = new Date(year, selectedMonth + 1, 0);
        }

        onChange(updatedDate);
    };

    const handleMonthChange = (keys: SharedSelection) => {
        const month = Number(keys.currentKey);

        const now = new Date();
        let updatedDate: Date;

        if (selectedYear === now.getFullYear() && month === now.getMonth()) {
            updatedDate = new Date();
        } else {
            updatedDate = new Date(selectedYear, month + 1, 0);
        }

        onChange(updatedDate);
    };

    return (
        <div className="flex flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            <Select
                label="Año"
                selectedKeys={[selectedYear.toString()]}
                className="w-full sm:w-40"
                size="lg"
                onSelectionChange={handleYearChange}
                disallowEmptySelection
                aria-label="Seleccionar año"
            >
                {years.map((year) => (
                    <SelectItem key={year.key} textValue={year.label}>
                        {year.label}
                    </SelectItem>
                ))}
            </Select>
            <Select
                label="Mes"
                selectedKeys={[selectedMonth.toString()]}
                className="w-full sm:w-56"
                size="lg"
                onSelectionChange={handleMonthChange}
                disallowEmptySelection
                aria-label="Seleccionar mes"
            >
                {months.map((month) => (
                    <SelectItem key={month.key} textValue={month.label}>
                        {month.label}
                    </SelectItem>
                ))}
            </Select>
        </div>
    );
}
