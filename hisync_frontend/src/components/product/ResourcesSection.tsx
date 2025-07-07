"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, BookOpen, Filter, Search, Tag, TrendingUp, Eye, Share2, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Resource {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  category: string;
  tags: string[];
  author: {
    name: string;
    avatar?: string;
    role: string;
  };
  featured_image?: string;
  is_featured: boolean;
  is_trending: boolean;
  published_at: string;
  read_time: number;
  view_count: number;
  share_count: number;
  status: 'published' | 'draft';
}

interface ResourceResponse {
  success: boolean;
  data: {
    resources: Resource[];
    categories: Record<string, number>;
    featured_resources: Resource[];
    trending_resources: Resource[];
    total_count: number;
  };
}

const RESOURCES_API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000') + '/api/v1';

// Mock data for development/fallback
const mockResources: Resource[] = [
  {
    id: 1,
    title: "Complete Guide to Data Synchronization in 2025",
    excerpt: "Learn the latest best practices, tools, and strategies for implementing robust data synchronization across multiple platforms and devices.",
    content: "Comprehensive guide covering...",
    slug: "complete-guide-data-synchronization-2025",
    category: "Guides",
    tags: ["synchronization", "data", "best-practices", "2025"],
    author: {
      name: "Sarah Chen",
      role: "Senior Solutions Architect"
    },
    featured_image: "/images/resources/data-sync-guide.jpg",
    is_featured: true,
    is_trending: true,
    published_at: "2025-01-15T10:00:00Z",
    read_time: 12,
    view_count: 2450,
    share_count: 89,
    status: 'published'
  },
  {
    id: 2,
    title: "Enterprise Security Best Practices for Cloud Sync",
    excerpt: "Discover how enterprise organizations can maintain security while implementing cloud-based synchronization solutions.",
    content: "Security practices guide...",
    slug: "enterprise-security-cloud-sync",
    category: "Security",
    tags: ["security", "enterprise", "cloud", "compliance"],
    author: {
      name: "Michael Rodriguez",
      role: "Chief Security Officer"
    },
    featured_image: "/images/resources/security-practices.jpg",
    is_featured: true,
    is_trending: false,
    published_at: "2025-01-10T14:30:00Z",
    read_time: 8,
    view_count: 1890,
    share_count: 67,
    status: 'published'
  },
  {
    id: 3,
    title: "API Integration Patterns for Modern Applications",
    excerpt: "Explore proven API integration patterns that ensure reliable, scalable, and maintainable synchronization workflows.",
    content: "API patterns and implementations...",
    slug: "api-integration-patterns-modern-apps",
    category: "Development",
    tags: ["api", "integration", "patterns", "development"],
    author: {
      name: "Alex Thompson",
      role: "Lead Developer"
    },
    is_featured: false,
    is_trending: true,
    published_at: "2025-01-08T09:15:00Z",
    read_time: 15,
    view_count: 1234,
    share_count: 45,
    status: 'published'
  },
  {
    id: 4,
    title: "Case Study: How TechCorp Scaled to 10M Users",
    excerpt: "Learn how TechCorp successfully scaled their synchronization infrastructure to support 10 million concurrent users.",
    content: "Detailed case study...",
    slug: "techcorp-scale-10m-users-case-study",
    category: "Case Studies",
    tags: ["case-study", "scaling", "performance", "enterprise"],
    author: {
      name: "Jennifer Liu",
      role: "Customer Success Manager"
    },
    is_featured: false,
    is_trending: false,
    published_at: "2025-01-05T16:45:00Z",
    read_time: 10,
    view_count: 987,
    share_count: 34,
    status: 'published'
  }
];

const mockCategories = {
  "Guides": 12,
  "Security": 8,
  "Development": 15,
  "Case Studies": 6,
  "Industry News": 9,
  "Best Practices": 11
};

