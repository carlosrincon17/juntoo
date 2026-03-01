import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
            <div className="text-center space-y-4">
                <h1 className="text-6xl font-bold text-gray-900">404</h1>
                <h2 className="text-2xl font-semibold text-gray-700">Página no encontrada</h2>
                <p className="text-gray-500">La página que buscas no existe o fue movida.</p>
                <Link
                    href="/"
                    className="inline-block mt-4 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                    Volver al inicio
                </Link>
            </div>
        </div>
    )
}
