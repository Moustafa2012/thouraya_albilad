import { Award, Heart, Truck, CheckCircle } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { Card, CardContent } from "@/components/ui/card";
import StarsPattern from "@/components/ui/pattren";

export default function CoreValues() {
  const { t } = useLanguage();

  const values = [
    {
      icon: Award,
      title: t("Excellence in Quality", "التميز في الجودة"),
      description: t(
        "We set new standards in agricultural trade with an unwavering commitment to quality and innovation.",
        "نضع معايير جديدة في التجارة الزراعية مع التزام لا يتزعزع بالجودة والابتكار."
      ),
      points: [
        t("ISO 9001:2015 Certified", "شهادة ISO 9001:2015"),
        t("Premium Product Selection", "اختيار منتجات متميزة"),
        t("Quality Control at Every Step", "مراقبة الجودة في كل خطوة"),
        t("Exceeding Global Standards", "تجاوز المعايير العالمية"),
      ],
    },
    {
      icon: Heart,
      title: t("Customer Care", "العناية بالعملاء"),
      description: t(
        "We build lasting relationships through exceptional service and a personal touch to every customer's needs.",
        "نبني علاقات دائمة من خلال خدمة استثنائية ولمسة شخصية لكل عميل."
      ),
      points: [
        t("24/7 Customer Support", "دعم العملاء على مدار الساعة"),
        t("Customized Solutions", "حلول مخصصة"),
        t("Expert Consultation", "استشارات متخصصة"),
        t("Your Success is Our Priority", "نجاحك هو أولويتنا"),
      ],
    },
    {
      icon: Truck,
      title: t("Reliable Delivery", "توصيل موثوق"),
      description: t(
        "A seamless global distribution network ensures your products arrive efficiently and on time.",
        "شبكة توزيع عالمية سلسة تضمن وصول منتجاتك بكفاءة وفي الوقت المحدد."
      ),
      points: [
        t("Global Shipping Network", "شبكة شحن عالمية"),
        t("Live Shipment Tracking", "تتبع الشحنات مباشرة"),
        t("Express Delivery Options", "خيارات توصيل سريعة"),
        t("On Time, Every Time", "في الوقت المحدد دائماً"),
      ],
    },
  ];

  return (
    <section className="py-20 section-alt scroll-chapter-marker relative">
      <StarsPattern className="opacity-20" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground heading-reveal">
            <span className="line-draw">{t("Our Core Values", "قيمنا الأساسية")}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto body-reveal">
            {t("These principles guide everything we do", "هذه المبادئ توجه كل ما نقوم به")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="card-float bg-card border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 icon-bounce">
                  <value.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{value.title}</h3>
                <p className="text-muted-foreground mb-5 leading-relaxed">{value.description}</p>
                <ul className="space-y-2.5">
                  {value.points.map((point, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
