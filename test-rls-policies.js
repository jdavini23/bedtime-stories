require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Create a Supabase client with the URL and anon key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function testRlsPolicies() {
  console.log('Testing Supabase RLS Policies...');

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Error: Supabase URL or Anon Key is missing in environment variables');
    return;
  }

  console.log(`Supabase URL: ${supabaseUrl}`);
  console.log(
    `Anon Key: ${supabaseAnonKey.substring(0, 5)}...${supabaseAnonKey.substring(supabaseAnonKey.length - 5)}`
  );

  try {
    // Create an unauthenticated client (public access)
    const supabasePublic = createClient(supabaseUrl, supabaseAnonKey);

    console.log('\n--- Testing Unauthenticated Access ---');

    // Test access to users table
    console.log('\nTesting access to users table as unauthenticated user:');
    const { data: usersData, error: usersError } = await supabasePublic
      .from('users')
      .select('*')
      .limit(5);

    if (usersError) {
      console.log('✅ RLS working correctly: Access denied to users table without authentication.');
      console.log(`Error: ${usersError.message}`);
    } else {
      console.warn(
        '⚠️ RLS may not be properly configured: Retrieved users without authentication!'
      );
      console.log(`Retrieved ${usersData.length} users without authentication.`);
    }

    // Test access to stories table
    console.log('\nTesting access to stories table as unauthenticated user:');
    const { data: storiesData, error: storiesError } = await supabasePublic
      .from('stories')
      .select('*')
      .limit(5);

    if (storiesError) {
      console.log(
        '✅ RLS working correctly: Access denied to stories table without authentication.'
      );
      console.log(`Error: ${storiesError.message}`);
    } else {
      console.warn(
        '⚠️ RLS may not be properly configured: Retrieved stories without authentication!'
      );
      console.log(`Retrieved ${storiesData.length} stories without authentication.`);
    }

    // Test access to preferences table
    console.log('\nTesting access to preferences table as unauthenticated user:');
    const { data: preferencesData, error: preferencesError } = await supabasePublic
      .from('preferences')
      .select('*')
      .limit(5);

    if (preferencesError) {
      console.log(
        '✅ RLS working correctly: Access denied to preferences table without authentication.'
      );
      console.log(`Error: ${preferencesError.message}`);
    } else {
      console.warn(
        '⚠️ RLS may not be properly configured: Retrieved preferences without authentication!'
      );
      console.log(`Retrieved ${preferencesData.length} preferences without authentication.`);
    }

    // Test access to subscriptions table
    console.log('\nTesting access to subscriptions table as unauthenticated user:');
    const { data: subscriptionsData, error: subscriptionsError } = await supabasePublic
      .from('subscriptions')
      .select('*')
      .limit(5);

    if (subscriptionsError) {
      console.log(
        '✅ RLS working correctly: Access denied to subscriptions table without authentication.'
      );
      console.log(`Error: ${subscriptionsError.message}`);
    } else {
      console.warn(
        '⚠️ RLS may not be properly configured: Retrieved subscriptions without authentication!'
      );
      console.log(`Retrieved ${subscriptionsData.length} subscriptions without authentication.`);
    }

    // Test with service role key if available
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.log('\n--- Testing Service Role Access ---');
      const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY);

      // Test access to users table with service role
      console.log('\nTesting access to users table with service role:');
      const { data: adminUsersData, error: adminUsersError } = await supabaseAdmin
        .from('users')
        .select('*')
        .limit(5);

      if (adminUsersError) {
        console.error('❌ Error accessing users with service role:', adminUsersError);
      } else {
        console.log(
          `✅ Successfully accessed users with service role. Retrieved ${adminUsersData.length} users.`
        );
      }

      // Test access to stories table with service role
      console.log('\nTesting access to stories table with service role:');
      const { data: adminStoriesData, error: adminStoriesError } = await supabaseAdmin
        .from('stories')
        .select('*')
        .limit(5);

      if (adminStoriesError) {
        console.error('❌ Error accessing stories with service role:', adminStoriesError);
      } else {
        console.log(
          `✅ Successfully accessed stories with service role. Retrieved ${adminStoriesData.length} stories.`
        );
      }
    } else {
      console.log('\nSUPABASE_SERVICE_ROLE_KEY not provided. Skipping service role tests.');
    }

    console.log('\n--- Summary ---');
    console.log('To properly secure your database:');
    console.log('1. Make sure RLS is enabled on all tables');
    console.log('2. Create policies that restrict access based on authentication status');
    console.log('3. Use auth.uid() to match the authenticated user with the appropriate records');
    console.log('4. Test your policies with both authenticated and unauthenticated users');
    console.log('5. Consider adding service role policies for admin operations');
  } catch (error) {
    console.error('Error testing RLS policies:', error);
  }
}

// Run the test
testRlsPolicies();
