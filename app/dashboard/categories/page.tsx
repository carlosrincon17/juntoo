'use client'

import { useEffect, useState } from "react";
import { getCategories } from "./actions/categories";
import { Category } from "@/app/types/category";
import CategoryList from "./components/category-list";
import { CustomLoading } from "@/app/components/customLoading";
import { useDisclosure } from "@nextui-org/react";
import { addExpense } from "@/app/actions/expenses";
import toast from "react-hot-toast";
import NewExpenseModal from "./components/new-expense-modal";
import { Expense } from "@/app/types/expense";
import { getUser } from "@/app/actions/auth";

export default function Page() {

    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [user, setUser] = useState<string>('--');

    const [loading, setLoading] = useState(true);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const getCategoriesData = async () => {
        const categoriesData = await getCategories();
        setLoading(false);
        setCategories(categoriesData);
    }

    const getUserData = async () => {
        const userData = await getUser();
        setUser(userData);
    }

    const saveExpense = async (onClose: () => void, expense: Expense) => {
        const expenseToAdd: Expense = {
            ...expense,
            category_id: selectedCategory?.id || 0,
            category: selectedCategory,
            createdBy: user,
        };
        await addExpense(expenseToAdd);
        toast.success(`Agregado $ ${expense.value} por ${expense.category?.name}.`, {
            position: "bottom-center",
        });
        onClose();
    }

    const onAddExpense = async (category: Category) => {
        setSelectedCategory(category);
        onOpen()
    }

    useEffect(() => {
        getUserData();
    }, []);
    
    useEffect(() => {
        getCategoriesData();
    }, []);

    return (
        <div>
            {loading && <CustomLoading /> }
            <CategoryList categories={categories} onAddExpense={(category: Category) => onAddExpense(category)}/>
            <NewExpenseModal isOpen={isOpen} onOpenChange={onOpenChange} onSaveExpense={saveExpense} category={selectedCategory} />
        </div>
    )
}