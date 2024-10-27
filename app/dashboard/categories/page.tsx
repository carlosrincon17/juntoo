'use client'

import { useEffect, useState } from "react";
import { getCategories } from "./actions/categories";
import { Category } from "@/app/types/category";
import CategoryList from "./components/category-list";
import { CustomLoading } from "@/app/components/customLoading";
import { Button, ButtonGroup, useDisclosure } from "@nextui-org/react";
import { addExpense } from "@/app/actions/expenses";
import toast from "react-hot-toast";
import NewExpenseModal from "./components/new-expense-modal";
import { Expense } from "@/app/types/expense";
import { getUser } from "@/app/actions/auth";
import { TransactionType } from "@/utils/enums/transaction-type";
import { getBudgets } from "../budgets/actions/bugdets";
import { Budget } from "@/app/types/budget";

export default function Page() {

    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [user, setUser] = useState<string>('--');
    const [selectedCategoryTransactionType, setSelectedCategoryTransactionType] = useState<TransactionType>(TransactionType.Outcome);
    const [budgets, setBudgets] = useState<Budget[]>([]);

    const [loading, setLoading] = useState(true);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const getCategoriesData = async () => {
        setLoading(true)
        const categoriesData = await getCategories(selectedCategoryTransactionType);
        setLoading(false);
        setCategories(categoriesData);
    }

    const getUserData = async () => {
        const userData = await getUser();
        setUser(userData);
    }

    const getBudgetsData = async () => {
        const budgetsData = await getBudgets();
        setBudgets(budgetsData);
    }

    const saveExpense = async (onClose: () => void, expense: Expense) => {
        const expenseToAdd: Expense = {
            ...expense,
            category_id: selectedCategory?.id || 0,
            category: selectedCategory,
            createdBy: user,
            transactionType: selectedCategory?.transactionType,
        };
        await addExpense(expenseToAdd);
        const typeLabel = selectedCategoryTransactionType === TransactionType.Outcome ? 'gasto' : 'ingreso';
        toast.success(`Agregado ${typeLabel} de $ ${expenseToAdd.value} por ${expenseToAdd.category?.name}.`);
        onClose();
    }

    const onAddExpense = async (category: Category) => {
        setSelectedCategory(category);
        onOpen()
    }

    useEffect(() => {
        getUserData();
        getBudgetsData();
    }, []);
    
    useEffect(() => {
        getCategoriesData();
    }, [selectedCategoryTransactionType]);

    return (
        <div>
            <ButtonGroup size="lg" className="flex w-full"> 
                <Button 
                    color={selectedCategoryTransactionType === TransactionType.Outcome? 'primary' : 'default'}
                    onPress={() => setSelectedCategoryTransactionType(TransactionType.Outcome)}
                >
                    Gastos
                </Button>
                <Button
                    color={selectedCategoryTransactionType === TransactionType.Income? 'primary' : 'default'}
                    onPress={() => setSelectedCategoryTransactionType(TransactionType.Income)}
                >
                    Ingresos
                </Button>
            </ButtonGroup>
            {loading ? 
                <CustomLoading className="mt-16"/> :
                <div>
                    <CategoryList categories={categories} onAddExpense={(category: Category) => onAddExpense(category)}/>
                    <NewExpenseModal
                        budgets={budgets}
                        isOpen={isOpen} 
                        onOpenChange={onOpenChange} 
                        onSaveExpense={saveExpense} 
                        category={selectedCategory}
                    />
                </div>
            }
            
        </div>
    )
}