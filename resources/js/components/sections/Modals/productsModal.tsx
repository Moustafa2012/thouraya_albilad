import { 
  Star, Heart, X, ChevronLeft, ChevronRight, Shield, Clock, 
  Thermometer, Settings, Mail, Check, Award, MapPin, Package,
  Leaf, TrendingUp, Info, MessageSquare, Share2
} from "lucide-react";
import * as React from "react";
import { useLanguage } from "@/components/language-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DirectionProvider } from "@/components/ui/direction";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

type ShelfLife = {
  duration: string;
  duration_ar: string;
  note: string;
  note_ar: string;
};

type Storage = {
  temperature: string;
  humidity: string;
  humidity_ar: string;
  instructions: string;
  instructions_ar: string;
};

type Usage = {
  primary: string[];
  primary_ar: string[];
  tip: string;
  tip_ar: string;
};

interface Product {
  name: string;
  name_ar: string;
  category: string;
  category_ar: string;
  rating: number;
  image: string;
  images?: string[];
  tags: string[];
  tags_ar: string[];
  featured: boolean;
  desc: string;
  desc_ar: string;
  origin?: string;
  origin_ar?: string;
  certifications?: string[];
  certifications_ar?: string[];
  benefits?: string[];
  benefits_ar?: string[];
  shelfLife: ShelfLife;
  storage?: Storage;
  usage?: Usage;
  price?: {
    amount: number;
    currency: string;
    unit: string;
    unit_ar: string;
  };
}

interface ProductsModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductsModal({ product, open, onOpenChange }: ProductsModalProps) {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = React.useState("details");
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [isLiked, setIsLiked] = React.useState(false);
  const { language, t } = useLanguage();

  // Reset state when modal opens with new product
  React.useEffect(() => {
    if (open && product) {
      setActiveTab("details");
      setCurrentImageIndex(0);
      setIsLiked(false);
    }
  }, [open, product]);

  if (!product) return null;

  // Use the product's images array for the carousel
  const productImages = product.images || [product.image]; 

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.desc,
      }).catch(() => {});
    }
  };

