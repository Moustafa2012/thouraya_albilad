import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { Fragment } from 'react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useLanguage } from '@/components/language-provider';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function Breadcrumbs({
    breadcrumbs,
}: {
    breadcrumbs: BreadcrumbItemType[];
}) {
    const { isRTL } = useLanguage();

    if (breadcrumbs.length === 0) return null;

    return (
        <Breadcrumb className="animate-fade-in">
            <BreadcrumbList>
                {breadcrumbs.map((item, index) => {
                    const isLast = index === breadcrumbs.length - 1;
                    return (
                        <Fragment key={index}>
                            <BreadcrumbItem
                                className="animate-fade-in-up"
                                style={{ animationDelay: `${index * 60}ms` }}
                            >
                                {isLast ? (
                                    <BreadcrumbPage className="font-medium text-foreground">
                                        {item.title}
                                    </BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link
                                            href={item.href}
                                            className="text-muted-foreground transition-colors duration-200 hover:text-foreground"
                                        >
                                            {item.title}
                                        </Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>

                            {!isLast && (
                                <BreadcrumbSeparator className="breadcrumb-separator text-muted-foreground/50">
                                    <ChevronRight
                                        className={`h-3.5 w-3.5 transition-transform duration-200 ${
                                            isRTL ? 'rotate-180' : ''
                                        }`}
                                    />
                                </BreadcrumbSeparator>
                            )}
                        </Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}