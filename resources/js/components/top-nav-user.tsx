import { usePage } from '@inertiajs/react';
import { ChevronsUpDown } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import type { User } from '@/types';

export function TopNavUser() {
    const { auth } = usePage().props as {
        auth?: { user?: User & { role?: string; email_verified_at?: string | null } };
    };

    const user = auth?.user ?? null;

    if (!user) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="h-9 gap-2 px-2 text-foreground hover:bg-accent"
                >
                    <div className="flex min-w-0 items-center gap-2">
                        <UserInfo user={user as any} size="sm" />
                    </div>
                    <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="min-w-64 rounded-xl" align="end" side="bottom">
                <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 p-3">
                        <UserInfo user={user as any} showEmail size="md" />
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <UserMenuContent user={user as any} />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

