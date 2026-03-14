import { Component, type ReactNode, type ErrorInfo } from 'react';
import { useLanguage } from '@/components/language-provider';

/* ── Translated fallback UI ─────────────────────────────────────── */
function DefaultFallback({
    message,
    onReset,
}: {
    message?: string;
    onReset: () => void;
}) {
    const { t } = useLanguage();

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="animate-scale-in w-full max-w-md text-center">
                {/* Icon */}
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                    <svg
                        className="h-8 w-8 text-destructive"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                        />
                    </svg>
                </div>

                <h2 className="mb-2 text-xl font-semibold text-foreground">
                    {t('Something went wrong', 'حدث خطأ ما')}
                </h2>

                {message && (
                    <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                        {message}
                    </p>
                )}

                <button
                    onClick={onReset}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow-md active:scale-95"
                >
                    {t('Try Again', 'حاول مجدداً')}
                </button>
            </div>
        </div>
    );
}

/* ── Content-level fallback (inline) ───────────────────────────── */
function ContentFallback({ onReset }: { onReset: () => void }) {
    const { t } = useLanguage();

    return (
        <div className="animate-fade-in flex flex-col items-center gap-4 p-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <svg
                    className="h-6 w-6 text-destructive"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m9.303 3.376c.866 1.5-.217 3.374-1.948 3.374H4.645c-1.73 0-2.813-1.874-1.948-3.374L10.05 3.378c.866-1.5 3.032-1.5 3.898 0l7.355 12.748z"
                    />
                </svg>
            </div>
            <p className="text-sm text-muted-foreground">
                {t(
                    'Failed to load this section. Please try again.',
                    'فشل تحميل هذا القسم. يرجى المحاولة مرة أخرى.',
                )}
            </p>
            <button
                onClick={onReset}
                className="rounded-md bg-primary/10 px-4 py-2 text-xs font-medium text-primary transition-colors duration-200 hover:bg-primary/20"
            >
                {t('Retry', 'إعادة المحاولة')}
            </button>
        </div>
    );
}

/* ── ErrorBoundary state ─────────────────────────────────────────── */
interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    variant?: 'page' | 'content';
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
        this.handleReset = this.handleReset.bind(this);
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.props.onError?.(error, errorInfo);
    }

    handleReset() {
        this.setState({ hasError: false, error: null });
    }

    render() {
        if (this.state.hasError) {
            /* Custom fallback takes priority */
            if (this.props.fallback) {
                return this.props.fallback;
            }

            /* Inline / content variant */
            if (this.props.variant === 'content') {
                return <ContentFallback onReset={this.handleReset} />;
            }

            /* Full-page default */
            return (
                <DefaultFallback
                    message={this.state.error?.message}
                    onReset={this.handleReset}
                />
            );
        }

        return this.props.children;
    }
}