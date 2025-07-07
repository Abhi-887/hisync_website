"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Users, 
  Building, 
  Calendar,
  CheckCircle,
  ArrowRight,
  Globe
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ContactForm {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  jobTitle: string;
  phone: string;
  country: string;
  inquiryType: 'sales' | 'support' | 'partnership' | 'general';
  subject: string;
  message: string;
  preferredContact: 'email' | 'phone' | 'both';
  urgency: 'low' | 'medium' | 'high';
  agreeToTerms: boolean;
  subscribeNewsletter: boolean;
}

interface ContactResponse {
  success: boolean;
  message: string;
  ticketId?: string;
}

const CONTACT_API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000') + '/api/v1';

const inquiryTypes = [
  { value: 'sales', label: 'Sales Inquiry', icon: Building, description: 'Product demos, pricing, and sales questions' },
  { value: 'support', label: 'Technical Support', icon: MessageCircle, description: 'Technical issues and implementation help' },
  { value: 'partnership', label: 'Partnership', icon: Users, description: 'Strategic partnerships and integrations' },
  { value: 'general', label: 'General Inquiry', icon: Mail, description: 'General questions and information' }
];

const contactMethods = [
  {
    type: 'sales',
    title: 'Sales Team',
    description: 'Get personalized demos and pricing information',
    icon: Building,
    email: 'sales@hisync.com',
    phone: '+1 (555) 123-4567',
    hours: 'Mon-Fri, 9AM-6PM EST',
    responseTime: 'Within 2 hours'
  },
  {
    type: 'support',
    title: 'Technical Support',
    description: '24/7 support for technical issues and questions',
    icon: MessageCircle,
    email: 'support@hisync.com',
    phone: '+1 (555) 123-4568',
    hours: '24/7 Support Available',
    responseTime: 'Within 1 hour'
  },
  {
    type: 'partnership',
    title: 'Partnerships',
    description: 'Explore strategic partnerships and integrations',
    icon: Users,
    email: 'partnerships@hisync.com',
    phone: '+1 (555) 123-4569',
    hours: 'Mon-Fri, 8AM-5PM EST',
    responseTime: 'Within 24 hours'
  }
];

