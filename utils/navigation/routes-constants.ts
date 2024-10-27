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
        label: "Categorias",
        path: "/dashboard/categories",
        parent: "/dashboard",
    },
    EXPENSES: {
        label: "Gastos",
        path: "/dashboard/expenses",
        parent: "/dashboard",
    },
    BUDGETS: {
        label: "Presupuesto",
        path: "/dashboard/budgets",
        parent: "/dashboard",
    },
    SAVINGS: {
        label: "Ahorros",
        path: "/dashboard/savings", 
        parent: "/dashboard",
    },
}

export const ROUTES_LIST = [
    ROUTES.DASHBOARD,
    ROUTES.CATEGORIES,
    ROUTES.EXPENSES,
    ROUTES.BUDGETS,
    ROUTES.SAVINGS,
]