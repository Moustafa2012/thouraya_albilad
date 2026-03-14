import { BadgeCheck } from 'lucide-react';
import { useLanguage } from '@/components/language-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import type { User } from '@/types';

type ExtendedUser = User & {
    role?: string;
    email_verified_at?: string | null;
    avatar?: string;
};

type Props = {
    user: ExtendedUser;
    showEmail?: boolean;
    showRole?: boolean;
    size?: 'sm' | 'md' | 'lg';
};

const SIZE_MAP = {
    sm: {
        avatar: 'h-6 w-6',
        name: 'text-xs font-medium',
        email: 'text-[10px]',
    },
    md: {
        avatar: 'h-8 w-8',
        name: 'text-sm font-medium',
        email: 'text-xs',
    },
    lg: {
        avatar: 'h-10 w-10',
        name: 'text-base font-semibold',
        email: 'text-sm',
    },
};

export function UserInfo({
    user,
    showEmail = false,
    showRole = false,
    size = 'md',
}: Props) {
    const getInitials = useInitials();
    const sizes = SIZE_MAP[size];
    const isVerified = Boolean(user.email_verified_at);
    const { t } = useLanguage();

    return (
        <>
            <Avatar
                className={`${sizes.avatar} shrink-0 overflow-hidden rounded-full ring-1 ring-border/50`}
            >
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-full bg-muted text-muted-foreground">
                    {getInitials(user.name)}
                </AvatarFallback>
            </Avatar>

            <div className="grid flex-1 text-left leading-tight">
                <div className="flex items-center gap-1.5">
                    <span className={`truncate ${sizes.name}`}>
                        {user.name}
                    </span>
                    {isVerified && (
                        <BadgeCheck
                            className="size-3.5 shrink-0 text-blue-500"
                            aria-label={t('Verified account', 'حساب موثوق')}
                        />
                    )}
                </div>

                {showEmail && (
                    <span
                        className={`truncate ${sizes.email} text-muted-foreground`}
                    >
                        {user.email}
                    </span>
                )}

                {showRole && user.role && (
                    <span
                        className={`truncate ${sizes.email} font-medium capitalize text-muted-foreground`}
                    >
                        {user.role}
                    </span>
                )}
            </div>
        </>
    );
}
