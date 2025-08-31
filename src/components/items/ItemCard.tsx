'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Item, ITEM_CATEGORIES } from '@/types';

interface ItemCardProps {
  item: Item;
  showType?: boolean;
  className?: string;
}

export default function ItemCard({ item, showType = false, className = '' }: ItemCardProps) {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      electronics: 'bg-blue-100 text-blue-800',
      jewelry: 'bg-purple-100 text-purple-800',
      clothing: 'bg-green-100 text-green-800',
      bags: 'bg-yellow-100 text-yellow-800',
      documents: 'bg-gray-100 text-gray-800',
      keys: 'bg-orange-100 text-orange-800',
      pets: 'bg-pink-100 text-pink-800',
      vehicles: 'bg-red-100 text-red-800',
      sports: 'bg-teal-100 text-teal-800',
      books: 'bg-indigo-100 text-indigo-800',
      toys: 'bg-rose-100 text-rose-800',
      other: 'bg-slate-100 text-slate-800'
    };
    return colors[category] || colors.other;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const truncateDescription = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  };

  return (
    <Card className={`hover:shadow-lg transition-all duration-200 group ${className}`}>
      {/* Image Section */}
      <div className="aspect-video relative overflow-hidden rounded-t-lg bg-gray-100">
        <img
          src={item.images[0] || 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/3229ba6b-e544-4a60-806d-eddd3996703a.png'}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/b41c6b62-3cb2-4768-b72e-d8dd3ea99b86.png';
          }}
        />
        
        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {showType && (
            <Badge 
              className={`${
                item.type === 'lost' 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {item.type === 'lost' ? 'Lost' : 'Found'}
            </Badge>
          )}
          {item.featured && (
            <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">
              Featured
            </Badge>
          )}
        </div>

        <div className="absolute top-3 right-3">
          {item.reward && item.reward.amount > 0 && (
            <Badge className="bg-green-600 text-white hover:bg-green-700">
              ${item.reward.amount} Reward
            </Badge>
          )}
        </div>

        {/* Status Badge */}
        <div className="absolute bottom-3 right-3">
          <Badge 
            variant="secondary" 
            className={`${
              item.status === 'active' 
                ? 'bg-blue-100 text-blue-800' 
                : item.status === 'matched'
                ? 'bg-yellow-100 text-yellow-800'
                : item.status === 'resolved'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2 mb-2">
          <Badge className={getCategoryColor(item.category)} variant="secondary">
            {ITEM_CATEGORIES[item.category]}
          </Badge>
          <span className="text-sm text-gray-500 flex-shrink-0">
            {formatDate(item.dateOccurred)}
          </span>
        </div>
        
        <CardTitle className="text-lg leading-tight group-hover:text-blue-600 transition-colors">
          {item.title}
        </CardTitle>
        
        <CardDescription className="text-sm text-gray-600 line-clamp-2">
          {truncateDescription(item.description)}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Location */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span className="mr-1">📍</span>
          <span className="truncate">{item.location.name}</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>👁 {item.views} views</span>
            <span>By {item.userName}</span>
          </div>
          
          <Button 
            asChild 
            size="sm" 
            className="group-hover:bg-blue-600 group-hover:text-white transition-colors"
          >
            <Link href={`/${item.type}/${item.id}`}>
              View Details
            </Link>
          </Button>
        </div>

        {/* Tags */}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {item.tags.slice(0, 3).map((tag, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs px-2 py-0 h-5 border-gray-300 text-gray-600"
              >
                {tag}
              </Badge>
            ))}
            {item.tags.length > 3 && (
              <Badge 
                variant="outline" 
                className="text-xs px-2 py-0 h-5 border-gray-300 text-gray-500"
              >
                +{item.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}