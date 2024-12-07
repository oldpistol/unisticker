# UniSticker Frontend

Next.js frontend for the UTM Vehicle Sticker Application System with integrated chat assistance.

## Features

- Modern UI built with Next.js and TypeScript
- Real-time chat assistance using WebSocket
- Responsive design for all devices
- Secure authentication integration with backend

## Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Backend server running (Laravel)
- Chat service running (Python WebSocket)

## Setup

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Configure environment variables:
- Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
- Update the following variables:
  - `NEXT_PUBLIC_API_URL`: Backend API URL (default: 'http://localhost:8000/api')
  - `NEXT_PUBLIC_WS_URL`: WebSocket URL (default: 'ws://localhost:8080')

3. Run development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run type-check`: Run TypeScript compiler check

## Project Structure

```
frontend/
├── src/
│   ├── app/          # App router pages
│   ├── components/   # Reusable components
│   ├── lib/          # Utilities and helpers
│   └── styles/       # Global styles
├── public/           # Static files
└── .env.example      # Environment variables template
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NEXT_PUBLIC_API_URL | Backend API endpoint | http://localhost:8000/api |
| NEXT_PUBLIC_WS_URL | WebSocket server URL | ws://localhost:8080 |

## Contributing

1. Follow the existing code style
2. Write clear commit messages
3. Test your changes before submitting

## Related Services

- Backend API: Laravel service at `http://localhost:8000`
- Chat Service: Python WebSocket at `ws://localhost:8080`
