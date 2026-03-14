import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { home } from '@/routes';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center bg-muted/40 p-6 md:p-10">
            {/* Background decoration */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-foreground/[0.02] blur-3xl" />
                <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-foreground/[0.02] blur-3xl" />
                <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-foreground/[0.02] blur-3xl" />
            </div>

            <div className="relative z-10 flex w-full max-w-md flex-col gap-6">
                {/* Logo */}
                <Link
                    href={home()}
                    className="group mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background shadow-sm transition-all duration-200 hover:shadow-md"
                >
                    <AppLogoIcon className="size-6 fill-current text-foreground transition-transform duration-200 group-hover:scale-105" />
                </Link>

                <Card className="rounded-2xl border-border/50 shadow-lg">
                    <CardHeader className="gap-1 px-8 pt-8 pb-2 text-center">
                        <CardTitle className="text-2xl font-semibold tracking-tight">
                            {title}
                        </CardTitle>
                        {description && (
                            <CardDescription className="text-sm leading-relaxed">
                                {description}
                            </CardDescription>
                        )}
                    </CardHeader>
                    <CardContent className="px-8 pb-8 pt-4">
                        {children}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}