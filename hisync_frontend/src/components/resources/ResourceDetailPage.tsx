"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  User, 
  Eye, 
  Share2, 
  Heart, 
  ArrowRight, 
  ArrowLeft,
  BookOpen,
  Tag,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

interface Resource {
  id: number;
  title: string;
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
  gallery_images_urls: string[];
  is_featured: boolean;
  is_trending: boolean;
  published_at: string;
  published_date_formatted: string;
  read_time: number;
  reading_time_text: string;
  view_count: number;
  share_count: number;
  like_count: number;
  full_url: string;
}

interface RelatedResource {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  author: {
    id: number;
    name: string;
  };
  featured_image_url: string | null;
  published_at: string;
  read_time: number;
  view_count: number;
}

interface NavigationResource {
  id: number;
  title: string;
  slug: string;
}

interface ResourceDetailPageProps {
  resource: Resource;
  relatedResources: RelatedResource[];
  nextResource: NavigationResource | null;
  previousResource: NavigationResource | null;
}

const RESOURCES_API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000') + '/api/v1';

export default function ResourceDetailPage({
  resource,
  relatedResources,
  nextResource,
  previousResource
}: ResourceDetailPageProps) {
  const [liked, setLiked] = useState(false);
  const [shareCount, setShareCount] = useState(resource.share_count);

  const handleShare = async (platform?: string) => {
    try {
      // Increment share count on backend
      await fetch(`${RESOURCES_API_BASE}/resources/${resource.id}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      setShareCount(prev => prev + 1);

      // Handle platform-specific sharing
      if (platform) {
        const url = encodeURIComponent(resource.full_url);
        const title = encodeURIComponent(resource.title);
        const text = encodeURIComponent(resource.excerpt);

        let shareUrl = '';
        switch (platform) {
          case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
            break;
          case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
            break;
          case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
          default:
            // Copy to clipboard
            await navigator.clipboard.writeText(resource.full_url);
            return;
        }

        if (shareUrl) {
          window.open(shareUrl, '_blank', 'width=600,height=400');
        }
      }
    } catch (error) {
      console.error('Error sharing resource:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <article className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
            <Link href="/resources" className="hover:text-blue-600 transition-colors">
              Resources
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link 
              href={`/resources/category/${encodeURIComponent(resource.category)}`}
              className="hover:text-blue-600 transition-colors"
            >
              {resource.category}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900">{resource.title}</span>
          </nav>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Badge variant="outline" className="text-sm">
              {resource.category}
            </Badge>
            {resource.is_featured && (
              <Badge className="bg-blue-600 text-white">Featured</Badge>
            )}
            {resource.is_trending && (
              <Badge className="bg-orange-500 text-white">Trending</Badge>
            )}
          </div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight"
          >
            {resource.title}
          </motion.h1>

          {/* Excerpt */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 mb-8 leading-relaxed"
          >
            {resource.excerpt}
          </motion.p>

          {/* Meta Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center gap-6 text-gray-600"
          >
            <div className="flex items-center">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-medium mr-3">
                {resource.author.name.charAt(0)}
              </div>
              <div>
                <div className="font-medium text-gray-900">{resource.author.name}</div>
                <div className="text-sm text-gray-500">Author</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              {formatDate(resource.published_at)}
            </div>
            
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              {resource.reading_time_text}
            </div>
            
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-2" />
              {resource.view_count.toLocaleString()} views
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      {resource.featured_image_url && (
        <section className="relative">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl"
            >
              <Image
                src={resource.featured_image_url}
                alt={resource.title}
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Article Content */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: resource.content }}
              />

              {/* Tags */}
              {resource.tags && resource.tags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-12 pt-8 border-t border-gray-200"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Tag className="h-5 w-5 mr-2" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {resource.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Share Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-12 pt-8 border-t border-gray-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Share this article</h3>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => handleShare('twitter')}
                    className="flex items-center gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    Twitter
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleShare('linkedin')}
                    className="flex items-center gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    LinkedIn
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleShare('facebook')}
                    className="flex items-center gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleShare()}
                    className="flex items-center gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    Copy Link
                  </Button>
                  <div className="text-sm text-gray-500 ml-auto">
                    {shareCount} shares
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-8">
                {/* Table of Contents (you can implement this based on content headings) */}
                
                {/* Quick Stats */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gray-50 rounded-xl p-6"
                >
                  <h3 className="font-semibold text-gray-900 mb-4">Article Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Views</span>
                      <span className="font-medium">{resource.view_count.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shares</span>
                      <span className="font-medium">{shareCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Read Time</span>
                      <span className="font-medium">{resource.reading_time_text}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Published</span>
                      <span className="font-medium">{resource.published_date_formatted}</span>
                    </div>
                  </div>
                </motion.div>

                {/* Author Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
                >
                  <h3 className="font-semibold text-gray-900 mb-4">About the Author</h3>
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-medium mr-4">
                      {resource.author.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{resource.author.name}</div>
                      <div className="text-sm text-gray-500">Content Author</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Expert contributor sharing insights and best practices in {resource.category.toLowerCase()}.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      {(previousResource || nextResource) && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {previousResource && (
                <Link href={`/resources/${previousResource.slug}`}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="group bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Previous Article
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {previousResource.title}
                    </h3>
                  </motion.div>
                </Link>
              )}

              {nextResource && (
                <Link href={`/resources/${nextResource.slug}`}>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="group bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 text-right md:ml-auto"
                  >
                    <div className="flex items-center justify-end text-sm text-gray-500 mb-2">
                      Next Article
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {nextResource.title}
                    </h3>
                  </motion.div>
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Related Resources */}
      {relatedResources.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Related Resources</h2>
              <p className="text-xl text-gray-600">Continue exploring {resource.category.toLowerCase()} insights</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedResources.map((relatedResource, index) => (
                <motion.article
                  key={relatedResource.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Link href={`/resources/${relatedResource.slug}`}>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300">
                      {relatedResource.featured_image_url && (
                        <div className="aspect-video bg-gray-100 relative overflow-hidden">
                          <Image
                            src={relatedResource.featured_image_url}
                            alt={relatedResource.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      
                      <div className="p-6">
                        <Badge variant="outline" className="text-xs mb-3">
                          {relatedResource.category}
                        </Badge>
                        
                        <h3 className="font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {relatedResource.title}
                        </h3>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {relatedResource.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center">
                            <div className="h-6 w-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs mr-2">
                              {relatedResource.author.name.charAt(0)}
                            </div>
                            {relatedResource.author.name}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {relatedResource.read_time}m read
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
    </article>
  );
}
