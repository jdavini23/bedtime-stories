'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSession } from '@/hooks/useSession';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

export default function OnboardingPage() {
  const { isAuthenticated, session } = useSession();
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [interests, setInterests] = useState<string[]>([]);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    redirect('/auth/signin');
  }

  const interestOptions = [
    'Animals', 'Space', 'Adventure', 'Magic', 
    'Dinosaurs', 'Superheroes', 'Nature', 'Science'
  ];

  const handleInterestToggle = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async () => {
    // TODO: Implement user preference saving logic
    console.log('Onboarding data:', { childName, childAge, interests });
    redirect('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: 0.5, 
          type: "spring", 
          stiffness: 120 
        }}
        className="max-w-md w-full space-y-8 p-10 bg-white rounded-2xl shadow-2xl border border-gray-100"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
            Welcome, {session?.user?.name?.split(' ')[0]}!
          </h2>
          <p className="text-gray-600 mb-6">
            Let's personalize your Bedtime Stories experience
          </p>
        </div>

        <div className="space-y-4">
          <Input 
            label="Child's Name"
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            placeholder="Enter your child's name"
          />

          <Select 
            label="Child's Age"
            value={childAge}
            onChange={(e) => setChildAge(e.target.value)}
            options={Array.from({length: 12}, (_, i) => `${i + 3}`)}
            placeholder="Select age"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interests
            </label>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map(interest => (
                <Button
                  key={interest}
                  variant={interests.includes(interest) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleInterestToggle(interest)}
                  className={`
                    ${interests.includes(interest) 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                      : 'text-gray-600 border-gray-300'}
                  `}
                >
                  {interest}
                </Button>
              ))}
            </div>
          </div>

          <Button 
            onClick={handleSubmit}
            disabled={!childName || !childAge || interests.length === 0}
            className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Start Creating Stories
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
