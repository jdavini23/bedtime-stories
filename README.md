# Bedtime Story Magic

## Overview

Bedtime Story Magic is an AI-powered application that generates personalized, enchanting bedtime
stories for children. Using advanced AI technology, it creates unique stories tailored to a child's
name, interests, and preferred theme.

## Features

- 🤖 AI-generated personalized stories
- 📚 Multiple story themes (Adventure, Fantasy, Educational, etc.)
- 🎨 Customizable story inputs
- 🔐 Secure Clerk authentication
- 📊 User preferences and story generation tracking
- 🌈 Engaging and child-friendly design
- 📱 Responsive web application

## Technologies

- Next.js 14
- TypeScript
- Tailwind CSS
- Framer Motion
- Clerk Authentication
- OpenAI GPT
- Vercel KV (Caching)
- Vercel Analytics & Speed Insights

## Prerequisites

- Node.js 20+
- npm 10+
- Clerk Account
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
cp .env.local.example .env.local
```

4. Configure Clerk

- Create a Clerk account at [Clerk.com](https://clerk.com)
- Create a new application
- Copy your Publishable and Secret keys into `.env.local`

5. (Optional) Configure OpenAI

- Get an OpenAI API key from [OpenAI](https://platform.openai.com/)
- Add the key to `.env.local`

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

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Your Name - [@your_twitter](https://twitter.com/your_twitter)

Project Link:
[https://github.com/jdavini23/bedtime-stories](https://github.com/jdavini23/bedtime-stories)
