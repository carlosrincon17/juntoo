"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type React from "react"
import { Category, ParentCategory } from "@/app/types/category"
import { getCategories } from "../../categories/actions/categories"
import { TransactionType } from "@/utils/enums/transaction-type"
import { CategoryGrid } from "./components/category-grid"

export default function Page() {
    const [selectedParentCategory, setSelectedParentCategory] = useState<ParentCategory | null >(null)
    const [parents, setParents] = useState<ParentCategory[]>([])
    const [categories, setCategories] = useState<Category[]>([])

    const loadCategories = async () =>  {
        const categoriesLoaded = await getCategories(TransactionType.Outcome);
        const loadedParents = Array.from(
            new Map(
                categoriesLoaded.map(({ parent, color }) => [parent, { name: parent, color }])
            ).values()
        );
        setCategories(categoriesLoaded)
        setParents(loadedParents)
    }

    const handleParentCategorySelect = (parent: ParentCategory): void => {
        console.log(selectedParentCategory)
        setSelectedParentCategory(parent)
    }

    useEffect(() => {
        loadCategories()
    }, [])

    return (
        <div>
            {categories.length ?
                <div className="container mx-auto p-4 space-y-6">
                    <div className="relative h-[70vh] flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            {parents.length ? (
                                <motion.div
                                    key="categoriesParents"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="w-full h-full flex flex-col items-center justify-center"
                                >
                                    <p className="text-lg text-muted-foreground mb-8">Selecciona una categoría para comenzar</p>
                                    <CategoryGrid
                                        parentCategories={parents}
                                        onSelectParentCategory={handleParentCategorySelect}
                                    />
                                </motion.div>
                            ) : (
                                <div>
                             test
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>:
                <div>
            No data
                </div>}
        </div>
    )
}

