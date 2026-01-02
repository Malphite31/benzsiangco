-- Add new columns to the profile table for the About section
alter table profile 
add column if not exists about_image_url text default '/hero-img.png',
add column if not exists about_headline text default 'WORKFLOW Essential',
add column if not exists about_subheadline text default 'I''m a video editor specializing in shortform content for brands and creators. I craft engaging edits that boost reach and audience retention.',
add column if not exists about_description_1 text default 'I am a creative video editor with a deep understanding of the short-form algorithm. I don''t just cut video; I engineer attention.',
add column if not exists about_description_2 text default 'My workflow combines the storytelling speed of Premiere Pro with the visual power of After Effects. From dynamic captions and seamless transitions to 3D camera tracking and motion graphics, I create content that stops the scroll and keeps viewers watching until the very last second.';
