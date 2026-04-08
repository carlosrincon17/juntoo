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
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            <Card className="shadow-lg border-none bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4c1d95] xl:col-span-1 group overflow-hidden relative">
                <div className="p-6 relative h-full flex flex-col justify-between">
                    {/* Premium decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-16 translate-x-16 group-hover:bg-white/10 transition-colors duration-700"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#6366f1]/20 rounded-full blur-2xl translate-y-16 -translate-x-12"></div>

                    <div>
                        <div className="flex items-center justify-between mb-2 relative z-10">
                            <h3 className="font-medium text-sm tracking-wide text-white/70 uppercase">Balance Global</h3>
                        </div>

                        <div className="flex items-end gap-3 mb-6 relative z-10 mt-2">
                            <p className="text-4xl font-semibold text-white tracking-tight">{formatCurrency(balance)}</p>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/10 relative z-10 hidden xl:block">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm font-medium text-white/60 mb-1">Activos Totales</p>
                                <p className="text-xl font-medium text-white tracking-tight">{formatCurrency(savings + assets)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-white/60 mb-1">Pasivos Totales</p>
                                <p className="text-xl font-medium text-white tracking-tight">{formatCurrency(debts)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <Card className="shadow-sm border border-gray-100 dark:border-gray-800 xl:col-span-2 bg-content1 rounded-2xl overflow-hidden">
                <div className="flex flex-col h-full">
                    <div className="p-6 border-b border-gray-50/80 dark:border-gray-800">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 tracking-tight">Resumen Financiero</h3>
                            <div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                                <FaChartPie className="h-4 w-4 text-gray-500" />
                            </div>
                        </div>
                        <p className="text-sm font-medium text-gray-500">Distribución de activos y pasivos</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 p-6 bg-gray-50/30 flex-1">

                        {/* Ahorros y Patrimonio */}
                        <div className="space-y-4">
                            <div className="group flex items-center justify-between p-4 bg-content1 border border-gray-100 dark:border-gray-800 hover:border-blue-200 hover:shadow-md rounded-2xl transition-all duration-300">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900 text-blue-500 dark:text-blue-200 flex items-center justify-center group-hover:scale-105 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shadow-sm">
                                        <FaWallet className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors">Ahorros</h5>
                                        <p className="text-xs font-medium text-gray-500">Liquidez disponible</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 tracking-tight">{formatCurrency(savings)}</p>
                                    <div className="mt-0.5">
                                        <p className="text-xs font-medium text-blue-500 bg-blue-50 dark:bg-blue-900/30 inline-block px-2 py-0.5 rounded-full">{financialCounter.savings} cuentas</p>
                                    </div>
                                </div>
                            </div>

                            <div className="group flex items-center justify-between p-4 bg-content1 border border-gray-100 dark:border-gray-800 hover:border-emerald-200 hover:shadow-md rounded-2xl transition-all duration-300">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 dark:text-emerald-300 flex items-center justify-center group-hover:scale-105 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shadow-sm">
                                        <FaBuilding className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-emerald-600 transition-colors">Patrimonio</h5>
                                        <p className="text-xs font-medium text-gray-500">Bienes e inversiones</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 tracking-tight">{formatCurrency(assets)}</p>
                                    <div className="mt-0.5">
                                        <p className="text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/40 inline-block px-2 py-0.5 rounded-full">{financialCounter.assets} activos</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Deudas */}
                        <div className="space-y-4">
                            <div className="group flex items-center justify-between p-4 bg-content1 border border-gray-100 dark:border-gray-800 hover:border-rose-200 hover:shadow-md rounded-2xl transition-all duration-300">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-900 text-rose-500 dark:text-rose-200 flex items-center justify-center group-hover:scale-105 group-hover:bg-rose-500 group-hover:text-white transition-all duration-300 shadow-sm">
                                        <FaCreditCard className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-rose-600 transition-colors">Deudas</h5>
                                        <p className="text-xs font-medium text-gray-500">Préstamos y créditos</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 tracking-tight">{formatCurrency(debts)}</p>
                                    <div className="mt-0.5">
                                        <p className="text-xs font-medium text-rose-600 bg-rose-50 dark:bg-rose-900/40 inline-block px-2 py-0.5 rounded-full">{financialCounter.debts} deudas</p>
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

