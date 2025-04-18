# Setting Up Google OAuth Credentials

This guide will help you set up Google OAuth credentials for the Todo App with Google Calendar integration.

## Prerequisites

1. A Google account
2. Access to the [Google Cloud Console](https://console.cloud.google.com/)

## Steps

### 1. Create a New Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top of the page
3. Click "New Project"
4. Enter a name for your project (e.g., "Todo App")
5. Click "Create"

### 2. Enable Required APIs

1. In your project, go to "APIs & Services" > "Library"
2. Search for and enable the following APIs:
   - Google Calendar API
   - Google People API

### 3. Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Select "External" as the user type (or "Internal" if you're using Google Workspace)
3. Click "Create"
4. Fill in the required information:
   - App name: "Todo App"
   - User support email: Your email
   - Developer contact information: Your email
5. Click "Save and Continue"
6. Add the following scopes:
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`
   - `https://www.googleapis.com/auth/calendar`
7. Click "Save and Continue"
8. Add test users if you're in testing mode
9. Click "Save and Continue"
10. Review your settings and click "Back to Dashboard"

### 4. Create OAuth Client ID

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Select "Web application" as the application type
4. Name: "Todo App Web Client"
5. Add Authorized JavaScript origins:
   - Development: `http://localhost:5173`
   - Production: `https://[your-github-username].github.io`
6. Add Authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/google/callback`
   - Production: `https://[your-backend-domain]/api/auth/google/callback`
7. Click "Create"
8. Note the Client ID and Client Secret

### 5. Configure Your Application

1. Create a `.env` file in your `backend` directory with the following:
   ```
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
   ```

2. Create a `.env` file in your `frontend` directory with:
   ```
   VITE_GOOGLE_CLIENT_ID=your_client_id
   VITE_API_URL=http://localhost:3000/api
   ```

## Testing Your Setup

1. Start your development servers
2. Visit your frontend application
3. Try to log in with Google
4. Verify that you can authorize your app to access your Google Calendar

## Troubleshooting

- If you get "redirect_uri_mismatch" errors, double-check that your callback URLs match exactly
- Ensure the APIs are properly enabled
- Check your API quotas if you hit limits
- Make sure your OAuth consent screen is configured properly 