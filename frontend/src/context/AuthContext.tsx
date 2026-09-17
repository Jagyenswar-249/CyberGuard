import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'SOC Analyst' | 'SOC Lead' | 'SecOps Engineer';
  token?: string;
  department?: string;
  plan?: 'Community' | 'SOC Pro' | 'Enterprise';
  location?: string;
  clearanceLevel?: string;
  twoFactorEnabled?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, role?: 'SOC Analyst' | 'SOC Lead') => Promise<void>;
  signup: (name: string, email: string, role?: 'SOC Analyst' | 'SOC Lead') => Promise<void>;
  updateProfile: (updated: Partial<User>) => void;
  setPlan: (plan: 'Community' | 'SOC Pro' | 'Enterprise') => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('cyberguard_user');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('cyberguard_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('cyberguard_user');
    }
  }, [user]);

  const login = async (email: string, role: 'SOC Analyst' | 'SOC Lead' = 'SOC Analyst') => {
    // Simulated fast authentication
    const newUser: User = {
      id: `usr-${Math.floor(1000 + Math.random() * 9000)}`,
      name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      role,
      department: role === 'SOC Lead' ? 'Security Operations Command' : 'Threat Intelligence & Detection',
      plan: 'SOC Pro',
      location: 'HQ Security Ops Center (Sector 4)',
      clearanceLevel: role === 'SOC Lead' ? 'Level 4 (SOC Lead Approver)' : 'Level 3 (Tier-2 SOC Responder)',
      twoFactorEnabled: true,
      token: `jwt-bearer-${Date.now()}`
    };
    setUser(newUser);
  };

  const signup = async (name: string, email: string, role: 'SOC Analyst' | 'SOC Lead' = 'SOC Analyst') => {
    const newUser: User = {
      id: `usr-${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      email,
      role,
      department: 'Threat Operations',
      plan: 'SOC Pro',
      location: 'Remote SOC Node',
      clearanceLevel: 'Level 2 (Analyst Initiate)',
      twoFactorEnabled: true,
      token: `jwt-bearer-${Date.now()}`
    };
    setUser(newUser);
  };

  const updateProfile = (updated: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updated });
    }
  };

  const setPlan = (plan: 'Community' | 'SOC Pro' | 'Enterprise') => {
    if (user) {
      setUser({ ...user, plan });
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        updateProfile,
        setPlan,
        logout,
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

