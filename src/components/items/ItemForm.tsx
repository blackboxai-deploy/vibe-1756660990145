'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ItemFormData, ITEM_CATEGORIES } from '@/types';
import { authService } from '@/lib/auth';

interface ItemFormProps {
  type: 'lost' | 'found';
}

export default function ItemForm({ type }: ItemFormProps) {
  const [formData, setFormData] = useState<ItemFormData>({
    title: '',
    description: '',
    category: 'other',
    tags: [],
    location: '',
    dateOccurred: new Date().toISOString().split('T')[0],
    images: [],
    contactMethod: 'email',
    phone: '',
    reward: {
      amount: 0,
      description: ''
    }
  });
  const [tagInput, setTagInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const user = authService.getCurrentUser();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('reward.')) {
      const rewardField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        reward: {
          amount: prev.reward?.amount || 0,
          description: prev.reward?.description || '',
          ...prev.reward,
          [rewardField]: rewardField === 'amount' ? parseFloat(value) || 0 : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!formData.tags.includes(newTag) && formData.tags.length < 10) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];

    if (formData.title.trim().length < 5) {
      errors.push('Title must be at least 5 characters long');
    }
    
    if (formData.description.trim().length < 20) {
      errors.push('Description must be at least 20 characters long');
    }
    
    if (formData.location.trim().length < 3) {
      errors.push('Location must be at least 3 characters long');
    }
    
    if (formData.contactMethod === 'phone' && !formData.phone?.trim()) {
      errors.push('Phone number is required when phone is selected as contact method');
    }

    if (formData.reward && formData.reward.amount && formData.reward.amount > 0 && (!formData.reward.description || !formData.reward.description.trim())) {
      errors.push('Reward description is required when offering a reward');
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Check authentication
    if (!user) {
      setError('Please log in to report items');
      return;
    }

    // Validate form
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join('. '));
      return;
    }

    setIsLoading(true);

    try {
      // Generate placeholder image based on category and title
      const imageUrl = `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/b2acd147-be0d-4202-909c-e113ab306d5a.png`;

      const submitData = {
        ...formData,
        type,
        images: [imageUrl], // Using placeholder image
        reward: formData.reward?.amount && formData.reward.amount > 0 ? formData.reward : undefined
      };

      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user.id
        },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(`${type.charAt(0).toUpperCase() + type.slice(1)} item reported successfully!`);
        setTimeout(() => {
          router.push(`/${type}/${result.data.id}`);
        }, 2000);
      } else {
        setError(result.error || `Failed to report ${type} item`);
      }
    } catch (err) {
      setError('An error occurred while submitting the form. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              You need to be logged in to report {type} items.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/auth/register">Create Account</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Report {type === 'lost' ? 'Lost' : 'Found'} Item
          </h1>
          <p className="text-gray-600">
            {type === 'lost' 
              ? 'Provide details about your lost item to help others identify it'
              : 'Help someone reunite with their belongings by reporting what you found'
            }
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Item Details</CardTitle>
            <CardDescription>
              Fill in as much information as possible to improve your chances of a match
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50 text-green-800">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              {/* Title */}
              <div>
                <Label htmlFor="title">Item Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder={`e.g., ${type === 'lost' ? 'iPhone 15 Pro in blue case' : 'Black leather wallet'}`}
                  className="mt-1"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Be specific and descriptive</p>
              </div>

              {/* Category */}
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ITEM_CATEGORIES).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Detailed Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder={`Describe the item in detail: color, size, brand, distinctive features, condition, etc. ${
                    type === 'lost' 
                      ? 'When and where did you last see it?' 
                      : 'Where exactly did you find it?'
                  }`}
                  className="mt-1 min-h-32"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 20 characters. The more details, the better!
                </p>
              </div>

              {/* Location */}
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder={`Where ${type === 'lost' ? 'was it lost' : 'did you find it'}? Be as specific as possible`}
                  className="mt-1"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  e.g., Central Park near the pond, Starbucks on 5th Avenue
                </p>
              </div>

              {/* Date */}
              <div>
                <Label htmlFor="dateOccurred">
                  Date {type === 'lost' ? 'Lost' : 'Found'}
                </Label>
                <Input
                  id="dateOccurred"
                  name="dateOccurred"
                  type="date"
                  value={formData.dateOccurred}
                  onChange={handleChange}
                  className="mt-1"
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Tags */}
              <div>
                <Label htmlFor="tags">Tags (Optional)</Label>
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Add keywords to help others find this item (press Enter to add)"
                  className="mt-1"
                />
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Add relevant keywords like brand names, colors, or specific features
                </p>
              </div>

              {/* Contact Method */}
              <div>
                <Label>Preferred Contact Method *</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="contact-email"
                      checked={formData.contactMethod === 'email'}
                      onCheckedChange={(checked) => 
                        checked && handleSelectChange('contactMethod', 'email')
                      }
                    />
                    <Label htmlFor="contact-email" className="text-sm">
                      Email ({user.email})
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="contact-phone"
                      checked={formData.contactMethod === 'phone'}
                      onCheckedChange={(checked) => 
                        checked && handleSelectChange('contactMethod', 'phone')
                      }
                    />
                    <Label htmlFor="contact-phone" className="text-sm">
                      Phone
                    </Label>
                  </div>
                </div>
                
                {formData.contactMethod === 'phone' && (
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="mt-2"
                    type="tel"
                  />
                )}
              </div>

              {/* Reward (Lost items only) */}
              {type === 'lost' && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <Label className="text-base font-medium">Reward (Optional)</Label>
                  <p className="text-sm text-gray-600 mb-4">
                    Offering a reward can increase your chances of recovery
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="reward.amount">Reward Amount ($)</Label>
                      <Input
                        id="reward.amount"
                        name="reward.amount"
                        type="number"
                        min="0"
                        step="1"
                        value={formData.reward?.amount || 0}
                        onChange={handleChange}
                        className="mt-1"
                        placeholder="0"
                      />
                    </div>
                    
                    {formData.reward && formData.reward.amount && formData.reward.amount > 0 && (
                      <div>
                        <Label htmlFor="reward.description">Reward Description</Label>
                        <Input
                          id="reward.description"
                          name="reward.description"
                          value={formData.reward.description}
                          onChange={handleChange}
                          placeholder="Reward for safe return"
                          className="mt-1"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? 'Submitting...' : `Report ${type === 'lost' ? 'Lost' : 'Found'} Item`}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}