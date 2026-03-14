import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Clock, Calendar, Bookmark, Share2, FileText, X } from "lucide-react";
import * as React from "react";
import { useLanguage } from "@/components/language-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";

interface LocalizedText {
  en: string;
  ar: string;
}

interface Article {
  title: string;
  desc: string;
  category: string;
  date: string;
  readTime: string;
  featured: boolean;
  author?: string;
  publisher?: LocalizedText;
  journal?: LocalizedText;
  doi?: string;
  publishDate?: string;
  fullContent?: string;
  heroImage?: string;
  authorImage?: string;
  tags?: LocalizedText[];
}

interface ArticlesModalProps {
  article: Article | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ArticlesModal({ article, open, onOpenChange }: ArticlesModalProps) {
  const isMobile = useIsMobile();
  const { language } = useLanguage();  
  if (!article) return null;

  const content = (
    <div className="w-full" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Hero Image Section */}
      <div className="relative h-[280px] -mx-6 -mt-6 mb-6 overflow-hidden rounded-t-lg">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70 z-10" />
        {article.heroImage ? (
          <img 
            src={article.heroImage} 
            alt={article.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
        )}
        
        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white z-20">
          <h1 className="text-xl md:text-3xl font-bold leading-tight mb-3">
            {article.title}
          </h1>
          {article.featured && (
            <Badge className="bg-primary text-primary-foreground">{language === 'ar' ? 'مميز' : 'Featured'}</Badge>
          )}
        </div>
      </div>

      {/* Action Buttons & Metadata Bar */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Bookmark className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{article.date}</span>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>{article.readTime} {language === 'ar' ? 'للقراءة' : 'to read'}</span>
          </Badge>
        </div>
      </div>

      {/* Author Section */}
      {article.author && (
        <div className="flex items-center justify-between mb-6 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-3">
            <a 
              href={article.authorImage} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <Avatar className="h-12 w-12 border-2 border-primary/20">
                <AvatarImage src={article.authorImage} alt={article.author} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {article.author.split(' ').map(n => n[0]).join('').toUpperCase() || 'A'}
                </AvatarFallback>
              </Avatar>
            </a>
            <div>
              <p className="font-semibold text-foreground">{article.author}</p>
              <p className="text-sm text-muted-foreground">{language === 'ar' ? 'مؤلف' : 'Author'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Article Description */}
      <div className="mb-6">
        <p className="text-muted-foreground leading-relaxed text-base">
          {article.desc}
        </p>
      </div>

      {/* Full Content */}
      {article.fullContent && (
        <div className="mb-6">
          <div className="space-y-4 text-foreground leading-relaxed">
            {article.fullContent.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-base leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Metadata Section */}
      <div className="mb-6 p-5 bg-muted/20 rounded-lg border border-border/50">
        <div className="space-y-3 text-sm">
          {article.journal && (
            <div className="flex items-start gap-3">
              <FileText className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="font-medium text-foreground">{language === 'ar' ? 'المجلة العلمية: ' : 'Journal: '}</span>
                <span className="text-muted-foreground">{article.journal ? (typeof article.journal === 'string' ? article.journal : article.journal[language]) : ''}</span>
              </div>
            </div>
          )}

          {article.publisher && (
            <div className="flex items-start gap-3">
              <FileText className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="font-medium text-foreground">{language === 'ar' ? 'الناشر: ' : 'Publisher: '}</span>
                <span className="text-muted-foreground">{article.publisher ? (typeof article.publisher === 'string' ? article.publisher : article.publisher[language]) : ''}</span>
              </div>
            </div>
          )}

          {article.doi && (
            <div className="flex items-start gap-3">
              <FileText className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="font-medium text-foreground">{language === 'ar' ? 'DOI: ' : 'DOI: '}</span>
                <span className="text-muted-foreground text-xs break-all font-mono">
                  {article.doi}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tags Section */}
      {article.tags && article.tags.length > 0 && (
        <>
          <Separator className="mb-6" />
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3 text-foreground">{language === 'ar' ? 'العلامات' : 'Tags'}</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="outline"
                  className="text-primary border-primary/30 hover:bg-primary/10"
                >
                  #{language === 'ar' ? tag.ar : tag.en}
                </Badge>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Engagement Section */}
      <Separator className="mb-6" />
      <div className="text-center pb-2">
        <h3 className="text-lg font-bold mb-2 text-foreground">
          {language === 'ar' ? 'هل استمتعت بالمقال؟' : 'Did you enjoy the article?'}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          {language === 'ar' ? 'شارك مع أصدقائك أو احفظه للقراءة لاحقاً' : 'Share with your friends or save it for later'}
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" className="gap-2">
            <Bookmark className="h-4 w-4" />
            {language === 'ar' ? 'احفظ' : 'Save'}
          </Button>
          <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Share2 className="h-4 w-4" />
            {language === 'ar' ? 'شارك' : 'Share'}
          </Button>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="h-[90vh] max-h-[90vh] p-0">
          <ScrollArea className="h-full">
            <div className="p-6">
              {content}
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-3xl max-h-[90vh] p-0"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="absolute right-4 top-4 z-50">
          <DialogPrimitive.Close className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </div>
        <ScrollArea className="h-[80vh] w-full">
          <div className="p-8">
            {content}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}