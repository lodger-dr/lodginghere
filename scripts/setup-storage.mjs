import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

function getEnvVar(name) {
  const match = envContent.match(new RegExp(`^${name}=["']?([^"'\r\n]+)["']?`, 'm'));
  return match ? match[1] : null;
}

const url = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const serviceKey = getEnvVar('SUPABASE_SERVICE_ROLE_KEY');

if (!url || !serviceKey) {
  console.error('Missing Supabase URL or Service Role Key in .env.local');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

async function run() {
  console.log('Connecting to Supabase at:', url);
  const { data: buckets, error: listErr } = await supabase.storage.listBuckets();

  if (listErr) {
    console.error('Failed to list buckets:', listErr);
    process.exit(1);
  }

  console.log('Current buckets:', buckets.map(b => ({ id: b.id, name: b.name, public: b.public })));

  const lodgeBucket = buckets.find(b => b.id === 'lodge-images');
  if (!lodgeBucket) {
    console.log('Creating bucket "lodge-images" with public: true...');
    const { data, error } = await supabase.storage.createBucket('lodge-images', {
      public: true,
      fileSizeLimit: 10485760, // 10MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
    });

    if (error) {
      console.error('Error creating bucket:', error);
      process.exit(1);
    }
    console.log('Successfully created bucket "lodge-images":', data);
  } else {
    console.log('Bucket "lodge-images" already exists. Ensuring it is public...');
    const { data, error } = await supabase.storage.updateBucket('lodge-images', {
      public: true,
      fileSizeLimit: 10485760,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
    });

    if (error) {
      console.error('Error updating bucket:', error);
      process.exit(1);
    }
    console.log('Successfully updated bucket "lodge-images":', data);
  }

  const { data: finalBuckets } = await supabase.storage.listBuckets();
  console.log('Final buckets list:', finalBuckets.map(b => ({ id: b.id, name: b.name, public: b.public })));
}

run().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
