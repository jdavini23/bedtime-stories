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

- Node.js 20+
- npm 10+
- Clerk Account
- OpenAI API Key (required for AI story generation)

## Environment Variables

Create a `.env.local` file with the following variables:

```
# OpenAI (server-side only)
OPENAI_API_KEY=your_openai_api_key

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

- Create a Clerk account at [Clerk.com](https://clerk.com)
- Create a new application
- Copy your Publishable and Secret keys into `.env.local`

5. Configure OpenAI (Required for AI story generation)

- Create an OpenAI account at [OpenAI](https://platform.openai.com/)
- Navigate to the API keys section in your account
- Generate a new API key
- Add the key to `.env.local` as `OPENAI_API_KEY=your_key_here` (server-side only for security)
- The application will use a fallback mock story generator if no API key is provided, but for the
  full experience, an OpenAI API key is required

## Development Scripts

- `npm run dev`: Start development server
- `npm run build`: Build production application
- `npm run start`: Start production server
- `npm run test`: Run tests
- `npm run lint`: Run ESLint
- `npm run type:check`: Run TypeScript type checking
- `npm run validate`: Run comprehensive project validation

## Testing

- Unit tests with Vitest
- React component testing with Testing Library
- Run tests with `npm test`
- View test coverage with `npm run test:coverage`

## Security and Performance

- Trufflehog for secrets scanning
- Clerk for secure authentication
- Vercel Speed Insights
- Vercel Analytics

## OpenAI Integration

The application uses OpenAI's GPT models to generate personalized stories based on user input. The
integration works as follows:

1. User inputs (child name, interests, theme, etc.) are collected through the StoryWizard component
2. The data is sent to the `/api/generateStory` endpoint
3. The API route uses the OpenAI SDK to generate a unique story
4. The generated story is returned to the client and displayed to the user

For development and testing without incurring API costs:

- The application includes a fallback mock story generator
- Set `NEXT_PUBLIC_OPENAI_API_KEY=mock` to always use the mock generator

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
