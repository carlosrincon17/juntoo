export type Routes = {
    label: string;
    path: string;
    parent?: string;
    labelBreadcrumb?: string;
    subItems?: Routes[];
}

export const FINANCE_ROUTES: Record<string, Routes> = {
    CATEGORIES: {
        label: "Nuevo Gasto",
        path: "/finances/categories",
    },
    DASHBOARD: {
        label: "Tu mes",
        path: "/finances",
        labelBreadcrumb: "Inicio",
    },
    SUMMARY: {
        label: "Consolidado",
        path: "/finances/summary",
        parent: "/finances",
    },
    EXPENSES: {
        label: "Movimientos",
        path: "/finances/expenses",
        parent: "/finances",
    },
    BUDGETS: {
        label: "Presupuestos",
        path: "/finances/budgets",
        parent: "/finances",
    },
    SAVINGS: {
        label: "Ahorros",
        path: "/finances/savings", 
        parent: "/finances",
    },
}

export const ROUTES_LIST: Routes[] = [
    {
        label: "Finanzas",
        path: "/finances",
        subItems: [
            FINANCE_ROUTES.CATEGORIES,
            FINANCE_ROUTES.DASHBOARD,
            FINANCE_ROUTES.SUMMARY,
            FINANCE_ROUTES.EXPENSES,
            FINANCE_ROUTES.BUDGETS,
            FINANCE_ROUTES.SAVINGS,
        ]
    }
    
];