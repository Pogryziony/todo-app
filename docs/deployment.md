# Deployment Guide for Todo App

This guide explains how to deploy the Todo App using GitHub Pages for the frontend and a self-hosted server for the backend.

## Prerequisites

- GitHub account
- Server for backend deployment (VPS, dedicated server, etc.)
- Docker and Docker Compose installed on your server
- MongoDB instance (self-hosted or MongoDB Atlas)
- Domain name (optional but recommended)

## Setting up GitHub Repository Secrets

For CI/CD to work correctly, add these secrets to your GitHub repository:

1. Go to your repository → Settings → Secrets and variables → Actions
2. Add the following secrets:

### For Frontend Deployment
- `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
- `BACKEND_API_URL`: URL to your backend API (e.g., `https://api.yourdomain.com/api`)

### For Backend Deployment
- `DOCKER_HUB_USERNAME`: Your Docker Hub username
- `DOCKER_HUB_TOKEN`: Your Docker Hub access token
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secure random string for JWT token generation
- `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret
- `GOOGLE_CALLBACK_URL`: OAuth callback URL (e.g., `https://api.yourdomain.com/api/auth/google/callback`)
- `FRONTEND_URL`: URL to your frontend (e.g., `https://yourusername.github.io/todo-app`)

## Frontend Deployment (GitHub Pages)

The frontend will be automatically deployed to GitHub Pages when you push to the main branch. GitHub Actions handles this process using the workflow defined in `.github/workflows/frontend.yml`.

### Manual Deployment Steps

If you want to deploy manually:

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy to GitHub Pages:
   ```bash
   npm run deploy
   ```

### Custom Domain (Optional)

To use a custom domain with GitHub Pages:

1. Add your domain in the repository settings → Pages
2. Create a CNAME record pointing to `yourusername.github.io`
3. Add a file named `CNAME` in the `frontend/public` directory with your domain

## Backend Deployment (Self-hosted with Docker)

The backend is deployed using a self-hosted GitHub Actions runner on your server.

### Setting up a Self-hosted Runner

1. On your GitHub repository, go to Settings → Actions → Runners
2. Click "New self-hosted runner"
3. Follow the instructions to download and configure the runner on your server
4. Make sure the runner is online and available

### Docker Hub Setup

1. Create an account on [Docker Hub](https://hub.docker.com/)
2. Create a new repository for your backend image (e.g., `todo-app-backend`)
3. Generate an access token in Account Settings → Security

### Server Configuration

1. SSH into your server
2. Install Docker and Docker Compose
3. Create a directory for the application:
   ```bash
   mkdir -p /opt/todo-app
   ```

4. Set up a reverse proxy (Nginx) to handle SSL and routing:

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name api.yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

5. Obtain SSL certificates using Let's Encrypt:
   ```bash
   certbot --nginx -d api.yourdomain.com
   ```

### Automatic Deployment

With the GitHub Actions workflow in place, every push to the main branch will:

1. Build a new Docker image
2. Push it to Docker Hub
3. Pull and run the image on your server through the self-hosted runner

## Database Deployment

### Option 1: MongoDB Atlas (Recommended for Small Projects)

1. Follow the [MongoDB Atlas setup guide](mongodb-setup.md#option-3-using-mongodb-atlas-cloud-hosted)
2. Ensure your MongoDB Atlas connection string is added as a GitHub secret

### Option 2: Self-hosted MongoDB

1. Set up MongoDB on your server with authentication
2. Configure proper backup procedures
3. Update your backend's .env file with the connection details

## Domain and DNS Configuration

1. Purchase a domain from a provider (Namecheap, GoDaddy, etc.)
2. Set up DNS records:
   - Frontend: `A` record pointing to GitHub Pages IP or `CNAME` to `yourusername.github.io`
   - Backend: `A` record pointing to your server's IP address

## Monitoring and Maintenance

1. Set up basic monitoring for your server using a tool like Uptime Robot
2. Regularly update your dependencies with `npm audit fix`
3. Check your MongoDB Atlas or self-hosted MongoDB for database performance
4. Set up automatic backups for your database

## Troubleshooting

- Check GitHub Actions logs for deployment errors
- Verify Docker container logs: `docker logs todo-app-backend`
- Check Nginx error logs: `tail -f /var/log/nginx/error.log`
- Verify MongoDB connectivity from your server 