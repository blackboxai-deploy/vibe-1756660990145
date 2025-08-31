// Item matching algorithms for Lost and Found system
import { Item, ItemMatch } from '@/types';
import { db } from './database';

// Text similarity function using simple algorithm
function calculateTextSimilarity(text1: string, text2: string): number {
  const words1 = text1.toLowerCase().split(/\s+/);
  const words2 = text2.toLowerCase().split(/\s+/);
  
  const allWords = new Set([...words1, ...words2]);
  let matches = 0;
  
  for (const word of allWords) {
    if (words1.includes(word) && words2.includes(word)) {
      matches++;
    }
  }
  
  return matches / allWords.size;
}

// Calculate distance between two coordinates (simplified)
function calculateDistance(coord1: { lat: number; lng: number }, coord2: { lat: number; lng: number }): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
  const dLon = (coord2.lng - coord1.lng) * Math.PI / 180;
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Calculate similarity score between two items
function calculateItemSimilarity(lostItem: Item, foundItem: Item): { similarity: number; matchedFields: string[] } {
  let score = 0;
  let maxScore = 0;
  const matchedFields: string[] = [];

  // Category match (high weight)
  maxScore += 30;
  if (lostItem.category === foundItem.category) {
    score += 30;
    matchedFields.push('category');
  }

  // Title similarity (medium weight)
  maxScore += 25;
  const titleSimilarity = calculateTextSimilarity(lostItem.title, foundItem.title);
  score += titleSimilarity * 25;
  if (titleSimilarity > 0.3) {
    matchedFields.push('title');
  }

  // Description similarity (medium weight)
  maxScore += 25;
  const descSimilarity = calculateTextSimilarity(lostItem.description, foundItem.description);
  score += descSimilarity * 25;
  if (descSimilarity > 0.2) {
    matchedFields.push('description');
  }

  // Tags overlap (medium weight)
  maxScore += 15;
  const tagOverlap = lostItem.tags.filter(tag => 
    foundItem.tags.some(fTag => fTag.toLowerCase().includes(tag.toLowerCase()) || 
                              tag.toLowerCase().includes(fTag.toLowerCase()))
  ).length;
  const tagScore = (tagOverlap / Math.max(lostItem.tags.length, foundItem.tags.length, 1)) * 15;
  score += tagScore;
  if (tagScore > 5) {
    matchedFields.push('tags');
  }

  // Location proximity (low weight due to potential inaccuracy)
  maxScore += 5;
  if (lostItem.location.coordinates && foundItem.location.coordinates) {
    const distance = calculateDistance(lostItem.location.coordinates, foundItem.location.coordinates);
    if (distance < 5) { // Within 5km
      const locationScore = Math.max(0, (5 - distance) / 5) * 5;
      score += locationScore;
      if (locationScore > 2) {
        matchedFields.push('location');
      }
    }
  } else if (lostItem.location.name.toLowerCase().includes(foundItem.location.name.toLowerCase()) ||
             foundItem.location.name.toLowerCase().includes(lostItem.location.name.toLowerCase())) {
    score += 3;
    matchedFields.push('location');
  }

  return {
    similarity: score / maxScore,
    matchedFields
  };
}

// Find potential matches for a lost item
export function findPotentialMatches(lostItemId: string): ItemMatch[] {
  const lostItem = db.items.findById(lostItemId);
  if (!lostItem || lostItem.type !== 'lost') {
    return [];
  }

  const foundItems = db.items.getAll().filter(item => 
    item.type === 'found' && 
    item.status === 'active' &&
    item.id !== lostItemId
  );

  const matches: ItemMatch[] = [];

  for (const foundItem of foundItems) {
    const { similarity, matchedFields } = calculateItemSimilarity(lostItem, foundItem);
    
    // Only consider matches with similarity > 30%
    if (similarity > 0.3) {
      // Check if match already exists
      const existingMatches = db.matches.findByItemId(lostItemId);
      const alreadyMatched = existingMatches.some(match => 
        match.foundItemId === foundItem.id || match.lostItemId === foundItem.id
      );
      
      if (!alreadyMatched) {
        const match: ItemMatch = {
          id: `${lostItemId}-${foundItem.id}-${Date.now()}`,
          lostItemId: lostItem.id,
          foundItemId: foundItem.id,
          similarity,
          matchedFields,
          status: 'pending',
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        };
        
        matches.push(match);
      }
    }
  }

  // Sort by similarity score (highest first)
  return matches.sort((a, b) => b.similarity - a.similarity);
}

