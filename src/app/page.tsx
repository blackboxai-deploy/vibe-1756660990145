'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Item, ITEM_CATEGORIES } from '@/types';
import { db } from '@/lib/database';
import { initializeDemoUsers } from '@/lib/auth';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredItems, setFeaturedItems] = useState<Item[]>([]);
  const [recentItems, setRecentItems] = useState<Item[]>([]);
  const [stats, setStats] = useState({
    totalItems: 0,
    totalUsers: 0,
    recentMatches: 0
  });

  useEffect(() => {
    // Initialize demo users
    initializeDemoUsers();
    
    // Load data
    const featured = db.items.getFeatured();
    const recent = db.items.getRecent(6);
    const overview = db.stats.getOverview();
    
    setFeaturedItems(featured);
    setRecentItems(recent);
    setStats({
      totalItems: overview.totalItems,
      totalUsers: overview.totalUsers,
      recentMatches: overview.recentActivity.newMatches
    });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

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
      other: 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || colors.other;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Lost Something?
              <br />
              <span className="text-blue-200">We'll Help You Find It</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Connect with your community to report lost items, browse found items, 
              and get intelligent match suggestions powered by our advanced algorithms.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search for lost or found items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-16 text-lg pl-6 pr-32 rounded-full border-0 bg-white/90 backdrop-blur text-gray-900 placeholder:text-gray-600"
                />
                <Button
                  type="submit"
                  size="lg"
                  className="absolute right-2 top-2 h-12 px-8 rounded-full bg-blue-600 hover:bg-blue-700"
                >
                  Search
                </Button>
              </form>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50 rounded-full px-8">
                <Link href="/lost/report">Report Lost Item</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 rounded-full px-8">
                <Link href="/found/report">Report Found Item</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalItems}</div>
              <div className="text-gray-600">Items Reported</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.totalUsers}</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">{stats.recentMatches}</div>
              <div className="text-gray-600">Recent Matches</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse by Category</h2>
            <p className="text-gray-600 text-lg">Find items organized by type</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Object.entries(ITEM_CATEGORIES).map(([key, label]) => (
              <Link
                key={key}
                href={`/search?category=${key}`}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200 group"
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-colors">
                    <span className="text-2xl font-bold text-blue-600">{String(label).charAt(0)}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{String(label)}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items */}
      {featuredItems.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Items</h2>
                <p className="text-gray-600">High-priority lost items with rewards</p>
              </div>
              <Button asChild variant="outline">
                <Link href="/search?featured=true">View All Featured</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredItems.slice(0, 3).map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-3 right-3 bg-yellow-500 text-white">
                      Featured
                    </Badge>
                    {item.reward && (
                      <Badge className="absolute top-3 left-3 bg-green-600 text-white">
                        ${item.reward.amount} Reward
                      </Badge>
                    )}
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge className={getCategoryColor(item.category)}>
                        {ITEM_CATEGORIES[item.category]}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {formatDate(item.dateOccurred)}
                      </span>
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {item.description.slice(0, 100)}...
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        📍 {item.location.name}
                      </span>
                      <Button asChild size="sm">
                        <Link href={`/${item.type}/${item.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Items */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Recently Reported</h2>
              <p className="text-gray-600">Latest lost and found items in your area</p>
            </div>
            <Button asChild variant="outline">
              <Link href="/search?sort=date">View All Recent</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentItems.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge 
                    className={`absolute top-3 right-3 ${
                      item.type === 'lost' 
                        ? 'bg-red-600 text-white' 
                        : 'bg-green-600 text-white'
                    }`}
                  >
                    {item.type === 'lost' ? 'Lost' : 'Found'}
                  </Badge>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={getCategoryColor(item.category)}>
                      {ITEM_CATEGORIES[item.category]}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {formatDate(item.dateOccurred)}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      📍 {item.location.name}
                    </span>
                    <Button asChild size="sm">
                      <Link href={`/${item.type}/${item.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 text-lg">Simple steps to find your lost items</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Report Your Item</h3>
              <p className="text-gray-600">
                Describe your lost or found item with photos and location details. 
                Our system will start looking for potential matches immediately.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Get Smart Matches</h3>
              <p className="text-gray-600">
                Our intelligent matching algorithm analyzes item descriptions, locations, 
                and timeframes to find the best potential matches.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Connect & Recover</h3>
              <p className="text-gray-600">
                Contact item owners through our secure messaging system and arrange 
                for safe return of lost belongings.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}