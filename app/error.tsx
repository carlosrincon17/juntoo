'use client'

import { useEffect } from 'react'

export default function Error({
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
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
            <div className="text-center space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">¡Algo salió mal!</h2>
                <p className="text-gray-500">Ocurrió un error inesperado. Por favor, inténtalo de nuevo.</p>
                <button
                    onClick={reset}
                    className="mt-4 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                    Intentar de nuevo
                </button>
            </div>
        </div>
    )
}
