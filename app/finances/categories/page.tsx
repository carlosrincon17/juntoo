'use client'

import { useEffect, useState } from "react";
import { getCategories } from "./actions/categories";
import { Category } from "@/app/types/category";
import CategoryList from "./components/category-list";
import { CustomLoading } from "@/app/components/customLoading";
import { Button, ButtonGroup, Input, } from "@heroui/react";
import { TransactionType } from "@/utils/enums/transaction-type";
import { FaSearch } from "react-icons/fa";

export default function Page() {

    const [categories, setCategories] = useState<Category[]>([]);
    const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
    const [searchCategory, setSearchCategory] = useState<string>('');
    const [selectedCategoryTransactionType, setSelectedCategoryTransactionType] = useState<TransactionType>(TransactionType.Outcome);

    const [loading, setLoading] = useState(true);

    const getCategoriesData = async () => {
        setLoading(true)
        const categoriesData = await getCategories(selectedCategoryTransactionType);
        setCategories(categoriesData);
        setSearchCategory('');
        setFilteredCategories(categoriesData);
        setLoading(false);
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
                    <CategoryList categories={filteredCategories} />
                </div>
            }
            
        </div>
    )
}