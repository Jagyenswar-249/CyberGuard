import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'SOC Analyst' | 'SOC Lead' | 'SecOps Engineer';
  token?: string;
  department?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, role?: 'SOC Analyst' | 'SOC Lead') => Promise<void>;
  signup: (name: string, email: string, role?: 'SOC Analyst' | 'SOC Lead') => Promise<void>;
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
    // Default demo user so analysts can immediately explore the full platform
    return {
      id: 'usr-9281-a',
      name: 'Alex Vance',
      email: 'alex.vance@cyberguard.internal',
      role: 'SOC Analyst',
      department: 'Threat Response & Triage',
      token: 'jwt-mock-valid-token-tier1'
    };
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
      token: `jwt-bearer-${Date.now()}`
    };
    setUser(newUser);
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
