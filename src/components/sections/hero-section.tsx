import Image from 'next/image';
import { Sparkles, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-24 md:pt-32 lg:pt-40 pb-16 md:pb-24">
      <div className="absolute inset-0 z-0">
        {/* Modern gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-indigo-50 to-sky-50"></div>

        {/* Animated particles */}
        <div
          className="absolute h-1 w-1 rounded-full bg-violet-300 animate-pulse opacity-70"
          style={{ top: '10%', left: '20%' }}
        ></div>
        <div
          className="absolute h-2 w-2 rounded-full bg-indigo-300 animate-pulse opacity-70"
          style={{ top: '30%', left: '80%' }}
        ></div>
        <div
          className="absolute h-1 w-1 rounded-full bg-sky-300 animate-pulse opacity-70"
          style={{ top: '70%', left: '40%' }}
        ></div>
        <div
          className="absolute h-1 w-1 rounded-full bg-violet-300 animate-pulse opacity-70"
          style={{ top: '20%', left: '60%' }}
        ></div>
        <div
          className="absolute h-2 w-2 rounded-full bg-indigo-300 animate-pulse opacity-70"
          style={{ top: '50%', left: '10%' }}
        ></div>
        <div
          className="absolute h-1 w-1 rounded-full bg-sky-300 animate-pulse opacity-70"
          style={{ top: '60%', left: '70%' }}
        ></div>

        {/* Modern geometric shapes */}
        <div className="absolute top-1/4 left-1/5 h-32 w-32 rounded-full border border-violet-200 opacity-20"></div>
        <div className="absolute bottom-1/4 right-1/5 h-48 w-48 rounded-full border border-indigo-200 opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full border border-sky-200 opacity-20"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-violet-100 text-violet-800 text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4 mr-2" />
              <span>AI-Powered Storytelling</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              Create Magical{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
                Bedtime Stories
              </span>{' '}
              in Seconds
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-xl">
              Step Into Storytime transforms your ideas into personalized adventures that captivate
              children's imagination and create lasting memories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-lg px-8 py-6 text-lg font-medium shadow-lg transition-all hover:shadow-xl"
              >
                Start Your Story <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-slate-300 text-slate-700 rounded-lg px-8 py-6 text-lg font-medium"
              >
                Watch Demo
              </Button>
            </div>
            <div className="mt-8 flex items-center">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white overflow-hidden"
                  >
                    <Image src={`/placeholder.svg&text=${i}`} alt="User" width={32} height={32} />
                  </div>
                ))}
              </div>
              <div className="ml-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 text-amber-400" fill="#fbbf24" />
                  ))}
                </div>
                <p className="text-sm text-slate-600">Trusted by 10,000+ families</p>
              </div>
            </div>
          </div>
          <HeroImage />
        </div>
      </div>
    </section>
  );
}

function HeroImage() {
  return (
    <div className="relative">
      <div className="absolute -inset-4 bg-gradient-to-r from-violet-500/20 to-indigo-500/20 rounded-2xl blur-xl"></div>
      <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
        <Image
          src="/placeholder.svg"
          alt="Child stepping into a storybook portal"
          width={500}
          height={500}
          className="w-full h-auto"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex flex-col justify-end p-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-1">Emma's Space Adventure</h3>
            <p className="text-slate-700 text-sm mb-3">
              A personalized journey through the stars with Captain Emma and her robot friend Blip.
            </p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500">Created 2 minutes ago</span>
              <Button
                size="sm"
                variant="ghost"
                className="text-violet-600 hover:text-violet-700 p-0"
              >
                Read Story <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements with modern style */}
      <div className="absolute -top-8 -right-8 bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl p-4 shadow-lg transform rotate-6">
        <Sparkles className="h-6 w-6 text-white" />
      </div>
      <div className="absolute -bottom-6 -left-6 bg-gradient-to-br from-sky-400 to-sky-500 rounded-2xl p-4 shadow-lg transform -rotate-6">
        <BookOpen className="h-6 w-6 text-white" />
      </div>
    </div>
  );
}

import { ChevronRight, BookOpen } from 'lucide-react';
