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
    SUMMARY: {
        label: "Consolidado",
        path: "/dashboard/summary",
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
        label: "Presupuestos",
        path: "/dashboard/budgets",
        parent: "/dashboard",
    },
    SAVINGS: {
        label: "Ahorros",
        path: "/dashboard/savings", 
        parent: "/dashboard",
    },
    DEBTS: {
        label: "Deudas",
        path: "/dashboard/debts", 
        parent: "/dashboard",
    },
}

export const ROUTES_LIST = [
    ROUTES.DASHBOARD,
    ROUTES.SUMMARY,
    ROUTES.CATEGORIES,
    ROUTES.EXPENSES,
    ROUTES.BUDGETS,
    ROUTES.SAVINGS,
    ROUTES.DEBTS,
]