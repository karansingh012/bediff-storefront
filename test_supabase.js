const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function test() {
  const email = "test@test.com"; // using an example
  // Try querying auth.users directly
  console.log("Trying to query auth.users...");
  // Note: PostgREST doesn't expose auth schema by default, but let's see
  
  // Actually, we can use supabase.auth.admin.listUsers()
  // Wait, let's look at supabase-js v2 methods
  console.log("Admin API methods:", Object.keys(supabase.auth.admin));
}

test();
