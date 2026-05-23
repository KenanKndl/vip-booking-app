"use client";

import { useCookieConsent } from "./CookieConsentProvider";
import { useTranslations } from "next-intl";

export function CookieSettingsTrigger() {
    const t = useTranslations("CookieSettingsTrigger");
    const { openSettings } = useCookieConsent();

    return (
        <button
            type="button"
            onClick={openSettings}
            className="transition-colors hover:text-white/60"
        >
            {t("label")}
        </button>
    );
}