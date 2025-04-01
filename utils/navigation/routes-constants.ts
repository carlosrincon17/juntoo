export type Routes = {
    label: string;
    path: string;
    parent?: string;
    labelBreadcrumb?: string;
    subItems?: Routes[];
}

export const FINANCE_ROUTES: Record<string, Routes> = {
    DASHBOARD: {
        label: "Dashboard",
        path: "/finances",
        labelBreadcrumb: "Dashboard",
    },
    SUMMARY: {
        label: "Reportes",
        path: "/finances/summary",
        parent: "/finances",
    },
    CONSOLIDATED: {
        label: "Consolidado",
        path: "/finances/savings", 
        parent: "/finances",
    },
    CATEGORIES: {
        label: "Categorias",
        path: "/finances/categories",
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
            FINANCE_ROUTES.DASHBOARD,
            FINANCE_ROUTES.CONSOLIDATED,
            FINANCE_ROUTES.SUMMARY,
            FINANCE_ROUTES.CATEGORIES,
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

