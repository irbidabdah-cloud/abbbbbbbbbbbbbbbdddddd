import {
  UserProfile,
  ADMIN_EMAILS,
  ADMIN_USERNAME,
  checkIsAuthorized,
} from '../types';
import {
  db,
  uploadImageToStorage,
} from './firebase';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
} from 'firebase/firestore';

const PROFILES_COLLECTION = 'faceprompt_profiles';
const STORAGE_KEY_PROFILES_CACHE = 'faceprompt_profiles_cache';

/**
 * Check if an email is one of the 5 administrator accounts.
 */
export function isPlatformAdmin(email: string | null | undefined): boolean {
  return checkIsAuthorized(email);
}

/**
 * Generate a random unique username with English letters, underscore, and at least 3 digits.
 * E.g., 'creator_482', 'studio_917', 'artist_305'
 */
export function generateRandomUsername(existingUsernames: Set<string>): string {
  const prefixes = ['creator', 'studio', 'artist', 'prompt', 'visual', 'lens', 'story', 'camera', 'photo'];
  for (let i = 0; i < 200; i++) {
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const num = Math.floor(100 + Math.random() * 900); // 3 digits between 100 and 999
    const candidate = `${prefix}_${num}`;
    if (!existingUsernames.has(candidate.toLowerCase()) && candidate.toLowerCase() !== ADMIN_USERNAME) {
      return candidate;
    }
  }
  // Fallback with timestamp 4 digits
  return `creator_${Date.now().toString().slice(-4)}`;
}

export interface UsernameValidationResult {
  isValid: boolean;
  error?: string;
  hasAllowedChars: boolean;
  hasThreeDigits: boolean;
  isLengthValid: boolean;
  isAvailable: boolean;
}

/**
 * Validates a username according to platform rules:
 * - 5 Admin accounts share the unique 'admin' username.
 * - Non-admin accounts CANNOT use 'admin'.
 * - Must contain ONLY English letters (a-z, A-Z), numbers (0-9), dot (.), and underscore (_).
 * - Must contain at least 3 digits (e.g. 123, 789).
 * - Must be unique across all users (case-insensitive).
 */
export function validateUsername(
  candidate: string,
  userEmail: string | null | undefined,
  allProfiles: Record<string, UserProfile>
): UsernameValidationResult {
  const trimmed = (candidate || '').trim();
  const isAdmin = isPlatformAdmin(userEmail);
  const normalizedCandidate = trimmed.toLowerCase();

  // If user is admin and wants 'admin'
  if (isAdmin && normalizedCandidate === ADMIN_USERNAME) {
    return {
      isValid: true,
      hasAllowedChars: true,
      hasThreeDigits: true,
      isLengthValid: true,
      isAvailable: true,
    };
  }

  // If regular user tries to take 'admin'
  if (!isAdmin && normalizedCandidate === ADMIN_USERNAME) {
    return {
      isValid: false,
      error: 'اسم المستخدم "admin" محجوز حصرياً لحسابات إدارة المنصة',
      hasAllowedChars: true,
      hasThreeDigits: false,
      isLengthValid: true,
      isAvailable: false,
    };
  }

  // Check allowed characters: ONLY English letters, digits, '.', and '_'
  // Strict regex: forbidden everything else (spaces, Arabic letters, dashes, symbols)
  const allowedCharsRegex = /^[a-zA-Z0-9._]+$/;
  const hasAllowedChars = allowedCharsRegex.test(trimmed);

  // Check at least 3 digits
  const digitMatches = trimmed.match(/[0-9]/g);
  const digitCount = digitMatches ? digitMatches.length : 0;
  const hasThreeDigits = digitCount >= 3;

  // Length check (between 4 and 25 characters)
  const isLengthValid = trimmed.length >= 4 && trimmed.length <= 25;

  // Uniqueness check: no other user can have this username
  let isAvailable = true;
  const normalizedUserEmail = (userEmail || '').trim().toLowerCase();

  for (const [emailKey, profile] of Object.entries(allProfiles)) {
    if (emailKey.toLowerCase() !== normalizedUserEmail) {
      if (
        profile.username &&
        profile.username.trim().toLowerCase() === normalizedCandidate
      ) {
        // If the owner of that username is an admin and the candidate is 'admin',
        // non-admins are already rejected above.
        isAvailable = false;
        break;
      }
    }
  }

  let error: string | undefined = undefined;

  if (!trimmed) {
    error = 'يرجى إدخال اسم المستخدم';
  } else if (!hasAllowedChars) {
    error = 'ممنوع استخدام أي رموز غير الأحرف الإنجليزية والأرقام والنقطة (.) والشرطة السفلية (_)';
  } else if (!hasThreeDigits) {
    error = `يجب أن يحتوي اسم المستخدم على 3 أرقام على الأقل (يحتوي حالياً على ${digitCount})`;
  } else if (!isLengthValid) {
    error = 'يجب أن يكون طول اسم المستخدم بين 4 و 25 حرفاً';
  } else if (!isAvailable) {
    error = 'اسم المستخدم هذا مستخدم مسبقاً! يرجى اختيار اسم مستخدم غير مستخدم';
  }

  const isValid = hasAllowedChars && hasThreeDigits && isLengthValid && isAvailable;

  return {
    isValid,
    error,
    hasAllowedChars,
    hasThreeDigits,
    isLengthValid,
    isAvailable,
  };
}

