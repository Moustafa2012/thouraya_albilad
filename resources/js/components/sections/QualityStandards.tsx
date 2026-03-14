import { Gem, Users, Lightbulb, ThumbsUp, ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { StarsPattern } from "@/components/ui/pattren";

const CARD_CONFIG = [
  {
    gradient: "from-violet-500/8 to-purple-500/4",
    iconBg: "bg-violet-500/10",
    iconText: "text-violet-500 dark:text-violet-400",
    ring: "ring-violet-500/20",
    numText: "text-violet-500/60 dark:text-violet-400/40",
  },
  {
    gradient: "from-sky-500/8 to-blue-500/4",
    iconBg: "bg-sky-500/10",
    iconText: "text-sky-500 dark:text-sky-400",
    ring: "ring-sky-500/20",
    numText: "text-sky-500/60 dark:text-sky-400/40",
  },
  {
    gradient: "from-amber-500/8 to-orange-500/4",
    iconBg: "bg-amber-500/10",
    iconText: "text-amber-500 dark:text-amber-400",
    ring: "ring-amber-500/20",
    numText: "text-amber-500/60 dark:text-amber-400/40",
  },
  {
    gradient: "from-emerald-500/8 to-green-500/4",
    iconBg: "bg-emerald-500/10",
    iconText: "text-emerald-500 dark:text-emerald-400",
    ring: "ring-emerald-500/20",
    numText: "text-emerald-500/60 dark:text-emerald-400/40",
  },
] as const;

export default function QualityStandards() {
  const { t } = useLanguage();

  const standards = [
    {
      icon: Gem,
      title: t("Premium Quality", "جودة متميزة"),
      desc: t(
        "We ensure the highest quality standards in all our products and services, exceeding industry expectations.",
        "نضمن أعلى معايير الجودة في جميع منتجاتنا وخدماتنا، متجاوزين توقعات الصناعة."
      ),
      stat: t("ISO 9001", "ISO 9001"),
    },
    {
      icon: Users,
      title: t("Expert Team", "فريق خبراء"),
      desc: t(
        "Our team of professionals brings years of experience and knowledge to deliver exceptional results.",
        "فريقنا من المحترفين يجلب سنوات من الخبرة والمعرفة لتقديم نتائج استثنائية."
      ),
      stat: t("10+ Years", "+10 سنوات"),
    },
    {
      icon: Lightbulb,
      title: t("Innovation", "الابتكار"),
      desc: t(
        "We continuously evolve and apply the latest technologies and practices to stay ahead.",
        "نتطور باستمرار ونطبق أحدث التقنيات والممارسات للبقاء في المقدمة."
      ),
      stat: t("Cutting-Edge", "تقنية متقدمة"),
    },
    {
      icon: ThumbsUp,
      title: t("Customer Satisfaction", "رضا العملاء"),
      desc: t(
        "Your satisfaction is our top priority, backed by our quality guarantee and dedicated support team.",
        "رضاكم هو أولويتنا القصوى، مدعوماً بضمان الجودة وفريق دعم مخصص."
      ),
      stat: t("98% Satisfied", "98% راضون"),
    },
  ];

  return (
    <section id="quality" className="py-20 scroll-chapter-marker relative overflow-hidden">
      <StarsPattern />

      {/* Background decorations */}
      <div className="absolute end-0 top-0 w-80 h-80 bg-primary/4 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute start-0 bottom-0 w-64 h-64 bg-primary/3 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <Badge variant="secondary" className="mb-4 px-3 py-1 text-sm font-medium">
            {t("Our Standards", "معاييرنا")}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground heading-reveal">
            <span className="line-draw">{t("Our Quality Standards", "معايير الجودة لدينا")}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto body-reveal leading-relaxed">
            {t(
              "We are committed to excellence in everything we do. Our quality standards guide our approach to ensure expectations are consistently exceeded.",
              "نحن ملتزمون بالتميز في كل ما نقوم به. معايير الجودة لدينا توجه نهجنا لضمان تجاوز التوقعات باستمرار."
            )}
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {standards.map((item, index) => {
            const config = CARD_CONFIG[index];
            return (
              <Card
                key={index}
                className={`card-float group relative overflow-hidden bg-gradient-to-br ${config.gradient} border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
              >
                <CardContent className="p-7 text-center">
                  {/* Large background number */}
                  <div
                    className={`absolute top-2 end-3 text-6xl font-black ${config.numText} select-none pointer-events-none tabular-nums leading-none`}
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  {/* Icon */}
                  <div
                    className={`w-16 h-16 rounded-2xl ${config.iconBg} flex items-center justify-center mx-auto mb-5 icon-bounce ring-1 ${config.ring} shadow-sm relative z-10`}
                    style={{ animationDelay: `${0.15 + index * 0.08}s` }}
                  >
                    <item.icon className={`h-8 w-8 ${config.iconText}`} />
                  </div>

                  {/* Title */}
                  <h3 className={`text-base font-bold mb-3 text-foreground group-hover:${config.iconText} transition-colors duration-300`}>
                    {item.title}
                  </h3>

                  {/* Desc */}
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{item.desc}</p>

                  {/* Stat badge */}
                  <Badge variant="outline" className={`text-xs ${config.iconText} border-current/30 bg-background/60`}>
                    {item.stat}
                  </Badge>

                  {/* Bottom accent */}
                  <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 group-hover:w-12 ${config.iconBg.replace('/10', '/50')} rounded-full transition-all duration-500`} />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}