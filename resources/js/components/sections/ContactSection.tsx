import { Phone, Mail, Clock, MapPin, MessageCircle, Send, CheckCircle, Copy, Check } from "lucide-react";
import { useState, useCallback } from "react";
import { useLanguage } from "@/components/language-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StarsPattern } from "@/components/ui/pattren";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const MAX_MESSAGE_LENGTH = 1000;

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };
  return (
    <button
      onClick={handleCopy}
      className="ms-1 text-muted-foreground/50 hover:text-primary transition-colors"
      aria-label={copied ? "Copied!" : "Copy"}
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
    </button>
  );
}

export default function ContactSection() {
  const { t } = useLanguage();

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validate = useCallback(() => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = t("Name is required", "الاسم مطلوب");
    if (!form.email.trim()) errs.email = t("Email is required", "البريد الإلكتروني مطلوب");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = t("Invalid email address", "بريد إلكتروني غير صالح");
    if (!form.subject) errs.subject = t("Please select a subject", "الرجاء اختيار الموضوع");
    if (!form.message.trim()) errs.message = t("Message is required", "الرسالة مطلوبة");
    else if (form.message.trim().length < 10)
      errs.message = t("Message is too short", "الرسالة قصيرة جداً");
    return errs;
  }, [form, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000)); // Simulated submit
    setSubmitting(false);
    setSubmitted(true);
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const e = { ...prev }; delete e[field]; return e; });
  };

  const contactItems = [
    {
      icon: Phone,
      title: t("Phone Numbers", "أرقام الهاتف"),
      delay: "0s",
      content: (
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm text-muted-foreground" dir="ltr">
            <span>+966-55-016-8553</span>
            <CopyButton text="+966550168553" />
          </div>
          <a href="https://wa.me/966550168553" className="text-sm text-primary hover:underline flex items-center gap-1.5 mt-1" target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-3.5 w-3.5" />
            {t("Chat on WhatsApp", "تواصل عبر واتساب")}
          </a>
        </div>
      ),
    },
    {
      icon: Mail,
      title: t("Email", "البريد الإلكتروني"),
      delay: "0.1s",
      content: (
        <div className="space-y-1">
          {["support@thourayaalbilad.com", "sales@thourayaalbilad.com"].map((email) => (
            <div key={email} className="flex items-center gap-1" dir="ltr">
              <a href={`mailto:${email}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">{email}</a>
              <CopyButton text={email} />
            </div>
          ))}
        </div>
      ),
    },
    {
      icon: Clock,
      title: t("Working Hours", "ساعات العمل"),
      delay: "0.2s",
      content: (
        <div className="space-y-1 text-sm text-muted-foreground">
          <p>{t("Sunday - Thursday: 9:00 AM - 5:00 PM", "الأحد - الخميس: 9:00 ص - 5:00 م")}</p>
          <p>{t("Friday: Closed", "الجمعة: مغلق")}</p>
          <p>{t("Saturday: 10:00 AM - 3:00 PM", "السبت: 10:00 ص - 3:00 م")}</p>
        </div>
      ),
    },
    {
      icon: MapPin,
      title: t("Our Branches", "فروعنا"),
      delay: "0.3s",
      content: (
        <div className="space-y-3">
          {[
            {
              name: t("Main Branch - Jeddah", "الفرع الرئيسي - جدة"),
              addr: t("King Faisal Road, Petromin District, Jeddah", "طريق الملك فيصل، حي البترومين، جدة"),
              mapsUrl: "https://www.google.com/maps?ll=21.435245,39.191568",
            },
            {
              name: t("Second Branch - Riyadh", "الفرع الثاني - الرياض"),
              addr: t("Riyadh", "الرياض"),
              mapsUrl: "https://www.google.com/maps?ll=24.556047,46.751451",
            },
          ].map((branch) => (
            <div key={branch.name}>
              <p className="text-sm font-semibold text-foreground">{branch.name}</p>
              <p className="text-xs text-muted-foreground mb-1">{branch.addr}</p>
              <a
                href={branch.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <MapPin className="h-3 w-3" />
                {t("View on Map", "عرض على الخريطة")}
              </a>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <section id="contact" className="py-20 section-alt scroll-chapter-marker relative overflow-hidden">
      <StarsPattern />
      <div className="absolute start-0 top-1/4 w-72 h-72 bg-primary/4 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <Badge variant="secondary" className="mb-4 px-3 py-1 text-sm font-medium gap-1.5">
            <MessageCircle className="h-3.5 w-3.5" />
            {t("Contact", "التواصل")}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground heading-reveal">
            <span className="line-draw">{t("Get In Touch", "تواصل معنا")}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto body-reveal">
            {t("Have questions or need assistance? We're just a message away", "هل لديك أسئلة أو تحتاج مساعدة؟ نحن على بُعد رسالة منك")}
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Contact form */}
          <Card className="lg:col-span-3 bg-card border-border/50 shadow-sm">
            <CardContent className="p-7 md:p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {t("Message Sent!", "تم إرسال الرسالة!")}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    {t("We'll get back to you as soon as possible.", "سنتواصل معك في أقرب وقت ممكن.")}
                  </p>
                  <Button variant="outline" onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}>
                    {t("Send Another Message", "إرسال رسالة أخرى")}
                  </Button>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold mb-6 text-foreground">{t("Send Us a Message", "أرسل لنا رسالة")}</h3>
                  <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-sm font-medium">{t("Full Name", "الاسم الكامل")}</Label>
                        <Input
                          id="name"
                          placeholder={t("Your full name", "اسمك الكامل")}
                          value={form.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          className={cn(errors.name && "border-destructive focus-visible:ring-destructive/30")}
                        />
                        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-sm font-medium">{t("Email", "البريد الإلكتروني")}</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your.email@example.com"
                          dir="ltr"
                          value={form.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                          className={cn(errors.email && "border-destructive focus-visible:ring-destructive/30")}
                        />
                        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">{t("Subject", "الموضوع")}</Label>
                      <Select value={form.subject} onValueChange={(v) => handleChange("subject", v)}>
                        <SelectTrigger className={cn(errors.subject && "border-destructive")}>
                          <SelectValue placeholder={t("Select subject", "اختر الموضوع")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">{t("General Inquiry", "استفسار عام")}</SelectItem>
                          <SelectItem value="products">{t("Products Inquiry", "استفسار عن المنتجات")}</SelectItem>
                          <SelectItem value="orders">{t("Orders Inquiry", "استفسار عن الطلبات")}</SelectItem>
                          <SelectItem value="complaints">{t("Complaints", "شكاوى")}</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.subject && <p className="text-xs text-destructive">{errors.subject}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="message" className="text-sm font-medium">{t("Your Message", "رسالتك")}</Label>
                        <span className={cn(
                          "text-xs tabular-nums",
                          form.message.length > MAX_MESSAGE_LENGTH * 0.9 ? "text-destructive" : "text-muted-foreground"
                        )}>
                          {form.message.length}/{MAX_MESSAGE_LENGTH}
                        </span>
                      </div>
                      <Textarea
                        id="message"
                        placeholder={t("How can we help you?", "كيف يمكننا مساعدتك؟")}
                        rows={4}
                        maxLength={MAX_MESSAGE_LENGTH}
                        value={form.message}
                        onChange={(e) => handleChange("message", e.target.value)}
                        className={cn(
                          "resize-none transition-all",
                          errors.message && "border-destructive focus-visible:ring-destructive/30"
                        )}
                      />
                      {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
                    </div>

                    <Button type="submit" size="lg" className="w-full sm:w-auto px-10 gap-2" disabled={submitting}>
                      {submitting ? (
                        <><span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />{t("Sending...", "جاري الإرسال...")}</>
                      ) : (
                        <><Send className="h-4 w-4" />{t("Send Message", "إرسال الرسالة")}</>
                      )}
                    </Button>
                  </form>
                </>
              )}
            </CardContent>
          </Card>

          {/* Contact info cards */}
          <div className="lg:col-span-2 space-y-4">
            {contactItems.map(({ icon: Icon, title, delay, content }) => (
              <Card key={title} className="card-float bg-card border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-md">
                <CardContent className="p-5 flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 icon-bounce"
                    style={{ animationDelay: delay }}
                  >
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-foreground mb-2">{title}</h4>
                    {content}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}