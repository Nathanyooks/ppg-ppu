import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, UserRole } from '../../types/database';
import { AuthContextType } from '../../types/auth';
import { INITIAL_USERS, dbStore } from '../database/supabaseClient';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('bersihin_active_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(INITIAL_USERS[0]);
        localStorage.setItem('bersihin_active_user', JSON.stringify(INITIAL_USERS[0]));
      }
    } catch {
      setUser(INITIAL_USERS[0]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, role?: UserRole): Promise<boolean> => {
    setIsLoading(true);
    try {
      const existing = dbStore.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        if (existing.role === 'SUPER_ADMIN') {
          existing.full_name = 'Munir Agus Shodikin (Master Admin)';
        }
        setUser(existing);
        localStorage.setItem('bersihin_active_user', JSON.stringify(existing));
      } else {
        const isMaster = role === 'SUPER_ADMIN' || email.toLowerCase().includes('munir') || email.toLowerCase().includes('superadmin');
        const newUser: Profile = {
          id: 'usr-' + Date.now(),
          email,
          full_name: isMaster ? 'Munir Agus Shodikin (Master Admin)' : email.split('@')[0].replace('.', ' ').toUpperCase(),
          role: role || (isMaster ? 'SUPER_ADMIN' : 'CUSTOMER'),
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setUser(newUser);
        localStorage.setItem('bersihin_active_user', JSON.stringify(newUser));
      }
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { full_name: string; email: string; phone: string; role?: UserRole }): Promise<boolean> => {
    setIsLoading(true);
    try {
      const newUser: Profile = {
        id: 'usr-' + Date.now(),
        email: data.email,
        full_name: data.full_name,
        phone: data.phone,
        role: data.role || 'CUSTOMER',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setUser(newUser);
      localStorage.setItem('bersihin_active_user', JSON.stringify(newUser));
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bersihin_active_user');
  };

  const switchRole = (newRole: UserRole) => {
    const roleUser = INITIAL_USERS.find(u => u.role === newRole) || {
      id: 'usr-' + newRole.toLowerCase(),
      email: `${newRole.toLowerCase()}@bersih.in`,
      full_name: `${newRole.replace('_', ' ')} Demo User`,
      role: newRole,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setUser(roleUser);
    localStorage.setItem('bersihin_active_user', JSON.stringify(roleUser));
  };

  const updateProfile = async (data: Partial<Profile>) => {
    if (!user) return;
    const updated = { ...user, ...data, updated_at: new Date().toISOString() };
    setUser(updated);
    localStorage.setItem('bersihin_active_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        switchRole,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
