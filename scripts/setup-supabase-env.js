/**
 * Script to set up Supabase environment variables
 * 
 * This script helps set up the necessary Supabase environment variables
 * for both local development and production deployment.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Paths
const rootDir = path.resolve(__dirname, '..');
const envFilePath = path.join(rootDir, '.env');
const envExamplePath = path.join(rootDir, '.env.example');

/**
 * Prompt user for input
 * @param {string} question - Question to ask the user
 * @returns {Promise<string>} User input
 */
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

/**
 * Create or update environment file
 * @param {Object} envVars - Environment variables object
 */
function updateEnvFile(envVars) {
  let envContent = '';
  
  // Convert env vars object to string
  Object.keys(envVars).forEach(key => {
    envContent += `${key}=${envVars[key]}\n`;
  });
  
  // Write to .env file
  fs.writeFileSync(envFilePath, envContent);
  console.log(`\n✅ Environment variables saved to ${envFilePath}`);
}

/**
 * Create example environment file
 * @param {Object} envVars - Environment variables object
 */
function createEnvExample(envVars) {
  let exampleContent = '';
  
  // Convert env vars object to string with placeholder values
  Object.keys(envVars).forEach(key => {
    exampleContent += `${key}=your_${key.toLowerCase()}_here\n`;
  });
  
  // Write to .env.example file
  fs.writeFileSync(envExamplePath, exampleContent);
  console.log(`✅ Example environment file created at ${envExamplePath}`);
}

/**
 * Set up environment variables for Vercel
 * @param {Object} envVars - Environment variables object
 */
async function setupVercelEnv(envVars) {
  try {
    console.log('\n🔄 Setting up environment variables in Vercel...');
    
    // Check if vercel CLI is installed
    try {
      execSync('vercel --version', { stdio: 'ignore' });
    } catch (error) {
      console.error('❌ Vercel CLI not found. Please install it with: npm i -g vercel');
      return false;
    }

    // Set each environment variable in Vercel
    for (const [key, value] of Object.entries(envVars)) {
      console.log(`Setting ${key}...`);
      execSync(`vercel env add ${key}`, { stdio: 'inherit' });
    }

    console.log('✅ Vercel environment variables set up successfully');
    return true;
  } catch (error) {
    console.error('❌ Error setting up Vercel environment variables:', error.message);
    return false;
  }
}

/**
 * Main function to run the script
 */
async function main() {
  console.log('🔐 Supabase Environment Setup\n');
  
  let envVars = {};
  
  // Check if .env file exists and load its values
  if (fs.existsSync(envFilePath)) {
    console.log('📄 Existing .env file found. Loading values...');
    const envFile = fs.readFileSync(envFilePath, 'utf8');
    
    envFile.split('\n').forEach(line => {
      if (line.trim() && !line.startsWith('#')) {
        const [key, ...valueParts] = line.split('=');
        const value = valueParts.join('=');
        if (key && value) {
          envVars[key.trim()] = value.trim();
        }
      }
    });
  }
  
  console.log('Please enter your Supabase configuration details:');
  
  // Prompt for Supabase URL
  const supabaseUrl = await prompt('Supabase URL (https://your-project.supabase.co): ');
  if (supabaseUrl) {
    envVars['NEXT_PUBLIC_SUPABASE_URL'] = supabaseUrl;
  } else if (!envVars['NEXT_PUBLIC_SUPABASE_URL']) {
    console.error('❌ Supabase URL is required');
    rl.close();
    return;
  }
  
  // Prompt for Supabase Anon Key
  const supabaseAnonKey = await prompt('Supabase Anon Key: ');
  if (supabaseAnonKey) {
    envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY'] = supabaseAnonKey;
  } else if (!envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY']) {
    console.error('❌ Supabase Anon Key is required');
    rl.close();
    return;
  }
  
  // Prompt for Service Role Key (optional)
  const serviceRoleKey = await prompt('Supabase Service Role Key (optional, for admin functions): ');
  if (serviceRoleKey) {
    envVars['SUPABASE_SERVICE_ROLE_KEY'] = serviceRoleKey;
  }

  // Update/create .env file
  updateEnvFile(envVars);
  
  // Create .env.example if it doesn't exist
  if (!fs.existsSync(envExamplePath)) {
    createEnvExample(envVars);
  }
  
  // Ask if the user wants to set up Vercel environment
  const setupVercel = await prompt('Do you want to set up these environment variables in Vercel? (y/n): ');
  if (setupVercel.toLowerCase() === 'y') {
    await setupVercelEnv(envVars);
  }
  
  console.log('\n🎉 Supabase environment setup complete!');
  rl.close();
}

// Run the script
main().catch(err => {
  console.error('❌ Error:', err);
  rl.close();
  process.exit(1);
});