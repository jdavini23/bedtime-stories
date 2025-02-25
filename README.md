# Bedtime Stories

A Next.js application that generates personalized bedtime stories for children using AI.

## Features

- Generate personalized bedtime stories based on child's name, interests, and preferences
- Multiple story themes (adventure, fantasy, educational, etc.)
- Responsive design for all devices
- Caching system for improved performance
- Fallback to mock stories when API is unavailable

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **Database**: Vercel KV (Redis)
- **AI**: OpenAI GPT-3.5 Turbo
- **Deployment**: Vercel
- **Testing**: Vitest

## Project Structure

```
src/
├── app/                  # Next.js App Router
│   ├── api/              # API routes
│   │   └── generateStory/# Story generation endpoint
│   ├── dashboard/        # Dashboard pages
│   └── ...               # Other app routes
├── components/           # Reusable UI components
├── constants/            # Application constants
├── hooks/                # Custom React hooks
├── lib/                  # Library code
│   └── env.ts            # Environment configuration
├── services/             # Service modules
│   ├── cache.ts          # Cache service
│   └── openai.ts         # OpenAI service
├── types/                # TypeScript type definitions
│   ├── api.ts            # API types
│   └── story.ts          # Story-related types
└── utils/                # Utility functions
    ├── logger.ts         # Logging utility
    ├── mockStoryGenerator.ts # Mock story generation
    └── storyUtils.ts     # Story processing utilities
```

## Environment Variables

Create a `.env.local` file with the following variables:

```
# OpenAI
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key

# Vercel KV
KV_REST_API_URL=your_kv_url
KV_REST_API_TOKEN=your_kv_token

# Feature Flags
ENABLE_MOCK_STORIES=false
ENABLE_CACHING=true

# Performance
STORY_CACHE_TTL_SECONDS=86400
API_TIMEOUT_MS=25000
```

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)

## API Routes

### POST /api/generateStory

Generates a personalized bedtime story.

**Request Body:**

```json
{
  "childName": "Alex",
  "gender": "boy",
  "theme": "adventure",
  "interests": ["dinosaurs", "space"],
  "mostLikedCharacterTypes": ["explorers", "scientists"]
}
```

**Response:**

```json
{
  "id": "story-123",
  "content": "# Alex's Space Adventure\n\nOnce upon a time...",
  "createdAt": "2023-06-15T12:34:56Z",
  "input": { ... },
  "generatedWith": "openai",
  "metadata": {
    "wordCount": 250,
    "readingTime": 2,
    "title": "Alex's Space Adventure"
  }
}
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a pull request

## License

This project is licensed under the MIT License.

## Contact

GitHub: [@jdavini23](https://github.com/jdavini23)

Project Link:
[https://github.com/jdavini23/bedtime-stories](https://github.com/jdavini23/bedtime-stories)
