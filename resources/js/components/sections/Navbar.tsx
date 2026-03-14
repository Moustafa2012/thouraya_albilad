import { Moon, Sun, Menu, Home, Users, ShoppingBasket, ShieldCheck, Newspaper, HelpCircle, MessageSquare, Globe } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { useLanguage } from "@/components/language-provider";
import { NavUser } from "@/components/nav-user";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAppearance } from "@/hooks/use-appearance";
import logo from "../../../../public/thouraya-logo.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("#hero");
  const { language, setLanguage, t } = useLanguage();
  const { resolvedAppearance, updateAppearance } = useAppearance();

  // Memoized toggle functions for better performance
  const toggleLanguage = useCallback(() => {
    setLanguage(language === "ar" ? "en" : "ar");
  }, [language, setLanguage]);

  const toggleTheme = useCallback(() => {
    updateAppearance(resolvedAppearance === "dark" ? "light" : "dark");
  }, [resolvedAppearance, updateAppearance]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open]);

  // Track active section for navigation highlighting
  useEffect(() => {
    const handleScroll = () => {
      const sections = navLinks.map(link => link.href.substring(1));
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(`#${section}`);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle smooth scroll and close mobile menu
  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setOpen(false);
    
    const targetId = href.substring(1);
    const element = document.getElementById(targetId);
    
    if (element) {
      const offset = 80; // Account for fixed navbar height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      
      // Update URL without triggering navigation
      window.history.pushState({}, "", href);
      setActiveSection(href);
    }
  }, []);

  const navLinks = [
    { label: t("Home", "الرئيسية"), href: "#hero", icon: Home },
    { label: t("About Us", "من نحن"), href: "#about", icon: Users },
    { label: t("Products", "المنتجات"), href: "#products", icon: ShoppingBasket },
    { label: t("Quality", "الجودة"), href: "#quality", icon: ShieldCheck },
    { label: t("Articles", "المقالات"), href: "#articles", icon: Newspaper },
    { label: t("FAQ", "الأسئلة"), href: "#faq", icon: HelpCircle },
    { label: t("Contact Us", "تواصل معنا"), href: "#contact", icon: MessageSquare },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          {/* Logo */}
          <a 
            href="#hero" 
            onClick={(e) => handleNavClick(e, "#hero")}
            className="flex items-center gap-1.5 sm:gap-2 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
            aria-label={t("Thouraya Albilad - Home", "ثريا البلاد - الرئيسية")}
          >
            <img 
              src={logo} 
              alt="" 
              className="h-8 w-8 sm:h-10 sm:w-10" 
              loading="eager"
            />
            <span className="text-base sm:text-xl font-bold text-primary truncate max-w-[120px] sm:max-w-none">
              {t("Thouraya Albilad", "ثريا البلاد")}
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label={t("Main navigation", "القائمة الرئيسية")}>
            {navLinks.map((link) => {
              const isActive = activeSection === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`px-2 xl:px-3 py-2 text-sm font-medium transition-colors rounded-md hover:bg-accent flex items-center gap-1.5 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    isActive 
                      ? "text-primary bg-accent/50" 
                      : "text-muted-foreground hover:text-primary"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <link.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="hidden xl:inline">{link.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <SidebarProvider defaultOpen={false} className="contents">
              <NavUser />
            </SidebarProvider>

            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              className="text-muted-foreground h-9 w-9 sm:h-10 sm:w-10"
              title={language === "ar" ? "Switch to English" : "التبديل إلى العربية"}
              aria-label={language === "ar" ? "Switch to English" : "التبديل إلى العربية"}
            >
              <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="sr-only">{language === "ar" ? "English" : "العربية"}</span>
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-muted-foreground h-9 w-9 sm:h-10 sm:w-10"
              title={resolvedAppearance === "dark" ? t("Switch to Light Mode", "التبديل إلى الوضع النهاري") : t("Switch to Dark Mode", "التبديل إلى الوضع الليلي")}
              aria-label={resolvedAppearance === "dark" ? t("Switch to Light Mode", "التبديل إلى الوضع النهاري") : t("Switch to Dark Mode", "التبديل إلى الوضع الليلي")}
            >
              {resolvedAppearance === "dark" ? (
                <Sun className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
              ) : (
                <Moon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
              )}
              <span className="sr-only">
                {resolvedAppearance === "dark" ? t("Light Mode", "الوضع النهاري") : t("Dark Mode", "الوضع الليلي")}
              </span>
            </Button>

            {/* Mobile Menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 sm:h-10 sm:w-10"
                  aria-label={t("Open menu", "فتح القائمة")}
                >
                  <Menu className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side={language === "ar" ? "right" : "left"} 
                className="w-[280px] sm:w-[320px] p-0 flex flex-col"
                aria-label={t("Mobile navigation", "القائمة المحمولة")}
              >
                {/* Header Section */}
                <div className="p-4 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <img 
                      src={logo} 
                      alt="" 
                      className="h-8 w-8"
                      loading="eager"
                    />
                    <span className="text-lg font-bold text-foreground">
                      {t("Thouraya Albilad", "ثريا البلاد")}
                    </span>
                  </div>
                </div>

                {/* Content Section - Navigation Links */}
                <nav 
                  className="flex-1 overflow-y-auto p-2"
                  aria-label={t("Mobile main navigation", "القائمة الرئيسية المحمولة")}
                >
                  <div className="flex flex-col gap-1">
                    {navLinks.map((link) => {
                      const isActive = activeSection === link.href;
                      return (
                        <a
                          key={link.href}
                          href={link.href}
                          onClick={(e) => handleNavClick(e, link.href)}
                          className={`px-3 py-2.5 text-base font-medium rounded-lg transition-colors flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                            isActive
                              ? "text-foreground bg-accent"
                              : "text-foreground hover:bg-accent"
                          }`}
                          aria-current={isActive ? "page" : undefined}
                        >
                          <link.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                          <span>{link.label}</span>
                        </a>
                      );
                    })}
                  </div>
                </nav>

                {/* Footer Section - Settings & User */}
                <div className="p-4 border-t border-border/50">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        {t("Theme", "المظهر")}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="h-9 w-9"
                        title={resolvedAppearance === "dark" ? t("Light Mode", "الوضع النهاري") : t("Dark Mode", "الوضع الليلي")}
                        aria-label={resolvedAppearance === "dark" ? t("Switch to Light Mode", "التبديل إلى الوضع النهاري") : t("Switch to Dark Mode", "التبديل إلى الوضع الليلي")}
                      >
                        {resolvedAppearance === "dark" ? (
                          <Sun className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <Moon className="h-4 w-4" aria-hidden="true" />
                        )}
                        <span className="sr-only">
                          {resolvedAppearance === "dark" ? t("Light Mode", "الوضع النهاري") : t("Dark Mode", "الوضع الليلي")}
                        </span>
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        {t("Language", "اللغة")}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleLanguage}
                        className="h-9 w-9"
                        title={language === "ar" ? "English" : "العربية"}
                        aria-label={language === "ar" ? "Switch to English" : "التبديل إلى العربية"}
                      >
                        <Globe className="h-4 w-4" aria-hidden="true" />
                        <span className="sr-only">
                          {language === "ar" ? "English" : "العربية"}
                        </span>
                      </Button>
                    </div>
                    <SidebarProvider defaultOpen={false} className="contents">
                      <NavUser />
                    </SidebarProvider>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}