'use client'

import React from 'react';
import { logout } from '../../actions/auth';
import { NavTitle } from './navTitle';
import { NavMenuItems } from './navMenuItems';


export const Sidebar = () => {
    const onLogoutClick = () => {
        logout()
    }
    return (
        <header className="flex flex-wrap md:justify-start md:flex-nowrap z-50 w-full bg-white border-b border-gray-200 dark:bg-neutral-800 dark:border-neutral-700">
            <nav className="relative max-w-screen-2xl w-full mx-auto md:flex md:items-center md:justify-between md:gap-3 py-2 px-6">
                <NavTitle />
                <div id="hs-header-base" className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow md:block "  aria-labelledby="hs-header-base-collapse" >
                    <div className="overflow-hidden overflow-y-auto max-h-[75vh] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
                        <div className="py-2 md:py-0  flex flex-col md:flex-row md:items-center gap-0.5 md:gap-1">
                            <NavMenuItems />
                            <div className="my-2 md:my-0 md:mx-2">
                                <div className="w-full h-px md:w-px md:h-4 bg-gray-100 md:bg-gray-300 dark:bg-neutral-700"></div>
                            </div>
    
                            <div className=" flex flex-wrap items-center gap-x-1.5">
                                <a className="py-[7px] px-2.5 inline-flex items-center font-medium text-sm rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 focus:outline-none focus:bg-gray-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 hover:cursor-pointer" onClick={onLogoutClick}>
                                     Salir
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
};