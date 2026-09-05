import { Camera, Sparkles, X, ZoomIn } from 'lucide-react';
import { ThemeMode } from '../types';

interface ImageLightboxModalProps {
  isOpen: boolean;
  theme: ThemeMode;
  imageUrl: string;
  title: string;
  type: 'setup' | 'result';
  subtitle?: string;
  onClose: () => void;
}

export function ImageLightboxModal({
  isOpen,
  theme,
  imageUrl,
  title,
  type,
  subtitle,
  onClose,
}: ImageLightboxModalProps) {
  if (!isOpen) return null;

  const isBurgundy = theme === 'burgundy';

  return (
    <div
      id="image-lightbox-backdrop"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-2.5 sm:p-4 md:p-6 bg-black/85 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        id="image-lightbox-container"
        className={`relative max-w-5xl w-full max-h-[92vh] flex flex-col rounded-2xl overflow-hidden border shadow-2xl ${
          isBurgundy
            ? 'bg-[#2a0713] border-[#6b162f] text-rose-50'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div
          className={`flex items-center justify-between px-3.5 sm:px-6 py-2.5 sm:py-4 border-b gap-2 ${
            isBurgundy ? 'border-[#551025] bg-[#340918]' : 'border-slate-100 bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span
              className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold shrink-0 ${
                type === 'setup'
                  ? isBurgundy
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-amber-100 text-amber-800'
                  : isBurgundy
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {type === 'setup' ? (
                <>
                  <Camera className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">طريقة التصوير</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">النتيجة بالبرومبت</span>
                </>
              )}
            </span>
            <h3 className="text-sm sm:text-base font-bold truncate">{title}</h3>
          </div>

          <button
            id="btn-close-lightbox"
            onClick={onClose}
            className={`p-1.5 sm:p-2 rounded-xl transition-colors shrink-0 ${
              isBurgundy
                ? 'text-rose-300 hover:text-white hover:bg-[#4a0d20]'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
            }`}
            aria-label="إغلاق معاينة الصورة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image Display */}
        <div className="relative flex-1 flex items-center justify-center p-2 sm:p-4 bg-black/40 overflow-hidden min-h-[240px] max-h-[75vh]">
          <img
            src={imageUrl}
            alt={title}
            className="max-h-[70vh] max-w-full object-contain rounded-lg shadow-lg"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Footer Subtitle */}
        {subtitle && (
          <div
            className={`px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm border-t ${
              isBurgundy
                ? 'border-[#551025] bg-[#340918] text-rose-200'
                : 'border-slate-100 bg-slate-50 text-slate-600'
            }`}
          >
            <span className="font-semibold text-amber-500 ml-2">ملاحظة فوتوغرافية:</span>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}
