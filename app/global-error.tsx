'use client'
 
export default function GlobalError({
    error,
    reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
    return (
        <html>
            <body>
                <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
                    <h2>Global Error Caught!</h2>
                    <p style={{ color: 'red' }}>{error.message}</p>
                    <pre>{error.stack}</pre>
                    <button onClick={() => reset()}>Try again</button>
                </div>
            </body>
        </html>
    )
}
