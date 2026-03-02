import { formatCurrency } from "@/app/lib/currency"
import { Button, Card } from "@heroui/react"
import { FaPencilAlt, FaTrashAlt, FaChartLine, FaBullseye } from "react-icons/fa"

interface AccountCardProps {
    name: string
    value: number
    onEdit: () => void
    onDelete: () => void
    gradient: string
    textColor: string
    owner?: string
    goalName?: string
    isInvestment?: boolean
    annualInterestRate?: number | null
    currency?: string
    copValue?: number | null
    trmValue?: number | null
}

export default function AccountCard({
    name,
    value,
    onEdit,
    onDelete,
    gradient,
    owner,
    goalName,
    isInvestment,
    annualInterestRate,
    currency,
    copValue,
    trmValue,
}: AccountCardProps) {
    const isUsd = currency === 'USD'
    return (
        <Card className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl bg-white h-full group relative">
            {/* Subtle gradient accent at the top */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${gradient}`}></div>

            <div className="p-5 h-full flex flex-col pt-6 relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-medium text-sm text-gray-500 mb-1">{name}</h3>
                        <p className="text-2xl font-semibold text-gray-900 tracking-tight">
                            {isUsd ? `$${value.toLocaleString('en-US')} USD` : formatCurrency(value)}
                        </p>
                        {isUsd && copValue != null && (
                            <p className="text-xs font-medium mt-1 text-gray-400">
                                ≈ {formatCurrency(copValue)} COP
                                {trmValue != null && (
                                    <span className="ml-1 font-light opacity-80">(TRM {trmValue.toLocaleString('es-CO', { maximumFractionDigits: 0 })})</span>
                                )}
                            </p>
                        )}
                    </div>
                    <div className="px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100 flex items-center gap-1 text-gray-600">
                        <span className="text-xs font-medium">{owner}</span>
                    </div>
                </div>

                <div className="space-y-2.5 mb-5 mt-2">
                    {goalName && (
                        <div className="flex items-center gap-2 text-gray-500">
                            <div className="p-1.5 bg-blue-50 text-blue-500 rounded-md">
                                <FaBullseye className="w-3 h-3" />
                            </div>
                            <span className="text-xs font-medium truncate">Meta: {goalName}</span>
                        </div>
                    )}

                    {isInvestment && (
                        <div className="flex items-center gap-2 text-gray-500">
                            <div className="p-1.5 bg-emerald-50 text-emerald-500 rounded-md">
                                <FaChartLine className="w-3 h-3" />
                            </div>
                            <span className="text-xs font-medium">
                                Inversión {annualInterestRate ? <span className="text-emerald-600 ml-0.5">{annualInterestRate}% EA</span> : ''}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex justify-end mt-auto gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                        variant="flat"
                        isIconOnly
                        size="sm"
                        className="h-8 w-8 rounded-full bg-gray-100 text-gray-500 hover:bg-blue-100 hover:text-blue-600 data-[hover=true]:bg-blue-100 data-[hover=true]:text-blue-600 transition-colors"
                        onPress={onEdit}
                    >
                        <FaPencilAlt className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        variant="flat"
                        isIconOnly
                        size="sm"
                        className="h-8 w-8 rounded-full bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-600 data-[hover=true]:bg-red-100 data-[hover=true]:text-red-600 transition-colors"
                        onPress={onDelete}
                    >
                        <FaTrashAlt className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>
        </Card>
    )
}