// Find potential matches for a found item
export function findPotentialMatchesForFound(foundItemId: string): ItemMatch[] {
  const foundItem = db.items.findById(foundItemId);
  if (!foundItem || foundItem.type !== 'found') {
    return [];
  }

  const lostItems = db.items.getAll().filter(item => 
    item.type === 'lost' && 
    item.status === 'active' &&
    item.id !== foundItemId
  );

  const matches: ItemMatch[] = [];

  for (const lostItem of lostItems) {
    const { similarity, matchedFields } = calculateItemSimilarity(lostItem, foundItem);
    
    if (similarity > 0.3) {
      const existingMatches = db.matches.findByItemId(foundItemId);
      const alreadyMatched = existingMatches.some(match => 
        match.foundItemId === foundItem.id || match.lostItemId === lostItem.id
      );
      
      if (!alreadyMatched) {
        const match: ItemMatch = {
          id: `${lostItem.id}-${foundItemId}-${Date.now()}`,
          lostItemId: lostItem.id,
          foundItemId: foundItem.id,
          similarity,
          matchedFields,
          status: 'pending',
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        };
        
        matches.push(match);
      }
    }
  }

  return matches.sort((a, b) => b.similarity - a.similarity);
}

// Auto-generate matches for all active items
export function generateAllMatches(): ItemMatch[] {
  const lostItems = db.items.getAll().filter(item => item.type === 'lost' && item.status === 'active');
  const allMatches: ItemMatch[] = [];

  for (const lostItem of lostItems) {
    const matches = findPotentialMatches(lostItem.id);
    // Save matches to database
    matches.forEach(match => {
      const savedMatch = db.matches.create({
        lostItemId: match.lostItemId,
        foundItemId: match.foundItemId,
        similarity: match.similarity,
        matchedFields: match.matchedFields,
        status: 'pending'
      });
      allMatches.push(savedMatch);
    });
  }

  return allMatches;
}

// Get match details with item information
export function getMatchWithDetails(matchId: string) {
  const match = db.matches.getAll().find(m => m.id === matchId);
  if (!match) return null;

  const lostItem = db.items.findById(match.lostItemId);
  const foundItem = db.items.findById(match.foundItemId);

  if (!lostItem || !foundItem) return null;

  return {
    match,
    lostItem,
    foundItem
  };
}

// Match quality assessment
export function assessMatchQuality(similarity: number): {
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  confidence: string;
  description: string;
} {
  if (similarity >= 0.8) {
    return {
      quality: 'excellent',
      confidence: '90%+',
      description: 'Very high chance this is a match. Multiple matching criteria.'
    };
  } else if (similarity >= 0.6) {
    return {
      quality: 'good',
      confidence: '70-89%',
      description: 'Good chance this is a match. Several matching criteria.'
    };
  } else if (similarity >= 0.4) {
    return {
      quality: 'fair',
      confidence: '50-69%',
      description: 'Possible match. Some matching criteria found.'
    };
  } else {
    return {
      quality: 'poor',
      confidence: '30-49%',
      description: 'Low chance of match. Few matching criteria.'
    };
  }
}

// Bulk operations
export const matchingService = {
  findMatches: findPotentialMatches,
  findMatchesForFound: findPotentialMatchesForFound,
  generateAll: generateAllMatches,
  getWithDetails: getMatchWithDetails,
  assessQuality: assessMatchQuality,
  
  // Update match status
  updateMatchStatus: (matchId: string, status: ItemMatch['status'], notes?: string) => {
    return db.matches.updateStatus(matchId, status, notes);
  },
  
  // Get matches for user's items
  getUserMatches: (userId: string): ItemMatch[] => {
    const userItems = db.items.findByUserId(userId);
    const userItemIds = userItems.map(item => item.id);
    
    return db.matches.getAll().filter(match =>
      userItemIds.includes(match.lostItemId) || userItemIds.includes(match.foundItemId)
    );
  }
};