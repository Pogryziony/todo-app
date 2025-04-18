# Todo App with Google Integration

Modern Todo application built with Vue.js and Node.js, featuring Google authentication and Google Calendar synchronization.

## Features
- User authentication via Google OAuth
- Create, read, update, and delete tasks
- Task categorization and filtering
- Synchronize tasks with Google Calendar
- Responsive design for all devices

## Technology Stack
- **Frontend**: Vue.js 3, Vite, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB
- **Authentication**: Google OAuth 2.0
- **CI/CD**: GitHub Actions
- **Deployment**: GitHub Pages (frontend), Docker container (backend)

## Project Structure
- `/frontend` - Vue.js application
- `/backend` - Node.js API
- `/.github/workflows` - CI/CD configuration
- `/docs` - Documentation guides

## Documentation
Detailed guides are available in the `/docs` directory:
- [Google OAuth Setup](docs/google-oauth-setup.md) - How to set up Google OAuth credentials
- [MongoDB Setup](docs/mongodb-setup.md) - Setting up MongoDB locally or in the cloud
- [Deployment Guide](docs/deployment.md) - How to deploy the application to production

## Setup Instructions
1. Clone this repository
2. Set up environment variables (see [Google OAuth Setup](docs/google-oauth-setup.md))
3. Install dependencies for both frontend and backend
4. Run development servers

## Environment Variables
- Frontend (.env in frontend directory)
  - `VITE_API_URL` - Backend API URL
  - `VITE_GOOGLE_CLIENT_ID` - Google OAuth client ID

- Backend (.env in backend directory)
  - `PORT` - Server port (default: 3000)
  - `MONGODB_URI` - MongoDB connection string
  - `GOOGLE_CLIENT_ID` - Google OAuth client ID
  - `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
  - `JWT_SECRET` - Secret for JWT tokens
  - `FRONTEND_URL` - URL of the frontend application

## Development

### Option 1: Running with Docker (Recommended)
```bash
# Install dependencies (first time only)
npm run install:all

# Start all services with Docker Compose
npm run docker:dev
```

### Option 2: Running without Docker
```bash
# Install all dependencies
npm run install:all

# Start frontend and backend concurrently
npm run dev

# Or start them separately
npm run frontend:dev
npm run backend:dev
```

## Deployment
- Frontend is automatically deployed to GitHub Pages on push to main branch
- Backend is containerized with Docker and deployed to a self-hosted GitHub Actions runner
- See the [Deployment Guide](docs/deployment.md) for detailed instructions

## License
ISC