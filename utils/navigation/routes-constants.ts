type Routes = {
    label: string;
    path: string;
    parent?: string;
}

export const ROUTES: Record<string, Routes> = {
    CATEGORIES: {
        label: "Nuevo Gasto",
        path: "/dashboard/categories",
        parent: "/dashboard",
    },
    DASHBOARD: {
        label: "Dashboard",
        path: "/dashboard",
    },
    SUMMARY: {
        label: "Consolidado",
        path: "/dashboard/summary",
    },
    EXPENSES: {
        label: "Gastos",
        path: "/dashboard/expenses",
        parent: "/dashboard",
    },
    BUDGETS: {
        label: "Presupuestos",
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
    ROUTES.CATEGORIES,
    ROUTES.DASHBOARD,
    ROUTES.SUMMARY,
    ROUTES.EXPENSES,
    ROUTES.BUDGETS,
    ROUTES.SAVINGS,
]