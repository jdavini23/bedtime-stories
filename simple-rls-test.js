require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Create a Supabase client with the URL and anon key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function testRls() {
  console.log('Simple RLS Test...');

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Error: Supabase URL or Anon Key is missing in environment variables');
    return;
  }

  try {
    // Create an unauthenticated client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Test insert into users table (should be denied)
    console.log('\nTesting insert into users table:');
    const { data: insertData, error: insertError } = await supabase
      .from('users')
      .insert([{ auth_id: 'test-auth-id', email: 'test@example.com' }]);

    if (insertError) {
      console.log('✅ RLS working: Cannot insert into users table');
      console.log(`Error: ${insertError.message}`);
    } else {
      console.warn('⚠️ RLS not working: Inserted into users table without authentication!');
    }

    // Test select from users table (should be denied)
    console.log('\nTesting select from users table:');
    const { data: selectData, error: selectError } = await supabase.from('users').select('*');

    if (selectError) {
      console.log('✅ RLS working: Cannot select from users table');
      console.log(`Error: ${selectError.message}`);
    } else if (selectData.length === 0) {
      console.log('⚠️ RLS partially working: Empty result returned instead of permission denied');
    } else {
      console.warn('⚠️ RLS not working: Retrieved data from users table without authentication!');
    }

    // Test select from stories table (should be denied)
    console.log('\nTesting select from stories table:');
    const { data: storiesData, error: storiesError } = await supabase.from('stories').select('*');

    if (storiesError) {
      console.log('✅ RLS working: Cannot select from stories table');
      console.log(`Error: ${storiesError.message}`);
    } else if (storiesData.length === 0) {
      console.log('⚠️ RLS partially working: Empty result returned instead of permission denied');
    } else {
      console.warn('⚠️ RLS not working: Retrieved data from stories table without authentication!');
    }
  } catch (error) {
    console.error('Error testing RLS:', error);
  }
}

// Run the test
testRls();
