import { Suspense } from 'react';
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { ErrorBoundary } from '@/components/error-boundary';
import { useLanguage } from '@/components/language-provider';
import { Toaster } from '@/components/ui/toaster';
import type { AppLayoutProps } from '@/types';

/* ── Inline loading skeleton ───────────────────────────────────── */
function SidebarLayoutSkeleton() {
    return (
        <div className="flex min-h-screen w-full">
            {/* Sidebar skeleton */}
            <div className="hidden w-64 shrink-0 border-e border-border bg-sidebar md:flex md:flex-col">
                <div className="flex h-16 items-center gap-3 px-4">
                    <div className="skeleton-shimmer h-8 w-8 rounded-lg" />
                    <div className="skeleton-shimmer h-4 w-28 rounded" />
                </div>
                <div className="flex flex-col gap-2 p-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="skeleton-shimmer h-9 rounded-lg"
                            style={{ animationDelay: `${i * 80}ms` }}
                        />
                    ))}
                </div>
            </div>

            {/* Content skeleton */}
            <div className="flex flex-1 flex-col">
                <div className="flex h-16 items-center border-b border-border px-6">
                    <div className="skeleton-shimmer h-4 w-48 rounded" />
                </div>
                <div className="flex flex-col gap-4 p-6">
                    <div className="skeleton-shimmer h-8 w-64 rounded-lg" />
                    <div className="skeleton-shimmer h-4 w-full rounded" />
                    <div className="skeleton-shimmer h-4 w-3/4 rounded" />
                    <div className="mt-4 skeleton-shimmer h-48 rounded-xl" />
                </div>
            </div>
        </div>
    );
}

/* ── Error state ───────────────────────────────────────────────── */
function SidebarLayoutError({ message, t }: { message: string; t: (en: string, ar: string) => string }) {
    return (
        <AppShell variant="sidebar">
            <div className="flex min-h-screen w-full items-center justify-center p-4">
                <div className="animate-scale-in w-full max-w-sm text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                        <svg
                            className="h-7 w-7 text-destructive"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z"
                            />
                        </svg>
                    </div>
                    <h2 className="mb-2 text-lg font-semibold text-foreground">
                        {t('Something went wrong', 'حدث خطأ ما')}
                    </h2>
                    <p className="mb-6 text-sm text-muted-foreground">{message}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all duration-200 hover:bg-primary/90 active:scale-95"
                    >
                        {t('Refresh Page', 'تحديث الصفحة')}
                    </button>
                </div>
            </div>
        </AppShell>
    );
}

/* ── Layout ────────────────────────────────────────────────────── */
export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
    sidebarCollapsed,
    onSidebarToggle,
    className,
    contentClassName,
    sidebarClassName,
    showBreadcrumbs = true,
    loading = false,
    error,
}: AppLayoutProps) {
    const { t } = useLanguage();

    if (loading) {
        return <SidebarLayoutSkeleton />;
    }

    if (error) {
        return <SidebarLayoutError message={error.message} t={t} />;
    }

    return (
        <ErrorBoundary>
            <AppShell variant="sidebar" className={className}>
                {/* Sidebar */}
                <Suspense
                    fallback={
                        <div className="hidden w-64 shrink-0 border-e border-border bg-sidebar md:block" />
                    }
                >
                    <AppSidebar
                        collapsed={sidebarCollapsed}
                        onToggle={onSidebarToggle}
                        className={sidebarClassName}
                    />
                </Suspense>

                {/* Main content */}
                <AppContent
                    variant="sidebar"
                    className={contentClassName}
                >
                    {/* Top header bar */}
                    {showBreadcrumbs && (
                        <Suspense
                            fallback={
                                <div className="h-16 border-b border-border bg-background" />
                            }
                        >
                            <AppSidebarHeader
                                breadcrumbs={breadcrumbs}
                                onSidebarToggle={onSidebarToggle}
                            />
                        </Suspense>
                    )}

                    {/* Page content */}
                    <ErrorBoundary variant="content">
                        <Suspense
                            fallback={
                                <div className="flex items-center justify-center p-12">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                        <p className="text-xs text-muted-foreground">
                                            {t('Loading…', 'جاري التحميل…')}
                                        </p>
                                    </div>
                                </div>
                            }
                        >
                            <div className="page-enter">
                                {children}
                            </div>
                        </Suspense>
                    </ErrorBoundary>
                </AppContent>

                <Toaster />
            </AppShell>
        </ErrorBoundary>
    );
}