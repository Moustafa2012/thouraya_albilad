import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  MapPin,
  Phone,
  Clock,
  Handshake,
  ChevronDown,
} from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useLanguage } from "@/components/language-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { STATS, TRUST_POINTS, BRANCHES } from "@/data_store/Hero.data";

type Branch = {
  city: string;
  region: string;
  address: string;
  phone: string;
  hours: string;
};

type Stat = {
  icon: (typeof STATS)[number]["icon"];
  value: (typeof STATS)[number]["value"];
  label: string;
};

// ── Animated counter hook ──────────────────────────────────────────────────────
function useCountUp(target: string, duration = 1800, isVisible = false) {
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!isVisible) return;

    // Extract numeric part and suffix
    const match = target.match(/^([0-9,.]+)(.*)$/);
    if (!match) { setDisplay(target); return; }

    const rawNum = parseFloat(match[1].replace(/,/g, ""));
    const suffix = match[2] || "";
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * rawNum);
      setDisplay(current.toLocaleString() + suffix);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [target, duration, isVisible]);

  return display;
}

function StatCard({ stat, isVisible }: { stat: Stat; isVisible: boolean }) {
  const count = useCountUp(stat.value, 1600, isVisible);
  return (
    <div className="text-center p-4 md:p-5 rounded-xl bg-background/60 backdrop-blur-md border border-white/10 shadow-lg hover:border-primary/30 transition-all duration-300 group">
      <stat.icon className="h-5 w-5 md:h-6 md:w-6 text-primary mx-auto mb-2.5 group-hover:scale-110 transition-transform duration-300" />
      <div className="text-2xl md:text-3xl font-extrabold text-foreground mb-0.5 tabular-nums">
        {count}
      </div>
      <div className="text-xs text-muted-foreground font-medium leading-tight">
        {stat.label}
      </div>
    </div>
  );
}

