import { Tab, Tabs } from "@heroui/react";

export default function TabsActive({onSelectTab}: { onSelectTab: (tab: string) => void }) {
    return (
        <div className="flex flex-wrap gap-4"> 
            <Tabs  aria-label="Tabs colors" color="primary" radius="full" onSelectionChange={(tab) => onSelectTab(tab.toString())}>
                <Tab key="savings" title="Ahorro"/>
                <Tab key="debts" title="Deudas"/>
                <Tab key="patrimonies" title="Patrimonio"/>
            </Tabs>
        </div>
    )
}