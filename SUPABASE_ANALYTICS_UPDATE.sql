
-- Update site_visits table to support basic geolocation and OS tracking
alter table site_visits 
add column if not exists os text,
add column if not exists browser text,
add column if not exists country text,
add column if not exists city text,
add column if not exists region text,
add column if not exists ip text;

-- Add comment for documentation
comment on column site_visits.os is 'Operating System parsed from User Agent';
comment on column site_visits.country is 'Country code or name from IP geolocation';
comment on column site_visits.city is 'City name from IP geolocation';

-- Allow deletion of analytics for Reset functionality
create policy "Public can delete visits" on site_visits for delete using (true);
create policy "Public can delete project views" on project_views for delete using (true);
