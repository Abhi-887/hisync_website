"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Search, ThumbsUp, ThumbsDown, Filter, Tag, HelpCircle, Star, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  slug: string;
  is_featured: boolean;
  tags: string[];
  view_count: number;
  helpful_count: number;
  not_helpful_count: number;
  helpfulness_ratio: number;
}

interface FAQResponse {
  success: boolean;
  data: {
    faqs: FAQ[];
    grouped_faqs: Record<string, FAQ[]>;
    categories: Record<string, number>;
    total_count: number;
  };
}

const FAQ_API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000') + '/api/v1';

// Mock data for development/fallback
const mockFAQs: FAQ[] = [
  {
    id: 1,
    question: "What is HiSync and how does it work?",
    answer: "HiSync is a powerful synchronization platform that helps you keep your data in sync across multiple devices and applications. It works by creating secure connections between your devices and automatically syncing your important data in real-time.",
    category: "General",
    slug: "what-is-hisync",
    is_featured: true,
    tags: ["sync", "platform", "data"],
    view_count: 1250,
    helpful_count: 45,
    not_helpful_count: 3,
    helpfulness_ratio: 0.9375
  },
  {
    id: 2,
    question: "How do I set up my first sync?",
    answer: "Setting up your first sync is easy! Simply connect your devices using our setup wizard, choose what data you want to sync, and we'll handle the rest. The process typically takes less than 5 minutes.",
    category: "Getting Started",
    slug: "first-sync-setup",
    is_featured: true,
    tags: ["setup", "getting-started", "sync"],
    view_count: 890,
    helpful_count: 38,
    not_helpful_count: 2,
    helpfulness_ratio: 0.95
  },
  {
    id: 3,
    question: "Is my data secure with HiSync?",
    answer: "Absolutely! We use end-to-end encryption to protect your data during transmission and storage. Your data is encrypted before it leaves your device and can only be decrypted by your authorized devices.",
    category: "Security",
    slug: "data-security",
    is_featured: false,
    tags: ["security", "encryption", "privacy"],
    view_count: 654,
    helpful_count: 42,
    not_helpful_count: 1,
    helpfulness_ratio: 0.977
  }
];

const mockCategories = {
  "General": 5,
  "Getting Started": 8,
  "Security": 3,
  "Pricing": 4
};

