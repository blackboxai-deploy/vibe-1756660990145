'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import ItemCard from '@/components/items/ItemCard';
import { Item, SearchFilters, ITEM_CATEGORIES } from '@/types';

export default function FoundItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState('date');
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    loadItems();
  }, [selectedCategory, sortBy]);

  const loadItems = async () => {
    setIsLoading(true);
    try {
      const filters: SearchFilters = {
        type: 'found',
        category: selectedCategory === 'all' ? undefined : selectedCategory as any,
        sortBy: sortBy as any,
        query: searchQuery || undefined
      };

      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.set(key, String(value));
        }
      });

      const response = await fetch(`/api/items?${params}`);
      const result = await response.json();

      if (result.success) {
        setItems(result.data.items);
        setTotalItems(result.data.total);
      }
    } catch (error) {
      console.error('Failed to load items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadItems();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Found Items
            </h1>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Browse items found by the community. These belongings are waiting to be reunited with their owners.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-green-600 hover:bg-green-50">
                <Link href="/found/report">Report Found Item</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                <Link href="/lost">Browse Lost Items</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <Input
                type="text"
                placeholder="Search found items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">Search</Button>
            </form>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 items-center">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {Object.entries(ITEM_CATEGORIES).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Newest First</SelectItem>
                  <SelectItem value="relevance">Most Relevant</SelectItem>
                  <SelectItem value="views">Most Viewed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-600">
              {isLoading ? 'Loading...' : `${totalItems} found items`}
              {selectedCategory !== 'all' && (
                <Badge variant="secondary" className="ml-2">
                  {ITEM_CATEGORIES[selectedCategory as keyof typeof ITEM_CATEGORIES]}
                </Badge>
              )}
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/search">Advanced Search</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Items Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 12 }, (_, i) => (
                <Card key={i}>
                  <Skeleton className="h-48 w-full rounded-t-lg" />
                  <CardHeader>
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-4xl text-gray-400">📦</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">No found items</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {searchQuery || selectedCategory !== 'all'
                  ? 'Try adjusting your search filters to see more results.'
                  : 'Be the first to report a found item and help someone recover their belongings.'}
              </p>
              <div className="space-x-4">
                <Button asChild>
                  <Link href="/found/report">Report Found Item</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/lost">Browse Lost Items</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-green-50 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Found something that doesn't belong to you?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Help make someone's day by reporting the item you found. 
            Your good deed could reunite someone with something precious.
          </p>
          <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
            <Link href="/found/report">Report Found Item</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}