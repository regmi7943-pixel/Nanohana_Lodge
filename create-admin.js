const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://qyzivalbhjnqezqbgrsj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5eml2YWxiaGpucWV6cWJncnNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NTY5MjIsImV4cCI6MjA5NjAzMjkyMn0.wVs-QZCq9mJ-02xh_ipTbGj0ScWA8ikQ6bzrZCRIaGs'
);

async function main() {
  const { data, error } = await supabase.auth.signUp({
    email: 'nanohana@admin.com',
    password: 'nanohanaadmin2026',
    options: {
      data: { full_name: 'Nanohana Admin' }
    }
  });

  if (error) {
    console.error('Signup error:', error.message);
  } else {
    console.log('User created successfully!');
    console.log('User ID:', data.user?.id);
    console.log('Email:', data.user?.email);
  }
}

main();