export default function FAQSection() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [groupedFaqs, setGroupedFaqs] = useState<Record<string, FAQ[]>>({});
  const [categories, setCategories] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [votedItems, setVotedItems] = useState<Record<number, 'helpful' | 'not_helpful'>>({});

  useEffect(() => {
    console.log('FAQ Component: useEffect triggered', { searchTerm, selectedCategory, showFeaturedOnly });
    fetchFAQs();
  }, [searchTerm, selectedCategory, showFeaturedOnly]);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (showFeaturedOnly) params.append('featured', 'true');
      
      const response = await fetch(`${FAQ_API_BASE}/faqs?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: FAQResponse = await response.json();
      
      if (data.success && data.data) {
        setFaqs(Array.isArray(data.data.faqs) ? data.data.faqs : []);
        setGroupedFaqs(data.data.grouped_faqs || {});
        setCategories(data.data.categories || {});
      } else {
        // Fallback to mock data
        console.log('API response not successful, using mock data');
        setFaqs(mockFAQs);
        setGroupedFaqs({});
        setCategories(mockCategories);
      }
    } catch (error) {
      console.error('Error fetching FAQs, using mock data:', error);
      // Fallback to mock data on error
      setFaqs(mockFAQs);
      setGroupedFaqs({});
      setCategories(mockCategories);
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (id: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const handleVote = async (faq: FAQ, isHelpful: boolean) => {
    if (!faq || !faq.id || !faq.slug || votedItems[faq.id]) return; // Already voted or invalid FAQ

    try {
      const response = await fetch(`${FAQ_API_BASE}/faqs/${faq.slug}/helpful`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ helpful: isHelpful }),
      });

      if (response.ok) {
        setVotedItems(prev => ({
          ...prev,
          [faq.id]: isHelpful ? 'helpful' : 'not_helpful'
        }));

        // Update the FAQ counts locally
        setFaqs(prevFaqs => 
          prevFaqs.map(f => 
            f && f.id === faq.id 
              ? {
                  ...f,
                  helpful_count: isHelpful ? (f.helpful_count || 0) + 1 : (f.helpful_count || 0),
                  not_helpful_count: !isHelpful ? (f.not_helpful_count || 0) + 1 : (f.not_helpful_count || 0),
                }
              : f
          )
        );
      }
    } catch (error) {
      console.error('Error voting on FAQ:', error);
    }
  };

  const filteredFAQs = (faqs || []).filter(faq => {
    if (!faq) return false;
    
    const matchesSearch = !searchTerm || 
      (faq.question && faq.question.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (faq.answer && faq.answer.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (Array.isArray(faq.tags) && faq.tags.some(tag => tag && tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesFeatured = !showFeaturedOnly || faq.is_featured;
    
    return matchesSearch && matchesCategory && matchesFeatured;
  });

  const featuredFAQs = filteredFAQs.filter(faq => faq && faq.is_featured);
  const regularFAQs = filteredFAQs.filter(faq => faq && !faq.is_featured);

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <HelpCircle className="h-8 w-8 text-blue-600 mr-3" />
            <Badge variant="outline" className="text-sm px-3 py-1">
              Frequently Asked Questions
            </Badge>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Got Questions? We Have Answers
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to the most common questions about our platform, features, and services.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Search */}
              <div className="md:col-span-5">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search FAQs..."
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="md:col-span-3">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
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

              {/* Featured Filter */}
              <div className="md:col-span-2">
                <Button
                  variant={showFeaturedOnly ? "default" : "outline"}
                  onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
                  className="w-full"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Featured
                </Button>
              </div>

              {/* Stats */}
              <div className="md:col-span-2">
                <div className="text-center">
                  <div className="text-sm text-gray-500">Total FAQs</div>
                  <div className="text-lg font-semibold text-gray-900">{filteredFAQs.length}</div>
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

        {/* FAQ Content */}
        {!loading && (
          <div className="space-y-8">
            {/* Featured FAQs */}
            {featuredFAQs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                    <Star className="h-6 w-6 text-yellow-500 mr-2" />
                    Featured Questions
                  </h3>
                  <p className="text-gray-600">Most popular and important questions</p>
                </div>
                <div className="space-y-4">
                  {featuredFAQs.map((faq, index) => (
                    <FAQItem
                      key={faq?.id || index}
                      faq={faq}
                      isOpen={openItems.has(faq?.id || 0)}
                      onToggle={() => faq?.id && toggleItem(faq.id)}
                      onVote={handleVote}
                      userVote={faq?.id ? votedItems[faq.id] : undefined}
                      index={index}
                      featured={true}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Regular FAQs by Category */}
            {Object.entries(
              regularFAQs.reduce((acc, faq) => {
                if (!faq || !faq.category) return acc;
                if (!acc[faq.category]) acc[faq.category] = [];
                acc[faq.category].push(faq);
                return acc;
              }, {} as Record<string, FAQ[]>)
            ).map(([category, categoryFAQs]) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <h3 className="text-2xl font-bold text-gray-900">{category}</h3>
                    <Badge variant="secondary" className="ml-3">
                      {(categoryFAQs || []).length} questions
                    </Badge>
                  </div>
                </div>
                <div className="space-y-4">
                  {(categoryFAQs || []).map((faq, index) => (
                    <FAQItem
                      key={faq?.id || index}
                      faq={faq}
                      isOpen={openItems.has(faq?.id || 0)}
                      onToggle={() => faq?.id && toggleItem(faq.id)}
                      onVote={handleVote}
                      userVote={faq?.id ? votedItems[faq.id] : undefined}
                      index={index}
                      featured={false}
                    />
                  ))}
                </div>
              </motion.div>
            ))}

            {/* No Results */}
            {filteredFAQs.length === 0 && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center py-12"
              >
                <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No FAQs Found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search terms or category filter.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setShowFeaturedOnly(false);
                  }}
                >
                  Clear Filters
                </Button>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

interface FAQItemProps {
  faq: FAQ;
  isOpen: boolean;
  onToggle: () => void;
  onVote: (faq: FAQ, isHelpful: boolean) => void;
  userVote?: 'helpful' | 'not_helpful';
  index: number;
  featured: boolean;
}

function FAQItem({ faq, isOpen, onToggle, onVote, userVote, index, featured }: FAQItemProps) {
  // Defensive checks to prevent errors with undefined data
  if (!faq) {
    return null;
  }

  const safeVoteCount = (count: number | undefined) => count || 0;
  const safeTags = Array.isArray(faq.tags) ? faq.tags : [];
  const safeViewCount = faq.view_count || 0;
  const safeHelpfulCount = faq.helpful_count || 0;
  const safeNotHelpfulCount = faq.not_helpful_count || 0;
  const safeHelpfulnessRatio = faq.helpfulness_ratio || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden ${
        featured ? 'ring-2 ring-yellow-200 bg-gradient-to-r from-yellow-50 to-white' : ''
      }`}
    >
      {/* Question Header */}
      <button
        onClick={onToggle}
        className="w-full px-6 py-5 text-left hover:bg-gray-50 transition-colors duration-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              {featured && <Star className="h-4 w-4 text-yellow-500 mr-2" />}
              <h4 className="text-lg font-semibold text-gray-900 pr-4">
                {faq.question || 'Untitled Question'}
              </h4>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <Badge variant="outline" className="text-xs">
                {faq.category || 'General'}
              </Badge>
              {safeTags.map((tag, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {safeViewCount.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="ml-4">
            {isOpen ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>
      </button>

      {/* Answer Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6">
              <div className="border-t border-gray-100 pt-4">
                <div className="prose prose-sm max-w-none text-gray-700 mb-6">
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {faq.answer || 'No answer provided.'}
                  </p>
                </div>

                {/* Voting Section */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">Was this helpful?</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={userVote === 'helpful' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => onVote(faq, true)}
                        disabled={!!userVote}
                        className="flex items-center gap-1"
                      >
                        <ThumbsUp className="h-4 w-4" />
                        {safeHelpfulCount}
                      </Button>
                      <Button
                        variant={userVote === 'not_helpful' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => onVote(faq, false)}
                        disabled={!!userVote}
                        className="flex items-center gap-1"
                      >
                        <ThumbsDown className="h-4 w-4" />
                        {safeNotHelpfulCount}
                      </Button>
                    </div>
                  </div>

                  {/* Helpfulness Ratio */}
                  {(safeHelpfulCount + safeNotHelpfulCount) > 0 && (
                    <div className="text-sm text-gray-500">
                      {(safeHelpfulnessRatio * 100).toFixed(0)}% found this helpful
                    </div>
                  )}
                </div>

                {userVote && (
                  <div className="mt-2 text-sm text-green-600">
                    Thank you for your feedback!
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
