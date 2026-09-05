import { AlertTriangle, Trash2, X } from 'lucide-react';
import { ThemeMode } from '../types';

interface CustomConfirmModalProps {
  isOpen: boolean;
  theme: ThemeMode;
  postTitle: string;
  postImage?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function CustomConfirmModal({
  isOpen,
  theme,
  postTitle,
  postImage,
  onConfirm,
  onCancel,
}: CustomConfirmModalProps) {
  if (!isOpen) return null;

  const isBurgundy = theme === 'burgundy';

  return (
    <div
      id="custom-confirm-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
      onClick={onCancel}
    >
      <div
        id="custom-confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className={`relative w-full max-w-md rounded-2xl p-4 sm:p-6 shadow-2xl transition-all border ${
          isBurgundy
            ? 'bg-[#350a18] border-[#6b162f] text-rose-50 shadow-rose-950/50'
            : 'bg-white border-slate-200 text-slate-900 shadow-slate-300/50'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="btn-close-confirm-modal"
          onClick={onCancel}
          className={`absolute top-4 left-4 p-1.5 rounded-lg transition-colors ${
            isBurgundy
              ? 'text-rose-300 hover:text-white hover:bg-[#4d0f23]'
              : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
          }`}
          aria-label="إغلاق النافذة"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon & Header */}
        <div className="flex items-center gap-4 mb-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              isBurgundy ? 'bg-rose-500/20 text-rose-400' : 'bg-red-50 text-red-600'
            }`}
          >
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 id="confirm-dialog-title" className="text-lg font-bold">
              تأكيد حذف العمل
            </h3>
            <p className={`text-xs ${isBurgundy ? 'text-rose-200/80' : 'text-slate-500'}`}>
              هذا الإجراء نهائي ولا يمكن التراجع عنه
            </p>
          </div>
        </div>

        {/* Post Preview Card */}
        <div
          className={`p-3 rounded-xl mb-5 flex items-center gap-3 border ${
            isBurgundy
              ? 'bg-[#270611] border-[#551025]'
              : 'bg-slate-50 border-slate-200'
          }`}
        >
          {postImage && (
            <img
              src={postImage}
              alt={postTitle}
              className="w-14 h-14 rounded-lg object-cover shrink-0 border border-black/10"
              referrerPolicy="no-referrer"
            />
          )}
          <div className="overflow-hidden">
            <span className={`text-xs block ${isBurgundy ? 'text-rose-300' : 'text-slate-400'}`}>
              المنشور المحدد:
            </span>
            <p className="font-semibold text-sm truncate">{postTitle}</p>
          </div>
        </div>

        {/* Question Text */}
        <p className={`text-sm mb-6 leading-relaxed ${isBurgundy ? 'text-rose-100/90' : 'text-slate-600'}`}>
          هل أنت متأكد من رغبتك في حذف هذا المنشور بكل ما يحتويه من صور البرومبت وطرق التصوير؟
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            id="btn-cancel-delete"
            type="button"
            onClick={onCancel}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
              isBurgundy
                ? 'bg-[#4a0d20] hover:bg-[#5e112a] text-rose-200'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            إلغاء الأمر
          </button>
          <button
            id="btn-confirm-delete"
            type="button"
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-900/30 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <Trash2 className="w-4 h-4" />
            نعم، احذف الآن
          </button>
        </div>
      </div>
    </div>
  );
}
