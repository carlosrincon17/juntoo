'use client'

import { Select, SelectItem, SharedSelection } from '@nextui-org/react';
import React, { useEffect, useState } from 'react'


export default function ExpenseFilter(props: { onChange: (year: number, month: number) => void }) {
    
    const { onChange } = props;

    const years = [{  label: '2024', key: 2024 }];
    const months = [
        { label: 'Enero', key: 1 },
        { label: 'Febrero', key: 2 },
        { label: 'Marzo', key: 3 },
        { label: 'Abril', key: 4 },
        { label: 'Mayo', key: 5 },
        { label: 'Junio', key: 6 },
        { label: 'Julio', key: 7 },
        { label: 'Agosto', key: 8 },
        { label: 'Septiembre', key: 9 },
        { label: 'Octubre', key: 10 },
        { label: 'Noviembre', key: 11 },
        { label: 'Diciembre', key: 12 }
    ];

    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

    const handleYearChange = (year: SharedSelection) => {
        setSelectedYear(parseInt(year.currentKey as string, 10));
        onChange(selectedYear, selectedMonth);
    }

    const handleMonthChange = (month: SharedSelection) => {
        const newSelectedMonth = parseInt(month.currentKey as string, 10);
        setSelectedMonth(newSelectedMonth);
        onChange(selectedYear, newSelectedMonth);
    }

    useEffect(() => { 
        onChange(selectedYear, selectedMonth);
    }, []);

    return (
        <div className="w-full mb-8 flex justify-center gap-4">
            <Select
                size='md'
                label="Año"
                selectedKeys={[selectedYear.toString()]}
                className='max-w-xs text-green-100'
                disallowEmptySelection
                onSelectionChange={handleYearChange}
            >
                {years.map((year) => (
                    <SelectItem key={year.key}>
                        {year.label}
                    </SelectItem>
                ))}
            </Select>
            <Select
                size='md'
                label="Mes"
                selectedKeys={[selectedMonth.toString()]}
                className='max-w-xs'
                disallowEmptySelection
                onSelectionChange={handleMonthChange}
            >
                {months.map((month) => (
                    <SelectItem key={month.key}>
                        {month.label}
                    </SelectItem>
                ))}
            </Select>
        </div>
    )
}