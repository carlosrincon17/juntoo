"use client"

import type { Category, ParentCategory } from "@/app/types/category"
import type { Expense } from "@/app/types/expense"
import { TransactionType } from "@/utils/enums/transaction-type"
import { addToast, Button, Card, CardBody, ScrollShadow } from "@heroui/react"
import { useEffect, useState } from "react"
import { getCategories } from "../actions/categories"
import { FaCheck, FaCreditCard, FaTimes } from "react-icons/fa"
import { CustomLoading } from "@/app/components/customLoading"
import { addExpense } from "@/app/actions/expenses"


const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("es-ES", {
        style: "decimal",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value)
}

const currencyToInteger = (value: string): number => {
    // Remove all non-numeric characters except decimal point
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

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const categoriesCache: Record<string, { data: Category[], timestamp: number }> = {};

export default function NewExpensePanel(props: {
    isOpen: boolean
    onOpenChange: () => void
    transactionType: TransactionType
}) {
    const { isOpen, onOpenChange, transactionType } = props

    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [categories, setCategories] = useState<Category[]>([])
    const [categoryList, setCategoryList] = useState<Category[]>([])
    const [categoryParents, setCategoryParents] = useState<ParentCategory[]>([])
    const [selectedParentCategory, setSelectedParentCategory] = useState<ParentCategory | null>(null)
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingSaveExpense, setIsLoadingSaveExpense] = useState(false)
    const [expenseValue, setExpenseValue] = useState("")
    const [expense, setExpense] = useState<Expense>({
        value: 0,
        category_id: 0,
        budgetId: null,
        userId: null,
    })

    const loadParentsCategories = (categoriesToFilter: Category[]) => {
        const loadedParents = Array.from(
            new Map(categoriesToFilter.map(({ parent, color }) => [parent, { name: parent, color }])).values(),
        )
        setCategoryParents(loadedParents)
    }

    const loadCategories = async () => {
        setIsLoading(true)

        const now = Date.now();
        const cached = categoriesCache[transactionType];

        if (cached && (now - cached.timestamp < CACHE_DURATION)) {
            setCategories(cached.data);
            loadParentsCategories(cached.data);
            setIsLoading(false);
            return;
        }

        const categories = await getCategories(transactionType)

        categoriesCache[transactionType] = {
            data: categories,
            timestamp: now
        };

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
        setExpenseValue("")
        setExpense({ value: 0, category_id: 0, budgetId: null, userId: null })
    }

    useEffect(() => {
        if (isOpen) {
            setExpense({ value: 0, category_id: 0, budgetId: null, userId: null })
            setCategoryList([])
            setSelectedParentCategory(null)
            setCategoryParents([])
            setDate(new Date().toISOString().split('T')[0])
            loadCategories()
        }
    }, [isOpen])

    const handleSaveExpense = async () => {
        setIsLoadingSaveExpense(true)

        // Create date at noon local time to avoid timezone issues
        const [year, month, day] = date.split('-').map(Number)
        const expenseDate = new Date(year, month - 1, day, 12, 0, 0)

        await addExpense({ ...expense, category_id: Number(selectedCategory?.id), transactionType: transactionType, createdAt: expenseDate })
        addToast({
            title: "¡Todo en orden!",
            description: `Tu gasto de ${formatCurrency(expense.value as number)} por ${selectedCategory?.name} se ha agregado correctamente`,
            icon: <FaCheck size={24} />,
        });
        setIsLoadingSaveExpense(false)
        onOpenChange()
    }

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={onOpenChange}
            />
            <div
                className={`fixed inset-y-0 right-0 z-50 w-full sm:w-1/3 bg-background shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center p-4 border-b">
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-extralight">Nuevo Registro</h2>
                        </div>
                        <Button isIconOnly variant="light" onPress={onOpenChange}>
                            <FaTimes size={24} />
                        </Button>
                    </div>

                    <ScrollShadow className="flex-1 overflow-y-auto bg-gray-50">
                        {
                            isLoading ?
                                <CustomLoading className="mt-24" text="Sincronizando categorías..." />
                                :
                                <form
                                    className="p-4 space-y-6"
                                    onSubmit={(e) => {
                                        e.preventDefault()
                                        handleSaveExpense()
                                    }}
                                >
                                    {" "}
                                    <div className="space-y-3">
                                        <label className="text-sm font-light">Fecha:</label>
                                        <input
                                            type="date"
                                            className="w-full p-3 rounded-lg border-2 focus:outline-none border-gray-200"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                        />
                                    </div>

                                    {!selectedParentCategory ? (
                                        <div className="space-y-3">
                                            <label className="text-sm font-light">
                                                Seleccione el tipo de {transactionType === TransactionType.Outcome ? "gasto" : "ingreso"} :
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
                                                            <h2
                                                                className="text-sm text-center w-full font-medium"
                                                            >
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
                                                <label className="text-sm font-light w-full">Tipo de {transactionType === TransactionType.Outcome ? "gasto" : "ingreso"}: </label>
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
                                                <label className="text-sm font-light">Seleccione una categoria:</label>
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
                                                                <h2
                                                                    className="text-sm text-center text-ellipsis w-full font-medium"
                                                                >
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
                                                <label className="text-sm font-light">
                                                    {transactionType === TransactionType.Outcome ? "Valor del gasto" : "Valor del ingreso"} :
                                                </label>
                                                <div className="relative mt-4">
                                                    <div
                                                        className="absolute inset-y-0 left-0 flex items-center pl-3"
                                                    >
                                                        <FaCreditCard size={20} />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        className={`w-full py-3 pl-10 pr-12 text-lg rounded-lg border-2 focus:outline-none ${selectedCategory?.color && colors[selectedCategory.color]}`}
                                                        placeholder="0"
                                                        inputMode="numeric"
                                                        value={expenseValue}
                                                        onChange={(e) => {
                                                            const intValue = currencyToInteger(e.target.value)
                                                            setExpenseValue(formatCurrency(intValue))
                                                            setExpense({ ...expense, value: intValue })
                                                        }}
                                                        autoFocus
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </form>
                        }

                    </ScrollShadow>

                    <div className="p-4 border-t flex justify-end gap-2">
                        <Button
                            variant="flat"
                            onPress={handleSaveExpense}
                            isDisabled={Boolean(!selectedCategory || !expense.value || isLoadingSaveExpense)}
                            className={`w-full text-white font-semibold ${selectedCategory?.color && bgSelectedColorsButton[selectedCategory?.color]}`}
                        >
                            Agregar {transactionType === TransactionType.Outcome ? "Gasto" : "Ingreso"}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

