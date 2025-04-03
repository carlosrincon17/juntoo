'use client'

import { HeroUIProvider, ToastProvider } from "@heroui/react"

export const Providers = ({children}: { children: React.ReactNode })  => {
    return (
        <HeroUIProvider>
            <main>
                <ToastProvider toastProps={{
                    variant: 'solid', 
                    timeout: 3000,
                    shouldShowTimeoutProgress: true,
                    color: "secondary",
                    classNames: {
                        title: "text-white text-medium mt-2",
                        description: "text-white font-light text-sm mt-2 mb-2",
                        closeButton: "opacity-100 absolute right-4 top-1/2 -translate-y-1/2",
                    },
                }} placement="top-center"/>
                {children}
            </main>
        </HeroUIProvider>
    );
}
