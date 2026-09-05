import { useState, useMemo, useEffect } from 'react';
import { Check, Globe, Search, X, Smartphone, Tablet, Laptop, Gamepad2 } from 'lucide-react';
import { SUPPORTED_LANGUAGES, LanguageInfo } from '../lib/i18n';
import { ThemeMode } from '../types';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: string;
  onSelectLanguage: (langCode: string) => void;
  theme: ThemeMode;
}

// Region categorization helper for fast navigation across 60+ languages
type RegionCategory = 'all' | 'mideast' | 'europe' | 'asia' | 'other';

const REGION_MAP: Record<string, RegionCategory> = {
  ar: 'mideast',
  fa: 'mideast',
  ku: 'mideast',
  ps: 'mideast',
  ur: 'mideast',
  tr: 'mideast',
  az: 'mideast',

  en: 'europe',
  ru: 'europe',
  fr: 'europe',
  es: 'europe',
  de: 'europe',
  it: 'europe',
  pt: 'europe',
  nl: 'europe',
  pl: 'europe',
  sv: 'europe',
  el: 'europe',
  uk: 'europe',
  ro: 'europe',
  cs: 'europe',
  hu: 'europe',
  da: 'europe',
  fi: 'europe',
  no: 'europe',
  sk: 'europe',
  bg: 'europe',
  hr: 'europe',
  sr: 'europe',
  bs: 'europe',
  sq: 'europe',
  lt: 'europe',
  lv: 'europe',
  et: 'europe',
  sl: 'europe',
  ga: 'europe',
  is: 'europe',
  ca: 'europe',

  ko: 'asia',
  ja: 'asia',
  zh: 'asia',
  'zh-TW': 'asia',
  hi: 'asia',
  id: 'asia',
  vi: 'asia',
  th: 'asia',
  ms: 'asia',
  fil: 'asia',
  bn: 'asia',
  ta: 'asia',
  te: 'asia',
  mr: 'asia',
  gu: 'asia',
  pa: 'asia',
  kk: 'asia',
  uz: 'asia',
  ka: 'asia',
  hy: 'asia',

  sw: 'other',
  am: 'other',
  so: 'other',
};