export default function ResourcesSection() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<Record<string, number>>({});
  const [featuredResources, setFeaturedResources] = useState<Resource[]>([]);
  const [trendingResources, setTrendingResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [showTrendingOnly, setShowTrendingOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'trending'>('latest');

  useEffect(() => {
    fetchResources();
  }, [searchTerm, selectedCategory, showFeaturedOnly, showTrendingOnly, sortBy]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (showFeaturedOnly) params.append('featured', 'true');
      if (showTrendingOnly) params.append('trending', 'true');
      params.append('sort', sortBy);
      
      const response = await fetch(`${RESOURCES_API_BASE}/resources?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ResourceResponse = await response.json();
      
      if (data.success && data.data) {
        setResources(Array.isArray(data.data.resources) ? data.data.resources : []);
        setCategories(data.data.categories || {});
        setFeaturedResources(Array.isArray(data.data.featured_resources) ? data.data.featured_resources : []);
        setTrendingResources(Array.isArray(data.data.trending_resources) ? data.data.trending_resources : []);
      } else {
        // Fallback to mock data
        console.log('API response not successful, using mock data');
        setResources(mockResources);
        setCategories(mockCategories);
        setFeaturedResources(mockResources.filter(r => r.is_featured));
        setTrendingResources(mockResources.filter(r => r.is_trending));
      }
    } catch (error) {
      console.error('Error fetching resources, using mock data:', error);
      // Fallback to mock data on error
      setResources(mockResources);
      setCategories(mockCategories);
      setFeaturedResources(mockResources.filter(r => r.is_featured));
      setTrendingResources(mockResources.filter(r => r.is_trending));
    } finally {
      setLoading(false);
    }
  };

  const filteredResources = (resources || []).filter(resource => {
    if (!resource) return false;
    
    const matchesSearch = !searchTerm || 
      (resource.title && resource.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (resource.excerpt && resource.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (Array.isArray(resource.tags) && resource.tags.some(tag => tag && tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesFeatured = !showFeaturedOnly || resource.is_featured;
    const matchesTrending = !showTrendingOnly || resource.is_trending;
    
    return matchesSearch && matchesCategory && matchesFeatured && matchesTrending;
  });

  const sortedResources = [...filteredResources].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return (b.view_count || 0) - (a.view_count || 0);
      case 'trending':
        return (b.share_count || 0) - (a.share_count || 0);
      case 'latest':
      default:
        return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
    }
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
            <Badge variant="outline" className="text-sm px-3 py-1">
              Knowledge Hub
            </Badge>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Resources & Insights
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay ahead with our comprehensive collection of guides, best practices, case studies, and industry insights.
          </p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Search */}
              <div className="lg:col-span-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search resources..."
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="lg:col-span-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {Object.entries(categories || {}).map(([category, count]) => (
                      <SelectItem key={category} value={category}>
                        {category} ({count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort */}
              <div className="lg:col-span-2">
                <Select value={sortBy} onValueChange={(value: string) => setSortBy(value as 'latest' | 'popular' | 'trending')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">Latest</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="trending">Trending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Featured Filter */}
              <div className="lg:col-span-2">
                <Button
                  variant={showFeaturedOnly ? "default" : "outline"}
                  onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
                  className="w-full"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Featured
                </Button>
              </div>

              {/* Stats */}
              <div className="lg:col-span-2">
                <div className="text-center">
                  <div className="text-sm text-gray-500">Total Resources</div>
                  <div className="text-lg font-semibold text-gray-900">{sortedResources.length}</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Content */}
        {!loading && (
          <div className="space-y-12">
            {/* Featured Resources */}
            {featuredResources.length > 0 && !showTrendingOnly && !searchTerm && selectedCategory === 'all' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                    <TrendingUp className="h-6 w-6 text-blue-600 mr-2" />
                    Featured Resources
                  </h3>
                  <p className="text-gray-600">Essential reads curated by our experts</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {featuredResources.slice(0, 2).map((resource, index) => (
                    <FeaturedResourceCard key={resource.id} resource={resource} index={index} />
                  ))}
                </div>
              </motion.div>
            )}

            {/* All Resources Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {sortedResources.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {sortedResources.map((resource, index) => (
                    <ResourceCard key={resource.id} resource={resource} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Resources Found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search terms or filters.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                      setShowFeaturedOnly(false);
                      setShowTrendingOnly(false);
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}

interface ResourceCardProps {
  resource: Resource;
  index: number;
}

function ResourceCard({ resource, index }: ResourceCardProps) {
  if (!resource) return null;

  const safeTags = Array.isArray(resource.tags) ? resource.tags : [];
  const safeViewCount = resource.view_count || 0;
  const safeReadTime = resource.read_time || 5;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
    >
      {/* Featured Image */}
      {resource.featured_image && (
        <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          {resource.is_featured && (
            <Badge className="absolute top-4 left-4 bg-blue-600">
              Featured
            </Badge>
          )}
          {resource.is_trending && (
            <Badge className="absolute top-4 right-4 bg-orange-500">
              <TrendingUp className="h-3 w-3 mr-1" />
              Trending
            </Badge>
          )}
        </div>
      )}

      <div className="p-6">
        {/* Category and Date */}
        <div className="flex items-center justify-between mb-3">
          <Badge variant="outline" className="text-xs">
            {resource.category}
          </Badge>
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            {new Date(resource.published_at).toLocaleDateString()}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
          {resource.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {resource.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {safeTags.slice(0, 3).map((tag, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {safeTags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{safeTags.length - 3}
            </Badge>
          )}
        </div>

        {/* Author and Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {resource.author?.name?.charAt(0) || 'A'}
            </div>
            <div className="ml-2">
              <div className="text-sm font-medium text-gray-900">
                {resource.author?.name || 'Anonymous'}
              </div>
              <div className="text-xs text-gray-500">
                {resource.author?.role || 'Author'}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {safeReadTime}m read
            </div>
            <div className="flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              {safeViewCount.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Read More Button */}
        <Button variant="ghost" className="w-full mt-4 group-hover:bg-blue-50 group-hover:text-blue-600">
          Read More
          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </motion.article>
  );
}

function FeaturedResourceCard({ resource, index }: ResourceCardProps) {
  if (!resource) return null;

  const safeTags = Array.isArray(resource.tags) ? resource.tags : [];
  const safeViewCount = resource.view_count || 0;
  const safeReadTime = resource.read_time || 5;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2 }}
      className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 group"
    >
      {/* Featured Image */}
      <div className="aspect-[16/10] bg-gradient-to-br from-blue-500 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <Badge className="absolute top-6 left-6 bg-white text-blue-600 shadow-lg">
          <TrendingUp className="h-3 w-3 mr-1" />
          Featured
        </Badge>
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <h3 className="text-xl font-bold mb-2 line-clamp-2">
            {resource.title}
          </h3>
          <p className="text-blue-100 text-sm line-clamp-2">
            {resource.excerpt}
          </p>
        </div>
      </div>

      <div className="p-6">
        {/* Category and Date */}
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline" className="text-sm">
            {resource.category}
          </Badge>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            {new Date(resource.published_at).toLocaleDateString()}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {safeTags.slice(0, 4).map((tag, idx) => (
            <Badge key={idx} variant="secondary" className="text-sm">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Author and Stats */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-medium">
              {resource.author?.name?.charAt(0) || 'A'}
            </div>
            <div className="ml-3">
              <div className="font-medium text-gray-900">
                {resource.author?.name || 'Anonymous'}
              </div>
              <div className="text-sm text-gray-500">
                {resource.author?.role || 'Author'}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {safeReadTime}m
            </div>
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              {safeViewCount.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Read More Button */}
        <Button className="w-full bg-blue-600 hover:bg-blue-700">
          Read Full Article
          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </motion.article>
  );
}
