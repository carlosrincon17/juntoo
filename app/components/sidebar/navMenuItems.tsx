import { Routes, ROUTES_LIST } from "@/utils/navigation/routes-constants";
import { usePathname } from 'next/navigation';
import { FaChartPie, FaBullseye, FaTasks } from 'react-icons/fa';
import Link from 'next/link';

// Map labels to icons for a richer sidebar experience
const getIconForRoute = (label: string) => {
    switch (label) {
    case "Finanzas": return <FaChartPie className="w-4 h-4" />;
    case "Metas": return <FaBullseye className="w-4 h-4" />;
    case "Planificación": return <FaTasks className="w-4 h-4" />;
    default: return <div className="w-4 h-4" />;
    }
}

export const NavMenuItems = () => {
    const pathname = usePathname();

    const renderSingleItem = (item: Routes) => {
        const isActive = pathname === item.path || pathname?.startsWith(`${item.path}/`);

        return (
            <div key={item.path} className="mb-1">
                <Link
                    className={`flex items-center gap-x-3.5 py-2.5 px-3 rounded-xl text-sm font-medium transition-colors ${isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                    href={item.path}
                >
                    {getIconForRoute(item.label)}
                    {item.label}
                </Link>
            </div>
        )
    }

    const renderDropdownItem = (item: Routes) => {
        const isActiveOrChildActive = item.subItems?.some(subItem =>
            pathname === subItem.path || pathname?.startsWith(`${subItem.path}/`)
        ) || pathname === item.path;

        return (
            <div className={`hs-accordion mb-1 ${isActiveOrChildActive ? 'active' : ''}`} id={`accordion-${item.label.replace(/\s+/g, '-')}`} key={item.label}>
                <button
                    type="button"
                    className={`hs-accordion-toggle w-full flex items-center gap-x-3.5 py-2.5 px-3 mb-1 rounded-xl text-sm font-medium transition-colors ${isActiveOrChildActive
                        ? 'text-blue-600 bg-blue-50/50'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                    aria-expanded={isActiveOrChildActive ? "true" : "false"}
                    aria-controls={`accordion-collapse-${item.label.replace(/\s+/g, '-')}`}
                >
                    {getIconForRoute(item.label)}
                    {item.label}

                    <svg className="hs-accordion-active:block ms-auto hidden w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg>
                    <svg className="hs-accordion-active:hidden ms-auto block w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                </button>

                <div
                    id={`accordion-collapse-${item.label.replace(/\s+/g, '-')}`}
                    className={`hs-accordion-content w-full overflow-hidden transition-[height] duration-300 ${isActiveOrChildActive ? 'block' : 'hidden'}`}
                >
                    <div className="pt-1 pb-2 ps-10 relative">
                        {/* Decorative line to connect subitems */}
                        <div className="absolute left-6 top-1 bottom-3 w-px bg-gray-200"></div>

                        <div className="flex flex-col space-y-1">
                            {item.subItems?.map((subItem) => {
                                const isSubActive = pathname === subItem.path;
                                return (
                                    <Link
                                        className={`relative py-1.5 px-3 flex items-center text-sm rounded-lg transition-colors ${isSubActive
                                            ? 'text-blue-600 font-medium'
                                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                        href={subItem.path}
                                        key={subItem.path}
                                    >
                                        <div className={`absolute -left-5 w-2 h-2 rounded-full border-[1.5px] ${isSubActive ? 'border-blue-600 bg-white' : 'border-gray-200 bg-gray-50'}`}></div>
                                        {subItem.label}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const renderItems = () => {
        return ROUTES_LIST.map((item) => {
            if (item.subItems) {
                return renderDropdownItem(item);
            }
            return renderSingleItem(item);
        })
    }

    return (
        <div className="w-full flex flex-col">
            {renderItems()}
        </div>
    )
};