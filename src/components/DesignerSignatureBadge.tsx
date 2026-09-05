import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Sparkles, X, Layers } from 'lucide-react';
import { ThemeMode } from '../types';

interface DesignerSignatureBadgeProps {
  theme: ThemeMode;
  onOpenStartScreen: () => void;
  onOpenAiAssistant?: () => void;
}

export function DesignerSignatureBadge({
  theme,
  onOpenStartScreen,
  onOpenAiAssistant,
}: DesignerSignatureBadgeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isBurgundy = theme === 'burgundy';

  return (
    <div className="fixed bottom-4 left-4 z-40 select-none">
      <AnimatePresence>
        {isExpanded ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.2 }}
            className={`relative rounded-2xl border p-4 shadow-2xl backdrop-blur-md w-80 transition-colors ${
              isBurgundy
                ? 'bg-[#1e070e]/95 border-[#581827] text-[#fce7f3] shadow-rose-950/50'
                : 'bg-white/95 border-[#e7e5e4] text-[#1c1917] shadow-xl'
            }`}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center opacity-60 hover:opacity-100 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Badge Header */}
            <div className="flex items-center gap-2 mb-2.5">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  isBurgundy ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-100 text-[#6b0f24]'
                }`}
              >
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-black tracking-wider uppercase opacity-70">
                  Intelligent Assistant
                </div>
                <div className="text-sm font-black tracking-tight">بروتو | Proto AI (بورتو)</div>
              </div>
            </div>

            <p className="text-xs leading-relaxed opacity-85 mb-3.5">
              مرحباً بك! يمكنك التحدث الآن مع <strong className="font-bold text-rose-500">بروتو (Proto / بورتو)</strong> المساعد الذكي الخارق لمنصة FacePrompt للاستفسار عن قواميس إضاءات الاستوديو، العدسات والكاميرات، صياغة البرومبتات، وشرح مميزات الموقع بالتفصيل!
            </p>

            <div className="flex flex-col gap-2">
              {/* Main AI Assistant Button */}
              {onOpenAiAssistant && (
                <button
                  type="button"
                  onClick={() => {
                    setIsExpanded(false);
                    onOpenAiAssistant();
                  }}
                  className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all ${
                    isBurgundy
                      ? 'bg-gradient-to-r from-[#f43f5e] to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white active:scale-95'
                      : 'bg-gradient-to-r from-[#6b0f24] to-[#8b1430] hover:from-[#7f112b] hover:to-[#9f1637] text-white active:scale-95'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>تحدث مع بروتو (Proto AI)</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setIsExpanded(false);
                  onOpenStartScreen();
                }}
                className={`w-full py-1.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer border transition-all ${
                  isBurgundy
                    ? 'border-[#581827] hover:bg-rose-950/40 text-rose-200'
                    : 'border-[#e7e5e4] hover:bg-stone-100 text-stone-700'
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>شاشة البدء والترحيب</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => {
              if (onOpenAiAssistant) {
                onOpenAiAssistant();
              } else {
                setIsExpanded(true);
              }
            }}
            id="designer-floating-pill"
            title="مساعد بورتو الذكي | Porto AI Assistant"
            className={`group h-8 sm:h-9 px-2.5 sm:px-3 rounded-full border shadow-lg backdrop-blur-md flex items-center gap-2 cursor-pointer transition-all ${
              isBurgundy
                ? 'bg-[#1e070e]/90 border-[#581827] text-[#fda4af] hover:border-rose-400 hover:shadow-rose-950/60'
                : 'bg-white/90 border-[#e7e5e4] text-[#1c1917] hover:border-[#6b0f24] hover:shadow-md'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center shrink-0">
              <Bot className="w-2.5 h-2.5" />
            </div>

            <div className="flex items-center gap-1 text-[11px] font-bold">
              <span className="opacity-75 hidden xs:inline">المساعد الذكي:</span>
              <span
                className={`font-black tracking-tight ${
                  isBurgundy ? 'text-white' : 'text-[#6b0f24]'
                }`}
              >
                بروتو | Proto AI
              </span>
            </div>

            <Sparkles className="w-3 h-3 text-rose-500 opacity-80 group-hover:opacity-100 group-hover:scale-125 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
