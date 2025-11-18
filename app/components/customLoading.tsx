"use client"
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}


interface FinancialLoaderProps {
    className?: string
    text?: string
}

export function CustomLoading({ className, text = "Sincronizando información" }: FinancialLoaderProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center gap-6 h-full", className)}>
            {/* Contenedor del Loader */}
            <div className="relative flex items-center justify-center h-24 w-24">
                <div className="absolute inset-0 rounded-full bg-primary/5 blur-xl animate-pulse" />

                {/* Barras de Gráfico Animadas */}
                <div className="flex items-end justify-center gap-1.5 h-12">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="w-2.5 rounded-full bg-gradient-to-t from-primary to-accent shadow-[0_0_10px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                            style={{
                                animation: `bar-dance 1.2s ease-in-out infinite`,
                                animationDelay: `${i * 0.15}s`,
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Texto de estado opcional */}
            {text && (
                <div className="flex flex-col items-center gap-2">
                    <p className="text-sm font-medium tracking-[0.2em] text-muted-foreground uppercase animate-pulse">
                        {text}
                    </p>
                    <div className="relative h-0.5 w-24 overflow-hidden rounded-full bg-primary/10">
                        <div
                            className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-primary to-transparent"
                            style={{ animation: 'scan-line 1.5s linear infinite' }}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}