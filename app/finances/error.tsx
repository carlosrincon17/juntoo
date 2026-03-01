'use client'

import { useEffect } from 'react'

export default function FinancesError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="text-center space-y-2">
                <h2 className="text-xl font-semibold text-gray-900">Error al cargar los datos</h2>
                <p className="text-gray-500">No pudimos obtener la información financiera. Por favor, inténtalo de nuevo.</p>
            </div>
            <button
                onClick={reset}
                className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
                Intentar de nuevo
            </button>
        </div>
    )
}
