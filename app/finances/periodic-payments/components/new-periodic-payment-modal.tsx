"use client"

import type { Category, ParentCategory } from "@/app/types/category"
import { TransactionType } from "@/utils/enums/transaction-type"
import { addToast, Button, Card, CardBody, ScrollShadow, Select, SelectItem } from "@heroui/react"
import { useEffect, useState } from "react"
import { getCategories } from "@/app/finances/categories/actions/categories"
import { FaCheck, FaCreditCard, FaTimes } from "react-icons/fa"
import { CustomLoading } from "@/app/components/customLoading"
import { addPeriodicPayment } from "@/app/actions/periodic-payments"
import { Frequency, PeriodicPayment } from "@/app/types/periodic-payment"
import { useRouter } from "next/navigation"

const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("es-ES", {
        style: "decimal",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value)
}

const currencyToInteger = (value: string): number => {
    const numericValue = value.replace(/[^\d]/g, "")
    return Number.parseInt(numericValue || "0", 10)
}

const colors: Record<string, string> = {
    indigo: "border-2 border-indigo-500",
    fuchsia: "border-2 border-fuchsia-500",
    emerald: "border-2 border-emerald-500",
    amber: "border-2 border-amber-500",
    sky: "border-2 border-sky-500",
    rose: "border-2 border-rose-500",
    cyan: "border-2 border-cyan-500",
    violet: "border-2 border-violet-500",
    green: "border-2 border-green-500",
    blue: "border-2 border-blue-500",
    stone: "border-2 border-stone-500",
    pink: "border-2 border-pink-500",
    lime: "border-2 border-lime-500",
    teal: "border-2 border-teal-500",
}

const bgSelectedColors: Record<string, string> = {
    indigo: "bg-indigo-200",
    fuchsia: "bg-fuchsia-200",
    emerald: "bg-emerald-200",
    amber: "bg-amber-200",
    sky: "bg-sky-200",
    rose: "bg-rose-200",
    cyan: "bg-cyan-200",
    violet: "bg-violet-200",
    green: "bg-green-200",
    blue: "bg-blue-200",
    stone: "bg-stone-200",
    pink: "bg-pink-200",
    lime: "bg-lime-200",
    teal: "bg-teal-200",
}

const bgSelectedColorsButton: Record<string, string> = {
    indigo: "bg-indigo-700",
    fuchsia: "bg-fuchsia-700",
    emerald: "bg-emerald-700",
    amber: "bg-amber-700",
    sky: "bg-sky-700",
    rose: "bg-rose-700",
    cyan: "bg-cyan-700",
    violet: "bg-violet-700",
    green: "bg-green-700",
    blue: "bg-blue-700",
    stone: "bg-stone-700",
    pink: "bg-pink-700",
    lime: "bg-lime-700",
    teal: "bg-teal-700",
}

