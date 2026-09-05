import React from 'react';
import { ThemeMode } from '../types';

interface BrandLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  theme?: ThemeMode;
  showText?: boolean;
  isSpinning?: boolean;
  className?: string;
}

export function BrandLogo({
  size = 'md',
  theme = 'white',
  showText = false,
  isSpinning = false,
  className = '',
}: BrandLogoProps) {
  const isBurgundy = theme === 'burgundy';

  const sizeDimensions = {
    xs: { icon: 20, container: 'w-6 h-6' },
    sm: { icon: 24, container: 'w-8 h-8' },
    md: { icon: 32, container: 'w-10 h-10' },
    lg: { icon: 44, container: 'w-12 h-12 sm:w-14 sm:h-14' },
    xl: { icon: 64, container: 'w-18 h-18 sm:w-20 sm:h-20' },
  };

  const dim = sizeDimensions[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Logo Emblem */}
      <div
        className={`relative ${dim.container} rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 ${
          isBurgundy
            ? 'bg-gradient-to-br from-[#2a0614] to-[#15040a] border border-[#581827] shadow-[0_0_15px_rgba(244,63,94,0.2)]'
            : 'bg-gradient-to-br from-white to-[#f7f4ee] border border-[#e7e5e4] shadow-[0_2px_10px_rgba(107,15,36,0.08)]'
        }`}
      >
        {/* Ambient Ring Glow */}
        {isSpinning && (
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-rose-500 via-amber-400 to-rose-600 opacity-60 blur-xs animate-spin" />
        )}

        {/* Custom Hand-Crafted FacePrompt Vector SVG Logo */}
        <svg
          width={dim.icon}
          height={dim.icon}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`relative z-10 transition-transform duration-200 ${
            isSpinning ? 'animate-spin' : 'hover:scale-105'
          }`}
        >
          {/* 1. Geometric Outer Precision Frame (Aperture / Viewfinder corners) */}
          <path
            d="M8 16V10C8 8.89543 8.89543 8 10 8H16"
            stroke={isBurgundy ? '#f43f5e' : '#6b0f24'}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M32 8H38C39.1046 8 40 8.89543 40 10V16"
            stroke={isBurgundy ? '#f43f5e' : '#6b0f24'}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M40 32V38C40 39.1046 39.1046 40 38 40H32"
            stroke={isBurgundy ? '#f43f5e' : '#6b0f24'}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M16 40H10C8.89543 40 8 39.1046 8 38V32"
            stroke={isBurgundy ? '#f43f5e' : '#6b0f24'}
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* 2. Central Lens Iris / Facial Geometry Curves */}
          <circle
            cx="24"
            cy="24"
            r="11"
            stroke={isBurgundy ? '#fce7f3' : '#1c1917'}
            strokeWidth="2"
            strokeDasharray="4 2.5"
            opacity="0.8"
          />

          {/* 3. Dynamic Curved Aperture Blades */}
          <path
            d="M24 15C19.0294 15 15 19.0294 15 24C15 28.9706 19.0294 33 24 33C27.5 33 30.5 31 32 28C30 27 28 25 28 23C28 19 30 17 33 16C30.5 15.3 27 15 24 15Z"
            fill={isBurgundy ? '#f43f5e' : '#6b0f24'}
            opacity="0.9"
          />

          {/* 4. Golden AI Core Prompt Sparkle */}
          <path
            d="M24 19L25.3 22.7L29 24L25.3 25.3L24 29L22.7 25.3L19 24L22.7 22.7L24 19Z"
            fill="#f59e0b"
          />

          {/* 5. Precision Optical Focus Dot */}
          <circle cx="34" cy="14" r="2" fill="#38bdf8" />
        </svg>
      </div>

      {/* Optional Brand Typography */}
      {showText && (
        <div className="flex flex-col text-right">
          <div className="flex items-center gap-1.5">
            <span className="font-black tracking-tight text-base sm:text-xl">Face</span>
            <span
              className={`font-black tracking-tight text-base sm:text-xl ${
                isBurgundy ? 'text-[#f43f5e]' : 'text-[#6b0f24]'
              }`}
            >
              Prompt
            </span>
            <span
              className={`text-[9px] sm:text-[10px] font-extrabold px-1.5 py-0.5 rounded-full border ${
                isBurgundy
                  ? 'bg-[#240611] border-[#581827] text-[#fda4af]'
                  : 'bg-[#f1ede4] border-[#e7e5e4] text-[#6b0f24]'
              }`}
            >
              AI PRO
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
