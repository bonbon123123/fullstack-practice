import React, { createContext, useContext, useState, ReactNode } from 'react';
import en from '../locales/en.json';
import pl from '../locales/pl.json';

type Translations = typeof en;

type Language = 'en' | 'pl';

interface LanguageContextProps {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: keyof Translations, params?: Record<string, string | number>) => string;
}
export const AVAILABLE_LANGUAGES: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'pl', label: 'Polski' }
];

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('en');

    const getTranslations = (): Translations => {
        return language === 'en' ? en : pl;
    };

    const t = (key: keyof Translations, params?: Record<string, string | number>) => {
        let translation = getTranslations()[key] || key;
        if (params) {
            Object.keys(params).forEach(k => {
                translation = translation.replace(`{{${k}}}`, String(params[k]));
            });
        }
        return translation;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useTranslation = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('useTranslation must be used within a LanguageProvider');
    return context;
};