export default function NewPeriodicPaymentPanel(props: {
    isOpen: boolean
    onOpenChange: () => void
}) {
    const { isOpen, onOpenChange } = props
    const router = useRouter()

    const [categories, setCategories] = useState<Category[]>([])
    const [categoryList, setCategoryList] = useState<Category[]>([])
    const [categoryParents, setCategoryParents] = useState<ParentCategory[]>([])
    const [selectedParentCategory, setSelectedParentCategory] = useState<ParentCategory | null>(null)
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingSave, setIsLoadingSave] = useState(false)
    const [paymentValue, setPaymentValue] = useState("")
    const [transactionType, setTransactionType] = useState<TransactionType>(TransactionType.Outcome)
    const [frequency, setFrequency] = useState<Frequency>("monthly")
    const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0])

    const loadParentsCategories = (categoriesToFilter: Category[]) => {
        const loadedParents = Array.from(
            new Map(categoriesToFilter.map(({ parent, color }) => [parent, { name: parent, color }])).values(),
        )
        setCategoryParents(loadedParents)
    }

    const loadCategories = async () => {
        setIsLoading(true)
        const categories = await getCategories(transactionType)
        setCategories(categories)
        loadParentsCategories(categories)
        setIsLoading(false)
    }

    const onSelectParentCategory = (parentCategory: ParentCategory | null = null) => {
        setCategoryList([])
        if (parentCategory) {
            const categoryList = categories.filter((category) => category.parent === parentCategory.name)
            setCategoryList(categoryList)
        }
        setSelectedParentCategory(parentCategory)
        setSelectedCategory(null)
    }

    useEffect(() => {
        if (isOpen) {
            setPaymentValue("")
            setCategoryList([])
            setSelectedParentCategory(null)
            setCategoryParents([])
            loadCategories()
        }
    }, [isOpen, transactionType])

    const handleSave = async () => {
        if (!selectedCategory) return

        setIsLoadingSave(true)
        const payment: PeriodicPayment = {
            name: selectedCategory.name,
            value: currencyToInteger(paymentValue),
            category_id: selectedCategory.id,
            frequency: frequency,
            startDate: new Date(startDate),
            userId: 0, // Will be set by server action
            familyId: 0, // Will be set by server action
            transactionType: transactionType
        }

        await addPeriodicPayment(payment)

        addToast({
            title: "¡Todo en orden!",
            description: `Tu pago periódico se ha agregado correctamente`,
            icon: <FaCheck size={24} />,
        });

        setIsLoadingSave(false)
        onOpenChange()
        router.refresh()
    }

    if (!isOpen) return null

    return (
        <>
            <div className="fixed inset-0 bg-black/30 z-40 transition-opacity" onClick={onOpenChange} />
            <div
                className={`fixed inset-y-0 right-0 z-50 w-full sm:w-1/3 bg-background shadow-xl transform transition-transform duration-500 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center p-4 border-b">
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-extralight">Nuevo Pago Periódico</h2>
                        </div>
                        <Button isIconOnly variant="light" onPress={onOpenChange}>
                            <FaTimes size={24} />
                        </Button>
                    </div>

                    <ScrollShadow className="flex-1 overflow-y-auto bg-gray-50">
                        {
                            isLoading ?
                                <CustomLoading className="mt-24" text="Cargando categorías..." />
                                :
                                <div className="p-4 space-y-6">
                                    <div className="flex gap-2 justify-center mb-4">
                                        <Button
                                            size="sm"
                                            variant={transactionType === TransactionType.Outcome ? "solid" : "bordered"}
                                            color={transactionType === TransactionType.Outcome ? "danger" : "default"}
                                            onPress={() => setTransactionType(TransactionType.Outcome)}
                                        >
                                            Gasto
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={transactionType === TransactionType.Income ? "solid" : "bordered"}
                                            color={transactionType === TransactionType.Income ? "success" : "default"}
                                            onPress={() => setTransactionType(TransactionType.Income)}
                                        >
                                            Ingreso
                                        </Button>
                                    </div>

                                    {!selectedParentCategory ? (
                                        <div className="space-y-3">
                                            <label className="text-sm font-light">
                                                Seleccione la categoría:
                                            </label>

                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                                                {categoryParents.map((parentCategory) => (
                                                    <Card
                                                        key={parentCategory.name}
                                                        isPressable
                                                        onPress={() => onSelectParentCategory(parentCategory)}
                                                        className={`shadow-md ${colors[parentCategory.color]} h-16 bg-background`}
                                                        radius="sm"
                                                    >
                                                        <CardBody className="p-4 flex flex-col items-center justify-center">
                                                            <h2 className="text-sm text-center w-full font-medium">
                                                                {parentCategory.name}
                                                            </h2>
                                                        </CardBody>
                                                    </Card>
                                                ))}
                                            </div>
                                        </div>
                                    ) : null}

                                    {selectedParentCategory && categoryList.length && (
                                        <>
                                            <div className="space-y-3 ">
                                                <label className="text-sm font-light w-full">Categoría seleccionada: </label>
                                                <div className="grid gap-2 mb-2 grid-cols-1">
                                                    {selectedParentCategory && (
                                                        <Card
                                                            key={selectedParentCategory.name}
                                                            isPressable
                                                            onPress={() => onSelectParentCategory(null)}
                                                            className={`shadow-md ${colors[selectedParentCategory.color]} h-16 bg-background`}
                                                            radius="sm"
                                                        >
                                                            <CardBody className="p-4 flex flex-col items-center justify-center">
                                                                <h2 className="text-sm text-center text-ellipsis w-full">{selectedParentCategory.name}</h2>
                                                            </CardBody>
                                                        </Card>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-sm font-light">Seleccione una subcategoría:</label>
                                                <div className="grid grid-cols-3 gap-2 mt-2">
                                                    {categoryList.map((category) => (
                                                        <Card
                                                            key={category.id}
                                                            isPressable
                                                            className={`shadow-md ${colors[category.color]} h-16 ${selectedCategory?.id === category.id ? bgSelectedColors[category.color] : null}`}
                                                            radius="sm"
                                                            onPress={() => setSelectedCategory(category)}
                                                        >
                                                            <CardBody className="p-4 flex flex-col items-center justify-center">
                                                                <h2 className="text-sm text-center text-ellipsis w-full font-medium">
                                                                    {category.name}
                                                                </h2>
                                                            </CardBody>
                                                        </Card>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {selectedParentCategory && selectedCategory && (
                                        <div className="space-y-6">
                                            <div>
                                                <label className="text-sm font-light">Valor:</label>
                                                <div className="relative mt-2">
                                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                        <FaCreditCard size={20} />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        className={`w-full py-3 pl-10 pr-12 text-lg rounded-lg border-2 focus:outline-none ${selectedCategory?.color && colors[selectedCategory.color]}`}
                                                        placeholder="0"
                                                        inputMode="numeric"
                                                        value={paymentValue}
                                                        onChange={(e) => {
                                                            const intValue = currencyToInteger(e.target.value)
                                                            setPaymentValue(formatCurrency(intValue))
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-sm font-light">Frecuencia:</label>
                                                <Select
                                                    selectedKeys={[frequency]}
                                                    onChange={(e) => setFrequency(e.target.value as Frequency)}
                                                    className="mt-2"
                                                >
                                                    <SelectItem key="daily">Diario</SelectItem>
                                                    <SelectItem key="weekly">Semanal</SelectItem>
                                                    <SelectItem key="monthly">Mensual</SelectItem>
                                                    <SelectItem key="yearly">Anual</SelectItem>
                                                </Select>
                                            </div>

                                            <div>
                                                <label className="text-sm font-light">Fecha de inicio:</label>
                                                <input
                                                    type="date"
                                                    className="w-full p-3 mt-2 border rounded-lg"
                                                    value={startDate}
                                                    onChange={(e) => setStartDate(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                        }
                    </ScrollShadow>

                    <div className="p-4 border-t flex justify-end gap-2">
                        <Button
                            variant="flat"
                            onPress={handleSave}
                            isDisabled={Boolean(!selectedCategory || !paymentValue || isLoadingSave)}
                            className={`w-full text-white font-semibold ${selectedCategory?.color && bgSelectedColorsButton[selectedCategory?.color]}`}
                        >
                            Guardar Pago Periódico
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}
