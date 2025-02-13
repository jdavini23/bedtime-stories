# Bedtime Story Magic

## Overview

Bedtime Story Magic is an AI-powered application that generates personalized, enchanting bedtime stories for children. Using advanced AI technology, it creates unique stories tailored to a child's name, interests, and preferred theme.

## Features

- AI-generated personalized stories
- Multiple story themes (Adventure, Fantasy, Educational, etc.)
- Customizable story inputs
- Engaging and child-friendly design
- Responsive web application

## Technologies

- Next.js 14
- TypeScript
- Tailwind CSS
- Framer Motion
- OpenAI GPT
- Vercel KV (Caching)

## Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API Key (optional)

## Setup and Installation

1. Clone the repository

```bash
git clone https://github.com/jdavini23/bedtime-stories.git
cd bedtime-stories
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp .env.example .env.local
# Add your OpenAI API Key in .env.local
```

4. Run the development server

```bash
npm run dev
```

## Deployment on Vercel

### Prerequisites
- Vercel Account
- Optional: OpenAI API Key

### Environment Variables
1. Copy `.env.example` to `.env.local`
2. Fill in the required environment variables:
   - `OPENAI_API_KEY`: OpenAI API key (optional)
   - `KV_REST_API_URL`: Vercel KV Redis URL
   - `KV_REST_API_TOKEN`: Vercel KV Redis Token

### Deployment Steps
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel Project Settings
3. Deploy the project

### Local Development
```bash
npm install
npm run dev
```

### Fallback Story Generation
If no OpenAI API key is provided, the app will generate mock stories.

## Customization

- Modify themes in `src/types/story.ts`
- Adjust AI prompts in `src/app/api/generateStory/route.ts`
- Update interests in `src/components/story/StoryForm.tsx`

## Contributing

Contributions are welcome! Please check our [Contributing Guidelines](CONTRIBUTING.md).

## License

This project is licensed under the MIT License.

## Support

Star this repository if you find it helpful! For issues, please open a GitHub issue.