function BranchCard({ branch }: { branch: Branch }) {
  const { t } = useLanguage();
  return (
    <Card className="bg-background/60 backdrop-blur-md border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-md group">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-foreground">{branch.city}</CardTitle>
          <Badge variant="outline" className="text-xs border-primary/30 text-primary">{t("Branch", "الفرع")}</Badge>
        </div>
        <p className="text-xs text-muted-foreground">{branch.region}</p>
      </CardHeader>
      <Separator className="mb-3 opacity-50" />
      <CardContent className="pt-0 space-y-2">
        {[
          { Icon: MapPin, text: branch.address },
          { Icon: Phone, text: branch.phone },
          { Icon: Clock, text: branch.hours },
        ].map(({ Icon, text }) => (
          <div key={text} className="flex items-start gap-2">
            <Icon className="h-3.5 w-3.5 text-primary mt-0.5 flex-shrink-0" />
            <span className="text-xs text-muted-foreground leading-snug">{text}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function Hero() {
  const { t, direction } = useLanguage();
  const [showVideo, setShowVideo] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const ArrowIcon = direction === "rtl" ? ArrowLeft : ArrowRight;

  const translatedStats: Stat[] = STATS.map((stat) => ({
    icon: stat.icon,
    value: stat.value,
    label: t(stat.label.en, stat.label.ar),
  }));

  const translatedTrustPoints = TRUST_POINTS.map((point) =>
    t(point.en, point.ar),
  );

  const translatedBranches: Branch[] = BRANCHES.map((branch) => ({
    city: t(branch.city.en, branch.city.ar),
    region: t(branch.region.en, branch.region.ar),
    address: t(branch.address.en, branch.address.ar),
    phone: branch.phone,
    hours: t(branch.hours.en, branch.hours.ar),
  }));

  useEffect(() => {
    // Delay entrance animation
    const t1 = setTimeout(() => setLoaded(true), 100);
    const t2 = setTimeout(() => {
      setShowVideo(true);
      const v = videoRef.current;
      if (v) { v.muted = true; v.play().catch(() => {}); }
    }, 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Trigger counter when stats section is visible
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="hero" className="py-5 section-alt scroll-chapter-marker relative overflow-hidden">
      {/* Background media */}
      <div className="absolute inset-0">
        <img
          src="/assets/hero-bg-f6wg_3sN.jpg"
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${showVideo ? "opacity-0" : "opacity-100"}`}
        />
        <video
          ref={videoRef}
          src="/assets/hero-video-1xwHPH8E.mp4"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${showVideo ? "opacity-100" : "opacity-0"}`}
          playsInline muted loop
        />
        {/* Multi-layer gradients for depth */}
       <div className="absolute inset-0 bg-gradient-to-r from-background/35 via-background/15 to-transparent" />
       <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent" />
       <div className="absolute inset-x-0 top-0 h-[30%] bg-gradient-to-b from-background/10 to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto relative z-10 py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 ">
          {/* Trust badge */}
          <div
            className={`mb-6 transition-all duration-700 delay-100 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Badge
              variant="secondary"
              className="text-sm px-4 py-2 gap-2 shadow-lg border border-primary/20 bg-background/80 backdrop-blur-sm"
            >
              <Handshake className="h-4 w-4 text-primary" />
              {t("Your Trusted Partner in Global Agricultural Trade", "شريكك الموثوق في تجارة المنتجات الزراعية عالمياً")}
            </Badge>
          </div>

          {/* Headline */}
          <div
            className={`mb-6 transition-all duration-700 delay-200 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.1] text-foreground">
              {t("Thouraya Albilad", "ثريا البلاد")}{" "}
              <span className="text-primary relative">
                {t("Trading", "للتجارة")}
              </span>
            </h1>
          </div>

          {/* Subheading */}
          <div
            className={`mb-10 transition-all duration-700 delay-300 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg">
              {t(
                "Innovative solutions tailored to your unique needs. We combine expertise with cutting-edge technology to deliver exceptional results.",
                "حلول مبتكرة مصممة وفقاً لاحتياجاتك. نجمع بين الخبرة والتقنية المتقدمة لنقدم نتائج استثنائية."
              )}
            </p>
          </div>

          {/* CTAs */}
          <div
            className={`flex flex-col sm:flex-row gap-3 mb-14 transition-all duration-700 delay-[400ms] ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <Button size="lg" className="text-base px-8 shadow-lg group" asChild>
              <a href="#products" className="flex items-center gap-2">
                {t("Browse Products", "تصفح المنتجات")}
                <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base px-8 bg-background/50 backdrop-blur-sm border-2 shadow-lg hover:bg-background/70 transition-all"
              asChild
            >
              <a href="#contact">{t("Contact Us", "تواصل معنا")}</a>
            </Button>
          </div>

          {/* Stats */}
          <div
            ref={statsRef}
            className={`grid grid-cols-3 gap-2.5 md:gap-3 max-w-lg mb-12 transition-all duration-700 delay-500 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {translatedStats.map((stat) => (
              <StatCard key={stat.label} stat={stat} isVisible={statsVisible} />
            ))}
          </div>

          {/* Trust points */}
          {translatedTrustPoints?.length > 0 && (
            <div
              className={`flex flex-wrap gap-x-5 gap-y-2.5 mb-12 transition-all duration-700 delay-[600ms] ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              {translatedTrustPoints.map((point) => (
                <div key={point} className="flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                  <span className="text-xs font-medium text-muted-foreground">{point}</span>
                </div>
              ))}
            </div>
          )}

          {/* Branches */}
          {translatedBranches?.length > 0 && (
            <div
              className={`transition-all duration-700 delay-700 ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                {t("Our Branches", "فروعنا")}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {translatedBranches.map((branch) => (
                  <BranchCard key={branch.city} branch={branch} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-muted-foreground/60 hover:text-primary transition-colors group"
        aria-label={t("Scroll down", "اسحب للأسفل")}
      >
        <span className="text-xs font-medium opacity-80">{t("Scroll", "اسحب")}</span>
        <ChevronDown className="h-5 w-5 animate-bounce" />
      </a>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
