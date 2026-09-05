import { useState, type FormEvent } from 'react';
import { LogIn, LogOut, ShieldCheck, User, X, Loader2 } from 'lucide-react';
import { ThemeMode, checkIsAuthorized } from '../types';
import { loginWithGooglePopup } from '../lib/firebase';

interface GoogleLoginModalProps {
  isOpen: boolean;
  theme: ThemeMode;
  currentEmail: string | null;
  onLogin: (email: string) => void;
  onLogout: () => void;
  onClose: () => void;
}

export function GoogleLoginModal({
  isOpen,
  theme,
  currentEmail,
  onLogin,
  onLogout,
  onClose,
}: GoogleLoginModalProps) {
  const [emailInput, setEmailInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  if (!isOpen) return null;

  const isBurgundy = theme === 'burgundy';
  const isLoggedIn = Boolean(currentEmail && currentEmail.trim());
  const isAuthorized = isLoggedIn ? checkIsAuthorized(currentEmail) : false;

  const handleGooglePopup = async () => {
    setIsSigningIn(true);
    setErrorMsg('');
    try {
      const user = await loginWithGooglePopup();
      if (user.email) {
        onLogin(user.email);
        onClose();
      }
    } catch (err: any) {
      console.warn('Google popup error:', err);
      if (err?.code === 'auth/popup-blocked') {
        setErrorMsg('تم حظر النافذة المنبثقة بواسطة المتصفح، يمكنك إدخال بريدك أدناه للمتابعة.');
      } else if (err?.code !== 'auth/popup-closed-by-user') {
        setErrorMsg('تعذر تسجيل الدخول عبر النافذة المنبثقة، يمكنك إدخال بريدك يدوياً بالأسفل.');
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim();
    if (!cleanEmail) {
      setErrorMsg('يرجى إدخال البريد الإلكتروني');
      return;
    }
    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMsg('يرجى إدخال بريد إلكتروني صالح');
      return;
    }

    setErrorMsg('');
    onLogin(cleanEmail);
    setEmailInput('');
    onClose();
  };

  return (
    <div
      id="google-login-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div
        id="google-login-modal"
        role="dialog"
        aria-modal="true"
        className={`relative w-full max-w-md rounded-3xl p-4 sm:p-7 shadow-2xl transition-all border ${
          isBurgundy
            ? 'bg-[#3b101c] border-[#581827] text-[#fce7f3] shadow-rose-950/60'
            : 'bg-white border-[#e7e5e4] text-[#1c1917] shadow-xl'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-inherit mb-5">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center border shadow-xs ${
                isBurgundy
                  ? 'bg-[#1e070e] border-[#581827] text-[#f43f5e]'
                  : 'bg-[#f1ede4] border-[#e7e5e4] text-[#6b0f24]'
              }`}
            >
              <i className="fa-brands fa-google text-lg"></i>
            </div>
            <div>
              <h3 className="font-extrabold text-lg">
                {isLoggedIn ? 'حسابك الحالي' : 'تسجيل الدخول عبر Google'}
              </h3>
              <p className={`text-xs ${isBurgundy ? 'text-[#fda4af]' : 'text-[#78716c]'}`}>
                {isLoggedIn
                  ? 'إدارة جلسة الدخول الحالية'
                  : 'أدخل بريدك الإلكتروني للمتابعة'}
              </p>
            </div>
          </div>

          <button
            id="btn-close-login-modal"
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

        {/* If Already Logged In */}
        {isLoggedIn ? (
          <div className="space-y-4">
            <div
              className={`p-4 rounded-2xl border text-center ${
                isBurgundy
                  ? 'bg-[#1e070e] border-[#581827]'
                  : 'bg-[#f1ede4] border-[#e7e5e4]'
              }`}
            >
              <div className="w-16 h-16 mx-auto rounded-full overflow-hidden border-2 border-[#6b0f24] mb-3 shadow-sm">
                <img
                  src={`https://api.dicebear.com/7.x/bottts/svg?seed=${currentEmail}`}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="font-mono text-sm font-bold mb-1 break-all">
                {currentEmail}
              </div>

              {isAuthorized ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>حساب إدارة مصرح (مدير المنصة)</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold opacity-75">
                  <User className="w-3.5 h-3.5" />
                  <span>مستخدم زائر عادي</span>
                </div>
              )}
            </div>

            {/* Switch / Logout actions */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  onLogout();
                }}
                className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all border ${
                  isBurgundy
                    ? 'bg-rose-950/40 border-rose-500/40 text-rose-300 hover:bg-rose-950/70'
                    : 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
                }`}
              >
                <LogOut className="w-4 h-4" />
                <span>تسجيل الخروج (العودة كزائر غير مسجل)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onLogout();
                  setEmailInput('');
                }}
                className={`w-full py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all border ${
                  isBurgundy
                    ? 'bg-[#1e070e] border-[#581827] text-[#fce7f3] hover:border-[#f43f5e]'
                    : 'bg-[#f1ede4] border-[#e7e5e4] text-[#1c1917] hover:border-[#6b0f24]'
                }`}
              >
                <span>تسجيل الدخول بحساب Google آخر</span>
              </button>
            </div>
          </div>
        ) : (
          /* Login Options (Direct Google Auth Popup + Manual Email Fallback) */
          <div className="space-y-4">
            {/* Primary Google Auth Popup Button */}
            <button
              id="btn-google-auth-popup"
              type="button"
              onClick={handleGooglePopup}
              disabled={isSigningIn}
              className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 cursor-pointer transition-all active:scale-98 shadow-sm border ${
                isBurgundy
                  ? 'bg-white text-slate-900 hover:bg-slate-100 border-white/20'
                  : 'bg-white text-slate-800 hover:bg-slate-50 border-slate-300'
              }`}
            >
              {isSigningIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
                  <span>جاري تسجيل الدخول عبر Google...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>تسجيل الدخول السريع بحساب Google</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-2 opacity-60">
              <div className="flex-1 h-px bg-current"></div>
              <span className="text-[11px] font-medium">أو إدخال البريد الإلكتروني</span>
              <div className="flex-1 h-px bg-current"></div>
            </div>

            {/* Manual Email Input Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="google-email-input"
                  className={`block text-xs font-bold mb-2 ${
                    isBurgundy ? 'text-[#fda4af]' : 'text-[#78716c]'
                  }`}
                >
                  البريد الإلكتروني:
                </label>
                <div className="relative">
                  <input
                    id="google-email-input"
                    type="email"
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="name@gmail.com"
                    required
                    className={`w-full px-4 py-3 rounded-2xl border text-sm focus:outline-hidden transition-all text-left font-mono ${
                      isBurgundy
                        ? 'bg-[#1e070e] border-[#581827] text-[#fce7f3] focus:border-[#f43f5e]'
                        : 'bg-[#f1ede4] border-[#e7e5e4] text-[#1c1917] focus:border-[#6b0f24]'
                    }`}
                    dir="ltr"
                  />
                </div>
                {errorMsg && (
                  <p className="text-red-500 text-xs font-semibold mt-1.5">{errorMsg}</p>
                )}
              </div>

              <button
                id="btn-submit-google-login"
                type="submit"
                className={`w-full py-3 px-4 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 cursor-pointer transition-all hover:opacity-95 active:scale-98 shadow-md ${
                  isBurgundy ? 'bg-[#f43f5e]' : 'bg-[#6b0f24]'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>متابعة وتسجيل الدخول</span>
              </button>

              <p
                className={`text-[11px] text-center leading-relaxed ${
                  isBurgundy ? 'text-[#fda4af]/70' : 'text-[#78716c]'
                }`}
              >
                تسجيل الدخول الآمن للمنصة وحفظ التفضيلات.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
