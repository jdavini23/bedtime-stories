"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BookOpen, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  // Handle scroll events for navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY
      if (offset > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }

      // Determine active section based on scroll position
      const sections = ["home", "features", "how-it-works", "stories", "pricing"]
      for (const section of sections.reverse()) {
        const element = document.getElementById(section)
        if (element && window.scrollY >= element.offsetTop - 100) {
          setActiveSection(section)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center mr-3 shadow-md transition-transform duration-300 group-hover:scale-110">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span
              className={`text-lg font-bold transition-colors duration-300 ${
                scrolled ? "text-slate-900" : "text-slate-800"
              }`}
            >
              Step Into Storytime
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink href="#home" active={activeSection === "home"} scrolled={scrolled}>
              Home
            </NavLink>
            <NavLink href="#features" active={activeSection === "features"} scrolled={scrolled}>
              Features
            </NavLink>
            <NavLink href="#how-it-works" active={activeSection === "how-it-works"} scrolled={scrolled}>
              How It Works
            </NavLink>
            <NavLink href="#stories" active={activeSection === "stories"} scrolled={scrolled}>
              Stories
            </NavLink>
            <NavLink href="#pricing" active={activeSection === "pricing"} scrolled={scrolled}>
              Pricing
            </NavLink>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button
              variant="ghost"
              className={`rounded-lg px-4 transition-colors ${
                scrolled
                  ? "text-slate-700 hover:text-violet-600 hover:bg-violet-50"
                  : "text-slate-700 hover:text-violet-600 hover:bg-white/20"
              }`}
            >
              Log in
            </Button>
            <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-lg px-5 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              className={`p-2 rounded-lg transition-colors ${
                scrolled ? "text-slate-700 hover:bg-slate-100" : "text-slate-700 hover:bg-white/20"
              }`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu with Animation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-b border-slate-100 shadow-lg overflow-hidden"
          >
            <div className="container mx-auto px-4 py-5 space-y-1">
              <MobileNavLink href="#home" active={activeSection === "home"} onClick={() => setIsMenuOpen(false)}>
                Home
              </MobileNavLink>
              <MobileNavLink
                href="#features"
                active={activeSection === "features"}
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </MobileNavLink>
              <MobileNavLink
                href="#how-it-works"
                active={activeSection === "how-it-works"}
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </MobileNavLink>
              <MobileNavLink href="#stories" active={activeSection === "stories"} onClick={() => setIsMenuOpen(false)}>
                Stories
              </MobileNavLink>
              <MobileNavLink href="#pricing" active={activeSection === "pricing"} onClick={() => setIsMenuOpen(false)}>
                Pricing
              </MobileNavLink>

              <div className="pt-4 flex flex-col space-y-3">
                <Button variant="outline" className="w-full justify-center rounded-lg border-slate-200">
                  Log in
                </Button>
                <Button className="w-full justify-center bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-lg shadow-md">
                  Get Started
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

// Desktop Navigation Link Component
function NavLink({ href, active, scrolled, children }) {
  return (
    <Link
      href={href}
      className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 group ${
        active
          ? scrolled
            ? "text-violet-600"
            : "text-violet-600"
          : scrolled
            ? "text-slate-600 hover:text-violet-600"
            : "text-slate-700 hover:text-violet-600"
      }`}
    >
      {children}
      {active && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute bottom-0 left-0 right-0 h-1 mx-4 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </Link>
  )
}

// Mobile Navigation Link Component
function MobileNavLink({ href, active, onClick, children }) {
  return (
    <Link
      href={href}
      className={`block py-3 px-4 rounded-lg font-medium transition-colors ${
        active ? "bg-violet-50 text-violet-600" : "text-slate-600 hover:bg-slate-50 hover:text-violet-600"
      }`}
      onClick={onClick}
    >
      {children}
    </Link>
  )
}

