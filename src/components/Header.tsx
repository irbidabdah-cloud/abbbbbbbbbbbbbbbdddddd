import React, { useState } from 'react';
import {
  Globe,
  LayoutGrid,
  Palette,
  Plus,
  Shield,
  Sparkles,
  Sun,
  User,
  Headphones,
  Menu,
  X,
  SlidersHorizontal,
  Bot,
  Download,
  CloudUpload,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { ThemeMode } from '../types';
import { TranslationDictionary, SUPPORTED_LANGUAGES } from '../lib/i18n';

interface HeaderProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  userEmail: string | null;
  userName?: string;
  isAuthorized: boolean;
  manageMode: boolean;
  onToggleManageMode: () => void;
  onOpenCreateModal: () => void;
  onOpenAdminPanel: () => void;
  onOpenProfile: () => void;
  onOpenAccountSelector: () => void;
  onOpenSupportModal: () => void;
  onOpenAiAssistant?: () => void;
  newTicketsCount?: number;
  totalPosts: number;
  currentLanguage: string;
  onOpenLanguageModal: () => void;
  t: TranslationDictionary;
  currentView?: 'start' | 'gallery' | 'profile';
  onNavigateToHome?: () => void;
  onNavigateToGallery?: () => void;
  onOpenStartScreen?: () => void;
  onOpenNetlifyModal?: () => void;
}