const content = (
  <div className="w-full">
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Right Image Carousel */}
      <div className="lg:w-[420px] lg:order-2">
        <div className="sticky top-0">
          <div className="relative aspect-square rounded-xl overflow-hidden bg-muted shadow-lg">
            <img
              src={productImages[currentImageIndex]}
              alt={language === 'ar' ? product.name_ar : product.name}
              className="w-full h-full object-cover"
            />
            
            {/* Navigation Arrows */}
            {productImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePrevImage}
                  className={`absolute top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background text-foreground rounded-full w-10 h-10 shadow-lg ${
                    language === 'ar' ? 'right-3' : 'left-3'
                  }`}
                >
                  {language === 'ar' ? (
                    <ChevronRight className="h-5 w-5" />
                  ) : (
                    <ChevronLeft className="h-5 w-5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNextImage}
                  className={`absolute top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background text-foreground rounded-full w-10 h-10 shadow-lg ${
                    language === 'ar' ? 'left-3' : 'right-3'
                  }`}
                >
                  {language === 'ar' ? (
                    <ChevronLeft className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}
                </Button>
              </>
            )}
 
            {/* Top Badges */}
            <div className={`absolute top-4 ${language === 'ar' ? 'right-4' : 'left-4'} flex flex-col gap-2`}>
              {product.featured && (
                <Badge className="bg-primary text-primary-foreground shadow-lg">
                  <Award className="h-3 w-3 ml-1" />
                  {t("Featured", "مميز")}
                </Badge>
              )}
              <Badge className="bg-secondary text-secondary-foreground shadow-lg">
                {t("Most Rated", "الأكثر تقييماً")}
              </Badge>
            </div>
 
            {/* Image Indicators */}
            {productImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {productImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex 
                        ? 'bg-white w-6' 
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={t(`Image ${index + 1}`, `صورة ${index + 1}`)}
                  />
                ))}
              </div>
            )}
          </div>
 
          {/* Quick Info Cards */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-muted rounded-lg p-3 text-center">
              <Leaf className="h-5 w-5 text-green-600 mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">{t("100% Natural", "100% طبيعي")}</p>
            </div>
            <div className="bg-muted rounded-lg p-3 text-center">
              <Shield className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">{t("Quality Guarantee", "ضمان الجودة")}</p>
            </div>
          </div>
        </div>
      </div>
 
      {/* Left Content */}
      <div className="flex-1 lg:order-1">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 text-foreground">
              {language === 'ar' ? product.name_ar : product.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <div className="flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-950/20 px-3 py-1.5 rounded-full">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <span className="font-bold text-foreground">{product.rating}</span>
                <span className="text-sm text-muted-foreground">({t("847 Reviews", "847 تقييم")})</span>
              </div>
              
              <Badge variant="outline" className="border-primary text-primary">
                <Package className="h-3 w-3" />
                {language === 'ar' ? product.category_ar : product.category}
              </Badge>
            </div>
 
            {product.origin && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <MapPin className="h-4 w-4" />
                <span>{language === 'ar' ? product.origin_ar : product.origin}</span>
              </div>
            )}
          </div>
 
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Share2 className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsLiked(!isLiked)}
              className={`text-muted-foreground hover:text-red-500 transition-colors ${
                isLiked ? 'text-red-500' : ''
              }`}
            >
              <Heart
                className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`}
              />
            </Button>
          </div>
        </div>
 
        {/* Product Description */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
            {t("Description", "الوصف")}
          </h2>
          <p className="text-muted-foreground">
            {language === 'ar' ? product.desc_ar : product.desc}
          </p>
        </div>
 
        {/* Product Details */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">
              {t("Details", "التفاصيل")}
            </TabsTrigger>
            <TabsTrigger value="benefits">
              {t("Benefits", "الفوائد")}
            </TabsTrigger>
            <TabsTrigger value="usage">
              {t("Usage", "طريقة الاستخدام")}
            </TabsTrigger>
          </TabsList>
 
          <TabsContent value="details" className="mt-6" >
            <div className="space-y-4">
              {product.origin && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">{t("Origin", "المنشأ")}</h3>
                    <p className="text-muted-foreground">
                      {language === 'ar' ? product.origin_ar : product.origin}
                    </p>
                  </div>
                </div>
              )}
              
              {product.certifications && product.certifications.length > 0 && (
                <div className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">
                      {t("Certifications", "الشهادات")}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {product.certifications.map((cert, index) => (
                        <Badge key={index} variant="secondary">
                          {language === 'ar' && product.certifications_ar?.[index]
                            ? product.certifications_ar[index]
                            : cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
 
              {product.shelfLife && (
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">
                      {t("Shelf Life", "مدة الصلاحية")}
                    </h3>
                    <p className="text-muted-foreground">
                      {language === 'ar' ? (
                        <>
                          <div>{product.shelfLife.duration_ar}</div>
                          {product.shelfLife.note_ar && <div className="text-sm text-muted-foreground/80 mt-1">{product.shelfLife.note_ar}</div>}
                        </>
                      ) : (
                        <>
                          <div>{product.shelfLife.duration}</div>
                          {product.shelfLife.note && <div className="text-sm text-muted-foreground/80 mt-1">{product.shelfLife.note}</div>}
                        </>
                      )}
                    </p>
                  </div>
                </div>
              )}
 
              {product.storage && (
                <div className="flex items-start gap-3">
                  <Thermometer className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">
                      {t("Storage", "التخزين")}
                    </h3>
                    <p className="text-muted-foreground">
                      {language === 'ar' ? (
                        <>
                          <div>{product.storage.temperature}</div>
                          <div>{product.storage.humidity_ar}</div>
                          {product.storage.instructions_ar && <div className="mt-1">{product.storage.instructions_ar}</div>}
                        </>
                      ) : (
                        <>
                          <div>{product.storage.temperature}</div>
                          <div>{product.storage.humidity}</div>
                          {product.storage.instructions && <div className="mt-1">{product.storage.instructions}</div>}
                        </>
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
 
          <TabsContent value="benefits" className="mt-6">
            {product.benefits && product.benefits.length > 0 ? (
              <ul className="space-y-2">
                {product.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>
                      {language === 'ar' && product.benefits_ar?.[index]
                        ? product.benefits_ar[index]
                        : benefit}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">
                {t("No benefits information available.", "لا توجد معلومات عن الفوائد متاحة.")}
              </p>
            )}
          </TabsContent>
 
          <TabsContent value="usage" className="mt-6">
            {product.usage ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <ul className="list-disc pl-5 space-y-1">
                    {(language === 'ar' ? product.usage.primary_ar : product.usage.primary).map((use, i) => (
                      <li key={i}>{use}</li>
                    ))}
                  </ul>
                  {product.usage.tip && (
                    <div className="mt-2 text-sm italic">
                      {language === 'ar' ? product.usage.tip_ar : product.usage.tip}
                    </div>
                  )}
                </div>
                {product.tags && product.tags.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">
                      {t("Tags", "الوسوم")}:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {language === 'ar' && product.tags_ar?.[index]
                            ? product.tags_ar[index]
                            : tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">
                {t("No usage information available.", "لا توجد معلومات عن طريقة الاستخدام متاحة.")}
              </p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  </div>
);
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="h-[96vh]">
          <div className="overflow-y-auto h-full">
            <div className="px-4 pt-4 pb-6">
              {content}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <DirectionProvider dir="rtl">
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[1100px] max-h-[90vh] p-0">
          <div className="overflow-y-auto max-h-[90vh]">
            <div className="p-8">
              {content}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DirectionProvider>
  );
}