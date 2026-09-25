import { Profile, UserRole } from './database';

export interface AuthState {
  user: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (email: string, role?: UserRole) => Promise<boolean>;
  register: (data: { full_name: string; email: string; phone: string; role?: UserRole }) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
}
