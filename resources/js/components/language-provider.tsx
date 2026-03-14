import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DirectionProvider } from '@/components/ui/direction';

interface LanguageContextType {
    language: 'en' | 'ar';
    direction: 'ltr' | 'rtl';
    isRTL: boolean;
    setLanguage: (lang: 'en' | 'ar') => void;
    t: (en: string, ar: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<'en' | 'ar'>(() => {
        if (typeof localStorage !== 'undefined') {
            const saved = localStorage.getItem('language');
            return (saved === 'en' || saved === 'ar') ? saved : 'ar';
        }
        return 'ar';
    });

    const direction  = language === 'ar' ? 'rtl' : 'ltr';
    const isRTL      = direction === 'rtl';

    useEffect(() => {
        const root = document.documentElement;
        root.setAttribute('dir', direction);
        root.setAttribute('lang', language);
        localStorage.setItem('language', language);
    }, [language, direction]);

    const t = useCallback((en: string, ar: string) => {
        return language === 'ar' ? ar : en;
    }, [language]);

    const setLanguage = useCallback((lang: 'en' | 'ar') => {
        const root = document.documentElement;
        /* brief fade while switching */
        root.classList.add('lang-switching');
        setTimeout(() => {
            setLanguageState(lang);
            root.classList.remove('lang-switching');
        }, 150);
    }, []);

    return (
        <LanguageContext.Provider value={{ language, direction, isRTL, setLanguage, t }}>
            <DirectionProvider dir={direction} direction={direction}>
                {children}
            </DirectionProvider>
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        return {
            language: 'ar' as const,
            direction: 'rtl' as const,
            isRTL: true,
            setLanguage: () => {},
            t: (_en: string, ar: string) => ar,
        };
    }
    return context;
}