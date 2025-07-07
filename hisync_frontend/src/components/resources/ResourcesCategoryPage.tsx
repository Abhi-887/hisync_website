"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Calendar, 
  Clock, 
  Eye, 
  TrendingUp,
  Star,
  ChevronDown,
  X
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
import Image from 'next/image';

interface Resource {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: {
    id: number;
    name: string;
    email: string;
  };
  featured_image_url: string | null;
  is_featured: boolean;
  is_trending: boolean;
  published_at: string;
  published_date_formatted: string;
  read_time: number;
  reading_time_text: string;
  view_count: number;
  share_count: number;
  like_count: number;
}

interface ResourcesCategoryPageProps {
  category: string;
  initialResources?: Resource[];
  totalCount: number;
  featuredResources?: Resource[];
  relatedCategories?: string[];
}

const RESOURCES_API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000') + '/api/v1';

export default function ResourcesCategoryPage({
  category,
  initialResources,
  totalCount,
  featuredResources,
  relatedCategories
}: ResourcesCategoryPageProps) {
  const [resources, setResources] = useState<Resource[]>(initialResources || []);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(totalCount > (initialResources || []).length);

  // Get all unique tags from resources
  const allTags = Array.from(
    new Set((resources || []).flatMap(resource => resource.tags || []))
  ).sort();

  const fetchResources = async (page = 1, reset = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        category,
        page: page.toString(),
        per_page: '12',
        sort: sortBy,
      });

      if (searchQuery) {
        params.append('search', searchQuery);
      }

      if (selectedTags.length > 0) {
        params.append('tags', selectedTags.join(','));
      }

      const response = await fetch(`${RESOURCES_API_BASE}/resources?${params}`);
      const data = await response.json();

      if (data.success && data.data && data.data.data) {
        if (reset || page === 1) {
          setResources(data.data.data || []);
        } else {
          setResources(prev => [...(prev || []), ...(data.data.data || [])]);
        }
        setHasMore(data.data.current_page < data.data.last_page);
        setCurrentPage(data.data.current_page);
      } else {
        // If no success or data, set empty array
        if (reset || page === 1) {
          setResources([]);
        }
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setSortBy('latest');
    setCurrentPage(1);
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchResources(currentPage + 1, false);
    }
  };

  // Re-fetch when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchResources(1, true);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, sortBy, selectedTags]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryDisplayName = (cat: string) => {
    return cat.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center mb-4">
              <Badge variant="outline" className="text-sm">
                {getCategoryDisplayName(category)}
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {getCategoryDisplayName(category)} Resources
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover insights, guides, and best practices in {getCategoryDisplayName(category).toLowerCase()}. 
              {totalCount > 0 && ` Browse ${totalCount} carefully curated resources.`}
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center items-center gap-8 text-sm text-gray-600"
          >
            <div className="flex items-center">
              <span className="font-semibold text-gray-900">{totalCount}</span>
              <span className="ml-1">Resources</span>
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-1 text-yellow-500" />
              <span className="font-semibold text-gray-900">{(featuredResources || []).length}</span>
              <span className="ml-1">Featured</span>
            </div>
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
              <span>Updated Weekly</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Resources */}
      {featuredResources && featuredResources.length > 0 && (
        <section className="py-12 bg-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Featured in {getCategoryDisplayName(category)}</h2>
              <p className="text-gray-600">Our most popular and highly-rated resources</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(featuredResources || []).slice(0, 3).map((resource, index) => (
                <motion.article
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Link href={`/resources/${resource.slug}`}>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
                      {resource.featured_image_url && (
                        <div className="aspect-video bg-gray-100 relative overflow-hidden">
                          <Image
                            src={resource.featured_image_url}
                            alt={resource.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-yellow-500 text-white">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          </div>
                        </div>
                      )}
                      
                      <div className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {resource.title}
                        </h3>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {resource.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center">
                            <div className="h-6 w-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs mr-2">
                              {resource.author.name.charAt(0)}
                            </div>
                            {resource.author.name}
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {resource.reading_time_text}
                            </div>
                            <div className="flex items-center">
                              <Eye className="h-3 w-3 mr-1" />
                              {resource.view_count.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Filters and Search */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={`Search ${getCategoryDisplayName(category).toLowerCase()} resources...`}
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
              {/* Sort */}
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="trending">Trending</SelectItem>
                  <SelectItem value="title">Title A-Z</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="flex items-center border border-gray-200 rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Tag Filters */}
          {allTags.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filter by tags:</span>
                {selectedTags.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear all
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {allTags.slice(0, 12).map((tag) => (
                  <Button
                    key={tag}
                    variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleTag(tag)}
                    className="text-xs"
                  >
                    {tag}
                    {selectedTags.includes(tag) && (
                      <X className="h-3 w-3 ml-1" />
                    )}
                  </Button>
                ))}
                {allTags.length > 12 && (
                  <Button variant="ghost" size="sm" className="text-xs text-gray-500">
                    <ChevronDown className="h-3 w-3 mr-1" />
                    Show more
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Resources Grid/List */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading && (resources || []).length === 0 ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading resources...</p>
            </div>
          ) : (resources || []).length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or browse other categories.
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                  : 'space-y-6'
              }>
                {(resources || []).map((resource, index) => (
                  <motion.article
                    key={resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (index % 12) * 0.05 }}
                    className="group"
                  >
                    <Link href={`/resources/${resource.slug}`}>
                      {viewMode === 'grid' ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300">
                          {resource.featured_image_url && (
                            <div className="aspect-video bg-gray-100 relative overflow-hidden">
                              <Image
                                src={resource.featured_image_url}
                                alt={resource.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute top-3 left-3 flex gap-2">
                                {resource.is_trending && (
                                  <Badge className="bg-orange-500 text-white text-xs">
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    Trending
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                          
                          <div className="p-6">
                            <h3 className="font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                              {resource.title}
                            </h3>
                            
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                              {resource.excerpt}
                            </p>
                            
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <div className="flex items-center">
                                <div className="h-6 w-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs mr-2">
                                  {resource.author.name.charAt(0)}
                                </div>
                                {resource.author.name}
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {resource.reading_time_text}
                                </div>
                                <div className="flex items-center">
                                  <Eye className="h-3 w-3 mr-1" />
                                  {resource.view_count.toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
                          <div className="flex gap-6">
                            {resource.featured_image_url && (
                              <div className="w-48 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                  src={resource.featured_image_url}
                                  alt={resource.title}
                                  width={192}
                                  height={128}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                            )}
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {resource.is_trending && (
                                  <Badge className="bg-orange-500 text-white text-xs">
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    Trending
                                  </Badge>
                                )}
                              </div>
                              
                              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                                {resource.title}
                              </h3>
                              
                              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                {resource.excerpt}
                              </p>
                              
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center">
                                    <div className="h-6 w-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs mr-2">
                                      {resource.author.name.charAt(0)}
                                    </div>
                                    {resource.author.name}
                                  </div>
                                  <div className="flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {formatDate(resource.published_at)}
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {resource.reading_time_text}
                                  </div>
                                  <div className="flex items-center">
                                    <Eye className="h-3 w-3 mr-1" />
                                    {resource.view_count.toLocaleString()}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Link>
                  </motion.article>
                ))}
              </div>

              {/* Load More */}
              {hasMore && (
                <div className="text-center mt-12">
                  <Button
                    onClick={loadMore}
                    disabled={loading}
                    variant="outline"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                        Loading...
                      </>
                    ) : (
                      'Load More Resources'
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Related Categories */}
      {relatedCategories && relatedCategories.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Explore Related Categories</h2>
              <p className="text-gray-600">Discover more resources in related topics</p>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-4">
              {(relatedCategories || []).map((relatedCategory, index) => (
                <motion.div
                  key={relatedCategory}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/resources/category/${encodeURIComponent(relatedCategory)}`}>
                    <Button
                      variant="outline"
                      className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-300"
                    >
                      {getCategoryDisplayName(relatedCategory)}
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
