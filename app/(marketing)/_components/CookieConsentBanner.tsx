"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useCookieConsent } from "./CookieConsentProvider";

const FORCE_COOKIE_BANNER = false;
export function CookieConsentBanner() {
    const {
        consent,
        hasAnswered,
        isSettingsOpen,
        openSettings,
        closeSettings,
        acceptAll,
        rejectAll,
        savePreferences,
    } = useCookieConsent();

    const [preferencesEnabled, setPreferencesEnabled] = useState(true);

    useEffect(() => {
        if (consent) {
            setPreferencesEnabled(consent.preferences);
        }
    }, [consent]);

    const shouldShowBanner = FORCE_COOKIE_BANNER || !hasAnswered;

    return (
        <>
            {shouldShowBanner && (
                <div className="fixed bottom-4 right-4 z-[60] w-[calc(100%-2rem)] max-w-sm sm:bottom-6 sm:right-6">
                    <div className="rounded-3xl border border-white/10 bg-[#111111] p-5 text-white">
                        <div>
                            <h2 className="text-sm font-semibold text-white">
                                Çerez tercihleri
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-white/50">
                                Dil tercihinizi hatırlamak ve deneyiminizi iyileştirmek için
                                çerezler kullanıyoruz.
                            </p>
                        </div>

                        <div className="mt-5 flex flex-col gap-2">
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={rejectAll}
                                    className="h-10 rounded-full text-sm text-white/65 hover:bg-white/10 hover:text-white"
                                >
                                    Sadece zorunlu
                                </Button>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={openSettings}
                                    className="h-10 rounded-full text-sm text-white/65 hover:bg-white/10 hover:text-white"
                                >
                                    Yönet
                                </Button>
                            </div>

                            <Button
                                type="button"
                                onClick={acceptAll}
                                className="h-10 rounded-full bg-white text-sm font-semibold text-black hover:bg-white/90"
                            >
                                Tümünü kabul et
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <Dialog open={isSettingsOpen} onOpenChange={closeSettings}>
                <DialogContent className="border-white/10 bg-[#111111] text-white sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Çerez Tercihleri</DialogTitle>
                        <DialogDescription className="text-white/45">
                            Hangi çerezlerin kullanılmasına izin vereceğinizi buradan
                            yönetebilirsiniz.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 space-y-4">
                        <div className="rounded-2xl border border-white/10 p-4">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-sm font-semibold text-white">
                                        Zorunlu çerezler
                                    </h3>

                                    <p className="mt-1 text-sm leading-6 text-white/45">
                                        Site güvenliği, temel çalışma mantığı ve çerez
                                        tercihlerinizi saklamak için gereklidir.
                                    </p>
                                </div>

                                <Switch checked disabled />
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 p-4">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-sm font-semibold text-white">
                                        Dil tercihi çerezleri
                                    </h3>

                                    <p className="mt-1 text-sm leading-6 text-white/45">
                                        Seçtiğiniz dili hatırlamamızı sağlar. Kapalı olursa
                                        dil seçiminiz yalnızca mevcut oturumda uygulanır.
                                    </p>
                                </div>

                                <Switch
                                    checked={preferencesEnabled}
                                    onCheckedChange={setPreferencesEnabled}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={rejectAll}
                            className="rounded-full text-white/65 hover:bg-white/10 hover:text-white"
                        >
                            Sadece zorunlu
                        </Button>

                        <Button
                            type="button"
                            onClick={() => savePreferences(preferencesEnabled)}
                            className="rounded-full bg-white text-black hover:bg-white/90"
                        >
                            Tercihleri kaydet
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}