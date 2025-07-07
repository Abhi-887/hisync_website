"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Eye, 
  Star,
  ArrowRight,
  BookOpen,
  Users,
  Award,
  Target,
  Lightbulb,
  BarChart,
  Zap
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

interface Category {
  name: string;
  count: number;
  icon: React.ComponentType<any>;
  description: string;
  color: string;
}

interface ResourcesPageProps {
  featuredResources: Resource[];
  trendingResources: Resource[];
  latestResources: Resource[];
  categories: Array<{ name: string; count: number }>;
  totalCount: number;
}

const RESOURCES_API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000') + '/api/v1';

const categoryIcons: Record<string, any> = {
  'guides-&-tutorials': BookOpen,
  'technical-deep-dives': Zap,
  'case-studies': BarChart,
  'best-practices': Award,
  'industry-insights': Lightbulb,
  'security-&-compliance': Target,
  'product-updates': TrendingUp,
  'performance-optimization': Users,
  'integration-guides': BookOpen,
  'enterprise-solutions': BarChart,
  'technology': Zap,
  'business': BarChart,
  'design': Lightbulb,
  'marketing': Target,
  'development': BookOpen,
  'strategy': Award,
  'leadership': Users,
  'innovation': TrendingUp,
};

const categoryColors: Record<string, string> = {
  'guides-&-tutorials': 'from-blue-500 to-cyan-500',
  'technical-deep-dives': 'from-indigo-500 to-purple-500',
  'case-studies': 'from-green-500 to-emerald-500',
  'best-practices': 'from-yellow-500 to-orange-500',
  'industry-insights': 'from-purple-500 to-pink-500',
  'security-&-compliance': 'from-red-500 to-pink-500',
  'product-updates': 'from-teal-500 to-green-500',
  'performance-optimization': 'from-orange-500 to-red-500',
  'integration-guides': 'from-cyan-500 to-blue-500',
  'enterprise-solutions': 'from-gray-500 to-slate-500',
  'technology': 'from-blue-500 to-cyan-500',
  'business': 'from-green-500 to-emerald-500',
  'design': 'from-purple-500 to-pink-500',
  'marketing': 'from-orange-500 to-red-500',
  'development': 'from-indigo-500 to-blue-500',
  'strategy': 'from-yellow-500 to-orange-500',
  'leadership': 'from-teal-500 to-green-500',
  'innovation': 'from-pink-500 to-rose-500',
};

