import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

export type AdminRole = 'superadmin' | 'manager';

export interface AdminUser {
  email: string;
  role: AdminRole;
  token: string;
  expiresAt: number;
}

export interface AdminAuthContextType {
  adminUser: AdminUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  role: AdminRole | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; remainingAttempts?: number }>;
  logout: () => void;
  checkRole: (requiredRole?: AdminRole) => boolean;
}

export const ADMIN_STORAGE_KEY = 'ge_ind_admin_session_v1';
export const FAILED_ATTEMPTS_KEY = 'ge_ind_admin_attempts_v1';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const SESSION_DURATION_MS = 4 * 60 * 60 * 1000; // 4 hours

/**
 * Generate cryptographically secure random session token
 */
function generateSecureToken(): string {
  try {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    const hex = Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
    return `ge_sec_${Date.now()}_${hex}`;
  } catch {
    return `ge_sec_${Date.now()}_${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`;
  }
}

/**
 * Helper to verify stored admin session directly at data layer
 */
export function verifyAdminSession(): { authorized: boolean; role: AdminRole | null; user?: AdminUser; error?: string } {
  try {
    const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (!stored) {
      return { authorized: false, role: null, error: 'Authorization required. No active administrative session.' };
    }

    const session: AdminUser = JSON.parse(stored);
    if (!session || !session.token || !session.expiresAt) {
      return { authorized: false, role: null, error: 'Malformed administrative security credentials.' };
    }

    if (Date.now() > session.expiresAt) {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
      return { authorized: false, role: null, error: 'Administrative session has expired. Re-authentication required.' };
    }

    if (!session.role || !['superadmin', 'manager'].includes(session.role)) {
      return { authorized: false, role: null, error: 'Access forbidden. Account does not possess administrative clearance.' };
    }

    return { authorized: true, role: session.role, user: session };
  } catch {
    return { authorized: false, role: null, error: 'Security evaluation failed.' };
  }
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const verification = verifyAdminSession();
    return verification.authorized && verification.user ? verification.user : null;
  });

  useEffect(() => {
    if (adminUser) {
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminUser));
    } else {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
    }
  }, [adminUser]);

  // Periodic session expiration checker
  useEffect(() => {
    const interval = setInterval(() => {
      if (adminUser && Date.now() > adminUser.expiresAt) {
        console.warn('Admin session expired. Logging out.');
        setAdminUser(null);
        localStorage.removeItem(ADMIN_STORAGE_KEY);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [adminUser]);

  const login = async (
    emailInput: string,
    passwordInput: string
  ): Promise<{ success: boolean; error?: string; remainingAttempts?: number }> => {
    const email = emailInput.trim().toLowerCase();
    const password = passwordInput;

    if (!email || !password) {
      return { success: false, error: 'Both email and password are required.' };
    }

    // 1. Check rate limiting & lockout status
    let attemptsData = { count: 0, lockedUntil: 0 };
    try {
      const storedAttempts = localStorage.getItem(FAILED_ATTEMPTS_KEY);
      if (storedAttempts) {
        attemptsData = JSON.parse(storedAttempts);
      }
    } catch {
      attemptsData = { count: 0, lockedUntil: 0 };
    }

    const now = Date.now();
    if (attemptsData.lockedUntil > now) {
      const remainingMinutes = Math.ceil((attemptsData.lockedUntil - now) / 60000);
      return {
        success: false,
        error: `Portal access locked due to consecutive failed attempts. Please retry in ${remainingMinutes} minute(s).`,
      };
    }

    // 2. Authenticate against Supabase if configured with active credentials
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError || !authData.user) {
          // Failed Supabase login
          return handleFailedAttempt(attemptsData);
        }

        // Verify that the user has an administrative role in admin_users table
        const { data: roleData, error: roleError } = await supabase
          .from('admin_users')
          .select('role, is_active')
          .eq('id', authData.user.id)
          .single();

        if (roleError || !roleData || !roleData.is_active || !['superadmin', 'manager'].includes(roleData.role)) {
          // User exists but is NOT an authorized administrator
          await supabase.auth.signOut();
          return {
            success: false,
            error: 'Access Denied: This account is authenticated but does not possess administrator clearance.',
          };
        }

        // Successfully authorized administrator via Supabase
        localStorage.removeItem(FAILED_ATTEMPTS_KEY);
        const session: AdminUser = {
          email: authData.user.email || email,
          role: roleData.role as AdminRole,
          token: authData.session?.access_token || generateSecureToken(),
          expiresAt: Date.now() + SESSION_DURATION_MS,
        };

        setAdminUser(session);
        return { success: true };
      } catch (err) {
        console.warn('Supabase authentication failed, evaluating fallback credentials', err);
      }
    }

    // 3. Fallback / Default Secure Factory Admin Credential
    const expectedEmail = (import.meta.env.VITE_ADMIN_DEFAULT_EMAIL || 'admin@geindustries.com').toLowerCase().trim();
    const expectedPassword = import.meta.env.VITE_ADMIN_DEFAULT_PASSWORD || 'geindustries2026';

    if (email === expectedEmail && password === expectedPassword) {
      // Clear failed attempts upon successful authentication
      localStorage.removeItem(FAILED_ATTEMPTS_KEY);

      const session: AdminUser = {
        email,
        role: 'superadmin',
        token: generateSecureToken(),
        expiresAt: Date.now() + SESSION_DURATION_MS,
      };

      setAdminUser(session);
      return { success: true };
    }

    // Secondary manager credentials (if configured)
    const managerEmail = import.meta.env.VITE_ADMIN_MANAGER_EMAIL?.toLowerCase().trim();
    const managerPassword = import.meta.env.VITE_ADMIN_MANAGER_PASSWORD;
    if (managerEmail && managerPassword && email === managerEmail && password === managerPassword) {
      localStorage.removeItem(FAILED_ATTEMPTS_KEY);

      const session: AdminUser = {
        email,
        role: 'manager',
        token: generateSecureToken(),
        expiresAt: Date.now() + SESSION_DURATION_MS,
      };

      setAdminUser(session);
      return { success: true };
    }

    // Failed attempt handler
    return handleFailedAttempt(attemptsData);
  };

  const handleFailedAttempt = (attemptsData: { count: number; lockedUntil: number }) => {
    const updatedCount = attemptsData.count + 1;
    const remaining = MAX_ATTEMPTS - updatedCount;

    if (updatedCount >= MAX_ATTEMPTS) {
      const lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
      localStorage.setItem(FAILED_ATTEMPTS_KEY, JSON.stringify({ count: updatedCount, lockedUntil }));
      return {
        success: false,
        error: `Maximum login attempts exceeded. Portal temporarily locked for 15 minutes.`,
        remainingAttempts: 0,
      };
    } else {
      localStorage.setItem(FAILED_ATTEMPTS_KEY, JSON.stringify({ count: updatedCount, lockedUntil: 0 }));
      return {
        success: false,
        error: `Invalid administrative credentials. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining before lockout.`,
        remainingAttempts: remaining,
      };
    }
  };

  const logout = () => {
    if (isSupabaseConfigured && supabase) {
      try {
        supabase.auth.signOut();
      } catch (e) {
        console.error('Supabase signOut error', e);
      }
    }
    setAdminUser(null);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
  };

  const checkRole = (requiredRole?: AdminRole): boolean => {
    if (!adminUser || Date.now() > adminUser.expiresAt) return false;
    if (!requiredRole) return ['superadmin', 'manager'].includes(adminUser.role);
    if (requiredRole === 'superadmin') return adminUser.role === 'superadmin';
    return ['superadmin', 'manager'].includes(adminUser.role);
  };

  const isSessionValid = Boolean(adminUser && adminUser.expiresAt > Date.now());

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser: isSessionValid ? adminUser : null,
        isAuthenticated: isSessionValid,
        isAdmin: isSessionValid && ['superadmin', 'manager'].includes(adminUser?.role || ('' as any)),
        role: isSessionValid ? adminUser?.role || null : null,
        login,
        logout,
        checkRole,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
