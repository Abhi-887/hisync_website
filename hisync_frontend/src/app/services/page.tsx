"use client";

import { Shield, Zap, Users, BarChart3, Cloud, Settings, Smartphone, Monitor, CheckCircle, ArrowRight, Award, Target, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/sections/FooterSection";

export default function ServicesPage() {
  const mainServices = [
    {
      icon: <Shield className="w-12 h-12" />,
      title: "Enterprise ERP Solutions",
      description: "Complete end-to-end ERP implementation and customization for Fortune 500 companies",
      features: [
        "Custom ERP Development",
        "SAP Implementation & Migration", 
        "Oracle Cloud Integration",
        "Legacy System Modernization",
        "Real-time Analytics Dashboard"
      ],
      color: "blue",
      popular: true
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: "Process Automation",
      description: "AI-powered workflow automation to streamline your business operations",
      features: [
        "Workflow Design & Optimization",
        "Robotic Process Automation",
        "AI-powered Decision Making",
        "Integration with Existing Systems",
        "Performance Monitoring"
      ],
      color: "indigo"
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Digital Transformation Consulting",
      description: "Expert guidance from Ex-Big 4 consultants for complete digital transformation",
      features: [
        "Strategy Development",
        "Technology Roadmap",
        "Change Management",
        "Training & Support",
        "ROI Optimization"
      ],
      color: "purple"
    }
  ];

  const additionalServices = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Business Intelligence",
      description: "Transform data into actionable insights",
      color: "emerald"
    },
    {
      icon: <Cloud className="w-8 h-8" />,
      title: "Cloud Migration",
      description: "Seamless transition to cloud infrastructure",
      color: "cyan"
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: "System Integration",
      description: "Connect disparate systems efficiently",
      color: "orange"
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobile Solutions",
      description: "Native & cross-platform mobile apps",
      color: "pink"
    },
    {
      icon: <Monitor className="w-8 h-8" />,
      title: "Web Development",
      description: "Modern, responsive web applications",
      color: "teal"
    },
    {
      icon: <Layers className="w-8 h-8" />,
      title: "API Development",
      description: "Scalable API architecture & integration",
      color: "violet"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100",
      indigo: "bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100",
      purple: "bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100",
      emerald: "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100",
      cyan: "bg-cyan-50 border-cyan-200 text-cyan-700 hover:bg-cyan-100",
      orange: "bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100",
      pink: "bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100",
      teal: "bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100",
      violet: "bg-violet-50 border-violet-200 text-violet-700 hover:bg-violet-100"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getIconColors = (color: string) => {
    const colors = {
      blue: "text-blue-600",
      indigo: "text-indigo-600", 
      purple: "text-purple-600",
      emerald: "text-emerald-600",
      cyan: "text-cyan-600",
      orange: "text-orange-600",
      pink: "text-pink-600",
      teal: "text-teal-600",
      violet: "text-violet-600"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Professional Background with Floating Elements */}
      <div className="fixed inset-0 -z-10">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.015]">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: 'linear-gradient(rgba(71, 85, 105, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(71, 85, 105, 0.1) 1px, transparent 1px)',
              backgroundSize: '60px 60px'
            }}
          />
        </div>
        
        {/* Floating Geometric Elements */}
        <div className="absolute top-20 right-16 w-32 h-32 border border-slate-200/60 rounded-3xl rotate-12 animate-pulse" />
        <div className="absolute top-1/3 left-16 w-20 h-20 border-2 border-blue-200/40 rounded-full animate-bounce" style={{animationDuration: '3s'}} />
        <div className="absolute bottom-1/4 right-1/3 w-24 h-24 border border-indigo-200/50 rounded-2xl rotate-45 animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute bottom-32 left-1/4 w-16 h-16 border-2 border-slate-200/60 rounded-xl rotate-12 animate-bounce" style={{animationDuration: '4s', animationDelay: '2s'}} />
        
        {/* Subtle Gradient Orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-50/40 to-slate-50/30 rounded-full blur-3xl animate-pulse" style={{animationDuration: '6s'}} />
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-gradient-to-br from-indigo-50/30 to-blue-50/20 rounded-full blur-3xl animate-pulse" style={{animationDuration: '8s', animationDelay: '3s'}} />
      </div>

      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 lg:pt-32 pb-20 px-4 overflow-hidden">
        {/* Minimal Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Professional Lines */}
          <div className="absolute top-40 left-1/4 w-px h-40 bg-gradient-to-b from-transparent via-slate-200 to-transparent" />
          <div className="absolute top-60 right-1/3 w-40 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
          <div className="absolute bottom-40 right-1/4 w-px h-32 bg-gradient-to-b from-transparent via-indigo-200 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="relative inline-block">
              <Badge 
                variant="outline" 
                className="px-6 py-3 bg-white/80 backdrop-blur-sm text-slate-700 border-slate-200/60 font-medium shadow-sm hover:shadow-lg hover:border-blue-300 hover:text-blue-700 transition-all duration-500 hover:scale-105"
              >
                <Award className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                Enterprise-Grade Solutions
              </Badge>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-full blur opacity-0 hover:opacity-100 transition-opacity duration-500 -z-10" />
            </div>

            {/* Main Heading with Stagger Animation */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-tight tracking-tight">
                <span className="inline-block hover:scale-105 transition-transform duration-300">Transform</span>{" "}
                <span className="inline-block hover:scale-105 transition-transform duration-300 delay-75">Your</span>{" "}
                <span className="inline-block hover:scale-105 transition-transform duration-300 delay-150">Business</span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent inline-block hover:scale-105 transition-transform duration-300 delay-225">
                  Operations
                </span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
              Ex-Big 4 consultants and elite engineers deliver end-to-end solutions. 
              From ERP implementation to AI-powered automation—<span className="text-slate-900 font-medium">One Team</span> for complete digital transformation.
            </p>

            {/* Stats with Enhanced Hover Effects */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
              {[
                { value: "500+", label: "Enterprise Clients", color: "blue" },
                { value: "95%", label: "Success Rate", color: "emerald" },
                { value: "20+", label: "Years Experience", color: "purple" },
                { value: "4.2x", label: "Average ROI", color: "orange" }
              ].map((stat, index) => (
                <div
                  key={index}
                  className="group relative bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-500 hover:scale-105 cursor-pointer overflow-hidden"
                >
                  {/* Hover Background Fill */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${
                    stat.color === 'blue' ? 'from-blue-50 to-blue-100' :
                    stat.color === 'emerald' ? 'from-emerald-50 to-emerald-100' :
                    stat.color === 'purple' ? 'from-purple-50 to-purple-100' :
                    'from-orange-50 to-orange-100'
                  } opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
                  
                  <div className="relative z-10">
                    <div className={`text-3xl font-bold transition-colors duration-300 ${
                      stat.color === 'blue' ? 'text-slate-900 group-hover:text-blue-700' :
                      stat.color === 'emerald' ? 'text-slate-900 group-hover:text-emerald-700' :
                      stat.color === 'purple' ? 'text-slate-900 group-hover:text-purple-700' :
                      'text-slate-900 group-hover:text-orange-700'
                    }`}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-slate-600 group-hover:text-slate-700 transition-colors duration-300 font-medium">
                      {stat.label}
                    </div>
                  </div>
                  
                  {/* Subtle Border Animation */}
                  <div className={`absolute inset-0 rounded-2xl border-2 ${
                    stat.color === 'blue' ? 'border-blue-200' :
                    stat.color === 'emerald' ? 'border-emerald-200' :
                    stat.color === 'purple' ? 'border-purple-200' :
                    'border-orange-200'
                  } opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Services with Enhanced Interactions */}
      <section className="py-24 px-4 relative">
        {/* Section Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/30 to-transparent" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="relative inline-block mb-6">
              <Badge 
                variant="outline" 
                className="px-4 py-2 bg-white/80 backdrop-blur-sm text-slate-700 border-slate-200 font-medium hover:border-blue-300 hover:text-blue-700 transition-all duration-300"
              >
                <Target className="w-4 h-4 mr-2" />
                Core Services
              </Badge>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 hover:text-slate-700 transition-colors duration-300">
              Enterprise Solutions
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Comprehensive services designed to scale with Fortune 500 companies
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {mainServices.map((service, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-3xl border-2 border-slate-200/60 bg-white/50 backdrop-blur-sm hover:bg-white hover:border-slate-300 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer overflow-hidden"
              >
                {/* Animated Background Fill */}
                <div className={`absolute inset-0 ${getColorClasses(service.color).split(' ')[0]} opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-3xl`} />
                
                {/* Popular Badge */}
                {service.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 shadow-lg hover:shadow-xl transition-shadow duration-300">
                      Most Popular
                    </Badge>
                  </div>
                )}

                {/* Content */}
                <div className="relative z-10">
                  <div className={`${getIconColors(service.color)} mb-6 group-hover:scale-110 transition-all duration-500 group-hover:rotate-3`}>
                    {service.icon}
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-slate-800 transition-colors duration-300">
                    {service.title}
                  </h3>

                  <p className="text-slate-600 mb-6 leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
                    {service.description}
                  </p>

                  <div className="space-y-3 mb-8">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-3 group/item">
                        <CheckCircle className={`w-5 h-5 ${getIconColors(service.color)} group-hover/item:scale-110 transition-transform duration-300`} />
                        <span className="text-slate-700 font-medium group-hover:text-slate-800 transition-colors duration-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl transition-all duration-300 group-hover:shadow-lg hover:scale-105"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </div>

                {/* Corner Accent */}
                <div className={`absolute top-0 right-0 w-20 h-20 ${getColorClasses(service.color).split(' ')[0]} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-bl-3xl`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services with Modern Grid */}
      <section className="py-24 px-4 relative bg-gradient-to-b from-white via-slate-50/20 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 hover:text-slate-700 transition-colors duration-300">
              Additional Services
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Complete technology stack coverage for modern enterprises
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalServices.map((service, index) => (
              <div
                key={index}
                className="group relative p-6 rounded-2xl border-2 border-slate-200/60 bg-white/70 backdrop-blur-sm hover:bg-white hover:border-slate-300 hover:shadow-xl transition-all duration-500 hover:scale-105 cursor-pointer overflow-hidden"
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 ${getColorClasses(service.color).split(' ')[0]} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
                
                {/* Icon with Enhanced Animation */}
                <div className={`${getIconColors(service.color)} mb-4 group-hover:scale-125 group-hover:rotate-6 transition-all duration-500 relative z-10`}>
                  {service.icon}
                </div>
                
                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-slate-800 transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 group-hover:text-slate-700 transition-colors duration-300">
                    {service.description}
                  </p>
                </div>

                {/* Hover Arrow */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <ArrowRight className={`w-5 h-5 ${getIconColors(service.color)}`} />
                </div>

                {/* Corner Decoration */}
                <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-tr-2xl" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-4xl mx-auto">
          <div className="group relative bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 rounded-3xl p-12 text-white text-center overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
            {/* Animated Background Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 group-hover:from-blue-600/30 group-hover:to-indigo-600/30 transition-all duration-500" />
            
            {/* Floating Elements */}
            <div className="absolute top-4 right-4 w-16 h-16 border border-white/20 rounded-full opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
            <div className="absolute bottom-4 left-4 w-12 h-12 border border-white/20 rounded-xl opacity-30 group-hover:opacity-70 group-hover:rotate-12 transition-all duration-500" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 group-hover:scale-105 transition-transform duration-300">
                Ready to Transform Your Business?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed group-hover:text-blue-50 transition-colors duration-300">
                Join 500+ enterprise clients who trust us with their digital transformation journey
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="group/btn bg-white text-slate-900 hover:bg-blue-50 font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Get Started Today
                  <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="group/btn border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105"
                >
                  Schedule Consultation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <FooterSection />
    </div>
  );
}
