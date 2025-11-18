'use client'

import { formatCurrency } from "@/app/lib/currency"
import { Card } from "@heroui/react"
import { FaBuilding, FaChartPie, FaCreditCard, FaWallet } from "react-icons/fa"

interface SummarySectionProps {
  savings: number
  assets: number
  debts: number
  balance: number
  financialCounter: {
    savings: number
    assets: number
    debts: number
  }
}

export default function SummarySection({ savings, assets, debts, balance, financialCounter }: SummarySectionProps) {

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <Card className="shadow-md bg-gradient-to-r from-[#5a6bff] via-[#6366f1] to-[#818cf8] xl:col-span-1">
                <div className="p-4 relative overflow-hidden h-full">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-16 -translate-x-16"></div>

                    <div className="flex items-center justify-between mb-1 relative0¿">
                        <div className="flex items-center gap-2">
                            <h3 className="font-light text-sm tracking-wide text-white/90">Balance Global</h3>
                        </div>
                    </div>

                    <div className="flex items-end gap-3 mb-4">
                        <p className="text-3xl font-extralight text-white">{formatCurrency(balance)}</p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10 hidden xl:block">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-md font-light text-white/70">Activos Totales</p>
                                <p className="text-2xl font-extralight text-white">{formatCurrency(savings + assets)}</p>
                            </div>
                            <div>
                                <p className="text-md font-light text-white/70">Pasivos Totales</p>
                                <p className="text-2xl font-extralight text-white">{formatCurrency(debts)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <Card className="shadow-md xl:col-span-2">
                <div className="bg-gradient-to-br from-white to-[#f9faff]">
                    <div className="p-6 border-b border-[#f0f4ff]">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-lg text-[#121432] tracking-tight">Resumen Financiero</h3>
                            <div className="p-2 rounded-full bg-gradient-to-r from-[#5a6bff]/10 to-[#a78bfa]/10">
                                <FaChartPie className="h-4 w-4 text-[#5a6bff]" />
                            </div>
                        </div>
                        <p className="text-sm font-light text-[#121432]/60">Distribución de activos y pasivos</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">

                        <div className="space-y-4">

                            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-[#5a6bff]/5 to-[#818cf8]/5 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5a6bff] to-[#818cf8] flex items-center justify-center">
                                        <FaWallet className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-medium text-[#121432]">Ahorros</h5>
                                        <p className="text-xs font-light text-[#121432]/60">Liquidez disponible</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-light text-[#121432]">{formatCurrency(savings)}</p>
                                    <div className="flex items-center justify-end gap-1">
                                        <p className="text-xs font-normal text-[#5a6bff]">{financialCounter.savings} cuentas</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-[#2dd4bf]/5 to-[#34d399]/5 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2dd4bf] to-[#34d399] flex items-center justify-center">
                                        <FaBuilding className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-medium text-[#121432]">Patrimonio</h5>
                                        <p className="text-xs font-light text-[#121432]/60">Bienes e inversiones</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-light text-[#121432]">{formatCurrency(assets)}</p>
                                    <div className="flex items-center justify-end gap-1">
                                        <p className="text-xs font-normal text-[#2dd4bf]">{financialCounter.assets} activos</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-[#f97066]/5 to-[#fb7185]/5 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f97066] to-[#fb7185] flex items-center justify-center">
                                        <FaCreditCard className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-medium text-[#121432]">Deudas</h5>
                                        <p className="text-xs font-light text-[#121432]/60">Préstamos y créditos</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-light text-[#121432]">{formatCurrency(debts)}</p>
                                    <div className="flex items-center justify-end gap-1">
                                        <p className="text-xs font-normal text-[#f97066]">{financialCounter.debts} deudas</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}

