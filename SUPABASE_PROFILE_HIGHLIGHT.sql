-- Add about_headline_highlight column to profile table
alter table profile
add column if not exists about_headline_highlight text default 'Essential';
