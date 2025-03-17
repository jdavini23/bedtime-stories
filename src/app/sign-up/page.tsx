import Link from "next/link"
import { BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function SignUpPage() {
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
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Create an account</h1>
          <p className="text-slate-600">Start your storytelling journey today</p>
        </div>

        {/* Sign-up form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700">
                Full name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                className="h-12"
                placeholder="Enter your full name"
                required
              />
            </div>

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

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                className="h-12"
                placeholder="Create a password"
                required
              />
              <p className="text-xs text-slate-500">Must be at least 8 characters long</p>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox id="terms" className="mt-1" />
              <Label htmlFor="terms" className="text-sm text-slate-600 font-normal cursor-pointer">
                I agree to the{" "}
                <Link href="/terms" className="text-violet-600 hover:text-violet-700">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-violet-600 hover:text-violet-700">
                  Privacy Policy
                </Link>
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium"
            >
              Create account
            </Button>
          </form>
        </div>

        {/* Sign in link */}
        <div className="text-center">
          <p className="text-slate-600">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-violet-600 hover:text-violet-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

