import { Clock, ArrowLeft, ArrowRight, User, Calendar, BookOpen, Eye } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { ArticlesModal } from "@/components/sections/Modals/atriclesModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StarsPattern } from "@/components/ui/pattren";
import { Separator } from "@/components/ui/separator";
import { useArticlesStore } from "@/lib/articles.store";

export default function ArticlesSection() {
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { t, direction } = useLanguage();
  const { articles } = useArticlesStore();

  const lang = direction === "rtl" ? "ar" : "en";

  const formattedArticles = articles.map((article) => ({
    ...article,
    title: article.title[lang],
    desc: article.desc[lang],
    category: article.category[lang],
    date: article.date[lang],
    readTime: article.readTime[lang],
    fullContent: article.fullContent[lang],
  }));

  const featured = formattedArticles.slice(0, 1).map((a) => ({ ...a, featured: true }));
  const secondary = formattedArticles.slice(1, 3).map((a) => ({ ...a, featured: false }));
  const remaining = formattedArticles.slice(3).map((a) => ({ ...a, featured: false }));

  const handleReadMore = (article: any) => {
    setSelectedArticle(article);
    setIsOpen(true);
  };

  const ReadMoreArrow = direction === "rtl" ? ArrowLeft : ArrowRight;

  return (
    <section id="articles" className="py-20 section-alt scroll-chapter-marker relative overflow-hidden">
      <StarsPattern />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <Badge variant="secondary" className="mb-4 px-3 py-1 text-sm font-medium gap-1.5">
            <BookOpen className="h-3.5 w-3.5" />
            {t("Knowledge Hub", "مركز المعرفة")}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground heading-reveal">
            <span className="line-draw">{t("Scientific Articles", "المقالات العلمية")}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto body-reveal">
            {t(
              "Latest research published in peer-reviewed scientific journals on nutrition and health",
              "أحدث الأبحاث المنشورة في المجلات العلمية المحكمة حول التغذية والصحة"
            )}
          </p>
        </div>

        {/* Featured article (hero) */}
        {featured.map((article, i) => (
          <Card
            key={i}
            className="group mb-6 bg-card border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl overflow-hidden cursor-pointer"
            onClick={() => handleReadMore(article)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleReadMore(article)}
          >
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image */}
              {article.heroImage && (
                <div className="relative h-56 md:h-auto overflow-hidden md:order-last">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent z-10 md:hidden" />
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent to-background/5 z-10 hidden md:block" />
                  <img
                    src={article.heroImage}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 end-4 z-20 flex items-center gap-2">
                    <Badge className="bg-primary text-primary-foreground shadow-md">
                      {t("Featured", "مميز")}
                    </Badge>
                  </div>
                </div>
              )}

              {/* Content */}
              <CardContent className="p-7 md:p-8 flex flex-col justify-between">
                <div>
                  <Badge variant="secondary" className="mb-4 text-xs">{article.category}</Badge>
                  <h3 className="text-2xl md:text-3xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors duration-200 leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-5 line-clamp-3">{article.desc}</p>
                  {article.author && (
                    <div className="flex items-center gap-2 mb-5 text-sm text-muted-foreground">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="font-medium text-foreground">{article.author}</span>
                    </div>
                  )}
                </div>
                <div>
                  <Separator className="mb-4 opacity-50" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />{article.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />{article.readTime}
                      </span>
                    </div>
                    <Button
                      variant="default"
                      size="sm"
                      className="gap-1.5 text-xs"
                      onClick={(e) => { e.stopPropagation(); handleReadMore(article); }}
                    >
                      {t("Read Article", "اقرأ المقال")}
                      <ReadMoreArrow className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}

        {/* Secondary articles (2-column) */}
        {secondary.length > 0 && (
          <div className="grid md:grid-cols-2 gap-5 mb-5">
            {secondary.map((article, i) => (
              <Card
                key={i}
                className="group bg-card border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg overflow-hidden cursor-pointer"
                onClick={() => handleReadMore(article)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleReadMore(article)}
              >
                {article.heroImage && (
                  <div className="relative h-44 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent z-10" />
                    <img
                      src={article.heroImage}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 end-3 z-20">
                      <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm text-xs">
                        {article.category}
                      </Badge>
                    </div>
                  </div>
                )}
                <CardContent className="p-5">
                  <h3 className="font-bold text-base mb-2 text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3 line-clamp-2">{article.desc}</p>
                  {article.author && (
                    <div className="flex items-center gap-1.5 mb-3 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span className="line-clamp-1">{article.author}</span>
                    </div>
                  )}
                  <Separator className="mb-3 opacity-50" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{article.date}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{article.readTime}</span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleReadMore(article); }}
                      className="text-xs font-semibold text-primary flex items-center gap-1 hover:gap-2 transition-all duration-200"
                    >
                      {t("Read More", "اقرأ المزيد")}
                      <ReadMoreArrow className="h-3 w-3" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Remaining articles (compact list) */}
        {remaining.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {remaining.map((article, i) => (
              <Card
                key={i}
                className="group bg-card border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-md cursor-pointer"
                onClick={() => handleReadMore(article)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleReadMore(article)}
              >
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2.5">
                    <Badge variant="secondary" className="text-xs">{article.category}</Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />{article.readTime}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm mb-2 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">{article.desc}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{article.date}</span>
                    <span className="text-primary font-medium flex items-center gap-1">
                      {t("Read", "اقرأ")} <ReadMoreArrow className="h-3 w-3" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {selectedArticle && (
        <ArticlesModal article={selectedArticle} open={isOpen} onOpenChange={setIsOpen} />
      )}
    </section>
  );
}