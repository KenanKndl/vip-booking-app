"use client";

import { useCookieConsent } from "./CookieConsentProvider";

export function CookieSettingsTrigger() {
    const { openSettings } = useCookieConsent();

    return (
        <button
            type="button"
            onClick={openSettings}
            className="transition-colors hover:text-white/60"
        >
            Çerez Tercihleri
        </button>
    );
}