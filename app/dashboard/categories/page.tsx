'use client'

import { useEffect, useState } from "react";
import { getCategories } from "./actions/categories";
import { Category } from "@/app/types/category";
import CategoryList from "./components/ category-list";
import { CustomLoading } from "@/app/components/customLoading";

export default function Page() {

    const [categories, setCategories] = useState<Category[]>([]);
    const page = 0;
    const perPage = 10;
    const [loading, setLoading] = useState(true);

    async function getCategoriesData() {
        const categoriesData = await getCategories(page, perPage);
        setLoading(false);
        setCategories(categoriesData);
    }
    
    useEffect(() => {
        getCategoriesData();
    }, [page, perPage]);

    return (
        <div>
            {loading && <CustomLoading /> }
            <CategoryList categories={categories}/>
        </div>
    )
}