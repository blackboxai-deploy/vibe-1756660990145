// Core type definitions for Lost and Found system

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    weeklyDigest: boolean;
  };
  role: 'user' | 'admin';
  createdAt: string;
  lastActive: string;
}

export interface Item {
  id: string;
  type: 'lost' | 'found';
  title: string;
  description: string;
  category: ItemCategory;
  tags: string[];
  location: {
    name: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    radius?: number; // in kilometers
  };
  dateReported: string;
  dateOccurred: string;
  images: string[];
  userId: string;
  userName: string;
  userContact: {
    email: string;
    phone?: string;
    preferredMethod: 'email' | 'phone';
  };
  status: ItemStatus;
  views: number;
  featured: boolean;
  reward?: {
    amount: number;
    currency: string;
    description: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ItemMatch {
  id: string;
  lostItemId: string;
  foundItemId: string;
  similarity: number; // 0-1 confidence score
  matchedFields: string[]; // which fields contributed to the match
  status: 'pending' | 'confirmed' | 'rejected' | 'contacted';
  createdAt: string;
  lastUpdated: string;
  notes?: string;
}

export interface SearchFilters {
  query?: string;
  category?: ItemCategory;
  location?: {
    name: string;
    radius: number;
  };
  dateRange?: {
    start: string;
    end: string;
  };
  type?: 'lost' | 'found' | 'all';
  hasReward?: boolean;
  sortBy?: 'relevance' | 'date' | 'location' | 'views';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchResult {
  items: Item[];
  total: number;
  page: number;
  totalPages: number;
  filters: SearchFilters;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'match' | 'message' | 'status_update' | 'system';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  itemId: string;
  fromUserId: string;
  toUserId: string;
  subject: string;
  message: string;
  contactInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  status: 'sent' | 'read' | 'replied';
  createdAt: string;
}

export interface AdminStats {
  totalItems: number;
  totalUsers: number;
  totalMatches: number;
  recentActivity: {
    newItems: number;
    newUsers: number;
    newMatches: number;
    period: string;
  };
  categoryBreakdown: Record<ItemCategory, number>;
  locationStats: Array<{
    location: string;
    count: number;
  }>;
}

// Enums and literal types
export type ItemCategory = 
  | 'electronics'
  | 'jewelry'
  | 'clothing'
  | 'bags'
  | 'documents'
  | 'keys'
  | 'pets'
  | 'vehicles'
  | 'sports'
  | 'books'
  | 'toys'
  | 'other';

export type ItemStatus = 
  | 'active'
  | 'matched'
  | 'resolved'
  | 'expired'
  | 'removed';

export const ITEM_CATEGORIES: Record<ItemCategory, string> = {
  electronics: 'Electronics',
  jewelry: 'Jewelry & Accessories',
  clothing: 'Clothing & Shoes',
  bags: 'Bags & Wallets',
  documents: 'Documents & Cards',
  keys: 'Keys',
  pets: 'Pets',
  vehicles: 'Vehicles',
  sports: 'Sports Equipment',
  books: 'Books & Media',
  toys: 'Toys & Games',
  other: 'Other Items'
};

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresAt: string;
}

// Form types
export interface ItemFormData {
  title: string;
  description: string;
  category: ItemCategory;
  tags: string[];
  location: string;
  dateOccurred: string;
  images: File[];
  contactMethod: 'email' | 'phone';
  phone?: string;
  reward?: {
    amount?: number;
    description?: string;
  };
}

export interface UserFormData {
  name: string;
  email: string;
  phone?: string;
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    weeklyDigest: boolean;
  };
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  agreeToTerms: boolean;
}