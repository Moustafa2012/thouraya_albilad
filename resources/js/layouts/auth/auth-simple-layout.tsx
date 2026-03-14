import { Link, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props as { name?: string };

    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center bg-background px-4 py-12">
            {/* Subtle background pattern */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
                style={{
                    backgroundImage:
                        'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                }}
            />

            <div className="relative z-10 w-full max-w-sm">
                {/* Logo mark */}
                <div className="mb-10 flex flex-col items-center gap-4">
                    <Link
                        href={home()}
                        className="group flex flex-col items-center gap-3"
                    >
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-background shadow-sm transition-shadow duration-200 group-hover:shadow-md">
                            <AppLogoIcon className="size-6 fill-current text-foreground" />
                        </div>
                        {name && (
                            <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                                {name}
                            </span>
                        )}
                    </Link>

                    <div className="space-y-1 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                            {title}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {description}
                        </p>
                    </div>
                </div>

                {/* Form content */}
                <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
                    {children}
                </div>
            </div>
        </div>
    );
}