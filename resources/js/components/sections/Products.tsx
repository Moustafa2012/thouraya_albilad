import { Star, ShieldCheck, Leaf, Award, TrendingUp, SlidersHorizontal, X } from "lucide-react";
import { useState, useMemo } from "react";
import { useLanguage } from "@/components/language-provider";
import { ProductsModal } from "@/components/sections/Modals/productsModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StarsPattern } from "@/components/ui/pattren";
import useProductsStore from "@/lib/products.store";

// ── Star display helper ──────────────────────────────────────────────────────
function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of ${max} stars`}>
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${
            i < Math.floor(rating)
              ? "fill-yellow-500 text-yellow-500"
              : i < rating
              ? "fill-yellow-500/50 text-yellow-500"
              : "text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  );
}

export default function ProductsSection() {
  const { t, language } = useLanguage();
  const {
    activeCategory, setActiveCategory,
    selectedProduct, setSelectedProduct,
    isModalOpen, setIsModalOpen,
    getFilteredProducts, getFeaturedCount, getAverageRating,
    categories, products,
  } = useProductsStore();

  const getTranslated = (en: string, ar: string) => language === "ar" ? ar : en;

  const filtered = getFilteredProducts();
  const featuredCount = getFeaturedCount();
  const avgRating = getAverageRating();

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const hasActiveFilter = activeCategory !== "all";

  return (
    <section id="products" className="py-20 section-alt relative overflow-hidden">
      <StarsPattern />

      {/* Background decoration */}
      <div className="absolute end-0 top-1/3 w-96 h-96 bg-primary/4 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <Award className="h-4 w-4" />
            <span className="text-sm font-semibold">{t("High Quality Products", "منتجات عالية الجودة")}</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
            {t("Our Featured Products", "منتجاتنا المميزة")}
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-8">
            {t(
              "We offer a diverse range of premium agricultural products carefully selected from the world's finest sources.",
              "نقدم مجموعة متنوعة من المنتجات الزراعية الفاخرة المختارة بعناية من أفضل المصادر العالمية."
            )}
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            {[
              {
                icon: <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />,
                value: avgRating,
                label: t("Avg. Rating", "متوسط التقييم"),
              },
              {
                icon: <TrendingUp className="h-4 w-4 text-primary" />,
                value: featuredCount,
                label: t("Featured", "منتج مميز"),
              },
              {
                icon: <Leaf className="h-4 w-4 text-green-600" />,
                value: "100%",
                label: t("Natural", "طبيعي"),
              },
              {
                icon: <ShieldCheck className="h-4 w-4 text-primary" />,
                value: products?.length || 0,
                label: t("Total Products", "إجمالي المنتجات"),
              },
            ].map(({ icon, value, label }) => (
              <div key={label} className="flex items-center gap-2 bg-card px-4 py-2 rounded-full border border-border/50 shadow-sm">
                {icon}
                <span className="font-bold text-foreground tabular-nums">{value}</span>
                <span className="text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category filters */}
        <div className="mb-10">
          <div className="flex flex-wrap justify-center items-center gap-2">
            <div className="flex items-center gap-1.5 text-muted-foreground me-2">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="text-sm font-medium hidden sm:inline">{t("Filter:", "تصفية:")}</span>
            </div>
            {categories.map((cat) => {
              const count = cat.id !== "all"
                ? (products?.filter((p) => p.category === cat.id).length || 0)
                : products?.length || 0;
              const isActive = activeCategory === cat.id;
              return (
                <Button
                  key={cat.id}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`rounded-full transition-all duration-200 ${
                    isActive ? "shadow-md" : "hover:border-primary/40 hover:text-primary"
                  }`}
                >
                  {getTranslated(cat.label, cat.label_ar || cat.label)}
                  <Badge
                    variant={isActive ? "secondary" : "outline"}
                    className="ms-1.5 px-1.5 py-0 text-xs min-w-[1.2rem] text-center"
                  >
                    {count}
                  </Badge>
                </Button>
              );
            })}
            {hasActiveFilter && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveCategory("all")}
                className="rounded-full text-muted-foreground hover:text-destructive gap-1 text-xs"
              >
                <X className="h-3 w-3" />
                {t("Clear", "مسح")}
              </Button>
            )}
          </div>
        </div>

        {/* Products grid */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((product, index) => (
              <Card
                key={index}
                className="overflow-hidden bg-card border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group cursor-pointer"
                onClick={() => handleProductClick(product)}
                style={{ animationDelay: `${index * 40}ms` }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleProductClick(product)}
                aria-label={`${getTranslated(product.name, product.name_ar)} - ${t("Click for details", "اضغط للتفاصيل")}`}
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={product.image}
                    alt={getTranslated(product.name, product.name_ar)}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Top badges */}
                  <div className="absolute top-3 start-3 flex flex-col gap-1.5">
                    {product.featured && (
                      <Badge className="bg-primary text-primary-foreground shadow-md text-xs">
                        <Award className="h-3 w-3 me-1" />
                        {t("Featured", "مميز")}
                      </Badge>
                    )}
                  </div>

                  {/* Rating badge */}
                  <div className="absolute top-3 end-3 flex items-center gap-1 bg-background/95 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-lg">
                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                    <span className="text-xs font-bold text-foreground">{product.rating}</span>
                  </div>

                  {/* Hover CTA */}
                  <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <div className="text-center">
                      <span className="inline-block text-white text-xs font-semibold bg-primary/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                        {t("View Details", "عرض التفاصيل")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <CardContent className="p-4">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-2.5">
                    {product.tags.slice(0, 2).map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-xs px-2 py-0.5">
                        {getTranslated(tag, product.tags_ar?.[i] || tag)}
                      </Badge>
                    ))}
                    {product.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs px-2 py-0.5">
                        +{product.tags.length - 2}
                      </Badge>
                    )}
                  </div>

                  {/* Name */}
                  <h3 className="text-base font-bold mb-1.5 text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-1">
                    {getTranslated(product.name, product.name_ar)}
                  </h3>

                  {/* Star rating display */}
                  <div className="flex items-center gap-2 mb-2">
                    <StarRating rating={product.rating} />
                    <span className="text-xs text-muted-foreground">{product.rating}</span>
                  </div>

                  {/* Desc */}
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed line-clamp-2">
                    {getTranslated(product.desc, product.desc_ar)}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <div className="flex items-center gap-1 text-xs text-primary font-medium">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      {t("Guaranteed", "مضمون")}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Leaf className="h-3 w-3 text-green-600" />
                      <span>{t("Natural", "طبيعي")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <SlidersHorizontal className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-lg font-medium mb-2">
              {t("No products in this category", "لا توجد منتجات في هذه الفئة")}
            </p>
            <Button variant="outline" onClick={() => setActiveCategory("all")} className="mt-2">
              {t("Show All Products", "عرض كل المنتجات")}
            </Button>
          </div>
        )}
      </div>

      <ProductsModal product={selectedProduct} open={isModalOpen} onOpenChange={setIsModalOpen} />
    </section>
  );
}