export function Header({
  theme,
  onToggleTheme,
  userEmail,
  userName = 'مستخدم',
  isAuthorized,
  manageMode,
  onToggleManageMode,
  onOpenCreateModal,
  onOpenAdminPanel,
  onOpenProfile,
  onOpenAccountSelector,
  onOpenSupportModal,
  onOpenAiAssistant,
  newTicketsCount = 0,
  totalPosts,
  currentLanguage,
  onOpenLanguageModal,
  t,
  currentView = 'gallery',
  onNavigateToHome,
  onNavigateToGallery,
  onOpenStartScreen,
  onOpenNetlifyModal,
}: HeaderProps) {
  const isBurgundy = theme === 'burgundy';
  const isLoggedIn = Boolean(userEmail && userEmail.trim());
  const currentLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) ||
    SUPPORTED_LANGUAGES[0];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="sticky top-0 z-40 w-full">
      {/* ========================================================================= */}
      {/* 1. MAIN GLOBAL HEADER (Ultra-Compact, Responsive, Never Overflows)         */}
      {/* ========================================================================= */}
      <header
        id="main-header"
        className={`w-full border-b backdrop-blur-md transition-all duration-300 ${
          isBurgundy
            ? 'bg-[#1e070e]/95 border-[#3b101c] text-[#fce7f3] shadow-md shadow-black/20'
            : 'bg-white/95 border-[#ebe7df] text-[#1c1917] shadow-xs'
        }`}
      >
        <div className="w-full max-w-[1360px] mx-auto px-3 sm:px-6 py-2 sm:py-2.5">
          <div className="flex items-center justify-between gap-2">
            
            {/* BRAND LOGO */}
            <button
              type="button"
              onClick={onNavigateToGallery}
              className="flex items-center gap-2 sm:gap-2.5 shrink-0 text-left cursor-pointer transition-transform hover:opacity-90"
              title="الرئيسية - معرض البرومبتات"
            >
              <BrandLogo size="sm" theme={theme} />
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-xl font-black tracking-tight">Face</span>
                <span className={`text-base sm:text-xl font-black tracking-tight ${isBurgundy ? 'text-[#f43f5e]' : 'text-[#6b0f24]'}`}>
                  Prompt
                </span>
                <span
                  className={`hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                    isBurgundy
                      ? 'bg-[#15040a] border-[#3b101c] text-[#fda4af]'
                      : 'bg-[#f7f4ee] border-[#e7e5e4] text-[#6b0f24]'
                  }`}
                >
                  Pro
                </span>
              </div>
            </button>

            {/* CENTER: CLEAN SEGMENTED NAVIGATION TABS (DESKTOP & TABLET) */}
            <nav
              className={`hidden md:flex items-center p-1 rounded-full border transition-all ${
                isBurgundy
                  ? 'bg-[#15040a] border-[#3b101c]'
                  : 'bg-[#f5f2eb] border-[#e7e5e4]'
              }`}
            >
              {/* Gallery Tab */}
              <button
                type="button"
                id="header-gallery-tab"
                onClick={onNavigateToGallery}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  currentView === 'gallery'
                    ? isBurgundy
                      ? 'bg-[#f43f5e] text-white shadow-xs'
                      : 'bg-white text-[#6b0f24] shadow-xs'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>المعرض</span>
              </button>

              {/* Profile Tab */}
              <button
                type="button"
                id="header-profile-tab"
                onClick={onOpenProfile}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  currentView === 'profile'
                    ? isBurgundy
                      ? 'bg-[#f43f5e] text-white shadow-xs'
                      : 'bg-white text-[#6b0f24] shadow-xs'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>الملف الشخصي</span>
              </button>

              {/* Start Screen Tab */}
              {onOpenStartScreen && (
                <button
                  type="button"
                  id="header-start-tab"
                  onClick={onOpenStartScreen}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    currentView === 'start'
                      ? isBurgundy
                        ? 'bg-[#f43f5e] text-white shadow-xs'
                        : 'bg-white text-[#6b0f24] shadow-xs'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>شاشة البدء</span>
                </button>
              )}

              {/* Proto AI Assistant Tab */}
              {onOpenAiAssistant && (
                <button
                  type="button"
                  id="header-ai-tab"
                  onClick={onOpenAiAssistant}
                  title="المساعد الذكي بروتو | Proto AI"
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isBurgundy
                      ? 'text-rose-300 hover:text-white hover:bg-rose-950/60'
                      : 'text-[#6b0f24] hover:bg-stone-200/80'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                  <span>بروتو الذكي</span>
                </button>
              )}
            </nav>

            {/* RIGHT: ESSENTIAL ACTIONS CLUSTER (Compact & Never Overflows) */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              
              {/* Customer Support Button (خدمة العملاء) */}
              <button
                type="button"
                id="customerSupportBtn"
                onClick={onOpenSupportModal}
                title="خدمة العملاء والدعم الفني"
                className={`h-8 sm:h-9 px-2 sm:px-3 rounded-full border flex items-center gap-1.5 text-xs font-bold cursor-pointer transition-all hover:scale-105 relative ${
                  isBurgundy
                    ? 'border-[#3b101c] bg-[#15040a] text-[#fce7f3] hover:border-[#f43f5e]'
                    : 'border-[#e7e5e4] bg-[#fdfbf7] text-[#1c1917] hover:border-[#6b0f24] shadow-2xs'
                }`}
              >
                <Headphones className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span className="hidden sm:inline">الدعم</span>
                {newTicketsCount > 0 && isAuthorized && (
                  <span className="w-4 h-4 rounded-full bg-amber-400 text-black font-black text-[9px] flex items-center justify-center -mr-0.5">
                    {newTicketsCount}
                  </span>
                )}
              </button>

              {/* Google Account Pill / Login Button */}
              <button
                type="button"
                id="headerGoogleLoginBtn"
                onClick={onOpenAccountSelector}
                title={isLoggedIn ? `متصل: ${userName}` : 'الدخول بحساب Google'}
                className={`h-8 sm:h-9 px-2 sm:px-2.5 rounded-full border flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-all ${
                  isLoggedIn
                    ? isBurgundy
                      ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300'
                      : 'border-emerald-300 bg-emerald-50 text-emerald-800'
                    : isBurgundy
                    ? 'border-[#3b101c] bg-[#15040a] text-[#fda4af] hover:border-[#f43f5e]'
                    : 'border-[#e7e5e4] bg-[#fdfbf7] text-[#1c1917] hover:border-[#6b0f24] shadow-2xs'
                }`}
              >
                {/* Google G SVG */}
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>

                <span className="truncate max-w-[65px] sm:max-w-[100px] hidden xs:inline text-[11px] sm:text-xs">
                  {isLoggedIn ? userName : 'Google'}
                </span>
              </button>

              {/* Netlify Export / Save Guide Button */}
              {onOpenNetlifyModal && (
                <button
                  type="button"
                  id="headerNetlifyExportBtn"
                  onClick={onOpenNetlifyModal}
                  title="نقل وحفظ الموقع على Netlify (تحميل index.html)"
                  className={`h-8 sm:h-9 px-2 sm:px-2.5 rounded-full border flex items-center gap-1 text-xs font-black cursor-pointer transition-all ${
                    isBurgundy
                      ? 'border-cyan-500/50 bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/60 shadow-xs'
                      : 'border-cyan-300 bg-cyan-50 text-cyan-800 hover:bg-cyan-100 shadow-2xs'
                  }`}
                >
                  <CloudUpload className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                  <span className="hidden sm:inline">نقل لـ Netlify</span>
                </button>
              )}

              {/* Language Switcher */}
              <button
                type="button"
                id="headerLanguageBtn"
                onClick={onOpenLanguageModal}
                title={t.languageSelect}
                className={`h-8 sm:h-9 px-2 rounded-full border flex items-center gap-1 text-xs font-bold cursor-pointer transition-all ${
                  isBurgundy
                    ? 'border-[#3b101c] bg-[#15040a] text-[#fce7f3] hover:border-[#f43f5e]'
                    : 'border-[#e7e5e4] bg-[#fdfbf7] text-[#1c1917] hover:border-[#6b0f24] shadow-2xs'
                }`}
              >
                <span className="text-sm">{currentLangObj.flag}</span>
              </button>

              {/* Theme Switcher */}
              <button
                type="button"
                id="headerThemeToggleBtn"
                onClick={onToggleTheme}
                title={isBurgundy ? t.themeWhite : t.themeBurgundy}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border flex items-center justify-center cursor-pointer transition-all ${
                  isBurgundy
                    ? 'border-[#3b101c] bg-[#15040a] text-amber-300 hover:text-white'
                    : 'border-[#e7e5e4] bg-[#fdfbf7] text-[#6b0f24] hover:text-black shadow-2xs'
                }`}
              >
                {isBurgundy ? <Sun className="w-3.5 h-3.5" /> : <Palette className="w-3.5 h-3.5" />}
              </button>

              {/* Mobile Menu Toggle Button (Visible only on small screens) */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className="md:hidden w-8 h-8 rounded-full border border-inherit flex items-center justify-center cursor-pointer"
                aria-label="القائمة"
              >
                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Navigation Drawer */}
          {isMobileMenuOpen && (
            <div className="md:hidden pt-2.5 pb-1 mt-2 border-t border-inherit flex items-center justify-around gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onNavigateToGallery) onNavigateToGallery();
                }}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 ${
                  currentView === 'gallery'
                    ? isBurgundy
                      ? 'bg-[#f43f5e] text-white'
                      : 'bg-[#6b0f24] text-white'
                    : 'opacity-70'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>المعرض</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenProfile();
                }}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 ${
                  currentView === 'profile'
                    ? isBurgundy
                      ? 'bg-[#f43f5e] text-white'
                      : 'bg-[#6b0f24] text-white'
                    : 'opacity-70'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>الملف الشخصي</span>
              </button>

              {onOpenStartScreen && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenStartScreen();
                  }}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 ${
                    currentView === 'start'
                      ? isBurgundy
                        ? 'bg-[#f43f5e] text-white'
                        : 'bg-[#6b0f24] text-white'
                      : 'opacity-70'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>شاشة البدء</span>
                </button>
              )}

              {onOpenAiAssistant && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAiAssistant();
                  }}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 ${
                    isBurgundy
                      ? 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
                      : 'bg-stone-100 text-[#6b0f24] border border-[#e5e2de]'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5 text-rose-500" />
                  <span>بروتو AI</span>
                </button>
              )}

              {onOpenNetlifyModal && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenNetlifyModal();
                  }}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 ${
                    isBurgundy
                      ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/30'
                      : 'bg-cyan-50 text-cyan-800 border border-cyan-200'
                  }`}
                >
                  <CloudUpload className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Netlify</span>
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. DEDICATED ADMIN COMMAND SUB-BAR (Rendered ONLY for Authorized Admins)  */}
      {/* ========================================================================= */}
      {isAuthorized && (
        <div
          id="admin-command-subbar"
          className={`w-full border-b transition-all duration-200 py-1.5 px-3 sm:px-6 shadow-xs ${
            isBurgundy
              ? 'bg-[#15040a] border-[#3b101c] text-[#fce7f3]'
              : 'bg-[#fcfaf7] border-[#ebe5dc] text-[#1c1917]'
          }`}
        >
          <div className="w-full max-w-[1360px] mx-auto flex items-center justify-between flex-wrap gap-2">
            
            {/* Admin Identity Label */}
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] sm:text-xs font-black tracking-tight flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>شريط أدوات الإدارة</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold hidden sm:inline">• فريق الدعم المعتمد</span>
              </span>
            </div>

            {/* Admin Action Buttons (Neatly aligned and fully accessible) */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              
              {/* 1. Quick Add New Prompt Button */}
              <button
                type="button"
                id="adminSubbarAddPromptBtn"
                onClick={onOpenCreateModal}
                title="إضافة وتوليد برومبت جديد"
                className={`h-7 sm:h-8 px-2.5 sm:px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 text-white cursor-pointer shadow-xs transition-transform hover:scale-105 active:scale-95 ${
                  isBurgundy
                    ? 'bg-gradient-to-r from-[#f43f5e] to-[#e11d48]'
                    : 'bg-gradient-to-r from-[#6b0f24] to-[#881337]'
                }`}
              >
                <Plus className="w-3.5 h-3.5 shrink-0" />
                <span>إضافة برومبت جديد</span>
              </button>

              {/* 2. Admin Panel Button */}
              <button
                type="button"
                id="adminSubbarPanelBtn"
                onClick={onOpenAdminPanel}
                title="فتح لوحة الإدارة الشاملة وإحصائيات النظام"
                className={`h-7 sm:h-8 px-2.5 sm:px-3 rounded-lg border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                  isBurgundy
                    ? 'border-[#581827] bg-[#240611] text-emerald-400 hover:border-emerald-500'
                    : 'border-[#e7e5e4] bg-white text-emerald-800 hover:border-emerald-600 shadow-2xs'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="hidden xs:inline">لوحة الإدارة</span>
              </button>

              {/* 3. Manage Mode Toggle (Quick Edit Mode) */}
              <button
                type="button"
                id="adminSubbarManageModeBtn"
                onClick={onToggleManageMode}
                title={manageMode ? 'إيقاف وضع التعديل' : 'تفعيل وضع التعديل السريع'}
                className={`h-7 sm:h-8 px-2.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                  manageMode
                    ? isBurgundy
                      ? 'border-amber-500/60 bg-amber-950/40 text-amber-300'
                      : 'border-amber-300 bg-amber-50 text-amber-800'
                    : isBurgundy
                    ? 'border-[#3b101c] bg-[#1e070e] text-[#fda4af]'
                    : 'border-[#e7e5e4] bg-white text-[#78716c]'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">{manageMode ? 'وضع التعديل: مفعّل' : 'تعديل المنشورات'}</span>
              </button>

              {/* 4. Support Inbox Shortcut */}
              <button
                type="button"
                id="adminSubbarTicketsBtn"
                onClick={onOpenSupportModal}
                title="صندوق رسائل خدمة العملاء وتذاكر الدعم"
                className={`h-7 sm:h-8 px-2 sm:px-2.5 rounded-lg border text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                  isBurgundy
                    ? 'border-[#3b101c] bg-[#1e070e] text-[#fce7f3] hover:border-[#f43f5e]'
                    : 'border-[#e7e5e4] bg-white text-[#1c1917] hover:border-[#6b0f24]'
                }`}
              >
                <Headphones className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span className="hidden md:inline">صندوق الدعم</span>
                {newTicketsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-black font-black text-[10px]">
                    {newTicketsCount}
                  </span>
                )}
              </button>

              {/* 5. Netlify Standalone Singlefile Download */}
              <a
                href="/api/download-index-html"
                download="index.html"
                id="adminSubbarDownloadNetlifyBtn"
                title="تحميل ملف index.html مدمج بالكامل لرفعه مباشرة على Netlify"
                className={`h-7 sm:h-8 px-2.5 sm:px-3 rounded-lg border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-xs ${
                  isBurgundy
                    ? 'border-cyan-500/50 bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/60'
                    : 'border-cyan-300 bg-cyan-50 text-cyan-800 hover:bg-cyan-100'
                }`}
              >
                <Download className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                <span>تحميل لـ Netlify (ملف واحد)</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
