/**
 * Header Layout Skeleton Component
 * 
 * Provides a loading skeleton for the header-based layout.
 * Mimics the structure of the full header layout for better UX.
 */
export function HeaderLayoutSkeleton() {
    return (
        <div className="flex flex-col h-screen bg-background">
            {/* Header Skeleton */}
            <header className="h-16 border-b bg-card animate-pulse">
                <div className="h-full px-6 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="h-8 w-32 bg-muted rounded" />
                        <div className="hidden md:flex space-x-2">
                            <div className="h-8 w-20 bg-muted rounded" />
                            <div className="h-8 w-20 bg-muted rounded" />
                            <div className="h-8 w-20 bg-muted rounded" />
                        </div>
                    </div>
                    <div className="h-8 w-24 bg-muted rounded" />
                </div>
            </header>

            {/* Breadcrumb Skeleton */}
            <div className="px-6 py-3 border-b bg-card animate-pulse">
                <div className="h-4 bg-muted rounded w-64" />
            </div>

            {/* Page Content Skeleton */}
            <main className="flex-1 p-6 space-y-4 overflow-auto">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-muted rounded w-48" />
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="h-32 bg-muted rounded" />
                        <div className="h-32 bg-muted rounded" />
                        <div className="h-32 bg-muted rounded" />
                    </div>
                    <div className="h-64 bg-muted rounded mt-6" />
                </div>
            </main>
        </div>
    );
}