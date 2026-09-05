import React, { useState, useRef, useEffect } from 'react';
import {
  User,
  Shield,
  ShieldCheck,
  Edit3,
  Check,
  CheckCircle2,
  Copy,
  Dice5,
  Globe,
  Home,
  LogOut,
  RefreshCw,
  Sparkles,
  Upload,
  X,
  AlertCircle,
  Mail,
  MapPin,
  Link2,
  Briefcase,
  Calendar,
  Lock,
  ArrowRight,
  ArrowLeft,
  Settings,
  Sliders,
  Moon,
  Sun,
  Palette,
  ExternalLink,
  Smartphone,
  Crown,
  Share2,
} from 'lucide-react';
import { Post, ThemeMode, UserProfile, ADMIN_USERNAME, checkIsAuthorized } from '../types';
import { TranslationDictionary } from '../lib/i18n';
import {
  validateUsername,
  generateRandomUsername,
  optimizeProfilePhoto,
  saveProfileToFirestore,
  isPlatformAdmin,
} from '../lib/userProfiles';

interface FullProfilePageProps {
  theme: ThemeMode;
  userEmail: string | null;
  userName: string;
  userAvatar: string;
  allProfiles: Record<string, UserProfile>;
  userPosts?: Post[];
  onNavigateToGallery: () => void;
  onNavigateToHome?: () => void;
  onOpenCreatePost?: () => void;
  onOpenAccountSelector: () => void;
  onLogout: () => void;
  onUpdateProfile: (updatedProfile: UserProfile) => void;
  onEditPost?: (post: Post) => void;
  onDeletePost?: (post: Post) => void;
  onOpenLightbox?: (
    imageUrl: string,
    title: string,
    type: 'setup' | 'result',
    subtitle?: string
  ) => void;
  t: TranslationDictionary;
}

