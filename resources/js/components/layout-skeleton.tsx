/**
 * Layout Skeleton Component
 * 
 * Provides a loading skeleton while the layout is initializing.
 * Mimics the structure of the full layout for better UX.
 */
export function LayoutSkeleton() {
    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar Skeleton */}
            <aside className="w-64 border-r bg-card animate-pulse">
                <div className="p-4 border-b">
                    <div className="h-8 bg-muted rounded" />
                </div>
                <nav className="p-4 space-y-2">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-10 bg-muted rounded" />
                    ))}
                </nav>
            </aside>

            {/* Content Skeleton */}
            <main className="flex-1 flex flex-col">
                {/* Header Skeleton */}
                <header className="h-16 border-b bg-card animate-pulse">
                    <div className="h-full px-6 flex items-center">
                        <div className="h-4 bg-muted rounded w-64" />
                    </div>
                </header>

                {/* Page Content Skeleton */}
                <div className="flex-1 p-6 space-y-4 animate-pulse">
                    <div className="h-8 bg-muted rounded w-48" />
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-64 bg-muted rounded" />
                </div>
            </main>
        </div>
    );
}