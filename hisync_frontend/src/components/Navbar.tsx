"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Phone, ArrowRight, Shield, Zap, Users, Menu, X } from "lucide-react";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollToSection } = useSmoothScroll();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (path: string) => pathname === path;

  const services = [
    {
      title: "ERP Solutions",
      href: "#erp",
      description: "Complete enterprise resource planning solutions",
      icon: <Shield className="w-5 h-5" />
    },
    {
      title: "Process Automation",
      href: "#automation", 
      description: "Streamline your business operations",
      icon: <Zap className="w-5 h-5" />
    },
    {
      title: "Consulting",
      href: "#consulting",
      description: "Expert guidance for digital transformation",
      icon: <Users className="w-5 h-5" />
    }
  ];

  return (
    <nav
      className={`${isScrolled ? 'fixed top-0 z-[9999] w-full' : 'absolute top-0 w-full z-50'} transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-xl border-b border-gray-200/50 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center z-10" aria-label="Home">
            <Image
              src="/images/logo/hisync_logo_black_one.webp"
              alt="HISYNC Logo"
              width={120}
              height={90}
              priority
              className="hover:scale-105 transition-transform duration-200"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center">
            <NavigationMenu>
              <NavigationMenuList className="flex items-center space-x-1">
                {/* Home */}
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link 
                      href="/"
                    className={cn(
                        navigationMenuTriggerStyle(),
                        "bg-transparent font-medium rounded-lg h-9 px-4 text-sm transition-all duration-200",
                        isScrolled 
                          ? "text-gray-700 hover:text-blue-600 hover:bg-gray-100/60" 
                          : "text-gray-800 hover:text-blue-600 hover:bg-white/20"
                    )}
                    >
                      Home
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Services */}
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link 
                      href="/services"
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "bg-transparent font-medium rounded-lg h-9 px-4 text-sm transition-all duration-200",
                        isActive("/services")
                          ? "bg-blue-100 text-blue-700 font-semibold"
                          : isScrolled 
                            ? "text-gray-700 hover:text-blue-600 hover:bg-gray-100/60" 
                            : "text-gray-800 hover:text-blue-600 hover:bg-white/20"
                      )}
                    >
                      Services
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Product */}
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link 
                      href="/product"
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "bg-transparent font-medium rounded-lg h-9 px-4 text-sm transition-all duration-200",
                        isActive("/product")
                          ? "bg-blue-100 text-blue-700 font-semibold"
                          : isScrolled 
                            ? "text-gray-700 hover:text-blue-600 hover:bg-gray-100/60" 
                            : "text-gray-800 hover:text-blue-600 hover:bg-white/20"
                      )}
                    >
                      Our Product
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* About */}
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link 
                      href="/about"
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "bg-transparent font-medium rounded-lg h-9 px-4 text-sm transition-all duration-200",
                        isActive("/about")
                          ? "bg-blue-100 text-blue-700 font-semibold"
                          : isScrolled 
                            ? "text-gray-700 hover:text-blue-600 hover:bg-gray-100/60" 
                            : "text-gray-800 hover:text-blue-600 hover:bg-white/20"
                      )}
                    >
                      About
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Contact */}
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link 
                      href="/contact"
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "bg-transparent font-medium rounded-lg h-9 px-4 text-sm transition-all duration-200",
                        isActive("/contact")
                          ? "bg-blue-100 text-blue-700 font-semibold"
                          : isScrolled 
                            ? "text-gray-700 hover:text-blue-600 hover:bg-gray-100/60" 
                            : "text-gray-800 hover:text-blue-600 hover:bg-white/20"
                      )}
                    >
                      Contact
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "font-medium px-4 py-2 rounded-lg transition-all duration-200 h-9",
                isScrolled 
                  ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100/60"
                  : "text-gray-800 hover:text-gray-700 hover:bg-white/20"
              )}
            >
              <Phone className="w-4 h-4 mr-2" />
              <span className="hidden lg:inline">Schedule Call</span>
              <span className="lg:hidden">Call</span>
            </Button>
            
            <Button 
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 h-9"
            >
              <span className="hidden lg:inline">Get Started</span>
              <span className="lg:hidden">Start</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={cn(
              "lg:hidden p-2 rounded-lg transition-all duration-200",
              isScrolled 
                ? "hover:bg-gray-100/60" 
                : "hover:bg-white/20"
            )}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`block transition-all duration-200 ease-out h-0.5 w-6 rounded-sm ${
                isScrolled ? 'bg-gray-700' : 'bg-gray-800'
              } ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'}`}></span>
              <span className={`block transition-all duration-200 ease-out h-0.5 w-6 rounded-sm my-0.5 ${
                isScrolled ? 'bg-gray-700' : 'bg-gray-800'
              } ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
              <span className={`block transition-all duration-200 ease-out h-0.5 w-6 rounded-sm ${
                isScrolled ? 'bg-gray-700' : 'bg-gray-800'
              } ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-lg transition-all duration-200 ${
          isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-4 py-4 space-y-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
          {/* Navigation Links */}
          <Link
            href="/"
            className={cn(
              "flex items-center justify-between py-3 px-4 rounded-lg font-medium transition-all duration-200 group",
              isActive("/")
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            )}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span>Home</span>
          </Link>

          <Link
            href="/services"
            className={cn(
              "flex items-center justify-between py-3 px-4 rounded-lg font-medium transition-all duration-200 group",
              isActive("/services")
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            )}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span>Services</span>
            {isActive("/services") && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
          </Link>

          <Link
            href="/product"
            className={cn(
              "flex items-center justify-between py-3 px-4 rounded-lg font-medium transition-all duration-200 group",
              isActive("/product")
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            )}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span>Our Product</span>
            {isActive("/product") && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
          </Link>

          <Link
            href="/about"
            className={cn(
              "flex items-center justify-between py-3 px-4 rounded-lg font-medium transition-all duration-200 group",
              isActive("/about")
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            )}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span>About</span>
            {isActive("/about") && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
          </Link>

          <Link
            href="/contact"
            className={cn(
              "flex items-center justify-between py-3 px-4 rounded-lg font-medium transition-all duration-200 group",
              isActive("/contact")
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            )}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span>Contact</span>
            {isActive("/contact") && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
          </Link>
          
          {/* CTA Buttons */}
          <div className="pt-4 border-t border-gray-200/50 space-y-3 mt-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium py-3 px-4 rounded-lg"
            >
              <Phone className="w-4 h-4 mr-3" />
              Schedule Call
            </Button>
            
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
              <span className="flex items-center justify-center">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
