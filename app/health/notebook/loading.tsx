export default function NotebookLoading() {
    return (
        <div className="space-y-8">
            <div className="space-y-3">
                <div className="h-12 w-64 animate-pulse rounded-2xl bg-white/60" />
                <div className="h-5 w-full max-w-xl animate-pulse rounded-full bg-white/50" />
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
                <div className="h-80 animate-pulse rounded-[28px] bg-white/50" />
                <div className="h-80 animate-pulse rounded-[28px] bg-white/50" />
            </div>
        </div>
    );
}
