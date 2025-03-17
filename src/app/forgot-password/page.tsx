import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-violet-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and branding */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center mb-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center mr-3 shadow-md">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900">Step Into Storytime</span>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Reset your password</h1>
          <p className="text-slate-600">We'll send you a link to reset your password</p>
        </div>

        {/* Forgot password form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">
                Email address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="h-12"
                placeholder="Enter your email address"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium"
            >
              Send reset link
            </Button>
          </form>
        </div>

        {/* Back to sign in */}
        <div className="text-center">
          <Link
            href="/sign-in"
            className="inline-flex items-center text-violet-600 hover:text-violet-700 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