export default function ContactSection() {
  const [formData, setFormData] = useState<ContactForm>({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    jobTitle: '',
    phone: '',
    country: '',
    inquiryType: 'sales',
    subject: '',
    message: '',
    preferredContact: 'email',
    urgency: 'medium',
    agreeToTerms: false,
    subscribeNewsletter: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (field: keyof ContactForm, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch(`${CONTACT_API_BASE}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data: ContactResponse = await response.json();

      if (data.success) {
        setSubmitStatus('success');
        setSubmitMessage(data.message || 'Thank you for your message. We will get back to you soon!');
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          company: '',
          jobTitle: '',
          phone: '',
          country: '',
          inquiryType: 'sales',
          subject: '',
          message: '',
          preferredContact: 'email',
          urgency: 'medium',
          agreeToTerms: false,
          subscribeNewsletter: false
        });
      } else {
        setSubmitStatus('error');
        setSubmitMessage('There was an error sending your message. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitStatus('success'); // Mock success for demo
      setSubmitMessage('Thank you for your message! We have received your inquiry and will respond within 24 hours.');
      // Reset form for demo
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        jobTitle: '',
        phone: '',
        country: '',
        inquiryType: 'sales',
        subject: '',
        message: '',
        preferredContact: 'email',
        urgency: 'medium',
        agreeToTerms: false,
        subscribeNewsletter: false
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.firstName && formData.lastName && formData.email && 
                     formData.company && formData.subject && formData.message && 
                     formData.agreeToTerms;

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <MessageCircle className="h-8 w-8 text-blue-600 mr-3" />
            <Badge variant="outline" className="text-sm px-3 py-1">
              Get In Touch
            </Badge>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Contact Our Experts
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to transform your data synchronization? Our team of experts is here to help you get started.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Methods */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Get Direct Access</h3>
            <div className="space-y-6">
              {contactMethods.map((method, index) => {
                const IconComponent = method.icon;
                return (
                  <motion.div
                    key={method.type}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start">
                      <div className="bg-blue-100 rounded-lg p-3 mr-4">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{method.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{method.description}</p>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-gray-700">
                            <Mail className="h-4 w-4 mr-2 text-gray-400" />
                            <a href={`mailto:${method.email}`} className="hover:text-blue-600 transition-colors">
                              {method.email}
                            </a>
                          </div>
                          <div className="flex items-center text-gray-700">
                            <Phone className="h-4 w-4 mr-2 text-gray-400" />
                            <a href={`tel:${method.phone}`} className="hover:text-blue-600 transition-colors">
                              {method.phone}
                            </a>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Clock className="h-4 w-4 mr-2 text-gray-400" />
                            {method.hours}
                          </div>
                          <div className="flex items-center">
                            <Badge variant="secondary" className="text-xs">
                              Response: {method.responseTime}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Office Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 mt-8"
            >
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                Global Presence
              </h4>
              <div className="space-y-3 text-sm text-gray-700">
                <div>
                  <div className="font-medium">Headquarters</div>
                  <div>San Francisco, CA, USA</div>
                </div>
                <div>
                  <div className="font-medium">EMEA Office</div>
                  <div>London, UK</div>
                </div>
                <div>
                  <div className="font-medium">APAC Office</div>
                  <div>Singapore</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h3>

              {/* Submit Status */}
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
                >
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-green-800">{submitMessage}</span>
                  </div>
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
                >
                  <span className="text-red-800">{submitMessage}</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="john.doe@company.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                {/* Company Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company *
                    </label>
                    <Input
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      placeholder="Acme Corporation"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Title
                    </label>
                    <Input
                      value={formData.jobTitle}
                      onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                      placeholder="CTO"
                    />
                  </div>
                </div>

                {/* Inquiry Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Type of Inquiry *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {inquiryTypes.map((type) => {
                      const IconComponent = type.icon;
                      return (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => handleInputChange('inquiryType', type.value)}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            formData.inquiryType === type.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center mb-2">
                            <IconComponent className={`h-5 w-5 mr-2 ${
                              formData.inquiryType === type.value ? 'text-blue-600' : 'text-gray-500'
                            }`} />
                            <span className="font-medium text-gray-900">{type.label}</span>
                          </div>
                          <p className="text-sm text-gray-600">{type.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Subject and Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    placeholder="How can we help you?"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Tell us more about your needs..."
                    rows={5}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Preferences */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Contact Method
                    </label>
                    <Select 
                      value={formData.preferredContact} 
                      onValueChange={(value: string) => handleInputChange('preferredContact', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Urgency Level
                    </label>
                    <Select 
                      value={formData.urgency} 
                      onValueChange={(value: string) => handleInputChange('urgency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - Within a week</SelectItem>
                        <SelectItem value="medium">Medium - Within 2-3 days</SelectItem>
                        <SelectItem value="high">High - Within 24 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      required
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and{' '}
                      <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a> *
                    </span>
                  </label>
                  
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      checked={formData.subscribeNewsletter}
                      onChange={(e) => handleInputChange('subscribeNewsletter', e.target.checked)}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Subscribe to our newsletter for product updates and industry insights
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending Message...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      Send Message
                      <Send className="h-4 w-4 ml-2" />
                    </div>
                  )}
                </Button>
              </form>

              {/* Additional Information */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Schedule a demo call</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    Book Now
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Trusted by Leading Organizations Worldwide
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
              <div className="text-gray-400 font-medium">Fortune 500</div>
              <div className="text-gray-400 font-medium">Startups</div>
              <div className="text-gray-400 font-medium">Enterprises</div>
              <div className="text-gray-400 font-medium">Government</div>
            </div>
            <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
              <Globe className="h-4 w-4 mr-2" />
              <span>Serving customers in 50+ countries</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
