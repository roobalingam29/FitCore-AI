import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (role: UserRole, email?: string) => Promise<void>;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
}

const defaultUserMap: Record<UserRole, User> = {
  admin: {
    id: 'u-admin',
    name: 'Alexander Stone (Admin)',
    email: 'admin@fitcore.ai',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    phone: '+1 (800) 555-0199',
  },
  trainer: {
    id: 't1',
    name: 'Marcus Vance (Coach)',
    email: 'marcus.v@fitcore.ai',
    role: 'trainer',
    avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=150',
    phone: '+1 (555) 111-2222',
  },
  member: {
    id: 'm1',
    name: 'Sarah Jenkins (VIP Member)',
    email: 'sarah.j@example.com',
    role: 'member',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    phone: '+1 (555) 234-5678',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('fitcore_user');
    return saved ? JSON.parse(saved) : defaultUserMap.admin;
  });

  const [role, setRole] = useState<UserRole>(user?.role || 'admin');

  useEffect(() => {
    if (user) {
      localStorage.setItem('fitcore_user', JSON.stringify(user));
      setRole(user.role);
    } else {
      localStorage.removeItem('fitcore_user');
    }
  }, [user]);

  const login = async (selectedRole: UserRole, email?: string) => {
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: selectedRole, email }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setRole(data.user.role);
      } else {
        const fallback = defaultUserMap[selectedRole];
        setUser(fallback);
        setRole(selectedRole);
      }
    } catch {
      const fallback = defaultUserMap[selectedRole];
      setUser(fallback);
      setRole(selectedRole);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    const updated = defaultUserMap[newRole];
    setUser(updated);
    setRole(newRole);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
