require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Create a Supabase client with the URL and anon key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function checkTables() {
  console.log('Checking Supabase tables...');

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Error: Supabase URL or Anon Key is missing in environment variables');
    return;
  }

  try {
    // Create client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Get list of tables
    const { data, error } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');

    if (error) {
      console.error('Error querying tables:', error);

      // Try a different approach
      console.log('Trying to check specific tables...');

      // Check users table
      const { error: usersError } = await supabase
        .from('users')
        .select('count(*)', { count: 'exact', head: true });
      console.log('users table:', usersError ? 'Error: ' + usersError.message : 'Exists');

      // Check stories table
      const { error: storiesError } = await supabase
        .from('stories')
        .select('count(*)', { count: 'exact', head: true });
      console.log('stories table:', storiesError ? 'Error: ' + storiesError.message : 'Exists');

      // Check preferences table
      const { error: preferencesError } = await supabase
        .from('preferences')
        .select('count(*)', { count: 'exact', head: true });
      console.log(
        'preferences table:',
        preferencesError ? 'Error: ' + preferencesError.message : 'Exists'
      );

      // Check subscriptions table
      const { error: subscriptionsError } = await supabase
        .from('subscriptions')
        .select('count(*)', { count: 'exact', head: true });
      console.log(
        'subscriptions table:',
        subscriptionsError ? 'Error: ' + subscriptionsError.message : 'Exists'
      );
    } else {
      console.log('Tables in the public schema:');
      data.forEach((table) => {
        console.log(`- ${table.tablename}`);
      });

      // Check for our specific tables
      const tableNames = data.map((t) => t.tablename);
      console.log('\nChecking for required tables:');
      console.log('users table:', tableNames.includes('users') ? 'Exists' : 'Missing');
      console.log('stories table:', tableNames.includes('stories') ? 'Exists' : 'Missing');
      console.log('preferences table:', tableNames.includes('preferences') ? 'Exists' : 'Missing');
      console.log(
        'subscriptions table:',
        tableNames.includes('subscriptions') ? 'Exists' : 'Missing'
      );
    }
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
  }
}

// Run the check
checkTables();
