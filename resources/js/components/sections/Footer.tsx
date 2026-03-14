import { Phone, Mail, MapPin, Clock, ArrowRight, ArrowLeft, Send, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import logo from "../../../../public/thouraya-logo.png";

export default function Footer() {
  const { t, direction } = useLanguage();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  const ArrowIcon = direction === "rtl" ? ArrowLeft : ArrowRight;

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setSubscribing(true);
    await new Promise((r) => setTimeout(r, 900));
    setSubscribing(false);
    setSubscribed(true);
    setEmail("");
  };

  const quickLinks = [
    { label: t("About Us", "من نحن"),       href: "#about"    },
    { label: t("Quality", "الجودة"),         href: "#quality"  },
    { label: t("Products", "المنتجات"),      href: "#products" },
    { label: t("Articles", "المقالات"),      href: "#articles" },
    { label: t("FAQ", "الأسئلة الشائعة"),   href: "#faq"      },
    { label: t("Contact Us", "تواصل معنا"), href: "#contact"  },
  ];

  const contactInfo = [
    { icon: Phone, text: "+966550168553",              href: "tel:+966550168553",                dir: "ltr" },
    { icon: Mail,  text: "info@thurayaalbilad.com",    href: "mailto:info@thurayaalbilad.com",   dir: "ltr" },
    { icon: MapPin, text: t("Jeddah, Petromin District", "جدة، حي البترومين"), href: null, dir: undefined },
    { icon: Clock, text: t("Sun - Thu: 9 AM - 5 PM", "الأحد - الخميس: 9 ص - 5 م"), href: null, dir: undefined },
  ];

  return (
    <footer className="bg-card border-t border-border/40 pt-16 pb-8 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/20 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-border to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <a href="#hero" className="flex items-center gap-2.5 mb-4 group w-fit">
              <img
                src={logo}
                alt={t("Thouraya Albilad", "ثريا البلاد")}
                className="h-10 w-10 transition-transform duration-300 group-hover:scale-110"
              />
              <div>
                <h3 className="text-lg font-bold text-foreground leading-tight">
                  {t("Thouraya Albilad", "ثريا البلاد")}
                </h3>
                <p className="text-xs font-semibold text-primary">{t("Trading", "للتجارة")}</p>
              </div>
            </a>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              {t(
                "We are a leading company in agricultural trade, committed to the highest standards of quality and sustainability.",
                "نحن شركة رائدة في التجارة الزراعية، ملتزمون بأعلى معايير الجودة والاستدامة."
              )}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs border-primary/30 text-primary">ISO 9001:2015</Badge>
              <Badge variant="outline" className="text-xs">
                {t("Halal Certified", "حلال معتمد")}
              </Badge>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-bold text-foreground mb-5 text-sm uppercase tracking-wider">
              {t("Quick Links", "روابط سريعة")}
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 group"
                  >
                    <ArrowIcon className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-primary" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="font-bold text-foreground mb-5 text-sm uppercase tracking-wider">
              {t("Contact Us", "تواصل معنا")}
            </h4>
            <ul className="space-y-3">
              {contactInfo.map(({ icon: Icon, text, href, dir }) => (
                <li key={text} className="flex items-center gap-2.5">
                  <Icon className="h-3.5 w-3.5 text-primary shrink-0" />
                  {href ? (
                    <a
                      href={href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      dir={dir as any}
                    >
                      {text}
                    </a>
                  ) : (
                    <span className="text-sm text-muted-foreground" dir={dir as any}>{text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-foreground mb-5 text-sm uppercase tracking-wider">
              {t("Newsletter", "النشرة البريدية")}
            </h4>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              {t(
                "Subscribe to get the latest updates on our products and services",
                "اشترك للحصول على آخر التحديثات عن منتجاتنا وخدماتنا"
              )}
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 font-medium bg-green-500/10 px-4 py-3 rounded-lg">
                <span>✓</span>
                {t("Subscribed successfully!", "تم الاشتراك بنجاح!")}
              </div>
            ) : (
              <form className="flex gap-2" onSubmit={handleSubscribe} noValidate>
                <Input
                  placeholder={t("Your email", "بريدك الإلكتروني")}
                  type="email"
                  dir="ltr"
                  className="flex-1 h-9 text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button size="sm" type="submit" disabled={subscribing} className="h-9 px-3 shrink-0">
                  {subscribing ? (
                    <span className="h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>

        <Separator className="mb-6 opacity-50" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>
            {t(
              "© 2026 All rights reserved to Thuraya Albilad Trading Company",
              "© 2026 جميع الحقوق محفوظة لشركة ثريا البلاد للتجارة"
            )}
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-primary transition-colors">
              {t("Privacy Policy", "سياسة الخصوصية")}
            </a>
            <span className="text-border">·</span>
            <a href="#" className="hover:text-primary transition-colors">
              {t("Terms of Service", "الشروط والأحكام")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}