export function FullProfilePage({
  theme,
  userEmail,
  userName,
  userAvatar,
  allProfiles,
  onNavigateToGallery,
  onNavigateToHome,
  onOpenAccountSelector,
  onLogout,
  onUpdateProfile,
  t,
}: FullProfilePageProps) {
  const isBurgundy = theme === 'burgundy';
  const isAdmin = isPlatformAdmin(userEmail);
  const isAuthorized = checkIsAuthorized(userEmail);

  // Normalized current profile
  const currentProfile: UserProfile | undefined = userEmail
    ? allProfiles[userEmail.toLowerCase().trim()]
    : undefined;

  // Active Tab: 'info' | 'settings' | 'security' | 'stats'
  const [activeTab, setActiveTab] = useState<'info' | 'settings' | 'security' | 'stats'>('info');

  // Local states for editing profile
  const [nameInput, setNameInput] = useState(
    currentProfile?.name || userName || 'مستخدم'
  );
  const [usernameInput, setUsernameInput] = useState(
    currentProfile?.username || (isAdmin ? ADMIN_USERNAME : '')
  );
  const [titleInput, setTitleInput] = useState(
    currentProfile?.title || (isAdmin ? 'مدير المنصة والأنظمة الرقمية' : 'عضو ومستخدم معتمد')
  );
  const [locationInput, setLocationInput] = useState(
    currentProfile?.location || 'عمان، الأردن'
  );
  const [websiteInput, setWebsiteInput] = useState(
    currentProfile?.website || ''
  );
  const [bioInput, setBioInput] = useState(
    currentProfile?.bio ||
      (isAdmin
        ? 'مطور ومسؤول المنصة • مهتم بهندسة الواجهات وتطوير الأنظمة والتجربة الرقمية الحديثة'
        : 'مستخدم وعضو نشط في المنصة • مهتم بالتصميم والتجربة الرقمية والتفاعل التقني الحديث')
  );
  const [avatarPreview, setAvatarPreview] = useState(
    currentProfile?.avatar || userAvatar
  );

  // Status flags
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedUsername, setCopiedUsername] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // File input ref for avatar
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync inputs if currentProfile updates from Firestore
  useEffect(() => {
    if (currentProfile) {
      setNameInput(currentProfile.name || userName);
      if (currentProfile.username) {
        setUsernameInput(currentProfile.username);
      }
      if (currentProfile.avatar) {
        setAvatarPreview(currentProfile.avatar);
      }
      if (currentProfile.bio !== undefined) {
        setBioInput(currentProfile.bio);
      }
      if (currentProfile.title !== undefined) {
        setTitleInput(currentProfile.title);
      }
      if (currentProfile.location !== undefined) {
        setLocationInput(currentProfile.location);
      }
      if (currentProfile.website !== undefined) {
        setWebsiteInput(currentProfile.website);
      }
    }
  }, [currentProfile, userName]);

  // Username validation
  const usernameValidation = validateUsername(
    usernameInput,
    userEmail,
    allProfiles
  );

  // Copy username to clipboard
  const handleCopyUsername = () => {
    if (!usernameInput) return;
    const fullHandle = `@${usernameInput.replace(/^@/, '')}`;
    navigator.clipboard.writeText(fullHandle);
    setCopiedUsername(true);
    setTimeout(() => setCopiedUsername(false), 2000);
  };

  // Generate random avatar
  const handleRandomizeAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(2, 10);
    const newAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${randomSeed}`;
    setAvatarPreview(newAvatar);
  };

  // Generate random unique username for regular users
  const handleRandomizeUsername = () => {
    if (isAdmin) return;
    const taken = new Set<string>();
    Object.values(allProfiles).forEach((p) => {
      if (p.username) taken.add(p.username.toLowerCase());
    });
    const rand = generateRandomUsername(taken);
    setUsernameInput(rand);
  };

  // Handle local file photo upload (phone gallery or PC)
  const handlePhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (< 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 10 ميجابايت');
      return;
    }

    try {
      setIsUploadingPhoto(true);
      setUploadError(null);
      const optimizedBase64 = await optimizeProfilePhoto(file);
      setAvatarPreview(optimizedBase64);
    } catch (err: any) {
      setUploadError('حدث خطأ أثناء معالجة الصورة، يرجى تجربة صورة أخرى');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Save all profile changes
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail) return;

    if (!usernameValidation.isValid && !isAdmin) {
      return;
    }

    try {
      setIsSaving(true);
      setSaveSuccess(false);

      const finalUsername = isAdmin
        ? ADMIN_USERNAME
        : usernameInput.trim().replace(/^@/, '');

      const updatedProfile: UserProfile = {
        email: userEmail.toLowerCase().trim(),
        name: nameInput.trim() || 'مستخدم',
        username: finalUsername,
        avatar: avatarPreview,
        bio: bioInput.trim(),
        title: titleInput.trim(),
        location: locationInput.trim(),
        website: websiteInput.trim(),
        isAuthorized: isAuthorized || isAdmin,
        updatedAt: new Date().toISOString(),
        createdAt: currentProfile?.createdAt || new Date().toISOString(),
      };

      await saveProfileToFirestore(updatedProfile);
      onUpdateProfile(updatedProfile);

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Fallback if not logged in
  if (!userEmail) {
    return (
      <div className="w-full max-w-[800px] mx-auto px-4 py-16 text-center animate-in fade-in duration-300">
        <div
          className={`p-8 sm:p-12 rounded-3xl border shadow-xl ${
            isBurgundy
              ? 'bg-[#1e070e] border-[#581827] text-[#fce7f3]'
              : 'bg-white border-[#e7e5e4] text-[#1c1917]'
          }`}
        >
          <div className="w-16 h-16 rounded-3xl bg-rose-500/10 text-rose-500 mx-auto flex items-center justify-center mb-4">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black mb-2">الملف الشخصي وحساب المستخدم</h2>
          <p className="text-sm opacity-80 max-w-[480px] mx-auto mb-6 leading-relaxed">
            يرجى تسجيل الدخول بحساب Google للوصول إلى لوحة تحكم ملفك الشخصي وتخصيص هويتك وبياناتك الرقمية بشكل مستقل.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={onOpenAccountSelector}
              className={`h-11 px-6 rounded-2xl font-black text-sm text-white cursor-pointer shadow-md transition-transform hover:scale-102 ${
                isBurgundy ? 'bg-[#f43f5e] hover:bg-rose-600' : 'bg-[#6b0f24] hover:bg-rose-900'
              }`}
            >
              تسجيل الدخول بحساب Google
            </button>
            <button
              type="button"
              onClick={onNavigateToGallery}
              className={`h-11 px-5 rounded-2xl font-bold text-xs border cursor-pointer transition-all ${
                isBurgundy
                  ? 'border-[#581827] bg-[#15040a] text-[#fda4af] hover:text-white'
                  : 'border-[#e7e5e4] bg-[#f9f6ef] text-[#1c1917] hover:text-black'
              }`}
            >
              الرجوع للمعرض
            </button>
          </div>
        </div>
      </div>
    );
  }

  const joinDateFormatted = currentProfile?.createdAt
    ? new Date(currentProfile.createdAt).toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'عضو مسجل';

  return (
    <div
      id="user-profile-page"
      className="w-full max-w-[1100px] mx-auto px-3 sm:px-6 py-6 sm:py-10 flex flex-col gap-6 animate-in fade-in duration-300"
    >
      {/* 1. TOP BREADCRUMB & NAVIGATION BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-current/10">
        <div className="flex items-center gap-2 text-xs font-bold opacity-85">
          <button
            type="button"
            onClick={onNavigateToGallery}
            className="hover:underline flex items-center gap-1.5 cursor-pointer text-rose-500"
          >
            <span>معرض الصور</span>
          </button>
          <span className="opacity-40">/</span>
          <span className="font-black">الملف الشخصي والحساب</span>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToHome && (
            <button
              type="button"
              onClick={onNavigateToHome}
              className={`h-8.5 px-3 rounded-full border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                isBurgundy
                  ? 'border-[#581827] bg-[#1e070e] text-[#fda4af] hover:border-rose-400'
                  : 'border-[#e7e5e4] bg-white text-[#1c1917] hover:border-[#6b0f24]'
              }`}
            >
              <Home className="w-3.5 h-3.5 text-amber-500" />
              <span>الصفحة الرئيسية</span>
            </button>
          )}

          <button
            type="button"
            onClick={onNavigateToGallery}
            className={`h-8.5 px-3.5 rounded-full border text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all text-white ${
              isBurgundy ? 'bg-[#f43f5e] border-[#f43f5e]' : 'bg-[#6b0f24] border-[#6b0f24]'
            }`}
          >
            <span>استعراض المعرض</span>
            <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
          </button>
        </div>
      </div>

      {/* 2. PROFILE HERO IDENTITY CARD */}
      <div
        id="profile-hero-card"
        className={`relative overflow-hidden rounded-3xl border shadow-lg transition-all ${
          isBurgundy
            ? 'bg-[#1e070e] border-[#581827]'
            : 'bg-white border-[#e7e5e4]'
        }`}
      >
        {/* Banner Cover */}
        <div
          className="h-32 sm:h-44 w-full relative"
          style={{
            backgroundImage: isBurgundy
              ? 'linear-gradient(135deg, #3b101c 0%, #15040a 100%)'
              : 'linear-gradient(135deg, #6b0f24 0%, #9f1239 50%, #f1ede4 100%)',
          }}
        >
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Account Status Badge (Top Left) */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <div
              className={`px-3 py-1 rounded-full backdrop-blur-md border text-xs font-black flex items-center gap-1.5 ${
                isBurgundy
                  ? 'bg-[#15040a]/80 border-emerald-500/40 text-emerald-300'
                  : 'bg-white/90 border-emerald-300 text-emerald-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>حساب Google متصل وموثق</span>
            </div>
          </div>
        </div>

        {/* Profile Main Header Body */}
        <div className="px-4 sm:px-8 pb-6 pt-0 relative flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          {/* Avatar & User Details */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-14 sm:-mt-16 z-10 w-full sm:w-auto">
            {/* Avatar container */}
            <div className="relative group">
              <div
                className={`w-24 h-24 sm:w-32 sm:h-32 rounded-3xl border-4 overflow-hidden shadow-xl flex items-center justify-center ${
                  isBurgundy
                    ? 'border-[#1e070e] bg-[#15040a]'
                    : 'border-white bg-[#f9f6ef]'
                }`}
              >
                <img
                  src={avatarPreview}
                  alt={nameInput}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Online Indicator */}
              <div
                title="متصل الآن"
                className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-xs"
              />

              {/* Quick photo change button overlay */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="تغيير الصورة الشخصية"
                className="absolute inset-0 rounded-3xl bg-black/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[11px] font-bold"
              >
                <Upload className="w-5 h-5 mb-1" />
                <span>رفع صورة</span>
              </button>
            </div>

            {/* User textual info */}
            <div className="flex-1 text-right">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
                  {nameInput || 'مستخدم'}
                </h1>

                {/* Verified / Admin Badge */}
                {isAuthorized && (
                  <div
                    title={isAdmin ? 'مدير معتمد للمنصة' : 'مستخدم موثق'}
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black border ${
                      isAdmin
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                        : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                    }`}
                  >
                    {isAdmin ? <Crown className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                    <span>{isAdmin ? 'مدير المنصة' : 'عضو موثق'}</span>
                  </div>
                )}
              </div>

              {/* Username & Professional Title */}
              <div className="flex flex-wrap items-center gap-3 text-xs opacity-85 mb-2">
                <button
                  type="button"
                  onClick={handleCopyUsername}
                  title="نسخ اسم المستخدم"
                  className={`inline-flex items-center gap-1 font-mono font-bold px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                    isBurgundy
                      ? 'border-[#3b101c] bg-[#15040a] text-rose-300 hover:border-rose-400'
                      : 'border-[#e7e5e4] bg-[#f1ede4] text-[#6b0f24] hover:border-[#6b0f24]'
                  }`}
                >
                  <span>@{usernameInput || (isAdmin ? ADMIN_USERNAME : 'user')}</span>
                  {copiedUsername ? (
                    <Check className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <Copy className="w-3 h-3 opacity-60" />
                  )}
                </button>

                {titleInput && (
                  <span className="flex items-center gap-1 font-medium">
                    <Briefcase className="w-3.5 h-3.5 opacity-60" />
                    <span>{titleInput}</span>
                  </span>
                )}
              </div>

              {/* Meta tags (Location, Email, Join Date) */}
              <div className="flex flex-wrap items-center gap-3 text-[11px] opacity-70">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-rose-500" />
                  <span className="font-mono">{userEmail}</span>
                </span>
                {locationInput && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-500" />
                    <span>{locationInput}</span>
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-emerald-500" />
                  <span>انضم: {joinDateFormatted}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons on Header */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0">
            <button
              type="button"
              onClick={onOpenAccountSelector}
              className={`h-9 px-3.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                isBurgundy
                  ? 'border-[#581827] bg-[#15040a] text-[#fda4af] hover:border-rose-400'
                  : 'border-[#e7e5e4] bg-[#f9f6ef] text-[#1c1917] hover:border-[#6b0f24]'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>تبديل الحساب</span>
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="h-9 px-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>

        {/* PROFILE TABS */}
        <div className="px-4 sm:px-8 border-t border-current/10 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`py-3 px-3 text-xs sm:text-sm font-black border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'info'
                ? isBurgundy
                  ? 'border-[#f43f5e] text-[#f43f5e]'
                  : 'border-[#6b0f24] text-[#6b0f24]'
                : 'border-transparent opacity-65 hover:opacity-100'
            }`}
          >
            <User className="w-4 h-4" />
            <span>البيانات الشخصية والنبذة</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-3 text-xs sm:text-sm font-black border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'settings'
                ? isBurgundy
                  ? 'border-[#f43f5e] text-[#f43f5e]'
                  : 'border-[#6b0f24] text-[#6b0f24]'
                : 'border-transparent opacity-65 hover:opacity-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>إعدادات الحساب والمظهر</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`py-3 px-3 text-xs sm:text-sm font-black border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'security'
                ? isBurgundy
                  ? 'border-[#f43f5e] text-[#f43f5e]'
                  : 'border-[#6b0f24] text-[#6b0f24]'
                : 'border-transparent opacity-65 hover:opacity-100'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>الأمان والمصادقة</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('stats')}
            className={`py-3 px-3 text-xs sm:text-sm font-black border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'stats'
                ? isBurgundy
                  ? 'border-[#f43f5e] text-[#f43f5e]'
                  : 'border-[#6b0f24] text-[#6b0f24]'
                : 'border-transparent opacity-65 hover:opacity-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>حالة العضوية والإحصائيات</span>
          </button>
        </div>
      </div>

      {/* Hidden file input for photo upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* TAB CONTENT 1: PERSONAL INFO EDITING */}
      {activeTab === 'info' && (
        <form onSubmit={handleSaveProfile} className="flex flex-col gap-6">
          <div
            className={`p-5 sm:p-8 rounded-3xl border shadow-md flex flex-col gap-6 ${
              isBurgundy
                ? 'bg-[#1e070e] border-[#581827]'
                : 'bg-white border-[#e7e5e4]'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-current/10">
              <div>
                <h2 className="text-base sm:text-lg font-black">
                  تعديل الملف التعريفي والبيانات الشخصية
                </h2>
                <p className="text-xs opacity-75">
                  خصص هويتك الرقمية ومعلوماتك الشخصية لتظهر في ملفك وحسابك
                </p>
              </div>

              {saveSuccess && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/30">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تم حفظ التعديلات بنجاح!</span>
                </div>
              )}
            </div>

            {/* Avatar Management Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl border border-current/10 bg-current/5">
              <div className="flex items-center gap-3">
                <img
                  src={avatarPreview}
                  alt="avatar"
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-rose-500"
                />
                <div>
                  <h3 className="font-bold text-xs sm:text-sm">الصورة الرمزية والشخصية</h3>
                  <p className="text-[11px] opacity-70">
                    يمكنك رفع صورة من هاتفك أو حاسوبك، أو توليد رمز مميز
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingPhoto}
                  className={`flex-1 sm:flex-initial h-9 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                    isBurgundy
                      ? 'border-[#581827] bg-[#15040a] text-white hover:border-rose-400'
                      : 'border-[#e7e5e4] bg-white text-[#1c1917] hover:border-[#6b0f24]'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5 text-rose-500" />
                  <span>{isUploadingPhoto ? 'جاري المعالجة...' : 'رفع صورة من جهازك'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleRandomizeAvatar}
                  className={`h-9 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                    isBurgundy
                      ? 'border-[#581827] bg-[#15040a] text-amber-300 hover:border-amber-400'
                      : 'border-[#e7e5e4] bg-white text-[#6b0f24] hover:border-[#6b0f24]'
                  }`}
                >
                  <Dice5 className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">توليد أفاتار</span>
                </button>
              </div>
            </div>

            {uploadError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Display Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-rose-500" />
                  <span>الاسم الظاهر الكامل</span>
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="مثال: عبد الرحمن إبداح"
                  className={`w-full px-4 py-2.5 rounded-2xl text-xs sm:text-sm border focus:outline-hidden transition-all ${
                    isBurgundy
                      ? 'bg-[#15040a] border-[#3b101c] text-[#fce7f3] focus:border-[#f43f5e]'
                      : 'bg-[#fcfaf6] border-[#e7e5e4] text-[#1c1917] focus:border-[#6b0f24]'
                  }`}
                />
              </div>

              {/* Username Handle */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black flex items-center gap-1">
                    <span className="text-rose-500 font-mono">@</span>
                    <span>اسم المستخدم (المعرف الفريد)</span>
                  </label>
                  {!isAdmin && (
                    <button
                      type="button"
                      onClick={handleRandomizeUsername}
                      className="text-[10px] font-bold text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Dice5 className="w-3 h-3" />
                      <span>اقتراح اسم عشوائي</span>
                    </button>
                  )}
                  {isAdmin && (
                    <span className="text-[10px] text-amber-400 font-bold">
                      محجوز لحسابات الإدارة: admin
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    disabled={isAdmin}
                    value={isAdmin ? ADMIN_USERNAME : usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value.toLowerCase())}
                    placeholder="مثال: user_921 أو dev_384"
                    dir="ltr"
                    className={`w-full px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-mono border focus:outline-hidden transition-all ${
                      isAdmin
                        ? 'opacity-70 cursor-not-allowed bg-current/5 border-current/10'
                        : isBurgundy
                        ? 'bg-[#15040a] border-[#3b101c] text-[#fce7f3] focus:border-[#f43f5e]'
                        : 'bg-[#fcfaf6] border-[#e7e5e4] text-[#1c1917] focus:border-[#6b0f24]'
                    }`}
                  />
                </div>
                {!isAdmin && usernameValidation.error && (
                  <p className="text-[11px] text-rose-500 font-bold flex items-center gap-1 mt-0.5">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{usernameValidation.error}</span>
                  </p>
                )}
                {!isAdmin && usernameValidation.isValid && (
                  <p className="text-[11px] text-emerald-500 font-bold flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3 h-3 shrink-0" />
                    <span>اسم المستخدم متاح ومطابق للشروط</span>
                  </p>
                )}
              </div>

              {/* Professional Title / Role */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-amber-500" />
                  <span>المسمى المهني / التخصص</span>
                </label>
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  placeholder="مثال: مهندس برمجيات • مصمم واجهات وتجربة مستخدم"
                  className={`w-full px-4 py-2.5 rounded-2xl text-xs sm:text-sm border focus:outline-hidden transition-all ${
                    isBurgundy
                      ? 'bg-[#15040a] border-[#3b101c] text-[#fce7f3] focus:border-[#f43f5e]'
                      : 'bg-[#fcfaf6] border-[#e7e5e4] text-[#1c1917] focus:border-[#6b0f24]'
                  }`}
                />
              </div>

              {/* Location */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                  <span>المدينة والدولة</span>
                </label>
                <input
                  type="text"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  placeholder="مثال: عمان، الأردن"
                  className={`w-full px-4 py-2.5 rounded-2xl text-xs sm:text-sm border focus:outline-hidden transition-all ${
                    isBurgundy
                      ? 'bg-[#15040a] border-[#3b101c] text-[#fce7f3] focus:border-[#f43f5e]'
                      : 'bg-[#fcfaf6] border-[#e7e5e4] text-[#1c1917] focus:border-[#6b0f24]'
                  }`}
                />
              </div>

              {/* Website / Portfolio Link */}
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs font-black flex items-center gap-1">
                  <Link2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>رابط الموقع أو المعرض الشخصي (اختياري)</span>
                </label>
                <input
                  type="url"
                  value={websiteInput}
                  onChange={(e) => setWebsiteInput(e.target.value)}
                  placeholder="https://yourwebsite.com"
                  dir="ltr"
                  className={`w-full px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-mono border focus:outline-hidden transition-all ${
                    isBurgundy
                      ? 'bg-[#15040a] border-[#3b101c] text-[#fce7f3] focus:border-[#f43f5e]'
                      : 'bg-[#fcfaf6] border-[#e7e5e4] text-[#1c1917] focus:border-[#6b0f24]'
                  }`}
                />
              </div>

              {/* Bio / About Me */}
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black flex items-center gap-1">
                    <Edit3 className="w-3.5 h-3.5 text-rose-500" />
                    <span>النبذة الشخصية والسيرة الذاتية (Bio)</span>
                  </label>
                  <span className="text-[11px] opacity-60">
                    {bioInput.length} / 300 حرف
                  </span>
                </div>
                <textarea
                  rows={4}
                  maxLength={300}
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  placeholder="اكتب نبذة شخصية تعرف فيها بنفسك، مهاراتك، اهتماماتك، وخبراتك..."
                  className={`w-full px-4 py-3 rounded-2xl text-xs sm:text-sm border focus:outline-hidden transition-all leading-relaxed ${
                    isBurgundy
                      ? 'bg-[#15040a] border-[#3b101c] text-[#fce7f3] focus:border-[#f43f5e]'
                      : 'bg-[#fcfaf6] border-[#e7e5e4] text-[#1c1917] focus:border-[#6b0f24]'
                  }`}
                />
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-current/10">
              <button
                type="submit"
                disabled={isSaving || (!usernameValidation.isValid && !isAdmin)}
                className={`h-11 px-8 rounded-2xl font-black text-sm text-white flex items-center gap-2 cursor-pointer shadow-lg transition-all ${
                  isBurgundy
                    ? 'bg-gradient-to-r from-[#f43f5e] to-[#e11d48] shadow-rose-900/40 hover:shadow-rose-600/30'
                    : 'bg-gradient-to-r from-[#6b0f24] to-[#881337] shadow-rose-950/20 hover:shadow-rose-900/30'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>جاري الحفظ في السحابة...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>حفظ وتحديث الملف الشخصي</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB CONTENT 2: SETTINGS & THEME */}
      {activeTab === 'settings' && (
        <div
          className={`p-5 sm:p-8 rounded-3xl border shadow-md flex flex-col gap-6 ${
            isBurgundy
              ? 'bg-[#1e070e] border-[#581827]'
              : 'bg-white border-[#e7e5e4]'
          }`}
        >
          <div className="pb-3 border-b border-current/10">
            <h2 className="text-base sm:text-lg font-black">إعدادات الحساب والمظهر</h2>
            <p className="text-xs opacity-75">
              تحكم في تفضيلات واجهة الاستخدام ومزامنة البيانات السحابية
            </p>
          </div>

          {/* Theme Mode Selector */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-black flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-rose-500" />
              <span>نمط المظهر (الثيم)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                className={`p-4 rounded-2xl border flex items-center justify-between ${
                  !isBurgundy
                    ? 'border-[#6b0f24] bg-white ring-2 ring-[#6b0f24]/20 shadow-xs'
                    : 'border-[#3b101c] bg-[#15040a]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#f1ede4] text-[#6b0f24] flex items-center justify-center">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm">الوضع الأبيض الفاخر (White)</h3>
                    <p className="text-[11px] opacity-70">خلفية فاتحة مع درجات البورغندي</p>
                  </div>
                </div>
                {!isBurgundy && <CheckCircle2 className="w-5 h-5 text-[#6b0f24]" />}
              </div>

              <div
                className={`p-4 rounded-2xl border flex items-center justify-between ${
                  isBurgundy
                    ? 'border-[#f43f5e] bg-[#240611] ring-2 ring-[#f43f5e]/20 shadow-xs'
                    : 'border-[#e7e5e4] bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#3b101c] text-[#f43f5e] flex items-center justify-center">
                    <Moon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm">الوضع العنابي الليلي (Burgundy)</h3>
                    <p className="text-[11px] opacity-70">خلفية عنابية ليلية مريحة للعين</p>
                  </div>
                </div>
                {isBurgundy && <CheckCircle2 className="w-5 h-5 text-[#f43f5e]" />}
              </div>
            </div>
          </div>

          {/* Cloud Synchronization Status */}
          <div className="p-4 rounded-2xl border border-current/10 bg-current/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm">المزامنة السحابية الحية (Firestore)</h3>
                <p className="text-[11px] opacity-70">
                  يتم حفظ وتحديث ملفك الشخصي لحظياً على خوادم قاعدة بيانات Firebase
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>متصل</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: SECURITY & GOOGLE AUTH */}
      {activeTab === 'security' && (
        <div
          className={`p-5 sm:p-8 rounded-3xl border shadow-md flex flex-col gap-6 ${
            isBurgundy
              ? 'bg-[#1e070e] border-[#581827]'
              : 'bg-white border-[#e7e5e4]'
          }`}
        >
          <div className="pb-3 border-b border-current/10">
            <h2 className="text-base sm:text-lg font-black">الأمان وتسجيل الدخول بحساب Google</h2>
            <p className="text-xs opacity-75">
              تفاصيل المصادقة المشفرة والأمان لحسابك الحالي
            </p>
          </div>

          {/* Connected Google Account Card */}
          <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
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
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-sm sm:text-base">{userEmail}</h3>
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </div>
                <p className="text-xs opacity-75">
                  حساب Google موثق عبر بروتوكول OAuth 2.0 الآمن
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onOpenAccountSelector}
                className={`flex-1 sm:flex-initial h-9 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                  isBurgundy
                    ? 'border-[#581827] bg-[#15040a] text-[#fce7f3] hover:border-rose-400'
                    : 'border-[#e7e5e4] bg-white text-[#1c1917] hover:border-[#6b0f24]'
                }`}
              >
                <span>تبديل الحساب</span>
              </button>

              <button
                type="button"
                onClick={onLogout}
                className="h-9 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </div>

          {/* Security Features Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl border border-current/10 bg-current/5 flex flex-col gap-1">
              <div className="font-black flex items-center gap-1.5 text-emerald-500">
                <Shield className="w-4 h-4" />
                <span>تشفير الجلسة</span>
              </div>
              <p className="opacity-75 text-[11px]">جلسة مشفرة ومؤمنة بأحدث المعايير السحابية</p>
            </div>

            <div className="p-3.5 rounded-2xl border border-current/10 bg-current/5 flex flex-col gap-1">
              <div className="font-black flex items-center gap-1.5 text-amber-500">
                <Crown className="w-4 h-4" />
                <span>الصلاحيات</span>
              </div>
              <p className="opacity-75 text-[11px]">
                {isAdmin ? 'صلاحيات إدارة كاملة' : 'صلاحيات عضو موثق'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl border border-current/10 bg-current/5 flex flex-col gap-1">
              <div className="font-black flex items-center gap-1.5 text-rose-500">
                <Calendar className="w-4 h-4" />
                <span>آخر تسجيل دخول</span>
              </div>
              <p className="opacity-75 text-[11px] font-mono">اليوم، نشط حالياً</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: ACCOUNT STATS & BADGES */}
      {activeTab === 'stats' && (
        <div
          className={`p-5 sm:p-8 rounded-3xl border shadow-md flex flex-col gap-6 ${
            isBurgundy
              ? 'bg-[#1e070e] border-[#581827]'
              : 'bg-white border-[#e7e5e4]'
          }`}
        >
          <div className="pb-3 border-b border-current/10">
            <h2 className="text-base sm:text-lg font-black">حالة العضوية والإحصائيات</h2>
            <p className="text-xs opacity-75">
              نظرة عامة على حالة حسابك ومعلومات المصادقة السحابية
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl border border-current/10 bg-current/5 text-center">
              <div className="font-black text-2xl text-rose-500">100%</div>
              <div className="text-xs font-bold mt-1">اكتمال الملف</div>
              <div className="text-[10px] opacity-70">تم توثيق البيانات</div>
            </div>

            <div className="p-4 rounded-2xl border border-current/10 bg-current/5 text-center">
              <div className="font-black text-2xl text-emerald-500">Google</div>
              <div className="text-xs font-bold mt-1">نوع المصادقة</div>
              <div className="text-[10px] opacity-70">دخول آمن وموثوق</div>
            </div>

            <div className="p-4 rounded-2xl border border-current/10 bg-current/5 text-center">
              <div className="font-black text-2xl text-amber-500">
                {isAdmin ? 'مدير' : 'عضو'}
              </div>
              <div className="text-xs font-bold mt-1">مستوى الحساب</div>
              <div className="text-[10px] opacity-70">
                {isAdmin ? 'إدارة المنصة' : 'مستخدم نشط'}
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-current/10 bg-current/5 text-center">
              <div className="font-black text-2xl text-sky-500">Live</div>
              <div className="text-xs font-bold mt-1">حالة السيرفر</div>
              <div className="text-[10px] opacity-70">مزامنة سحابية فورية</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
