import React from 'react';
import { motion } from 'motion/react';
import { BrandLogo } from './BrandLogo';
import { ThemeMode } from '../types';

interface BrandLoaderProps {
  theme?: ThemeMode;
  message?: string;
  subMessage?: string;
  isFullScreen?: boolean;
}

export function BrandLoader({
  theme = 'white',
  message = 'جاري التحميل...',
  subMessage = 'استوديو هندسة برومبتات الوجه والذكاء الاصطناعي',
  isFullScreen = true,
}: BrandLoaderProps) {
  const isBurgundy = theme === 'burgundy';

  const content = (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center text-center p-6 select-none"
    >
      {/* Animated Logo Container with Multi-Layer Orbital Rings */}
      <div className="relative mb-6">
        {/* Outer Pulsing Glow */}
        <div
          className={`absolute -inset-4 rounded-full blur-xl opacity-30 animate-pulse ${
            isBurgundy ? 'bg-rose-500' : 'bg-rose-700'
          }`}
        />

        {/* Orbiting Ring */}
        <div className="absolute -inset-2.5 rounded-full border border-dashed border-rose-500/40 animate-spin" />

        {/* Custom Brand Logo */}
        <BrandLogo size="xl" theme={theme} isSpinning={false} />

        {/* Satellite Glowing Dot */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e] animate-ping" />
      </div>

      {/* Loading Titles */}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <h4 className="text-base sm:text-lg font-black tracking-tight mb-1.5 flex items-center justify-center gap-2">
          <span>{message}</span>
        </h4>
        {subMessage && (
          <p
            className={`text-xs max-w-xs leading-relaxed ${
              isBurgundy ? 'text-[#fce7f3]/70' : 'text-[#78716c]'
            }`}
          >
            {subMessage}
          </p>
        )}
      </motion.div>

      {/* Modern Indeterminate Progress Bar */}
      <div
        className={`w-48 sm:w-56 h-1.5 rounded-full mt-5 overflow-hidden border ${
          isBurgundy ? 'bg-[#240611] border-[#4a1222]' : 'bg-[#e7e5e4] border-[#d6d3d1]'
        }`}
      >
        <motion.div
          className={`h-full rounded-full ${
            isBurgundy
              ? 'bg-gradient-to-r from-rose-600 via-rose-400 to-amber-300'
              : 'bg-gradient-to-r from-[#6b0f24] via-rose-600 to-amber-500'
          }`}
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            repeat: Infinity,
            duration: 1.2,
            ease: 'easeInOut',
          }}
        />
      </div>
    </motion.div>
  );

  if (isFullScreen) {
    return (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md transition-colors ${
          isBurgundy ? 'bg-[#15040a]/90' : 'bg-[#faf8f5]/90'
        }`}
      >
        {content}
      </div>
    );
  }

  return content;
}
