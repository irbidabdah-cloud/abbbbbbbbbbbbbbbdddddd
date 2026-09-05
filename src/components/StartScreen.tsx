import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe,
  Sun,
  Palette,
  ArrowLeft,
  User,
  Sparkles,
  CheckCircle2,
  Headphones,
  CloudUpload,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { ThemeMode, checkIsAuthorized } from '../types';
import { TranslationDictionary, SUPPORTED_LANGUAGES } from '../lib/i18n';

interface StartScreenProps {
  theme: ThemeMode;
  userEmail: string | null;
  userName: string;
  onEnterGallery: () => void;
  onEnterProfile: () => void;
  onOpenGoogleLogin: () => void;
  onOpenSupportModal?: () => void;
  onOpenAiAssistant?: () => void;
  onToggleTheme: () => void;
  currentLanguage: string;
  onOpenLanguageModal: () => void;
  t: TranslationDictionary;
  onOpenNetlifyModal?: () => void;
}

export function StartScreen({
  theme,
  userEmail,
  userName,
  onEnterGallery,
  onEnterProfile,
  onOpenGoogleLogin,
  onOpenSupportModal,
  onOpenAiAssistant,
  onToggleTheme,
  currentLanguage,
  onOpenLanguageModal,
  t,
  onOpenNetlifyModal,
}: StartScreenProps) {
  const isBurgundy = theme === 'burgundy';
  const isLoggedIn = Boolean(userEmail && userEmail.trim());
  const isAuthorized = isLoggedIn ? checkIsAuthorized(userEmail) : false;
  const currentLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) ||
    SUPPORTED_LANGUAGES[0];

  // State for cinematic enter transition
  const [isEntering, setIsEntering] = useState(false);
  const [destination, setDestination] = useState<'gallery' | 'profile'>('gallery');

  const handleTriggerEnter = (target: 'gallery' | 'profile') => {
    setDestination(target);
    setIsEntering(true);
    setTimeout(() => {
      if (target === 'gallery') {
        onEnterGallery();
      } else {
        onEnterProfile();
      }
    }, 600);
  };

  return (
    <motion.div
      id="start-screen-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className={`min-h-screen w-full flex flex-col justify-between transition-colors duration-300 relative overflow-hidden ${
        isBurgundy ? 'bg-[#15040a] text-[#fce7f3]' : 'bg-[#faf8f5] text-[#1c1917]'
      }`}
    >
      {/* Subtle Ambient Background Glow */}
      <div
        className={`absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full pointer-events-none opacity-20 ${
          isBurgundy
            ? 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose-600/40 via-rose-950/20 to-transparent'
            : 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose-900/15 via-rose-200/10 to-transparent'
        }`}
      />

      {/* ========================================================================= */}
      {/* 1. TOP BAR (Custom Designed Logo + Google Sign In + Language + Theme)     */}
      {/* ========================================================================= */}
      <motion.header
        initial={{ y: -15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className={`relative z-20 w-full px-5 sm:px-10 py-4 sm:py-5 flex items-center justify-between border-b ${
          isBurgundy
            ? 'border-[#2d0a15] bg-[#15040a]/85 backdrop-blur-md'
            : 'border-[#ebe7df] bg-[#faf8f5]/85 backdrop-blur-md'
        }`}
      >
        {/* Bespoke Hand-Crafted FacePrompt Logo */}
        <div className="flex items-center gap-2.5">
          <BrandLogo size="sm" theme={theme} />
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-lg sm:text-xl tracking-tight">Face</span>
            <span
              className={`font-extrabold text-lg sm:text-xl tracking-tight ${
                isBurgundy ? 'text-[#f43f5e]' : 'text-[#6b0f24]'
              }`}
            >
              Prompt
            </span>
          </div>
        </div>

        {/* Right Actions: Google Sign-in Button + Language + Theme */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* GOOGLE SIGN IN BUTTON */}
          <button
            type="button"
            id="start-screen-google-btn"
            onClick={onOpenGoogleLogin}
            className={`h-9 sm:h-10 px-3.5 sm:px-4 rounded-full border flex items-center gap-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              isLoggedIn
                ? isBurgundy
                  ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300'
                  : 'border-emerald-300 bg-emerald-50 text-emerald-800'
                : isBurgundy
                ? 'border-[#4a1222] bg-[#240611] text-white hover:border-[#f43f5e]'
                : 'border-[#e0ded8] bg-white text-[#1c1917] hover:border-[#6b0f24] shadow-2xs'
            }`}
          >
            {/* Google G SVG */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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

            {isLoggedIn ? (
              <span className="truncate max-w-[110px] sm:max-w-[140px] font-bold">{userName}</span>
            ) : (
              <span className="whitespace-nowrap">الدخول بحساب Google</span>
            )}
          </button>

          {/* Customer Support Button */}
          {onOpenSupportModal && (
            <button
              type="button"
              id="start-screen-support-btn"
              onClick={onOpenSupportModal}
              title="خدمة العملاء والدعم الفني"
              className={`h-9 sm:h-10 px-3 sm:px-3.5 rounded-full border flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-all ${
                isBurgundy
                  ? 'border-[#2d0a15] bg-[#1e070e] text-[#fce7f3] hover:border-[#f43f5e]'
                  : 'border-[#e0ded8] bg-white text-[#1c1917] hover:border-[#6b0f24]'
              }`}
            >
              <Headphones className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span className="hidden sm:inline">الدعم الفني</span>
            </button>
          )}

          {/* Netlify Export / Save Guide Button */}
          {onOpenNetlifyModal && (
            <button
              type="button"
              id="start-screen-netlify-btn"
              onClick={onOpenNetlifyModal}
              title="نقل وحفظ الموقع على Netlify"
              className={`h-9 sm:h-10 px-3 sm:px-3.5 rounded-full border flex items-center gap-1.5 text-xs font-bold cursor-pointer transition-all ${
                isBurgundy
                  ? 'border-cyan-500/40 bg-cyan-950/30 text-cyan-300 hover:border-cyan-400'
                  : 'border-cyan-300 bg-cyan-50 text-cyan-800 hover:border-cyan-500 shadow-2xs'
              }`}
            >
              <CloudUpload className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
              <span className="hidden sm:inline">نقل لـ Netlify</span>
            </button>
          )}

          {/* Language Switch */}
          <button
            type="button"
            onClick={onOpenLanguageModal}
            className={`h-9 sm:h-10 px-3 rounded-full border flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-all ${
              isBurgundy
                ? 'border-[#2d0a15] bg-[#1e070e] text-[#fce7f3] hover:border-[#f43f5e]'
                : 'border-[#e0ded8] bg-white text-[#1c1917] hover:border-[#6b0f24]'
            }`}
          >
            <span className="text-sm">{currentLangObj.flag}</span>
            <span className="font-mono uppercase text-[11px] hidden xs:inline">{currentLangObj.code}</span>
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center cursor-pointer transition-all ${
              isBurgundy
                ? 'border-[#2d0a15] bg-[#1e070e] text-amber-300 hover:text-white'
                : 'border-[#e0ded8] bg-white text-[#6b0f24] hover:text-black'
            }`}
          >
            {isBurgundy ? <Sun className="w-4 h-4" /> : <Palette className="w-4 h-4" />}
          </button>
        </div>
      </motion.header>

      {/* ========================================================================= */}
      {/* 2. HERO CONTENT (Minimalist, Aesthetic, Centered)                         */}
      {/* ========================================================================= */}
      <main className="relative z-10 flex-1 max-w-[960px] w-full mx-auto px-6 sm:px-10 py-12 sm:py-20 flex flex-col items-center justify-center text-center">
        
        {/* Custom Logo Badge in Hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <BrandLogo size="lg" theme={theme} />
        </motion.div>

        {/* Small Intro Pill */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border ${
            isBurgundy
              ? 'bg-[#240611] border-[#4a1222] text-[#fda4af]'
              : 'bg-white border-[#e0ded8] text-[#6b0f24] shadow-2xs'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          <span>منصة هندسة وتوليد برومبتات الوجه والواقعية</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.15] mb-5 max-w-[800px]"
        >
          ابتكر صوراً واقعية بدقة استثنائية
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={`text-sm sm:text-base md:text-lg max-w-[560px] mb-10 leading-relaxed ${
            isBurgundy ? 'text-[#fce7f3]/75' : 'text-[#57534e]'
          }`}
        >
          مجموعة مختارة من أفضل برومبتات استوديو الذكاء الاصطناعي مع تحكم متقدم في الإضاءة والكاميرات وتفاصيل الملامح.
        </motion.p>

        {/* Interactive Action Buttons with Cinematic Click Effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto"
        >
          {/* Main Enter Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            type="button"
            id="enter-gallery-main-btn"
            onClick={() => handleTriggerEnter('gallery')}
            disabled={isEntering}
            className={`w-full sm:w-auto h-12 sm:h-13 px-8 rounded-full font-bold text-sm sm:text-base text-white flex items-center justify-center gap-2.5 cursor-pointer transition-all shadow-md ${
              isBurgundy
                ? 'bg-gradient-to-r from-[#f43f5e] to-[#e11d48] hover:shadow-[0_0_20px_rgba(244,63,94,0.4)]'
                : 'bg-gradient-to-r from-[#6b0f24] to-[#881337] hover:shadow-[0_0_20px_rgba(107,15,36,0.25)]'
            }`}
          >
            <span>دخول المعرض</span>
            <ArrowLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
          </motion.button>

          {/* Secondary Action: Profile */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            id="enter-profile-btn"
            onClick={() => handleTriggerEnter('profile')}
            disabled={isEntering}
            className={`w-full sm:w-auto h-12 sm:h-13 px-6 rounded-full font-semibold text-sm flex items-center justify-center gap-2 border cursor-pointer transition-all ${
              isBurgundy
                ? 'border-[#2d0a15] bg-[#1e070e] text-[#fce7f3] hover:border-[#f43f5e]'
                : 'border-[#e0ded8] bg-white text-[#1c1917] hover:border-[#6b0f24]'
            }`}
          >
            <User className="w-4 h-4 opacity-70" />
            <span>الملف الشخصي</span>
          </motion.button>

          {/* AI Assistant Button */}
          {onOpenAiAssistant && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              id="enter-ai-assistant-btn"
              onClick={onOpenAiAssistant}
              disabled={isEntering}
              className={`w-full sm:w-auto h-12 sm:h-13 px-6 rounded-full font-semibold text-sm flex items-center justify-center gap-2 border cursor-pointer transition-all ${
                isBurgundy
                  ? 'border-rose-500/40 bg-[#2b0814] text-rose-200 hover:border-rose-400 hover:bg-[#3d0b1c]'
                  : 'border-rose-300 bg-rose-50/80 text-[#6b0f24] hover:bg-rose-100 hover:border-[#6b0f24]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-rose-500 animate-pulse" />
              <span>المساعد الذكي (AI)</span>
            </motion.button>
          )}
        </motion.div>
      </main>

      {/* ========================================================================= */}
      {/* 3. FOOTER WITH MINIMALIST DESIGNER SIGNATURE (Abdalrhmn ebdah)            */}
      {/* ========================================================================= */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className={`relative z-20 w-full px-6 sm:px-10 py-5 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${
          isBurgundy
            ? 'border-[#2d0a15] text-[#fce7f3]/60'
            : 'border-[#ebe7df] text-[#78716c]'
        }`}
      >
        {/* Status */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
          <span>المنصة جاهزة ومحدثة 2026</span>
        </div>

        {/* Clean Signature */}
        <div
          id="designer-signature-minimal"
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border transition-all ${
            isBurgundy
              ? 'bg-[#1e070e] border-[#2d0a15] text-[#fce7f3]'
              : 'bg-white border-[#e0ded8] text-[#1c1917] shadow-2xs'
          }`}
        >
          <span className="opacity-70">تصميم وتطوير:</span>
          <span className="font-extrabold text-rose-500 tracking-wide">
            Abdalrhmn ebdah
          </span>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
        </div>
      </motion.footer>

      {/* ========================================================================= */}
      {/* 4. CINEMATIC ENTER TRANSITION OVERLAY                                     */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isEntering && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-lg ${
              isBurgundy ? 'bg-[#15040a]/95' : 'bg-[#faf8f5]/95'
            }`}
          >
            {/* Expanding Glowing Core Ring */}
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: [0.4, 1.2, 1.8], opacity: [0, 0.8, 0] }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className={`absolute w-72 h-72 rounded-full border-2 ${
                isBurgundy ? 'border-[#f43f5e] bg-rose-500/10' : 'border-[#6b0f24] bg-rose-900/10'
              }`}
            />

            {/* Pulsing Brand Logo */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: [0.7, 1.15, 1], opacity: 1 }}
              transition={{ duration: 0.4, ease: 'backOut' }}
              className="relative z-10 flex flex-col items-center"
            >
              <BrandLogo size="xl" theme={theme} isSpinning={true} />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mt-4 font-black text-sm tracking-wide text-rose-500"
              >
                {destination === 'gallery' ? 'جاري فتح المعرض...' : 'جاري فتح الملف الشخصي...'}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
