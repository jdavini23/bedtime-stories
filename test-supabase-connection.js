// Test script to verify Supabase connection
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Create a Supabase client with the URL and anon key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function testConnection() {
  console.log('Testing Supabase connection...');

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Error: Supabase URL or Anon Key is missing in environment variables');
    return;
  }

  console.log(`Supabase URL: ${supabaseUrl}`);
  console.log(
    `Anon Key: ${supabaseAnonKey.substring(0, 5)}...${supabaseAnonKey.substring(supabaseAnonKey.length - 5)}`
  );

  try {
    // Create client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Test basic connection
    const { data, error } = await supabase.from('users').select('*').limit(5);

    if (error) {
      console.error('Error querying users:', error);
    } else {
      console.log('Successfully connected to Supabase!');
      console.log(`Retrieved ${data.length} users`);
    }

    // Test RLS on stories table
    console.log('\nTesting Row Level Security (RLS) on stories table...');
    const { data: storiesData, error: storiesError } = await supabase
      .from('stories')
      .select('*')
      .limit(5);

    if (storiesError) {
      console.log('RLS working correctly: Access denied to stories table without authentication.');
      console.log('Error:', storiesError.message);
    } else {
      console.warn(
        '⚠️ RLS may not be properly configured: Retrieved stories without authentication!'
      );
      console.log(`Retrieved ${storiesData.length} stories without authentication.`);
    }
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
  }
}

// Run the test
testConnection();
