type Routes = {
    label: string;
    path: string;
    parent?: string;
}

export const ROUTES: Record<string, Routes> = {
    DASHBOARD: {
        label: "Dashboard",
        path: "/dashboard",
    },
    CATEGORIES: {
        label: "Categories",
        path: "/dashboard/categories",
        parent: "/dashboard",
    },
    EXPENSES: {
        label: "Expenses",
        path: "/dashboard/expenses",
        parent: "/dashboard",
    },
    INCOMES: {
        label: "Incomes",
        path: "/dashboard/incomes",
        parent: "/dashboard",
    },
}

export const ROUTES_LIST = [
    ROUTES.DASHBOARD,
    ROUTES.CATEGORIES,
    ROUTES.EXPENSES,
    ROUTES.INCOMES,
]