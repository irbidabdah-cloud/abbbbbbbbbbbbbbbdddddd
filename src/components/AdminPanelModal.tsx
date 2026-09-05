import { Plus, Sliders, Trash2, Edit3, X, Shield, ArrowRight, Download } from 'lucide-react';
import { Post, ThemeMode } from '../types';

interface AdminPanelModalProps {
  isOpen: boolean;
  theme: ThemeMode;
  posts: Post[];
  manageMode: boolean;
  onToggleManageMode: () => void;
  onOpenCreate: () => void;
  onEditPost: (post: Post) => void;
  onDeletePost: (post: Post) => void;
  onClose: () => void;
}

export function AdminPanelModal({
  isOpen,
  theme,
  posts,
  manageMode,
  onToggleManageMode,
  onOpenCreate,
  onEditPost,
  onDeletePost,
  onClose,
}: AdminPanelModalProps) {
  if (!isOpen) return null;

  const isBurgundy = theme === 'burgundy';

  const handleReturnToGalleryWithEdit = () => {
    if (!manageMode) {
      onToggleManageMode();
    }
    onClose();
  };

  return (
    <div
      id="admin-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        id="admin-modal-content"
        className={`relative w-full max-w-xl max-h-[92vh] flex flex-col rounded-3xl p-4 sm:p-7 shadow-2xl transition-all border ${
          isBurgundy
            ? 'bg-[#3b101c] border-[#581827] text-[#fce7f3] shadow-rose-950/60'
            : 'bg-white border-[#e7e5e4] text-[#1c1917] shadow-xl'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-inherit mb-5">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                isBurgundy ? 'bg-rose-500/20 text-[#f43f5e]' : 'bg-[#6b0f24]/10 text-[#6b0f24]'
              }`}
            >
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold flex items-center gap-1.5">
                لوحة الإدارة الشاملة
              </h3>
              <p className={`text-xs ${isBurgundy ? 'text-[#fda4af]' : 'text-[#78716c]'}`}>
                مخصصة لحسابات الإدارة المصرحة فقط
              </p>
            </div>
          </div>

          <button
            id="btn-close-admin-modal"
            type="button"
            onClick={onClose}
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-transform hover:scale-105 cursor-pointer ${
              isBurgundy
                ? 'border-[#581827] bg-[#1e070e] text-[#fce7f3] hover:text-[#f43f5e]'
                : 'border-[#e7e5e4] bg-[#f1ede4] text-[#1c1917] hover:text-[#6b0f24]'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 mb-5">
          {/* Add New Session Button */}
          <button
            id="btn-admin-add-session"
            type="button"
            onClick={() => {
              onClose();
              onOpenCreate();
            }}
            className={`flex-1 py-3.5 px-4 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 cursor-pointer transition-all hover:opacity-90 active:scale-98 shadow-md ${
              isBurgundy ? 'bg-[#f43f5e]' : 'bg-[#6b0f24]'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>+ إضافة جلسة جديدة ✨</span>
          </button>

          {/* Return to Gallery with Edit Mode Enabled (الزر المطلوب بالنص: يرجع لصفحة الموقع مع إمكانية التعديل والحذف بجانب كل منشور) */}
          <button
            id="btn-admin-return-edit-mode"
            type="button"
            onClick={handleReturnToGalleryWithEdit}
            className={`flex-1 py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 border ${
              manageMode
                ? isBurgundy
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : isBurgundy
                ? 'bg-[#1e070e] border-[#581827] text-[#fce7f3] hover:border-[#f43f5e]'
                : 'bg-[#f1ede4] border-[#e7e5e4] text-[#1c1917] hover:border-[#6b0f24]'
            }`}
          >
            <ArrowRight className="w-4 h-4" />
            <span>
              {manageMode
                ? 'الرجوع للمعرض (وضع التعديل مفعل)'
                : 'تفعيل وضع التعديل بالمعرض'}
            </span>
          </button>
        </div>

        {/* Netlify Export Card */}
        <div
          className={`p-3.5 rounded-2xl border mb-5 flex flex-col sm:flex-row items-center justify-between gap-3 ${
            isBurgundy
              ? 'bg-cyan-950/25 border-cyan-500/30 text-cyan-100'
              : 'bg-cyan-50/70 border-cyan-200 text-cyan-950'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold flex items-center gap-1.5">
                <span>تصدير ملف index.html المدمج لـ Netlify</span>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-cyan-500/20 text-cyan-500 border border-cyan-500/30">
                  جاهز للرفع
                </span>
              </h4>
              <p className="text-[11px] opacity-75 mt-0.5 leading-relaxed">
                تم دمج كافة الأكواد، التصاميم، والقوالب والذكاء في ملف واحد باسم index.html جاهز للرفع المباشر.
              </p>
            </div>
          </div>

          <a
            href="/api/download-index-html"
            download="index.html"
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>تحميل index.html</span>
          </a>
        </div>

        {/* List of Sessions */}
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold flex items-center gap-2">
            <span>جلسات التصوير المنشورة</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                isBurgundy ? 'bg-[#1e070e] text-[#fda4af]' : 'bg-[#f1ede4] text-[#78716c]'
              }`}
            >
              {posts.length}
            </span>
          </h4>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 pl-1">
          {posts.map((post) => (
            <div
              key={post.id}
              className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition-colors ${
                isBurgundy
                  ? 'bg-[#1e070e] border-[#581827] hover:border-[#6b162f]'
                  : 'bg-[#f1ede4] border-[#e7e5e4] hover:border-slate-300'
              }`}
            >
              {/* Thumbnail & Info */}
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={post.resultImage || post.setupImage}
                  alt={post.title}
                  className="w-12 h-16 rounded-xl object-cover shrink-0 border border-black/10"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <h5 className="font-bold text-sm truncate">{post.title}</h5>
                  <p
                    className={`text-xs truncate max-w-[220px] ${
                      isBurgundy ? 'text-[#fda4af]' : 'text-[#78716c]'
                    }`}
                  >
                    {post.description}
                  </p>
                  <span
                    className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                      isBurgundy
                        ? 'bg-rose-950/80 text-rose-300'
                        : 'bg-white text-[#6b0f24] border border-[#e7e5e4]'
                    }`}
                  >
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Edit & Delete */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  title="تعديل هذا المنشور"
                  onClick={() => {
                    onClose();
                    onEditPost(post);
                  }}
                  className={`p-2.5 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                    isBurgundy
                      ? 'bg-[#3b101c] border-[#581827] text-blue-400 hover:bg-blue-950/40'
                      : 'bg-white border-[#e7e5e4] text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  title="حذف هذا المنشور"
                  onClick={() => {
                    onClose();
                    onDeletePost(post);
                  }}
                  className={`p-2.5 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                    isBurgundy
                      ? 'bg-[#3b101c] border-[#581827] text-red-400 hover:bg-red-950/40'
                      : 'bg-white border-[#e7e5e4] text-red-600 hover:bg-red-50'
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
