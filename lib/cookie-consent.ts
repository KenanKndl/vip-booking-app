export type LanguageCode = "TR" | "EN" | "DE" | "RU";

export type CookieConsent = {
    necessary: true;
    preferences: boolean;
    version: 1;
    updatedAt: string;
};

export const CONSENT_COOKIE_NAME = "matilda_cookie_consent";
export const LANGUAGE_COOKIE_NAME = "matilda_language";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 180; // 180 gün

function isBrowser() {
    return typeof window !== "undefined";
}

export function getCookie(name: string) {
    if (!isBrowser()) return null;

    const value = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${name}=`))
        ?.split("=")[1];

    return value ? decodeURIComponent(value) : null;
}

export function setCookie(name: string, value: string, maxAge = COOKIE_MAX_AGE) {
    if (!isBrowser()) return;

    document.cookie = `${name}=${encodeURIComponent(
        value
    )}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function deleteCookie(name: string) {
    if (!isBrowser()) return;

    document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

export function getStoredConsent(): CookieConsent | null {
    const raw = getCookie(CONSENT_COOKIE_NAME);

    if (!raw) return null;

    try {
        const parsed = JSON.parse(raw) as CookieConsent;

        if (parsed.version !== 1) return null;

        return parsed;
    } catch {
        return null;
    }
}

export function saveConsent(consent: CookieConsent) {
    setCookie(CONSENT_COOKIE_NAME, JSON.stringify(consent));
}

export function getStoredLanguage(): LanguageCode | null {
    const raw = getCookie(LANGUAGE_COOKIE_NAME);

    if (raw === "TR" || raw === "EN" || raw === "DE" || raw === "RU") {
        return raw;
    }

    return null;
}

export function saveLanguage(language: LanguageCode) {
    setCookie(LANGUAGE_COOKIE_NAME, language);
}

export function clearLanguage() {
    deleteCookie(LANGUAGE_COOKIE_NAME);
}

export function createConsent(preferences: boolean): CookieConsent {
    return {
        necessary: true,
        preferences,
        version: 1,
        updatedAt: new Date().toISOString(),
    };
}