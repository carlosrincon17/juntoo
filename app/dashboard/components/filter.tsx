'use client'

import { Select, SelectItem } from '@nextui-org/react';
import React from 'react'


export default function ExpenseFilter() {
    const years = [{  label: '2024', value: 2024 }];
    const months = [
        { label: 'Enero', value: 1 },
        { label: 'Febrero', value: 2 },
        { label: 'Marzo', value: 3 },
        { label: 'Abril', value: 4 },
        { label: 'Mayo', value: 5 },
        { label: 'Junio', value: 6 },
        { label: 'Julio', value: 7 },
        { label: 'Agosto', value: 8 },
        { label: 'Septiembre', value: 9 },
        { label: 'Octubre', value: 10 },
        { label: 'Noviembre', value: 11 },
        { label: 'Diciembre', value: 12 }
    ];

    return (
        <div className="w-full mb-16 flex justify-center gap-4">
            <Select
                size='md'
                items={years}
                label="Year"
                className='max-w-xs text-green-100'


            >
                {(year) => <SelectItem key={year.value} value={year.value}>{year.label}</SelectItem>}
            </Select>
            <Select
                size='md'
                items={months}
                label="Month"
                className='max-w-xs'
            >
                {(month) => <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>}
            </Select>
        </div>
    )
}