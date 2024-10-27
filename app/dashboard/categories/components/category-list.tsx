'use client'

import { Category } from "@/app/types/category";
import { Card, CardBody, CardFooter, Chip } from "@nextui-org/react";

export default function CategoryList(props: { categories: Category[], onAddExpense: (category: Category) => void }) {
    const { categories, onAddExpense } = props;

    const groupedCategories = categories.reduce((acc, category) => {
        const key = category.parent;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(category);
        return acc;
    }, {} as Record<string, Category[]>);

    const colors: Record<string, string> = {
        "indigo": "bg-gradient-to-b from-indigo-500 to-indigo-700",
        "fuchsia": "bg-gradient-to-b from-fuchsia-500 to-fuchsia-700",
        "emerald": "bg-gradient-to-b from-emerald-500 to-emerald-700",
        "amber": "bg-gradient-to-b from-amber-500 to-amber-700",
        "sky": "bg-gradient-to-b from-sky-500 to-sky-700",
        "rose": "bg-gradient-to-b from-rose-500 to-rose-700",
        "cyan": "bg-gradient-to-b from-cyan-500 to-cyan-700",
        "violet": "bg-gradient-to-b from-violet-500 to-violet-700",
        "green": "bg-gradient-to-b from-green-400 to-green-600",
    }

    const getParentCategories = () => {
        return Object.keys(groupedCategories).map((parentCategory) => {
            const groupedCategoryList = groupedCategories[parentCategory];
            return (
                <div className="mb-10" key={parentCategory}>
                    <div className="grid gap-4 flex-row lg:grid-cols-4 sm:grid-cols-1 md:grid-cols-3 mt-4">
                        {getCategories(groupedCategoryList as Category[])}
                    </div>
                </div>
            )
        })
    }

    const getCategories = (categories: Category[]) => {
        return categories.map((category) => {
            return (
                <Card className={`${colors[category.color]} dark:bg-default-100/50 w-full text-white`} key={category.id} 
                    isBlurred 
                    isPressable
                    onPress={() => onAddExpense(category)}>
                    <CardBody>
                        <h3 className="font-light text-xl">{category.name}</h3>
                    </CardBody>
                    <CardFooter className="flex flex-col-reverse items-end">
                        <Chip className="text-extra-small font-light text-gray-950 bg-gray-200 " size="sm">{category.parent}</Chip>
                    </CardFooter>
                </Card>
            )
        })
    }   

    return (
        <div className="mt-10">
            {getParentCategories()}
        </div>
    )
}