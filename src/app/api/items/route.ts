import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { SearchFilters, ItemFormData, Item } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse search filters from query parameters
    const filters: SearchFilters = {
      query: searchParams.get('q') || undefined,
      category: (searchParams.get('category') as any) || undefined,
      type: (searchParams.get('type') as 'lost' | 'found' | 'all') || 'all',
      sortBy: (searchParams.get('sortBy') as any) || 'relevance',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
      hasReward: searchParams.get('hasReward') === 'true',
    };

    // Parse date range if provided
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    if (startDate && endDate) {
      filters.dateRange = { start: startDate, end: endDate };
    }

    // Parse location filter if provided
    const location = searchParams.get('location');
    const radius = searchParams.get('radius');
    if (location) {
      filters.location = {
        name: location,
        radius: radius ? parseInt(radius) : 10
      };
    }

    // Get search results
    const searchResult = db.items.search(filters);
    
    return NextResponse.json({
      success: true,
      data: searchResult
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch items'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const formData: ItemFormData = body;

    // Validate required fields
    if (!formData.title || !formData.description || !formData.category || !formData.location) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: title, description, category, location'
      }, { status: 400 });
    }

    // Get user info from headers (in a real app, this would come from JWT token)
    const userId = request.headers.get('X-User-Id') || '1'; // Default to user 1 for demo
    const user = db.users.findById(userId);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 401 });
    }

    // Determine item type from URL or body
    const { searchParams } = new URL(request.url);
    const itemType = (searchParams.get('type') as 'lost' | 'found') || 
                     (body.type as 'lost' | 'found') || 'lost';

    // Process image URLs (in a real app, these would be uploaded files)
    const imageUrls: string[] = [];
    // For now, we'll use a placeholder image
    
    // Create new item
    const newItem: Omit<Item, 'id' | 'views' | 'createdAt' | 'updatedAt'> = {
      type: itemType,
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      tags: formData.tags.filter(tag => tag.trim().length > 0),
      location: {
        name: formData.location.trim(),
        coordinates: undefined // In a real app, geocode the location
      },
      dateReported: new Date().toISOString(),
      dateOccurred: formData.dateOccurred || new Date().toISOString(),
      images: [
        `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/2e358bf0-194f-42e4-b13e-5a1cde26498e.png`
      ],
      userId: user.id,
      userName: user.name,
      userContact: {
        email: user.email,
        phone: user.phone,
        preferredMethod: formData.contactMethod || 'email'
      },
      status: 'active',
      featured: false,
      reward: formData.reward && formData.reward.amount && formData.reward.amount > 0 ? {
        amount: formData.reward.amount,
        currency: 'USD',
        description: formData.reward.description || `Reward for ${itemType} ${formData.category}`
      } : undefined
    };

    const createdItem = db.items.create(newItem);
    
    return NextResponse.json({
      success: true,
      data: createdItem,
      message: `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} item reported successfully`
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create item'
    }, { status: 500 });
  }
}



