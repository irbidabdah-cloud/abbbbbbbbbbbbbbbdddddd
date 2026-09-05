import React, { memo, useState } from 'react';
import {
  Camera,
  Check,
  Columns2,
  Copy,
  Edit3,
  Maximize2,
  SlidersHorizontal,
  Trash2,
} from 'lucide-react';
import { Post, ThemeMode } from '../types';
import { TranslationDictionary } from '../lib/i18n';

interface PostCardProps {
  key?: string;
  post: Post;
  theme: ThemeMode;
  isAuthorized: boolean;
  manageMode: boolean;
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
  onOpenLightbox: (
    imageUrl: string,
    title: string,
    type: 'setup' | 'result',
    subtitle?: string
  ) => void;
  t: TranslationDictionary;
}

function PostCardComponent({
  post,
  theme,
  isAuthorized,
  manageMode,
  onEdit,
  onDelete,
  onOpenLightbox,
  t,
}: PostCardProps) {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'slider'>('split');
  const [sliderPosition, setSliderPosition] = useState(50);

  const isBurgundy = theme === 'burgundy';

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(post.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <article
      id={`post-card-${post.id}`}
      className={`rounded-2xl sm:rounded-3xl border p-3.5 sm:p-5 md:p-6 transition-all duration-300 relative shadow-md hover:shadow-lg ${
        isBurgundy
          ? 'bg-[#3b101c] border-[#581827] text-[#fce7f3] shadow-black/40 hover:border-[#6b162f]'
          : 'bg-white border-[#e7e5e4] text-[#1c1917] shadow-slate-200/60 hover:border-slate-300'
      }`}
    >
      {/* Responsive layout: Single-column on mobile, Dual-column studio layout on tablet, laptop, desktop, Xbox */}
      <div className="flex flex-col md:grid md:grid-cols-12 md:gap-5 lg:gap-7 items-stretch">
        {/* =========================================================================
            COLUMN 1: Visual Stage (9:16 Stories Comparison - Split & Interactive Slider)
            ========================================================================= */}
        <div className="md:col-span-5 lg:col-span-5 xl:col-span-5 flex flex-col justify-between mb-4 md:mb-0">
          {/* View Mode Toggle Controls */}
          <div className="flex items-center justify-between gap-2 mb-2.5 sm:mb-3">
            <span
              className={`font-bold flex items-center gap-1.5 text-xs sm:text-sm ${
                isBurgundy ? 'text-[#fda4af]' : 'text-[#78716c]'
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span className="font-mono text-[11px] sm:text-xs bg-rose-500/10 text-rose-600 px-1.5 py-0.5 rounded-md font-bold">
                9:16 Story
              </span>
            </span>

            <div
              className={`flex items-center p-0.5 sm:p-1 rounded-xl border text-[10px] sm:text-[11px] shrink-0 ${
                isBurgundy
                  ? 'bg-[#1e070e] border-[#581827]'
                  : 'bg-[#f1ede4] border-[#e7e5e4]'
              }`}
            >
              <button
                type="button"
                onClick={() => setViewMode('split')}
                className={`px-2 sm:px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  viewMode === 'split'
                    ? isBurgundy
                      ? 'bg-[#f43f5e] text-white shadow-xs'
                      : 'bg-[#6b0f24] text-white shadow-xs'
                    : isBurgundy
                    ? 'text-[#fda4af] hover:text-white'
                    : 'text-[#78716c] hover:text-[#1c1917]'
                }`}
              >
                <Columns2 className="w-3 h-3" />
                <span>{t.splitView}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('slider')}
                className={`px-2 sm:px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  viewMode === 'slider'
                    ? isBurgundy
                      ? 'bg-[#f43f5e] text-white shadow-xs'
                      : 'bg-[#6b0f24] text-white shadow-xs'
                    : isBurgundy
                    ? 'text-[#fda4af] hover:text-white'
                    : 'text-[#78716c] hover:text-[#1c1917]'
                }`}
              >
                <SlidersHorizontal className="w-3 h-3" />
                <span>{t.sliderView}</span>
              </button>
            </div>
          </div>

          {/* Stories Images Section (9:16 Aspect Ratio) */}
          {viewMode === 'split' ? (
            <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full my-auto">
              {/* 1. Setup / Behind-the-scenes Image (قبل - وضعية التصوير) */}
              <div className="flex flex-col gap-1 sm:gap-1.5">
                <div
                  className={`text-[11px] sm:text-xs font-bold flex items-center justify-between ${
                    isBurgundy ? 'text-[#fda4af]' : 'text-[#78716c]'
                  }`}
                >
                  <span className="flex items-center gap-1 truncate text-[10px] sm:text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    <span className="truncate">{t.setupHeading}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      onOpenLightbox(
                        post.setupImage,
                        post.title,
                        'setup',
                        post.setupTitle || t.setupHeading
                      )
                    }
                    title={t.clickEnlarge}
                    className="opacity-70 hover:opacity-100 p-0.5 cursor-pointer transition-opacity shrink-0"
                  >
                    <Maximize2 className="w-3 h-3" />
                  </button>
                </div>

                <div
                  className={`relative w-full aspect-[9/16] rounded-xl sm:rounded-2xl overflow-hidden border group cursor-pointer shadow-xs ${
                    isBurgundy
                      ? 'bg-[#1e070e] border-[#581827]'
                      : 'bg-[#f1ede4] border-[#e7e5e4]'
                  }`}
                  onClick={() =>
                    onOpenLightbox(
                      post.setupImage,
                      post.title,
                      'setup',
                      post.setupTitle || t.setupHeading
                    )
                  }
                >
                  <img
                    src={post.setupImage}
                    alt={`${t.setupHeading} - ${post.title}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                    <span className="text-white text-[9px] sm:text-[10px] font-bold bg-black/60 backdrop-blur-xs px-1.5 py-0.5 rounded-md">
                      {t.clickEnlarge}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. Result / Final AI Stories Image (بعد - نتيجة البرومبت) */}
              <div className="flex flex-col gap-1 sm:gap-1.5">
                <div
                  className={`text-[11px] sm:text-xs font-bold flex items-center justify-between ${
                    isBurgundy ? 'text-[#fda4af]' : 'text-[#78716c]'
                  }`}
                >
                  <span className="flex items-center gap-1 truncate text-[10px] sm:text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                    <span className="truncate">{t.resultHeading}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      onOpenLightbox(
                        post.resultImage,
                        post.title,
                        'result',
                        post.prompt
                      )
                    }
                    title={t.clickEnlarge}
                    className="opacity-70 hover:opacity-100 p-0.5 cursor-pointer transition-opacity shrink-0"
                  >
                    <Maximize2 className="w-3 h-3" />
                  </button>
                </div>

                <div
                  className={`relative w-full aspect-[9/16] rounded-xl sm:rounded-2xl overflow-hidden border group cursor-pointer shadow-xs ${
                    isBurgundy
                      ? 'bg-[#1e070e] border-[#581827]'
                      : 'bg-[#f1ede4] border-[#e7e5e4]'
                  }`}
                  onClick={() =>
                    onOpenLightbox(
                      post.resultImage,
                      post.title,
                      'result',
                      post.prompt
                    )
                  }
                >
                  <img
                    src={post.resultImage}
                    alt={`${t.resultHeading} - ${post.title}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                    <span className="text-white text-[9px] sm:text-[10px] font-bold bg-black/60 backdrop-blur-xs px-1.5 py-0.5 rounded-md">
                      {t.clickEnlarge}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Interactive Split Slider Mode (9:16 Aspect Ratio) */
            <div className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[340px] mx-auto my-auto">
              <div
                className={`relative w-full aspect-[9/16] rounded-xl sm:rounded-2xl overflow-hidden border select-none shadow-xs ${
                  isBurgundy ? 'border-[#581827]' : 'border-[#e7e5e4]'
                }`}
              >
                {/* Background: Result Image (بعد) */}
                <img
                  src={post.resultImage}
                  alt={t.resultHeading}
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />

                {/* Foreground: Setup Image (قبل) clipped to sliderPosition */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${sliderPosition}%` }}
                >
                  <img
                    src={post.setupImage}
                    alt={t.setupHeading}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                      width: '100%',
                      minWidth: '100%',
                    }}
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Divider Line */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] cursor-ew-resize z-20 flex items-center justify-center -translate-x-1/2"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-black flex items-center justify-center shadow-lg text-xs font-bold border border-black/10">
                    ↔
                  </div>
                </div>

                {/* Badges on slider */}
                <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-xs text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md z-10">
                  {t.setupHeading}
                </div>
                <div className="absolute top-2.5 left-2.5 bg-[#6b0f24]/90 backdrop-blur-xs text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md z-10">
                  {t.resultHeading}
                </div>

                {/* Slider range input overlay */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPosition}
                  onChange={(e) => setSliderPosition(Number(e.target.value))}
                  aria-label="Slider comparison"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
                />
              </div>
              <p className="text-[10px] sm:text-[11px] text-center mt-1.5 opacity-60">
                {t.sliderView} • اسحب المقبض للمقارنة
              </p>
            </div>
          )}
        </div>

        {/* =========================================================================
            COLUMN 2: Information, Shooting Specs, Prompt Studio & Copy Action
            ========================================================================= */}
        <div className="md:col-span-7 lg:col-span-7 xl:col-span-7 flex flex-col justify-between pt-1 md:pt-0">
          <div>
            {/* Post Title & Category & Actions Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-inherit">
              <div className="flex items-center gap-2 min-w-0">
                <h3 className="text-base sm:text-lg md:text-xl font-extrabold tracking-tight truncate">
                  {post.title}
                </h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold border shrink-0 ${
                    isBurgundy
                      ? 'bg-[#1e070e] border-[#581827] text-[#f43f5e]'
                      : 'bg-[#f1ede4] border-[#e7e5e4] text-[#6b0f24]'
                  }`}
                >
                  {post.category}
                </span>
              </div>

              {/* Action Buttons: Edit & Delete (if authorized and manageMode is active) */}
              {isAuthorized && (
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    id={`btn-edit-${post.id}`}
                    type="button"
                    onClick={() => onEdit(post)}
                    title={t.edit}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer border ${
                      isBurgundy
                        ? 'bg-blue-950/40 hover:bg-blue-950/70 border-blue-500/40 text-blue-300'
                        : 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700'
                    }`}
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>{t.edit}</span>
                  </button>

                  <button
                    id={`btn-delete-${post.id}`}
                    type="button"
                    onClick={() => onDelete(post)}
                    title={t.delete}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer border ${
                      isBurgundy
                        ? 'bg-red-950/40 hover:bg-red-950/70 border-red-500/40 text-red-300'
                        : 'bg-red-50 hover:bg-red-100 border-red-200 text-red-700'
                    }`}
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>{t.delete}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Technical Specs Tags Bar (Lens, Lighting, Angle, Aspect Ratio) */}
            <div className="flex items-center gap-1.5 flex-wrap mb-3 text-[11px]">
              {post.aspectRatio && (
                <span
                  className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold border ${
                    isBurgundy
                      ? 'bg-[#1e070e] border-[#581827] text-amber-300'
                      : 'bg-[#f1ede4] border-[#e7e5e4] text-[#6b0f24]'
                  }`}
                >
                  {post.aspectRatio}
                </span>
              )}
              {post.lens && (
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-medium border truncate ${
                    isBurgundy
                      ? 'bg-[#1e070e]/80 border-[#581827] text-[#fda4af]'
                      : 'bg-[#f8f6f0] border-[#e7e5e4] text-[#78716c]'
                  }`}
                >
                  📷 {post.lens}
                </span>
              )}
              {post.lighting && (
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-medium border truncate ${
                    isBurgundy
                      ? 'bg-[#1e070e]/80 border-[#581827] text-[#fda4af]'
                      : 'bg-[#f8f6f0] border-[#e7e5e4] text-[#78716c]'
                  }`}
                >
                  💡 {post.lighting}
                </span>
              )}
            </div>

            {/* Instruction Box: طريقة التصوير وزاوية الكاميرا المطلوبة */}
            <div
              className={`rounded-xl sm:rounded-2xl p-3 sm:p-3.5 text-xs sm:text-sm leading-relaxed mb-3 border-r-4 transition-colors ${
                isBurgundy
                  ? 'bg-[#1e070e] text-[#fce7f3] border-[#f43f5e]'
                  : 'bg-[#f1ede4] text-[#1c1917] border-[#6b0f24]'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1 font-bold">
                <Camera className="w-3.5 h-3.5 text-rose-500" />
                <span className={isBurgundy ? 'text-[#f43f5e]' : 'text-[#6b0f24]'}>
                  {t.setupHeading}:
                </span>
              </div>
              <p className="text-xs sm:text-[13px] opacity-95">{post.description}</p>
              {post.setupTitle && (
                <p
                  className={`text-[11px] mt-1 opacity-75 ${
                    isBurgundy ? 'text-[#fda4af]' : 'text-[#78716c]'
                  }`}
                >
                  {post.setupTitle}
                </p>
              )}
            </div>

            {/* Prompt Wrapper: Dark Code Background with Outfit Font */}
            <div
              className={`rounded-xl sm:rounded-2xl p-3 sm:p-3.5 mb-3 transition-colors ${
                isBurgundy ? 'bg-[#1e070e]' : 'bg-[#1c1917]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  <span>{t.promptLabel}</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {post.aspectRatio || '9:16'}
                </span>
              </div>
              <div
                dir="ltr"
                className="font-outfit text-xs sm:text-[13px] text-[#f5f5f4] text-left break-words leading-relaxed select-all max-h-[140px] overflow-y-auto no-scrollbar"
              >
                {post.prompt}
              </div>
            </div>
          </div>

          {/* Direct Copy Button */}
          <button
            id={`btn-copy-${post.id}`}
            type="button"
            onClick={handleCopyPrompt}
            className={`w-full py-2.5 sm:py-3 px-4 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md hover:opacity-95 active:scale-98 focus-visible:outline-hidden focus-visible:ring-2 ${
              copied
                ? 'bg-emerald-600 focus-visible:ring-emerald-400'
                : isBurgundy
                ? 'bg-[#f43f5e] focus-visible:ring-white'
                : 'bg-[#6b0f24] focus-visible:ring-[#1c1917]'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>{t.copied}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>{t.copyPrompt}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

export const PostCard = memo(PostCardComponent);
