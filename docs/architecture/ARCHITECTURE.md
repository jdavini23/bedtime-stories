# Architecture Overview

## Tech Stack
- Frontend: Next.js 14, TypeScript, Tailwind CSS
- Authentication: Clerk
- AI Integration: OpenAI GPT
- Data Storage: Vercel KV
- Analytics: Vercel Analytics

## Directory Structure
```/app
├── (auth)         # Authentication related pages
├── (dashboard)    # User dashboard pages
├── api           # API routes
├── components    # Reusable components
│   ├── ui        # Basic UI components
│   ├── forms     # Form components
│   └── stories   # Story-related components
├── lib          # Utility functions and shared logic
├── styles       # Global styles
└── types        # TypeScript type definitions