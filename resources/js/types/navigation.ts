import type { ComponentType, ReactNode } from 'react';

/**
 * Breadcrumb item for navigation
 */
export interface BreadcrumbItem {
    /** Display title for the breadcrumb */
    title: string;
    /** Navigation href (optional for last item) */
    href?: string;
    /** Optional icon component */
    icon?: ReactNode;
    /** Whether this is the current/active page */
    current?: boolean;
}

/**
 * Layout error type
 */
export interface LayoutError {
    message: string;
    code?: string;
    details?: unknown;
}

/**
 * Props for app layout components
 */
export interface AppLayoutProps {
    /** Child components to render in the main content area */
    children: ReactNode;
    
    /** Breadcrumb navigation items */
    breadcrumbs?: BreadcrumbItem[];
    
    /** Optional controlled sidebar collapsed state (sidebar layout only) */
    sidebarCollapsed?: boolean;
    
    /** Callback when sidebar toggle is clicked (sidebar layout only) */
    onSidebarToggle?: () => void;
    
    /** Additional CSS class for the root container */
    className?: string;
    
    /** Additional CSS class for the content area */
    contentClassName?: string;
    
    /** Additional CSS class for the sidebar (sidebar layout only) */
    sidebarClassName?: string;
    
    /** Additional CSS class for the header (header layout only) */
    headerClassName?: string;
    
    /** Optional content to render in the header (header layout only) */
    headerContent?: ReactNode;
    
    /** Whether to show breadcrumbs (default: true) */
    showBreadcrumbs?: boolean;
    
    /** Loading state for the entire layout */
    loading?: boolean;
    
    /** Error state for the layout */
    error?: LayoutError;
    
    /** Whether the header should be sticky (header layout only, default: true) */
    stickyHeader?: boolean;
    
    /** Maximum content width (header layout only, default: 'full') */
    maxWidth?: 'sm' | 'md' | 'lg' | 'full';
    
    /** Optional metadata for the page */
    metadata?: {
        title?: string;
        description?: string;
    };
}

/**
 * Props for AppShell component
 */
export interface AppShellProps {
    children: ReactNode;
    variant?: 'sidebar' | 'full' | 'centered';
    className?: string;
}

/**
 * Props for AppContent component
 */
export interface AppContentProps {
    children: ReactNode;
    variant?: 'sidebar' | 'full' | 'centered';
    className?: string;
}

/**
 * Props for AppSidebar component
 */
export interface AppSidebarProps {
    collapsed?: boolean;
    onToggle?: () => void;
    className?: string;
}

/**
 * Props for AppSidebarHeader component
 */
export interface AppSidebarHeaderProps {
    breadcrumbs: BreadcrumbItem[];
    onSidebarToggle?: () => void;
    className?: string;
}

/**
 * Props for AppHeader component
 */
export interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
    children?: ReactNode;
    className?: string;
    sticky?: boolean;
}

export interface NavItem {
    title: string;
    href: string;
    icon?: ComponentType<{ className?: string }>;
    badge?: string | number;
    count?: number;
    items?: NavItem[];
}
