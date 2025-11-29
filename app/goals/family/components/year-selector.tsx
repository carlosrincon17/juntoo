"use client"

import { Select, SelectItem } from "@heroui/react";

interface YearSelectorProps {
    year: number;
    onChange: (year: number) => void;
}

export default function YearSelector({ year, onChange }: YearSelectorProps) {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i); // Current year +/- 2

    return (
        <Select
            label="Año"
            placeholder="Selecciona un año"
            selectedKeys={[year.toString()]}
            className="w-full md:w-64"
            onChange={(e) => onChange(Number(e.target.value))}
            disallowEmptySelection
        >
            {years.map((y) => (
                <SelectItem key={y}>
                    {y.toString()}
                </SelectItem>
            ))}
        </Select>
    );
}
