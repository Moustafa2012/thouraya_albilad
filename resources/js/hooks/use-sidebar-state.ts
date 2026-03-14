import { useState, useCallback, useEffect } from 'react';

const SIDEBAR_STORAGE_KEY = 'app-sidebar-collapsed';

/**
 * Hook for managing sidebar collapsed state
 * 
 * Persists state to localStorage and provides toggle functionality.
 * 
 * @param defaultCollapsed - Initial collapsed state (default: false)
 * @returns Tuple of [collapsed state, toggle function, set function]
 * 
 * @example
 * ```tsx
 * const [collapsed, toggleSidebar, setCollapsed] = useSidebarState();
 * 
 * return (
 *   <AppLayout 
 *     sidebarCollapsed={collapsed}
 *     onSidebarToggle={toggleSidebar}
 *   >
 *     {children}
 *   </AppLayout>
 * );
 * ```
 */
export function useSidebarState(defaultCollapsed = false) {
    const [collapsed, setCollapsed] = useState<boolean>(() => {
        if (typeof window === 'undefined') return defaultCollapsed;
        
        try {
            const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
            return stored ? JSON.parse(stored) : defaultCollapsed;
        } catch {
            return defaultCollapsed;
        }
    });

    // Persist to localStorage
    useEffect(() => {
        try {
            localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(collapsed));
        } catch (error) {
            console.warn('Failed to save sidebar state:', error);
        }
    }, [collapsed]);

    const toggle = useCallback(() => {
        setCollapsed(prev => !prev);
    }, []);

    return [collapsed, toggle, setCollapsed] as const;
}

/**
 * Hook for responsive sidebar behavior
 * 
 * Automatically collapses sidebar on mobile and expands on desktop.
 * 
 * @param breakpoint - Pixel width breakpoint (default: 1024)
 * @returns Tuple of [collapsed state, toggle function, isMobile]
 */
export function useResponsiveSidebar(breakpoint = 1024) {
    const [collapsed, toggle, setCollapsed] = useSidebarState();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < breakpoint;
            setIsMobile(mobile);
            
            // Auto-collapse on mobile
            if (mobile && !collapsed) {
                setCollapsed(true);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [breakpoint, collapsed, setCollapsed]);

    return [collapsed, toggle, isMobile] as const;
}