import { motion } from "framer-motion"
import type React from "react"
import { ParentCategory } from "@/app/types/category"
import { Button } from "@nextui-org/react"

interface CategoryGridProps {
  parentCategories: ParentCategory[]
  onSelectParentCategory: (categoryParent: ParentCategory) => void
}

export function CategoryGrid({ parentCategories, onSelectParentCategory }: CategoryGridProps) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {parentCategories.map((category, index) => (
                <motion.div
                    key={category.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                    <Button
                        variant="bordered"
                        color="default"
                        className="w-full h-24 flex flex-col items-center justify-center p-2 hover:bg-accent border-stone-500"
                        onClick={() => onSelectParentCategory(category)}
                    >
                        <span className="text-sm text-center font-medium text-stone-500">{category.name}</span>
                    </Button>
                </motion.div>
            ))}
        </div>
    )
}

