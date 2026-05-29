"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Ticket, CheckCircle2, Clock, XCircle, MapPin, Calendar, CreditCard, ChevronRight } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

type ReservationResult = {
  pnrCode: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  pickupDateTime: string;
  customerName: string;
  originalPrice: number | null;
  originalCurrency: string | null;
  totalPrice: number;
  currency: string;
  tripType: string;
  route: { pickup: string; dropoff: string };
  vehicle: { name: string };
};

const STATUS_CONFIG = {
  PENDING: { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Clock },
  CONFIRMED: { color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: CheckCircle2 },
  CANCELLED: { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: XCircle },
  COMPLETED: { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: CheckCircle2 },
};

export default function PnrSorgulamaPage() {
  const t = useTranslations("PnrSearchPage");
  const locale = useLocale();

  const [pnr, setPnr] = useState("");
  const [email, setEmail] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ReservationResult | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pnr.trim() || !email.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    const fullPnrCode = `VIP${pnr}`;

    try {
      const response = await fetch('/api/client/reservations/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pnrCode: fullPnrCode, email: email })
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      } else {
        // HATA MESAJI BURADA LOKALİZE EDİLDİ
        setError(t("alerts.notFound"));
      }
    } catch (err) {
      setError(t("alerts.networkError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#0d0d0d] px-4 py-32 text-white sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="mx-auto max-w-2xl w-full">
        
        {/* Üst Başlık */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#22D3EE]/10 text-[#22D3EE] mb-6">
            <Ticket size={32} strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl mb-4">
            {t("title1")} <span className="text-white/45">{t("title2")}</span>
          </h1>
          <p className="text-sm text-white/45 max-w-md mx-auto">
            {t("description")}
          </p>
        </div>

        {/* Sorgulama Formu */}
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSearch} 
          className="bg-white/[0.035] border border-white/10 rounded-[1.75rem] p-6 sm:p-8 backdrop-blur-sm"
        >
          <div className="grid gap-5 sm:grid-cols-2 mb-6">
            <div className="space-y-2">
              <label className="pl-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/45">{t("pnrLabel")}</label>
              
              <div className="flex w-full overflow-hidden rounded-2xl border border-white/10 bg-black/20 transition duration-200 hover:border-white/15 focus-within:border-[#22D3EE]/50 focus-within:bg-black/30">
                <span className="flex items-center justify-center pl-4 pr-1 text-sm font-bold text-white/60 select-none">
                  VIP
                </span>
                <input 
                  type="text" 
                  value={pnr}
                  onChange={(e) => setPnr(e.target.value.replace(/\D/g, ''))}
                  placeholder={t("pnrPlaceholder")}
                  className="w-full bg-transparent py-3.5 pl-1 pr-4 text-sm font-medium tracking-widest text-white outline-none placeholder:text-white/20 placeholder:tracking-normal"
                  required
                />
              </div>

            </div>
            <div className="space-y-2">
              <label className="pl-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/45">{t("emailLabel")}</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("emailPlaceholder")}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white outline-none transition duration-200 hover:border-white/15 focus:border-[#22D3EE]/50 focus:bg-black/30 placeholder:text-white/20"
                required
              />
            </div>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl text-center">
              {error}
            </motion.div>
          )}

          <button 
            type="submit"
            disabled={loading || !pnr || !email}
            className="w-full h-12 flex items-center justify-center gap-2 rounded-full bg-white text-black font-semibold transition-all duration-300 hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {loading ? (
               <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                {t("searchButton")} <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </>
            )}
          </button>
        </motion.form>

        {/* Sonuç Ekranı */}
        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="mt-8 bg-[#111] border border-white/10 rounded-[1.75rem] overflow-hidden relative"
            >
              <div className="absolute left-0 top-24 w-4 h-8 bg-[#0d0d0d] border-r border-y border-white/10 rounded-r-full -translate-x-px" />
              <div className="absolute right-0 top-24 w-4 h-8 bg-[#0d0d0d] border-l border-y border-white/10 rounded-l-full translate-x-px" />
              <div className="absolute left-6 right-6 top-28 border-t border-dashed border-white/10" />

              <div className="p-6 sm:p-8 pb-10 flex flex-col items-center text-center">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/45 mb-4">{t("transferStatus")}</p>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${STATUS_CONFIG[result.status].bg} ${STATUS_CONFIG[result.status].border} ${STATUS_CONFIG[result.status].color}`}>
                  {(() => {
                    const StatusIcon = STATUS_CONFIG[result.status].icon;
                    return <StatusIcon size={18} />;
                  })()}
                  <span className="font-bold text-sm tracking-wide">{t(`status.${result.status}`)}</span>
                </div>
                <h2 className="mt-6 text-2xl font-bold text-white tracking-widest">{result.pnrCode}</h2>
                <p className="text-sm text-white/50 mt-1 capitalize">{result.customerName}</p>
              </div>

              <div className="p-6 sm:p-8 bg-white/[0.02] grid gap-6 sm:grid-cols-2">
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/50 shrink-0">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-white/45">{t("dateTimeLabel")}</p>
                    <p className="text-sm font-medium text-white mt-1">
                      {new Date(result.pickupDateTime).toLocaleString(locale, { 
                        day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/50 shrink-0">
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-white/45">{t("totalAmountLabel")}</p>
                    <p className="text-sm font-bold text-[#22D3EE] mt-1">
                      {result.originalPrice ? `${result.originalPrice} ${result.originalCurrency}` : `${result.totalPrice} ${result.currency}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 sm:col-span-2 bg-black/20 p-4 rounded-2xl border border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/50 shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-white/45 mb-1.5 flex items-center gap-2">
                      {t("transferRouteLabel")} <span className="px-1.5 py-0.5 rounded text-[9px] bg-white/10 text-white/70">{result.tripType === 'ROUND_TRIP' ? t("roundTrip") : t("oneWay")}</span>
                    </p>
                    <div className="flex items-center gap-2 text-sm font-medium text-white">
                      <span className="truncate">{result.route.pickup}</span>
                      <ChevronRight size={14} className="text-white/30 shrink-0" />
                      <span className="truncate">{result.route.dropoff}</span>
                    </div>
                    <p className="text-xs text-white/40 mt-1.5 flex items-center gap-1.5">
                      <span>🚙</span> {result.vehicle.name}
                    </p>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}