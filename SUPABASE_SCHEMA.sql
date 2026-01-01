-- Run this in your Supabase SQL Editor to allow public/anonymous edits
-- WARNING: This allows ANYONE with your API key to modify data.
-- Since you are using a secret key to hide the UI, this is "good enough" for a personal project,
-- but NOT recommended for production apps with multiple users.

-- 1. Drop existing policies to avoid conflicts
drop policy if exists "Authenticated users can manage projects." on projects;
drop policy if exists "Public projects are viewable by everyone." on projects;

-- 2. Allow Public Read Access (Already existed, but good to ensure)
create policy "Public projects are viewable by everyone."
  on projects for select
  using ( true );

-- 3. Allow Public Write Access (Insert, Update, Delete)
create policy "Public users can manage projects."
  on projects for all
  using ( true );

-- 4. Enable RLS (It must be enabled for policies to work, even if the policy is 'true')
alter table projects enable row level security;
