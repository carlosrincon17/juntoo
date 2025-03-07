export type Routes = {
    label: string;
    path: string;
    parent?: string;
    labelBreadcrumb?: string;
    subItems?: Routes[];
}

export const FINANCE_ROUTES: Record<string, Routes> = {
    CATEGORIES: {
        label: "Categoria",
        path: "/finances/categories",
    },
    DASHBOARD: {
        label: "Gastos",
        path: "/finances",
        labelBreadcrumb: "Gastos",
    },
    MONTHlY_REPORT: {
        label: "Reporte mensual",
        path: "/finances/monthly-report",
        parent: "/finances",
    },
    SUMMARY: {
        label: "Consolidado",
        path: "/finances/summary",
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
    SETTINGS: {
        label: "Configuraciones",
        path: "/finances/settings", 
        parent: "/finances",
    },
}

const GOAL_ROUTES = {
    PROGRESS_GOALS: {
        label: "Tu progreso",
        path: "/goals",
    },
    FAMILY_GOALS: {
        label: "Metas familiares",
        path: "/goals/family",
    },
    PERSONAL_GOALS: {
        label: "Metas personales",
        path: "/goals/personal",
    },
}

const PLANNER_ROUTES = {
    TASKS: {
        label: "Tareas",
        path: "/planner",
    },
}

export const ROUTES_LIST: Routes[] = [
    {
        label: "Finanzas",
        path: "/finances",
        subItems: [
            FINANCE_ROUTES.CATEGORIES,
            FINANCE_ROUTES.MONTHlY_REPORT,
            FINANCE_ROUTES.DASHBOARD,
            FINANCE_ROUTES.SUMMARY,
            FINANCE_ROUTES.BUDGETS,
            FINANCE_ROUTES.SAVINGS,
            FINANCE_ROUTES.SETTINGS
        ]
    },
    {
        label: "Metas",
        path: "/goals",
        subItems: [
            GOAL_ROUTES.PROGRESS_GOALS,
            GOAL_ROUTES.FAMILY_GOALS,
            GOAL_ROUTES.PERSONAL_GOALS,
        ]
    },
    {
        label: "Planificación",
        path: "/planner",
        subItems: [
            PLANNER_ROUTES.TASKS,
        ]
    },
    
];

