// Mock database implementation for Lost and Found system
import { Item, User, ItemMatch, SearchFilters, SearchResult, ITEM_CATEGORIES, ItemCategory } from '@/types';

// Mock data storage
let users: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1-555-0123',
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/95be494b-aff4-42ee-9cb5-ce5c7c43ff9a.png',
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      weeklyDigest: true
    },
    role: 'user',
    createdAt: '2024-01-15T10:00:00Z',
    lastActive: '2024-01-20T15:30:00Z'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+1-555-0456',
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/f381780d-93bf-4048-8d79-3c6b08d024cd.png',
    preferences: {
      emailNotifications: true,
      smsNotifications: true,
      weeklyDigest: false
    },
    role: 'user',
    createdAt: '2024-01-10T08:00:00Z',
    lastActive: '2024-01-20T12:00:00Z'
  },
  {
    id: 'admin',
    name: 'Admin User',
    email: 'admin@lostandfound.com',
    preferences: {
      emailNotifications: true,
      smsNotifications: true,
      weeklyDigest: true
    },
    role: 'admin',
    createdAt: '2023-12-01T00:00:00Z',
    lastActive: '2024-01-20T16:00:00Z'
  }
];

let items: Item[] = [
  {
    id: '1',
    type: 'lost',
    title: 'iPhone 15 Pro in Blue Case',
    description: 'Lost my iPhone 15 Pro with a distinctive blue leather case near the university library. The phone has a small crack on the top-right corner of the screen. Contains important work contacts and family photos. Last seen around 3 PM on January 18th.',
    category: 'electronics',
    tags: ['iphone', 'blue case', 'cracked screen', 'leather case'],
    location: {
      name: 'University Library, Downtown Campus',
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    dateReported: '2024-01-18T20:00:00Z',
    dateOccurred: '2024-01-18T15:00:00Z',
    images: [
      'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/8fd865f1-45db-42f6-b520-f0b4dff5c984.png',
      'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/5d130482-c7dd-4338-a16c-909518403762.png',
      'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/d61e4348-9f3b-48fa-9c0a-bd705b951ea8.png'
    ],
    userId: '1',
    userName: 'John Smith',
    userContact: {
      email: 'john.smith@email.com',
      phone: '+1-555-0123',
      preferredMethod: 'email'
    },
    status: 'active',
    views: 45,
    featured: true,
    reward: {
      amount: 100,
      currency: 'USD',
      description: 'Reward for safe return of phone and data'
    },
    createdAt: '2024-01-18T20:00:00Z',
    updatedAt: '2024-01-19T10:00:00Z'
  },
  {
    id: '2',
    type: 'found',
    title: 'Black Leather Wallet with Credit Cards',
    description: 'Found a black leather wallet on the sidewalk near Central Park entrance. Contains multiple credit cards, driver license, and some cash. No ID visible from outside. Wallet appears to be in good condition with minimal wear.',
    category: 'bags',
    tags: ['wallet', 'black leather', 'credit cards', 'central park'],
    location: {
      name: 'Central Park East Entrance, 5th Avenue',
      coordinates: { lat: 40.7829, lng: -73.9654 }
    },
    dateReported: '2024-01-19T09:30:00Z',
    dateOccurred: '2024-01-19T08:00:00Z',
    images: [
      'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/435cd947-f223-426d-9a35-59df2089f5bc.png',
      'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/d7387ace-9d1a-413a-9599-35a40357f11e.png'
    ],
    userId: '2',
    userName: 'Sarah Johnson',
    userContact: {
      email: 'sarah.j@email.com',
      phone: '+1-555-0456',
      preferredMethod: 'phone'
    },
    status: 'active',
    views: 32,
    featured: false,
    createdAt: '2024-01-19T09:30:00Z',
    updatedAt: '2024-01-19T09:30:00Z'
  },
  {
    id: '3',
    type: 'lost',
    title: 'Golden Retriever - Max',
    description: 'Our beloved golden retriever Max went missing from Riverside Park during his evening walk. He is 3 years old, weighs about 65 pounds, and is very friendly. Wearing a red collar with ID tags. Responds to his name and loves treats. May have wandered toward the waterfront area.',
    category: 'pets',
    tags: ['golden retriever', 'max', 'red collar', 'friendly', 'riverside park'],
    location: {
      name: 'Riverside Park, Upper West Side',
      coordinates: { lat: 40.7959, lng: -73.9711 }
    },
    dateReported: '2024-01-17T22:00:00Z',
    dateOccurred: '2024-01-17T19:30:00Z',
    images: [
      'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/5732ed18-cf35-4f22-a2b8-21d81b64b15b.png',
      'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/eb5d1352-447d-4c03-afe7-8fa0a1e49c7b.png',
      'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/a7357caa-6522-426f-9841-01517bb3da37.png'
    ],
    userId: '1',
    userName: 'John Smith',
    userContact: {
      email: 'john.smith@email.com',
      phone: '+1-555-0123',
      preferredMethod: 'phone'
    },
    status: 'active',
    views: 89,
    featured: true,
    reward: {
      amount: 500,
      currency: 'USD',
      description: 'Generous reward for safe return of our family dog'
    },
    createdAt: '2024-01-17T22:00:00Z',
    updatedAt: '2024-01-18T08:00:00Z'
  },
  {
    id: '4',
    type: 'found',
    title: 'Set of House Keys with Cartoon Keychain',
    description: 'Found a set of house keys (appears to be 3-4 keys) with a small cartoon character keychain attached. Keys were found on a bench at Madison Square Park. The keychain looks like a small blue and white cartoon character, possibly from an anime or game.',
    category: 'keys',
    tags: ['house keys', 'cartoon keychain', 'madison square park', 'blue white'],
    location: {
      name: 'Madison Square Park, Flatiron District',
      coordinates: { lat: 40.7414, lng: -73.9882 }
    },
    dateReported: '2024-01-20T14:15:00Z',
    dateOccurred: '2024-01-20T13:00:00Z',
    images: [
      'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/5600e45c-a30c-444b-9bc4-c08867d3f1b9.png',
      'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/115b653c-d53f-4996-a3e9-43c0d3137a0c.png'
    ],
    userId: '2',
    userName: 'Sarah Johnson',
    userContact: {
      email: 'sarah.j@email.com',
      phone: '+1-555-0456',
      preferredMethod: 'email'
    },
    status: 'active',
    views: 15,
    featured: false,
    createdAt: '2024-01-20T14:15:00Z',
    updatedAt: '2024-01-20T14:15:00Z'
  }
];

let matches: ItemMatch[] = [];

// Database operations
export const db = {
  // User operations
  users: {
    findById: (id: string): User | null => {
      return users.find(user => user.id === id) || null;
    },
    
    findByEmail: (email: string): User | null => {
      return users.find(user => user.email === email) || null;
    },
    
    create: (userData: Omit<User, 'id' | 'createdAt' | 'lastActive'>): User => {
      const user: User = {
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString()
      };
      users.push(user);
      return user;
    },
    
    update: (id: string, updates: Partial<User>): User | null => {
      const index = users.findIndex(user => user.id === id);
      if (index === -1) return null;
      
      users[index] = { ...users[index], ...updates, lastActive: new Date().toISOString() };
      return users[index];
    },
    
    getAll: (): User[] => users
  },

  // Item operations
  items: {
    findById: (id: string): Item | null => {
      return items.find(item => item.id === id) || null;
    },
    
    findByUserId: (userId: string): Item[] => {
      return items.filter(item => item.userId === userId);
    },
    
    search: (filters: SearchFilters): SearchResult => {
      let filteredItems = [...items];
      
      // Text search
      if (filters.query) {
        const query = filters.query.toLowerCase();
        filteredItems = filteredItems.filter(item =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }
      
      // Category filter
      if (filters.category) {
        filteredItems = filteredItems.filter(item => item.category === filters.category);
      }
      
      // Type filter
      if (filters.type && filters.type !== 'all') {
        filteredItems = filteredItems.filter(item => item.type === filters.type);
      }
      
      // Date range filter
      if (filters.dateRange) {
        filteredItems = filteredItems.filter(item => {
          const itemDate = new Date(item.dateOccurred);
          const startDate = new Date(filters.dateRange!.start);
          const endDate = new Date(filters.dateRange!.end);
          return itemDate >= startDate && itemDate <= endDate;
        });
      }
      
      // Reward filter
      if (filters.hasReward) {
        filteredItems = filteredItems.filter(item => item.reward && item.reward.amount > 0);
      }
      
      // Sorting
      if (filters.sortBy) {
        filteredItems.sort((a, b) => {
          let aValue: any, bValue: any;
          
          switch (filters.sortBy) {
            case 'date':
              aValue = new Date(a.dateOccurred);
              bValue = new Date(b.dateOccurred);
              break;
            case 'views':
              aValue = a.views;
              bValue = b.views;
              break;
            case 'relevance':
            default:
              // Simple relevance: featured items first, then by views
              aValue = a.featured ? 1000 + a.views : a.views;
              bValue = b.featured ? 1000 + b.views : b.views;
              break;
          }
          
          const order = filters.sortOrder === 'asc' ? 1 : -1;
          return aValue > bValue ? order : aValue < bValue ? -order : 0;
        });
      }
      
      // Pagination (simple implementation)
      const page = 1; // For now, return all results
      const totalPages = 1;
      
      return {
        items: filteredItems,
        total: filteredItems.length,
        page,
        totalPages,
        filters
      };
    },
    
    create: (itemData: Omit<Item, 'id' | 'views' | 'createdAt' | 'updatedAt'>): Item => {
      const item: Item = {
        ...itemData,
        id: Date.now().toString(),
        views: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      items.push(item);
      return item;
    },
    
    update: (id: string, updates: Partial<Item>): Item | null => {
      const index = items.findIndex(item => item.id === id);
      if (index === -1) return null;
      
      items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
      return items[index];
    },
    
    incrementViews: (id: string): void => {
      const item = items.find(item => item.id === id);
      if (item) {
        item.views++;
        item.updatedAt = new Date().toISOString();
      }
    },
    
    getAll: (): Item[] => items,
    
    getRecent: (limit: number = 10): Item[] => {
      return items
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit);
    },
    
    getFeatured: (): Item[] => {
      return items.filter(item => item.featured);
    }
  },

  // Match operations
  matches: {
    findByItemId: (itemId: string): ItemMatch[] => {
      return matches.filter(match => 
        match.lostItemId === itemId || match.foundItemId === itemId
      );
    },
    
    create: (matchData: Omit<ItemMatch, 'id' | 'createdAt' | 'lastUpdated'>): ItemMatch => {
      const match: ItemMatch = {
        ...matchData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
      matches.push(match);
      return match;
    },
    
    updateStatus: (id: string, status: ItemMatch['status'], notes?: string): ItemMatch | null => {
      const index = matches.findIndex(match => match.id === id);
      if (index === -1) return null;
      
      matches[index] = {
        ...matches[index],
        status,
        notes: notes || matches[index].notes,
        lastUpdated: new Date().toISOString()
      };
      return matches[index];
    },
    
    getAll: (): ItemMatch[] => matches
  },

  // Statistics
  stats: {
    getOverview: () => ({
      totalItems: items.length,
      totalUsers: users.length,
      totalMatches: matches.length,
      recentActivity: {
        newItems: items.filter(item => 
          new Date(item.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ).length,
        newUsers: users.filter(user => 
          new Date(user.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ).length,
        newMatches: matches.filter(match => 
          new Date(match.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ).length,
        period: '7 days'
      },
      categoryBreakdown: Object.keys(ITEM_CATEGORIES).reduce((acc, category) => {
        acc[category as ItemCategory] = items.filter(item => item.category === category).length;
        return acc;
      }, {} as Record<ItemCategory, number>)
    })
  }
};

// Utility function to reset data (for testing)
export const resetDatabase = () => {
  items.length = 0;
  users.length = 0;
  matches.length = 0;
};