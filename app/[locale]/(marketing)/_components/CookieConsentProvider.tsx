"use client";

import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import {
    clearLanguage,
    createConsent,
    getStoredConsent,
    getStoredLanguage,
    saveConsent,
    saveLanguage,
    type CookieConsent,
    type LanguageCode,
} from "@/lib/cookie-consent";

type CookieConsentContextValue = {
    consent: CookieConsent | null;
    hasAnswered: boolean;
    selectedLanguage: LanguageCode;
    isSettingsOpen: boolean;
    openSettings: () => void;
    closeSettings: () => void;
    acceptAll: () => void;
    rejectAll: () => void;
    savePreferences: (preferences: boolean) => void;
    setLanguagePreference: (language: LanguageCode) => void;
};

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

export function CookieConsentProvider({ children }: { children: ReactNode }) {
    const [consent, setConsent] = useState<CookieConsent | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>("TR");
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const storedConsent = getStoredConsent();

        setConsent(storedConsent);

        if (storedConsent?.preferences) {
            const storedLanguage = getStoredLanguage();

            if (storedLanguage) {
                setSelectedLanguage(storedLanguage);
            }
        }

        setIsLoaded(true);
    }, []);

    const persistConsent = (nextConsent: CookieConsent) => {
        setConsent(nextConsent);
        saveConsent(nextConsent);

        if (nextConsent.preferences) {
            saveLanguage(selectedLanguage);
        } else {
            clearLanguage();
        }
    };

    const acceptAll = () => {
        const nextConsent = createConsent(true);

        setConsent(nextConsent);
        saveConsent(nextConsent);
        saveLanguage(selectedLanguage);
        setIsSettingsOpen(false);
    };

    const rejectAll = () => {
        const nextConsent = createConsent(false);

        setConsent(nextConsent);
        saveConsent(nextConsent);
        clearLanguage();
        setIsSettingsOpen(false);
    };

    const savePreferences = (preferences: boolean) => {
        const nextConsent = createConsent(preferences);
        persistConsent(nextConsent);
        setIsSettingsOpen(false);
    };

    const setLanguagePreference = (language: LanguageCode) => {
        setSelectedLanguage(language);

        if (consent?.preferences) {
            saveLanguage(language);
        }
    };

    const value = useMemo<CookieConsentContextValue>(
        () => ({
            consent,
            hasAnswered: isLoaded && consent !== null,
            selectedLanguage,
            isSettingsOpen,
            openSettings: () => setIsSettingsOpen(true),
            closeSettings: () => setIsSettingsOpen(false),
            acceptAll,
            rejectAll,
            savePreferences,
            setLanguagePreference,
        }),
        [consent, isLoaded, selectedLanguage, isSettingsOpen]
    );

    return (
        <CookieConsentContext.Provider value={value}>
            {children}
        </CookieConsentContext.Provider>
    );
}

export function useCookieConsent() {
    const context = useContext(CookieConsentContext);

    if (!context) {
        throw new Error(
            "useCookieConsent must be used inside CookieConsentProvider"
        );
    }

    return context;
}