import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { Camera, Image as ImageIcon, Sparkles, Upload, X, Check, Loader2 } from 'lucide-react';
import { Post, ThemeMode } from '../types';
import { uploadImageToStorage } from '../lib/firebase';

interface EditPostModalProps {
  isOpen: boolean;
  theme: ThemeMode;
  post: Post | null;
  onSave: (updatedPost: Post) => void;
  onClose: () => void;
}

export function EditPostModal({
  isOpen,
  theme,
  post,
  onSave,
  onClose,
}: EditPostModalProps) {
  const [formData, setFormData] = useState<Post | null>(null);
  const [setupPreview, setSetupPreview] = useState<string>('');
  const [resultPreview, setResultPreview] = useState<string>('');
  const [isUploadingSetup, setIsUploadingSetup] = useState(false);
  const [isUploadingResult, setIsUploadingResult] = useState(false);

  useEffect(() => {
    if (post) {
      setFormData({ ...post });
      setSetupPreview(post.setupImage);
      setResultPreview(post.resultImage);
    }
  }, [post]);

  if (!isOpen || !formData) return null;

  const isBurgundy = theme === 'burgundy';

  const handleFileUpload = async (
    e: ChangeEvent<HTMLInputElement>,
    type: 'setup' | 'result'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'setup') {
      setIsUploadingSetup(true);
    } else {
      setIsUploadingResult(true);
    }

    try {
      const url = await uploadImageToStorage(file, 'sessions');
      if (type === 'setup') {
        setSetupPreview(url);
        setFormData((prev) => (prev ? { ...prev, setupImage: url } : null));
      } else {
        setResultPreview(url);
        setFormData((prev) => (prev ? { ...prev, resultImage: url } : null));
      }
    } catch (err) {
      console.warn('Firebase edit upload warning:', err);
    } finally {
      if (type === 'setup') {
        setIsUploadingSetup(false);
      } else {
        setIsUploadingResult(false);
      }
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <div
      id="edit-post-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/75 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="edit-post-modal"
        role="dialog"
        aria-modal="true"
        className={`relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl border shadow-2xl transition-all my-auto ${
          isBurgundy
            ? 'bg-[#2d0815] border-[#6b162f] text-rose-50 shadow-rose-950/60'
            : 'bg-white border-slate-200 text-slate-900 shadow-slate-300/60'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b shrink-0 ${
            isBurgundy ? 'border-[#551025] bg-[#380b1b]' : 'border-slate-100 bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isBurgundy ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-700'
              }`}
            >
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">تعديل محتوى المنشور بالكامل</h2>
              <p className={`text-xs ${isBurgundy ? 'text-rose-300/80' : 'text-slate-500'}`}>
                تعديل طريقة التصوير، الصورة الناتجة، والبرومبت وجميع البيانات
              </p>
            </div>
          </div>

          <button
            id="btn-close-edit-modal"
            type="button"
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${
              isBurgundy
                ? 'text-rose-300 hover:text-white hover:bg-[#4d0f23]'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
            aria-label="إغلاق نافذة التعديل"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-bold mb-2">
              عنوان الصورة والعمل <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-hidden transition-all ${
                isBurgundy
                  ? 'bg-[#1e050e] border-[#551025] text-rose-100 focus:border-rose-400'
                  : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500'
              }`}
              placeholder="مثال: لقطة استوديو سينمائية مع إضاءة حافة..."
            />
          </div>

          {/* Images Section: Setup Image vs Result Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Setup Image (طريقة التصوير) */}
            <div
              className={`p-4 rounded-xl border ${
                isBurgundy ? 'bg-[#220610] border-[#501023]' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <Camera className="w-4 h-4 text-amber-500" />
                <label className="text-sm font-bold">صورة طريقة التصوير (الكواليس / الزاوية)</label>
              </div>

              {/* Preview Box */}
              <div className="relative aspect-video rounded-lg overflow-hidden mb-3 bg-black/20 border border-black/10 flex items-center justify-center">
                {setupPreview ? (
                  <img
                    src={setupPreview}
                    alt="طريقة التصوير"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="text-xs text-slate-400 flex flex-col items-center gap-1">
                    <ImageIcon className="w-8 h-8 opacity-40" />
                    لا توجد صورة محددة
                  </div>
                )}
              </div>

              {/* Image URL input */}
              <input
                type="url"
                value={formData.setupImage}
                onChange={(e) => {
                  setFormData({ ...formData, setupImage: e.target.value });
                  setSetupPreview(e.target.value);
                }}
                placeholder="رابط صورة طريقة التصوير (URL)"
                className={`w-full px-3 py-2 rounded-lg text-xs border mb-2 focus:outline-hidden ${
                  isBurgundy
                    ? 'bg-[#18040b] border-[#440d1e] text-rose-100'
                    : 'bg-white border-slate-200 text-slate-800'
                }`}
              />

              {/* File upload button */}
              <label
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer border border-dashed transition-colors ${
                  isBurgundy
                    ? 'border-rose-500/40 hover:bg-rose-950/40 text-rose-300'
                    : 'border-slate-300 hover:bg-slate-100 text-slate-600'
                }`}
              >
                {isUploadingSetup ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>جاري الرفع سحابياً...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>أو ارفع صورة من جهازك سحابياً</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  disabled={isUploadingSetup}
                  onChange={(e) => handleFileUpload(e, 'setup')}
                  className="hidden"
                />
              </label>

              {/* Setup Title / Description */}
              <div className="mt-3">
                <label className="block text-xs font-semibold mb-1 opacity-80">
                  شرح موجز لطريقة التصوير والزاوية:
                </label>
                <input
                  type="text"
                  value={formData.setupTitle || ''}
                  onChange={(e) => setFormData({ ...formData, setupTitle: e.target.value })}
                  placeholder="مثال: كاميرا مثبتة بزاوية 45 درجة مع عاكس أمامي"
                  className={`w-full px-3 py-2 rounded-lg text-xs border focus:outline-hidden ${
                    isBurgundy
                      ? 'bg-[#18040b] border-[#440d1e] text-rose-100'
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}
                />
              </div>
            </div>

            {/* 2. Result Image (الصورة الناتجة) */}
            <div
              className={`p-4 rounded-xl border ${
                isBurgundy ? 'bg-[#220610] border-[#501023]' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-rose-500" />
                <label className="text-sm font-bold">الصورة الناتجة (بعد تطبيق البرومبت)</label>
              </div>

              {/* Preview Box */}
              <div className="relative aspect-video rounded-lg overflow-hidden mb-3 bg-black/20 border border-black/10 flex items-center justify-center">
                {resultPreview ? (
                  <img
                    src={resultPreview}
                    alt="الصورة الناتجة"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="text-xs text-slate-400 flex flex-col items-center gap-1">
                    <ImageIcon className="w-8 h-8 opacity-40" />
                    لا توجد صورة محددة
                  </div>
                )}
              </div>

              {/* Image URL input */}
              <input
                type="url"
                value={formData.resultImage}
                onChange={(e) => {
                  setFormData({ ...formData, resultImage: e.target.value });
                  setResultPreview(e.target.value);
                }}
                placeholder="رابط الصورة الناتجة (URL)"
                className={`w-full px-3 py-2 rounded-lg text-xs border mb-2 focus:outline-hidden ${
                  isBurgundy
                    ? 'bg-[#18040b] border-[#440d1e] text-rose-100'
                    : 'bg-white border-slate-200 text-slate-800'
                }`}
              />

              {/* File upload button */}
              <label
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer border border-dashed transition-colors ${
                  isBurgundy
                    ? 'border-rose-500/40 hover:bg-rose-950/40 text-rose-300'
                    : 'border-slate-300 hover:bg-slate-100 text-slate-600'
                }`}
              >
                {isUploadingResult ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>جاري الرفع سحابياً...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>أو ارفع صورة من جهازك سحابياً</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  disabled={isUploadingResult}
                  onChange={(e) => handleFileUpload(e, 'result')}
                  className="hidden"
                />
              </label>

              {/* Category */}
              <div className="mt-3">
                <label className="block text-xs font-semibold mb-1.5 opacity-80">
                  تصنيف العمل:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {['بورتريه', 'سينمائي', 'منتجات', 'طبيعة', 'فنون وتجريد'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat })}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                        formData.category === cat
                          ? isBurgundy
                            ? 'bg-[#f43f5e] border-[#f43f5e] text-white shadow-xs'
                            : 'bg-[#6b0f24] border-[#6b0f24] text-white shadow-xs'
                          : isBurgundy
                          ? 'bg-[#18040b] border-[#440d1e] text-rose-200/70 hover:text-white'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400'
                      }`}
                    >
                      {cat === 'منتجات' ? 'تصوير منتجات' : cat === 'طبيعة' ? 'طبيعة ومناظر' : cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold mb-2">
              وصف الصورة وطريقة الإعداد بالتفصيل <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-hidden transition-all ${
                isBurgundy
                  ? 'bg-[#1e050e] border-[#551025] text-rose-100 focus:border-rose-400'
                  : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500'
              }`}
              placeholder="اكتب تفاصيل الإعداد، خلفية العمل، أو النصائح الفوتوغرافية المهمة..."
            />
          </div>

          {/* Prompt Section */}
          <div>
            <label className="block text-sm font-bold mb-2">
              البرومبت (نص التوليد / Prompt) <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              dir="ltr"
              value={formData.prompt}
              onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-xl font-mono text-sm border focus:outline-hidden transition-all ${
                isBurgundy
                  ? 'bg-[#18040b] border-[#551025] text-amber-200 focus:border-amber-400'
                  : 'bg-slate-900 border-slate-800 text-amber-300 focus:border-amber-500'
              }`}
              placeholder="e.g. Cinematic portrait, 85mm lens, rim lighting, 8k..."
            />
          </div>

          {/* Photography Parameters: Lens, Lighting, Angle, Aspect Ratio */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1 opacity-80">العدسة (Lens)</label>
              <input
                type="text"
                value={formData.lens || ''}
                onChange={(e) => setFormData({ ...formData, lens: e.target.value })}
                placeholder="85mm f/1.4"
                className={`w-full px-3 py-2 rounded-lg text-xs border focus:outline-hidden ${
                  isBurgundy
                    ? 'bg-[#1e050e] border-[#551025] text-rose-100'
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 opacity-80">الإضاءة (Lighting)</label>
              <input
                type="text"
                value={formData.lighting || ''}
                onChange={(e) => setFormData({ ...formData, lighting: e.target.value })}
                placeholder="Rim Light + Softbox"
                className={`w-full px-3 py-2 rounded-lg text-xs border focus:outline-hidden ${
                  isBurgundy
                    ? 'bg-[#1e050e] border-[#551025] text-rose-100'
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 opacity-80">زاوية الكاميرا (Angle)</label>
              <input
                type="text"
                value={formData.cameraAngle || ''}
                onChange={(e) => setFormData({ ...formData, cameraAngle: e.target.value })}
                placeholder="Eye-Level / Low"
                className={`w-full px-3 py-2 rounded-lg text-xs border focus:outline-hidden ${
                  isBurgundy
                    ? 'bg-[#1e050e] border-[#551025] text-rose-100'
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 opacity-80">أبعاد الصورة (Ratio)</label>
              <input
                type="text"
                value={formData.aspectRatio || ''}
                onChange={(e) => setFormData({ ...formData, aspectRatio: e.target.value })}
                placeholder="16:9 / 4:5"
                className={`w-full px-3 py-2 rounded-lg text-xs border focus:outline-hidden ${
                  isBurgundy
                    ? 'bg-[#1e050e] border-[#551025] text-rose-100'
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div
            className={`flex items-center justify-end gap-3 pt-4 border-t ${
              isBurgundy ? 'border-[#551025]' : 'border-slate-200'
            }`}
          >
            <button
              id="btn-cancel-edit"
              type="button"
              onClick={onClose}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                isBurgundy
                  ? 'bg-[#430c1c] hover:bg-[#550f24] text-rose-200'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              إلغاء
            </button>
            <button
              id="btn-save-edit"
              type="submit"
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-900/30 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <Check className="w-4 h-4" />
              حفظ وتحديث المنشور
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