/**
 * Resize and compress user photo from phone or desktop to max 600x600 high quality JPEG.
 */
export async function optimizeProfilePhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
      img.src = event.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Reads local cached profiles
 */
export function getCachedProfiles(): Record<string, UserProfile> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_PROFILES_CACHE);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.warn('Error reading profiles cache:', err);
  }
  return {};
}

/**
 * Saves cached profiles
 */
export function saveCachedProfiles(profiles: Record<string, UserProfile>) {
  try {
    localStorage.setItem(STORAGE_KEY_PROFILES_CACHE, JSON.stringify(profiles));
  } catch (err) {
    console.warn('Error saving profiles cache:', err);
  }
}

/**
 * Encodes email for Firestore doc ID (replace '.' with '_')
 */
export function sanitizeEmailForDocId(email: string): string {
  return email.toLowerCase().trim().replace(/[^a-zA-Z0-9_-]/g, '_');
}

/**
 * Get or create initial profile for a user
 */
export function getOrCreateUserProfile(
  email: string,
  displayName: string,
  avatar: string,
  existingProfiles: Record<string, UserProfile>
): UserProfile {
  const normalizedEmail = email.toLowerCase().trim();
  const existing = existingProfiles[normalizedEmail];
  const isAdmin = isPlatformAdmin(normalizedEmail);

  if (existing) {
    // If it's an admin account, enforce username is 'admin'
    if (isAdmin && existing.username !== ADMIN_USERNAME) {
      return {
        ...existing,
        username: ADMIN_USERNAME,
        isAuthorized: true,
      };
    }
    return existing;
  }

  // Build existing usernames set
  const takenUsernames = new Set<string>();
  Object.values(existingProfiles).forEach((p) => {
    if (p.username) takenUsernames.add(p.username.toLowerCase());
  });

  const username = isAdmin
    ? ADMIN_USERNAME
    : generateRandomUsername(takenUsernames);

  const newProfile: UserProfile = {
    email: normalizedEmail,
    name: displayName || normalizedEmail.split('@')[0],
    username,
    avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${normalizedEmail}`,
    bio: isAdmin
      ? 'مدير معتمد لمنصة FacePrompt • استوديو ومكتبة برومبتات ستوريات 9:16'
      : 'مُنشئ ومصور ذكاء اصطناعي • مهتم بتجارب التصوير وبرومبتات الستوريات 9:16',
    isAuthorized: isAdmin,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return newProfile;
}

/**
 * Sync user profile to Firestore & local cache
 */
export async function saveProfileToFirestore(profile: UserProfile): Promise<void> {
  const normalizedEmail = profile.email.toLowerCase().trim();
  const docId = sanitizeEmailForDocId(normalizedEmail);

  // Update local cache first for instant UI response
  const currentCache = getCachedProfiles();
  currentCache[normalizedEmail] = {
    ...profile,
    updatedAt: new Date().toISOString(),
  };
  saveCachedProfiles(currentCache);

  try {
    const profileDocRef = doc(db, PROFILES_COLLECTION, docId);
    await setDoc(profileDocRef, profile, { merge: true });
  } catch (err) {
    console.warn('Firestore user profile sync warning (cached locally):', err);
  }
}

/**
 * Real-time subscription to all user profiles in Firestore
 */
export function subscribeToProfiles(
  onUpdate: (profiles: Record<string, UserProfile>) => void
) {
  try {
    const profilesCol = collection(db, PROFILES_COLLECTION);
    return onSnapshot(
      profilesCol,
      (snapshot) => {
        const cloudProfiles: Record<string, UserProfile> = {};
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as UserProfile;
          if (data && data.email) {
            cloudProfiles[data.email.toLowerCase().trim()] = data;
          }
        });

        // Merge with local cache
        const localCache = getCachedProfiles();
        const merged = { ...localCache, ...cloudProfiles };
        saveCachedProfiles(merged);
        onUpdate(merged);
      },
      (error) => {
        console.warn('Profiles onSnapshot error, falling back to cache:', error);
        onUpdate(getCachedProfiles());
      }
    );
  } catch (err) {
    console.warn('Failed to subscribe to profiles:', err);
    onUpdate(getCachedProfiles());
    return () => {};
  }
}
