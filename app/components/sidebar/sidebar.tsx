'use client'

import React from 'react';
import { logout } from '../../actions/auth';
import { NavTitle } from './navTitle';
import { NavMenuItems } from './navMenuItems';
import { FaSignOutAlt } from 'react-icons/fa';

export const Sidebar = () => {
    const onLogoutClick = () => {
        logout()
    }

    return (
        <>
            {/* Mobile Header */}
            <header className="lg:hidden flex justify-between items-center w-full bg-white border-b border-gray-200 px-4 py-3 z-50 sticky top-0">
                <NavTitle />
                <button type="button" className="text-gray-500 hover:text-gray-600" data-hs-overlay="#application-sidebar" aria-controls="application-sidebar" aria-label="Toggle navigation">
                    <span className="sr-only">Toggle Navigation</span>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="6" y2="6" /><line x1="3" x2="21" y1="12" y2="12" /><line x1="3" x2="21" y1="18" y2="18" /></svg>
                </button>
            </header>

            {/* Sidebar Desktop & Mobile Overlay */}
            <div id="application-sidebar" className="hs-overlay [--auto-close:lg] [-translate-x-full] transition-all duration-300 transform hidden fixed top-0 start-0 bottom-0 z-[60] w-64 bg-white border-e border-gray-200 pt-5 pb-4 overflow-y-auto lg:block lg:translate-x-0 lg:end-auto lg:bottom-0">
                <div className="px-6 mb-8 hidden lg:block">
                    <NavTitle />
                </div>

                <nav className="hs-accordion-group p-4 w-full flex flex-col flex-wrap" data-hs-accordion-always-open>
                    <div className="space-y-1.5 flex-1 overflow-y-auto">
                        <NavMenuItems />
                    </div>
                </nav>

                <div className="absolute bottom-0 w-full p-4 bg-white border-t border-gray-100 flex items-center justify-between gap-2">
                    <button
                        onClick={onLogoutClick}
                        className="flex-1 flex justify-center items-center gap-x-2 py-2.5 px-3 rounded-xl text-sm font-medium text-gray-700 bg-gray-50 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                    >
                        <FaSignOutAlt className="w-4 h-4" />
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </>
    )
};