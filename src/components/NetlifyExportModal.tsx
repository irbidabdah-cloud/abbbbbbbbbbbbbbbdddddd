import React from 'react';
import { Download, ExternalLink, X, CloudUpload, CheckCircle2, ShieldCheck, Sparkles, FolderArchive, ArrowRight } from 'lucide-react';
import { ThemeMode } from '../types';

interface NetlifyExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
}

export function NetlifyExportModal({ isOpen, onClose, theme }: NetlifyExportModalProps) {
  if (!isOpen) return null;
  const isBurgundy = theme === 'burgundy';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
          isBurgundy
            ? 'bg-[#18050c] border-[#4a121e] text-[#fce7f3]'
            : 'bg-[#fdfbf7] border-[#e7e5e4] text-[#1c1917]'
        }`}
        dir="rtl"
      >
        {/* Header */}
        <div
          className={`p-5 sm:p-6 border-b flex items-center justify-between ${
            isBurgundy ? 'border-[#330c16] bg-[#140309]' : 'border-[#e7e5e4] bg-[#f8f5f0]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-cyan-500 text-black flex items-center justify-center font-black shadow-md shrink-0">
              <CloudUpload className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                <span>نقل وحفظ موقع FacePrompt على Netlify</span>
              </h3>
              <p className="text-xs opacity-75 mt-0.5">
                دليل سريع للرفع المباشر في 3 خطوات بسيطة بدون أي برمجة أو أوامر
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full opacity-70 hover:opacity-100 hover:bg-rose-500/15 cursor-pointer transition-all"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm leading-relaxed">
          
          {/* Main Action Banner */}
          <div
            className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
              isBurgundy
                ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-100'
                : 'bg-cyan-50 border-cyan-200 text-cyan-950'
            }`}
          >
            <div>
              <div className="flex items-center gap-2 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-cyan-500 shrink-0" />
                <span>الملف المدمج الشامل جاهز للتحميل</span>
              </div>
              <p className="text-xs opacity-80 mt-1">
                ملف واحد فقط باسم <code>index.html</code> (بحجم 1.8 ميغابايت) يحتوي على كافة التصاميم، الصور، الخطوط، والذكاء الاصطناعي بروتو.
              </p>
            </div>

            <a
              href="/api/download-index-html"
              download="index.html"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>تحميل index.html الآن</span>
            </a>
          </div>

          {/* 3 Step Visual Guide */}
          <div className="space-y-3">
            <h4 className="font-black text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>خطوات الرفع على Netlify (تأخذ منك 30 ثانية):</span>
            </h4>

            {/* Step 1 */}
            <div
              className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                isBurgundy ? 'bg-[#1f0610] border-[#3f101d]' : 'bg-white border-stone-200'
              }`}
            >
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-500 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <div className="flex-1">
                <p className="font-bold">قم بتحميل الملف المدمج:</p>
                <p className="opacity-80 text-xs mt-0.5">
                  اضغط على زر التحميل الأزرق أعلاه لحفظ ملف <code>index.html</code> على جهازك (في مجلد التنزيلات Downloads).
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div
              className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                isBurgundy ? 'bg-[#1f0610] border-[#3f101d]' : 'bg-white border-stone-200'
              }`}
            >
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-500 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <div className="flex-1">
                <p className="font-bold">افتح صفحة الرفع السريع في Netlify:</p>
                <p className="opacity-80 text-xs mt-0.5 mb-2">
                  افتح موقع Netlify Drop المجاني المخصص لرفع المواقع بالسحب والإفلات.
                </p>
                <a
                  href="https://app.netlify.com/drop"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs"
                >
                  <span>فتح صفحة Netlify Drop</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Step 3 */}
            <div
              className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                isBurgundy ? 'bg-[#1f0610] border-[#3f101d]' : 'bg-white border-stone-200'
              }`}
            >
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-500 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <div className="flex-1">
                <p className="font-bold">اسحب الملف وأفلته (Drag & Drop):</p>
                <p className="opacity-80 text-xs mt-0.5">
                  اسحب ملف <code>index.html</code> وضعه داخل المربع المتقطع في صفحة Netlify Drop. خلال 5 ثوانٍ سيظهر لك رابط موقعك المباشر المجاني مدى الحياة!
                </p>
              </div>
            </div>
          </div>

          {/* Backup / Export ZIP Guide */}
          <div
            className={`p-4 rounded-2xl border ${
              isBurgundy ? 'bg-[#150409] border-[#380e18]' : 'bg-stone-50 border-stone-200'
            }`}
          >
            <h5 className="font-bold text-xs flex items-center gap-2 mb-1.5">
              <FolderArchive className="w-4 h-4 text-amber-500" />
              <span>كيف تحفظ نسخة كاملة من كل ملفات المشروع (ZIP / GitHub)؟</span>
            </h5>
            <p className="text-xs opacity-80 leading-relaxed">
              لحفظ كامل مجلدات المشروع والأكواد المصدرية من منصة <strong>Google AI Studio</strong>:
              <br />
              1. انظر لأعلى يمين الشاشة في شريط المنصة، ستجد قائمة الإعدادات (أيقونة الترس أو الثلاث نقاط <strong>Settings / Export</strong>).
              <br />
              2. اضغط على <strong>Export to ZIP</strong> لتحميل أرشيف مضغوط يحتوي كافة ملفات المشروع.
              <br />
              3. أو اضغط على <strong>Export to GitHub</strong> لحفظ المشروع مباشرة في حسابك على GitHub وتحديثه تلقائياً.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div
          className={`p-4 border-t flex items-center justify-between ${
            isBurgundy ? 'border-[#330c16] bg-[#140309]' : 'border-[#e7e5e4] bg-[#f8f5f0]'
          }`}
        >
          <span className="text-xs opacity-75 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>جاهز 100% بدون أي خادم خارجي</span>
          </span>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-700 hover:bg-stone-600 text-white text-xs font-bold cursor-pointer transition-all"
          >
            تم، شكراً لك
          </button>
        </div>
      </div>
    </div>
  );
}
