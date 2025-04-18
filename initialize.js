#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to create .env files
function createEnvFiles() {
  console.log('📝 Creating environment files...');
  
  // Backend .env
  if (!fs.existsSync(path.join(__dirname, 'backend', '.env'))) {
    fs.copyFileSync(
      path.join(__dirname, 'backend', '.env.example'),
      path.join(__dirname, 'backend', '.env')
    );
    console.log('✅ Created backend/.env from template');
  } else {
    console.log('ℹ️ backend/.env already exists, skipping');
  }
  
  // Frontend .env
  if (!fs.existsSync(path.join(__dirname, 'frontend', '.env'))) {
    const frontendEnv = `VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=placeholder_client_id
`;
    fs.writeFileSync(path.join(__dirname, 'frontend', '.env'), frontendEnv);
    console.log('✅ Created frontend/.env');
  } else {
    console.log('ℹ️ frontend/.env already exists, skipping');
  }
}

// Function to install dependencies
function installDependencies() {
  console.log('📦 Installing dependencies...');
  
  // Root dependencies
  console.log('Installing root dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  // Frontend dependencies
  console.log('Installing frontend dependencies...');
  execSync('cd frontend && npm install', { stdio: 'inherit' });
  
  // Backend dependencies
  console.log('Installing backend dependencies...');
  execSync('cd backend && npm install', { stdio: 'inherit' });
  
  console.log('✅ All dependencies installed');
}

// Function to check Docker installation
function checkDocker() {
  try {
    execSync('docker --version', { stdio: 'ignore' });
    execSync('docker-compose --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Main function
async function main() {
  console.log('🚀 Initializing Todo App...');
  
  createEnvFiles();
  
  rl.question('Do you want to install dependencies now? (y/n) ', (answer) => {
    if (answer.toLowerCase() === 'y') {
      installDependencies();
      
      const dockerInstalled = checkDocker();
      if (dockerInstalled) {
        console.log('🐳 Docker detected! You can run the app using Docker.');
        console.log('Run: npm run docker:dev');
      } else {
        console.log('⚠️ Docker not detected. You can still run the app without Docker.');
        console.log('Run: npm run dev');
        console.log('For MongoDB, see docs/mongodb-setup.md');
      }
      
      console.log('\n📝 Next steps:');
      console.log('1. Set up Google OAuth credentials (see docs/google-oauth-setup.md)');
      console.log('2. Configure MongoDB (see docs/mongodb-setup.md)');
      console.log('3. Start the application with npm run dev or npm run docker:dev');
    } else {
      console.log('\n📝 Next steps:');
      console.log('1. Run npm run install:all to install dependencies');
      console.log('2. Set up Google OAuth credentials (see docs/google-oauth-setup.md)');
      console.log('3. Configure MongoDB (see docs/mongodb-setup.md)');
      console.log('4. Start the application with npm run dev or npm run docker:dev');
    }
    
    rl.close();
  });
}

// Run the main function
main().catch(error => {
  console.error('Error during initialization:', error);
  process.exit(1);
}); 