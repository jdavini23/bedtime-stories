'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestApiPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cloud to-lavender/20 dark:from-midnight dark:to-primary/20 p-4">
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm">
              ← Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-center text-midnight dark:text-text-primary">
            OpenAI API Key Test
          </h1>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>

        <div className="max-w-2xl mx-auto">
          <p className="text-center mb-8 text-gray-600 dark:text-gray-300">
            Use this page to verify that your OpenAI API key is configured correctly.
          </p>

          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle>OpenAI API Key Tester</CardTitle>
              <CardDescription>API Key testing feature is currently unavailable</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                This feature has been temporarily removed. Please ensure you have added{' '}
                <code className="bg-gray-100 px-1 py-0.5 rounded">OPENAI_API_KEY</code> to your
                environment variables.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