export function LanguageModal({
  isOpen,
  onClose,
  currentLanguage,
  onSelectLanguage,
  theme,
}: LanguageModalProps) {
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<RegionCategory>('all');
  const isBurgundy = theme === 'burgundy';

  // Support Escape key to close modal (essential for laptop and Xbox Edge browser)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredLanguages = useMemo(() => {
    let list = SUPPORTED_LANGUAGES;

    // Filter by region if specified and not searching
    if (selectedRegion !== 'all') {
      list = list.filter(
        (lang) => (REGION_MAP[lang.code] || 'other') === selectedRegion
      );
    }

    const q = search.trim().toLowerCase();
    if (!q) return list;

    return list.filter(
      (lang) =>
        lang.name.toLowerCase().includes(q) ||
        lang.englishName.toLowerCase().includes(q) ||
        lang.code.toLowerCase().includes(q)
    );
  }, [search, selectedRegion]);

  if (!isOpen) return null;

  return (
    <div
      id="language-selector-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/65 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-[95vw] sm:max-w-[620px] md:max-w-[780px] lg:max-w-[960px] xl:max-w-[1120px] rounded-2xl sm:rounded-3xl border shadow-2xl p-3 sm:p-4 md:p-6 flex flex-col max-h-[90vh] sm:max-h-[85vh] transition-all transform scale-100 ${
          isBurgundy
            ? 'bg-[#2b0b14] border-[#581827] text-[#fce7f3] shadow-black/70'
            : 'bg-white border-[#e7e5e4] text-[#1c1917] shadow-slate-300/60'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Title and Close button */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-inherit mb-3 sm:mb-4 gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            <div
              className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center border shadow-xs shrink-0 ${
                isBurgundy
                  ? 'bg-[#1e070e] border-[#581827] text-[#f43f5e]'
                  : 'bg-[#f1ede4] border-[#e7e5e4] text-[#6b0f24]'
              }`}
            >
              <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-xl md:text-2xl font-black tracking-tight flex items-center gap-2 flex-wrap">
                <span>اختر لغة الموقع</span>
                <span className="text-xs sm:text-sm font-normal opacity-70">
                  • Select Language
                </span>
              </h2>
              <p
                className={`text-[11px] sm:text-xs truncate ${
                  isBurgundy ? 'text-[#fda4af]' : 'text-[#78716c]'
                }`}
              >
                أكثر من 60 لغة عالمية مدعومة • الأولوية للعربية 🇯🇴
              </p>
            </div>
          </div>

          <button
            id="btn-close-lang-modal"
            type="button"
            onClick={onClose}
            aria-label="Close language modal"
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center border transition-all cursor-pointer shrink-0 focus-visible:outline-hidden focus-visible:ring-2 ${
              isBurgundy
                ? 'border-[#581827] bg-[#1e070e] text-[#fda4af] hover:text-white focus-visible:ring-[#f43f5e]'
                : 'border-[#e7e5e4] bg-[#f1ede4] text-[#78716c] hover:text-black focus-visible:ring-[#6b0f24]'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input with Clear Button */}
        <div className="relative mb-2.5 sm:mb-3">
          <Search
            className={`w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${
              isBurgundy ? 'text-[#fda4af]' : 'text-[#78716c]'
            }`}
          />
          <input
            id="input-search-languages"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث عن اللغة أو الرمز أو الدولة... Search language, country..."
            className={`w-full pl-10 pr-10 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm border focus-visible:outline-hidden transition-all ${
              isBurgundy
                ? 'bg-[#1e070e] border-[#581827] text-[#fce7f3] focus-visible:ring-2 focus-visible:ring-[#f43f5e] placeholder-[#fda4af]/40'
                : 'bg-[#f1ede4] border-[#e7e5e4] text-[#1c1917] focus-visible:ring-2 focus-visible:ring-[#6b0f24] placeholder-[#78716c]/60'
            }`}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center opacity-60 hover:opacity-100 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Region Filter Chips (Optimized for Phone, Tablet, Laptop, Xbox) */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-2 mb-2 text-xs font-bold shrink-0">
          <button
            type="button"
            onClick={() => setSelectedRegion('all')}
            className={`px-3 py-1 sm:py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer border text-[11px] sm:text-xs ${
              selectedRegion === 'all'
                ? isBurgundy
                  ? 'bg-[#f43f5e] border-[#f43f5e] text-white shadow-xs'
                  : 'bg-[#6b0f24] border-[#6b0f24] text-white shadow-xs'
                : isBurgundy
                ? 'bg-[#1e070e] border-[#581827] text-[#fda4af] hover:bg-[#3b101c]'
                : 'bg-[#f1ede4] border-[#e7e5e4] text-[#78716c] hover:bg-[#e7e2d7]'
            }`}
          >
            الكل ({SUPPORTED_LANGUAGES.length})
          </button>

          <button
            type="button"
            onClick={() => setSelectedRegion('mideast')}
            className={`px-3 py-1 sm:py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer border text-[11px] sm:text-xs ${
              selectedRegion === 'mideast'
                ? isBurgundy
                  ? 'bg-[#f43f5e] border-[#f43f5e] text-white'
                  : 'bg-[#6b0f24] border-[#6b0f24] text-white'
                : isBurgundy
                ? 'bg-[#1e070e] border-[#581827] text-[#fda4af] hover:bg-[#3b101c]'
                : 'bg-[#f1ede4] border-[#e7e5e4] text-[#78716c] hover:bg-[#e7e2d7]'
            }`}
          >
            الشرق الأوسط والمنطقة 🇯🇴
          </button>

          <button
            type="button"
            onClick={() => setSelectedRegion('europe')}
            className={`px-3 py-1 sm:py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer border text-[11px] sm:text-xs ${
              selectedRegion === 'europe'
                ? isBurgundy
                  ? 'bg-[#f43f5e] border-[#f43f5e] text-white'
                  : 'bg-[#6b0f24] border-[#6b0f24] text-white'
                : isBurgundy
                ? 'bg-[#1e070e] border-[#581827] text-[#fda4af] hover:bg-[#3b101c]'
                : 'bg-[#f1ede4] border-[#e7e5e4] text-[#78716c] hover:bg-[#e7e2d7]'
            }`}
          >
            أوروبا
          </button>

          <button
            type="button"
            onClick={() => setSelectedRegion('asia')}
            className={`px-3 py-1 sm:py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer border text-[11px] sm:text-xs ${
              selectedRegion === 'asia'
                ? isBurgundy
                  ? 'bg-[#f43f5e] border-[#f43f5e] text-white'
                  : 'bg-[#6b0f24] border-[#6b0f24] text-white'
                : isBurgundy
                ? 'bg-[#1e070e] border-[#581827] text-[#fda4af] hover:bg-[#3b101c]'
                : 'bg-[#f1ede4] border-[#e7e5e4] text-[#78716c] hover:bg-[#e7e2d7]'
            }`}
          >
            آسيا
          </button>

          <button
            type="button"
            onClick={() => setSelectedRegion('other')}
            className={`px-3 py-1 sm:py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer border text-[11px] sm:text-xs ${
              selectedRegion === 'other'
                ? isBurgundy
                  ? 'bg-[#f43f5e] border-[#f43f5e] text-white'
                  : 'bg-[#6b0f24] border-[#6b0f24] text-white'
                : isBurgundy
                ? 'bg-[#1e070e] border-[#581827] text-[#fda4af] hover:bg-[#3b101c]'
                : 'bg-[#f1ede4] border-[#e7e5e4] text-[#78716c] hover:bg-[#e7e2d7]'
            }`}
          >
            أفريقيا والأمريكتان
          </button>
        </div>

        {/* Multi-Device Responsive Grid (Phone: 1-2 cols, Tablet: 2-3 cols, Laptop: 3-4 cols, Desktop/Xbox: 4-5 cols) */}
        <div className="flex-1 overflow-y-auto pr-1 no-scrollbar grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-1.5 sm:gap-2 md:gap-2.5">
          {filteredLanguages.map((lang: LanguageInfo) => {
            const isActive = currentLanguage === lang.code;
            return (
              <button
                key={lang.code}
                id={`btn-select-lang-${lang.code}`}
                type="button"
                tabIndex={0}
                onClick={() => {
                  onSelectLanguage(lang.code);
                  onClose();
                }}
                className={`w-full p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border text-right sm:text-start flex items-center justify-between gap-2 transition-all cursor-pointer group focus-visible:outline-hidden focus-visible:ring-2 ${
                  isActive
                    ? isBurgundy
                      ? 'bg-[#581827] border-[#f43f5e] text-white shadow-md focus-visible:ring-white'
                      : 'bg-[#6b0f24] border-[#6b0f24] text-white shadow-md focus-visible:ring-[#1c1917]'
                    : isBurgundy
                    ? 'bg-[#1e070e]/80 border-[#581827] hover:border-[#f43f5e]/60 hover:bg-[#3b101c] text-[#fce7f3] focus-visible:ring-[#f43f5e]'
                    : 'bg-[#f8f6f0] border-[#e7e5e4] hover:border-[#6b0f24]/50 hover:bg-white text-[#1c1917] focus-visible:ring-[#6b0f24]'
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                  <span className="text-lg sm:text-xl shrink-0 select-none drop-shadow-xs">
                    {lang.flag}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-black text-xs sm:text-[13px] truncate">
                        {lang.name}
                      </span>
                      {lang.code === 'ar' && (
                        <span className="text-[8px] sm:text-[9px] px-1 py-0.2 rounded-sm bg-emerald-500/20 text-emerald-400 font-bold shrink-0">
                          الأردن
                        </span>
                      )}
                    </div>
                    <div
                      className={`text-[10px] sm:text-[11px] truncate flex items-center gap-1 ${
                        isActive
                          ? 'text-white/85'
                          : isBurgundy
                          ? 'text-[#fda4af]/70'
                          : 'text-[#78716c]'
                      }`}
                    >
                      <span className="truncate">{lang.englishName}</span>
                      <span className="opacity-50 text-[8px] sm:text-[9px] font-mono">
                        ({lang.code})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-1">
                  <span
                    className={`text-[8px] sm:text-[9px] font-mono px-1 py-0.5 rounded-md ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : isBurgundy
                        ? 'bg-[#2b0b14] text-[#fda4af]/60'
                        : 'bg-white/80 text-[#a8a29e]'
                    }`}
                  >
                    {lang.dir.toUpperCase()}
                  </span>

                  {isActive && (
                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white text-[#6b0f24] flex items-center justify-center shadow-xs">
                      <Check className="w-2.5 sm:w-3 h-2.5 sm:h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Empty Search State */}
        {filteredLanguages.length === 0 && (
          <div className="py-12 text-center flex flex-col items-center justify-center opacity-70">
            <Globe className="w-10 h-10 mb-2 opacity-40" />
            <p className="text-sm font-bold">لم يتم العثور على لغة مطابقة</p>
            <p className="text-xs mt-1">جرب البحث باسم آخر أو مسح مربع البحث.</p>
          </div>
        )}

        {/* Footer info & Multi-device compliance label */}
        <div className="pt-3 sm:pt-4 mt-3 border-t border-inherit flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-3 text-[11px] opacity-80 flex-wrap justify-center sm:justify-start">
            <span className="flex items-center gap-1 font-semibold">
              <Gamepad2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Xbox</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-semibold">
              <Smartphone className="w-3.5 h-3.5 text-sky-500" />
              <span>هاتف</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-semibold">
              <Tablet className="w-3.5 h-3.5 text-indigo-500" />
              <span>آيباد</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-semibold">
              <Laptop className="w-3.5 h-3.5 text-amber-500" />
              <span>لابتوب</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] sm:text-[11px] ${
                isBurgundy ? 'text-[#fda4af]' : 'text-[#78716c]'
              }`}
            >
              1. 🇯🇴 العربية • 2. 🇺🇸 English • 3. 🇷🇺 Русский...
            </span>
            <button
              id="btn-close-lang-modal-footer"
              type="button"
              onClick={onClose}
              className={`px-3.5 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                isBurgundy
                  ? 'bg-[#1e070e] border-[#581827] text-[#fce7f3] hover:border-[#f43f5e]'
                  : 'bg-[#f1ede4] border-[#e7e5e4] text-[#1c1917] hover:border-[#6b0f24]'
              }`}
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
