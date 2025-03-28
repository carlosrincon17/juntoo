"use client";

import type React from "react";
import { Card, CardBody, CardHeader, Progress } from "@nextui-org/react";
import { formatCurrency } from "@/app/lib/currency";


interface BudgetSimpleProps {
  totalBudget: number;
  spent: number;
}

const BudgetSimple: React.FC<BudgetSimpleProps> = ({ totalBudget = 3500, spent = 2100 }) => {

    const percentageUsed = Math.round((spent / totalBudget) * 100);

    return (
        <div className="w-full max-w-8xl mx-auto">
            <Card className="p-2 shadow-md">
                <CardHeader className="flex flex-col items-start pb-0">
                    <h2 className="text-xl font-extralight">Presupuesto Mensual</h2>
                </CardHeader>

                <CardBody>
                        
                    <div className="flex justify-between mb-1">
                        <span className="text-sm text-default-600">Gastado</span>
                        <span className="text-sm font-medium text-red-500">{formatCurrency(spent)}</span>
                    </div>
                    <Progress
                        value={percentageUsed}
                        color="danger"
                        size="sm"
                        showValueLabel={false}
                        className="max-w-md mt-1"
                    />

                    <div className="flex justify-between mb-1 mt-4">
                        <span className="text-sm text-default-600">Disponible</span>
                        <span className="text-sm font-medium text-green-500">{formatCurrency(totalBudget - spent)}</span>
                    </div>
                    <Progress
                        value={100 - percentageUsed}
                        color="success"
                        size="sm"
                        showValueLabel={false}
                        className="max-w-md mt-1"
                    />
                    <div className="p-4 bg-gray-100 mt-6 rounded-md text-sm text-default-600">
                        Tienes disponible el <span className="font-bold">{100-percentageUsed}%</span> de tu presupuesto mensual.
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default BudgetSimple;
