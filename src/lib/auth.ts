// Authentication utilities for Lost and Found system
import { User, LoginFormData, RegisterFormData, AuthResponse } from '@/types';
import { db } from './database';

// Mock JWT token generation
const generateToken = (userId: string): string => {
  // In a real app, use proper JWT library
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ 
    userId, 
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  }));
  const signature = btoa(`${header}.${payload}.mock-signature`);
  return `${header}.${payload}.${signature}`;
};

// Mock password hashing (in real app, use bcrypt)
const hashPassword = (password: string): string => {
  // Simple mock hash - DO NOT use in production
  return btoa(password + 'salt');
};

const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash;
};

// Auth service
export const authService = {
  // User registration
  register: async (formData: RegisterFormData): Promise<AuthResponse> => {
    // Validate form data
    if (formData.password !== formData.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    if (formData.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Check if user already exists
    const existingUser = db.users.findByEmail(formData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create new user
    const userData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      passwordHash: hashPassword(formData.password),
      preferences: {
        emailNotifications: true,
        smsNotifications: false,
        weeklyDigest: true
      },
      role: 'user' as const,
      avatar: `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/63dbff04-d6a9-48e7-a71f-41406f4a2c44.png}`
    };

    const user = db.users.create(userData);
    const token = generateToken(user.id);

    // Remove password hash from response
    const { passwordHash, ...userWithoutPassword } = user as any;

    return {
      user: userWithoutPassword,
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
  },

  // User login
  login: async (formData: LoginFormData): Promise<AuthResponse> => {
    const user = db.users.findByEmail(formData.email) as any;
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (!verifyPassword(formData.password, user.passwordHash)) {
      throw new Error('Invalid email or password');
    }

    // Update last active
    db.users.update(user.id, { lastActive: new Date().toISOString() });

    const token = generateToken(user.id);
    
    // Remove password hash from response
    const { passwordHash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
  },

  // Verify token and get user
  verifyToken: async (token: string): Promise<User | null> => {
    try {
      // Simple token verification (in real app, use proper JWT verification)
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const payload = JSON.parse(atob(parts[1]));
      const now = Math.floor(Date.now() / 1000);
      
      if (payload.exp < now) {
        return null; // Token expired
      }

      const user = db.users.findById(payload.userId);
      if (!user) return null;

      // Remove password hash if it exists
      const { passwordHash, ...userWithoutPassword } = user as any;
      return userWithoutPassword;
    } catch (error) {
      return null;
    }
  },

  // Get current user from storage
  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const userData = localStorage.getItem('currentUser');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  },

  // Set current user in storage
  setCurrentUser: (user: User | null): void => {
    if (typeof window === 'undefined') return;
    
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  },

  // Get auth token from storage
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken');
  },

  // Set auth token in storage
  setToken: (token: string | null): void => {
    if (typeof window === 'undefined') return;
    
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  },

  // Logout
  logout: (): void => {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!authService.getCurrentUser() && !!authService.getToken();
  },

  // Check if user is admin
  isAdmin: (): boolean => {
    const user = authService.getCurrentUser();
    return user?.role === 'admin';
  }
};

// Auth context hook data
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (formData: LoginFormData) => Promise<void>;
  register: (formData: RegisterFormData) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

// Mock demo users for easy testing
export const DEMO_USERS = {
  user: {
    email: 'user@demo.com',
    password: 'password123'
  },
  admin: {
    email: 'admin@lostandfound.com',
    password: 'admin123'
  }
};

// Initialize demo users in database if they don't exist
export const initializeDemoUsers = () => {
  // Add demo user if not exists
  if (!db.users.findByEmail(DEMO_USERS.user.email)) {
    const userData = {
      name: 'Demo User',
      email: DEMO_USERS.user.email,
      passwordHash: hashPassword(DEMO_USERS.user.password),
      preferences: {
        emailNotifications: true,
        smsNotifications: false,
        weeklyDigest: true
      },
      role: 'user' as const,
      avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/b9e87578-ccfc-4026-9bae-dd785fd53d22.png'
    };
    db.users.create(userData);
  }

  // Add demo admin if not exists
  if (!db.users.findByEmail(DEMO_USERS.admin.email)) {
    const adminData = {
      name: 'Demo Admin',
      email: DEMO_USERS.admin.email,
      passwordHash: hashPassword(DEMO_USERS.admin.password),
      preferences: {
        emailNotifications: true,
        smsNotifications: true,
        weeklyDigest: true
      },
      role: 'admin' as const,
      avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/f6af1665-8d28-4444-81b5-0921beecd8eb.png'
    };
    db.users.create(adminData);
  }
};