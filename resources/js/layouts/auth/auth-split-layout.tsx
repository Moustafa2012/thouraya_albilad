import { Link, usePage } from '@inertiajs/react';
import { Shield, Sparkles, Lock, Users, Zap } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

const FEATURE_HIGHLIGHTS = [
    {
        icon: Shield,
        title: 'أمان المؤسسات',
        description: 'تشفير بمستوى البنوك وحماية بالمصادقة الثنائية',
    },
    {
        icon: Zap,
        title: 'وصول فوري',
        description: 'توجيه مبني على الأدوار من أول تسجيل دخول',
    },
    {
        icon: Users,
        title: 'جاهز للفرق',
        description: 'تعاون عبر الأدوار والصلاحيات المختلفة',
    },
    {
        icon: Sparkles,
        title: 'جلسات ذكية',
        description: 'جلسات آمنة ومستمرة لتجربة سلسة',
    },
];

const animationStyles = `
@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&display=swap');

@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeInRight {
    from { opacity: 0; transform: translateX(24px); }
    to   { opacity: 1; transform: translateX(0); }
}
@keyframes shimmerAuth {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
}
@keyframes cardEntrance {
    from { opacity: 0; transform: translateY(16px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes floatOrb {
    0%, 100% { transform: translateY(0px) translateX(0px); }
    33%       { transform: translateY(-12px) translateX(6px); }
    66%       { transform: translateY(6px) translateX(-8px); }
}
@keyframes logoReveal {
    from { opacity: 0; transform: scale(0.8) rotate(-8deg); }
    to   { opacity: 1; transform: scale(1) rotate(0deg); }
}
@keyframes borderPulse {
    0%, 100% { border-color: rgba(255,255,255,0.08); }
    50%       { border-color: rgba(255,255,255,0.2); }
}

.auth-panel { font-family: 'Tajawal', sans-serif; }

.anim-logo        { animation: logoReveal 0.6s cubic-bezier(0.34,1.56,0.64,1) both; }
.anim-tagline     { animation: fadeInUp 0.5s ease both; animation-delay: 0.15s; }
.anim-headline    { animation: fadeInUp 0.55s ease both; animation-delay: 0.25s; }
.anim-subtext     { animation: fadeInUp 0.5s ease both; animation-delay: 0.35s; }
.anim-card-0      { animation: cardEntrance 0.5s ease both; animation-delay: 0.45s; }
.anim-card-1      { animation: cardEntrance 0.5s ease both; animation-delay: 0.55s; }
.anim-card-2      { animation: cardEntrance 0.5s ease both; animation-delay: 0.65s; }
.anim-card-3      { animation: cardEntrance 0.5s ease both; animation-delay: 0.75s; }
.anim-quote       { animation: fadeInUp 0.5s ease both; animation-delay: 0.85s; }
.anim-form-header { animation: fadeInRight 0.55s ease both; animation-delay: 0.2s; }
.anim-form-body   { animation: fadeInRight 0.55s ease both; animation-delay: 0.35s; }

.orb-1 { animation: floatOrb 10s ease-in-out infinite; }
.orb-2 { animation: floatOrb 14s ease-in-out infinite reverse; animation-delay: -4s; }
.orb-3 { animation: floatOrb 18s ease-in-out infinite; animation-delay: -8s; }

.feature-card {
    transition:
        background 0.3s ease,
        border-color 0.3s ease,
        transform 0.3s cubic-bezier(0.34,1.56,0.64,1),
        box-shadow 0.3s ease;
}
.feature-card:hover {
    background: rgba(255,255,255,0.09) !important;
    border-color: rgba(255,255,255,0.18) !important;
    transform: translateY(-3px) scale(1.01);
    box-shadow: 0 12px 40px rgba(0,0,0,0.35);
}

.shimmer-text {
    background: linear-gradient(
        90deg,
        rgba(255,255,255,0.4) 0%,
        rgba(255,255,255,0.85) 45%,
        rgba(255,255,255,0.4) 90%
    );
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmerAuth 4s linear infinite;
}

.form-panel-bg {
    background: radial-gradient(
        ellipse 80% 60% at 50% 0%,
        color-mix(in srgb, var(--primary) 6%, transparent) 0%,
        transparent 70%
    );
}
`;

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props as { name?: string };

    return (
        <>
            <style>{animationStyles}</style>
            <div className="auth-panel relative grid min-h-dvh lg:grid-cols-2" dir="rtl">

                {/* ── Decorative left panel ─────────────────────── */}
                <div className="relative hidden flex-col overflow-hidden bg-background p-10 text-white lg:flex">
                    {/* Subtle grid texture */}
                    <div
                        className="pointer-events-none absolute inset-0 opacity-[0.025]"
                        style={{
                            backgroundImage:
                                'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
                            backgroundSize: '40px 40px',
                        }}
                    />

                    {/* Gradient wash */}
                    <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                            background:
                                'radial-gradient(ellipse 70% 50% at 30% 30%, rgba(255,255,255,0.04) 0%, transparent 70%)',
                        }}
                    />

                    {/* Floating orbs */}
                    <div className="orb-1 pointer-events-none absolute -top-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-white/[0.04] blur-3xl" />
                    <div className="orb-2 pointer-events-none absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-white/[0.03] blur-3xl" />
                    <div className="orb-3 pointer-events-none absolute top-1/2 left-1/3 h-48 w-48 rounded-full bg-white/[0.02] blur-2xl" />

                    {/* Logo */}
                    <Link
                        href={home()}
                        className="anim-logo relative z-10 flex items-center gap-3 text-lg font-semibold"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 transition-all duration-300 hover:bg-white/20 hover:ring-white/35 hover:scale-105">
                            <AppLogoIcon className="size-5 fill-current text-white" />
                        </div>
                        <span className="font-medium text-white/90">
                            {name ?? 'المنصة'}
                        </span>
                    </Link>

                    {/* Center content */}
                    <div className="relative z-10 mt-auto mb-auto flex flex-col gap-10">
                        <div className="space-y-4">
                            <p className="anim-tagline text-xs font-semibold uppercase tracking-[0.22em] text-white/35">
                                موثوق به من فرق حول العالم
                            </p>
                            <h2 className="anim-headline text-4xl font-bold leading-tight text-white">
                                منصة واحدة.
                                <br />
                                <span className="shimmer-text">
                                    كل الأدوار. بلا عوائق.
                                </span>
                            </h2>
                            <p className="anim-subtext max-w-xs text-sm leading-relaxed text-white/45">
                                تحكم مبسّط بالوصول، وصلاحيات فورية، وأمان بمستوى المؤسسات — كل ذلك في مكان واحد.
                            </p>
                        </div>

                        {/* Feature cards */}
                        <div className="grid grid-cols-2 gap-3">
                            {FEATURE_HIGHLIGHTS.map(
                                ({ icon: Icon, title: featureTitle, description: featureDesc }, idx) => (
                                    <div
                                        key={featureTitle}
                                        className={`feature-card anim-card-${idx} flex flex-col gap-2.5 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 backdrop-blur-sm`}
                                    >
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/10">
                                            <Icon className="size-4 text-white/65" />
                                        </div>
                                        <p className="text-sm font-semibold text-white/88">
                                            {featureTitle}
                                        </p>
                                        <p className="text-xs leading-relaxed text-white/38">
                                            {featureDesc}
                                        </p>
                                    </div>
                                ),
                            )}
                        </div>
                    </div>

                    {/* Bottom quote */}
                    <div className="anim-quote relative z-10 border-t border-white/[0.08] pt-5">
                        <p className="text-xs text-white/28">
                            &ldquo;الأمان والسهولة، معاً أخيراً.&rdquo;
                        </p>
                    </div>
                </div>

                {/* ── Form panel ───────────────────────────────── */}
                <div className="form-panel-bg relative flex items-center justify-center bg-background px-6 py-12 sm:px-10">
                    {/* Mobile logo */}
                    <Link
                        href={home()}
                        className="anim-logo absolute top-8 right-1/2 translate-x-1/2 lg:hidden"
                        aria-label="الصفحة الرئيسية"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/5 ring-1 ring-border transition-all duration-300 hover:bg-foreground/10 hover:scale-105">
                            <AppLogoIcon className="size-5 fill-current text-foreground" />
                        </div>
                    </Link>

                    <div className="w-full max-w-sm pt-20 lg:pt-0">
                        {/* Form header */}
                        <div className="anim-form-header mb-8 flex flex-col gap-2">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
                                    <Lock className="size-3.5 text-primary" />
                                </div>
                                <h1 className="text-xl font-semibold text-foreground">
                                    {title}
                                </h1>
                            </div>
                            <p className="ps-9 text-sm leading-relaxed text-muted-foreground">
                                {description}
                            </p>
                        </div>

                        {/* Form content */}
                        <div className="anim-form-body">{children}</div>
                    </div>
                </div>
            </div>
        </>
    );
}