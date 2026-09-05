import { useState, useEffect } from 'react';
import { User, X, Check, ShieldCheck, LogOut, RefreshCw } from 'lucide-react';
import { ThemeMode, checkIsAuthorized } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  theme: ThemeMode;
  userEmail: string;
  userName: string;
  userAvatar: string;
  onUpdateName: (newName: string) => void;
  onSwitchAccount: () => void;
  onLogout: () => void;
  onClose: () => void;
}

export function ProfileModal({
  isOpen,
  theme,
  userEmail,
  userName,
  userAvatar,
  onUpdateName,
  onSwitchAccount,
  onLogout,
  onClose,
}: ProfileModalProps) {
  const [nameInput, setNameInput] = useState(userName);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setNameInput(userName);
  }, [userName, isOpen]);

  if (!isOpen) return null;

  const isBurgundy = theme === 'burgundy';
  const isAuthorized = checkIsAuthorized(userEmail);

  const handleSaveName = () => {
    if (!nameInput.trim()) return;
    onUpdateName(nameInput.trim());
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div
      id="profile-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        id="profile-modal-content"
        className={`relative w-full max-w-md rounded-3xl p-4 sm:p-7 shadow-2xl transition-all border ${
          isBurgundy
            ? 'bg-[#3b101c] border-[#581827] text-[#fce7f3] shadow-rose-950/60'
            : 'bg-white border-[#e7e5e4] text-[#1c1917] shadow-xl'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title row */}
        <div className="flex items-center justify-between pb-4 border-b border-inherit mb-5">
          <h3 className="text-xl font-extrabold flex items-center gap-2">
            <span>الملف الشخصي</span>
            <span className="text-lg">👤</span>
          </h3>
          <button
            id="btn-close-profile-modal"
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

        {/* Avatar Display */}
        <div className="text-center mb-5 flex flex-col items-center">
          <div className="relative">
            <img
              src={userAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${userEmail}`}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border-2 border-[#6b0f24] shadow-md"
              referrerPolicy="no-referrer"
            />
            {isAuthorized && (
              <span
                title="حساب إدارة مصرح"
                className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1 rounded-full shadow-xs"
              >
                <ShieldCheck className="w-4 h-4" />
              </span>
            )}
          </div>

          <div className="mt-2.5">
            <span
              className={`inline-block text-xs font-mono px-3 py-1 rounded-full border ${
                isAuthorized
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 font-bold'
                  : isBurgundy
                  ? 'bg-[#1e070e] border-[#581827] text-[#fda4af]'
                  : 'bg-[#f1ede4] border-[#e7e5e4] text-[#78716c]'
              }`}
            >
              {userEmail}
            </span>
          </div>
        </div>

        {/* Display Name Input */}
        <div className="space-y-2 mb-5">
          <label className={`block text-xs font-bold ${isBurgundy ? 'text-[#fda4af]' : 'text-[#78716c]'}`}>
            الاسم المعروض (يمكنك تغييره):
          </label>
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="اسمك هنا"
            className={`w-full px-4 py-3 rounded-2xl border text-sm focus:outline-hidden transition-all ${
              isBurgundy
                ? 'bg-[#1e070e] border-[#581827] text-[#fce7f3] focus:border-[#f43f5e]'
                : 'bg-[#f1ede4] border-[#e7e5e4] text-[#1c1917] focus:border-[#6b0f24]'
            }`}
          />
        </div>

        {/* Save Name Button */}
        <button
          type="button"
          onClick={handleSaveName}
          className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 cursor-pointer transition-all hover:opacity-90 active:scale-98 shadow-md mb-2.5 ${
            isBurgundy ? 'bg-[#f43f5e]' : 'bg-[#6b0f24]'
          }`}
        >
          {isSaved ? (
            <>
              <Check className="w-4 h-4" />
              <span>تم حفظ الاسم بنجاح!</span>
            </>
          ) : (
            <span>حفظ الاسم</span>
          )}
        </button>

        {/* Switch Account */}
        <button
          type="button"
          onClick={() => {
            onClose();
            onSwitchAccount();
          }}
          className={`w-full py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all border mb-2.5 ${
            isBurgundy
              ? 'bg-[#1e070e] border-[#581827] text-[#fce7f3] hover:border-[#f43f5e]'
              : 'bg-[#f1ede4] border-[#e7e5e4] text-[#1c1917] hover:border-[#6b0f24]'
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>تسجيل الدخول بحساب Google آخر</span>
        </button>

        {/* Logout Button */}
        <button
          type="button"
          onClick={() => {
            onLogout();
            onClose();
          }}
          className={`w-full py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all opacity-80 hover:opacity-100 ${
            isBurgundy
              ? 'bg-[#1e070e] text-rose-300 hover:bg-rose-950/50'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );
}
