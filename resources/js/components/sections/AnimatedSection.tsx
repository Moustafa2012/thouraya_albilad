import type { ReactNode, JSX } from "react";
import { useEffect, useRef, useState, useCallback } from "react";

// ─── CSS injection (idempotent) ───────────────────────────────────────────────
const STYLE_ID = "animated-section-styles-v2";

function injectStyles() {
  if (typeof document === "undefined" || document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    /* ── Base hidden states ── */
    .sa-hidden { pointer-events: none; }
    .sa-visible { pointer-events: auto; }

    /* ── Shared transition (overridden per animation via custom props) ── */
    [class*="sa-anim-"] {
      will-change: transform, opacity, filter;
      transition:
        opacity    var(--sa-duration, 0.7s) var(--sa-ease, cubic-bezier(0.22, 1, 0.36, 1)) var(--sa-delay, 0s),
        transform  var(--sa-duration, 0.7s) var(--sa-ease, cubic-bezier(0.22, 1, 0.36, 1)) var(--sa-delay, 0s),
        filter     var(--sa-duration, 0.7s) var(--sa-ease, cubic-bezier(0.22, 1, 0.36, 1)) var(--sa-delay, 0s),
        clip-path  var(--sa-duration, 0.7s) var(--sa-ease, cubic-bezier(0.22, 1, 0.36, 1)) var(--sa-delay, 0s);
    }

    /* ── fade-up ── */
    .sa-anim-fade-up.sa-hidden  { opacity: 0; transform: translateY(var(--sa-distance, 40px)); }
    .sa-anim-fade-up.sa-visible { opacity: 1; transform: translateY(0); }

    /* ── fade-down ── */
    .sa-anim-fade-down.sa-hidden  { opacity: 0; transform: translateY(calc(var(--sa-distance, 40px) * -1)); }
    .sa-anim-fade-down.sa-visible { opacity: 1; transform: translateY(0); }

    /* ── fade-left ── */
    .sa-anim-fade-left.sa-hidden  { opacity: 0; transform: translateX(var(--sa-distance, 50px)); }
    .sa-anim-fade-left.sa-visible { opacity: 1; transform: translateX(0); }

    /* ── fade-right ── */
    .sa-anim-fade-right.sa-hidden  { opacity: 0; transform: translateX(calc(var(--sa-distance, 50px) * -1)); }
    .sa-anim-fade-right.sa-visible { opacity: 1; transform: translateX(0); }

    /* ── scale-reveal ── */
    .sa-anim-scale-reveal.sa-hidden  { opacity: 0; transform: scale(var(--sa-scale-from, 0.92)); }
    .sa-anim-scale-reveal.sa-visible { opacity: 1; transform: scale(1); }

    /* ── scale-up ── */
    .sa-anim-scale-up.sa-hidden  { opacity: 0; transform: scale(var(--sa-scale-from, 1.08)); }
    .sa-anim-scale-up.sa-visible { opacity: 1; transform: scale(1); }

    /* ── curtain (clip-path wipe from bottom) ── */
    .sa-anim-curtain.sa-hidden  { clip-path: inset(100% 0% 0% 0%); opacity: 1; }
    .sa-anim-curtain.sa-visible { clip-path: inset(0% 0% 0% 0%); opacity: 1; }

    /* ── curtain-left (clip-path wipe from right) ── */
    .sa-anim-curtain-left.sa-hidden  { clip-path: inset(0% 0% 0% 100%); opacity: 1; }
    .sa-anim-curtain-left.sa-visible { clip-path: inset(0% 0% 0% 0%); opacity: 1; }

    /* ── flip-up (3-D perspective tilt) ── */
    .sa-anim-flip-up.sa-hidden  { opacity: 0; transform: perspective(800px) rotateX(25deg) translateY(var(--sa-distance, 30px)); }
    .sa-anim-flip-up.sa-visible { opacity: 1; transform: perspective(800px) rotateX(0deg)  translateY(0); }

    /* ── blur-in ── */
    .sa-anim-blur-in.sa-hidden  { opacity: 0; filter: blur(var(--sa-blur, 16px)); }
    .sa-anim-blur-in.sa-visible { opacity: 1; filter: blur(0px); }

    /* ── zoom-rotate ── */
    .sa-anim-zoom-rotate.sa-hidden  { opacity: 0; transform: scale(0.82) rotate(var(--sa-rotate, -6deg)); }
    .sa-anim-zoom-rotate.sa-visible { opacity: 1; transform: scale(1)   rotate(0deg); }

    /* ── slide-up-bounce (spring feel) ── */
    .sa-anim-slide-up-bounce.sa-hidden  { opacity: 0; transform: translateY(var(--sa-distance, 60px)) scale(0.97); }
    .sa-anim-slide-up-bounce.sa-visible { opacity: 1; transform: translateY(0) scale(1); }

    /* ── fade-in (plain opacity) ── */
    .sa-anim-fade-in.sa-hidden  { opacity: 0; }
    .sa-anim-fade-in.sa-visible { opacity: 1; }

    /* ── stagger: styles children via CSS sibling logic ── */
    .sa-anim-stagger > * {
      opacity: 0;
      transform: translateY(24px);
      transition:
        opacity   var(--sa-duration, 0.55s) var(--sa-ease, cubic-bezier(0.22, 1, 0.36, 1)),
        transform var(--sa-duration, 0.55s) var(--sa-ease, cubic-bezier(0.22, 1, 0.36, 1));
    }
    .sa-anim-stagger.sa-visible > *:nth-child(1)  { opacity: 1; transform: translateY(0); transition-delay: calc(var(--sa-stagger-delay, 0.08s) * 1); }
    .sa-anim-stagger.sa-visible > *:nth-child(2)  { opacity: 1; transform: translateY(0); transition-delay: calc(var(--sa-stagger-delay, 0.08s) * 2); }
    .sa-anim-stagger.sa-visible > *:nth-child(3)  { opacity: 1; transform: translateY(0); transition-delay: calc(var(--sa-stagger-delay, 0.08s) * 3); }
    .sa-anim-stagger.sa-visible > *:nth-child(4)  { opacity: 1; transform: translateY(0); transition-delay: calc(var(--sa-stagger-delay, 0.08s) * 4); }
    .sa-anim-stagger.sa-visible > *:nth-child(5)  { opacity: 1; transform: translateY(0); transition-delay: calc(var(--sa-stagger-delay, 0.08s) * 5); }
    .sa-anim-stagger.sa-visible > *:nth-child(6)  { opacity: 1; transform: translateY(0); transition-delay: calc(var(--sa-stagger-delay, 0.08s) * 6); }
    .sa-anim-stagger.sa-visible > *:nth-child(7)  { opacity: 1; transform: translateY(0); transition-delay: calc(var(--sa-stagger-delay, 0.08s) * 7); }
    .sa-anim-stagger.sa-visible > *:nth-child(8)  { opacity: 1; transform: translateY(0); transition-delay: calc(var(--sa-stagger-delay, 0.08s) * 8); }
    .sa-anim-stagger.sa-visible > *:nth-child(9)  { opacity: 1; transform: translateY(0); transition-delay: calc(var(--sa-stagger-delay, 0.08s) * 9); }
    .sa-anim-stagger.sa-visible > *:nth-child(10) { opacity: 1; transform: translateY(0); transition-delay: calc(var(--sa-stagger-delay, 0.08s) * 10); }
    .sa-anim-stagger.sa-visible > *:nth-child(11) { opacity: 1; transform: translateY(0); transition-delay: calc(var(--sa-stagger-delay, 0.08s) * 11); }
    .sa-anim-stagger.sa-visible > *:nth-child(12) { opacity: 1; transform: translateY(0); transition-delay: calc(var(--sa-stagger-delay, 0.08s) * 12); }

    /* ── Respect reduced motion ── */
    @media (prefers-reduced-motion: reduce) {
      [class*="sa-anim-"] { transition: opacity 0.15s ease !important; }
      [class*="sa-anim-"].sa-hidden  { opacity: 0; transform: none !important; filter: none !important; clip-path: none !important; }
      [class*="sa-anim-"].sa-visible { opacity: 1; transform: none !important; filter: none !important; clip-path: none !important; }
      .sa-anim-stagger > * { transform: none !important; transition: opacity 0.15s ease !important; }
    }
  `;
  document.head.appendChild(style);
}

// ─── Types ────────────────────────────────────────────────────────────────────
export type AnimationType =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "fade-in"
  | "scale-reveal"
  | "scale-up"
  | "curtain"
  | "curtain-left"
  | "flip-up"
  | "blur-in"
  | "zoom-rotate"
  | "slide-up-bounce"
  | "stagger";

export interface AnimatedSectionProps {
  children: ReactNode;
  /** Delay before animation triggers after threshold is crossed (seconds) */
  delay?: number;
  className?: string;
  animation?: AnimationType;
  /** Transition duration in seconds. @default 0.7 */
  duration?: number;
  /** CSS easing function. @default "cubic-bezier(0.22, 1, 0.36, 1)" */
  ease?: string;
  /** Translate distance for directional animations (px). @default 40 */
  distance?: number;
  /** Per-child delay step for "stagger" animation (seconds). @default 0.08 */
  staggerDelay?: number;
  /** When true, the animation only plays once and won't reset on scroll-out. @default true */
  once?: boolean;
  /** IntersectionObserver threshold (0–1). @default 0.06 */
  threshold?: number;
  /** IntersectionObserver rootMargin. @default "0px 0px -40px 0px" */
  rootMargin?: string;
  /** Called when element enters the viewport */
  onEnter?: () => void;
  /** Called when element leaves the viewport (only if once=false) */
  onLeave?: () => void;
  /** HTML tag to render as. @default "div" */
  as?: keyof JSX.IntrinsicElements;
  /** Additional inline style */
  style?: React.CSSProperties;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AnimatedSection({
  children,
  delay = 0,
  className = "",
  animation = "fade-up",
  duration = 0.7,
  ease = "cubic-bezier(0.22, 1, 0.36, 1)",
  distance = 40,
  staggerDelay = 0.08,
  once = true,
  threshold = 0.06,
  rootMargin = "0px 0px -40px 0px",
  onEnter,
  onLeave,
  as: Tag = "div",
  style,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  const handleEnter = useCallback(
    (el: HTMLElement) => {
      timerRef.current = setTimeout(() => {
        el.classList.remove("sa-hidden");
        el.classList.add("sa-visible");
        setHasAnimated(true);
        onEnter?.();
      }, delay * 1000);
    },
    [delay, onEnter]
  );

  const handleLeave = useCallback(
    (el: HTMLElement) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      el.classList.remove("sa-visible");
      el.classList.add("sa-hidden");
      onLeave?.();
    },
    [onLeave]
  );

  useEffect(() => {
    injectStyles();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Apply CSS custom properties for tuneable values
    el.style.setProperty("--sa-duration", `${duration}s`);
    el.style.setProperty("--sa-ease", ease);
    el.style.setProperty("--sa-distance", `${distance}px`);
    el.style.setProperty("--sa-stagger-delay", `${staggerDelay}s`);
    el.style.setProperty("--sa-delay", "0s");

    el.classList.add(`sa-anim-${animation}`, "sa-hidden");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (once && hasAnimated) return;
            handleEnter(el);
          } else {
            if (once && hasAnimated) return;
            handleLeave(el);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [animation, delay, duration, ease, distance, staggerDelay, once, threshold, rootMargin, hasAnimated, handleEnter, handleLeave]);

  return (
    // @ts-expect-error — polymorphic "as" prop is safe here
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}