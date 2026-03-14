import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { useLanguage } from '@/components/language-provider';
import { Badge } from '@/components/ui/badge';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

interface NavMainProps {
    items?: NavItem[];
    label?: string;
    showLabel?: boolean;
}

export function NavMain({ 
    items = [], 
    label,
    showLabel = true,
}: NavMainProps) {
    const { isCurrentUrl } = useCurrentUrl();
    const { t, direction } = useLanguage();

    const defaultLabel = t('Platform', 'المنصة');
    const groupLabel = label || defaultLabel;

    const isParentActive = (item: NavItem): boolean => {
        if (item.items) {
            return item.items.some(
                (child: NavItem) =>
                    isCurrentUrl(child.href) || isParentActive(child),
            );
        }
        return false;
    };

    const renderNavItem = (item: NavItem): ReactNode => {
        const hasChildren = item.items && item.items.length > 0;
        const isActive = isCurrentUrl(item.href);
        const hasActiveChild = hasChildren && isParentActive(item);

        if (hasChildren) {
            return (
                <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={hasActiveChild}
                >
                    <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                                tooltip={{ children: item.title }}
                                isActive={hasActiveChild}
                            >
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                                {item.badge && (
                                    <Badge 
                                        variant="secondary" 
                                        className="ml-auto px-1.5 py-0.5 text-xs"
                                    >
                                        {item.badge}
                                    </Badge>
                                )}
                                <ChevronRight
                                    className={`ml-auto transition-transform ${
                                        direction === 'rtl' ? 'rotate-180' : ''
                                    } group-data-[state=open]:rotate-90`}
                                />
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <SidebarMenuSub>
                                {item.items?.map((subItem: NavItem) => (
                                    <SidebarMenuSubItem key={subItem.title}>
                                        <SidebarMenuSubButton
                                            asChild
                                            isActive={isCurrentUrl(subItem.href)}
                                        >
                                            <Link href={subItem.href} prefetch>
                                                {subItem.icon && <subItem.icon />}
                                                <span>{subItem.title}</span>
                                                {subItem.badge && (
                                                    <Badge 
                                                        variant="secondary" 
                                                        className="ml-auto px-1.5 py-0.5 text-xs"
                                                    >
                                                        {subItem.badge}
                                                    </Badge>
                                                )}
                                            </Link>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                ))}
                            </SidebarMenuSub>
                        </CollapsibleContent>
                    </SidebarMenuItem>
                </Collapsible>
            );
        }

        return (
            <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={{ children: item.title }}
                >
                    <Link href={item.href} prefetch>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        {item.badge && (
                            <Badge 
                                variant="secondary" 
                                className="ml-auto px-1.5 py-0.5 text-xs"
                            >
                                {item.badge}
                            </Badge>
                        )}
                        {item.count !== undefined && item.count > 0 && (
                            <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                                {item.count > 99 ? '99+' : item.count}
                            </span>
                        )}
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        );
    };

    if (items.length === 0) {
        return null;
    }

    return (
        <SidebarGroup className="px-2 py-0">
            {showLabel && <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>}
            <SidebarMenu>
                {items.map(renderNavItem)}
            </SidebarMenu>
        </SidebarGroup>
    );
}
