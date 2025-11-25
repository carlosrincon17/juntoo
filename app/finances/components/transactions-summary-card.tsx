import { Card, CardBody, Chip } from "@heroui/react";
import { TransactionsSummaryMetrics } from "@/app/types/expense";
import { formatCurrency } from "@/app/lib/currency";

interface TransactionsSummaryCardProps {
    metrics: TransactionsSummaryMetrics;
}

export default function TransactionsSummaryCard({ metrics }: TransactionsSummaryCardProps) {
    return (
        <Card className="w-full shadow-md bg-gradient-to-r from-[#8b5cf6] via-[#9333ea] to-[#a78bfa] text-white">
            <CardBody className="p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-16 -translate-x-16"></div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
                    <div className="flex flex-col">
                        <span className="text-sm font-light text-white/80">Nro de movimientos</span>
                        <span className="text-2xl font-semibold">{metrics.count}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-light text-white/80">Total</span>
                        <span className="text-2xl font-semibold">{formatCurrency(metrics.total)}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-light text-white/80">Categoría con más gastos</span>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-semibold truncate">{metrics.topCategory}</span>
                            {metrics.topCategory !== "N/A" && (
                                <Chip size="sm" variant="flat" className="bg-white/20 text-white">
                                    {metrics.topCategoryCount}
                                </Chip>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-light text-white/80">Total Categoría</span>
                        <span className="text-2xl font-semibold">
                            {metrics.topCategory !== "N/A" ? formatCurrency(metrics.topCategoryTotal) : formatCurrency(0)}
                        </span>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
