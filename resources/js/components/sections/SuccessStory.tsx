import { Eye, Target, Rocket, Shield, Leaf, TrendingUp } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { StarsPattern } from "@/components/ui/pattren";

const ICON_CONFIG = [
  { bg: "bg-violet-500/10", text: "text-violet-500 dark:text-violet-400", ring: "ring-violet-500/20" },
  { bg: "bg-emerald-500/10", text: "text-emerald-500 dark:text-emerald-400", ring: "ring-emerald-500/20" },
  { bg: "bg-sky-500/10",    text: "text-sky-500 dark:text-sky-400",    ring: "ring-sky-500/20" },
  { bg: "bg-primary/10",    text: "text-primary",                       ring: "ring-primary/20" },
  { bg: "bg-green-500/10",  text: "text-green-500 dark:text-green-400",  ring: "ring-green-500/20" },
] as const;

export default function SuccessStory() {
  const { t } = useLanguage();

  const goals = [
    {
      icon: Eye,
      title: t("Our Future Vision", "رؤيتنا المستقبلية"),
      desc: t(
        "We aim to be the global leader in sustainable agricultural trade.",
        "نهدف لأن نكون الرواد عالمياً في التجارة الزراعية المستدامة."
      ),
      tag: t("Vision", "رؤية"),
    },
    {
      icon: Target,
      title: t("Our Mission", "مهمتنا"),
      desc: t(
        "Delivering high-quality agricultural products while adhering to global standards and sustainable practices.",
        "تقديم منتجات زراعية عالية الجودة مع الالتزام بالمعايير العالمية والممارسات المستدامة."
      ),
      tag: t("Mission", "مهمة"),
    },
    {
      icon: Rocket,
      title: t("Our Strategic Goals", "أهدافنا الاستراتيجية"),
      desc: t(
        "Developing innovative solutions in agricultural trade.",
        "تطوير حلول مبتكرة في مجال التجارة الزراعية."
      ),
      tag: t("Strategy", "استراتيجية"),
    },
    {
      icon: Shield,
      title: t("Uncompromised Quality", "جودة لا تُضاهى"),
      desc: t(
        "Commitment to the highest global quality standards.",
        "الالتزام بأعلى معايير الجودة العالمية."
      ),
      tag: t("Quality", "جودة"),
    },
    {
      icon: Leaf,
      title: t("Sustainable Development", "التنمية المستدامة"),
      desc: t(
        "Supporting sustainable agricultural practices.",
        "دعم الممارسات الزراعية المستدامة."
      ),
      tag: t("Sustainability", "استدامة"),
    },
  ];

  return (
    <section id="about" className="py-20 scroll-chapter-marker relative overflow-hidden">
      <StarsPattern />

      {/* Background decoration */}
      <div className="absolute start-0 top-1/2 -translate-y-1/2 w-72 h-72 bg-primary/4 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <Badge variant="secondary" className="mb-4 px-3 py-1 text-sm font-medium">
            {t("About Us", "من نحن")}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground heading-reveal">
            <span className="line-draw">{t("Our Success Story", "قصة نجاحنا")}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto body-reveal leading-relaxed">
            {t(
              "We are a leading company in agricultural trade, committed to the highest standards of quality and sustainability to provide the best products to our valued customers.",
              "نحن شركة رائدة في التجارة الزراعية، ملتزمون بأعلى معايير الجودة والاستدامة لتقديم أفضل المنتجات لعملائنا الكرام."
            )}
          </p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {goals.map((goal, i) => {
            const config = ICON_CONFIG[i % ICON_CONFIG.length];
            const isWide = i === 0;
            return (
              <Card
                key={i}
                className={`card-float group bg-card border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
                  isWide ? "sm:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <CardContent className="p-7">
                  {/* Icon + badge row */}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl ${config.bg} flex items-center justify-center icon-bounce ring-1 ${config.ring}`}
                      style={{ animationDelay: `${0.1 + i * 0.07}s` }}
                    >
                      <goal.icon className={`h-6 w-6 ${config.text}`} />
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs border-current/20 ${config.text} bg-transparent`}
                    >
                      {goal.tag}
                    </Badge>
                  </div>

                  <h3 className={`text-lg font-bold mb-2.5 text-foreground group-hover:${config.text} transition-colors duration-300`}>
                    {goal.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{goal.desc}</p>

                  {/* Hover accent line */}
                  <div className={`mt-4 h-0.5 w-0 group-hover:w-12 bg-current ${config.text} rounded-full transition-all duration-500`} />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}