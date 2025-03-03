require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Create a Supabase client with the URL and anon key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function testTablesAndRls() {
  console.log('Testing Supabase Tables and RLS Policies...');

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

    console.log('\n--- Checking Table Existence ---');

    // Check users table
    const { data: usersData, error: usersError } = await supabasePublic
      .from('users')
      .select('count(*)', { count: 'exact', head: true });

    if (usersError && usersError.code === '42P01') {
      console.log('❌ users table: Missing');
    } else if (usersError) {
      console.log('✅ users table: Exists (Access denied due to RLS)');
      console.log(`   Error: ${usersError.message}`);
    } else {
      console.log('✅ users table: Exists');
      console.log(`   Count: ${usersData[0].count}`);
    }

    // Check stories table
    const { data: storiesData, error: storiesError } = await supabasePublic
      .from('stories')
      .select('count(*)', { count: 'exact', head: true });

    if (storiesError && storiesError.code === '42P01') {
      console.log('❌ stories table: Missing');
    } else if (storiesError) {
      console.log('✅ stories table: Exists (Access denied due to RLS)');
      console.log(`   Error: ${storiesError.message}`);
    } else {
      console.log('✅ stories table: Exists');
      console.log(`   Count: ${storiesData[0].count}`);
    }

    // Check preferences table
    const { data: preferencesData, error: preferencesError } = await supabasePublic
      .from('preferences')
      .select('count(*)', { count: 'exact', head: true });

    if (preferencesError && preferencesError.code === '42P01') {
      console.log('❌ preferences table: Missing');
    } else if (preferencesError) {
      console.log('✅ preferences table: Exists (Access denied due to RLS)');
      console.log(`   Error: ${preferencesError.message}`);
    } else {
      console.log('✅ preferences table: Exists');
      console.log(`   Count: ${preferencesData[0].count}`);
    }

    // Check subscriptions table
    const { data: subscriptionsData, error: subscriptionsError } = await supabasePublic
      .from('subscriptions')
      .select('count(*)', { count: 'exact', head: true });

    if (subscriptionsError && subscriptionsError.code === '42P01') {
      console.log('❌ subscriptions table: Missing');
    } else if (subscriptionsError) {
      console.log('✅ subscriptions table: Exists (Access denied due to RLS)');
      console.log(`   Error: ${subscriptionsError.message}`);
    } else {
      console.log('✅ subscriptions table: Exists');
      console.log(`   Count: ${subscriptionsData[0].count}`);
    }

    console.log('\n--- Testing RLS Policies ---');

    // Test access to users table
    const { data: usersSelectData, error: usersSelectError } = await supabasePublic
      .from('users')
      .select('*')
      .limit(5);

    if (usersSelectError) {
      console.log('✅ RLS working for users table: Access denied without authentication');
      console.log(`   Error: ${usersSelectError.message}`);
    } else {
      console.warn('⚠️ RLS may not be properly configured for users table');
      console.log(`   Retrieved ${usersSelectData.length} users without authentication`);
    }

    // Test access to stories table
    const { data: storiesSelectData, error: storiesSelectError } = await supabasePublic
      .from('stories')
      .select('*')
      .limit(5);

    if (storiesSelectError) {
      console.log('✅ RLS working for stories table: Access denied without authentication');
      console.log(`   Error: ${storiesSelectError.message}`);
    } else {
      console.warn('⚠️ RLS may not be properly configured for stories table');
      console.log(`   Retrieved ${storiesSelectData.length} stories without authentication`);
    }

    console.log('\n--- Summary ---');
    if (
      (usersError && usersError.code === '42P01') ||
      (storiesError && storiesError.code === '42P01') ||
      (preferencesError && preferencesError.code === '42P01') ||
      (subscriptionsError && subscriptionsError.code === '42P01')
    ) {
      console.log('❌ Some tables are missing. Please run the supabase-schema.sql script first.');
    } else if (!usersSelectError || !storiesSelectError) {
      console.log('⚠️ Tables exist but RLS policies may not be properly configured.');
      console.log('   Please run the fix-rls-policies.sql script to secure your database.');
    } else {
      console.log('✅ All tables exist and RLS policies are properly configured!');
    }
  } catch (error) {
    console.error('Error testing tables and RLS:', error);
  }
}

// Run the test
testTablesAndRls();
