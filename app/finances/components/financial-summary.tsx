import { Card, CardBody, CardFooter, CardHeader, Divider } from "@nextui-org/react";
import { VariationIndicator } from "./variation-indicator";
import { formatCurrency } from "@/app/lib/currency";
import { FinancialMetrics } from "@/app/types/financial";
import { User } from "@/app/types/user";

export default function FinancialSummary({ financialMetrics, user }: { financialMetrics: FinancialMetrics, user: User }) {
    return (
        <Card className="p-2 w-full shadow-md">
            <CardHeader className="space-y-2 block">
                <h1 className="text-xl font-extralight">Hola {user?.name},</h1> 
                <div className="flex flex-col">
                    <p className="text-xs text-default-500">
                    Tu resumen financiero familiar de este mes comparado con el promedio de meses anteriores. Así es cómo van tus finanzas! 
                    </p>
                </div>
            </CardHeader>
            <CardBody className="py-2">
                <div className="grid grid-cols-1 gap-4">
                    <div className="flex flex-col gap-1">
                        <span className="text-sm text-default-600">Gastos</span>
                        <span className="text-xl font-bold text-danger">{formatCurrency(financialMetrics?.expenses.total || 0)}</span>
                        <div className="flex items-center">
                            <VariationIndicator value={financialMetrics?.expenses.variationPercentage || 0}  />
                            <span className="text-xs ml-1 text-default-500">vs. meses anteriores</span>
                        </div>
                    </div>
                    <Divider />
                    <div className="flex flex-col gap-1">
                        <span className="text-sm text-default-600">Ingresos</span>
                        <span className="text-xl font-bold text-success">{formatCurrency(financialMetrics?.investmentIncome.total || 0)}</span>
                        <div className="flex items-center">
                            <VariationIndicator value={financialMetrics?.investmentIncome.variationPercentage || 0} />
                            <span className="text-xs ml-1 text-default-500">vs. meses anteriores</span>
                        </div>
                    </div>
                </div>
            </CardBody>
            <CardFooter className="pt-0 mt-4">
                <div className="w-full flex justify-between items-center">
                    <span className="text-xl font-light">Balance</span>
                    <span className="text-xl font-bold text-primary">{formatCurrency((financialMetrics?.investmentIncome.total || 0) - (financialMetrics?.expenses.total || 0))}</span>
                </div>
            </CardFooter>
        </Card>
    )
}