export default function ResourcesPage({
  featuredResources,
  trendingResources,
  latestResources,
  categories,
  totalCount
}: ResourcesPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Resource[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`${RESOURCES_API_BASE}/resources/search?q=${encodeURIComponent(query)}&limit=6`);
      const data = await response.json();
      
      if (data.success) {
        setSearchResults(data.data);
      }
    } catch (error) {
      console.error('Error searching resources:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const getCategoryDisplayName = (cat: string) => {
    return cat.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Enhanced categories with icons and descriptions
  const enhancedCategories: Category[] = (categories || []).map(cat => ({
    name: cat.name,
    count: cat.count,
    icon: categoryIcons[cat.name.toLowerCase().replace(/\s+/g, '-')] || BookOpen,
    description: getCategoryDescription(cat.name),
    color: categoryColors[cat.name.toLowerCase().replace(/\s+/g, '-')] || 'from-gray-500 to-gray-600'
  }));

  function getCategoryDescription(category: string): string {
    const descriptions: Record<string, string> = {
      'guides & tutorials': 'Step-by-step guides and practical tutorials',
      'technical deep dives': 'In-depth technical analysis and insights',
      'case studies': 'Real-world implementation examples and success stories',
      'best practices': 'Industry standards and proven methodologies',
      'industry insights': 'Market trends and strategic analysis',
      'security & compliance': 'Security protocols and compliance guidelines',
      'product updates': 'Latest features and product announcements',
      'performance optimization': 'Tips and techniques for better performance',
      'integration guides': 'Integration tutorials and API documentation',
      'enterprise solutions': 'Enterprise-level solutions and strategies',
      'technology': 'Latest tech trends, tools, and innovations',
      'business': 'Strategic insights and business growth',
      'design': 'Creative concepts and design thinking',
      'marketing': 'Digital marketing and brand strategies',
      'development': 'Coding best practices and frameworks',
      'strategy': 'Strategic planning and execution',
      'leadership': 'Leadership development and team management',
      'innovation': 'Innovation methodologies and case studies',
    };
    return descriptions[category.toLowerCase()] || 'Expert insights and practical guides';
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-blue-100 rounded-full">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Knowledge
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"> Hub</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Discover enterprise-grade insights, guides, and best practices. 
              Our curated collection of {totalCount}+ resources helps you stay ahead in your industry.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search resources, topics, or authors..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-12 py-4 text-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl shadow-sm"
                />
                {isSearching && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </div>

              {/* Search Results Dropdown */}
              {searchQuery && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute z-10 w-full bg-white rounded-xl shadow-lg border border-gray-200 mt-2"
                >
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Quick Results</h3>
                    <div className="space-y-2">
                      {searchResults.map((resource) => (
                        <Link key={resource.id} href={`/resources/${resource.slug}`}>
                          <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 line-clamp-1">{resource.title}</h4>
                              <p className="text-sm text-gray-500 line-clamp-1">{resource.excerpt}</p>
                            </div>
                            <Badge variant="outline" className="ml-3 text-xs">
                              {resource.category}
                            </Badge>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <Link href={`/resources?search=${encodeURIComponent(searchQuery)}`}>
                        <Button variant="ghost" size="sm" className="w-full justify-center">
                          View all results
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center items-center gap-8 text-sm text-gray-600"
            >
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2 text-blue-600" />
                <span className="font-semibold text-gray-900">{totalCount}+</span>
                <span className="ml-1">Resources</span>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-2 text-yellow-500" />
                <span className="font-semibold text-gray-900">{(featuredResources || []).length}</span>
                <span className="ml-1">Featured</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                <span className="font-semibold text-gray-900">{(categories || []).length}</span>
                <span className="ml-1">Categories</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-purple-500" />
                <span>Expert Authors</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore by Category</h2>
            <p className="text-xl text-gray-600">Find exactly what you're looking for</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {enhancedCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/resources/category/${encodeURIComponent(category.name)}`}>
                    <div className="group bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-gray-300">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {getCategoryDisplayName(category.name)}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {category.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          {category.count} resources
                        </span>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      {featuredResources && featuredResources.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-yellow-500 mr-2" />
                <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">Featured Content</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Editor's Picks</h2>
              <p className="text-xl text-gray-600">Our most valuable and popular resources</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredResources.slice(0, 6).map((resource, index) => (
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
                        <Badge variant="outline" className="text-xs mb-3">
                          {getCategoryDisplayName(resource.category)}
                        </Badge>
                        
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

            <div className="text-center mt-12">
              <Link href="/resources?featured=true">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  View All Featured Resources
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Trending Resources */}
      {trendingResources && trendingResources.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-between mb-12"
            >
              <div>
                <div className="flex items-center mb-4">
                  <TrendingUp className="h-6 w-6 text-orange-500 mr-2" />
                  <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">Trending Now</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">What's Popular</h2>
                <p className="text-xl text-gray-600">Most viewed resources this week</p>
              </div>
              <Link href="/resources?trending=true">
                <Button variant="outline">
                  View All Trending
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {trendingResources.slice(0, 4).map((resource, index) => (
                <motion.article
                  key={resource.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Link href={`/resources/${resource.slug}`}>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
                      <div className="flex gap-6">
                        {resource.featured_image_url && (
                          <div className="w-32 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={resource.featured_image_url}
                              alt={resource.title}
                              width={128}
                              height={96}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-orange-500 text-white text-xs">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Trending
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {getCategoryDisplayName(resource.category)}
                            </Badge>
                          </div>
                          
                          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {resource.title}
                          </h3>
                          
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {resource.excerpt}
                          </p>
                          
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center">
                              <div className="h-5 w-5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs mr-2">
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
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Resources */}
      {latestResources && latestResources.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-between mb-12"
            >
              <div>
                <div className="flex items-center mb-4">
                  <Calendar className="h-6 w-6 text-green-500 mr-2" />
                  <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">Fresh Content</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Resources</h2>
                <p className="text-xl text-gray-600">Stay updated with our newest insights</p>
              </div>
              <Link href="/resources?sort=latest">
                <Button variant="outline">
                  View All Latest
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestResources.slice(0, 6).map((resource, index) => (
                <motion.article
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Link href={`/resources/${resource.slug}`}>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300">
                      {resource.featured_image_url && (
                        <div className="aspect-video bg-gray-100 relative overflow-hidden">
                          <Image
                            src={resource.featured_image_url}
                            alt={resource.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-green-500 text-white text-xs">
                              New
                            </Badge>
                          </div>
                        </div>
                      )}
                      
                      <div className="p-6">
                        <Badge variant="outline" className="text-xs mb-3">
                          {getCategoryDisplayName(resource.category)}
                        </Badge>
                        
                        <h3 className="font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {resource.title}
                        </h3>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {resource.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(resource.published_at)}
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

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Stay Ahead with Expert Insights
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who rely on our resources to drive their success. 
              Get the latest insights delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Input
                placeholder="Enter your email"
                className="bg-white border-white text-gray-900 placeholder-gray-500"
              />
              <Button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold">
                Subscribe
              </Button>
            </div>
            <p className="text-sm text-blue-200 mt-4">
              No spam. Unsubscribe anytime.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
