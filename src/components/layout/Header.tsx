'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/types';
import { authService } from '@/lib/auth';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    router.push('/');
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">L&amp;F</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">Lost &amp; Found</h1>
                <p className="text-xs text-gray-500">Find what matters</p>
              </div>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search lost or found items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1 top-1 h-8 px-3"
              >
                Search
              </Button>
            </form>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/lost" className="text-gray-600 hover:text-gray-900 font-medium">
              Lost Items
            </Link>
            <Link href="/found" className="text-gray-600 hover:text-gray-900 font-medium">
              Found Items
            </Link>
            <Link href="/search" className="text-gray-600 hover:text-gray-900 font-medium">
              Advanced Search
            </Link>
          </nav>

          {/* User Menu or Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Quick Action Buttons */}
                <div className="hidden lg:flex items-center space-x-2">
                  <Button asChild size="sm" variant="outline">
                    <Link href="/lost/report">Report Lost</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href="/found/report">Report Found</Link>
                  </Button>
                </div>

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-blue-600 text-white">
                          {getUserInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      {user.role === 'admin' && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 bg-red-600">
                          A
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <div className="lg:hidden">
                      <DropdownMenuItem asChild>
                        <Link href="/lost/report">Report Lost Item</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/found/report">Report Found Item</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </div>
                    {user.role === 'admin' && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/admin">Admin Dashboard</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/moderate">Moderate Items</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button asChild variant="outline" size="sm">
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/auth/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200 bg-gray-50">
        <div className="px-4 py-2">
          <nav className="flex justify-around">
            <Link href="/lost" className="text-sm text-gray-600 hover:text-gray-900 py-2">
              Lost
            </Link>
            <Link href="/found" className="text-sm text-gray-600 hover:text-gray-900 py-2">
              Found
            </Link>
            <Link href="/search" className="text-sm text-gray-600 hover:text-gray-900 py-2">
              Search
            </Link>
            {user && (
              <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900 py-2">
                Dashboard
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}