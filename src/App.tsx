import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import {
  Camera,
  Filter,
  Layers,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Headphones,
} from 'lucide-react';
import { Post, ThemeMode, UserProfile, ADMIN_USERNAME, checkIsAuthorized, SupportTicket } from './types';
import { INITIAL_POSTS } from './data/initialPosts';
import { Header } from './components/Header';
import { PostCard } from './components/PostCard';
import { EditPostModal } from './components/EditPostModal';
import { CreatePostModal } from './components/CreatePostModal';
import { CustomConfirmModal } from './components/CustomConfirmModal';
import { GoogleLoginModal } from './components/GoogleLoginModal';
import { ImageLightboxModal } from './components/ImageLightboxModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { ProfileModal } from './components/ProfileModal';
import { LanguageModal } from './components/LanguageModal';
import { FullProfilePage } from './components/FullProfilePage';
import { StartScreen } from './components/StartScreen';
import { DesignerSignatureBadge } from './components/DesignerSignatureBadge';
import { CustomerSupportModal } from './components/CustomerSupportModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { NetlifyExportModal } from './components/NetlifyExportModal';
import {
  SUPPORTED_LANGUAGES,
  getTranslations,
  LanguageInfo,
} from './lib/i18n';
import {
  subscribeToPosts,
  savePostToFirestore,
  deletePostFromFirestore,
  subscribeToTickets,
  saveTicketToFirestore,
  deleteTicketFromFirestore,
  onAuthChange,
  logoutFromFirebase,
} from './lib/firebase';
import {
  getCachedProfiles,
  getOrCreateUserProfile,
  saveProfileToFirestore,
  subscribeToProfiles,
} from './lib/userProfiles';

const STORAGE_KEY_POSTS = 'faceprompt_stories_posts_v2';
const STORAGE_KEY_THEME = 'faceprompt_theme_mode_v2';
const STORAGE_KEY_USER = 'faceprompt_user_email_v2';
const STORAGE_KEY_USER_NAME = 'faceprompt_user_name_v2';
const STORAGE_KEY_LANG = 'faceprompt_lang_code_v1';
const STORAGE_KEY_TICKETS = 'faceprompt_support_tickets_v1';

