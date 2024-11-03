'use client'

import { useEffect, useState } from "react";
import { getCategories } from "./actions/categories";
import { Category } from "@/app/types/category";
import CategoryList from "./components/category-list";
import { CustomLoading } from "@/app/components/customLoading";
import { Button, ButtonGroup, Input, useDisclosure } from "@nextui-org/react";
import { addExpense } from "@/app/actions/expenses";
import toast from "react-hot-toast";
import NewExpenseModal from "./components/new-expense-modal";
import { Expense } from "@/app/types/expense";
import { getUser } from "@/app/actions/auth";
import { TransactionType } from "@/utils/enums/transaction-type";
import { getBudgets } from "../budgets/actions/bugdets";
import { Budget } from "@/app/types/budget";
import ToastCustom from "@/app/components/toastCustom";
import { formatCurrency } from "@/app/lib/currency";
import { FaSearch } from "react-icons/fa";

export default function Page() {

    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
    const [searchCategory, setSearchCategory] = useState<string>('');
    const [user, setUser] = useState<string>('--');
    const [selectedCategoryTransactionType, setSelectedCategoryTransactionType] = useState<TransactionType>(TransactionType.Outcome);
    const [budgets, setBudgets] = useState<Budget[]>([]);

    const [loading, setLoading] = useState(true);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const getCategoriesData = async () => {
        setLoading(true)
        const categoriesData = await getCategories(selectedCategoryTransactionType);
        setCategories(categoriesData);
        setSearchCategory('');
        setFilteredCategories(categoriesData);
        setLoading(false);
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
        const toastMessage = `Agregado ${typeLabel} de ${formatCurrency(expenseToAdd.value as number)} por ${expenseToAdd.category?.name}.`;
        toast.custom((t) => <ToastCustom message={toastMessage} toast={t}/>);
        onClose();
    }

    const onAddExpense = async (category: Category) => {
        setSelectedCategory(category);
        onOpen()
    }

    const getFilteredCategories = () => {
        if(searchCategory) {
            const filteredCategories = categories.filter((category) => category.name.toLowerCase().includes(searchCategory.toLowerCase()));
            setFilteredCategories(filteredCategories);
        } else {
            setFilteredCategories(categories);
        }
    }

    useEffect(() => {
        getFilteredCategories();
    }, [searchCategory]);

    useEffect(() => {
        getUserData();
        getBudgetsData();
    }, []);
    
    useEffect(() => {
        getCategoriesData();
    }, [selectedCategoryTransactionType]);

    return (
        <div>
            <div className="flex w-full flex-wrap items-center justify-center gap-4">
                <ButtonGroup size="lg" className="flex"> 
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
                <Input 
                    name="searchCategory" 
                    placeholder="Buscar por categoria ..." 
                    className="ml-4" 
                    size="lg" 
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                    startContent={
                        <FaSearch className="text-gray-500 text-lg" />
                    }
                />
            </div>
            {loading ? 
                <CustomLoading className="pt-12" /> :
                <div>
                    <CategoryList categories={filteredCategories} onAddExpense={(category: Category) => onAddExpense(category)}/>
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