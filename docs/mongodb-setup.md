# Setting Up MongoDB for the Todo App

This guide will help you set up MongoDB for the Todo app development environment.

## Option 1: Using Docker (Recommended)

The easiest way to run MongoDB is using the Docker setup included in this project:

1. Make sure Docker and Docker Compose are installed on your machine
2. Run `npm run docker:dev` from the project root
3. The MongoDB instance will be available at `mongodb://localhost:27017/todoapp`

## Option 2: Installing MongoDB Locally

### Installation

#### For Windows:

1. Download the MongoDB Community Server from the [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Run the installer and follow the installation wizard
3. Choose "Complete" setup type
4. Install MongoDB Compass (the GUI) if desired
5. Complete the installation

#### For macOS:

Using Homebrew:
```bash
brew tap mongodb/brew
brew install mongodb-community
```

#### For Linux (Ubuntu):

```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create a list file for MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update package lists
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org
```

### Starting MongoDB

#### Windows:
MongoDB should be installed as a service and start automatically.

#### macOS:
```bash
brew services start mongodb-community
```

#### Linux:
```bash
sudo systemctl start mongod
sudo systemctl enable mongod  # to start on boot
```

### Verifying Installation

You can check if MongoDB is running with:

```bash
# For macOS/Linux
mongo --eval "db.version()"

# For Windows (in Command Prompt)
"C:\Program Files\MongoDB\Server\6.0\bin\mongo.exe" --eval "db.version()"
```

### Creating the Database

MongoDB creates databases and collections automatically when you first use them, so no manual creation is needed.

## Option 3: Using MongoDB Atlas (Cloud Hosted)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a new project and cluster (the free tier is sufficient)
3. In the Security tab, create a database user with read/write privileges
4. In the Network Access tab, add your IP address or allow access from anywhere (for development)
5. In the Database tab, click "Connect" on your cluster
6. Choose "Connect Your Application"
7. Copy the connection string and replace `<password>` with your database user's password
8. Update your `.env` file with this connection string:
   ```
   MONGODB_URI=mongodb+srv://username:<password>@cluster0.mongodb.net/todoapp?retryWrites=true&w=majority
   ```

## Updating Your Environment Variables

Ensure that your MongoDB connection string is correctly set in:

1. `.env` file in your `backend` directory
2. If using Docker, check the `docker-compose.yml` file to ensure the right connection string is set for the backend service

For local development without Docker, use:
```
MONGODB_URI=mongodb://localhost:27017/todoapp
```

## Troubleshooting

- **Connection refused**: Ensure MongoDB service is running
- **Authentication failed**: Check username/password and database name
- **Network connection issues**: Verify firewall settings and network access
- **Permission errors**: Ensure correct user privileges for the database 