export default function App() {
  // Theme state: 'white' | 'burgundy' (default white, silent toggle without alert)
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    return saved === 'burgundy' ? 'burgundy' : 'white';
  });

  // View state: 'start' (شاشة البدء الاحترافية) | 'gallery' (معرض البرومبتات) | 'profile' (الملف الشخصي الكامل)
  const [currentView, setCurrentView] = useState<'start' | 'gallery' | 'profile'>('start');

  // All user profiles loaded from Firestore + localStorage
  const [allProfiles, setAllProfiles] = useState<Record<string, UserProfile>>(() =>
    getCachedProfiles()
  );

  // Language state (default 'ar' as requested: 1. Arabic, 2. English, 3. Russian, ...)
  const [currentLanguage, setCurrentLanguage] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LANG);
    return saved || 'ar';
  });
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  const t = useMemo(() => getTranslations(currentLanguage), [currentLanguage]);
  const currentLangObj = useMemo(
    () =>
      SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) ||
      SUPPORTED_LANGUAGES[0],
    [currentLanguage]
  );

  // Current user email: null by default for any visitor; restored if previously logged in
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USER);
    return saved && saved.trim() ? saved.trim() : null;
  });

  // User display name
  const [userName, setUserName] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USER_NAME);
    return saved || 'مستخدم';
  });

  // Posts state
  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_POSTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_POSTS;
  });

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Manage / Edit Mode (Active for authorized users to edit/delete on cards)
  const [manageMode, setManageMode] = useState(true);

  // Modals state
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isNetlifyModalOpen, setIsNetlifyModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deletingPost, setDeletingPost] = useState<Post | null>(null);

  // Customer Support Tickets state (Synced across the 5 Admin Google accounts)
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TICKETS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  // Lightbox
  const [lightboxData, setLightboxData] = useState<{
    isOpen: boolean;
    imageUrl: string;
    title: string;
    type: 'setup' | 'result';
    subtitle?: string;
  }>({
    isOpen: false,
    imageUrl: '',
    title: '',
    type: 'result',
  });

  // Check authorization for current email (strictly one of the 5 authorized Google accounts)
  const isAuthorized = checkIsAuthorized(userEmail);

  // Sync language and direction (RTL vs LTR)
  useEffect(() => {
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = currentLangObj.dir;
    localStorage.setItem(STORAGE_KEY_LANG, currentLanguage);
  }, [currentLanguage, currentLangObj.dir]);

  // Sync theme attribute to documentElement
  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      theme === 'burgundy' ? 'burgundy' : 'light'
    );
    localStorage.setItem(STORAGE_KEY_THEME, theme);
  }, [theme]);

  // Real-time synchronization with Firebase Firestore
  useEffect(() => {
    const unsubscribe = subscribeToPosts((cloudPosts) => {
      if (cloudPosts && cloudPosts.length > 0) {
        setPosts(cloudPosts);
      }
    });
    return () => unsubscribe();
  }, []);

  // Real-time synchronization of all user profiles (Firestore + local storage fallback)
  useEffect(() => {
    const unsubscribe = subscribeToProfiles((profiles) => {
      if (profiles && Object.keys(profiles).length > 0) {
        setAllProfiles(profiles);
      }
    });
    return () => unsubscribe();
  }, []);

  // Stabilize allProfiles reference to avoid re-subscribing auth loop
  const allProfilesRef = useRef(allProfiles);
  useEffect(() => {
    allProfilesRef.current = allProfiles;
  }, [allProfiles]);

  // Listen to Firebase Auth state once without recreating loop
  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      if (user && user.email) {
        const normEmail = user.email.toLowerCase().trim();
        setUserEmail(normEmail);
        const disp = user.displayName || normEmail.split('@')[0];
        setUserName(disp);

        const prof = getOrCreateUserProfile(
          normEmail,
          disp,
          user.photoURL || '',
          allProfilesRef.current
        );
        saveProfileToFirestore(prof);
      }
    });
    return () => unsubscribe();
  }, []);

  // Real-time synchronization of Support Tickets from Firestore (syncing with 5 Admin accounts)
  useEffect(() => {
    const unsubscribe = subscribeToTickets((cloudTickets) => {
      if (cloudTickets) {
        setSupportTickets(cloudTickets);
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync tickets to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TICKETS, JSON.stringify(supportTickets));
  }, [supportTickets]);

  // Sync posts and user data to local storage as instant cache
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    if (userEmail) {
      localStorage.setItem(STORAGE_KEY_USER, userEmail);
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }, [userEmail]);

  useEffect(() => {
    if (userName) {
      localStorage.setItem(STORAGE_KEY_USER_NAME, userName);
    } else {
      localStorage.removeItem(STORAGE_KEY_USER_NAME);
    }
  }, [userName]);

  const handleLogin = (email: string) => {
    const normEmail = email.toLowerCase().trim();
    setUserEmail(normEmail);
    const prefix = normEmail.split('@')[0];
    const formatted = prefix.charAt(0).toUpperCase() + prefix.slice(1);
    setUserName(formatted);

    const prof = getOrCreateUserProfile(
      normEmail,
      formatted,
      `https://api.dicebear.com/7.x/bottts/svg?seed=${normEmail}`,
      allProfiles
    );
    saveProfileToFirestore(prof);
    setAllProfiles((prev) => ({ ...prev, [normEmail]: prof }));
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    const normEmail = updatedProfile.email.toLowerCase().trim();
    setAllProfiles((prev) => ({
      ...prev,
      [normEmail]: updatedProfile,
    }));
    if (updatedProfile.name) {
      setUserName(updatedProfile.name);
    }
  };

  const handleLogout = async () => {
    setUserEmail(null);
    setUserName('مستخدم');
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_USER_NAME);
    setManageMode(false);
    try {
      await logoutFromFirebase();
    } catch (err) {
      console.warn('Logout from Firebase warning:', err);
    }
  };

  // SILENT THEME TOGGLE: No alert or toast appears at all (as requested)
  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'white' ? 'burgundy' : 'white'));
  };

  // Add new post (saved both to local state & cloud Firestore)
  const handleAddPost = async (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
    try {
      await savePostToFirestore(newPost);
    } catch (err) {
      console.warn('Saved to local storage, Firestore sync error:', err);
    }
  };

  // Save edited post (saved both to local state & cloud Firestore)
  const handleSaveEdit = async (updatedPost: Post) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
    );
    setEditingPost(null);
    try {
      await savePostToFirestore(updatedPost);
    } catch (err) {
      console.warn('Saved to local storage, Firestore sync error:', err);
    }
  };

  // Confirm delete post (deleted from local state & cloud Firestore)
  const handleConfirmDelete = async () => {
    if (deletingPost) {
      const idToDelete = deletingPost.id;
      setPosts((prev) => prev.filter((p) => p.id !== idToDelete));
      setDeletingPost(null);
      try {
        await deletePostFromFirestore(idToDelete);
      } catch (err) {
        console.warn('Deleted from local storage, Firestore delete error:', err);
      }
    }
  };

  // Reset to sample initial posts
  const handleResetDefaults = () => {
    setPosts(INITIAL_POSTS);
    try {
      for (const p of INITIAL_POSTS) {
        savePostToFirestore(p);
      }
    } catch (err) {
      console.warn('Reset seed warning:', err);
    }
  };

  // Support ticket actions
  const handleSubmitTicket = async (
    ticketData: Omit<SupportTicket, 'id' | 'createdAt'>
  ) => {
    const newTicket: SupportTicket = {
      ...ticketData,
      id: `ticket_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    setSupportTickets((prev) => [newTicket, ...prev]);
    try {
      await saveTicketToFirestore(newTicket);
    } catch (err) {
      console.warn('Ticket saved locally, Firestore error:', err);
    }
  };

  const handleUpdateTicketStatus = async (
    ticketId: string,
    status: SupportTicket['status']
  ) => {
    setSupportTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status } : t))
    );
    const target = supportTickets.find((t) => t.id === ticketId);
    if (target) {
      try {
        await saveTicketToFirestore({ ...target, status });
      } catch (err) {
        console.warn('Update ticket Firestore error:', err);
      }
    }
  };

  const handleDeleteTicket = async (ticketId: string) => {
    setSupportTickets((prev) => prev.filter((t) => t.id !== ticketId));
    try {
      await deleteTicketFromFirestore(ticketId);
    } catch (err) {
      console.warn('Delete ticket Firestore error:', err);
    }
  };

  const handleReplyTicket = async (
    ticketId: string,
    replyText: string,
    agentName?: string
  ) => {
    const target = supportTickets.find((t) => t.id === ticketId);
    if (!target) return;
    const responderName = agentName || (isAuthorized ? 'عبد الرحمن' : 'فريق الدعم');
    const newReply = {
      id: `rep_${Date.now()}`,
      sender: responderName,
      text: replyText,
      createdAt: new Date().toISOString(),
      isAdmin: true,
    };
    const updatedTicket: SupportTicket = {
      ...target,
      status: 'in_progress',
      replies: [...(target.replies || []), newReply],
    };
    setSupportTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? updatedTicket : t))
    );
    try {
      await saveTicketToFirestore(updatedTicket);
    } catch (err) {
      console.warn('Reply ticket Firestore error:', err);
    }
  };

  // Open Lightbox
  const handleOpenLightbox = useCallback(
    (
      imageUrl: string,
      title: string,
      type: 'setup' | 'result',
      subtitle?: string
    ) => {
      setLightboxData({
        isOpen: true,
        imageUrl,
        title,
        type,
        subtitle,
      });
    },
    []
  );

  // Category mapping
  const categoriesList = useMemo(
    () => [
      { key: 'all', label: t.catAll },
      { key: 'بورتريه', label: t.catPortrait },
      { key: 'سينمائي', label: t.catCinematic },
      { key: 'منتجات', label: t.catProducts },
      { key: 'طبيعة', label: t.catNature },
    ],
    [t]
  );

  // Filtered posts memoized for instant lag-free rendering
  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        post.category === selectedCategory ||
        (selectedCategory === 'portrait' && post.category === 'بورتريه') ||
        (selectedCategory === 'cinematic' && post.category === 'سينمائي') ||
        (selectedCategory === 'products' && post.category === 'منتجات') ||
        (selectedCategory === 'nature' && post.category === 'طبيعة');

      const matchesSearch =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query) ||
        post.prompt.toLowerCase().includes(query) ||
        (post.lens && post.lens.toLowerCase().includes(query)) ||
        (post.lighting && post.lighting.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  const isBurgundy = theme === 'burgundy';

  return (
    <div
      id="app-root-container"
      className={`min-h-screen transition-colors duration-300 flex flex-col ${
        isBurgundy
          ? 'bg-[#2b0b14] text-[#fce7f3]'
          : 'bg-[#f8f6f0] text-[#1c1917]'
      }`}
    >
      {/* Header with Navigation, Silent Theme Switcher, Google Account Status, Language and Admin Menu */}
      {currentView !== 'start' && (
        <Header
          theme={theme}
          onToggleTheme={handleToggleTheme}
          userEmail={userEmail}
          userName={userName}
          isAuthorized={isAuthorized}
          manageMode={manageMode}
          onToggleManageMode={() => setManageMode((prev) => !prev)}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
          onOpenAdminPanel={() => setIsAdminModalOpen(true)}
          onOpenProfile={() => setCurrentView('profile')}
          onOpenAccountSelector={() => setIsAccountModalOpen(true)}
          onOpenSupportModal={() => setIsSupportModalOpen(true)}
          newTicketsCount={supportTickets.filter((t) => t.status === 'new').length}
          totalPosts={posts.length}
          currentLanguage={currentLanguage}
          onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
          t={t}
          currentView={currentView}
          onNavigateToHome={() => setCurrentView('start')}
          onNavigateToGallery={() => setCurrentView('gallery')}
          onOpenStartScreen={() => setCurrentView('start')}
          onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
          onOpenNetlifyModal={() => setIsNetlifyModalOpen(true)}
        />
      )}

      {currentView === 'start' ? (
        <StartScreen
          theme={theme}
          userEmail={userEmail}
          userName={userName}
          onEnterGallery={() => setCurrentView('gallery')}
          onEnterProfile={() => setCurrentView('profile')}
          onOpenGoogleLogin={() => setIsAccountModalOpen(true)}
          onOpenSupportModal={() => setIsSupportModalOpen(true)}
          onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
          onToggleTheme={handleToggleTheme}
          currentLanguage={currentLanguage}
          onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
          t={t}
          onOpenNetlifyModal={() => setIsNetlifyModalOpen(true)}
        />
      ) : currentView === 'profile' ? (
        <FullProfilePage
          theme={theme}
          userEmail={userEmail}
          userName={userName}
          userAvatar={
            (userEmail && allProfiles[userEmail.toLowerCase().trim()]?.avatar) ||
            `https://api.dicebear.com/7.x/bottts/svg?seed=${userEmail || 'guest'}`
          }
          allProfiles={allProfiles}
          userPosts={posts.filter(
            (p) =>
              userEmail &&
              p.authorEmail.toLowerCase().trim() === userEmail.toLowerCase().trim()
          )}
          onNavigateToGallery={() => setCurrentView('gallery')}
          onNavigateToHome={() => setCurrentView('start')}
          onOpenCreatePost={() => setIsCreateModalOpen(true)}
          onOpenAccountSelector={() => setIsAccountModalOpen(true)}
          onLogout={handleLogout}
          onUpdateProfile={handleUpdateProfile}
          onEditPost={(p) => setEditingPost(p)}
          onDeletePost={(p) => setDeletingPost(p)}
          onOpenLightbox={(img, title, type, subtitle) =>
            setLightboxData({ isOpen: true, imageUrl: img, title, type, subtitle })
          }
          t={t}
        />
      ) : (
        <>
          {/* Intro Hero Section */}
          <section className="text-center px-4 sm:px-5 pt-5 sm:pt-8 pb-3 sm:pb-5 max-w-[820px] mx-auto">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black mb-2 sm:mb-2.5 leading-tight tracking-tight">
          {t.heroTitle}
        </h1>
        <p
          className={`text-xs sm:text-sm md:text-base font-medium leading-relaxed ${
            isBurgundy ? 'text-[#fda4af]' : 'text-[#78716c]'
          }`}
        >
          {t.heroDesc}
        </p>
      </section>

      {/* Main Container Layout */}
      <main className="flex-1 w-full max-w-[1240px] xl:max-w-[1360px] mx-auto px-3 sm:px-5 md:px-6 pb-16 flex flex-col gap-5 sm:gap-7">
        {/* Search & Filter Bar */}
        <div
          id="gallery-filters-container"
          className={`p-3 sm:p-4 rounded-2xl sm:rounded-3xl border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 shadow-sm ${
            isBurgundy
              ? 'bg-[#3b101c] border-[#581827]'
              : 'bg-white border-[#e7e5e4]'
          }`}
        >
          {/* Categories Pill Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full md:w-auto pb-1 md:pb-0">
            <span
              className={`text-xs font-bold pl-2 opacity-70 shrink-0 flex items-center gap-1 ${
                isBurgundy ? 'text-[#fda4af]' : 'text-[#78716c]'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              {t.categoryLabel}:
            </span>
            {categoriesList.map((cat) => {
              const isActive = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? isBurgundy
                        ? 'bg-[#f43f5e] text-white shadow-xs'
                        : 'bg-[#6b0f24] text-white shadow-xs'
                      : isBurgundy
                      ? 'bg-[#1e070e] hover:bg-[#4a1223] text-[#fda4af]'
                      : 'bg-[#f1ede4] hover:bg-[#e7e2d7] text-[#1c1917]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search
              className={`w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 ${
                isBurgundy ? 'text-[#fda4af]' : 'text-[#78716c]'
              }`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className={`w-full pl-4 pr-10 py-2 sm:py-2.5 rounded-2xl text-xs border focus:outline-hidden transition-all ${
                isBurgundy
                  ? 'bg-[#1e070e] border-[#581827] text-[#fce7f3] focus:border-[#f43f5e]'
                  : 'bg-[#f1ede4] border-[#e7e5e4] text-[#1c1917] focus:border-[#6b0f24]'
              }`}
            />
          </div>
        </div>

        {/* Gallery Cards Container */}
        {filteredPosts.length > 0 ? (
          <div
            id="cardsContainer"
            className="flex flex-col gap-8 sm:gap-10 w-full"
          >
            {filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                theme={theme}
                isAuthorized={isAuthorized}
                manageMode={manageMode}
                onEdit={(p) => setEditingPost(p)}
                onDelete={(p) => setDeletingPost(p)}
                onOpenLightbox={handleOpenLightbox}
                t={t}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div
            id="emptyState"
            className={`p-12 text-center rounded-3xl border flex flex-col items-center justify-center ${
              isBurgundy
                ? 'bg-[#3b101c] border-[#581827] text-[#fda4af]'
                : 'bg-white border-[#e7e5e4] text-[#78716c]'
            }`}
          >
            <Camera className="w-12 h-12 opacity-30 mb-3" />
            <h3 className="font-bold text-lg mb-1">{t.emptyTitle}</h3>
            <p className="text-xs opacity-80 mb-4">
              {t.emptyDesc}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className={`px-4 py-2 rounded-2xl text-xs font-bold text-white cursor-pointer ${
                  isBurgundy ? 'bg-[#f43f5e]' : 'bg-[#6b0f24]'
                }`}
              >
                {t.showAll}
              </button>
              {isAuthorized && (
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className={`px-4 py-2 rounded-2xl text-xs font-semibold border cursor-pointer ${
                    isBurgundy
                      ? 'border-[#581827] bg-[#1e070e] text-[#fce7f3]'
                      : 'border-[#e7e5e4] bg-[#f1ede4] text-[#1c1917]'
                  }`}
                >
                  {t.restoreDefaults}
                </button>
              )}
            </div>
          </div>
        )}
      </main>
        </>
      )}

      {/* Footer */}
      <footer
        className={`border-t py-6 text-center text-xs transition-colors mt-auto ${
          isBurgundy
            ? 'border-[#581827] bg-[#3b101c] text-[#fda4af]'
            : 'border-[#e7e5e4] bg-white text-[#78716c]'
        }`}
      >
        <div className="w-full max-w-[1240px] xl:max-w-[1360px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-bold">
            <span>FacePrompt</span>
            <span>•</span>
            <span>{t.footerTagline}</span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <button
              type="button"
              onClick={handleResetDefaults}
              title={t.restoreDefaults}
              className="flex items-center gap-1 hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t.restoreDefaults}</span>
            </button>
            <span>•</span>
            <span>
              {isBurgundy ? t.themeBurgundy : t.themeWhite}
            </span>
          </div>
        </div>
      </footer>

      {/* MODALS (Mounted only when active for top rendering performance and zero background overhead) */}
      {/* 1. Admin Panel Modal (لوحة الإدارة الشاملة للمشرفين فقط) */}
      {isAdminModalOpen && (
        <AdminPanelModal
          isOpen={isAdminModalOpen}
          theme={theme}
          posts={posts}
          manageMode={manageMode}
          onToggleManageMode={() => setManageMode((prev) => !prev)}
          onOpenCreate={() => setIsCreateModalOpen(true)}
          onEditPost={(p) => setEditingPost(p)}
          onDeletePost={(p) => setDeletingPost(p)}
          onClose={() => setIsAdminModalOpen(false)}
        />
      )}

      {/* 2. Profile Modal (الملف الشخصي) */}
      {isProfileModalOpen && (
        <ProfileModal
          isOpen={isProfileModalOpen}
          theme={theme}
          userEmail={userEmail || ''}
          userName={userName}
          userAvatar={`https://api.dicebear.com/7.x/bottts/svg?seed=${userEmail || 'guest'}`}
          onUpdateName={(name) => setUserName(name)}
          onSwitchAccount={() => setIsAccountModalOpen(true)}
          onLogout={handleLogout}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}

      {/* 3. Create Post Modal (+ إضافة جلسة جديدة) */}
      {isCreateModalOpen && (
        <CreatePostModal
          isOpen={isCreateModalOpen}
          theme={theme}
          userEmail={userEmail || 'admin'}
          onAdd={handleAddPost}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}

      {/* 4. Edit Post Modal (تعديل الجلسة بجميع محتوياتها) */}
      {editingPost && (
        <EditPostModal
          isOpen={!!editingPost}
          theme={theme}
          post={editingPost}
          onSave={handleSaveEdit}
          onClose={() => setEditingPost(null)}
        />
      )}

      {/* 5. Custom Confirm Delete Modal (رسالة تأكيد الحذف المصممة بهوية الموقع) */}
      {deletingPost && (
        <CustomConfirmModal
          isOpen={!!deletingPost}
          theme={theme}
          postTitle={deletingPost?.title || ''}
          postImage={deletingPost?.resultImage || deletingPost?.setupImage}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingPost(null)}
        />
      )}

      {/* 6. Google Login Modal (تسجيل دخول آمن وخاص بدون كشف أي حسابات أدمن) */}
      {isAccountModalOpen && (
        <GoogleLoginModal
          isOpen={isAccountModalOpen}
          theme={theme}
          currentEmail={userEmail}
          onLogin={handleLogin}
          onLogout={handleLogout}
          onClose={() => setIsAccountModalOpen(false)}
        />
      )}

      {/* 7. Image Lightbox Modal */}
      {lightboxData.isOpen && (
        <ImageLightboxModal
          isOpen={lightboxData.isOpen}
          theme={theme}
          imageUrl={lightboxData.imageUrl}
          title={lightboxData.title}
          type={lightboxData.type}
          subtitle={lightboxData.subtitle}
          onClose={() => setLightboxData((prev) => ({ ...prev, isOpen: false }))}
        />
      )}

      {/* 8. Custom Designed Language Selection Modal (25 Languages) */}
      {isLanguageModalOpen && (
        <LanguageModal
          isOpen={isLanguageModalOpen}
          onClose={() => setIsLanguageModalOpen(false)}
          currentLanguage={currentLanguage}
          onSelectLanguage={(langCode) => setCurrentLanguage(langCode)}
          theme={theme}
        />
      )}

      {/* 9. Customer Support & Help Desk Modal (خدمة العملاء والدعم الفني المربوطة بحسابات الأدمن) */}
      {isSupportModalOpen && (
        <CustomerSupportModal
          isOpen={isSupportModalOpen}
          onClose={() => setIsSupportModalOpen(false)}
          theme={theme}
          userEmail={userEmail}
          userName={userName}
          tickets={supportTickets}
          onSubmitTicket={handleSubmitTicket}
          onUpdateTicketStatus={handleUpdateTicketStatus}
          onDeleteTicket={handleDeleteTicket}
          onReplyTicket={handleReplyTicket}
        />
      )}

      {/* 10. AI Intelligent Assistant Modal (مساعد الذكاء الاصطناعي الخارق لـ FacePrompt - بروتو) */}
      {isAiAssistantOpen && (
        <AiAssistantModal
          isOpen={isAiAssistantOpen}
          theme={theme}
          onClose={() => setIsAiAssistantOpen(false)}
          onOpenStartScreen={() => {
            setIsAiAssistantOpen(false);
            setCurrentView('start');
          }}
          userEmail={userEmail}
          userName={userName}
          tickets={supportTickets}
          onSubmitTicket={handleSubmitTicket}
          onUpdateTicketStatus={handleUpdateTicketStatus}
        />
      )}

      {/* 10.5 Netlify Export and Save Guide Modal */}
      {isNetlifyModalOpen && (
        <NetlifyExportModal
          isOpen={isNetlifyModalOpen}
          onClose={() => setIsNetlifyModalOpen(false)}
          theme={theme}
        />
      )}

      {/* 11. Floating Luxury Customer Support Button (Positioned at right bottom to prevent overlap) */}
      <button
        type="button"
        id="floating-customer-support-btn"
        onClick={() => setIsSupportModalOpen(true)}
        title="خدمة العملاء والدعم الفني"
        className={`fixed bottom-5 right-5 z-40 h-11 sm:h-12 px-3.5 sm:px-4.5 rounded-full border shadow-2xl flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95 ${
          isBurgundy
            ? 'bg-[#1e070e] border-[#581827] text-white hover:border-[#f43f5e] shadow-rose-950/70'
            : 'bg-white border-[#e7e5e4] text-[#1c1917] hover:border-[#6b0f24] shadow-stone-400/30'
        }`}
      >
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
        <Headphones className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500 shrink-0" />
        <span className="text-xs sm:text-sm font-extrabold whitespace-nowrap">
          خدمة العملاء
        </span>
        {supportTickets.filter((t) => t.status === 'new').length > 0 && isAuthorized && (
          <span className="w-5 h-5 rounded-full bg-amber-400 text-black font-black text-[10px] flex items-center justify-center -mr-0.5">
            {supportTickets.filter((t) => t.status === 'new').length}
          </span>
        )}
      </button>

      {/* 12. Floating Luxury Designer & AI Badge (Abdalrhmn ebdah) */}
      {currentView !== 'start' && (
        <DesignerSignatureBadge
          theme={theme}
          onOpenStartScreen={() => setCurrentView('start')}
          onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        />
      )}
    </div>
  );
}
