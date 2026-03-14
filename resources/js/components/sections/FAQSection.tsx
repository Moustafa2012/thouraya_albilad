import { HelpCircle, Search, MessageSquare } from "lucide-react";
import { useState, useMemo } from "react";
import { useLanguage } from "@/components/language-provider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import StarsPattern from "@/components/ui/pattren";

export default function FAQSection() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const FAQ_CATEGORIES = [
    { id: "all",      label: t("All", "الكل") },
    { id: "products", label: t("Products", "المنتجات") },
    { id: "delivery", label: t("Delivery", "التوصيل") },
    { id: "payment",  label: t("Payment", "الدفع") },
    { id: "orders",   label: t("Orders", "الطلبات") },
  ] as const;

  const faqs = [
    {
      category: "products",
      q: t("Are your products halal certified?", "هل منتجاتكم حلال معتمدة؟"),
      a: t(
        "Yes, all our meat and poultry products are 100% halal certified by recognized Islamic authorities. We also clearly label all imported products with halal certification information.",
        "نعم، جميع منتجاتنا من اللحوم والدواجن حلال 100% ومعتمدة من الجهات الإسلامية المعترف بها. كما نوضح معلومات شهادة الحلال على جميع المنتجات المستوردة."
      ),
    },
    {
      category: "delivery",
      q: t("Which cities in Saudi Arabia do you deliver to?", "ما هي المدن التي تقومون بالتوصيل إليها في السعودية؟"),
      a: t(
        "We currently deliver to all major cities in Saudi Arabia including Riyadh, Jeddah, Dammam, Mecca, Medina, Khobar, Dhahran, Tabuk, Abha, Khamis Mushait, Jubail, Taif, Hail, Najran, Jizan, Buraidah, Hofuf, and their surrounding areas.",
        "نقوم حالياً بالتوصيل إلى جميع المدن الرئيسية في المملكة العربية السعودية بما في ذلك الرياض وجدة والدمام ومكة والمدينة والخبر والظهران وتبوك وأبها وخميس مشيط والجبيل والطائف وحائل ونجران وجيزان وبريدة والهفوف والمناطق المحيطة بها."
      ),
    },
    {
      category: "delivery",
      q: t("How long does delivery take?", "كم يستغرق التوصيل؟"),
      a: t(
        "Delivery times vary by location: Major cities (Riyadh, Jeddah): Same-day delivery for orders placed before 11 AM. Other cities: 1-2 business days. Remote areas: 2-4 business days. Express delivery options are available in select locations.",
        "تختلف أوقات التوصيل حسب الموقع: المدن الرئيسية (الرياض، جدة): توصيل في نفس اليوم للطلبات قبل 11 صباحاً. المدن الأخرى: 1-2 أيام عمل. المناطق النائية: 2-4 أيام عمل. تتوفر خيارات التوصيل السريع في مواقع مختارة."
      ),
    },
    {
      category: "payment",
      q: t("What payment methods do you accept?", "ما هي طرق الدفع المقبولة؟"),
      a: t(
        "We accept multiple payment methods including: All major credit and debit cards (Visa, Mastercard, American Express, mada), Apple Pay and Google Pay, Cash on delivery, Bank transfers, and STC Pay.",
        "نقبل عدة طرق دفع تشمل: جميع بطاقات الائتمان والخصم الرئيسية (فيزا، ماستركارد، أمريكان إكسبريس، مدى)، أبل باي وجوجل باي، الدفع عند الاستلام، التحويلات البنكية، و STC Pay."
      ),
    },
    {
      category: "delivery",
      q: t("How do you handle delivery of perishable food items?", "كيف تتعاملون مع توصيل المواد الغذائية القابلة للتلف؟"),
      a: t(
        "We use specialized temperature-controlled vehicles and packaging to maintain the quality and safety of perishable items. Refrigerated and frozen products are packed with ice packs or dry ice as needed.",
        "نستخدم مركبات وتغليف خاص للتحكم في درجة الحرارة للحفاظ على جودة وسلامة المواد القابلة للتلف. يتم تعبئة المنتجات المبردة والمجمدة بأكياس ثلج أو ثلج جاف حسب الحاجة."
      ),
    },
    {
      category: "orders",
      q: t("What is the minimum order value for delivery?", "ما هو الحد الأدنى لقيمة الطلب للتوصيل؟"),
      a: t(
        "Yes, our standard minimum order value is 600 SAR.",
        "نعم، الحد الأدنى القياسي لقيمة الطلب هو 600 ريال سعودي."
      ),
    },
    {
      category: "orders",
      q: t("Can I track my order?", "هل يمكنني تتبع طلبي؟"),
      a: t(
        "Yes, all deliveries can be tracked in real-time through our app or website. Once your order is dispatched, you'll receive an SMS and email with a tracking link.",
        "نعم، يمكن تتبع جميع عمليات التوصيل في الوقت الفعلي عبر تطبيقنا أو موقعنا الإلكتروني. بمجرد إرسال طلبك، ستتلقى رسالة نصية وبريد إلكتروني مع رابط التتبع."
      ),
    },
  ];

  const filteredFaqs = useMemo(() => {
    let list = faqs;
    if (activeFilter !== "all") {
      list = list.filter((f) => f.category === activeFilter);
    }
    if (search.trim()) {
      const query = search.toLowerCase().trim();
      list = list.filter(
        (f) =>
          f.q.toLowerCase().includes(query) ||
          f.a.toLowerCase().includes(query)
      );
    }
    return list;
  }, [search, activeFilter, faqs]);

  return (
    <section id="faq" className="py-20 scroll-chapter-marker relative overflow-hidden">
      <StarsPattern />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 px-3 py-1 text-sm font-medium gap-1.5">
            <HelpCircle className="h-3.5 w-3.5" />
            {t("FAQ", "الأسئلة الشائعة")}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground heading-reveal">
            <span className="line-draw">{t("Frequently Asked Questions", "الأسئلة الشائعة")}</span>
          </h2>
          <p className="text-muted-foreground text-lg body-reveal">
            {t(
              "Answers to common questions about our products, payment methods, and delivery services",
              "إجابات على الأسئلة الشائعة حول منتجاتنا وطرق الدفع وخدمات التوصيل"
            )}
          </p>
        </div>

        {/* Search + filters */}
        <div className="space-y-4 mb-8">
          <div className="relative">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder={t("Search questions...", "ابحث في الأسئلة...")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ps-9 bg-card border-border/60 focus:border-primary/40 transition-colors"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {FAQ_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                  activeFilter === cat.id
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "border-border/60 text-muted-foreground hover:border-primary/40 hover:text-primary bg-card"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ accordion */}
        {filteredFaqs.length > 0 ? (
          <Accordion type="single" collapsible className="space-y-2.5">
            {filteredFaqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border border-border/50 rounded-xl px-5 bg-card hover:border-primary/30 transition-colors duration-200 shadow-sm"
              >
                <AccordionTrigger className="text-sm font-semibold text-foreground hover:text-primary py-5 text-start gap-3 [&[data-state=open]]:text-primary">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed text-sm">
                  <div className="pt-1 border-t border-border/30">
                    <p className="mt-4">{faq.a}</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="text-center py-16">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium mb-1">
              {t("No results found", "لا توجد نتائج")}
            </p>
            <p className="text-muted-foreground/60 text-sm">
              {t("Try a different search term or category", "جرب مصطلح بحث أو فئة مختلفة")}
            </p>
          </div>
        )}

        {/* Contact prompt */}
        <div className="mt-10 p-5 rounded-xl border border-border/50 bg-card text-center">
          <MessageSquare className="h-6 w-6 text-primary mx-auto mb-2" />
          <p className="text-sm font-medium text-foreground mb-1">
            {t("Still have questions?", "لا تزال لديك أسئلة؟")}
          </p>
          <p className="text-xs text-muted-foreground mb-3">
            {t("Our support team is here to help", "فريق الدعم لدينا هنا للمساعدة")}
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            {t("Contact Us", "تواصل معنا")}
          </a>
        </div>
      </div>
    </section>
  );
}