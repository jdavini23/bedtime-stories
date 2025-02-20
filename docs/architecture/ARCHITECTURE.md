# Software Requirements Specification (SRS) - Bedtime Story Magic

## System Design
Bedtime Story Magic is a web application that allows parents to generate, customize, and save AI-generated bedtime stories for their children. Users can interact with a step-by-step story creation wizard, personalize preferences, and retrieve saved stories from their dashboard.

## Architecture Pattern
- **Serverless with Modular Monorepo**
- Uses **Next.js 14 (App Router)** for frontend and API routes
- Backend API functions deployed as **Vercel Edge Functions**
- **PostgreSQL with Prisma ORM** for structured storage of user data
- **Vercel KV** for caching temporary story data

## State Management
- **React Query (TanStack Query)** for API data fetching and caching
- **Zustand or Context API** for local UI state (wizard steps, toggles, etc.)

## Data Flow
1. User inputs preferences in the story creation wizard.
2. Data is sent to **Next.js API routes**.
3. API processes request and calls **OpenAI GPT** to generate a story.
4. The generated story is stored **temporarily in Vercel KV**.
5. If saved, the story is stored in **PostgreSQL** under the user’s account.
6. User can retrieve and modify saved stories from their dashboard.

## Technical Stack
- **Frontend:** Next.js 14 (App Router), Tailwind CSS, Framer Motion
- **Backend:** Next.js API Routes (Serverless), Vercel Edge Functions
- **Database:** PostgreSQL (Prisma ORM)
- **Authentication:** Clerk
- **State Management:** React Query, Zustand/Context API
- **Hosting & Deployment:** Vercel
- **Caching:** Vercel KV, React Query Caching

## Authentication Process
- Uses **Clerk** for user authentication and session management.
- Users can sign up/login via email, Google, or other OAuth providers.
- Authentication tokens are used for API access and personalization.

## Route Design
- `/` → Home
- `/dashboard` → User dashboard (saved stories, preferences)
- `/story/new` → Story creation wizard
- `/story/:id` → Story preview & interactions
- `/settings` → Account settings

## API Design
- `POST /api/story/generate` → Generates a new story
- `GET /api/story/:id` → Fetches a saved story
- `POST /api/story/save` → Saves a generated story
- `GET /api/user/preferences` → Fetches user preferences
- `POST /api/user/preferences` → Updates user preferences

## Database Design (ERD)
**Tables:**
- `users` → Stores user details (id, email, auth_provider, created_at)
- `stories` → Stores generated stories (id, user_id, title, content, created_at)
- `preferences` → Stores user customization options (id, user_id, preferences_json)
- `subscriptions` → Stores payment info for premium features (id, user_id, plan, status, created_at)

---

### Next Steps:
- Implement the Next.js frontend with the wizard flow.
- Develop API routes for story generation and retrieval.
- Set up the PostgreSQL database with Prisma migrations.
- Integrate Clerk authentication.
- Deploy to Vercel.

This SRS document will serve as a foundational guide for development. Let me know if you need any modifications!
